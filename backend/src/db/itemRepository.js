import { items as seedItems } from "../data/items.js";

let items = seedItems.map((item) => ({ ...item }));
let nextId = Math.max(...items.map((item) => item.id), 0) + 1;

export function findAll() {
  return items.map((item) => ({ ...item }));
}

export function findById(id) {
  const item = items.find((entry) => entry.id === id);
  return item ? { ...item } : null;
}

export function insert(values) {
  const item = { ...values, id: nextId++ };
  items.push(item);
  return { ...item };
}

export function replace(id, values) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...values, id };
  return { ...items[index] };
}

export function remove(id) {
  const existing = items.some((item) => item.id === id);
  if (existing) items = items.filter((item) => item.id !== id);
  return existing;
}
