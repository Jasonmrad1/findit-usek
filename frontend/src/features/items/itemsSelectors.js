import { createSelector } from "@reduxjs/toolkit";
import { itemSelectors } from "./itemsSlice.js";

export const selectStats = createSelector(itemSelectors.selectAll, (items) => ({
  total: items.length,
  lost: items.filter((item) => item.type === "Lost").length,
  found: items.filter((item) => item.type === "Found").length,
  returned: items.filter((item) => item.returned).length,
}));
export const selectRecent = createSelector(itemSelectors.selectAll, (items) =>
  [...items]
    .filter((item) => !item.returned)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 3),
);
export function filterItems(items, filters) {
  const query = (filters.q || "").trim().toLowerCase();
  return items
    .filter(
      (item) =>
        (!query ||
          [item.title, item.description, item.location].some((value) =>
            value.toLowerCase().includes(query),
          )) &&
        (!filters.type || item.type === filters.type) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.status ||
          (filters.status === "Returned" ? item.returned : !item.returned)),
    )
    .sort(
      (a, b) =>
        (filters.sort === "oldest" ? 1 : -1) *
        (a.date.localeCompare(b.date) || a.id - b.id),
    );
}
