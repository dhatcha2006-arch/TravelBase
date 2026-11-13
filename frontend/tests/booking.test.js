const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const bookingScript = readFileSync(
  path.join(__dirname, "..", "assets", "js", "booking.js"),
  "utf8",
);

function createBookingContext() {
  const values = new Map();
  const context = {
    document: {
      addEventListener() {},
    },
    localStorage: {
      getItem(key) {
        return values.has(key) ? values.get(key) : null;
      },
      setItem(key, value) {
        values.set(key, String(value));
      },
    },
  };

  vm.createContext(context);
  vm.runInContext(bookingScript, context);

  return { context, values };
}

const booking = {
  id: "TB-test",
  packageId: "bali-escape",
  packageName: "Bali Island Escape",
  destination: "Bali, Indonesia",
  travelDate: "2027-05-12",
  passengers: 2,
  total: 258000,
  status: "Requested",
};

test("validates real calendar dates, including leap days", () => {
  const { context } = createBookingContext();

  assert.equal(context.isValidTravelDate("2028-02-29"), true);
  assert.equal(context.isValidTravelDate("2027-02-29"), false);
  assert.equal(context.isValidTravelDate("2027-13-01"), false);
});

test("reads an empty booking list and round-trips saved requests", () => {
  const { context, values } = createBookingContext();

  assert.equal(context.readDemoBookings().length, 0);
  context.saveDemoBookings([booking]);

  assert.equal(values.get("travelbase-bookings"), JSON.stringify([booking]));
  assert.equal(context.readDemoBookings()[0].id, booking.id);
});

test("reports malformed saved JSON instead of treating it as an empty list", () => {
  const { context, values } = createBookingContext();
  values.set("travelbase-bookings", "{invalid");

  assert.throws(() => context.readDemoBookings(), { name: "SyntaxError" });
});

test("rejects saved bookings with invalid fields", () => {
  const { context, values } = createBookingContext();
  values.set(
    "travelbase-bookings",
    JSON.stringify([{ ...booking, travelDate: "2027-02-29" }]),
  );

  assert.throws(() => context.readDemoBookings(), { name: "TypeError" });
});
