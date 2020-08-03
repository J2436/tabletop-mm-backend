const groupsRouter = require("express").Router();
const Group = require("../models/group");
const jwt = require("jsonwebtoken");
const Player = require("../models/player");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

groupsRouter.get("/", (req, res) => {
  Group.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

groupsRouter.post("/createGroup", async (req, res) => {
  console.log(req.get("authorization"));

  //const token = getTokenFrom(req);
  //const decodedToken = jwt.verify(token, process.env.SECRET);
  //if (!token || !decodedToken.id) {
  //return res.status(401).json({ error: "token missing or invalid" });
  //}

  //console.log(token);
  //console.log(decodedToken);
  //const user = await Player.findById(decodedToken.id);

  //const newGroup = new Group({
  //...req.body,
  //owner: user._id,
  //players: [user._id],
  //});

  //await newGroup.save;
  //user.groups.concat(newGroup._id);

  //res.send(newGroup);
});

module.exports = groupsRouter;
