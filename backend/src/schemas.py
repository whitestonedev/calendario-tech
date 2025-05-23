import enum
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


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


class Event(BaseModel):
    id: int
    organization_name: str
    event_name: str
    start_datetime: datetime
    end_datetime: datetime
    address: str | None = None
    maps_link: str | None = None
    online: bool
    event_link: str | None = None
    status: str
    tags: list[str] = []
    intl: dict[str, IntlData] = {}


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


class EventUpdate(BaseModel):
    organization_name: Optional[str] = None
    event_name: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    address: Optional[str] = None
    maps_link: Optional[str] = None
    online: Optional[bool] = None
    event_link: Optional[str] = None
    tags: Optional[list[str]] = None
    intl: Optional[dict[str, IntlData]] = None


class SubmittedActions(enum.Enum):
    approved = "approved"
    declined = "declined"


class ManageSubmittedEventBody(BaseModel):
    action: SubmittedActions = Field(
        ...,
        description="Action to perform on the submitted event, either 'approved' or 'declined'.",
    )


class EventPath(BaseModel):
    event_id: int = Field(..., description="Event ID")
