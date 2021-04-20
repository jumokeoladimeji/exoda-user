const userController = require("../controllers/user");

module.exports = (app) => {
  app
    .route("/api/v1/users")
    .get(userController.getAll);
  app.route("/api/v1/users/:id")
    .get(userController.getOne);
};
