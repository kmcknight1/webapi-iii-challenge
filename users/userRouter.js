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

router.post(`/:id/posts`, validateUserId, validatePost, (req, res) => {
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

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then(deleted => {
      res.status(200).json({ message: `User with ID ${id} was deleted` });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Users.update(id, changes)
    .then(updated => {
      res.status(200).json(updated);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

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

  if (!Object.keys(user).length) {
    return res.status(400).json({ message: "missing user data" });
  } else if (!user.name) {
    return res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

//REQUIRED
function validatePost(req, res, next) {
  const post = req.body;

  if (!Object.keys(post).length) {
    return res.status(400).json({ message: "missing post data" });
  } else if (!post.text) {
    return res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
