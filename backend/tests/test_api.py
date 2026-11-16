import unittest

from backend.app import create_app, db
from backend.app.models import Destination, Enquiry, Package


class TestPublicAPIs(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config["TESTING"] = True
        cls.client = cls.app.test_client()

    def _csrf_token(self):
        res = self.client.get("/csrf-token")
        return res.json["token"]

    def test_get_destinations_returns_200_and_list(self):
        res = self.client.get("/api/destinations")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json, list)

    def test_get_packages_returns_active_packages(self):
        res = self.client.get("/api/packages")
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.json, list)

    def test_get_packages_filters_by_category(self):
        res = self.client.get("/api/packages?category=beach")
        self.assertEqual(res.status_code, 200)
        for item in res.json:
            self.assertEqual(item["category"].lower(), "beach")

    def test_get_packages_filters_by_search(self):
        res = self.client.get("/api/packages?search=kerala")
        self.assertEqual(res.status_code, 200)
        for item in res.json:
            self.assertTrue(
                "kerala" in item["name"].lower() or "kerala" in item["destination"].lower()
            )

    def test_get_package_detail_returns_404_for_unknown_slug(self):
        res = self.client.get("/api/packages/non-existent-package-slug")
        self.assertEqual(res.status_code, 404)

    def test_submit_enquiry_requires_valid_data(self):
        token = self._csrf_token()
        # Invalid email
        res = self.client.post(
            "/api/enquiries",
            json={"name": "Test User", "email": "invalid-email", "message": "Valid message here"},
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(res.status_code, 400)

        # Message too short
        token = self._csrf_token()
        res = self.client.post(
            "/api/enquiries",
            json={"name": "Test User", "email": "test@example.com", "message": "Hi"},
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(res.status_code, 400)

    def test_submit_enquiry_persists_to_database(self):
        token = self._csrf_token()
        res = self.client.post(
            "/api/enquiries",
            json={
                "name": "Luxury Traveler",
                "email": "concierge-test@example.com",
                "phone": "+91 9876543210",
                "message": "Interested in booking the Golden Triangle expedition.",
            },
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(res.status_code, 201)
        self.assertTrue(res.json["success"])

        with self.app.app_context():
            enquiry = Enquiry.query.filter_by(email="concierge-test@example.com").first()
            self.assertIsNotNone(enquiry)
            self.assertEqual(enquiry.name, "Luxury Traveler")
