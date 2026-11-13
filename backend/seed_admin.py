import getpass
import re

from sqlalchemy import func

from backend.app import create_app, db
from backend.app.models import User

EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")


def main():
    app = create_app()

    with app.app_context():
        name = input("Admin name: ").strip()
        email = input("Admin email: ").strip().lower()
        password = getpass.getpass("Admin password (at least 8 characters): ")

        if not name or len(name) > 120:
            raise SystemExit("Admin name must be between 1 and 120 characters.")
        if not EMAIL_PATTERN.fullmatch(email) or len(email) > 254:
            raise SystemExit("Enter a valid admin email address.")
        if len(password) < 8 or len(password) > 128:
            raise SystemExit("Admin password must be between 8 and 128 characters.")
        if User.query.filter(func.lower(User.email) == email).first():
            raise SystemExit("An account already uses that email address.")

        admin = User(name=name, email=email, role="admin")
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Admin account created for {email}.")


if __name__ == "__main__":
    main()
