export function itemController(service) {
  return {
    list: (_req, res) => res.json(service.list()),
    get: (req, res) => res.json(service.get(req.params.id)),
    create: (req, res) => res.status(201).json(service.create(req.body)),
    update: (req, res) => res.json(service.update(req.params.id, req.body)),
    remove: (req, res) => {
      service.remove(req.params.id);
      res.status(204).end();
    },
  };
}
