import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./FilterSelect.module.css";

export default function FilterSelect({
  label,
  icon,
  value,
  options,
  onChange,
  compact = false,
  id: controlId,
  error = false,
}) {
  const generatedId = useId();
  const id = controlId || generatedId;
  const root = useRef(null);
  const trigger = useRef(null);
  const typeahead = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);

  function choose(index) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  function keyDown(event) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      if (event.key === "Home") setActive(0);
      else if (event.key === "End") setActive(options.length - 1);
      else if (!open) setActive(selected);
      else
        setActive(
          (current) =>
            (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length,
        );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else {
        setActive(selected);
        setOpen(true);
      }
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      }
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const now = Date.now();
      const text =
        (now - typeahead.current.time < 700 ? typeahead.current.text : "") +
        event.key.toLowerCase();
      typeahead.current = { text, time: now };
      const match = options.findIndex((option) =>
        option.label.toLowerCase().startsWith(text),
      );
      if (match >= 0) {
        setActive(match);
        setOpen(true);
      }
    }
  }

  return (
    <div
      className={`${styles.root} ${compact ? styles.compact : ""} ${error ? styles.invalid : ""}`}
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        id={id}
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-controls={`${id}-options`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        className={`${styles.trigger} ${value ? styles.selected : ""}`}
        onKeyDown={keyDown}
        onClick={() => {
          setActive(selected);
          setOpen(!open);
        }}
      >
        {icon}
        <span>{options[selected].label}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div
        id={`${id}-options`}
        role="listbox"
        aria-label={label}
        className={`${styles.options} ${open ? styles.open : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        {options.map((option, index) => (
          <div
            id={`${id}-${index}`}
            key={option.value}
            role="option"
            title={option.label}
            aria-selected={value === option.value}
            className={`${styles.option} ${active === index ? styles.active : ""}`}
            onPointerMove={() => setActive(index)}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span>{option.label}</span>
            {value === option.value && <Check size={15} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}
