import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import styles from "./Layout.module.css";
import headerStyles from "./SiteHeader.module.css";

export function Wordmark() {
  return (
    <Link to="/" className={styles.wordmark} aria-label="FindIt USEK home">
      <span className={styles.usekLogo}>
        <img
          src="/images/usek-logo.webp"
          alt="USEK — Holy Spirit University of Kaslik"
          width="474"
          height="474"
        />
      </span>
      <span className={styles.serviceName}>
        <strong>FindIt</strong>
        <span>Campus lost &amp; found</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);
  function close() {
    setOpen(false);
  }
  return (
    <header
      className={`${headerStyles.header} ${scrolled ? headerStyles.scrolled : ""} ${open ? headerStyles.menuOpen : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          document.getElementById("menu-toggle")?.focus();
        }
      }}
    >
      <div className={`container ${headerStyles.inner}`}>
        <Link
          to="/"
          className={headerStyles.brand}
          aria-label="FindIt USEK home"
        >
          <span className={headerStyles.universityLogo}>
            <img
              src="/images/usek-logo.webp"
              alt="USEK — Holy Spirit University of Kaslik"
              width="474"
              height="474"
            />
          </span>
          <span className={headerStyles.brandDivider} aria-hidden="true" />
          <strong>FindIt</strong>
        </Link>
        <button
          id="menu-toggle"
          className={headerStyles.menuToggle}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          {open ? (
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
        <nav
          id="site-navigation"
          className={`${headerStyles.nav} ${open ? headerStyles.navOpen : ""}`}
          aria-label="Main navigation"
        >
          <div className={headerStyles.links}>
            <NavLink to="/items" onClick={close} aria-label="Explore items">
              Explore{" "}
              <ArrowUpRight
                size={16}
                className={headerStyles.linkArrow}
                aria-hidden="true"
              />
            </NavLink>
            <NavLink to="/about" onClick={close} aria-label="About us">
              About{" "}
              <ArrowUpRight
                size={16}
                className={headerStyles.linkArrow}
                aria-hidden="true"
              />
            </NavLink>
            <NavLink to="/contact" onClick={close}>
              Contact{" "}
              <ArrowUpRight
                size={16}
                className={headerStyles.linkArrow}
                aria-hidden="true"
              />
            </NavLink>
          </div>
          <Link
            className={headerStyles.reportAction}
            to="/items/new"
            onClick={close}
          >
            Report an item{" "}
            <span>
              <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
