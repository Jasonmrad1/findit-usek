import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Plus, ArrowDownUp, Info } from "lucide-react";
import {
  Button,
  PageIntro,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
} from "../components/common/UI.jsx";
import ItemCard from "../components/items/ItemCard.jsx";
import ItemFilters from "../components/items/ItemFilters.jsx";
import { useCollection } from "../features/items/useItems.js";
import { filterItems } from "../features/items/itemsSelectors.js";
import styles from "./Pages.module.css";

export default function ItemsPage() {
  const { items, status, error, complete, retry } = useCollection();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(params), [params]);
  const filtered = useMemo(() => filterItems(items, filters), [items, filters]);
  function change(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === "q", preventScrollReset: true });
  }
  return (
    <div className="container page">
      <PageIntro
        eyebrow="THE CAMPUS NOTICEBOARD"
        title="Every item has a story."
        action={
          <Button to="/items/new">
            <Plus size={17} />
            Report an item
          </Button>
        }
      >
        Help the next chapter be a happy one. Explore what’s been lost and found
        around campus.
      </PageIntro>
      <ItemFilters
        filters={filters}
        onChange={change}
        onReset={() => setParams({})}
      />
      <div className={styles.resultsBar}>
        <p>
          <strong>{complete ? filtered.length : "—"}</strong>{" "}
          {filtered.length === 1 ? "item" : "items"} on the noticeboard
        </p>
        <label>
          <ArrowDownUp size={13} aria-hidden="true" />
          <span className="sr-only">Sort reports</span>
          <select
            value={filters.sort || "newest"}
            onChange={(event) => change("sort", event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      {(status === "loading" && !complete) || status === "idle" ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error.message} onRetry={retry} />
      ) : !filtered.length ? (
        <EmptyState
          filtered={Boolean(items.length)}
          onReset={() => setParams({})}
        />
      ) : (
        <div className="item-grid">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <div className={`notice ${styles.listNotice}`}>
        <Info size={17} />
        <p>
          Recognize an item? Open the report for details and any contact
          information. Reports are shared by the community and aren’t verified.
        </p>
      </div>
    </div>
  );
}
