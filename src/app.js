/* * This file sets up the Express application. It imports the Express module, creates an instance of it, and exports the app for use in other parts of the application.
 * The app can be configured with middleware, routes, and other settings as needed.
 */

const cors = require('cors');

const express = require('express');

/* path is a built-in Node.js module that provides utilities for working with file and directory paths. It is used to handle and transform file paths in a way that is compatible across different operating systems. Can be useful for tasks such as serving static files or constructing file paths for views and templates. */
const path = require('path');

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(express.static(path.join(__dirname, '..', 'public')));  // serve /public directory as static files

/**
 * module.exports is a special object in Node.js that is used to export functions, objects, or values from a module so that they can be imported and used in other files. In this case, it exports the Express app instance, allowing it to be imported and used in the server.js file to start the server and define routes.
 */
module.exports = app; 