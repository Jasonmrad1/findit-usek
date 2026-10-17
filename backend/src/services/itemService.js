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

export function listItems(store) {
  return itemRepository.findAll(store);
}

export function getItem(store, id) {
  const item = itemRepository.findById(store, parseId(id));
  if (!item) throw new ApiError(404, "Item not found.");
  return item;
}

export function createItem(store, values) {
  return itemRepository.insert(store, validate(values, true));
}

export function updateItem(store, id, values) {
  const existing = getItem(store, id);
  return itemRepository.replace(store, existing.id, validate(values));
}

export function removeItem(store, id) {
  const existing = getItem(store, id);
  itemRepository.remove(store, existing.id);
}
