const router = require("express").Router();

const controller = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
router.get("/", controller.list);

router.get("/:dishId", controller.dishExists, controller.read);

module.exports = router;
