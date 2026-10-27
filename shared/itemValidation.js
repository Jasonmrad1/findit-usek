export const CATEGORIES = ["Electronics", "IDs & Documents", "Keys", "Bags", "Books", "Clothing & Accessories", "Other"];
export const TYPES = ["Lost", "Found"];
export const LOCATIONS = ["Library", "Main Entrance", "Cafeteria", "Parking"];

export function today() {
  return new Intl.DateTimeFormat("en-CA", {timeZone: "Asia/Beirut",year: "numeric",month: "2-digit",day: "2-digit"}).format(new Date());
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
  const source = input && typeof input === "object" ? input : {};

  value.title = typeof source.title === "string" ? source.title.trim() : "";
  if (value.title.length < 3 || value.title.length > 100)
    errors.title = "Enter a title between 3 and 100 characters.";

  value.description = typeof source.description === "string" ? source.description.trim() : "";
  if (value.description.length < 10 || value.description.length > 2000)
    errors.description = "Enter a description between 10 and 2000 characters.";

  value.location = typeof source.location === "string" ? source.location.trim() : "";
  if (value.location.length < 2 || value.location.length > 120)
    errors.location = "Enter a location between 2 and 120 characters.";

  value.category = source.category;
  value.type = source.type;
  if (!CATEGORIES.includes(value.category)) errors.category = "Choose a category.";
  if (!TYPES.includes(value.type)) errors.type = "Choose Lost or Found.";

  value.date = source.date;
  if (!isCalendarDate(value.date)) errors.date = "Enter a valid calendar date.";

  value.returned = creating && source.returned === undefined ? false : source.returned;
  if (typeof value.returned !== "boolean")
    errors.returned = "Returned must be true or false.";

  for (const field of ["contactEmail", "imageUrl", "locationImageUrl"]) {
    const text = source[field] === undefined ? "" : source[field];
    value[field] = typeof text === "string" ? text.trim() : "";

    if (typeof text !== "string") {
      errors[field] = "Enter text or leave this field empty.";
    } else if (value[field] && field === "contactEmail" && !isEmail(value[field])) {
      errors[field] = "Enter a valid email address.";
    } else if (value[field] && field !== "contactEmail" && !isImageUrl(value[field])) {
      errors[field] = "Use an http(s) image URL or a local /images/ path.";
    }
  }
  return { value, errors, valid: Object.keys(errors).length === 0 };
}

export function validateContact(input) {
  const errors = {};
  const textFields = [
    ["name", 2, 100, "name"],
    ["subject", 3, 120, "subject"],
    ["message", 10, 2000, "message"],
  ];

  for (const [field, min, max, label] of textFields) {
    const text = typeof input[field] === "string" ? input[field].trim() : "";

    if (text.length < min || text.length > max) {
      errors[field] = `Enter a ${label} between ${min} and ${max} characters.`;
    }
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!isEmail(email)) errors.email = "Enter a valid email address.";
  return errors;
}
