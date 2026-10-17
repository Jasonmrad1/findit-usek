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

export function listItems(repository) {
  return repository.findAll();
}

export function getItem(repository, id) {
  const item = repository.findById(parseId(id));
  if (!item) throw new ApiError(404, "Report not found.");
  return item;
}

export function createItem(repository, values) {
  return repository.insert(validate(values, true));
}

export function updateItem(repository, id, values) {
  const existing = getItem(repository, id);
  return repository.replace(existing.id, validate(values));
}

export function removeItem(repository, id) {
  const existing = getItem(repository, id);
  repository.remove(existing.id);
}
