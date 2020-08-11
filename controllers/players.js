const playersRouter = require("express").Router();
const Player = require("../models/player");
const bcrypt = require("bcrypt");
const { getTokenFrom, getDecodedToken } = require("../utils/token");
const jwt = require("jsonwebtoken");

playersRouter.get("/", (req, res) => {
  Player.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
});

playersRouter.get("/playersExceptUser", (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (decodedToken) {
    Player.find({ _id: { $ne: decodedToken.id } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => res.send([]));
  } else {
    res.status(404).send();
  }
});

playersRouter.get("/currentUserID", (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  res.send(decodedToken.id);
});

playersRouter.get("/:id", (req, res) => {
  Player.findById(req.params.id)
    .then((player) => {
      res.send(player);
    })
    .catch((err) => {
      res.send(err);
    });
});

playersRouter.post("/", async (req, res) => {
  const body = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const player = new Player({
    ...body,
    password: passwordHash,
  });

  const savedPlayer = await player.save();
  res.send(savedPlayer);
});

module.exports = playersRouter;
