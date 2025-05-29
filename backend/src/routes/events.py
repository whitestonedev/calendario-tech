import logging
import os

from flask import jsonify
from flask_openapi3 import Tag, APIBlueprint
from flask_cors import cross_origin

from src.exceptions import DuplicateEventException, EventNotFoundException
from src.models import EventStatus
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
    get_events_calendar,
)
from src.services.event import update_event as update_event_service

event_bp = APIBlueprint("events", __name__, url_prefix="/events")
public_tag = Tag(
    name="Public Events", description="Public endpoints for listing and viewing events."
)
submission_tag = Tag(
    name="Event Submission", description="Endpoints for submitting new events."
)
review_tag = Tag(
    name="Event Review (Staff)",
    description="Endpoints for reviewing and managing submitted events (staff only).",
)


logger = logging.getLogger(__name__)


def get_allowed_origins():
    origins = [
        "https://api.calendario.tech",
        "https://manage.calendario.tech",
        "https://www.calendario.tech",
        "https://calendario.tech"
    ]
    if os.getenv("DEBUG", "False").lower() == "true":
        origins.extend(
            [
                "http://localhost:8080",
                "http://localhost:8081",
                "http://localhost:8082",
                "http://localhost:3000",
            ]
        )
    return origins


# TODO: remove this double route
@event_bp.get(
    "",
    tags=[public_tag],
    summary="Retrieve events",
)
@event_bp.get(
    "/",
    tags=[public_tag],
    summary="Retrieve events",
)
@cross_origin(origins="*")
def get_events(query: EventQuery):
    events = get_events_service(query)
    return jsonify(events), 200


@event_bp.get(
    "/<int:event_id>",
    tags=[public_tag],
    summary="Retrieve event",
)
@cross_origin(origins="*")
def get_event(path: EventPath):
    event = get_event_service(path.event_id)
    return jsonify(event.serialized), 200


@event_bp.post(
    "/submit",
    tags=[submission_tag],
    summary="Submit event for review",
)
@cross_origin(
    origins=get_allowed_origins(),
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
def create_event(body: EventIn):
    try:
        event = submit_event(body)
    except DuplicateEventException as e:
        return jsonify({"error": str(e)}), 400
    return jsonify(event.serialized), 201


@event_bp.delete(
    "/<int:event_id>",
    tags=[review_tag],
    summary="Delete event",
)
@cross_origin(
    origins=get_allowed_origins(),
    methods=["DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
def delete_event(path: EventPath):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials

    try:
        delete_event_service(path.event_id)
        return jsonify({"message": "Event deleted"}), 200
    except EventNotFoundException as e:
        return jsonify({"error": str(e)}), 404


@event_bp.put(
    "/<int:event_id>",
    tags=[review_tag],
    summary="Update event",
)
@cross_origin(
    origins=get_allowed_origins(),
    methods=["PUT", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
def update_event(path: EventPath, body: EventUpdate):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials

    event = update_event_service(path.event_id, body)
    return jsonify(event.serialized)


@event_bp.get(
    "/submit/review",
    tags=[review_tag],
    summary="Retrieve events pending review",
    description="Fetches a list of events that are pending approval by the staff.",
)
@cross_origin(
    origins=get_allowed_origins(),
    methods=["GET", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
def get_pending_events():
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials

    try:
        events = get_events_service(status=EventStatus.requested)
        return jsonify(events), 200
    except Exception as e:
        logger.error(f"Error fetching pending events: {e}")
        return jsonify({"error": "Internal server error"}), 500


@event_bp.post(
    "/submit/<int:event_id>",
    tags=[review_tag],
    summary="Manage submitted event, approve or decline",
    description="Sets the status of an event to 'approved' or 'declined'.",
)
@cross_origin(
    origins=get_allowed_origins(),
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
def manage_submitted_update_event(path: EventPath, body: ManageSubmittedEventBody):
    is_valid_credentials = check_credentials()
    if is_valid_credentials:
        return is_valid_credentials
    try:
        event = get_event_service(path.event_id)

        if body.action == SubmittedActions.declined:
            delete_event_service(event.id)
            return jsonify({"message": "Event declined and deleted"}), 200

        update_event_status(event.id, body.action.value)
        return jsonify({"message": "Event status updated"}), 200

    except EventNotFoundException as e:
        return jsonify({"error": str(e)}), 404


@event_bp.get(
    "/calendar",
    tags=[public_tag],
    summary="Retrieve dates with events",
    description="Returns a list of dates that have events and their respective event IDs.",
)
@cross_origin(origins="*")
def get_calendar():
    calendar_data = get_events_calendar()
    return jsonify(calendar_data), 200
