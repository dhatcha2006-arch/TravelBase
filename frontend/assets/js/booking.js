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

    showMessage(
      document.querySelector("#booking-message"),
      "Your trip request is ready. This demo does not submit a booking or collect payment.",
      "success",
    );
  });

  updateTotal();
}

document.addEventListener("DOMContentLoaded", () => {
  setupProfileForm();
  setupBookingForm();
});
