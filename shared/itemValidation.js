export const CATEGORIES = [
  "Electronics",
  "IDs & Documents",
  "Keys",
  "Bags",
  "Books",
  "Clothing & Accessories",
  "Other",
];
export const TYPES = ["Lost", "Found"];
export const LOCATIONS = ["Library", "Main Entrance", "Cafeteria", "Parking"];

export function today() {
  const value = new Date();
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

export function isCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function isEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export function isImageUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return false;
  if (
    /^\/images\/[a-zA-Z0-9_/-]+\.(avif|webp|png|jpe?g|svg)$/i.test(value) &&
    !value.includes("..")
  )
    return true;
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export const emptyItem = () => ({
  title: "",
  description: "",
  category: "",
  type: "Lost",
  location: "",
  date: today(),
  returned: false,
  contactEmail: "",
  imageUrl: "",
  locationImageUrl: "",
});

export function validateItem(input, { creating = false } = {}) {
  const errors = {};
  const value = {};
  const source =
    input && typeof input === "object" && !Array.isArray(input) ? input : {};
  for (const [field, min, max, label] of [
    ["title", 3, 100, "title"],
    ["description", 10, 2000, "description"],
    ["location", 2, 120, "location"],
  ]) {
    value[field] =
      typeof source[field] === "string" ? source[field].trim() : "";
    if (
      typeof source[field] !== "string" ||
      value[field].length < min ||
      value[field].length > max
    )
      errors[field] = `Enter a ${label} between ${min} and ${max} characters.`;
  }
  value.category = source.category;
  value.type = source.type;
  if (!CATEGORIES.includes(value.category))
    errors.category = "Choose a category.";
  if (!TYPES.includes(value.type)) errors.type = "Choose Lost or Found.";
  value.date = source.date;
  if (!isCalendarDate(value.date)) errors.date = "Enter a valid calendar date.";
  value.returned =
    creating && source.returned === undefined ? false : source.returned;
  if (typeof value.returned !== "boolean")
    errors.returned = "Returned must be true or false.";
  for (const field of ["contactEmail", "imageUrl", "locationImageUrl"]) {
    const raw = source[field] === undefined ? "" : source[field];
    value[field] = typeof raw === "string" ? raw.trim() : "";
    if (typeof raw !== "string")
      errors[field] = "Enter text or leave this field empty.";
    else if (
      value[field] &&
      !(field === "contactEmail"
        ? isEmail(value[field])
        : isImageUrl(value[field]))
    )
      errors[field] =
        field === "contactEmail"
          ? "Enter a valid email address."
          : "Use an http(s) image URL or a local /images/ path.";
  }
  return { value, errors, valid: Object.keys(errors).length === 0 };
}

export function validateContact(input) {
  const errors = {};
  for (const [field, min, max, label] of [
    ["name", 2, 100, "name"],
    ["subject", 3, 120, "subject"],
    ["message", 10, 2000, "message"],
  ]) {
    const value = input[field]?.trim() || "";
    if (value.length < min || value.length > max)
      errors[field] = `Enter a ${label} between ${min} and ${max} characters.`;
  }
  if (!isEmail(input.email?.trim()))
    errors.email = "Enter a valid email address.";
  return errors;
}
