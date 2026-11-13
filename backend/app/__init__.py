from pathlib import Path

from flask import Flask, redirect, request, session, url_for
from flask_sqlalchemy import SQLAlchemy

from backend.config import Config
from backend.app.utils.csrf import validate_csrf_token

db = SQLAlchemy()


def create_app(test_config=None):
    frontend_dir = Path(__file__).resolve().parents[2] / "frontend"
    app = Flask(
        __name__,
        static_folder=str(frontend_dir),
        static_url_path="",
    )
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    if not app.config.get("SECRET_KEY"):
        raise RuntimeError("Set FLASK_SECRET_KEY in backend/.env before running TravelBase.")
    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError("Set DATABASE_URL in backend/.env before running TravelBase.")

    db.init_app(app)

    from backend.app.routes.auth import auth_bp
    from backend.app.utils.permissions import role_required

    app.register_blueprint(auth_bp)
    app.before_request(validate_csrf_token)

    @app.cli.command("init-db")
    def init_db():
        from backend.app import models as _models

        _models.db.create_all()
        print("TravelBase database tables created.")

    @app.before_request
    def protect_dashboard_pages():
        required_role = None
        if request.path.startswith("/pages/admin/"):
            required_role = "admin"
        elif request.path.startswith("/pages/customer/"):
            required_role = "customer"

        if required_role is None:
            return None

        if not session.get("user_id"):
            return redirect(url_for("auth.login_page"))
        if session.get("role") != required_role:
            destination = (
                "admin_dashboard"
                if session.get("role") == "admin"
                else "customer_dashboard"
            )
            return redirect(url_for(destination))
        return None

    @app.get("/")
    def index():
        return redirect(url_for("static", filename="index.html"))

    @app.get("/customer/dashboard")
    @role_required("customer")
    def customer_dashboard():
        return redirect(url_for("static", filename="pages/customer/dashboard.html"))

    @app.get("/admin/dashboard")
    @role_required("admin")
    def admin_dashboard():
        return redirect(url_for("static", filename="pages/admin/dashboard.html"))

    return app
