const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: dishes });
  }


  function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
  
    if (!foundDish) {
      return next({
        status: 404,
        message: `Dish ID not found: ${dishId}`,
      });
    }
  
    res.locals.dish = foundDish;
    next();
  }

    function read(req, res) {
    res.json({ data: res.locals.dish });
    }

  module.exports = {
    list,
    read,
    dishExists,
  };