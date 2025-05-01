const router = require("express").Router();

const controller = require("./dishes.controller");

const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass
router
    .route("/")
    .get(controller.list)
    .post(controller.validateDish, controller.create)
    .all(methodNotAllowed);


router
    .route("/:dishId")
    .get(controller.dishExists, controller.read)
    .put(controller.dishExists, controller.idMatches, controller.validateDish, controller.update)
    .all(methodNotAllowed);

module.exports = router;
