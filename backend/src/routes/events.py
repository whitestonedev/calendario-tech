import logging

from flask import jsonify
from flask_openapi3 import Tag, APIBlueprint

from src.exceptions import DuplicateEventException, EventNotFoundException
from src.schemas import (
    EventIn,
    EventQuery,
    ManageSubmittedEventBody,
    SubmittedActions,
    EventUpdate,
    EventPath,
)
from src.services.auth import check_credentials
from src.services.event import (
    submit_event,
    get_events as get_events_service,
    get_event as get_event_service,
    delete_event as delete_event_service,
    update_event_status,
)
from src.services.event import update_event as update_event_service

event_bp = APIBlueprint("events", __name__, url_prefix="/events")
event_tag = Tag(name="events", description="Operations related to events")

logger = logging.getLogger(__name__)


@event_bp.get(
    "/",
    tags=[event_tag],
    summary="Retrieve events",
)
def get_events(query: EventQuery):
    events = get_events_service(query, only_approved=True)
    return jsonify(events), 200


@event_bp.post(
    "/submit/",
    tags=[event_tag],
    summary="Submit event for review",
    security=[{"BearerAuth": []}],
)
def create_event(body: EventIn):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials, 401

    event_data = body.model_dump()

    try:
        event = submit_event(event_data)
    except DuplicateEventException as e:
        return jsonify({"error": str(e)}), 400
    return jsonify(event.serialized), 201


@event_bp.post(
    "/submit/<int:event_id>",
    tags=[event_tag],
    summary="Manage submitted event (Staff Review)",
    description="Sets the status of an event to 'approved' or 'declined'.",
    security=[{"BearerAuth": []}],
)
def manage_submitted_update_event(path: EventPath, body: ManageSubmittedEventBody):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials, 401
    try:
        event = get_event_service(path.event_id)

        if body.action == SubmittedActions.declined:
            # If the event is declined, delete it (Just for now)
            delete_event_service(event.id)

            return jsonify({"message": "Event declined and deleted"}), 200

        update_event_status(event.id, body.action.value)

        return jsonify({"message": "Event status updated"}), 200

    except EventNotFoundException as e:
        return jsonify({"error": str(e)}), 404


@event_bp.delete(
    "/<int:event_id>",
    tags=[event_tag],
    summary="Delete event (Staff Action)",
    security=[{"BearerAuth": []}],
)
def delete_event(path: EventPath):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials, 401

    try:
        delete_event_service(path.event_id)
        return jsonify({"message": "Event deleted"}), 200
    except EventNotFoundException as e:
        return jsonify({"error": str(e)}), 404


@event_bp.put(
    "/<int:event_id>",
    tags=[event_tag],
    summary="Update event (Staff Action)",
)
def update_event(event_id: int, event_data: EventUpdate):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials, 401

    event = update_event_service(event_id, event_data)

    return jsonify(event.serialized)
