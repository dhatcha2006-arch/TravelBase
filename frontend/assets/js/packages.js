function renderPackageCards(packages, target) {
  if (!target) {
    return;
  }

  target.innerHTML = packages.length
    ? packages.map(packageCard).join("")
    : '<div class="empty-state">No packages match those filters. Try adjusting your search.</div>';
}

function setupPackageCatalog() {
  const packageList = document.querySelector("#package-list");

  if (!packageList) {
    return;
  }

  const search = document.querySelector("#package-search");
  const maxPrice = document.querySelector("#price-filter");
  const maxDuration = document.querySelector("#duration-filter");
  const sortOrder = document.querySelector("#sort-filter");

  function updatePackageList() {
    const query = search.value.trim().toLowerCase();
    let matchingPackages = travelPackages.filter((trip) =>
      `${trip.name} ${trip.destination}`.toLowerCase().includes(query),
    );

    if (maxPrice.value) {
      matchingPackages = matchingPackages.filter(
        (trip) => trip.price <= Number(maxPrice.value),
      );
    }

    if (maxDuration.value) {
      matchingPackages = matchingPackages.filter(
        (trip) => trip.days <= Number(maxDuration.value),
      );
    }

    if (sortOrder.value === "low") {
      matchingPackages.sort((first, second) => first.price - second.price);
    } else if (sortOrder.value === "high") {
      matchingPackages.sort((first, second) => second.price - first.price);
    }

    renderPackageCards(matchingPackages, packageList);
    document.querySelector("#result-count").textContent =
      `${matchingPackages.length} thoughtfully planned trips`;
  }

  [search, maxPrice, maxDuration, sortOrder].forEach((input) => {
    input.addEventListener("input", updatePackageList);
    input.addEventListener("change", updatePackageList);
  });

  updatePackageList();
}

function renderPackageDetails() {
  const details = document.querySelector("#package-detail");

  if (!details) {
    return;
  }

  const packageId = new URLSearchParams(location.search).get("id");
  const trip = travelPackages.find((item) => item.id === packageId) || travelPackages[0];
  const itinerary = trip.itinerary
    .map(
      (activity, index) => `
        <article>
          <h4>Day ${index + 1}</h4>
          <div>${activity}</div>
        </article>`,
    )
    .join("");

  document.title = `${trip.name} | TravelBase`;
  details.innerHTML = `
    <div>
      <img class="gallery-main" src="${trip.image}" alt="${trip.destination}">
      <section class="detail-section">
        <span class="eyebrow">${trip.destination}</span>
        <h1>${trip.name}</h1>
        <p class="text-muted">${trip.description}</p>
        <p><strong>${trip.days} days · ${trip.nights} nights</strong></p>
      </section>
      <section class="detail-section">
        <h3>What's included</h3>
        <ul class="detail-list">${trip.includes.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h3>Not included</h3>
        <ul class="detail-list">${trip.excludes.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
      <section class="detail-section">
        <h3>Your itinerary</h3>
        <div class="itinerary">${itinerary}</div>
      </section>
      <section class="detail-section">
        <h3>Stay & getting around</h3>
        <p><strong>Accommodation:</strong> ${trip.hotel}</p>
        <p><strong>Transport:</strong> ${trip.transport}</p>
      </section>
      <section class="detail-section">
        <h3>Cancellation policy</h3>
        <p>${trip.policy}</p>
      </section>
    </div>
    <aside class="detail-card">
      <span class="eyebrow">From</span>
      <h2>${formatINR(trip.price)} <small class="text-muted">/ person</small></h2>
      <p class="text-muted">${trip.days} days · ${trip.nights} nights</p>
      <a class="btn btn-primary" style="width: 100%" href="${route("pages/customer/booking.html")}?id=${trip.id}">
        Book this trip
      </a>
      <p class="notice">No payment is collected in this frontend demo.</p>
    </aside>`;
}

function setupHomeSearch() {
  const searchForm = document.querySelector("#hero-search");

  if (!searchForm) {
    return;
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const destination = document.querySelector("#hero-destination").value.trim();
    const travelDate = document.querySelector("#hero-date").value;
    const budget = document.querySelector("#hero-budget").value;

    if (travelDate) {
      localStorage.setItem("travelbase-search-date", travelDate);
    } else {
      localStorage.removeItem("travelbase-search-date");
    }

    const query = new URLSearchParams();

    if (destination) {
      query.set("search", destination);
    }

    if (budget) {
      query.set("budget", budget);
    }

    const queryString = query.toString();
    location.href = `${route("pages/packages.html")}${queryString ? `?${queryString}` : ""}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const featuredPackages = ["golden-triangle", "kerala-backwaters", "jaipur-heritage"]
    .map((id) => travelPackages.find((trip) => trip.id === id))
    .filter(Boolean);

  renderPackageCards(
    featuredPackages,
    document.querySelector("#featured-packages"),
  );

  const query = new URLSearchParams(location.search);
  const search = document.querySelector("#package-search");
  const maxPrice = document.querySelector("#price-filter");

  if (search && query.has("search")) {
    search.value = query.get("search");
  }

  if (maxPrice && query.has("budget")) {
    maxPrice.value = query.get("budget");
  }

  setupPackageCatalog();
  renderPackageDetails();
  setupHomeSearch();
});
