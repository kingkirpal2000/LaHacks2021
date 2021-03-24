const express = require("express");
const app = express();
const volleyball = require('volleyball');
const cors = require('cors');

const auth = require("./auth/auth.js");
const middleware = require("./auth/middleware.js");
const tasks = require("./api/tasks.js");


app.use(cors());
app.use(volleyball);
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use(middleware.checktokenSetUser);

app.get('/', (req, res) => {
  res.json({
    message: "La Hacks Server",
    user: req.user,
  });
});

app.use("/auth", auth);

app.use("/tasks", middleware.isLoggedin, tasks);

app.listen(8081, () => {
  console.log("Listening at http://localhost:8081");
});

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
    stack: error.stack,
  });
  res.end();
}

app.use(errorHandler);
