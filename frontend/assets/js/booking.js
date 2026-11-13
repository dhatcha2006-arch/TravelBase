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

  document.querySelector("#edit-profile").addEventListener("click", () => {
    fields.forEach((field) => {
      field.readOnly = false;
    });

    document.querySelector("#save-profile").disabled = false;
    document.querySelector("#edit-profile").disabled = true;
  });

  form.addEventListener("submit", (event) => {
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

  form.addEventListener("submit", (event) => {
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

    const booking = {
      id: `TB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      packageId: trip.id,
      packageName: trip.name,
      destination: trip.destination,
      travelDate: travelDate.value,
      passengers: Number(passengerCount.value),
      total: trip.price * Number(passengerCount.value),
      status: "Requested",
    };

    try {
      saveDemoBookings([booking, ...readDemoBookings()]);
    } catch (error) {
      showBookingStorageError(document.querySelector("#booking-message"), error);
      return;
    }

    showMessage(
      document.querySelector("#booking-message"),
      `Request ${booking.id} saved in this browser only. It was not sent to TravelBase and no payment was collected.`,
      "success",
    );
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

  function renderBookings() {
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
