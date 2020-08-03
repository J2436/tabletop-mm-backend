const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Player = require("../models/player");

loginRouter.post("/", async (req, res) => {
  const body = req.body;

  const user = await Player.findOne({ email: body.email });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  console.log(user);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid email or password",
    });
  }

  const userFormToken = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(userFormToken, process.env.SECRET);

  res
    .status(200)
    .send({ token, email: user.email, screenName: user.screenName });
});

module.exports = loginRouter;
