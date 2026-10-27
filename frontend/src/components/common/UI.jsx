import { Link } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  SearchX,
  LoaderCircle,
} from "lucide-react";

export function Button({
  to,
  variant = "primary",
  children,
  pending = false,
  disabled = false,
  className = "",
  ...props
}) {
  const classes = `button button--${variant} ${className}`;
  return to ? (
    <Link className={classes} to={to} {...props}>
      {children}
    </Link>
  ) : (
    <button className={classes} disabled={pending || disabled} {...props}>
      {pending && (
        <LoaderCircle size={17} className="spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
export function Badge({ type, returned }) {
  return (
    <span
      className={`badge badge--${returned ? "returned" : type.toLowerCase()}`}
    >
      <span className="badge-dot" />
      {returned ? "Returned" : type}
    </span>
  );
}
export function Breadcrumb({
  current,
  to = "/items",
  label = "Explore items",
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to={to}>
        <ArrowLeft size={14} aria-hidden="true" />
        {label}
      </Link>
      <span aria-hidden="true">/</span>
      <span>{current}</span>
    </nav>
  );
}
export function PageIntro({ eyebrow, title, children, action }) {
  return (
    <div className="page-intro">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 tabIndex={-1}>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}
export function ErrorState({ message, onRetry, missing = false }) {
  return (
    <div className="state-panel" role="alert">
      <span className="state-icon">
        <AlertCircle size={28} />
      </span>
      <h2>
        {missing ? "This item isn't here" : "A little connection trouble"}
      </h2>
      <p>{message || "We couldn't load this page. Please try again."}</p>
      <div className="button-row">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        <Button to="/items" variant="secondary">
          Explore items <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
export function EmptyState({ filtered = false, onReset }) {
  return (
    <div className="state-panel">
      <span className="state-icon">
        <SearchX size={29} />
      </span>
      <h2>
        {filtered ? "No items match just yet" : "A fresh start for campus"}
      </h2>
      <p>
        {filtered
          ? "Try a different search or clear your filters to see more items."
          : "There are no items yet. Help someone by sharing the first one."}
      </p>
      {filtered ? (
        <Button variant="secondary" onClick={onReset}>
          Clear filters
        </Button>
      ) : (
        <Button to="/items/new">Add an item</Button>
      )}
    </div>
  );
}
export function LoadingSkeleton({ detail = false }) {
  return (
    <div
      aria-label="Loading items"
      role="status"
      className={detail ? "skeleton-detail" : "item-grid"}
    >
      {Array.from({ length: detail ? 1 : 3 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton-lines">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
export function Field({
  label,
  name,
  error,
  hint,
  required,
  as = "input",
  children,
  ...props
}) {
  const Tag = as;
  const described =
    [hint && `${name}-hint`, error && `${name}-error`]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required ? (
          <span className="required-mark"> *</span>
        ) : (
          <span className="optional">Optional</span>
        )}
      </label>
      <Tag
        id={name}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={described}
        {...props}
      >
        {children}
      </Tag>
      {hint && (
        <p className="field-hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
export function ErrorSummary({ errors, summaryRef }) {
  if (!Object.keys(errors).length) return null;
  return (
    <div className="error-summary" tabIndex={-1} ref={summaryRef}>
      <strong>Please check the highlighted fields.</strong>
      <ul>
        {Object.entries(errors).map(([field, text]) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(field)?.focus();
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function formatDate(value, full = false) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: full ? "long" : "short",
    ...(full ? { year: "numeric" } : {}),
  }).format(new Date(year, month - 1, day));
}
