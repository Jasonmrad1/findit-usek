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

export function createItemService(repository) {
  function requireItem(value) {
    const item = repository.findById(parseId(value));
    if (!item) throw new ApiError(404, "Report not found.");
    return item;
  }

  return {
    list: () => repository.findAll(),
    get: requireItem,
    create: (values) => repository.insert(validate(values, true)),
    update(value, values) {
      const existing = requireItem(value);
      return repository.replace(existing.id, validate(values));
    },
    remove(value) {
      const existing = requireItem(value);
      repository.remove(existing.id);
    },
  };
}
