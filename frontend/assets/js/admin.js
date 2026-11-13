function renderDashboardShell() {
  const shell = document.querySelector("#dashboard-shell");

  if (!shell) {
    return;
  }

  const role = document.body.dataset.role || "admin";
  const root = document.body.dataset.root || "../..";
  const section = document.body.dataset.section || "";
  const isCustomer = role === "customer";
  const basePath = isCustomer
    ? `${root}/pages/customer/`
    : `${root}/pages/admin/`;

  const customerLinks = [
    ["dashboard", "dashboard.html", "grid-1x2", "Overview"],
    ["bookings", "my-bookings.html", "ticket-perforated", "My bookings"],
    ["profile", "profile.html", "person", "My profile"],
  ];

  const adminLinks = [
    ["dashboard", "dashboard.html", "grid-1x2", "Dashboard"],
    ["packages", "packages.html", "map", "Packages"],
    ["destinations", "destinations.html", "geo-alt", "Destinations"],
    ["customers", "customers.html", "people", "Customers"],
    ["bookings", "bookings.html", "ticket-perforated", "Bookings"],
    ["payments", "payments.html", "credit-card", "Payments"],
    ["reports", "reports.html", "bar-chart", "Reports"],
  ];

  const links = isCustomer ? customerLinks : adminLinks;

  shell.innerHTML = `
    <div class="sidebar-backdrop"></div>
    <aside class="app-sidebar">
      <a class="brand" href="${root}/index.html">
        <i class="bi bi-compass"></i> Travel<span>Base</span>
      </a>
      <div class="side-label">${isCustomer ? "My travel" : "Management"}</div>
      ${links
        .map(
          ([key, file, icon, label]) => `
            <a class="side-link ${section === key ? "active" : ""}" href="${basePath}${file}">
              <i class="bi bi-${icon}"></i>${label}
            </a>`,
        )
        .join("")}
      <div class="side-label">TravelBase</div>
      <a class="side-link" href="${root}/index.html">
        <i class="bi bi-box-arrow-up-right"></i>Visit website
      </a>
      <a class="side-link" href="${root}/pages/login.html">
        <i class="bi bi-box-arrow-left"></i>Sign out
      </a>
    </aside>
    <header class="app-header">
      <button class="nav-toggle dashboard-toggle" aria-label="Open menu">
        <i class="bi bi-list"></i>
      </button>
      <span class="text-muted">${isCustomer ? "Customer portal" : "Administration"}</span>
      <div class="app-user">
        <span>${isCustomer ? "Alex Morgan" : "TravelBase Admin"}</span>
        <span class="avatar"><i class="bi bi-person"></i></span>
      </div>
    </header>`;

  const sidebar = shell.querySelector(".app-sidebar");
  const backdrop = shell.querySelector(".sidebar-backdrop");
  const menuButton = shell.querySelector(".dashboard-toggle");

  menuButton.addEventListener("click", () => {
    sidebar.classList.add("open");
    backdrop.classList.add("open");
  });

  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
  });
}

const adminPackages = [
  {
    id: "bali-escape",
    name: "Bali Island Escape",
    destination: "Bali, Indonesia",
    days: 7,
    price: 129000,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=75",
  },
  {
    id: "swiss-alpine",
    name: "Swiss Alpine Discovery",
    destination: "Lucerne, Switzerland",
    days: 8,
    price: 248000,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=300&q=75",
  },
  {
    id: "kyoto-culture",
    name: "Kyoto Culture Trail",
    destination: "Kyoto, Japan",
    days: 6,
    price: 174000,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=75",
  },
  {
    id: "golden-triangle",
    name: "Golden Triangle & Taj Mahal",
    destination: "Delhi, Agra & Jaipur, India",
    days: 6,
    price: 48900,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=300&q=75",
  },
  {
    id: "kerala-backwaters",
    name: "Kerala Backwaters & Hill Country",
    destination: "Kochi, Munnar & Alleppey, India",
    days: 7,
    price: 42900,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=75",
  },
  {
    id: "jaipur-heritage",
    name: "Jaipur Heritage Weekend",
    destination: "Jaipur, Rajasthan, India",
    days: 4,
    price: 26900,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=300&q=75",
  },
];

const adminDestinations = [
  {
    name: "Bali",
    location: "Indonesia",
    description: "Island culture and coastline",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=160&q=70",
  },
  {
    name: "Lucerne",
    location: "Switzerland",
    description: "Lakeside town in the Alps",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=160&q=70",
  },
  {
    name: "Kyoto",
    location: "Japan",
    description: "Historic temples and old lanes",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=160&q=70",
  },
  {
    name: "Agra",
    location: "Uttar Pradesh, India",
    description: "Home of the Taj Mahal",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=160&q=70",
  },
  {
    name: "Alleppey",
    location: "Kerala, India",
    description: "Backwater cruises and houseboats",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=160&q=70",
  },
  {
    name: "Jaipur",
    location: "Rajasthan, India",
    description: "Forts, palaces and old-city markets",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=160&q=70",
  },
];

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character];
  });
}

function setupCharts(page) {
  if (!["dashboard", "reports"].includes(page) || typeof Chart === "undefined") {
    return;
  }

  document.querySelectorAll("[data-chart]").forEach((canvas) => {
    const isReport = page === "reports";

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [
          {
            label: isReport ? "Revenue (INR)" : "Monthly revenue (INR)",
            data: [
              2480000, 3120000, 2760000, 3840000,
              4210000, 3580000, 4960000, 5275000,
            ],
            backgroundColor: "#2b85b8",
            borderRadius: 3,
            yAxisID: "revenue",
          },
          {
            label: "Bookings",
            data: [18, 24, 21, 30, 34, 29, 39, 42],
            backgroundColor: "#b7d8e9",
            borderRadius: 3,
            yAxisID: "bookings",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label(context) {
                const value = context.raw;
                return context.dataset.label.includes("Revenue")
                  ? `${context.dataset.label}: ${formatINR(value)}`
                  : `${context.dataset.label}: ${value}`;
              },
            },
          },
        },
        scales: {
          revenue: {
            beginAtZero: true,
            grid: { color: "#edf1f4" },
            ticks: {
              callback(value) {
                return formatINR(value);
              },
            },
          },
          bookings: {
            beginAtZero: true,
            position: "right",
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  });
}

function setupBookingStatusChart() {
  const canvas = document.querySelector("[data-booking-chart]");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Confirmed", "Pending", "Completed", "Cancelled"],
      datasets: [
        {
          data: [57, 19, 18, 6],
          backgroundColor: ["#25855a", "#e5a93d", "#1677b8", "#d67878"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function setupReportActions() {
  const fromDate = document.querySelector("#report-from");
  const toDate = document.querySelector("#report-to");
  const rows = [...document.querySelectorAll("#report-table tbody tr")];

  function filterRows() {
    rows.forEach((row) => {
      const reportDate = row.dataset.date;
      const beforeStart = fromDate.value && reportDate < fromDate.value;
      const afterEnd = toDate.value && reportDate > toDate.value;

      row.hidden = Boolean(beforeStart || afterEnd);
    });
  }

  fromDate.addEventListener("change", filterRows);
  toDate.addEventListener("change", filterRows);
  document
    .querySelector("#print-report")
    .addEventListener("click", () => window.print());
  document
    .querySelector("#download-report")
    .addEventListener("click", () => {
      const visibleRows = rows.filter((row) => !row.hidden);
      const tableData = [
        ["Package", "Destination", "Bookings", "Revenue (INR)", "Booking status"],
        ...visibleRows.map((row) =>
          [...row.cells].map((cell) => cell.textContent.trim()),
        ),
      ];
      const csv = tableData
        .map((row) =>
          row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
        )
        .join("\r\n");
      const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const fileUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download = "travelbase-report.csv";
      downloadLink.click();
      URL.revokeObjectURL(fileUrl);
    });
}

function setupAdmin() {
  const page = document.body.dataset.section;

  setupCharts(page);
  setupBookingStatusChart();

  if (page === "reports") {
    setupReportActions();
  }

  if (page === "packages") {
    setupPackageManagement();
  }

  if (page === "destinations") {
    setupDestinationManagement();
  }

  if (page === "customers") {
    setupCustomerActions();
  }

  if (document.querySelector("#table-search")) {
    setupTableSearch();
  }

  if (page === "bookings") {
    setupBookingActions();
  }

  if (document.querySelector("#my-bookings-table")) {
    setupTableSearch("#my-booking-search", "#my-bookings-table");

    document.querySelectorAll("[data-cancel-booking]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!confirm("Cancel this booking request?")) {
          return;
        }

        const row = button.closest("tr");
        const badge = row.querySelector(".badge");

        badge.className = "badge badge-danger";
        badge.textContent = "Cancelled";
        button.remove();
      });
    });
  }
}

function showAdminModal(title, content, onSubmit) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop open";
  backdrop.innerHTML = `
    <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-head">
        <h2 id="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Close dialog">&times;</button>
      </div>
      <div class="modal-content">${content}</div>
    </section>`;

  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  const form = backdrop.querySelector("form");

  backdrop.querySelector(".modal-close").addEventListener("click", close);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      close();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    onSubmit(new FormData(form));
    close();
  });
}

function setupPackageManagement() {
  const tableBody = document.querySelector("#admin-package-rows");
  const fields = `
    <div class="form-grid">
      <div class="field">
        <label>Package name</label>
        <input name="name" required>
      </div>
      <div class="field">
        <label>Destination</label>
        <input name="destination" required>
      </div>
      <div class="field">
        <label>Price per person (INR)</label>
        <input name="price" type="number" min="1" required>
      </div>
      <div class="field">
        <label>Duration (days)</label>
        <input name="days" type="number" min="1" required>
      </div>
      <div class="field">
        <label>Status</label>
        <select name="status">
          <option>Active</option>
          <option>Draft</option>
        </select>
      </div>
      <div class="field">
        <label>Image URL</label>
        <input name="image" type="url" required>
      </div>
    </div>
    <p class="notice">Changes stay in this page demo; connect an API to persist package records.</p>
    <div style="margin-top: 16px">
      <button class="btn btn-primary" type="submit">Save package</button>
    </div>`;

  function renderPackages() {
    tableBody.innerHTML = adminPackages
      .map(
        (trip, index) => `
          <tr>
            <td>
              <div class="table-img-name">
                <img class="thumb" src="${escapeHTML(trip.image)}" alt="">
                <strong>${escapeHTML(trip.name)}</strong>
              </div>
            </td>
            <td>${escapeHTML(trip.destination)}</td>
            <td>${formatINR(Number(trip.price))}</td>
            <td>${trip.days} days</td>
            <td>
              <span class="badge ${trip.status === "Active" ? "badge-success" : "badge-warning"}">
                ${escapeHTML(trip.status)}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn-outline btn-sm" data-edit="${index}">Edit</button>
                <button class="btn btn-outline btn-sm" data-delete="${index}">Delete</button>
              </div>
            </td>
          </tr>`,
      )
      .join("");

    tableBody.querySelectorAll("[data-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        openPackageForm(Number(button.dataset.edit));
      });
    });

    tableBody.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this package from the demo list?")) {
          return;
        }

        adminPackages.splice(Number(button.dataset.delete), 1);
        renderPackages();
      });
    });
  }

  function openPackageForm(index) {
    const packageData =
      index === null
        ? {
            name: "",
            destination: "",
            price: "",
            days: "",
            status: "Active",
            image: "",
          }
        : adminPackages[index];

    showAdminModal(
      index === null ? "Add package" : "Edit package",
      `<form id="package-edit-form">${fields}</form>`,
      (formData) => {
        const updatedPackage = Object.fromEntries(
          ["name", "destination", "price", "days", "status", "image"].map(
            (key) => [key, formData.get(key)],
          ),
        );

        updatedPackage.price = Number(updatedPackage.price);
        updatedPackage.days = Number(updatedPackage.days);

        if (index === null) {
          updatedPackage.id = `demo-${Date.now()}`;
          adminPackages.unshift(updatedPackage);
        } else {
          adminPackages[index] = {
            ...adminPackages[index],
            ...updatedPackage,
          };
        }

        renderPackages();
      },
    );

    const form = document.querySelector("#package-edit-form");

    Object.entries(packageData).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);

      if (field) {
        field.value = value;
      }
    });
  }

  document
    .querySelector("#add-package")
    .addEventListener("click", () => openPackageForm(null));

  renderPackages();
}

function setupDestinationManagement() {
  const tableBody = document.querySelector("#destination-rows");
  const fields = `
    <div class="form-grid">
      <div class="field">
        <label>Destination name</label>
        <input name="name" required>
      </div>
      <div class="field">
        <label>Country / location</label>
        <input name="location" required>
      </div>
      <div class="field wide">
        <label>Description</label>
        <textarea name="description" rows="3" required></textarea>
      </div>
      <div class="field wide">
        <label>Image URL</label>
        <input name="image" type="url" required>
      </div>
    </div>
    <p class="notice">Changes are temporary in this frontend demo.</p>
    <button class="btn btn-primary" style="margin-top: 15px" type="submit">Save destination</button>`;

  function renderDestinations() {
    tableBody.innerHTML = adminDestinations
      .map(
        (destination, index) => `
          <tr>
            <td>
              <div class="table-img-name">
                <img class="thumb" src="${escapeHTML(destination.image)}" alt="">
                <strong>${escapeHTML(destination.name)}</strong>
              </div>
            </td>
            <td>${escapeHTML(destination.location)}</td>
            <td>${escapeHTML(destination.description)}</td>
            <td>
              <div class="table-actions">
                <button class="btn btn-outline btn-sm" data-edit="${index}">Edit</button>
                <button class="btn btn-outline btn-sm" data-delete="${index}">Delete</button>
              </div>
            </td>
          </tr>`,
      )
      .join("");

    tableBody.querySelectorAll("[data-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        openDestinationForm(Number(button.dataset.edit));
      });
    });

    tableBody.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this destination from the demo list?")) {
          return;
        }

        adminDestinations.splice(Number(button.dataset.delete), 1);
        renderDestinations();
      });
    });
  }

  function openDestinationForm(index) {
    const destination =
      index === null
        ? { name: "", location: "", description: "", image: "" }
        : adminDestinations[index];

    showAdminModal(
      index === null ? "Add destination" : "Edit destination",
      `<form>${fields}</form>`,
      (formData) => {
        const updatedDestination = Object.fromEntries(
          ["name", "location", "description", "image"].map((key) => [
            key,
            formData.get(key),
          ]),
        );

        if (index === null) {
          adminDestinations.unshift(updatedDestination);
        } else {
          adminDestinations[index] = updatedDestination;
        }

        renderDestinations();
      },
    );

    const form = document.querySelector(".modal-card form");

    Object.entries(destination).forEach(([key, value]) => {
      form.elements.namedItem(key).value = value;
    });
  }

  document
    .querySelector("#add-destination")
    .addEventListener("click", () => openDestinationForm(null));

  renderDestinations();
}

function setupTableSearch(inputSelector = "#table-search", tableSelector = "#data-table") {
  const input = document.querySelector(inputSelector);
  const table =
    document.querySelector(tableSelector) || input?.closest(".panel")?.querySelector("table");

  if (!input || !table) {
    return;
  }

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    table.querySelectorAll("tbody tr").forEach((row) => {
      row.hidden = !row.textContent.toLowerCase().includes(query);
    });
  });
}

function setupBookingActions() {
  document.querySelectorAll("[data-booking-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.bookingAction;
      const row = button.closest("tr");

      if (action === "view") {
        alert("Booking details are sample data in this frontend demo.");
        return;
      }

      if (
        action === "cancel" &&
        !confirm("Cancel this booking? This demo will only change its displayed status.")
      ) {
        return;
      }

      const status = {
        confirm: ["Confirmed", "badge badge-success"],
        cancel: ["Cancelled", "badge badge-danger"],
      }[action];

      const badge = row.querySelector(".badge");
      badge.textContent = status[0];
      badge.className = status[1];

      const actions = row.querySelector(".table-actions");
      actions.innerHTML =
        '<button class="btn btn-outline btn-sm" data-view-booking>View details</button>';
      actions.querySelector("button").addEventListener("click", () => {
        alert("Booking details are sample data in this frontend demo.");
      });
    });
  });
}

function setupCustomerActions() {
  document.querySelectorAll("[data-view-customer]").forEach((button) => {
    button.addEventListener("click", () => {
      alert("Customer details are sample data in this frontend demo.");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderDashboardShell();
  setupAdmin();
});
