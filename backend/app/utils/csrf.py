import secrets

from flask import abort, request, session

CSRF_SESSION_KEY = "_csrf_token"


def create_csrf_token():
    token = session.get(CSRF_SESSION_KEY)
    if token is None:
        token = secrets.token_urlsafe(32)
        session[CSRF_SESSION_KEY] = token
    return token


def validate_csrf_token():
    if request.method not in {"POST", "PUT", "PATCH", "DELETE"}:
        return

    submitted_token = request.headers.get("X-CSRF-Token") or request.form.get(
        "csrf_token"
    )
    expected_token = session.get(CSRF_SESSION_KEY)

    if (
        not expected_token
        or not submitted_token
        or not secrets.compare_digest(expected_token, submitted_token)
    ):
        abort(400, description="Missing or invalid CSRF token.")
