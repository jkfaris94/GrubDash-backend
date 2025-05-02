const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: orders });
  }

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (!foundOrder) {
    return next({
      status: 404,
      message: `Order ID not found: ${orderId}`,
    });
  }

  res.locals.order = foundOrder;
  next();
}

function read(req, res) {
    res.json({ data: res.locals.order });
  }

  function validateOrder(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
    if (!deliverTo || deliverTo === "") {
      return next({ status: 400, message: "Order must include a deliverTo" });
    }
  
    if (!mobileNumber || mobileNumber === "") {
      return next({ status: 400, message: "Order must include a mobileNumber" });
    }
  
    if (!Array.isArray(dishes) || dishes.length === 0) {
        return next({ status: 400, message: "Order must include at least one dish" });
    }
  
    for (let i = 0; i < dishes.length; i++) {
      const quantity = dishes[i].quantity;
  
      if (
        quantity === undefined ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return next({
          status: 400,
          message: `Dish ${i} must have a quantity that is an integer greater than 0`,
        });
      }
    }
  
    next();
  }

  function create(req, res) {
    const { data: { deliverTo, mobileNumber, status = "pending", dishes } = {} } = req.body;
  
    const newOrder = {
      id: nextId(),
      deliverTo,
      mobileNumber,
      status,
      dishes,
    };
  
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
  }

  function idMatches(req, res, next) {
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body;

    if (id && id !== orderId) {
        return next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
        })
    }
    next();
  }

  function update(req, res, next) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
    // Validate status
    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
    if (!status || !validStatuses.includes(status)) {
      return next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
      });
    }
  
    // Don't allow editing a delivered order
    if (order.status === "delivered") {
      return next({
        status: 400,
        message: "A delivered order cannot be changed",
      });
    }
  
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
  
    res.json({ data: order });
  }

  function destroy(req, res, next) {
    const { orderId } = req.params;
    const order = res.locals.order;

    if (order.status !== "pending") {
        return next({
            status: 400,
            message: "An order cannot be deleted unless it is pending",
          });
    }

    const index = orders.findIndex((order) => order.id === orderId);
  if (index > -1) {
    orders.splice(index, 1);
  }

  res.sendStatus(204);
  }

module.exports = {
    list,
    read,
    orderExists,
    validateOrder,
    create,
    idMatches,
    update,
    destroy,
};
