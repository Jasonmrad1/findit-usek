import * as itemRepository from "../db/itemRepository.js";
import * as itemValidation from "../../../shared/itemValidation.js";
import { ApiError } from "../errors/ApiError.js";

function parseId(value) {
  const id = Number(value);
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(id)) {
    throw new ApiError(400, "Enter a valid item ID.");
  }
  return id;
}

function validate(values, creating = false) {
  const result = itemValidation.validateItem(values, { creating });
  if (!result.valid) {
    throw new ApiError(
      400,
      "Please correct the highlighted fields.",
      result.errors,
    );
  }
  return result.value;
}

export function listItems() {
  return itemRepository.findAll();
}

export function getItem(id) {
  const item = itemRepository.findById(parseId(id));
  if (!item) throw new ApiError(404, "Item not found.");
  return item;
}

export function createItem(values) {
  return itemRepository.insert(validate(values, true));
}

export function updateItem(id, values) {
  const existing = getItem(id);
  return itemRepository.replace(existing.id, validate(values));
}

export function removeItem(id) {
  const existing = getItem(id);
  itemRepository.remove(existing.id);
}
