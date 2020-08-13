const groupsRouter = require("express").Router();
const Group = require("../models/group");
const jwt = require("jsonwebtoken");
const Player = require("../models/player");
const { getTokenFrom } = require("../utils/token");

groupsRouter.get("/", (req, res) => {
  Group.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

groupsRouter.get("/ownedGroups", (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (decodedToken) {
    Group.find({ owner: decodedToken.id })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => res.send(err));
  } else {
    res.status(404).send();
  }
});

groupsRouter.get("/joinedGroups", (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (decodedToken) {
    Group.find({
      owner: { $ne: decodedToken.id },
      players: { $in: [decodedToken.id] },
      meetingDateTime: { $gt: Math.floor(Date.now() / 1000) },
    }).then((data) => res.send(data));
  } else {
    res.status(404).send();
  }
});

groupsRouter.get("/unjoinedGroups", (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (decodedToken) {
    Group.find({
      players: { $ne: [decodedToken.id] },
      meetingDateTime: { $gt: Math.floor(Date.now() / 1000) },
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => res.status(401).send(err));
  } else {
    res.status(404).send();
  }
});

groupsRouter.post("/createGroup", async (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = await Player.findById(decodedToken.id);

  const newGroup = new Group({
    ...req.body,
    owner: user._id,
    players: [user._id],
  });

  await newGroup.save();
  user.groups.concat(newGroup._id);

  res.send(newGroup);
});

module.exports = groupsRouter;
