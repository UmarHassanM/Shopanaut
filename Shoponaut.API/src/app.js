const express = require("express");
const app = express();
const middleware = require("../src/routes");

app.use(
  express.json({
    type: () => true, // this matches all content types
  })
);

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain);
app.use("/catalog", middleware);
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send("Welcome to the Hackathon!");
});

app.post("/", (req, res) => {
  res.send(req.body)
});
module.exports = app;
