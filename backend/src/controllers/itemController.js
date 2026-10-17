import {
  listItems,
  getItem,
  createItem,
  updateItem,
  removeItem,
} from "../services/itemService.js";

export function list(store, _req, res) {
  res.json(listItems(store));
}

export function get(store, req, res) {
  res.json(getItem(store, req.params.id));
}

export function create(store, req, res) {
  res.status(201).json(createItem(store, req.body));
}

export function update(store, req, res) {
  res.json(updateItem(store, req.params.id, req.body));
}

export function remove(store, req, res) {
  removeItem(store, req.params.id);
  res.status(204).end();
}
