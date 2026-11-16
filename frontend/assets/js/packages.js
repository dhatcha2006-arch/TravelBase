function renderPackageCards(packages, target) {
  if (!target) {
    return;
  }

  if (packages.length) {
    target.innerHTML = packages.map(packageCard).join("");
  } else {
    target.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px;">
        <div style="font-size: 2.8rem; color: var(--tb-moss); margin-bottom: 14px;"><i class="bi bi-compass"></i></div>
        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 8px;">No Journeys Found</h3>
        <p class="text-muted" style="max-width: 480px; margin: 0 auto 20px;">No packages match your selected criteria. Try adjusting your filters or clearing search terms.</p>
        <button type="button" id="reset-catalog-filters" class="btn btn-primary btn-sm">Clear All Filters</button>
      </div>`;

    const resetBtn = target.querySelector("#reset-catalog-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const search = document.querySelector("#package-search");
        const maxPrice = document.querySelector("#price-filter");
        const maxDuration = document.querySelector("#duration-filter");
        const sortOrder = document.querySelector("#sort-filter");
        if (search) search.value = "";
        if (maxPrice) maxPrice.value = "";
        if (maxDuration) maxDuration.value = "";
        if (sortOrder) sortOrder.value = "";

        document.querySelectorAll(".category-pill").forEach((p) => {
          const isAll = p.dataset.category === "all";
          p.classList.toggle("active", isAll);
          p.setAttribute("aria-selected", String(isAll));
        });

        if (window._triggerCatalogUpdate) {
          window._triggerCatalogUpdate("all");
        }
      });
    }
  }
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
  let activeCategory = "all";

  // Attempt live MySQL fetch from Flask backend with seamless static fallback
  async function syncLiveCatalog() {
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const livePackages = await res.json();
        if (Array.isArray(livePackages) && livePackages.length > 0) {
          window._activePackageSource = livePackages;
          updatePackageList();
        }
      }
    } catch (_) {
      // Running statically without backend
    }
  }

  function updatePackageList(categoryOverride) {
    if (typeof categoryOverride === "string") {
      activeCategory = categoryOverride;
    }

    const dataSource = window._activePackageSource || travelPackages;
    const query = search.value.trim().toLowerCase();
    let matchingPackages = dataSource.filter((trip) =>
      `${trip.name} ${trip.destination}`.toLowerCase().includes(query),
    );

    if (activeCategory && activeCategory !== "all") {
      matchingPackages = matchingPackages.filter(
        (trip) => (trip.category || "").toLowerCase() === activeCategory.toLowerCase(),
      );
    }

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
    const countEl = document.querySelector("#result-count");
    if (countEl) {
      countEl.textContent = `${matchingPackages.length} thoughtfully planned ${matchingPackages.length === 1 ? "trip" : "trips"}`;
    }
  }

  window._triggerCatalogUpdate = updatePackageList;

  // Setup category pill buttons
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".category-pill").forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");
      activeCategory = pill.dataset.category || "all";
      updatePackageList();
    });
  });

  [search, maxPrice, maxDuration, sortOrder].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => updatePackageList());
      input.addEventListener("change", () => updatePackageList());
    }
  });

  updatePackageList();
  syncLiveCatalog();
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
      <a class="btn btn-primary btn-lg" style="width: 100%" href="${route("pages/customer/booking.html")}?id=${trip.id}">
        <i class="bi bi-calendar-check" style="margin-right: 8px;"></i> Book This Journey
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

