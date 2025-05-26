import enum
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List, Dict

from src.models import States, Currency


class EventQuery(BaseModel):
    tags: str | None = Field(default=None, description="Comma-separated list of tags")
    name: str | None = Field(None, description="Filter by event name")
    org: str | None = Field(None, description="Filter by organization")
    online: bool | None = Field(None, description="Online (true) or in-person (false)")

    state: Optional[States] = Field(
        None, description="UF state code (e.g., SP, SC, RJ)"
    )
    address: str | None = Field(None, description="Filter by address")

    date_start_range: str | None = Field(None)
    date_end_range: str | None = Field(None)
    date_from: str | None = Field(None)

    currency: Optional[Currency] = Field(
        None, description="Currency code (BRL, USD, EUR, etc)"
    )
    is_free: Optional[bool] = Field(
        None, description="Filter for free (true) or paid (false) events"
    )
    price_min: float | None = Field(None)
    price_max: float | None = Field(None)

    @property
    def parsed_tags(self) -> list[str] | None:
        if self.tags:
            return [t.strip() for t in self.tags.split(",") if t.strip()]
        return None


class IntlData(BaseModel):
    event_edition: Optional[str] = None
    cost: Optional[float] = None
    currency: Optional[Currency] = None
    banner_link: Optional[str] = None
    short_description: Optional[str] = None


class Event(BaseModel):
    id: int
    organization_name: str
    event_name: str
    start_datetime: datetime
    end_datetime: datetime
    address: Optional[str] = None
    maps_link: Optional[str] = None
    online: bool
    event_link: Optional[str] = None
    status: str
    tags: List[str] = []
    state: States
    is_free: bool
    intl: Dict[str, IntlData] = {}


class EventIn(BaseModel):
    organization_name: str
    event_name: str
    start_datetime: datetime
    end_datetime: datetime
    address: Optional[str] = None
    maps_link: Optional[str] = None
    online: bool
    event_link: Optional[str] = None
    tags: List[str] = []
    state: States
    is_free: bool = True
    intl: Dict[str, IntlData] = {}


class EventUpdate(BaseModel):
    organization_name: Optional[str] = None
    event_name: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    address: Optional[str] = None
    maps_link: Optional[str] = None
    online: Optional[bool] = None
    event_link: Optional[str] = None
    tags: Optional[List[str]] = None
    intl: Optional[Dict[str, IntlData]] = None
    status: Optional[str] = None
    state: Optional[States] = None
    is_free: Optional[bool] = None


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
