// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");



module.exports = function(app) {

//  Routes
/**
 * @swagger
 * /:
 *  get:
 *    description: page for a new user to sign up
 *    responses:
 *      '200':
 *        description: page loads
 */

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  /**
 * @swagger
 * /login:
 *  get:
 *    description: welcomes a user who has/is signed up
 *    responses:
 *      '200':
 *        description: page loads with a Welcome message
 *      '302':
 *        description: redirects to /members page if user is already logged in
 *      '401':
 *        description: clears form when user gives incorrect credentials
 */ 

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

/**
 * @swagger
 * /members:
 *  get:
 *    description: welcomes a user who has/is signed up
 *    responses:
 *      '200':
 *        description: page loads with a Welcome message when user signs up
 *      '304':
 *        description: page loads with a Welcome message when user logs in
 */

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

};
