import { ArrowUpRight, ArrowRight, MapPin, HandHeart } from "lucide-react";
import { Button } from "../components/common/UI.jsx";
import styles from "./About.module.css";

export default function AboutPage() {
  return (
    <div className="container page">
      <header className={styles.intro}>
        <div>
          <span className="eyebrow">ONE CAMPUS. A LITTLE MORE CONNECTED.</span>
          <h1 tabIndex={-1}>
            Good things deserve
            <br />
            <span>a way back.</span>
          </h1>
        </div>
        <p>
          A forgotten notebook. A missing pair of keys. Sometimes, all it takes
          is someone who notices.
        </p>
      </header>
      <figure className={styles.campusPhoto}>
        <img
          src="/images/usek-sunlit.png"
          alt="Students spending time among the trees and sculptures on the USEK campus"
          width="2088"
          height="753"
          fetchPriority="high"
        />
        <figcaption>
          <span>THE PLACES WE SHARE</span>
          <strong>Our campus. Our common ground.</strong>
        </figcaption>
        <span className={styles.imageLabel}>USEK / KASLIK</span>
      </figure>
      <section className={styles.story}>
        <div>
          <span className="eyebrow">THE IDEA BEHIND FINDIT</span>
          <h2>
            We share a campus.
            <br />
            <span>Let’s look out for each other.</span>
          </h2>
        </div>
        <div>
          <p>
            Campus life moves quickly. Between lectures, study sessions, and
            catching up with friends, things get left behind.
          </p>
          <p>
            FindIt brings those moments into one shared space. Somewhere to look
            for what you’re missing. Somewhere to share what you’ve found.
            Somewhere a small act of kindness can turn a day around.
          </p>
          <p>
            Made for the USEK student community, with a simple belief: the
            things we lose deserve a chance to find their way home.
          </p>
        </div>
      </section>
      <section className={styles.how}>
        <div className={styles.sectionHeading}>
          <span className="eyebrow">SIMPLE BY DESIGN</span>
          <h2>
            From a small find
            <br />
            to a familiar face.
          </h2>
        </div>
        <div className={styles.steps}>
          {[
            [
              "01",
              "Take a look.",
              "Browse items with photos, dates, and campus locations. Recognize something? Open its story.",
            ],
            [
              "02",
              "Share what you know.",
              "Lost something or found something? A few thoughtful details help someone else connect the dots.",
            ],
            [
              "03",
              "Reach out.",
              "Use the email on an item to make contact. The next step is a conversation between you.",
            ],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.project}>
        <div>
          <span className="eyebrow">MADE FOR OUR CAMPUS COMMUNITY</span>
          <h2>Built here. For the people here.</h2>
          <p>
            FindIt brings lost and found items from across campus into one
            shared space. Whether you are retracing your steps or helping
            someone else, a familiar place and a few thoughtful details can
            bring you closer to a happy ending.
          </p>
        </div>
        <div className={styles.notes}>
          <p>
            <MapPin size={19} />
            <span>
              <strong>Small details. Better chances.</strong>A photo, a place,
              and a date help the right person recognize what is theirs.
            </span>
          </p>
          <p>
            <HandHeart size={19} />
            <span>
              <strong>A little care, shared.</strong>Post a find, reach out,
              and mark an item returned when it makes its way home.
            </span>
          </p>
        </div>
      </section>
      <div className={styles.closing}>
        <h2>A little care goes a long way.</h2>
        <div>
          <Button to="/items">
            Explore items <ArrowUpRight size={17} />
          </Button>
          <Button to="/items/new" variant="quiet">
            Share an item <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
}
