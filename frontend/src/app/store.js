import { configureStore } from "@reduxjs/toolkit";
import items from "../features/items/itemsSlice.js";

export const createStore = () => configureStore({ reducer: { items } });
export const store = createStore();
