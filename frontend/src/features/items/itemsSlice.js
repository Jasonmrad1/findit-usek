import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { request } from "./itemsApi.js";

const adapter = createEntityAdapter();
const run = async (action, api) => {
  try {
    return await action();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return api.rejectWithValue(error);
  }
};

export const fetchItems = createAsyncThunk(
  "items/fetchAll",
  (_, api) => run(() => request("", { signal: api.signal }), api),
  {
    condition: (_, api) => api.getState().items.collection.status !== "loading",
  },
);
export const fetchItem = createAsyncThunk("items/fetchOne", (id, api) =>
  run(() => request(`/${id}`, { signal: api.signal }), api),
);
export const createItem = createAsyncThunk("items/create", (body, api) =>
  run(() => request("", { method: "POST", body }), api),
);
export const updateItem = createAsyncThunk(
  "items/update",
  ({ id, body }, api) =>
    run(() => request(`/${id}`, { method: "PUT", body }), api),
);
export const deleteItem = createAsyncThunk("items/delete", (id, api) =>
  run(async () => {
    await request(`/${id}`, { method: "DELETE" });
    return Number(id);
  }, api),
);

const initialState = adapter.getInitialState({
  collection: { status: "idle", error: null, complete: false, requestId: null },
  reads: {},
  mutation: { status: "idle", error: null },
  revision: 0,
});

const slice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearMutation(state) {
      state.mutation = { status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, action) => {
      state.collection = {
        ...state.collection,
        status: "loading",
        error: null,
        requestId: action.meta.requestId,
        revision: state.revision,
      };
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      if (state.collection.requestId !== action.meta.requestId) return;
      if (state.collection.revision === state.revision) {
        adapter.setAll(state, action.payload);
        state.collection.complete = true;
      }
      state.collection.status = "succeeded";
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      if (state.collection.requestId !== action.meta.requestId) return;
      state.collection.status = action.meta.aborted ? "idle" : "failed";
      state.collection.error = action.meta.aborted
        ? null
        : action.payload || { message: "Unable to load items." };
    });
    builder.addCase(fetchItem.pending, (state, action) => {
      state.reads[action.meta.arg] = {
        status: "loading",
        error: null,
        requestId: action.meta.requestId,
        revision: state.revision,
      };
    });
    builder.addCase(fetchItem.fulfilled, (state, action) => {
      const read = state.reads[action.meta.arg];
      if (read?.requestId !== action.meta.requestId) return;
      if (read.revision === state.revision)
        adapter.upsertOne(state, action.payload);
      read.status = "succeeded";
    });
    builder.addCase(fetchItem.rejected, (state, action) => {
      const read = state.reads[action.meta.arg];
      if (read?.requestId !== action.meta.requestId) return;
      read.status = action.meta.aborted ? "idle" : "failed";
      read.error = action.meta.aborted
        ? null
        : action.payload || { message: "Unable to load this item." };
      if (read.error?.status === 404) {
        adapter.removeOne(state, Number(action.meta.arg));
        state.collection.complete = false;
      }
    });
    for (const thunk of [createItem, updateItem, deleteItem]) {
      builder.addCase(thunk.pending, (state) => {
        state.mutation = { status: "loading", error: null };
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        if (thunk === deleteItem) adapter.removeOne(state, action.payload);
        else adapter.upsertOne(state, action.payload);
        state.revision++;
        state.mutation = { status: "succeeded", error: null };
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.mutation = {
          status: "failed",
          error: action.payload || { message: "Unable to save your changes." },
        };
      });
    }
  },
});

export const { clearMutation } = slice.actions;
export const itemSelectors = adapter.getSelectors((state) => state.items);
export default slice.reducer;
