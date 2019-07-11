const express = require("express");

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post(`/:id/posts`, (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  Posts.insert({ text: text, user_id: id })
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/", validateUser, (req, res) => {
  const user = req.body;

  Users.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ ERROR: error });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// router.get("/:id/posts", (req, res) => {});

// router.delete("/:id", (req, res) => {});

// router.put("/:id", (req, res) => {});

//custom middleware

//REQUIRED
function validateUserId(req, res, next) {
  const { id } = req.params;

  Users.getById(id)
    .then(response => {
      if (response) {
        req.user = response;
        next();
      } else {
        res.status(400).json({ message: "Invalid user ID" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

//REQUIRED
function validateUser(req, res, next) {
  const user = req.body;

  console.log(user);

  if (!Object.keys(user).length) {
    return res.status(400).json({ message: "missing user data" });
  } else if (!user.name) {
    return res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

//REQUIRED
function validatePost(req, res, next) {}

// - `validatePost()`
//   - `validatePost` validates the `body` on a request to create a new post
//   - if the request `body` is missing, cancel the request and respond with
//   status `400` and `{ message: "missing post data" }`
//   - if the request `body` is missing the required `text` field, cancel the
//   request and respond with status `400` and `{ message: "missing required text field" }`

module.exports = router;
