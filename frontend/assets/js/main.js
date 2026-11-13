const travelPackages = [
  {
    id: "bali-escape",
    name: "Bali Island Escape",
    destination: "Bali, Indonesia",
    days: 7,
    nights: 6,
    price: 129000,
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
    description:
      "A considered island itinerary pairing Ubud's green hills with the clear-water beaches of southern Bali.",
    includes: [
      "6 nights in handpicked 4-star hotels",
      "Daily breakfast",
      "Airport transfers",
      "Guided Ubud and temple tour",
      "Air-conditioned private transport",
    ],
    excludes: ["International airfare", "Travel insurance", "Personal expenses"],
    hotel: "Komaneka at Bisma or a comparable boutique hotel",
    transport: "Private air-conditioned vehicle and airport transfers",
    itinerary: [
      "Arrive in Denpasar and transfer to Ubud",
      "Explore Ubud market, rice terraces and local villages",
      "Visit Tirta Empul temple and enjoy a Balinese lunch",
      "Transfer to the coast with a stop at Tegenungan Waterfall",
      "Leisure day by the beach",
      "Uluwatu sunset and cultural performance",
      "Breakfast and departure",
    ],
    policy:
      "Cancel 30 days or more before departure for a full refund. Cancellations within 30 days may incur supplier costs.",
  },
  {
    id: "swiss-alpine",
    name: "Swiss Alpine Discovery",
    destination: "Lucerne & Interlaken, Switzerland",
    days: 8,
    nights: 7,
    price: 248000,
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=80",
    description:
      "A scenic rail journey through lakeside Lucerne and the dramatic peaks of the Bernese Oberland.",
    includes: [
      "7 nights in centrally located hotels",
      "Daily breakfast",
      "Swiss Travel Pass, second class",
      "Jungfraujoch excursion",
      "Local travel support",
    ],
    excludes: ["International airfare", "Lunches and dinners", "Travel insurance"],
    hotel: "Hotel Waldstätterhof Lucerne and Hotel Interlaken or similar",
    transport:
      "Swiss Travel Pass by rail, with scheduled mountain transport",
    itinerary: [
      "Arrive in Zurich and continue to Lucerne",
      "Discover Lucerne's old town and lakeside promenade",
      "Mount Pilatus excursion",
      "Scenic rail journey to Interlaken",
      "Lauterbrunnen valley and waterfalls",
      "Jungfraujoch, subject to weather",
      "Leisure day in the Bernese Oberland",
      "Return to Zurich for departure",
    ],
    policy:
      "Cancel 45 days or more before departure for a full refund, less non-refundable rail tickets. Later cancellations are subject to supplier terms.",
  },
  {
    id: "kyoto-culture",
    name: "Kyoto Culture Trail",
    destination: "Kyoto & Osaka, Japan",
    days: 6,
    nights: 5,
    price: 174000,
    category: "Culture",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    description:
      "Temples, traditional lanes and memorable food on a relaxed introduction to Japan's Kansai region.",
    includes: [
      "5 nights in well-located hotels",
      "Daily breakfast",
      "Kyoto guided walking tour",
      "JR regional rail pass",
      "Tea ceremony experience",
    ],
    excludes: ["International airfare", "Most lunches and dinners", "Travel insurance"],
    hotel: "The Gate Hotel Kyoto or a comparable 4-star hotel",
    transport:
      "Rail and local public transit; private airport transfer available",
    itinerary: [
      "Arrive in Osaka and travel to Kyoto",
      "Visit Fushimi Inari and the historic Higashiyama district",
      "Arashiyama bamboo grove and riverside",
      "Tea ceremony and Nishiki Market",
      "Day trip to Osaka Castle and Dotonbori",
      "Breakfast and departure",
    ],
    policy:
      "Cancel 21 days or more before departure for a full refund. Hotel and activity supplier charges may apply thereafter.",
  },
  {
    id: "amalfi-coast",
    name: "Amalfi Coast Slow Escape",
    destination: "Amalfi Coast, Italy",
    days: 7,
    nights: 6,
    price: 219000,
    category: "Coastal",
    image:
      "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1000&q=80",
    description:
      "Take in pastel villages, coastal views and long lunches on a thoughtfully paced southern Italy escape.",
    includes: [
      "6 nights in a sea-view guesthouse",
      "Daily breakfast",
      "Naples arrival transfer",
      "Coast boat excursion",
      "One guided food walk",
    ],
    excludes: [
      "International airfare",
      "City and visitor taxes",
      "Travel insurance",
    ],
    hotel: "Hotel Marina Riviera or a locally owned equivalent",
    transport: "Scheduled private transfers and one shared boat excursion",
    itinerary: [
      "Arrive in Naples and transfer to Amalfi",
      "Explore Amalfi town and the cathedral",
      "Boat along the coast to Positano",
      "Free day for the beach or Ravello",
      "Local food walk and tasting",
      "Leisure day with optional excursion",
      "Transfer to Naples and depart",
    ],
    policy:
      "Cancel 30 days or more before departure for a full refund, excluding any non-refundable bookings.",
  },
  {
    id: "marrakech-sahara",
    name: "Marrakech & Sahara Journey",
    destination: "Marrakech, Morocco",
    days: 9,
    nights: 8,
    price: 186000,
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1000&q=80",
    description:
      "A guided route from Marrakech's medina through the Atlas Mountains to a quiet Sahara camp.",
    includes: [
      "8 nights in riads, hotels and desert camp",
      "Daily breakfast and 3 dinners",
      "Small-group Atlas and Sahara transport",
      "Local guides in Marrakech and Ait Benhaddou",
      "Camel ride at sunset",
    ],
    excludes: ["International airfare", "Most meals", "Travel insurance"],
    hotel: "Riad Kheirredine and selected locally owned stays",
    transport: "Small-group minibus with air conditioning",
    itinerary: [
      "Arrive and settle into Marrakech",
      "Guided medina and souk walk",
      "Cross the High Atlas to Ait Benhaddou",
      "Travel through the Dades Valley",
      "Arrive in Merzouga and sunset camel ride",
      "Return toward Marrakech through the mountains",
      "Free day in Marrakech",
      "Optional cooking class or garden visit",
      "Depart from Marrakech",
    ],
    policy:
      "Cancel 30 days or more before departure for a full refund. Some desert camp costs are non-refundable within 14 days.",
  },
  {
    id: "queenstown-outdoors",
    name: "Queenstown Outdoor Break",
    destination: "Queenstown, New Zealand",
    days: 5,
    nights: 4,
    price: 156000,
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1000&q=80",
    description:
      "A compact South Island stay with a Milford Sound day cruise and room to choose your own adventure.",
    includes: [
      "4 nights in a central hotel",
      "Daily breakfast",
      "Milford Sound small-group day trip",
      "Airport transfers",
      "Local activity planning",
    ],
    excludes: [
      "International airfare",
      "Adventure activity fees",
      "Travel insurance",
    ],
    hotel: "The Rees Hotel or a comparable lakeside property",
    transport:
      "Airport transfers and a guided Milford Sound coach excursion",
    itinerary: [
      "Arrive in Queenstown and settle in",
      "Explore the lakefront and town",
      "Milford Sound day cruise",
      "Choose a local walk, winery visit or adventure activity",
      "Breakfast and departure",
    ],
    policy:
      "Cancel 30 days or more before departure for a full refund, except pre-booked excursion costs.",
  },
  {
    id: "golden-triangle",
    name: "Golden Triangle & Taj Mahal",
    destination: "Delhi, Agra & Jaipur, India",
    days: 6,
    nights: 5,
    price: 48900,
    category: "Culture",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80",
    description:
      "See the Taj Mahal at sunrise, explore Jaipur's palaces and forts, and discover Delhi with a local guide.",
    includes: [
      "5 nights in handpicked hotels",
      "Daily breakfast",
      "Private air-conditioned intercity transport",
      "Local guides in Delhi, Agra and Jaipur",
      "Taj Mahal and Amber Fort entrance",
    ],
    excludes: [
      "Flights and train fares",
      "Lunches and dinners",
      "Travel insurance",
    ],
    hotel: "Well-reviewed 3- or 4-star hotels in each city",
    transport:
      "Private air-conditioned car for the Delhi–Agra–Jaipur route",
    itinerary: [
      "Arrive in Delhi and take an orientation walk",
      "Explore Old Delhi and travel to Agra",
      "Watch sunrise at the Taj Mahal, then visit Agra Fort",
      "Drive to Jaipur and stop at Fatehpur Sikri",
      "Visit Amber Fort, Hawa Mahal and Jaipur's old city",
      "Return to Delhi for departure",
    ],
    policy:
      "Cancel 14 days or more before departure for a full refund. Hotel and transport supplier charges may apply to later cancellations.",
  },
  {
    id: "kerala-backwaters",
    name: "Kerala Backwaters & Hill Country",
    destination: "Kochi, Munnar & Alleppey, India",
    days: 7,
    nights: 6,
    price: 42900,
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
    description:
      "From Munnar's tea-covered hills to an unhurried night on Kerala's backwaters, take in the region at an easy pace.",
    includes: [
      "6 nights in hotels and a houseboat",
      "Daily breakfast and houseboat meals",
      "Private airport and intercity transfers",
      "Munnar tea garden visit",
      "Backwater cruise with an overnight stay",
    ],
    excludes: ["Flights", "Most lunches and dinners", "Travel insurance"],
    hotel: "Locally owned stays in Kochi and Munnar, plus a private houseboat",
    transport: "Private air-conditioned vehicle between destinations",
    itinerary: [
      "Arrive in Kochi and settle into Fort Kochi",
      "Explore the old town, spice markets and waterfront",
      "Drive through the hills to Munnar",
      "Visit tea gardens and enjoy a short guided walk",
      "Travel to Alleppey and board your houseboat",
      "Cruise the backwaters and return to Kochi",
      "Breakfast and departure",
    ],
    policy:
      "Cancel 14 days or more before departure for a full refund. Houseboat bookings may have separate cancellation terms.",
  },
  {
    id: "jaipur-heritage",
    name: "Jaipur Heritage Weekend",
    destination: "Jaipur, Rajasthan, India",
    days: 4,
    nights: 3,
    price: 26900,
    category: "Culture",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=80",
    description:
      "A short, locally guided introduction to Jaipur's hilltop fort, rose-coloured streets, craft traditions and food.",
    includes: [
      "3 nights in a heritage-style hotel",
      "Daily breakfast",
      "Private airport transfers",
      "Guided city and Amber Fort visit",
      "Old-city food walk",
    ],
    excludes: ["Flights", "Lunches and dinners", "Personal shopping"],
    hotel: "A restored haveli or comparable centrally located hotel",
    transport: "Private city transfers with an English-speaking local guide",
    itinerary: [
      "Arrive in Jaipur and explore the neighbourhood",
      "Visit Amber Fort, Jal Mahal and Hawa Mahal",
      "Walk the old city and join a local food tour",
      "Breakfast and departure",
    ],
    policy:
      "Cancel 7 days or more before departure for a full refund. Later cancellations may incur hotel charges.",
  },
  {
    id: "ladakh-high-passes",
    name: "Ladakh High Passes",
    destination: "Leh & Nubra Valley, India",
    days: 8,
    nights: 7,
    price: 68900,
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1513415564515-763d91423bdd?auto=format&fit=crop&w=1000&q=80",
    description:
      "Acclimatise in Leh before crossing high mountain passes to monasteries, Nubra Valley and Pangong Lake.",
    includes: [
      "7 nights in hotels and a valley guesthouse",
      "Daily breakfast and selected dinners",
      "Private 4x4 transport with local driver",
      "Monastery visits and local guide",
      "Required regional permits",
    ],
    excludes: ["Flights to Leh", "Travel insurance", "Personal expenses"],
    hotel: "Selected locally run hotels and guesthouses",
    transport: "Private 4x4 vehicle; itinerary is subject to road and weather conditions",
    itinerary: [
      "Arrive in Leh and rest to acclimatise",
      "Gentle local visit to Leh Palace and Shanti Stupa",
      "Visit Thiksey Monastery and travel to Nubra Valley",
      "Explore Nubra's villages and sand dunes",
      "Drive to Pangong Lake and stay overnight",
      "Return to Leh, weather and road conditions permitting",
      "Leisure day in Leh",
      "Breakfast and departure",
    ],
    policy:
      "Due to high-altitude travel, bookings are subject to health and road-safety guidance. Cancel 21 days or more before departure for a full refund, less non-refundable permits.",
  },
];

const root = document.body.dataset.root || ".";

function route(path) {
  return `${root}/${path}`;
}

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderSiteChrome() {
  const header = document.querySelector("#site-header");

  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="container nav-wrap">
        <a class="brand" href="${route("index.html")}">
          <span class="brand-mark"><i class="bi bi-compass"></i></span>
          Travel<span>Base</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <i class="bi bi-list"></i>
        </button>
        <nav class="nav-links" aria-label="Main navigation">
          <a href="${route("index.html")}">Home</a>
          <a href="${route("pages/about.html")}">About</a>
          <a href="${route("pages/packages.html")}">Packages</a>
          <a href="${route("pages/contact.html")}">Contact</a>
        </nav>
        <div class="nav-actions">
          <a class="btn btn-outline btn-sm" href="${route("pages/login.html")}">Log in</a>
          <a class="btn btn-primary btn-sm" href="${route("pages/register.html")}">Register</a>
        </div>
      </div>`;
  }

  const footer = document.querySelector("#site-footer");

  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="${route("index.html")}">Travel<span>Base</span></a>
            <p>Thoughtful trips, local expertise and the freedom to travel at your own pace. Let's make your next journey count.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <div class="footer-links">
              <a href="${route("pages/packages.html")}">Tour packages</a>
              <a href="${route("pages/about.html")}">About TravelBase</a>
              <a href="${route("pages/contact.html")}">Contact our team</a>
            </div>
          </div>
          <div>
            <h3>Get in touch</h3>
            <div class="footer-links">
              <a href="tel:+912255550184">+91 22 5555 0184</a>
              <a href="mailto:hello@travelbase.example">hello@travelbase.example</a>
              <span>Koregaon Park, Pune, Maharashtra 411001</span>
            </div>
            <p>
              <a aria-label="Instagram" href="#"><i class="bi bi-instagram"></i></a>
              &nbsp;
              <a aria-label="Facebook" href="#"><i class="bi bi-facebook"></i></a>
              &nbsp;
              <a aria-label="LinkedIn" href="#"><i class="bi bi-linkedin"></i></a>
            </p>
          </div>
        </div>
        <div class="footer-bottom">
          © ${new Date().getFullYear()} TravelBase. Travel well, wherever you go.
        </div>
      </div>`;
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

function packageCard(item) {
  const detailsUrl = `${route("pages/package-details.html")}?id=${encodeURIComponent(item.id)}`;

  return `
    <article class="package-card">
      <a href="${detailsUrl}">
        <img src="${item.image}" alt="${item.destination}" loading="lazy">
      </a>
      <div class="package-body">
        <div class="package-meta">
          <span><i class="bi bi-geo-alt"></i> ${item.destination}</span>
          <span>${item.days} days</span>
        </div>
        <h3>${item.name}</h3>
        <div class="package-footer">
          <div class="package-price">${formatINR(item.price)} <small>/ person</small></div>
          <a class="btn btn-outline btn-sm" href="${detailsUrl}">View details</a>
        </div>
      </div>
    </article>`;
}

function showMessage(element, text, type) {
  if (!element) {
    return;
  }

  element.className = `alert alert-${type === "error" ? "error" : "success"}`;
  element.textContent = text;
  element.hidden = false;
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector("#contact-message");

    if (!form.reportValidity()) {
      showMessage(
        message,
        "Please check the required fields and try again.",
        "error",
      );
      return;
    }

    showMessage(
      message,
      "Thanks for getting in touch. This demo does not send messages to a server.",
      "success",
    );
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSiteChrome();
  setupContactForm();

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});
