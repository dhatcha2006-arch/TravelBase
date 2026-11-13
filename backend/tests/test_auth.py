import unittest

from sqlalchemy import inspect

from backend.app import create_app, db
from backend.app.models import User


class AuthenticationTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                "TESTING": True,
                "SECRET_KEY": "test-key",
                "SQLALCHEMY_DATABASE_URI": "sqlite://",
                "SESSION_COOKIE_SECURE": False,
            }
        )
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
            admin = User(name="Admin", email="admin@example.com", role="admin")
            admin.set_password("admin-password")
            customer = User(name="Customer", email="customer@example.com")
            customer.set_password("customer-password")
            db.session.add_all([admin, customer])
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.engine.dispose()

    def _csrf_token(self):
        response = self.client.get("/csrf-token")
        self.assertEqual(response.status_code, 200)
        return response.get_json()["token"]

    def test_password_is_hashed_and_login_redirects_by_role(self):
        with self.app.app_context():
            user = User.query.filter_by(email="admin@example.com").one()
            self.assertNotEqual(user.password_hash, "admin-password")
            self.assertTrue(user.check_password("admin-password"))

        response = self.client.post(
            "/login",
            data={"email": "admin@example.com", "password": "admin-password"},
            headers={"X-CSRF-Token": self._csrf_token()},
        )
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/admin/dashboard"))

    def test_missing_csrf_token_rejects_login(self):
        response = self.client.post(
            "/login", data={"email": "admin@example.com", "password": "admin-password"}
        )
        self.assertEqual(response.status_code, 400)

    def test_init_db_command_creates_tables(self):
        result = self.app.test_cli_runner().invoke(args=["init-db"])
        self.assertEqual(result.exit_code, 0, result.output)
        with self.app.app_context():
            self.assertTrue(inspect(db.engine).has_table("users"))
            self.assertTrue(inspect(db.engine).has_table("booking_passengers"))

    def test_customer_cannot_open_admin_dashboard(self):
        response = self.client.post(
            "/login",
            data={
                "email": "customer@example.com",
                "password": "customer-password",
            },
            headers={"X-CSRF-Token": self._csrf_token()},
        )
        self.assertEqual(response.status_code, 302)
        forbidden = self.client.get("/admin/dashboard")
        self.assertEqual(forbidden.status_code, 403)
        static_forbidden = self.client.get("/pages/admin/dashboard.html")
        self.assertEqual(static_forbidden.status_code, 302)
        self.assertTrue(static_forbidden.location.endswith("/customer/dashboard"))

    def test_registration_creates_customer_with_hashed_password(self):
        response = self.client.post(
            "/register",
            data={
                "name": "New Customer",
                "email": "new@example.com",
                "phone": "+1 503 555 0142",
                "password": "a-secure-password",
                "confirmPassword": "a-secure-password",
                "role": "admin",
            },
            headers={"X-CSRF-Token": self._csrf_token()},
        )
        self.assertEqual(response.status_code, 302)
        with self.app.app_context():
            user = User.query.filter_by(email="new@example.com").one()
            self.assertEqual(user.role, "customer")
            self.assertTrue(user.check_password("a-secure-password"))

    def test_logout_clears_the_customer_session(self):
        self.client.post(
            "/login",
            data={
                "email": "customer@example.com",
                "password": "customer-password",
            },
            headers={"X-CSRF-Token": self._csrf_token()},
        )
        response = self.client.post(
            "/logout", headers={"X-CSRF-Token": self._csrf_token()}
        )
        self.assertEqual(response.status_code, 302)
        login_page = self.client.get("/customer/dashboard")
        self.assertEqual(login_page.status_code, 302)
        self.assertTrue(login_page.location.endswith("/login"))


if __name__ == "__main__":
    unittest.main()
