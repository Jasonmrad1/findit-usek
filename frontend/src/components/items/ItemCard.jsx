import { Link } from "react-router";
import { ArrowUpRight, MapPin, CalendarDays } from "lucide-react";
import ItemPhoto from "./ItemPhoto.jsx";
import { Badge, formatDate } from "../common/UI.jsx";
import styles from "./Items.module.css";

export default function ItemCard({ item }) {
  const locationOnly = !item.imageUrl && item.locationImageUrl;
  return (
    <article className={styles.card}>
      <Link to={`/items/${item.id}`} className={styles.cardLink}>
        <div className={styles.cardMedia}>
          <ItemPhoto
            src={item.imageUrl || item.locationImageUrl}
            alt={locationOnly ? `Location: ${item.location}` : item.title}
            location={Boolean(locationOnly)}
          />
          <div className={styles.cardBadges}>
            <Badge type={item.type} />
            {item.returned && <Badge type={item.type} returned />}
          </div>
          {locationOnly && (
            <span className={styles.locationLabel}>Location photo</span>
          )}
        </div>
        <div className={styles.cardBody}>
          <span className={styles.category}>{item.category}</span>
          <h3>
            {item.title}
            <ArrowUpRight size={18} aria-hidden="true" />
          </h3>
          <p>
            <MapPin size={13} aria-hidden="true" />
            {item.location}
          </p>
          <div className={styles.cardBottom}>
            <span>
              <CalendarDays size={12} aria-hidden="true" />
              {formatDate(item.date)}
            </span>
            <span>
              View item <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
