import {
  listItems,
  getItem,
  createItem,
  updateItem,
  removeItem,
} from "../services/itemService.js";

export function itemController(store) {
  return {
    list: (_req, res) => res.json(listItems(store)),
    get: (req, res) => res.json(getItem(store, req.params.id)),
    create: (req, res) => res.status(201).json(createItem(store, req.body)),
    update: (req, res) =>
      res.json(updateItem(store, req.params.id, req.body)),
    remove: (req, res) => {
      removeItem(store, req.params.id);
      res.status(204).end();
    },
  };
}
