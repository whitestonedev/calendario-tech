import logging
import os
from pathlib import Path

from flask import render_template_string, send_from_directory
from flask_cors import CORS
import mistune
from apscheduler.schedulers.background import BackgroundScheduler
from flask_migrate import Migrate
from alembic import command
from alembic.config import Config as AlembicConfig
from src.models import db

from flask_openapi3 import OpenAPI, Info

from src.constants import LOGGER_FORMAT, README_FILE
from src.routes.events import event_bp
from src.services.backup_db_pr import run_database_backup_job


DB_PATH = Path(__file__).parent / "events.sqlite3"


info = Info(title="Events API", version="1.0.0")
app = OpenAPI(
    __name__,
    info=info,
    security_schemes={
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    },
)

# Configuração do CORS
origins = [
    "https://api.calendario.tech",
    "https://manage.calendario.tech",
    "https://www.calendario.tech",
    "https://calendario.tech",
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

CORS(
    app,
    resources={
        r"/*": {
            "origins": origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"],
            "max_age": 3600,
            "send_wildcard": False,
            "vary_header": True,
            "automatic_options": True,
        }
    },
)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)


def run_migrations():
    alembic_cfg = AlembicConfig(str(Path(__file__).parent / "alembic.ini"))
    command.upgrade(alembic_cfg, "head")


with app.app_context():
    run_migrations()

logging.basicConfig(
    level=logging.INFO,
    format=LOGGER_FORMAT,
)
logger = logging.getLogger(__name__)

# Scheduler for database backup
scheduler = BackgroundScheduler()
scheduler.add_job(run_database_backup_job, "interval", hours=24)


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


@app.route("/favicon.ico", methods=["GET"])
def favicon():
    """Serve the favicon.ico file."""
    return send_from_directory(
        "src", "favicon.ico", mimetype="image/vnd.microsoft.icon"
    )


@app.route("/health_check", methods=["GET"])
def health_check():
    """Route for health check."""
    return "OK", 200
