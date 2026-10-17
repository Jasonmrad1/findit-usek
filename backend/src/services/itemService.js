import { findAll, findById, insert, replace, remove } from "../db/itemRepository.js";
import { validateReport } from "../../../shared/itemReport.js";
import { ApiError } from "../errors/ApiError.js";

function parseId(value) {
  const id = Number(value);
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(id)) {
    throw new ApiError(400, "Enter a valid report ID.");
  }
  return id;
}

function validate(values, creating = false) {
  const result = validateReport(values, { creating });
  if (!result.valid) {
    throw new ApiError(
      400,
      "Please correct the highlighted fields.",
      result.errors,
    );
  }
  return result.value;
}

export function listItems(store) {
  return findAll(store);
}

export function getItem(store, id) {
  const item = findById(store, parseId(id));
  if (!item) throw new ApiError(404, "Report not found.");
  return item;
}

export function createItem(store, values) {
  return insert(store, validate(values, true));
}

export function updateItem(store, id, values) {
  const existing = getItem(store, id);
  return replace(store, existing.id, validate(values));
}

export function removeItem(store, id) {
  const existing = getItem(store, id);
  remove(store, existing.id);
}
