import * as itemService from "../services/itemService.js";

export function list(_req, res) {
  res.json(itemService.listItems());
}

export function get(req, res) {
  res.json(itemService.getItem(req.params.id));
}

export function create(req, res) {
  res.status(201).json(itemService.createItem(req.body));
}

export function update(req, res) {
  res.json(itemService.updateItem(req.params.id, req.body));
}

export function remove(req, res) {
  itemService.removeItem(req.params.id);
  res.status(204).end();
}
