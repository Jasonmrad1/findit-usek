// Each application instance owns its data. Replace this repository to change storage.
export function createItemRepository(seed = []) {
  let items = seed.map((item) => ({ ...item }));
  let nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  return {
    findAll() {
      return items.map((item) => ({ ...item }));
    },
    findById(id) {
      const item = items.find((entry) => entry.id === id);
      return item ? { ...item } : null;
    },
    insert(values) {
      const item = { ...values, id: nextId++ };
      items.push(item);
      return { ...item };
    },
    replace(id, values) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return null;
      items[index] = { ...values, id };
      return { ...items[index] };
    },
    remove(id) {
      const existing = items.some((item) => item.id === id);
      if (existing) items = items.filter((item) => item.id !== id);
      return existing;
    },
  };
}
