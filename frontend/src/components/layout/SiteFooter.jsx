import { Link } from "react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Wordmark } from "./SiteHeader.jsx";
import styles from "./Layout.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        <div>
          <Wordmark />
          <p>
            A shared space for the things we lose,
            <br />
            and the community that brings them back.
          </p>
        </div>
        <nav className={styles.footerLinks} aria-label="Footer navigation">
          <Link to="/items">
            Explore items <ArrowUpRight size={15} />
          </Link>
          <Link to="/about">
            Our story <ArrowUpRight size={15} />
          </Link>
          <Link to="/contact">
            Get in touch <ArrowUpRight size={15} />
          </Link>
        </nav>
        <div className={styles.footerNote}>
          <span className="eyebrow">A LITTLE MORE CONNECTED.</span>
          <p>
            One campus. A thousand everyday stories.
            <br />
            Let's give a few of them a happy ending.
          </p>
          <Link to="/items/new">
            Share a lost or found item <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <div className={`container ${styles.footerBottom}`}>
        <span>
          © {new Date().getFullYear()} FindIt USEK. All rights reserved.
        </span>
        <span>Lost on campus. Found together.</span>
      </div>
    </footer>
  );
}
