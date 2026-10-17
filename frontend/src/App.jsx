import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { X, CheckCircle2 } from "lucide-react";
import SiteHeader from "./components/layout/SiteHeader.jsx";
import SiteFooter from "./components/layout/SiteFooter.jsx";
import AppRoutes from "./app/router.jsx";

function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main").focus({ preventScroll: true });
    const heading = document.querySelector("main h1");
    document.title = heading ? heading.textContent + " | FindIt USEK" : "FindIt USEK";
  }, [pathname]);

  return null;
}

function RouteFeedback() {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(null);
  const message = location.state?.feedback;
  return (
    <div aria-live="polite" aria-atomic="true">
      {message && dismissed !== location.key && (
        <div className="route-feedback">
          <div className="container">
            <span>
              <CheckCircle2
                size={15}
                style={{ verticalAlign: "middle", marginRight: 9 }}
              />
              {message}
            </span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setDismissed(location.key)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <RouteFeedback />
      <main id="main" tabIndex={-1}>
        <AppRoutes />
      </main>
      <SiteFooter />
      <RouteEffects />
    </>
  );
}
