# TravelBase frontend

This is a static HTML, CSS and JavaScript demo. It uses Bootstrap 5, Bootstrap Icons and Chart.js from their public CDNs; destination photography is served by Unsplash. An internet connection is required for those assets.

The sample package catalogue includes Indian destinations such as Agra, Kerala, Jaipur and Ladakh. Prices are displayed in Indian rupees (INR).

## Run locally

From the project directory, start Python's static file server:

```powershell
python -m http.server 8000 --directory frontend
```

Then open [http://localhost:8000](http://localhost:8000). You can also open `frontend/index.html` directly, but a local server gives the most consistent browser behavior.

The public pages are available from the home-page navigation. Customer pages are under `pages/customer/`, and admin pages are under `pages/admin/`. Use the shared login page at `pages/login.html` to preview the sign-in flow; authentication and booking submission are intentionally not implemented without the Flask API.

Admin package and destination edits, booking status actions, and the customer profile are frontend demos only. The profile is saved in browser local storage; admin edits are held in memory. No payment is processed and no data is sent to a server.


