// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
 
//  Routes
/**
 * @swagger
 * /api/login:
 *  post:
 *    description: validates existing user
 */
 
 
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
    console.log(res.json(req.user))
  });

  /**
 * @swagger
 * /api/signup:
 *  post:
 *    description: validates if an existing user, and if not sends new data to database and redirects to /members page
 * responses:
 *    307: 
 *      description: sends post to /api/login
 *    401:
 *      description: catches any error
 *    500:
 *      description: displays alert message with error
 *      
 *      
 */

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  /**
 * @swagger
 * /logout:
 *  get:
 *    description: logs a user out
 *  responses:
 *    304: 
 *      description: redircts to login form page
 */


  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  /**
 * @swagger
 * /api/user_data:
 *  get:
 *    description: retrieves user email address to display on /memebers page
 *  200:
 *    description: if retrieval of user email is successful it will display on the /members page
 */

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
