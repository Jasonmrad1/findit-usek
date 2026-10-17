import { useParams } from "react-router";
import {
  CalendarDays,
  MapPin,
  Mail,
  ArrowUpRight,
  Pencil,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Image,
} from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  ErrorState,
  LoadingSkeleton,
  formatDate,
} from "../components/common/UI.jsx";
import ItemPhoto from "../components/items/ItemPhoto.jsx";
import { useItem } from "../features/items/useItems.js";
import styles from "./Pages.module.css";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { item, status, error, retry } = useItem(id);
  if (status === "idle" || status === "loading")
    return (
      <div className="container page">
        <LoadingSkeleton detail />
      </div>
    );
  if (error || !item)
    return (
      <div className="container page">
        <h1 className="sr-only" tabIndex={-1}>
          Item unavailable
        </h1>
        <ErrorState
          message={error?.message}
          missing={error?.status === 404}
          onRetry={error?.status !== 404 ? retry : undefined}
        />
      </div>
    );
  return (
    <div className="container page">
      <Breadcrumb current={item.title} />
      <div className={styles.detailLayout}>
        <div className={styles.detailMedia}>
          <div className={styles.primaryPhoto}>
            <ItemPhoto
              src={item.imageUrl}
              alt={item.title}
              variant="detail"
              eager
            />
            {item.imageUrl?.startsWith("/images/") &&
              item.imageUrl.endsWith(".svg") && (
                <p className={styles.imageCaption}>
                  Illustrative demo image · not a photograph of a listed item
                </p>
              )}
          </div>
          {item.locationImageUrl && (
            <section className={styles.locationPhoto}>
              <h2>
                <MapPin size={17} />
                {item.type === "Found"
                  ? "Where it was found"
                  : "Last seen here"}
              </h2>
              <ItemPhoto
                src={item.locationImageUrl}
                alt={`Location: ${item.location}`}
                variant="detail"
                location
              />
              <p className={styles.imageCaption}>
                {item.locationImageUrl.startsWith("/images/") &&
                item.locationImageUrl.endsWith(".svg")
                  ? "Illustrative location · not verified campus imagery"
                  : "Location photo shared with this item · unverified"}
              </p>
            </section>
          )}
        </div>
        <div className={styles.detailCopy}>
          <div className={styles.detailHeading}>
            <div className={styles.detailBadges}>
              <Badge type={item.type} />
              {item.returned && <Badge type={item.type} returned />}
              <span className={styles.itemId}>
                ITEM #{String(item.id).padStart(3, "0")}
              </span>
            </div>
            <span className="eyebrow">{item.category}</span>
            <h1 tabIndex={-1}>{item.title}</h1>
            <p className={styles.detailLead}>
              {item.type === "Found"
                ? "A good find, waiting for the right person."
                : "A familiar thing, missed by someone on campus."}
            </p>
          </div>
          <div className={styles.detailBody}>
            <div className={styles.metadata}>
              <div>
                <MapPin size={19} />
                <span>
                  {item.type === "Found" ? "Found at" : "Last seen at"}
                  <strong>{item.location}</strong>
                </span>
              </div>
              <div>
                <CalendarDays size={19} />
                <span>
                  {item.type === "Found" ? "Date found" : "Date last seen"}
                  <strong>{formatDate(item.date, true)}</strong>
                </span>
              </div>
            </div>
            <section className={styles.description}>
              <h2>About this item</h2>
              <p>{item.description}</p>
            </section>
            {item.returned && (
              <div className={styles.returnedNotice}>
                <CheckCircle2 size={20} />
                <div>
                  <strong>A happy ending.</strong>
                  <p>This item is marked as returned / resolved.</p>
                </div>
              </div>
            )}
            <section className={styles.contactBox}>
              <span className={styles.contactIcon}>
                <Mail size={23} strokeWidth={1.5} />
              </span>
              <div>
                <h2>
                  {item.type === "Found"
                    ? "Think this might be yours?"
                    : "Have you seen this item?"}
                </h2>
                <p>
                  {item.contactEmail
                    ? "Reach out with a detail only the owner would know."
                    : "No contact email was provided for this item."}
                </p>
                {item.contactEmail && (
                  <a href={`mailto:${item.contactEmail}`}>
                    {item.contactEmail}
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </section>
            <div className="notice">
              <ShieldCheck size={19} />
              <p>
                Items and photos are shared by the community. FindIt doesn’t
                verify ownership or arrange returns. Avoid sharing sensitive
                personal information.
              </p>
            </div>
            <div className={styles.detailActions}>
              <Button to={`/items/${item.id}/edit`} variant="secondary">
                <Pencil size={15} />
                Edit item
              </Button>
              <Button to={`/items/${item.id}/delete`} variant="quiet">
                <Trash2 size={14} />
                Delete item
              </Button>
            </div>
            <p className={styles.demoNote}>
              <Image size={12} />
              Keep details current to help this item find its way home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
