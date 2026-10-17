import {
  listItems,
  getItem,
  createItem,
  updateItem,
  removeItem,
} from "../services/itemService.js";

export function itemController(repository) {
  return {
    list: (_req, res) => res.json(listItems(repository)),
    get: (req, res) => res.json(getItem(repository, req.params.id)),
    create: (req, res) => res.status(201).json(createItem(repository, req.body)),
    update: (req, res) =>
      res.json(updateItem(repository, req.params.id, req.body)),
    remove: (req, res) => {
      removeItem(repository, req.params.id);
      res.status(204).end();
    },
  };
}
