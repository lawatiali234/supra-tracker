// Seed real Supra Tracker data via the deployed API.
// Usage:  node scripts/seed.mjs <BASE_URL>
// Example: node scripts/seed.mjs https://supra-tracker.vercel.app
//
// Idempotency: this script appends — running it twice will create duplicates.
// To start clean, wipe Redis keys first (or delete via the UI before re-running).

const BASE = process.argv[2];
if (!BASE) {
  console.error("usage: node scripts/seed.mjs <BASE_URL>");
  process.exit(1);
}

// ---------- date math from mileage ----------
// Ownership: 2024-11-19 (delivery, 0 km) → today 2026-05-12 (~31,900 km)
const START_DATE = new Date("2024-11-19T00:00:00Z");
const TODAY = new Date("2026-05-12T00:00:00Z");
const TOTAL_KM = 31900;
const TOTAL_DAYS =
  (TODAY.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24);
const KM_PER_DAY = TOTAL_KM / TOTAL_DAYS;

function dateForKm(km) {
  const days = km / KM_PER_DAY;
  const d = new Date(START_DATE.getTime() + days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

const MOD_INSTALL_DATE = "2026-05-16"; // user-specified placeholder
const LABOR_DATE = "2026-05-16";
const LABOR_MILEAGE = 31900;

// ---------- helpers ----------
async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${path} → ${res.status}: ${txt}`);
  }
  return res.json();
}

async function put(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PUT ${path} → ${res.status}: ${txt}`);
  }
  return res.json();
}

// ---------- data ----------

const MILEAGE_LOG = [
  { date: "2024-11-19", km: 0 },
  { date: "2026-05-12", km: 31900 },
];

const SERVICES = [
  {
    date: dateForKm(8040),
    mileage: 8040,
    type: "oil",
    shop: "Hisham",
    partsUsed: "AMS 5W-40",
    cost: 52.6,
    notes: "1st service (approx date — back-filled from mileage).",
  },
  {
    date: dateForKm(11000),
    mileage: 11000,
    type: "brake_fluid",
    shop: undefined,
    partsUsed: "RBF 700 brake fluid + front brake pads",
    cost: 80,
    notes:
      "Approximate mileage (10–12k range). Combined front pad swap + brake fluid flush. Pad parts cost (41.44 OMR) is logged separately as a Mod under Brakes.",
  },
  {
    date: dateForKm(12480),
    mileage: 12480,
    type: "oil",
    shop: "Hormuz Station",
    cost: 52.6,
    notes: "2nd service (approx date — back-filled from mileage).",
  },
  {
    date: dateForKm(17750),
    mileage: 17750,
    type: "oil",
    shop: "Hormuz Station",
    partsUsed: "oil from Khalid",
    cost: 52.6,
    notes: "3rd service (approx date — back-filled from mileage).",
  },
  {
    date: dateForKm(24237),
    mileage: 24237,
    type: "oil",
    shop: "Hormuz Station Ghala",
    cost: 52.6,
    notes: "4th oil change (approx date — back-filled from mileage).",
  },
  {
    date: dateForKm(26062),
    mileage: 26062,
    type: "spark_plugs",
    shop: "Hisham / Mad",
    partsUsed: "Upgraded plugs (parts cost 58 OMR logged as a Mod under Tune)",
    cost: 10,
    notes:
      "Plug upgrade — labor only here, parts cost separated as a Mod entry.",
  },
  {
    date: dateForKm(30760),
    mileage: 30760,
    type: "oil",
    shop: "Warsha Performance",
    cost: 52.6,
    notes: "5th service (approx date — back-filled from mileage).",
  },
];

const LABOR = [
  // bundle install (originally 160 OMR total)
  { name: "Downpipe install", cost: 25 },
  { name: "Intake (turbo inlet) install", cost: 25 },
  { name: "Chargepipe install", cost: 25 },
  { name: "Heat exchanger install", cost: 55 },
  { name: "Front plate install", cost: 10 },
  { name: "Wheel spacer install (initial)", cost: 20 },
  // exterior installs
  { name: "Wing install", cost: 80 },
  { name: "Steering wheel install (1st)", cost: 30 },
  { name: "Mirror caps install", cost: 10 },
  { name: "Front + side lips install", cost: 40 },
  { name: "Carbon trunk install (with glass)", cost: 65 },
  { name: "Front bumper paint", cost: 80 },
  { name: "Steering wheel install (2nd)", cost: 20 },
  { name: "RGB front + rear lights install", cost: 80 },
  { name: "Exhaust fix (cold-start valve issue)", cost: 75 },
  {
    name: "Spacer removal + bolt fix + lug-nut install",
    cost: 47.25,
  },
].map((l) => ({
  date: LABOR_DATE,
  mileage: LABOR_MILEAGE,
  type: "other",
  shop: undefined,
  partsUsed: l.name,
  cost: l.cost,
  notes: "Approx date — install labor (parts cost lives under Mods).",
}));

const MODS = [
  // tune
  { name: "BM3 Stage 2 + XHP Stage 3 licenses", category: "tune", cost: 400, notes: "BM3 (engine) + XHP (trans) tune licenses." },
  { name: "Femto unlock", category: "tune", cost: 500 },
  { name: "Upgraded spark plugs (parts)", category: "tune", cost: 58, notes: "Installed at 26,062 km — labor (10 OMR) logged as a Service entry." },

  // intake / exhaust
  { name: "Intake", category: "intake_exhaust", cost: 120, notes: "Install labor (25 OMR) logged separately." },
  { name: "Chargepipe", category: "intake_exhaust", cost: 110 },
  { name: "Heat exchanger", category: "intake_exhaust", cost: 195 },
  { name: "Valvetronic exhaust", category: "intake_exhaust", cost: 500 },
  { name: "CTS downpipe", category: "intake_exhaust", cost: 130 },

  // brakes
  { name: "Front brake pads (parts)", category: "brakes", cost: 41.44, notes: "Installed ~11,000 km — labor + RBF 700 flush (80 OMR) logged as Service entry." },

  // wheels
  { name: "Titanium lug nuts", category: "wheels", cost: 138 },

  // exterior
  { name: "Carbon mirror caps", category: "exterior", cost: 55 },
  { name: "Wing", category: "exterior", cost: 200, notes: "Originally bought for 350 OMR, later sold for 150 OMR — net spend 200." },
  { name: "Front + side lips", category: "exterior", cost: 275 },
  { name: "Carbon fiber trunk", category: "exterior", cost: 750 },
  { name: "Carbon bonnet", category: "exterior", cost: 450 },
  { name: "RGB front + rear headlights", category: "exterior", cost: 266 },
  { name: "Carbon hood vent accessory", category: "exterior", cost: 38.45 },
  { name: "Carbon diffuser + carbon fuel tank cover", category: "exterior", cost: 226.85 },

  // other (interior / misc)
  { name: "Steering wheel + paddle shifters (1st)", category: "other", cost: 355 },
  { name: "Steering wheel (2nd)", category: "other", cost: 237 },
  { name: "Door lights", category: "other", cost: 25 },
  { name: "Interior carbon accessories", category: "other", cost: 76.52 },
  { name: "More interior carbon trim", category: "other", cost: 144 },
].map((m) => ({
  installDate: MOD_INSTALL_DATE,
  mileageAtInstall: 31900,
  notes: undefined,
  ...m,
}));

const FLUIDS = [
  {
    name: "Motul RBF 700 brake fluid",
    quantity: 1,
    unit: "L",
    lowStockThreshold: 1,
    notes: "Spare on shelf near the window. Backup for next flush.",
  },
];

// ---------- runner ----------
(async () => {
  console.log(`Seeding to ${BASE}\n`);

  console.log("→ profile");
  await put("/api/profile", { currentMileage: 31900 });

  console.log("→ mileage log");
  for (const e of MILEAGE_LOG) {
    await post("/api/mileage", e);
  }

  console.log(`→ service (${SERVICES.length})`);
  for (const s of SERVICES) {
    await post("/api/service", s);
  }

  console.log(`→ labor as service "other" (${LABOR.length})`);
  for (const l of LABOR) {
    await post("/api/service", l);
  }

  console.log(`→ mods (${MODS.length})`);
  for (const m of MODS) {
    await post("/api/mods", m);
  }

  console.log(`→ fluids (${FLUIDS.length})`);
  for (const f of FLUIDS) {
    await post("/api/fluids", f);
  }

  console.log("\n✓ done");
  console.log(`  ${MILEAGE_LOG.length} mileage log entries`);
  console.log(`  ${SERVICES.length} services (oil/plugs/brakes)`);
  console.log(`  ${LABOR.length} install-labor service entries`);
  console.log(`  ${MODS.length} mods`);
  console.log(`  ${FLUIDS.length} fluids`);
})();
