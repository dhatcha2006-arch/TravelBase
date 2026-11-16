# TravelBase — Handcrafted Luxury Journeys & Boutique Expeditions

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask 3.0](https://img.shields.io/badge/Flask-3.0.3-green.svg)](https://flask.palletsprojects.com/)
[![Bootstrap 5.3](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

TravelBase is a modern, luxury travel booking and agency management platform. It pairs a sophisticated client-facing boutique experience with a comprehensive management portal for administrators and customers.

----

## 🌟 Features & Highlights

- **Boutique Visual Identity**: Bespoke luxury design system (`tb-design-system.css`) with deep forest green (`#2F4E3E`) and muted gold (`#C4A96A`) palettes, Cormorant Garamond typography, and fluid micro-interactions.
- **Dynamic Package Directory**: Interactive filter pills (Beach & Islands, Nature & Alps, Culture & Heritage, Coastal Escapes, Adventure & Passes), live keyword search, price/duration filters, and real-time counter.
- **Glassmorphic Navigation & UX**: Responsive sticky header with scroll backdrop blur, active route indicators, smooth floating back-to-top button, and lightweight toast notification alerts.
- **Customer & Admin Portals**: Dedicated portals for customer bookings, itineraries, profiles, and administrative package management, customer lists, payments, and analytics reports.
- **Robust Flask Backend Foundation**: SQLAlchemy ORM with MySQL support, password hashing with Werkzeug, session-based CSRF protection, and role-based access control.

---

## 🔒 Security & API Protection Guidelines

> **IMPORTANT**: NEVER commit `.env`, private keys, API credentials, or database passwords to GitHub.

- **Environment Isolation**: All confidential configuration is isolated in `.env` (or `backend/.env`), which is strictly excluded via `.gitignore`.
- **API Secret Keys**: Third-party API keys (Google Maps, OpenWeather, Stripe, Razorpay) must only be specified in your local `.env` and loaded via environment variables in `backend/config.py`.
- **Template Safety**: Public repositories only contain `.env.example` templates with sanitized placeholders (`your_secure_flask_secret_key_here`).
- **CSRF & Session Security**: Form endpoints and JSON fetch requests require a valid `X-CSRF-Token` header or form token to prevent cross-site request forgery.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10 or higher
- MySQL 8.0+ (or MariaDB)
- Modern web browser

### 2. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE travelbase_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Environment Setup
Copy the sample environment configuration:
```bash
cp .env.example .env
# or on Windows:
# copy .env.example .env
```
Edit `.env` (or `backend/.env`) to set your database password and generate a random `FLASK_SECRET_KEY`:
```python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Install Dependencies
```bash
# Create and activate virtual environment
python3 -m venv backend/.venv
source backend/.venv/bin/activate  # On Windows: backend\.venv\Scripts\activate

# Install requirements
pip install -r backend/requirements.txt
```

### 5. Initialize & Seed Admin Account
```bash
flask --app backend.app:create_app init-db
python -m backend.seed_admin
```

### 6. Run the Application
```bash
python -m backend.run
```
Visit **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser:
- Public Homepage: `/`
- Curated Journeys: `/packages`
- Sign In / Client Access: `/login`
- Customer Registration: `/register`

---

## 🧪 Testing

To run the automated test suites:

```bash
# Backend unit & auth tests
./backend/.venv/bin/python -m unittest discover backend/tests

# Frontend booking validation tests
node frontend/tests/booking.test.js
```

---

## 🤝 Collaboration & Contributing

This project is maintained across collaborative forks:
- **Upstream Repository**: [dhatcha2006-arch/TravelBase](https://github.com/dhatcha2006-arch/TravelBase)
- **Fork**: [ARIPRAKASH32/TravelBase](https://github.com/ARIPRAKASH32/TravelBase)

### Contribution Workflow:
1. Sync upstream changes:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```
2. Create modular, descriptive commits for each feature or bug fix.
3. Push to your fork:
   ```bash
   git push origin main
   ```
4. Open a Pull Request from `ARIPRAKASH32/TravelBase:main` to `dhatcha2006-arch/TravelBase:main`.
