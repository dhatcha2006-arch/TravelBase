from datetime import date, datetime
from decimal import Decimal
import re
import secrets
from flask import Blueprint, jsonify, request, session
from sqlalchemy import func

from backend.app import db
from backend.app.models import Booking, BookingPassenger, Destination, Enquiry, Package, User

api_bp = Blueprint("api", __name__, url_prefix="/api")
EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")


def _package_to_dict(pkg):
    return {
        "id": pkg.slug,
        "name": pkg.package_name,
        "destination": pkg.destination.name if pkg.destination else "",
        "location": pkg.destination.location if pkg.destination else "",
        "days": pkg.duration,
        "nights": pkg.nights,
        "price": float(pkg.price) if isinstance(pkg.price, Decimal) else pkg.price,
        "category": pkg.category,
        "image": pkg.image,
        "description": pkg.description,
        "includes": pkg.includes or [],
        "excludes": pkg.excludes or [],
        "hotel": pkg.hotel or "",
        "transport": pkg.transport or "",
        "itinerary": pkg.itinerary or [],
        "policy": pkg.policy or "",
        "status": pkg.status,
    }


def _destination_to_dict(dest):
    return {
        "id": dest.id,
        "name": dest.name,
        "location": dest.location,
        "description": dest.description,
        "image": dest.image,
        "package_count": len(dest.packages) if dest.packages else 0,
    }


@api_bp.get("/destinations")
def get_destinations():
    destinations = Destination.query.order_by(Destination.name.asc()).all()
    return jsonify([_destination_to_dict(d) for d in destinations])


@api_bp.get("/packages")
def get_packages():
    query = Package.query.filter_by(status="active")

    search = request.args.get("search", "").strip().lower()
    if search:
        search_filter = f"%{search}%"
        query = query.join(Package.destination).filter(
            func.lower(Package.package_name).like(search_filter)
            | func.lower(Destination.name).like(search_filter)
            | func.lower(Destination.location).like(search_filter)
        )

    category = request.args.get("category", "").strip().lower()
    if category and category != "all":
        query = query.filter(func.lower(Package.category) == category)

    max_price = request.args.get("max_price")
    if max_price:
        try:
            query = query.filter(Package.price <= float(max_price))
        except ValueError:
            pass

    max_duration = request.args.get("max_duration")
    if max_duration:
        try:
            query = query.filter(Package.duration <= int(max_duration))
        except ValueError:
            pass

    sort = request.args.get("sort")
    if sort == "low":
        query = query.order_by(Package.price.asc())
    elif sort == "high":
        query = query.order_by(Package.price.desc())
    else:
        query = query.order_by(Package.created_at.desc())

    packages = query.all()
    return jsonify([_package_to_dict(p) for p in packages])


@api_bp.get("/packages/<slug>")
def get_package_detail(slug):
    pkg = Package.query.filter_by(slug=slug).first()
    if not pkg:
        return jsonify({"error": "Package not found"}), 404
    return jsonify(_package_to_dict(pkg))


@api_bp.post("/enquiries")
def submit_enquiry():
    data = request.get_json(silent=True) or request.form.to_dict()
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or len(name) > 120:
        return jsonify({"error": "Name is required (max 120 characters)"}), 400
    if not EMAIL_PATTERN.fullmatch(email):
        return jsonify({"error": "A valid email address is required"}), 400
    if not message or len(message) < 5:
        return jsonify({"error": "Message is required (minimum 5 characters)"}), 400

    enquiry = Enquiry(name=name, email=email, phone=phone, message=message, status="new")
    db.session.add(enquiry)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Thank you. Your enquiry has been received and our concierge will contact you.",
        "id": enquiry.id
    }), 201


@api_bp.get("/profile")
def get_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone or "",
        "address": user.address or "",
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    })


@api_bp.put("/profile")
def update_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or request.form.to_dict()
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    address = (data.get("address") or "").strip()

    if name:
        if len(name) > 120:
            return jsonify({"error": "Name exceeds 120 characters"}), 400
        user.name = name

    if phone:
        if len(phone) > 30:
            return jsonify({"error": "Phone exceeds 30 characters"}), 400
        user.phone = phone

    if address is not None:
        if len(address) > 255:
            return jsonify({"error": "Address exceeds 255 characters"}), 400
        user.address = address

    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Profile updated successfully",
        "profile": {
            "name": user.name,
            "email": user.email,
            "phone": user.phone or "",
            "address": user.address or "",
        }
    })


@api_bp.get("/bookings")
def get_customer_bookings():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    bookings = Booking.query.filter_by(customer_id=user_id).order_by(Booking.created_at.desc()).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "booking_code": b.booking_code,
            "package_name": b.package.package_name if b.package else "Custom Trip",
            "destination": b.package.destination.name if (b.package and b.package.destination) else "",
            "travel_date": b.travel_date.isoformat() if b.travel_date else None,
            "people": b.number_of_people,
            "total_amount": float(b.total_amount) if b.total_amount else 0.0,
            "status": b.booking_status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "passengers": [{"name": p.name, "email": p.email} for p in b.passengers],
        })
    return jsonify(results)


@api_bp.post("/bookings")
def create_booking():
    user_id = session.get("user_id")
    data = request.get_json(silent=True) or request.form.to_dict()

    # Determine user
    if user_id:
        user = User.query.get(user_id)
    else:
        email = (data.get("email") or "").strip().lower()
        if not email or not EMAIL_PATTERN.fullmatch(email):
            return jsonify({"error": "A valid email is required to book"}), 400
        user = User.query.filter(func.lower(User.email) == email).first()
        if not user:
            name = (data.get("name") or "Guest Traveler").strip()
            user = User(name=name, email=email, role="customer")
            user.set_password(secrets.token_urlsafe(16))
            db.session.add(user)
            db.session.flush()

    # Determine package
    package_slug = data.get("package_id") or data.get("package_slug")
    pkg = Package.query.filter_by(slug=package_slug).first()
    if not pkg:
        # Fallback by id
        try:
            pkg = Package.query.get(int(package_slug))
        except (ValueError, TypeError):
            pass
    if not pkg:
        return jsonify({"error": "Selected travel package not found"}), 404

    travel_date_str = data.get("travel_date") or data.get("date")
    if not travel_date_str:
        return jsonify({"error": "Travel date is required"}), 400
    try:
        travel_date_val = datetime.strptime(travel_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if travel_date_val < date.today():
        return jsonify({"error": "Travel date cannot be in the past"}), 400

    people = int(data.get("number_of_people") or data.get("people") or 1)
    if people < 1 or people > 20:
        return jsonify({"error": "Number of travellers must be between 1 and 20"}), 400

    total_amount = Decimal(pkg.price) * Decimal(people)
    booking_code = f"TB-{secrets.token_hex(4).upper()}"

    booking = Booking(
        booking_code=booking_code,
        customer_id=user.id,
        package_id=pkg.id,
        travel_date=travel_date_val,
        number_of_people=people,
        total_amount=total_amount,
        booking_status="pending",
    )
    db.session.add(booking)
    db.session.flush()

    # Optional passengers
    passengers_data = data.get("passengers") or []
    if isinstance(passengers_data, list):
        for p in passengers_data:
            if isinstance(p, dict) and p.get("name"):
                bp = BookingPassenger(
                    booking_id=booking.id,
                    name=p.get("name", "").strip(),
                    email=p.get("email", "").strip(),
                )
                db.session.add(bp)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": f"Booking request {booking_code} created successfully!",
        "booking_code": booking_code,
        "id": booking.id,
        "total_amount": float(total_amount),
        "status": "pending",
    }), 201
