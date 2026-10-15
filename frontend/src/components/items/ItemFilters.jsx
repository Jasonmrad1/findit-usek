import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid2X2,
  CircleCheck,
} from "lucide-react";
import { CATEGORIES } from "../../../../shared/itemReport.js";
import FilterSelect from "./FilterSelect.jsx";
import styles from "./ItemFilters.module.css";

export default function ItemFilters({ filters, onChange, onReset }) {
  const [expanded, setExpanded] = useState(false);
  const extraCount = [filters.category, filters.status].filter(Boolean).length;
  const active = Boolean(
    filters.q || filters.type || filters.category || filters.status,
  );
  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <Search size={18} aria-hidden="true" />
        <input
          aria-label="Search items"
          placeholder="Search for an item, description or place…"
          value={filters.q || ""}
          onChange={(event) => onChange("q", event.target.value)}
        />
        {filters.q && (
          <button aria-label="Clear search" onClick={() => onChange("q", "")}>
            <X size={16} />
          </button>
        )}
      </div>
      <div className={styles.filterMain}>
        <div className={styles.segments} role="group" aria-label="Report type">
          {["", "Lost", "Found"].map((type) => (
            <button
              key={type}
              aria-pressed={(filters.type || "") === type}
              onClick={() => onChange("type", type)}
            >
              {type || "All items"}
            </button>
          ))}
        </div>
        <button
          className={styles.filterToggle}
          aria-expanded={expanded}
          aria-controls="extra-filters"
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal size={15} />
          Filters
          {extraCount > 0 && (
            <span className={styles.filterCount}>{extraCount}</span>
          )}
        </button>
        <div
          id="extra-filters"
          className={`${styles.filterSelects} ${expanded ? styles.expanded : ""}`}
        >
          <FilterSelect
            label="Category"
            icon={<Grid2X2 size={16} aria-hidden="true" />}
            value={filters.category || ""}
            options={[
              { value: "", label: "All categories" },
              ...CATEGORIES.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
            onChange={(value) => onChange("category", value)}
          />
          <FilterSelect
            label="Status"
            icon={<CircleCheck size={16} aria-hidden="true" />}
            value={filters.status || ""}
            options={[
              { value: "", label: "Any status" },
              { value: "Open", label: "Open" },
              { value: "Returned", label: "Returned" },
            ]}
            onChange={(value) => onChange("status", value)}
          />
          {active && (
            <button className={styles.reset} onClick={onReset}>
              <X size={13} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
