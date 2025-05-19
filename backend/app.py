import logging
from flask import jsonify, render_template_string
from flask_cors import CORS
import yaml
import os
from datetime import datetime
import mistune
import threading
import time
from apscheduler.schedulers.background import BackgroundScheduler


from pydantic import BaseModel, Field
from flask_openapi3 import OpenAPI, Info, Tag

from services.version_db import run_db_versioning_job
from services.db import create_table, insert_event, list_all_events, query_events

# API Info
info = Info(title="Events API", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# API Tags
event_tag = Tag(name="events", description="Operations related to events")

# Constants
EVENTS_FOLDER_NAME = "events"
README_FILE = "README.md"
aggregated_events = []

# Scheduler for database versioning
scheduler = BackgroundScheduler()
scheduler.add_job(run_db_versioning_job, "cron", hour=0, minute=0)  # Daily at midnight
scheduler.start()


def initial_data_load():
    create_table()
    print("[DB] Tabela de eventos criada (se não existir)")

    existing = list_all_events()
    if existing:
        print(
            f"[DB] Já existem {len(existing)} eventos no banco — pulando carga inicial"
        )
        return

    app_dir = os.path.dirname(__file__)
    parent_dir = os.path.dirname(app_dir)
    events_dir = os.path.join(parent_dir, EVENTS_FOLDER_NAME)

    if not os.path.isdir(events_dir):
        print(f"[DB] Pasta '{EVENTS_FOLDER_NAME}' não encontrada em: {events_dir}")
        return

    for filename in os.listdir(events_dir):
        if filename.endswith((".yml", ".yaml")):
            filepath = os.path.join(events_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    event_data = yaml.safe_load(f)
                    insert_event(event_data)
                    print(f"[DB] Evento inserido: {event_data.get('id', 'sem ID')}")
                except yaml.YAMLError as e:
                    print(f"[DB] Erro lendo {filename}: {e}")

    print(f"[DB] Carga inicial concluída: {datetime.now()}")


class EventQuery(BaseModel):
    """
    Model for event filter query parameters.
    """

    tags: str | None = Field(default=None, description="Comma-separated list of tags")
    name: str | None = Field(
        None, description="Filters events by name (case-insensitive, partial match)"
    )
    org: str | None = Field(
        None,
        description="Filters events by organization (case-insensitive, partial match)",
    )
    online: bool | None = Field(
        None, description="Filters by online (true) or in-person (false) events"
    )
    price_type: str | None = Field(
        None,
        description="Filters by price type ('free' or 'paid')",
        enum=["free", "paid"],
    )
    price_min: float | None = Field(
        None, description="Filters paid events with minimum price"
    )
    price_max: float | None = Field(
        None, description="Filters paid events with maximum price"
    )
    address: str | None = Field(
        None, description="Filters events by address (case-insensitive, partial match)"
    )
    date_start_range: str | None = Field(
        None, description="Filters events from this start date (YYYY-MM-DD)"
    )
    date_end_range: str | None = Field(
        None, description="Filters events until this end date (YYYY-MM-DD)"
    )
    date_from: str | None = Field(
        None, description="Filters events from this date (YYYY-MM-DD)"
    )

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


def filter_events(filters: EventQuery) -> list[dict]:
    return query_events(
        tags=filters.parsed_tags,
        name=filters.name,
        org=filters.org,
        online=filters.online,
        price_type=filters.price_type,
        price_min=filters.price_min,
        price_max=filters.price_max,
        address=filters.address,
        date_start_range=filters.date_start_range,
        date_end_range=filters.date_end_range,
        date_from=filters.date_from,
    )


@app.get(
    "/events",
    tags=[event_tag],
    summary="List events",
    description="Returns a list of events filtered by query parameters.",
)
def get_events(query: EventQuery):
    """
    Endpoint to return filtered events.
    """
    filtered_events = filter_events(query)
    return jsonify(filtered_events)


@app.post(
    "/events",
    tags=[event_tag],
    summary="Create event",
    description="Inserts a new event into the database and returns it with its generated ID.",
)
def create_event(body: EventIn):
    data = body.dict()

    data["start_datetime"] = data["start_datetime"].isoformat()
    data["end_datetime"] = data["end_datetime"].isoformat()

    new_id = insert_event(data)

    created = next(e for e in list_all_events() if e["id"] == new_id)

    return jsonify(created), 201


@app.route("/", methods=["GET"])
def index():
    """Route for the homepage displaying formatted README and API documentation link."""
    try:
        with open(README_FILE, "r", encoding="utf-8") as readme_file:
            readme_content = readme_file.read()
            html_readme = mistune.html(readme_content)
            readme_style = """
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                color: #f0f0f0;
                                background-color: #121212;
                                margin: 20px;
                            }
                            .container {
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #1e1e1e;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                            }
                            h1, h2, h3 {
                                color: #bb86fc;
                            }
                            h1 {
                                border-bottom: 2px solid #bb86fc;
                                padding-bottom: 10px;
                            }
                            h2 {
                                border-bottom: 1px solid #bb86fc;
                                padding-bottom: 5px;
                                margin-top: 25px;
                            }
                            h3 {
                                margin-top: 20px;
                            }
                            p, li {
                                line-height: 1.6;
                                color: #e0e0e0;
                            }
                            code {
                                background-color: #272727;
                                color: #dcdcdc;
                                padding: 2px 5px;
                                border-radius: 3px;
                                font-family: monospace;
                            }
                            pre code {
                                display: block;
                                padding: 10px;
                                overflow-x: auto;
                                background-color: #272727;
                                color: #dcdcdc;
                                border: 1px solid #444;
                            }
                            a {
                                color: #03dac5;
                                text-decoration: none;
                            }
                            a:hover {
                                text-decoration: underline;
                                color: #03dac5;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                                color: #e0e0e0;
                            }
                            th, td {
                                border: 1px solid #555;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #333;
                                font-weight: bold;
                                color: #f0f0f0;
                            }
                        </style>
                        """
            html_with_style = f"""
            <div class="container">
                <div style="text-align: right; margin-bottom: 20px;">
                    <a href="/openapi/scalar" target="_blank">API Documentation (Scalar)</a>
                </div>
                {readme_style}
                {html_readme}
            </div>
            """
            return render_template_string(html_with_style)
    except FileNotFoundError:
        return "README.md not found.", 404


@app.route("/health_check", methods=["GET"])
def health_check():
    """Route for health check."""
    return "OK", 200


def start_periodic_reload():
    """Starts periodic reload of events in background."""

    def reload_task():
        while True:
            initial_data_load()
            time.sleep(60)  # Reload every 60 seconds (1 minute) - Adjust as needed

    thread = threading.Thread(target=reload_task)
    thread.daemon = True
    thread.start()


# Load events initially and start periodic reload
initial_data_load()
start_periodic_reload()
