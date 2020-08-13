const groupsRouter = require("express").Router();
const Group = require("../models/group");
const jwt = require("jsonwebtoken");
const Player = require("../models/player");

groupsRouter.get("/", (req, res) => {
  Group.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {});
});

groupsRouter.get("/ownedGroups", (req, res) => {
  Group.find({ owner: req.user.id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.status(401).send(err));
});

groupsRouter.get("/joinedGroups", (req, res) => {
  Group.find({
    owner: { $ne: req.user.id },
    players: { $in: [req.user.id] },
    meetingDateTime: { $gt: Math.floor(Date.now() / 1000) },
  })
    .then((data) => res.send(data))
    .catch((err) => res.status(404).send(err));
});

groupsRouter.get("/unjoinedGroups", async (req, res) => {
  let unjoined = await Group.find({
    players: { $nin: [req.user.id] },
    meetingDateTime: { $gt: Math.floor(Date.now() / 1000) },
  });
  res.send(unjoined);
});

groupsRouter.post("/createGroup", async (req, res) => {
  const user = await Player.findById(req.user.id);
  const newGroup = new Group({
    ...req.body,
    owner: user._id,
    players: [user._id],
  });

  await newGroup.save();
  user.groups.concat(newGroup._id);
  res.send(newGroup);
});

groupsRouter.post("/joinGroup", async (req, res) => {
  const group = await Group.findById(req.body.groupID);

  if (group) {
    let updatedGroup = await Group.findByIdAndUpdate(
      req.body.groupID,
      { $push: { players: req.user.id } },
      { useFindAndModify: false }
    );
    res.send(updatedGroup);
  } else {
    res.status(404).send();
  }
});

groupsRouter.get("/leaveGroup", (req, res) => {
  res.send(req.user);
});

module.exports = groupsRouter;
