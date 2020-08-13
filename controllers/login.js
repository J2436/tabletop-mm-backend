const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Player = require("../models/player");
const { getTokenFrom } = require("../utils/token");

loginRouter.post("/", async (req, res) => {
  const body = req.body;
  const user = await Player.findOne({ email: body.email });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "Invalid email or password" });
  } else {
    const userFormToken = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(userFormToken, process.env.SECRET, {
      expiresIn: "15m",
    });

    res
      .status(201)
      .cookie("jwt", token, { httpOnly: true })
      .send({ token, id: user.id, screenName: user.screenName });
  }
});

loginRouter.get("/isLoggedIn", (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (decodedToken) {
    res.send(decodedToken);
  } else res.status(404).send();
});

loginRouter.get("/logout", (req, res) => {
  res.clearCookie("jwt").send();
});

module.exports = loginRouter;
