from flask import jsonify, render_template_string
import yaml
import os
from datetime import datetime
import mistune
import threading
import time

from pydantic import BaseModel, Field
from flask_openapi3 import OpenAPI, Info, Tag


# API Info
info = Info(title="Events API", version="1.0.0")
app = OpenAPI(__name__, info=info)

# API Tags
event_tag = Tag(name="events", description="Operations related to events")

# Constants
EVENTS_FOLDER_NAME = "events"
README_FILE = "README.md"
aggregated_events = []


def load_events_from_yaml():
    """Loads events from all YAML files in the 'events' folder (one level up)."""
    global aggregated_events
    aggregated_events_temp = []
    app_dir = os.path.dirname(__file__)
    parent_dir = os.path.dirname(app_dir)
    events_dir = os.path.join(parent_dir, EVENTS_FOLDER_NAME)

    if not os.path.isdir(events_dir):
        print(f"Folder '{EVENTS_FOLDER_NAME}' not found at: {events_dir}")
        return []

    for filename in os.listdir(events_dir):
        if filename.endswith(".yml") or filename.endswith(".yaml"):
            filepath = os.path.join(events_dir, filename)
            with open(filepath, "r", encoding="utf-8") as file:
                try:
                    event_data = yaml.safe_load(file)
                    aggregated_events_temp.append(event_data)
                except yaml.YAMLError as e:
                    print(f"Error reading YAML file {filename}: {e}")

    aggregated_events = aggregated_events_temp
    print(f"Events reloaded: {datetime.now()}")
    return aggregated_events


def get_numeric_price(price_str):
    """Extracts the numeric value from a price string."""
    price_numeric_str = "".join(filter(str.isdigit, price_str))
    try:
        return float(price_numeric_str) / 100.0 if price_numeric_str else 0.0
    except ValueError:
        return 0.0


class EventQuery(BaseModel):
    """
    Model for event filter query parameters.
    """

    tags: list[str] | None = Field(
        None, description="Filters events by tags (multiple tags allowed)"
    )
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


def filter_events(filters: EventQuery):
    """Filters the aggregated events list based on provided filters."""
    filtered_events = aggregated_events
    if filters.tags:
        tags_filter = filters.tags
        filtered_events = [
            event
            for event in filtered_events
            if "tags" in event and any(tag in event["tags"] for tag in tags_filter)
        ]
    if filters.name:
        name_filter = filters.name.lower()
        filtered_events = [
            event
            for event in filtered_events
            if "event_name" in event and name_filter in event["event_name"].lower()
        ]
    if filters.org:
        org_filter = filters.org.lower()
        filtered_events = [
            event
            for event in filtered_events
            if "organization_name" in event
            and org_filter in event["organization_name"].lower()
        ]
    if filters.online is not None:
        filtered_events = [
            event
            for event in filtered_events
            if "online" in event and event["online"] == filters.online
        ]
    if filters.price_type:
        price_type = filters.price_type.lower()
        if price_type == "free":
            filtered_events = [
                event
                for event in filtered_events
                if "intl" in event
                and "pt-br" in event["intl"]
                and event["intl"]["pt-br"].get("cost", "").lower()
                == "grátis"  # Assuming 'grátis' means free in pt-br
            ]
        elif price_type == "paid":
            filtered_events = [
                event
                for event in filtered_events
                if "intl" in event
                and "pt-br" in event["intl"]
                and event["intl"]["pt-br"].get("cost", "").lower()
                != "grátis"  # Assuming 'grátis' means free in pt-br
            ]
    if filters.price_min:
        min_price_num = filters.price_min
        filtered_events = [
            event
            for event in filtered_events
            if "intl" in event
            and "pt-br" in event["intl"]
            and "cost" in event["intl"]["pt-br"]
            and not event["intl"]["pt-br"]["cost"].lower()
            == "grátis"  # Excludes free events
            and get_numeric_price(event["intl"]["pt-br"]["cost"]) >= min_price_num
        ]
    if filters.price_max:
        max_price_num = filters.price_max
        filtered_events = [
            event
            for event in filtered_events
            if "intl" in event
            and "pt-br" in event["intl"]
            and "cost" in event["intl"]["pt-br"]
            and not event["intl"]["pt-br"]["cost"].lower()
            == "grátis"  # Excludes free events
            and get_numeric_price(event["intl"]["pt-br"]["cost"]) <= max_price_num
        ]
    if filters.address:
        address_filter = filters.address.lower()
        filtered_events = [
            event
            for event in filtered_events
            if "address" in event and address_filter in event["address"].lower()
        ]
    if filters.date_start_range and filters.date_end_range:
        start_date_str = filters.date_start_range
        end_date_str = filters.date_end_range
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
            filtered_events = [
                event
                for event in filtered_events
                if "start_datetime" in event
                and "end_datetime" in event
                and datetime.strptime(event["start_datetime"][:10], "%Y-%m-%d").date()
                >= start_date.date()
                and datetime.strptime(event["end_datetime"][:10], "%Y-%m-%d").date()
                <= end_date.date()
            ]
        except ValueError:
            pass
    if filters.date_from:
        from_date_str = filters.date_from
        try:
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d")
            filtered_events = [
                event
                for event in filtered_events
                if "start_datetime" in event
                and datetime.strptime(event["start_datetime"][:10], "%Y-%m-%d").date()
                >= from_date.date()
            ]
        except ValueError:
            pass

    return filtered_events


@app.get(
    "/api/data_events",
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
                    <a href="/openapi/swagger" target="_blank">API Documentation (Swagger UI)</a>
                </div>
                {readme_style}
                {html_readme}
            </div>
            """
            return render_template_string(html_with_style)
    except FileNotFoundError:
        return "README.md not found.", 404


def start_periodic_reload():
    """Starts periodic reload of events in background."""

    def reload_task():
        while True:
            load_events_from_yaml()
            time.sleep(60)  # Reload every 60 seconds (1 minute) - Adjust as needed

    thread = threading.Thread(target=reload_task)
    thread.daemon = True
    thread.start()


# Load events initially and start periodic reload
load_events_from_yaml()
start_periodic_reload()
