import logging
from flask import jsonify
from pydantic import BaseModel, Field
from datetime import datetime

from models import db, Event, EventIntl, Tag as TagModel
from flask_openapi3 import Tag, APIBlueprint

event_bp = APIBlueprint("events", __name__, url_prefix="/events")
event_tag = Tag(name="events", description="Operations related to events")

logger = logging.getLogger(__name__)


class EventQuery(BaseModel):
    tags: str | None = Field(default=None, description="Comma-separated list of tags")
    name: str | None = Field(None, description="Filter by event name")
    org: str | None = Field(None, description="Filter by organization")
    online: bool | None = Field(None, description="Online (true) or in-person (false)")
    price_type: str | None = Field(None, enum=["free", "paid"])
    price_min: float | None = Field(None)
    price_max: float | None = Field(None)
    address: str | None = Field(None, description="Filter by address")
    date_start_range: str | None = Field(None)
    date_end_range: str | None = Field(None)
    date_from: str | None = Field(None)

    @property
    def parsed_tags(self) -> list[str] | None:
        if self.tags:
            return [t.strip() for t in self.tags.split(",") if t.strip()]
        return None


class IntlData(BaseModel):
    event_edition: str
    cost: str
    banner_link: str
    short_description: str


class EventIn(BaseModel):
    organization_name: str
    event_name: str
    start_datetime: datetime
    end_datetime: datetime
    address: str | None = None
    maps_link: str | None = None
    online: bool
    event_link: str | None = None
    tags: list[str] = []
    intl: dict[str, IntlData] = {}


def create_event_from_dict(data):
    event = Event(
        organization_name=data["organization_name"],
        event_name=data["event_name"],
        start_datetime=data["start_datetime"],
        end_datetime=data["end_datetime"],
        address=data.get("address"),
        maps_link=data.get("maps_link"),
        online=data.get("online", False),
        event_link=data.get("event_link"),
    )

    for tag_name in data.get("tags", []):
        tag = TagModel.query.filter_by(name=tag_name).first()
        if not tag:
            tag = TagModel(name=tag_name)
        event.tags.append(tag)

    for lang, intl in data.get("intl", {}).items():
        intl_obj = EventIntl(
            lang=lang,
            event_edition=intl.get("event_edition"),
            cost=intl.get("cost"),
            banner_link=intl.get("banner_link"),
            short_description=intl.get("short_description"),
        )
        event.intl.append(intl_obj)

    db.session.add(event)
    db.session.commit()
    return event


def serialize_event(event: Event):
    return {
        "id": event.id,
        "organization_name": event.organization_name,
        "event_name": event.event_name,
        "start_datetime": event.start_datetime.isoformat(),
        "end_datetime": event.end_datetime.isoformat(),
        "address": event.address,
        "maps_link": event.maps_link,
        "online": event.online,
        "event_link": event.event_link,
        "tags": [t.name for t in event.tags],
        "intl": {
            intl.lang: {
                "event_edition": intl.event_edition,
                "cost": intl.cost,
                "banner_link": intl.banner_link,
                "short_description": intl.short_description,
            }
            for intl in event.intl
        },
    }


def filter_events(filters: EventQuery):
    query = Event.query

    if filters.parsed_tags:
        query = query.join(Event.tags).filter(TagModel.name.in_(filters.parsed_tags))

    if filters.name:
        query = query.filter(Event.event_name.ilike(f"%{filters.name}%"))

    if filters.org:
        query = query.filter(Event.organization_name.ilike(f"%{filters.org}%"))

    if filters.online is not None:
        query = query.filter(Event.online == filters.online)

    if filters.address:
        query = query.filter(Event.address.ilike(f"%{filters.address}%"))

    if filters.date_from:
        query = query.filter(Event.start_datetime >= filters.date_from)

    if filters.date_start_range and filters.date_end_range:
        query = query.filter(
            Event.start_datetime >= filters.date_start_range,
            Event.end_datetime <= filters.date_end_range,
        )

    return [serialize_event(e) for e in query.all()]


@event_bp.get(
    "/",
    tags=[event_tag],
    summary="List events",
    description="Returns a list of events filtered by query parameters.",
)
def get_events(query: EventQuery):
    events = filter_events(query)
    print(events)
    return jsonify(events), 200


@event_bp.post(
    "/",
    tags=[event_tag],
    summary="Create event",
    description="Inserts a new event into the database and returns it with its generated ID.",
)
def create_event(body: EventIn):
    event_data = body.dict()
    event = create_event_from_dict(event_data)
    return jsonify(serialize_event(event)), 201
