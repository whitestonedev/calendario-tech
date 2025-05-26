from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum

import enum

db = SQLAlchemy()


class EventStatus(enum.Enum):
    requested = "requested"
    approved = "approved"
    declined = "declined"


class States(enum.Enum):
    AP = "AP"
    AM = "AM"
    BA = "BA"
    CE = "CE"
    DF = "DF"
    ES = "ES"
    GO = "GO"
    MA = "MA"
    MT = "MT"
    MS = "MS"
    MG = "MG"
    PA = "PA"
    PB = "PB"
    PR = "PR"
    PE = "PE"
    PI = "PI"
    RJ = "RJ"
    RN = "RN"
    RS = "RS"
    RO = "RO"
    RR = "RR"
    SC = "SC"
    SP = "SP"
    SE = "SE"
    TO = "TO"


class Currency(enum.Enum):
    BRL = "BRL"  # Brazilian Real
    USD = "USD"  # US Dollar
    EUR = "EUR"  # Euro
    AUD = "AUD"  # Australian Dollar
    CAD = "CAD"  # Canadian Dollar


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    organization_name = db.Column(db.String, nullable=False)
    event_name = db.Column(db.String, nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=False)
    maps_link = db.Column(db.String)
    online = db.Column(db.Boolean, default=False)
    event_link = db.Column(db.String)

    address = db.Column(db.String)
    state = db.Column(db.Enum(States, name="states"), nullable=False, default=States.SC)

    is_free = db.Column(
        db.Boolean,
        default=True,
        nullable=False,
        comment="Indicates if the event is free or not",
    )

    status = db.Column(
        Enum(EventStatus, name="event_status"),
        nullable=False,
        default=EventStatus.requested,
    )

    intl = db.relationship("EventIntl", backref="event", cascade="all, delete")
    tags = db.relationship("Tag", secondary="event_tags", back_populates="events")

    @property
    def serialized(self):
        return {
            "id": self.id,
            "organization_name": self.organization_name,
            "event_name": self.event_name,
            "start_datetime": self.start_datetime.isoformat(),
            "end_datetime": self.end_datetime.isoformat(),
            "address": self.address,
            "state": self.state.value,
            "maps_link": self.maps_link,
            "online": self.online,
            "is_free": self.is_free,
            "event_link": self.event_link,
            "status": self.status.value,
            "tags": [t.name for t in self.tags],
            "intl": {
                intl.lang: {
                    "event_edition": intl.event_edition,
                    "cost": intl.cost,
                    "currency": intl.currency.value if intl.currency else None,
                    "banner_link": intl.banner_link,
                    "short_description": intl.short_description,
                }
                for intl in self.intl
            },
        }


class EventIntl(db.Model):
    __tablename__ = "event_intl"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(
        db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False
    )
    lang = db.Column(db.String, nullable=False)
    event_edition = db.Column(db.String)
    cost = db.Column(db.Float)
    currency = db.Column(db.Enum(Currency, name="currencies"), default=Currency.BRL)
    banner_link = db.Column(db.String)
    short_description = db.Column(db.String)


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    events = db.relationship("Event", secondary="event_tags", back_populates="tags")


class EventTag(db.Model):
    __tablename__ = "event_tags"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(
        db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False
    )
    tag_id = db.Column(
        db.Integer, db.ForeignKey("tags.id", ondelete="CASCADE"), nullable=False
    )

    __table_args__ = (db.UniqueConstraint("event_id", "tag_id"),)
