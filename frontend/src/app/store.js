import { configureStore } from "@reduxjs/toolkit";
import items from "../features/items/itemsSlice.js";

export const store = configureStore({ reducer: { items } });
