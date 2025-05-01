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


module.exports = {
    list,
    read,
    orderExists,
};
