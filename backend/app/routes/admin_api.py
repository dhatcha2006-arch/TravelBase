from decimal import Decimal
import re
from flask import Blueprint, jsonify, request, session
from sqlalchemy import func

from backend.app import db
from backend.app.models import Booking, Destination, Package, Payment, User
from backend.app.utils.permissions import role_required

admin_api_bp = Blueprint("admin_api", __name__, url_prefix="/api/admin")


@admin_api_bp.before_request
def verify_admin_session():
    if not session.get("user_id"):
        return jsonify({"error": "Authentication required"}), 401
    if session.get("role") != "admin":
        return jsonify({"error": "Admin privilege required"}), 403
    return None


@admin_api_bp.get("/stats")
def get_admin_stats():
    total_customers = User.query.filter_by(role="customer").count()
    total_packages = Package.query.count()
    total_bookings = Booking.query.count()
    confirmed_bookings = Booking.query.filter_by(booking_status="confirmed").count()
    pending_bookings = Booking.query.filter_by(booking_status="pending").count()

    total_revenue_result = (
        db.session.query(func.sum(Booking.total_amount))
        .filter(Booking.booking_status == "confirmed")
        .scalar()
    )
    total_revenue = float(total_revenue_result) if total_revenue_result else 0.0

    recent_bookings = (
        Booking.query.order_by(Booking.created_at.desc())
        .limit(6)
        .all()
    )

    recent_list = []
    for b in recent_bookings:
        recent_list.append({
            "id": b.id,
            "code": b.booking_code,
            "customer": b.customer.name if b.customer else "Unknown",
            "package": b.package.package_name if b.package else "Custom Trip",
            "date": b.travel_date.isoformat() if b.travel_date else None,
            "amount": float(b.total_amount) if b.total_amount else 0.0,
            "status": b.booking_status,
        })

    return jsonify({
        "total_customers": total_customers,
        "total_packages": total_packages,
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed_bookings,
        "pending_bookings": pending_bookings,
        "total_revenue": total_revenue,
        "recent_bookings": recent_list,
    })


@admin_api_bp.post("/packages")
def create_admin_package():
    data = request.get_json(silent=True) or request.form.to_dict()
    name = (data.get("name") or data.get("package_name") or "").strip()
    if not name:
        return jsonify({"error": "Package name is required"}), 400

    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    if Package.query.filter_by(slug=slug).first():
        slug = f"{slug}-{Package.query.count() + 1}"

    dest_name = (data.get("destination") or "").strip()
    dest = Destination.query.filter(func.lower(Destination.name) == dest_name.lower()).first()
    if not dest and dest_name:
        dest = Destination(name=dest_name, location=dest_name, description="")
        db.session.add(dest)
        db.session.flush()

    pkg = Package(
        slug=slug,
        destination_id=dest.id if dest else None,
        package_name=name,
        description=data.get("description", ""),
        duration=int(data.get("days") or data.get("duration") or 5),
        nights=int(data.get("nights") or 4),
        category=data.get("category", "General"),
        price=Decimal(str(data.get("price") or 25000)),
        image=data.get("image", ""),
        status="active",
        includes=data.get("includes") if isinstance(data.get("includes"), list) else [],
        excludes=data.get("excludes") if isinstance(data.get("excludes"), list) else [],
        hotel=data.get("hotel", ""),
        transport=data.get("transport", ""),
        itinerary=data.get("itinerary") if isinstance(data.get("itinerary"), list) else [],
        policy=data.get("policy", ""),
    )
    db.session.add(pkg)
    db.session.commit()

    return jsonify({"success": True, "message": f"Package {name} created successfully", "slug": slug}), 201


@admin_api_bp.put("/packages/<slug>")
def update_admin_package(slug):
    pkg = Package.query.filter_by(slug=slug).first()
    if not pkg:
        return jsonify({"error": "Package not found"}), 404

    data = request.get_json(silent=True) or request.form.to_dict()
    if "name" in data or "package_name" in data:
        pkg.package_name = data.get("name") or data.get("package_name")
    if "price" in data:
        pkg.price = Decimal(str(data["price"]))
    if "description" in data:
        pkg.description = data["description"]
    if "category" in data:
        pkg.category = data["category"]
    if "days" in data or "duration" in data:
        pkg.duration = int(data.get("days") or data.get("duration"))
    if "image" in data:
        pkg.image = data["image"]
    if "status" in data:
        pkg.status = data["status"]

    db.session.commit()
    return jsonify({"success": True, "message": "Package updated successfully"})


@admin_api_bp.delete("/packages/<slug>")
def delete_admin_package(slug):
    pkg = Package.query.filter_by(slug=slug).first()
    if not pkg:
        return jsonify({"error": "Package not found"}), 404

    pkg.status = "archived"
    db.session.commit()
    return jsonify({"success": True, "message": "Package archived successfully"})


@admin_api_bp.post("/destinations")
def create_admin_destination():
    data = request.get_json(silent=True) or request.form.to_dict()
    name = (data.get("name") or "").strip()
    location = (data.get("location") or name).strip()
    if not name:
        return jsonify({"error": "Destination name is required"}), 400

    dest = Destination(
        name=name,
        location=location,
        description=data.get("description", "").strip(),
        image=data.get("image", "").strip(),
    )
    db.session.add(dest)
    db.session.commit()
    return jsonify({"success": True, "message": f"Destination {name} created", "id": dest.id}), 201


@admin_api_bp.put("/destinations/<int:id>")
def update_admin_destination(id):
    dest = Destination.query.get(id)
    if not dest:
        return jsonify({"error": "Destination not found"}), 404

    data = request.get_json(silent=True) or request.form.to_dict()
    if "name" in data:
        dest.name = data["name"].strip()
    if "location" in data:
        dest.location = data["location"].strip()
    if "description" in data:
        dest.description = data["description"].strip()
    if "image" in data:
        dest.image = data["image"].strip()

    db.session.commit()
    return jsonify({"success": True, "message": "Destination updated successfully"})


@admin_api_bp.delete("/destinations/<int:id>")
def delete_admin_destination(id):
    dest = Destination.query.get(id)
    if not dest:
        return jsonify({"error": "Destination not found"}), 404

    if dest.packages:
        return jsonify({"error": "Cannot delete destination that has associated packages"}), 400

    db.session.delete(dest)
    db.session.commit()
    return jsonify({"success": True, "message": "Destination deleted successfully"})


@admin_api_bp.get("/bookings")
def get_all_admin_bookings():
    bookings = Booking.query.order_by(Booking.created_at.desc()).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "code": b.booking_code,
            "customer_name": b.customer.name if b.customer else "Unknown",
            "customer_email": b.customer.email if b.customer else "",
            "customer_phone": b.customer.phone if (b.customer and b.customer.phone) else "",
            "package_name": b.package.package_name if b.package else "Custom Trip",
            "destination": b.package.destination.name if (b.package and b.package.destination) else "",
            "travel_date": b.travel_date.isoformat() if b.travel_date else None,
            "people": b.number_of_people,
            "total_amount": float(b.total_amount) if b.total_amount else 0.0,
            "status": b.booking_status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })
    return jsonify(results)


@admin_api_bp.patch("/bookings/<int:id>/status")
def update_booking_status(id):
    booking = Booking.query.get(id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    data = request.get_json(silent=True) or request.form.to_dict()
    new_status = (data.get("status") or "").lower().strip()
    valid_statuses = {"pending", "confirmed", "cancelled", "completed"}
    if new_status not in valid_statuses:
        return jsonify({"error": f"Invalid status. Choose from: {', '.join(valid_statuses)}"}), 400

    booking.booking_status = new_status
    db.session.commit()
    return jsonify({
        "success": True,
        "message": f"Booking {booking.booking_code} status updated to {new_status}",
        "status": new_status,
    })


@admin_api_bp.get("/customers")
def get_admin_customers():
    customers = User.query.filter_by(role="customer").order_by(User.created_at.desc()).all()
    results = []
    for c in customers:
        results.append({
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone or "",
            "address": c.address or "",
            "bookings_count": len(c.bookings) if c.bookings else 0,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })
    return jsonify(results)


@admin_api_bp.get("/payments")
def get_admin_payments():
    payments = Payment.query.order_by(Payment.id.desc()).all()
    results = []
    for p in payments:
        results.append({
            "id": p.id,
            "booking_code": p.booking.booking_code if p.booking else "N/A",
            "customer_name": p.booking.customer.name if (p.booking and p.booking.customer) else "Unknown",
            "amount": float(p.amount) if p.amount else 0.0,
            "method": p.payment_method or "Online Card",
            "status": p.payment_status,
            "date": p.payment_date.isoformat() if p.payment_date else None,
        })
    return jsonify(results)
