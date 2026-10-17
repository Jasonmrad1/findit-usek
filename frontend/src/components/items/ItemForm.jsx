import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ImagePlus,
  Info,
  Mail,
  MapPin,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import {
  CATEGORIES,
  LOCATIONS,
  TYPES,
  validateItem,
  isImageUrl,
} from "../../../../shared/itemValidation.js";
import { Button, Field, ErrorSummary } from "../common/UI.jsx";
import ItemPhoto from "./ItemPhoto.jsx";
import styles from "./Form.module.css";

function PhotoPreview({ url, label }) {
  const [preview, setPreview] = useState("");
  const [failed, setFailed] = useState("");
  useEffect(() => {
    const timer = setTimeout(
      () => setPreview(url && isImageUrl(url) ? url : ""),
      350,
    );
    return () => clearTimeout(timer);
  }, [url]);
  if (!preview) return null;
  return (
    <>
      <ItemPhoto
        src={preview}
        alt={`${label} preview`}
        variant="preview"
        onFailure={() => setFailed(preview)}
      />
      {failed === preview && (
        <p className={styles.previewWarning}>
          This image couldn’t be loaded. You can still save the link or try
          another URL.
        </p>
      )}
    </>
  );
}

export default function ItemForm({
  initialValues,
  mode,
  onSubmit,
  pending,
  error,
}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const summaryRef = useRef(null);
  const lock = useRef(false);
  const result = validateItem(values);
  const errors = {
    ...Object.fromEntries(
      Object.entries(result.errors).filter(
        ([name]) => submitted || touched[name],
      ),
    ),
    ...serverErrors,
  };
  const isFound = values.type === "Found";
  const field = (name) => ({
    value: values[name],
    error: errors[name],
    onChange: (event) => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      setServerErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    },
    onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
  });
  async function submit(event) {
    event.preventDefault();
    if (lock.current || pending) return;
    setSubmitted(true);
    setServerErrors({});
    if (!result.valid) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    lock.current = true;
    try {
      await onSubmit(result.value);
    } catch (failure) {
      setServerErrors(failure.errors || {});
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      lock.current = false;
    }
  }
  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      {submitted && <ErrorSummary errors={errors} summaryRef={summaryRef} />}
      {error && (
        <div className="error-banner" role="alert">
          {error.message}
        </div>
      )}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>
            <NotebookPen size={18} />
          </span>
          <div>
            <h2>The little details</h2>
            <p>A clear description makes a big difference.</p>
          </div>
          <small aria-hidden="true">01</small>
        </div>
        <fieldset className={styles.typeField}>
          <legend>
            I’m adding something… <span>*</span>
          </legend>
          <div>
            {TYPES.map((type) => (
              <label
                key={type}
                className={values.type === type ? styles.typeActive : ""}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={values.type === type}
                  onChange={() =>
                    setValues((current) => ({ ...current, type }))
                  }
                />
                <strong>
                  {type === "Lost" ? "I lost something" : "I found something"}
                </strong>
                <span>
                  {type === "Lost" ? "Help me find it" : "Help it get home"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label="Item title"
          name="title"
          required
          placeholder="e.g. Black wireless earbuds"
          maxLength={100}
          {...field("title")}
        />
        <Field
          label="Category"
          name="category"
          as="select"
          required
          {...field("category")}
        >
          <option value="">Choose a category</option>
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </Field>
        <Field
          label="Description"
          name="description"
          as="textarea"
          required
          placeholder="Color, brand, distinctive features… What would help someone recognize it?"
          maxLength={2000}
          hint="Leave out personal information, ID numbers, and sensitive details."
          {...field("description")}
        />
      </section>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>
            <MapPin size={18} />
          </span>
          <div>
            <h2>
              {isFound
                ? "Where did you find it?"
                : "Where did you last see it?"}
            </h2>
            <p>A place and a date help connect the dots.</p>
          </div>
          <small aria-hidden="true">02</small>
        </div>
        <div className="field-row">
          <Field
            label={isFound ? "Found at" : "Last seen at"}
            name="location"
            required
            placeholder="e.g. Library entrance"
            list="campus-locations"
            maxLength={120}
            {...field("location")}
          />
          <Field
            label={isFound ? "Date found" : "Date last seen"}
            name="date"
            type="date"
            required
            {...field("date")}
          />
        </div>
        <datalist id="campus-locations">
          {LOCATIONS.map((location) => (
            <option value={location} key={location} />
          ))}
        </datalist>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>
            <ImagePlus size={18} />
          </span>
          <div>
            <h2>A picture helps</h2>
            <p>Add an item photo, a location photo, or both.</p>
          </div>
          <small aria-hidden="true">03</small>
        </div>
        <div className="notice">
          <Info size={16} />
          <p>
            Add a direct link to a clear photo of the item or the place where
            it was last seen. Keep personal documents out of the picture.
          </p>
        </div>
        <Field
          label="Item photo URL"
          name="imageUrl"
          placeholder="https://example.com/item.jpg"
          hint="Use an http(s) link or a project-local /images/ path."
          {...field("imageUrl")}
        />
        <PhotoPreview url={values.imageUrl} label="Item" />
        <Field
          label="Location photo URL"
          name="locationImageUrl"
          placeholder="https://example.com/location.jpg"
          hint="Help someone recognize where it was found or last seen."
          {...field("locationImageUrl")}
        />
        <PhotoPreview url={values.locationImageUrl} label="Location" />
      </section>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <span>
            <Mail size={18} />
          </span>
          <div>
            <h2>A way to reach you</h2>
            <p>A conversation could be the next step.</p>
          </div>
          <small aria-hidden="true">04</small>
        </div>
        <Field
          label="Contact email"
          name="contactEmail"
          type="email"
          placeholder="you@example.com"
          maxLength={254}
          hint="This address will be public. Without an email, the item has no contact method."
          {...field("contactEmail")}
        />
        {mode === "edit" && (
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={values.returned}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  returned: event.target.checked,
                }))
              }
            />
            <span>
              <strong>Item returned</strong>
              <small>
                Let the community know this story has a happy ending.
              </small>
            </span>
          </label>
        )}
      </section>
      <div className={`notice ${styles.privacy}`}>
        <ShieldCheck size={18} />
        <p>
          <strong>A little care for everyone’s privacy.</strong>
          <br />
          Please don’t share personal ID photos, sensitive information, or
          details that could identify someone without their permission.
        </p>
      </div>
      <div className={styles.actions}>
        <Button
          to={mode === "edit" ? `/items/${initialValues.id}` : "/items"}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button type="submit" pending={pending}>
          {pending
            ? "Saving item…"
            : mode === "edit"
              ? "Save changes"
              : "Publish item"}
          {!pending && <ArrowRight size={16} />}
        </Button>
      </div>
    </form>
  );
}
