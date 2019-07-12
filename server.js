const express = require("express");

const userRouter = require("./users/userRouter.js");
// const postRouter = require("./posts/postRouter.js");

const server = express();

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.url} at ${Date.now()}`);

  next();
}

//global middleware & parsing
server.use(logger);
server.use(express.json());

//routers
// server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

//global / endpoint
server.get("/", (req, res) => {
  res.send(`<h2>Hello! Check out this ${process.env.EV}!</h2>`);
});

module.exports = server;
