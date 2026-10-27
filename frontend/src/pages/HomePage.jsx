import usePageTitle from "../app/usePageTitle.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ArrowRight, ArrowUpRight, Search, MapPin, Plus } from "lucide-react";
import { Button, EmptyState, ErrorState, LoadingSkeleton } from "../components/common/UI.jsx";
import ItemCard from "../components/items/ItemCard.jsx";
import { useCollection } from "../features/items/useItems.js";
import { selectRecent, selectStats } from "../features/items/itemsSelectors.js";
import styles from "./Home.module.css";

export default function HomePage() {
  usePageTitle("Home");
  const { status, error, retry } = useCollection();
  const loaded = status === "succeeded";
  const recent = useSelector(selectRecent);
  const stats = useSelector(selectStats);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function search(event) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/items?q=${encodeURIComponent(value)}` : "/items");
  }
  return (
    <>
      <section className={styles.hero}>
        <img
          className={styles.heroImage}
          src="/images/usek-hero.png"
          alt="The USEK campus overlooking the coast of Kaslik"
          fetchPriority="high"
          width="1672"
          height="941"
        />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>
              A SHARED SPACE FOR OUR CAMPUS
            </span>
            <h1 tabIndex={-1}>
              Lost on campus.
              <br />
              <span>Found together.</span>
            </h1>
            <p>
              Some things are too familiar to leave behind.
              <br className={styles.desktopBreak} /> Let's help them find their
              way back.
            </p>
            <div className={styles.heroActions}>
              <Button to="/items">
                Explore items <ArrowUpRight size={18} />
              </Button>
              <Button to="/items/new" variant="secondary">
                <Plus size={17} />
                Add an item
              </Button>
            </div>
            <form onSubmit={search} className={styles.heroSearch} role="search">
              <Search size={21} aria-hidden="true" />
              <label className="sr-only" htmlFor="campus-search">
                Search campus items
              </label>
              <input
                id="campus-search"
                type="search"
                placeholder="Keys, headphones, a familiar place…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit" aria-label="Find matching items">
                <ArrowRight size={20} />
              </button>
            </form>
            <div className={styles.heroQuickLinks}>
              <span>A place to start</span>
              <Link to="/items?type=Lost">
                I lost something <ArrowUpRight size={12} />
              </Link>
              <Link to="/items?type=Found">
                I found something <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
          <div className={styles.campusCaption}>
            <span className={styles.captionLine} />
            <div>
              <span>OUR EVERYDAY BACKDROP</span>
              <p>
                <MapPin size={13} />
                Kaslik campus, Lebanon
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        className={styles.statsSection}
        aria-label="Campus item statistics"
      >
        <div className={`container ${styles.statsBar}`}>
          <div className={styles.statsIntro}>
            <span className="eyebrow">ON THE CAMPUS NOTICEBOARD</span>
            <p>A community that looks out for each other.</p>
          </div>
          <div className={styles.stats}>
            {[
              ["total", "Items shared"],
              ["lost", "Lost items"],
              ["found", "Found items"],
              ["returned", "Marked returned"],
            ].map(([key, label]) => (
              <div key={key}>
                <strong>
                  {loaded ? String(stats[key]).padStart(2, "0") : "—"}
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`container ${styles.recent}`}>
        <div className={styles.sectionTop}>
          <span className="eyebrow">THE CAMPUS NOTICEBOARD</span>
          <span className={styles.sectionIndex}>01 / WHAT'S NEW</span>
        </div>
        <div className="section-heading">
          <div>
            <h2>
              Familiar things.
              <br className={styles.mobileBreak} /> Waiting to be found.
            </h2>
            <p>The latest lost and found items from around campus.</p>
          </div>
          <Link className="text-link" to="/items">
            Explore all items <ArrowUpRight size={18} />
          </Link>
        </div>
        {status === "loading" || status === "idle" ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error.message} onRetry={retry} />
        ) : recent.length ? (
          <div className="item-grid">
            {recent.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
      <section className={styles.community}>
        <div className={`container ${styles.communityGrid}`}>
          <figure className={styles.communityImage}>
            <img
              src="/images/usek-sunlit.png"
              alt="Students spending time together in a green courtyard at USEK"
              width="2088"
              height="753"
              loading="lazy"
            />
            <figcaption>
              <span>BETWEEN CLASSES. BEYOND CLASSROOMS.</span>
              <p>This is our common ground.</p>
            </figcaption>
            <span className={styles.photoCorner} aria-hidden="true">
              USEK / CAMPUS LIFE
            </span>
          </figure>
          <div className={styles.communityCopy}>
            <span className="eyebrow">A CAMPUS THAT CARES</span>
            <h2>
              More than a place.
              <br />
              <span>A community.</span>
            </h2>
            <p>
              We share the same paths, the same study spots, the same in-between
              moments. Looking out for each other should feel just as natural.
            </p>
            <p>
              FindIt brings lost and found belongings into one shared space. A
              small act of kindness, a little closer to home.
            </p>
            <Link to="/about" className={styles.editorialLink}>
              Get to know FindIt{" "}
              <span>
                <ArrowUpRight size={19} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className={`container ${styles.how}`}>
        <div className={styles.sectionTop}>
          <span className="eyebrow">FROM LOST TO FOUND</span>
          <span className={styles.sectionIndex}>02 / HOW IT WORKS</span>
        </div>
        <div className="section-heading">
          <h2>
            A little help.
            <br />A few simple steps.
          </h2>
          <p>
            No complicated process.
            <br />
            Just people helping people.
          </p>
        </div>
        <div className={styles.steps}>
          {[
            [
              "01",
              "Look around.",
              "Your missing thing might already be here. Search the noticeboard by item, category, or place.",
              "/items",
              "Explore the noticeboard",
            ],
            [
              "02",
              "Share the details.",
              "A clear description. A campus location. A photo if you have one. That's all it takes to start.",
              "/items/new",
              "Create an item",
            ],
            [
              "03",
              "Make a connection.",
              "Recognize something? Open the item and use its contact email to reach out.",
              "/items?type=Found",
              "See what's been found",
            ],
          ].map(([number, title, text, to, label]) => (
            <div className={styles.step} key={number}>
              <span className={styles.stepNumber}>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link to={to}>
                {label}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.bottomCta}>
        <img
          src="/images/usek-sunlit.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <span className="eyebrow">BE SOMEONE'S GOOD NEWS</span>
            <h2>
              Found something?
              <br />
              You could make their day.
            </h2>
          </div>
          <div>
            <p>
              A minute of your time.
              <br />
              One less thing on someone's mind.
            </p>
            <Button to="/items/new">
              Add an item <ArrowUpRight size={18} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
