import { useState } from "react";
import { Camera, MapPin } from "lucide-react";
import styles from "./Items.module.css";

export default function ItemPhoto({
  src,
  alt,
  variant = "card",
  location = false,
  eager = false,
  onFailure,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = src === failedSrc;
  const variantClass =
    variant === "detail"
      ? styles.detail
      : variant === "preview"
        ? styles.preview
        : "";
  return (
    <div className={`${styles.photo} ${variantClass}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onError={() => {
            setFailedSrc(src);
            onFailure?.();
          }}
        />
      ) : (
        <div className={styles.photoFallback}>
          {location ? (
            <MapPin size={36} strokeWidth={1.2} />
          ) : (
            <Camera size={38} strokeWidth={1.2} />
          )}
          <span>
            {src
              ? "Photo unavailable"
              : location
                ? "No location photo"
                : "No photo added"}
          </span>
        </div>
      )}
    </div>
  );
}
