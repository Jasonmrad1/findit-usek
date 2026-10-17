import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Check, Lightbulb } from "lucide-react";
import { emptyItem } from "../../../shared/itemValidation.js";
import {
  Breadcrumb,
  PageIntro,
  ErrorState,
  LoadingSkeleton,
} from "../components/common/UI.jsx";
import ItemForm from "../components/items/ItemForm.jsx";
import {
  createItem,
  updateItem,
  clearMutation,
} from "../features/items/itemsSlice.js";
import { useItem } from "../features/items/useItems.js";
import styles from "./Pages.module.css";

function FormSidebar() {
  return (
    <aside className={styles.formSidebar}>
      <figure className={styles.sidebarPhoto}>
        <img
          src="/images/usek-campus.webp"
          alt="USEK campus and the Kaslik coastline"
          width="350"
          height="198"
        />
        <figcaption>IT STARTS WITH OUR CAMPUS.</figcaption>
      </figure>
      <h2>
        A few details.
        <br />A big difference.
      </h2>
      <p>
        The more someone can recognize, the easier it is to make a connection.
      </p>
      <ul>
        {[
          "Use a clear, specific title.",
          "Describe a distinctive detail.",
          "Add the closest campus location.",
          "A photo is helpful, never required.",
        ].map((text) => (
          <li key={text}>
            <Check size={14} />
            {text}
          </li>
        ))}
      </ul>
      <div>
        <Lightbulb size={20} />
        <p>
          Keep one detail private so you can ask someone to describe it when
          they contact you.
        </p>
      </div>
      <small>
        Share helpful details and confirm ownership privately before handing
        an item over.
      </small>
    </aside>
  );
}

function FormContent({ item, mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mutation = useSelector((state) => state.items.mutation);
  useEffect(() => {
    dispatch(clearMutation());
  }, [dispatch, mode, item?.id]);
  async function submit(body) {
    const saved = await dispatch(
      mode === "edit" ? updateItem({ id: item.id, body }) : createItem(body),
    ).unwrap();
    navigate(`/items/${saved.id}`, {
      state: {
        feedback:
          mode === "edit"
            ? "Your item has been updated."
            : "Your item is on the noticeboard. Thank you for sharing.",
      },
    });
  }
  return (
    <div className={styles.formLayout}>
      <ItemForm
        key={item?.id || "new"}
        initialValues={item || emptyItem()}
        mode={mode}
        onSubmit={submit}
        pending={mutation.status === "loading"}
        error={mutation.error}
      />
      <FormSidebar />
    </div>
  );
}

function EditContent({ id }) {
  const { item, status, error, retry } = useItem(id);
  if (status === "idle" || status === "loading")
    return <LoadingSkeleton detail />;
  if (error || !item)
    return (
      <ErrorState
        missing={error?.status === 404}
        message={error?.message}
        onRetry={error?.status !== 404 ? retry : undefined}
      />
    );
  return <FormContent item={item} mode="edit" />;
}

export default function ItemFormPage({ mode = "create" }) {
  const { id } = useParams();
  return (
    <div className="container page">
      <Breadcrumb
        current={mode === "edit" ? "Edit item" : "Add an item"}
      />
      <PageIntro
        eyebrow="A LITTLE HELP STARTS HERE"
        title={
          mode === "edit"
            ? "Keep the story up to date."
            : "Let’s get it back where it belongs."
        }
      >
        {mode === "edit"
          ? "Update the details or let everyone know the item has been returned."
          : "Lost something or found something? Share a few details with your campus community."}
      </PageIntro>
      {mode === "edit" ? (
        <EditContent key={id} id={id} />
      ) : (
        <FormContent mode="create" />
      )}
    </div>
  );
}
