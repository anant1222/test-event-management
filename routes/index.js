const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

// Get the current directory
const routesDirectory = __dirname;

router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});
// Read all files in the directory
fs.readdirSync(routesDirectory).forEach(file => {
  // Skip the index.js file to avoid loading it
  if (file === 'index.js') return;

  // Generate the route path by removing the file extension
  const routePath = path.join(routesDirectory, file);
  const routeName = path.basename(file, '.js');

  // Import the route file
  const route = require(routePath);

  // Register the route with the router
  router.use(`/${routeName}`, route);
});

module.exports = router;
