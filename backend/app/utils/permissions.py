from functools import wraps

from flask import abort, redirect, session, url_for


def role_required(required_role):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if not session.get("user_id"):
                return redirect(url_for("auth.login_page"))
            if session.get("role") != required_role:
                abort(403)
            return view(*args, **kwargs)

        return wrapped

    return decorator
