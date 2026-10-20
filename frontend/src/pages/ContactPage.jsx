import usePageTitle from "../app/usePageTitle.js";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Mail } from "lucide-react";
import { validateContact } from "../../../shared/itemValidation.js";
import {
  Button,
  ErrorSummary,
  Field,
  PageIntro,
} from "../components/common/UI.jsx";
import styles from "./Pages.module.css";

export default function ContactPage() {
  usePageTitle("Contact");
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const summaryRef = useRef(null);
  const successRef = useRef(null);
  const allErrors = validateContact(values);
  const errors = submitted ? allErrors : {};
  function field(name) {
    return {
      value: values[name],
      error: errors[name],
      onChange: (event) => {
        setSuccess(false);
        setValues((current) => ({ ...current, [name]: event.target.value }));
      },
    };
  }
  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(allErrors).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSuccess(true);
    requestAnimationFrame(() => successRef.current?.focus());
  }
  return (
    <div className="container page">
      <PageIntro
        eyebrow="WE’RE ALL EARS"
        title="A little conversation starts here."
      >
        A question, a suggestion, or an idea to make campus life a little
        better? This is the place.
      </PageIntro>
      <div className={styles.contactLayout}>
        <aside className={styles.contactIntro}>
          <figure className={styles.contactPhoto}>
            <img
              src="/images/usek-sunlit.png"
              alt="Students gathered in a green USEK campus courtyard"
              width="2088"
              height="753"
            />
            <figcaption>OUR CAMPUS. OUR CONVERSATIONS.</figcaption>
          </figure>
          <h2>
            Thoughts worth
            <br />
            sharing.
          </h2>
          <p>
            FindIt is built around people helping people. Your perspective is
            part of that story.
          </p>
          <div>
            <Mail size={19} />
            <span>
              <strong>Looking for a lost item?</strong>
              <p>
                Explore the noticeboard and contact the email on an individual
                item.
              </p>
              <Link className="text-link" to="/items">
                Explore items <ArrowRight size={14} />
              </Link>
            </span>
          </div>
        </aside>
        <form className={styles.contactForm} onSubmit={submit} noValidate>
          <h2>Leave a thought.</h2>
          <p className={styles.contactFormLead}>
            All fields are required. Please keep personal details out of your
            message.
          </p>
          {submitted && (
            <ErrorSummary errors={errors} summaryRef={summaryRef} />
          )}
          <Field
            label="Full name"
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="Your name"
            {...field("name")}
          />
          <Field
            label="Email address"
            name="email"
            required
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            {...field("email")}
          />
          <Field
            label="Subject"
            name="subject"
            required
            maxLength={120}
            placeholder="What’s on your mind?"
            {...field("subject")}
          />
          <Field
            label="Message"
            name="message"
            required
            as="textarea"
            maxLength={2000}
            placeholder="Tell us a little more…"
            rows={5}
            {...field("message")}
          />
          <div className={styles.contactSubmit}>
            <span role="status" tabIndex={-1} ref={successRef}>
              {success ? "Message ready." : ""}
            </span>
            <Button type="submit">
              Submit message <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
