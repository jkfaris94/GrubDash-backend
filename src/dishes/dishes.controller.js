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

    function validateDish(req, res, next) {
        const { data = {} } = req.body;
        const { name, description, price, image_url } = data;

        if (!name || name === "") return next({ status: 400, message: "Dish must include a name" });
        if (!description || description === "") return next({ status: 400, message: "Dish must include a description" });
        if (price === undefined || price === null) return next({ status: 400, message: "Dish must include a price" });
        if (!Number.isInteger(price) || price <= 0) return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
        if (!image_url || image_url === "") return next({ status: 400, message: "Dish must include a image_url" });

        next();
    }

    function create(req, res,) {
        const { data: { name, description, price, image_url } = {} } = req.body;

        const newDish = {
            id: nextId(),
            name,
            description,
            price,
            image_url,
        };

        dishes.push(newDish);
        res.status(201).json({ data: newDish });
    }

    function idMatches(req, res, next) {
        const { dishId } = req.params;
        const { data: { id } = {} } = req.body;

        if (id && id !== dishId) {
            return next({
                status: 400,
                message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
            });
        }
        next();
    }

    function update(req, res) {
        const dish = res.locals.dish;
        const { data: { name, description, price, image_url } = {} } = req.body;

        dish.name = name;
        dish.description = description;
        dish.price = price;
        dish.image_url = image_url;

        res.json({ data: dish });
    }

  module.exports = {
    list,
    read,
    dishExists,
    create,
    validateDish,
    idMatches,
    update,
  };


  //npm test test/dishes-router.test.js 