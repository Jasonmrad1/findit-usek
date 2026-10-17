// Each application instance owns a plain store containing its data and next ID.
export function createItemStore(seed = []) {
  const items = seed.map((item) => ({ ...item }));
  const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  return { items, nextId };
}

export function findAll(store) {
  return store.items.map((item) => ({ ...item }));
}

export function findById(store, id) {
  const item = store.items.find((entry) => entry.id === id);
  return item ? { ...item } : null;
}

export function insert(store, values) {
  const item = { ...values, id: store.nextId++ };
  store.items.push(item);
  return { ...item };
}

export function replace(store, id, values) {
  const index = store.items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.items[index] = { ...values, id };
  return { ...store.items[index] };
}

export function remove(store, id) {
  const existing = store.items.some((item) => item.id === id);
  if (existing) store.items = store.items.filter((item) => item.id !== id);
  return existing;
}
