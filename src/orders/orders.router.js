const router = require("express").Router();
const controller = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass
router
  .route("/")
  .get(controller.list)
  .post(controller.validateOrder, controller.create)
  .all(methodNotAllowed);

router
  .route("/:orderId")
  .get(controller.orderExists, controller.read)
  .put(controller.orderExists, controller.idMatches, controller.validateOrder, controller.update)
  .delete(controller.orderExists, controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
