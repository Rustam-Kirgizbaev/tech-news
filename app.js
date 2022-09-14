const express = require("express");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/app_error");
const indexRouter = require("./routes");

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// handles all routes of /api route
//indexRouter(app);

// 404 Error
app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
