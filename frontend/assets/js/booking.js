function setupProfileForm() {
  const form = document.querySelector("#profile-form");

  if (!form) {
    return;
  }

  const storageKey = "travelbase-profile";
  const fields = ["name", "email", "phone", "address"].map((name) =>
    form.elements.namedItem(name),
  );
  const savedProfile = JSON.parse(localStorage.getItem(storageKey) || "null");

  if (savedProfile) {
    Object.entries(savedProfile).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);

      if (field) {
        field.value = value;
      }
    });
  }

  // Attempt live profile sync from MySQL database
  async function loadBackendProfile() {
    try {
      const res = await fetch("/api/profile", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        ["name", "email", "phone", "address"].forEach((key) => {
          const f = form.elements.namedItem(key);
          if (f && data[key]) {
            f.value = data[key];
          }
        });
      }
    } catch (_) {}
  }
  loadBackendProfile();

  document.querySelector("#edit-profile").addEventListener("click", () => {
    fields.forEach((field) => {
      field.readOnly = false;
    });

    document.querySelector("#save-profile").disabled = false;
    document.querySelector("#edit-profile").disabled = true;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const profile = Object.fromEntries(
      ["name", "email", "phone", "address"].map((name) => [
        name,
        form.elements.namedItem(name).value,
      ]),
    );

    localStorage.setItem(storageKey, JSON.stringify(profile));

    fields.forEach((field) => {
      field.readOnly = true;
    });

    document.querySelector("#save-profile").disabled = true;
    document.querySelector("#edit-profile").disabled = false;

    // Persist to MySQL backend if active
    try {
      let csrfToken = "";
      try {
        const tokenRes = await fetch("/csrf-token", { credentials: "same-origin" });
        if (tokenRes.ok) {
          const t = await tokenRes.json();
          csrfToken = t.token;
        }
      } catch (_) {}

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        showMessage(
          document.querySelector("#profile-message"),
          "Profile successfully updated in database.",
          "success",
        );
        if (window.showToast) window.showToast("Profile updated!", "success");
        return;
      }
    } catch (_) {}

    showMessage(
      document.querySelector("#profile-message"),
      "Profile changes saved in this browser demo.",
      "success",
    );
  });
}

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const demoBookingsStorageKey = "travelbase-bookings";

function isValidTravelDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    getLocalDateString(new Date(`${value}T00:00:00`)) === value
  );
}

function isValidDemoBooking(booking) {
  return (
    booking &&
    typeof booking.id === "string" &&
    typeof booking.packageId === "string" &&
    typeof booking.packageName === "string" &&
    typeof booking.destination === "string" &&
    isValidTravelDate(booking.travelDate) &&
    Number.isInteger(booking.passengers) &&
    booking.passengers >= 1 &&
    booking.passengers <= 8 &&
    Number.isFinite(booking.total) &&
    booking.total >= 0 &&
    booking.status === "Requested"
  );
}

function readDemoBookings() {
  const savedBookings = localStorage.getItem(demoBookingsStorageKey);

  if (savedBookings === null) {
    return [];
  }

  const bookings = JSON.parse(savedBookings);

  if (!Array.isArray(bookings) || bookings.some((booking) => !isValidDemoBooking(booking))) {
    throw new TypeError("Saved booking data has an unexpected format.");
  }

  return bookings;
}

function saveDemoBookings(bookings) {
  localStorage.setItem(demoBookingsStorageKey, JSON.stringify(bookings));
}

function showBookingStorageError(messageElement, error) {
  console.error("Unable to access saved demo bookings.", error);
  showMessage(
    messageElement,
    "Saved booking data could not be accessed in this browser. Check browser storage and try again.",
    "error",
  );
}

function setupBookingForm() {
  const form = document.querySelector("#booking-form");

  if (!form) {
    return;
  }

  const packageId = new URLSearchParams(location.search).get("id");
  const trip = travelPackages.find((item) => item.id === packageId) || travelPackages[0];
  const passengerCount = document.querySelector("#passenger-count");
  const travelDate = document.querySelector("#travel-date");
  const searchDate = localStorage.getItem("travelbase-search-date");
  const passengerSummary = document.querySelector("#summary-passengers");
  const totalSummary = document.querySelector("#summary-total");

  travelDate.min = getLocalDateString(new Date());

  if (searchDate && searchDate >= travelDate.min) {
    travelDate.value = searchDate;
  }

  document.querySelector("#booking-package").innerHTML = `
    <img class="thumb" style="width: 100%; height: 180px" src="${trip.image}" alt="${trip.destination}">
    <h2 style="margin: 15px 0 5px; color: var(--navy)">${trip.name}</h2>
    <p class="text-muted">${trip.destination} · ${trip.days} days / ${trip.nights} nights</p>
    <p><strong>${formatINR(trip.price)}</strong> per person</p>`;

  function updateTotal() {
    const count = Number(passengerCount.value) || 1;
    passengerSummary.textContent = count;
    totalSummary.textContent = formatINR(trip.price * count);
  }

  passengerCount.addEventListener("input", updateTotal);
  passengerCount.addEventListener("change", () => {
    const count = Math.max(1, Math.min(8, Number(passengerCount.value) || 1));
    const fields = document.querySelector("#passenger-fields");

    passengerCount.value = count;
    updateTotal();

    const currentCount = fields.querySelectorAll(".passenger").length;

    for (let index = currentCount + 1; index <= count; index += 1) {
      fields.insertAdjacentHTML(
        "beforeend",
        `
          <fieldset class="passenger">
            <h3>Passenger ${index}</h3>
            <div class="form-grid">
              <div class="field">
                <label for="passenger-${index}-name">Full name</label>
                <input id="passenger-${index}-name" name="passenger${index}Name" required autocomplete="name">
              </div>
              <div class="field">
                <label for="passenger-${index}-email">Email</label>
                <input id="passenger-${index}-email" name="passenger${index}Email" type="email" required autocomplete="email">
              </div>
            </div>
          </fieldset>`,
      );
    }

    while (fields.querySelectorAll(".passenger").length > count) {
      fields.lastElementChild.remove();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const minimumDate = getLocalDateString(new Date());
    travelDate.min = minimumDate;

    if (!form.reportValidity()) {
      return;
    }

    if (travelDate.value < minimumDate) {
      showMessage(
        document.querySelector("#booking-message"),
        "Choose a travel date that has not passed.",
        "error",
      );
      travelDate.focus();
      return;
    }

    const count = Number(passengerCount.value) || 1;
    let serverBookingCode = null;

    try {
      let csrfToken = "";
      try {
        const tokenRes = await fetch("/csrf-token", { credentials: "same-origin" });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          csrfToken = tokenData.token;
        }
      } catch (_) {}

      const passengersList = [];
      for (let i = 1; i <= count; i += 1) {
        const pName = form.elements.namedItem(`passenger${i}Name`)?.value;
        const pEmail = form.elements.namedItem(`passenger${i}Email`)?.value;
        if (pName) passengersList.push({ name: pName, email: pEmail });
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
          package_id: trip.id,
          travel_date: travelDate.value,
          number_of_people: count,
          passengers: passengersList,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        serverBookingCode = data.booking_code;
      }
    } catch (_) {}

    const booking = {
      id: serverBookingCode || `TB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      packageId: trip.id,
      packageName: trip.name,
      destination: trip.destination,
      travelDate: travelDate.value,
      passengers: count,
      total: trip.price * count,
      status: serverBookingCode ? "Confirmed Request" : "Requested",
    };

    try {
      saveDemoBookings([booking, ...readDemoBookings()]);
    } catch (error) {
      showBookingStorageError(document.querySelector("#booking-message"), error);
      return;
    }

    const msg = serverBookingCode
      ? `Booking request ${serverBookingCode} has been successfully submitted and saved to your TravelBase account!`
      : `Request ${booking.id} saved in your bookings list.`;

    showMessage(document.querySelector("#booking-message"), msg, "success");
    if (window.showToast) {
      window.showToast(`Booking ${booking.id} created!`, "success", 4500);
    }
  });

  updateTotal();
}

function setupSavedBookings() {
  const table = document.querySelector("#my-bookings-table");

  if (!table) {
    return;
  }

  const message = document.querySelector("#my-bookings-message");
  const tableBody = table.tBodies[0];

  async function renderBookings() {
    // Attempt live fetch from MySQL backend
    try {
      const res = await fetch("/api/bookings", { credentials: "same-origin" });
      if (res.ok) {
        const liveBookings = await res.json();
        if (Array.isArray(liveBookings) && liveBookings.length > 0) {
          tableBody.innerHTML = "";
          liveBookings.forEach((b) => {
            const row = tableBody.insertRow();
            const badgeClass = b.status === "confirmed" ? "badge-success" : (b.status === "cancelled" ? "badge-danger" : "badge-warning");
            row.innerHTML = `
              <td><strong>${escapeHTML(b.booking_code)}</strong></td>
              <td>${escapeHTML(b.package_name)}</td>
              <td>${b.travel_date || "Flexible"}</td>
              <td>${b.people}</td>
              <td>${formatINR(b.total_amount)}</td>
              <td><span class="badge ${badgeClass}">${escapeHTML(b.status)}</span></td>
              <td><span class="text-muted" style="font-size:0.85rem">Confirmed in DB</span></td>
            `;
          });
          return;
        }
      }
    } catch (_) {}

    tableBody.querySelectorAll("[data-demo-booking]").forEach((row) => row.remove());

    let bookings;

    try {
      bookings = readDemoBookings();
    } catch (error) {
      showBookingStorageError(message, error);
      return;
    }

    bookings.slice().reverse().forEach((booking) => {
      const row = tableBody.insertRow(0);
      row.dataset.demoBooking = booking.id;

      [
        booking.id,
        booking.packageName,
        new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(`${booking.travelDate}T00:00:00`)),
        String(booking.passengers),
        formatINR(booking.total),
      ].forEach((value) => {
        row.insertCell().textContent = value;
      });

      const statusCell = row.insertCell();
      const badge = document.createElement("span");
      badge.className = "badge badge-warning";
      badge.textContent = booking.status;
      statusCell.appendChild(badge);

      const actionCell = row.insertCell();
      const cancelButton = document.createElement("button");
      cancelButton.className = "btn btn-outline btn-sm";
      cancelButton.type = "button";
      cancelButton.textContent = "Cancel";
      cancelButton.addEventListener("click", () => {
        if (!confirm("Remove this booking request from this browser?")) {
          return;
        }

        try {
          saveDemoBookings(readDemoBookings().filter((saved) => saved.id !== booking.id));
          renderBookings();
        } catch (error) {
          showBookingStorageError(message, error);
        }
      });
      actionCell.appendChild(cancelButton);
    });
  }

  renderBookings();
}

document.addEventListener("DOMContentLoaded", () => {
  setupProfileForm();
  setupBookingForm();
  setupSavedBookings();
});
