import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItem, fetchItems } from "./itemsSlice.js";

export function useCollection() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const collection = useSelector((state) => state.items.collection);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  return {
    items,
    ...collection,
    retry: () => dispatch(fetchItems()),
  };
}

export function useItem(id) {
  const dispatch = useDispatch();
  const [requestedId, setRequestedId] = useState(null);
  const item = useSelector((state) => state.items.currentItem);
  const detail = useSelector((state) => state.items.detail);
  const matches = requestedId === id && detail.id === String(id);

  useEffect(() => {
    dispatch(fetchItem(id));
    setRequestedId(id);
  }, [dispatch, id]);

  return {
    item: matches ? item : null,
    status: matches ? detail.status : "idle",
    error: matches ? detail.error : null,
    retry: () => dispatch(fetchItem(id)),
  };
}
