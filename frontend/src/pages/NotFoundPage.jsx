import usePageTitle from "../app/usePageTitle.js";
import { Compass, ArrowRight } from "lucide-react";
import { Button } from "../components/common/UI.jsx";
import styles from "./Pages.module.css";

export default function NotFoundPage() {
  usePageTitle("Page not found");
  return (
    <div className="container page">
      <section className={styles.notFound}>
        <Compass size={65} strokeWidth={1} />
        <span className="eyebrow">404 · A LITTLE OFF CAMPUS</span>
        <h1 tabIndex={-1}>This page seems to be lost.</h1>
        <p>Let’s get you back to something familiar.</p>
        <div className="button-row">
          <Button to="/">Back home</Button>
          <Button to="/items" variant="secondary">
            Explore items <ArrowRight size={15} />
          </Button>
        </div>
      </section>
    </div>
  );
}
