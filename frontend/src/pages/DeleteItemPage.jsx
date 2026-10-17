import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Button,
  Breadcrumb,
  ErrorState,
  LoadingSkeleton,
  Badge,
} from "../components/common/UI.jsx";
import ItemPhoto from "../components/items/ItemPhoto.jsx";
import { useItem } from "../features/items/useItems.js";
import { clearMutation, deleteItem } from "../features/items/itemsSlice.js";
import styles from "./Pages.module.css";

export default function DeleteItemPage() {
  const { id } = useParams();
  const { item, status, error, retry } = useItem(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mutation = useSelector((state) => state.items.mutation);
  useEffect(() => {
    dispatch(clearMutation());
  }, [dispatch, id]);
  async function confirm() {
    if (mutation.status === "loading") return;
    try {
      await dispatch(deleteItem(id)).unwrap();
      navigate("/items", {
        state: {
          feedback: "The item has been deleted from the noticeboard.",
        },
      });
    } catch (failure) {
      if (failure.status === 404) retry();
    }
  }
  return (
    <div className="container page">
      <Breadcrumb current="Delete item" />
      {status === "idle" || status === "loading" ? (
        <LoadingSkeleton detail />
      ) : error || !item ? (
        <>
          <h1 tabIndex={-1}>Item unavailable</h1>
          <ErrorState
            message={
              error?.status === 404
                ? "This item has already been removed or no longer exists."
                : error?.message
            }
            missing={error?.status === 404}
            onRetry={error?.status !== 404 ? retry : undefined}
          />
        </>
      ) : (
        <section className={styles.deletePanel}>
          <span className={styles.deleteIcon}>
            <Trash2 size={27} />
          </span>
          <h1 tabIndex={-1}>Remove this item?</h1>
          <p>
            This will remove the item from the campus noticeboard.
            <br />
            This action can’t be undone during this server session.
          </p>
          <div className={styles.deletePreview}>
            <ItemPhoto
              src={item.imageUrl || item.locationImageUrl}
              alt={item.title}
            />
            <div>
              <Badge type={item.type} />
              <h2>{item.title}</h2>
              <span>{item.location}</span>
            </div>
          </div>
          {mutation.error && (
            <div className="error-banner" role="alert">
              {mutation.error.message}
            </div>
          )}
          <div className={`notice ${styles.deleteNotice}`}>
            <AlertTriangle size={17} />
            <p>
              If the item has been returned, you can mark it as returned
              by editing it instead.
            </p>
          </div>
          <div className="button-row">
            <Button to={`/items/${id}`} variant="secondary">
              Keep item
            </Button>
            <Button
              variant="danger"
              pending={mutation.status === "loading"}
              onClick={confirm}
            >
              {mutation.status === "loading"
                ? "Removing…"
                : "Yes, delete item"}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
