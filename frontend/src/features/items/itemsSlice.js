import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "./itemsApi.js";

export const fetchItems = createAsyncThunk(
  "items/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await request();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (_, { getState }) =>
      getState().items.collection.status !== "loading",
  },
);

export const fetchItem = createAsyncThunk(
  "items/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await request(`/${id}`);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createItem = createAsyncThunk(
  "items/create",
  async (body, { rejectWithValue }) => {
    try {
      return await request("", { method: "POST", body });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateItem = createAsyncThunk(
  "items/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      return await request(`/${id}`, { method: "PUT", body });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteItem = createAsyncThunk(
  "items/delete",
  async (id, { rejectWithValue }) => {
    try {
      await request(`/${id}`, { method: "DELETE" });
      return Number(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  items: [],
  currentItem: null,
  collection: { status: "idle", error: null },
  detail: { id: null, status: "idle", error: null },
  mutation: { status: "idle", error: null },
};

const slice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearMutation(state) {
      state.mutation = { status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.collection = { status: "loading", error: null };
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.collection.status = "succeeded";
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.collection = {
          status: "failed",
          error: action.payload || { message: "Unable to load items." },
        };
      })
      .addCase(fetchItem.pending, (state, action) => {
        state.currentItem = null;
        state.detail = {
          id: String(action.meta.arg),
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchItem.fulfilled, (state, action) => {
        if (state.detail.id !== String(action.meta.arg)) return;
        state.currentItem = action.payload;
        state.detail.status = "succeeded";
      })
      .addCase(fetchItem.rejected, (state, action) => {
        if (state.detail.id !== String(action.meta.arg)) return;
        state.detail.status = "failed";
        state.detail.error = action.payload || { message: "Unable to load this item." };
      })
      .addCase(createItem.pending, (state) => {
        state.mutation = { status: "loading", error: null };
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentItem = action.payload;
        state.mutation.status = "succeeded";
      })
      .addCase(createItem.rejected, (state, action) => {
        state.mutation = {
          status: "failed",
          error: action.payload || { message: "Unable to create this item." },
        };
      })
      .addCase(updateItem.pending, (state) => {
        state.mutation = { status: "loading", error: null };
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
        state.currentItem = action.payload;
        state.mutation.status = "succeeded";
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.mutation = {
          status: "failed",
          error: action.payload || { message: "Unable to update this item." },
        };
      })
      .addCase(deleteItem.pending, (state) => {
        state.mutation = { status: "loading", error: null };
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.currentItem = null;
        state.mutation.status = "succeeded";
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.mutation = {
          status: "failed",
          error: action.payload || { message: "Unable to delete this item." },
        };
      });
  },
});

export const { clearMutation } = slice.actions;
export default slice.reducer;
