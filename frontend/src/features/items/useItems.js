import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItem, fetchItems, itemSelectors } from "./itemsSlice.js";

export function useCollection() {
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.items.collection);
  const items = useSelector(itemSelectors.selectAll);
  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);
  useEffect(() => {
    if (collection.status === "succeeded" && !collection.complete)
      dispatch(fetchItems());
  }, [dispatch, collection.status, collection.complete]);
  return { items, ...collection, retry: () => dispatch(fetchItems()) };
}

export function useItem(id) {
  const dispatch = useDispatch();
  const item = useSelector((state) =>
    itemSelectors.selectById(state, Number(id)),
  );
  const read = useSelector((state) => state.items.reads[id]);
  useEffect(() => {
    const promise = dispatch(fetchItem(id));
    return () => promise.abort();
  }, [dispatch, id]);
  return {
    item,
    status: read?.status || "idle",
    error: read?.error,
    retry: () => dispatch(fetchItem(id)),
  };
}
