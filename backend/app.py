import logging
from pathlib import Path

from flask import render_template_string
from flask_cors import CORS
import mistune
from apscheduler.schedulers.background import BackgroundScheduler
from flask_migrate import Migrate

from src.models import db

from flask_openapi3 import OpenAPI, Info

from src.constants import LOGGER_FORMAT, README_FILE
from src.routes.events import event_bp
from src.services.version_db import run_db_versioning_job


DB_PATH = Path(__file__).parent / "events.sqlite3"


info = Info(title="Events API", version="1.0.0")
app = OpenAPI(__name__, info=info)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH.resolve()}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

logging.basicConfig(
    level=logging.INFO,
    format=LOGGER_FORMAT,
)
logger = logging.getLogger(__name__)

# Scheduler for database backup
scheduler = BackgroundScheduler()
scheduler.add_job(run_db_versioning_job, "cron", hour=0, minute=0)  # Daily at midnight
scheduler.start()

app.register_api(event_bp)


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
