import re

from flask import Blueprint, redirect, request, session, url_for
from sqlalchemy.exc import IntegrityError

from backend.app import db
from backend.app.models import User
from backend.app.utils.csrf import create_csrf_token

auth_bp = Blueprint("auth", __name__)
EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")
PHONE_PATTERN = re.compile(r"[+0-9()\-\s]{7,30}")


def _auth_page(page, error=None):
    return redirect(
        url_for("static", filename=f"pages/{page}.html", error=error)
        if error
        else url_for("static", filename=f"pages/{page}.html")
    )


def _valid_phone(phone):
    digits = re.sub(r"\D", "", phone)
    return PHONE_PATTERN.fullmatch(phone) is not None and 7 <= len(digits) <= 20


@auth_bp.get("/csrf-token")
def csrf_token():
    return {"token": create_csrf_token()}


@auth_bp.get("/login")
def login_page():
    return _auth_page("login")


@auth_bp.post("/login")
def login():
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")

    if not EMAIL_PATTERN.fullmatch(email) or not password:
        return _auth_page("login", "invalid_credentials")

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if (
        user is None
        or user.role not in {"admin", "customer"}
        or not user.check_password(password)
    ):
        return _auth_page("login", "invalid_credentials")

    session.clear()
    session["user_id"] = user.id
    session["role"] = user.role
    session.permanent = request.form.get("remember") == "on"
    create_csrf_token()

    if user.role == "admin":
        return redirect(url_for("admin_dashboard"))
    return redirect(url_for("customer_dashboard"))


@auth_bp.get("/register")
def register_page():
    return _auth_page("register")


@auth_bp.post("/register")
def register():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    phone = request.form.get("phone", "").strip()
    password = request.form.get("password", "")
    confirm_password = request.form.get("confirmPassword", "")

    if not name or len(name) > 120:
        return _auth_page("register", "invalid_name")
    if not EMAIL_PATTERN.fullmatch(email) or len(email) > 254:
        return _auth_page("register", "invalid_email")
    if not _valid_phone(phone):
        return _auth_page("register", "invalid_phone")
    if len(password) < 8 or len(password) > 128:
        return _auth_page("register", "weak_password")
    if password != confirm_password:
        return _auth_page("register", "password_mismatch")
    if User.query.filter(db.func.lower(User.email) == email).first():
        return _auth_page("register", "email_exists")

    user = User(name=name, email=email, phone=phone, role="customer")
    user.set_password(password)
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _auth_page("register", "email_exists")

    session.clear()
    session["user_id"] = user.id
    session["role"] = user.role
    create_csrf_token()
    return redirect(url_for("customer_dashboard"))


@auth_bp.post("/logout")
def logout():
    session.clear()
    return _auth_page("login")
