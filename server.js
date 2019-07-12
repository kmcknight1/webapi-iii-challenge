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
  res.send(
    `<h1>Hello! Check out this ${
      process.env.EV
    }!</h1><h2>Add the endpoints below to the url to see data!</h2></br><h3>Endpoints:</h3><ol><li>/api/users</li><li>/api/users/:id</li><li>/api/users/:id/posts</li></ol><h3>Data to expect:</h3><ol><li>Lists all users, names and ids</li><li>Pass in a valid user id to see that user's name & id</li><li>Pass in a valid user id to list all posts made by that user</li></ol>`
  );
});

module.exports = server;
