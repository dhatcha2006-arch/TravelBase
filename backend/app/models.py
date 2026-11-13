from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from backend.app import db


def _utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="customer")
    phone = db.Column(db.String(30))
    address = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False, default=_utc_now)

    bookings = db.relationship("Booking", back_populates="customer")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Destination(db.Model):
    __tablename__ = "destinations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, nullable=False, default=_utc_now)

    packages = db.relationship("Package", back_populates="destination")


class Package(db.Model):
    __tablename__ = "packages"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    destination_id = db.Column(db.Integer, db.ForeignKey("destinations.id"))
    package_name = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    duration = db.Column(db.Integer, nullable=False)
    nights = db.Column(db.Integer, nullable=False, default=0)
    category = db.Column(db.String(60), nullable=False, default="General")
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image = db.Column(db.String(500))
    status = db.Column(db.String(20), nullable=False, default="active")
    includes = db.Column(db.JSON, nullable=False, default=list)
    excludes = db.Column(db.JSON, nullable=False, default=list)
    hotel = db.Column(db.String(255))
    transport = db.Column(db.String(255))
    itinerary = db.Column(db.JSON, nullable=False, default=list)
    policy = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=_utc_now)

    destination = db.relationship("Destination", back_populates="packages")
    bookings = db.relationship("Booking", back_populates="package")


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    booking_code = db.Column(db.String(40), unique=True, nullable=False, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey("packages.id"), nullable=False)
    travel_date = db.Column(db.Date, nullable=False)
    number_of_people = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    booking_status = db.Column(db.String(20), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, nullable=False, default=_utc_now)

    customer = db.relationship("User", back_populates="bookings")
    package = db.relationship("Package", back_populates="bookings")
    passengers = db.relationship(
        "BookingPassenger", back_populates="booking", cascade="all, delete-orphan"
    )
    payments = db.relationship(
        "Payment", back_populates="booking", cascade="all, delete-orphan"
    )


class BookingPassenger(db.Model):
    __tablename__ = "booking_passengers"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(
        db.Integer, db.ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False
    )
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), nullable=False)

    booking = db.relationship("Booking", back_populates="passengers")


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(
        db.Integer, db.ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False
    )
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(60))
    payment_status = db.Column(db.String(20), nullable=False, default="pending")
    payment_date = db.Column(db.DateTime)

    booking = db.relationship("Booking", back_populates="payments")


class Enquiry(db.Model):
    __tablename__ = "enquiries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    phone = db.Column(db.String(30))
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="new")
    created_at = db.Column(db.DateTime, nullable=False, default=_utc_now)
