import * as itemService from "../services/itemService.js";

export function list(store, _req, res) {
  res.json(itemService.listItems(store));
}

export function get(store, req, res) {
  res.json(itemService.getItem(store, req.params.id));
}

export function create(store, req, res) {
  res.status(201).json(itemService.createItem(store, req.body));
}

export function update(store, req, res) {
  res.json(itemService.updateItem(store, req.params.id, req.body));
}

export function remove(store, req, res) {
  itemService.removeItem(store, req.params.id);
  res.status(204).end();
}
