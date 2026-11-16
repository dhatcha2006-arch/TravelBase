from datetime import date, timedelta
import unittest

from backend.app import create_app, db
from backend.app.models import Booking, Package, User


class TestAdminAndCustomerAPIs(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def _csrf_token(self):
        res = self.client.get("/csrf-token")
        return res.json["token"]

    def test_unauthenticated_admin_stats_rejected(self):
        res = self.client.get("/api/admin/stats")
        self.assertEqual(res.status_code, 401)

    def test_customer_cannot_access_admin_stats(self):
        # Login as customer
        token = self._csrf_token()
        self.client.post(
            "/login",
            data={"email": "dhatchna@gmail.com", "password": "TravelBase@123"},
            headers={"X-CSRF-Token": token},
        )
        res = self.client.get("/api/admin/stats")
        self.assertEqual(res.status_code, 403)

    def test_admin_can_access_stats(self):
        token = self._csrf_token()
        self.client.post(
            "/login",
            data={"email": "ariprakash32@gmail.com", "password": "TravelBase@123"},
            headers={"X-CSRF-Token": token},
        )
        res = self.client.get("/api/admin/stats")
        self.assertEqual(res.status_code, 200)
        self.assertIn("total_bookings", res.json)
        self.assertIn("total_customers", res.json)
        self.assertIn("total_packages", res.json)

    def test_customer_can_view_and_update_profile(self):
        token = self._csrf_token()
        self.client.post(
            "/login",
            data={"email": "dhatchna@gmail.com", "password": "TravelBase@123"},
            headers={"X-CSRF-Token": token},
        )
        res = self.client.get("/api/profile")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json["email"], "dhatchna@gmail.com")

        # Update profile
        token = self._csrf_token()
        update_res = self.client.put(
            "/api/profile",
            json={"name": "Dhatchna Traveler", "phone": "8300433976", "address": "Chennai, Tamil Nadu"},
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(update_res.status_code, 200)
        self.assertTrue(update_res.json["success"])

    def test_booking_creation_and_history(self):
        token = self._csrf_token()
        self.client.post(
            "/login",
            data={"email": "dhatchna@gmail.com", "password": "TravelBase@123"},
            headers={"X-CSRF-Token": token},
        )

        future_date = (date.today() + timedelta(days=30)).isoformat()
        token = self._csrf_token()
        book_res = self.client.post(
            "/api/bookings",
            json={
                "package_id": "kerala-backwaters",
                "travel_date": future_date,
                "number_of_people": 2,
                "passengers": [
                    {"name": "Dhatchna", "email": "dhatchna@gmail.com"},
                    {"name": "Friend", "email": "friend@example.com"},
                ],
            },
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(book_res.status_code, 201)
        self.assertTrue(book_res.json["success"])
        booking_code = book_res.json["booking_code"]

        # View in history
        history_res = self.client.get("/api/bookings")
        self.assertEqual(history_res.status_code, 200)
        codes = [b["booking_code"] for b in history_res.json]
        self.assertIn(booking_code, codes)
