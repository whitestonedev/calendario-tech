from src.exceptions import DuplicateEventException, EventNotFoundException
from src.models import db, Event, EventIntl, Tag as TagModel, EventStatus
from src.schemas import Event as EventDOT

from src.schemas import EventIn, EventUpdate, EventQuery


def submit_event(data: EventIn) -> Event:
    """
    Submits a new event to the database.

    Args:
        data (EventIn): The event data to be submitted.

    Returns:
        Event: The newly created event object.

    Raises:
        DuplicateEventException: If an event with the same name, organization,
                                    and start date already exists.
    """

    existing_event = Event.query.filter_by(
        organization_name=data.organization_name,
        event_name=data.event_name,
        start_datetime=data.start_datetime,
    ).first()

    if existing_event:
        raise DuplicateEventException(
            "Event already exists with the same name, organization, and start date."
        )

    event = Event(
        organization_name=data.organization_name,
        event_name=data.event_name,
        start_datetime=data.start_datetime,
        end_datetime=data.end_datetime,
        address=data.address,
        maps_link=data.maps_link,
        online=data.online,
        event_link=data.event_link,
    )

    with db.session.begin():
        for tag_name in data.tags:
            tag = TagModel.query.filter_by(name=tag_name).first()
            if not tag:
                tag = TagModel(name=tag_name)
            event.tags.append(tag)

        for lang, intl in data.intl.items():
            intl_obj = EventIntl(
                lang=lang,
                event_edition=intl.event_edition,
                cost=intl.cost,
                banner_link=intl.banner_link,
                short_description=intl.short_description,
            )
            event.intl.append(intl_obj)

        db.session.add(event)

    return event


def update_event(event_id: int, event_data: EventUpdate) -> Event:
    """
    Updates an existing event in the database.

    Args:
        event_id (int): The ID of the event to update.
        event_data (EventUpdate): The updated event data.

    Returns:
        Event: The updated event object.

    Raises:
        EventNotFoundException: If the event with the given ID is not found.
    """

    event = Event.query.get(event_id)
    if not event:
        raise EventNotFoundException(f"Event with ID {event_id} not found.")

    with db.session.begin():
        event.organization_name = event_data.organization_name
        event.event_name = event_data.event_name
        event.start_datetime = event_data.start_datetime
        event.end_datetime = event_data.end_datetime
        event.address = event_data.address
        event.maps_link = event_data.maps_link
        event.online = event_data.online
        event.event_link = event_data.event_link

        event.tags.clear()
        for tag_name in event_data.tags:
            tag = TagModel.query.filter_by(name=tag_name).first()
            if not tag:
                tag = TagModel(name=tag_name)
            event.tags.append(tag)

        event.intl.clear()
        for lang, intl in event_data.intl.items():
            intl_obj = EventIntl(
                lang=lang,
                event_edition=intl.event_edition,
                cost=intl.cost,
                banner_link=intl.banner_link,
                short_description=intl.short_description,
            )
            event.intl.append(intl_obj)

    return event


def get_events(filters: EventQuery, only_approved: bool = True) -> list[dict]:
    """
    Retrieve a list of events based on the provided filters.

    Args:
        filters (EventQuery): An object containing filtering criteria such as tags,
                                event name, organization, online status, address,
                                and date ranges.
        only_approved (bool): If True, only approved events will be returned.

    Returns:
        list[dict]: A list of serialized event objects that match the filters.
    """
    query = Event.query

    if only_approved:
        query = query.filter(Event.status == EventStatus.approved)

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

    return [e.serialized for e in query.all()]


def get_event(event_id: int) -> EventDOT:

    event = Event.query.get(event_id)
    if not event:
        raise EventNotFoundException(f"Event with ID {event_id} not found.")

    return event


def delete_event(event_id: int) -> None:
    """
    Deletes an event from the database.

    Args:
        event_id (int): The ID of the event to delete.

    Raises:
        EventNotFoundException: If the event with the given ID is not found.
    """

    event = Event.query.get(event_id)
    if not event:
        raise EventNotFoundException(f"Event with ID {event_id} not found.")

    db.session.delete(event)
    db.session.commit()


def update_event_status(event_id: int, status: str) -> Event:
    """
    Updates the status of an event in the database.

    Args:
        event_id (int): The ID of the event to update.
        status (str): The new status to set for the event.

    Returns:
        Event: The updated event object.

    Raises:
        EventNotFoundException: If the event with the given ID is not found.
    """

    event = Event.query.get(event_id)
    if not event:
        raise EventNotFoundException(f"Event with ID {event_id} not found.")

    event.status = status
    db.session.commit()

    return event
