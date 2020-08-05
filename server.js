const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./utils/config");
const cors = require("cors");
const groupsRouter = require("./controllers/groups");
const playersRouter = require("./controllers/players");
const loginRouter = require("./controllers/login");

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("connected to MongoDB"))
  .catch((error) =>
    console.error("error connecting to server " + error.message)
  );

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use("/login", loginRouter);
app.use("/players", playersRouter);
app.use("/groups", groupsRouter);
app.listen(config.PORT);
console.log(`Server listening on ${config.PORT}`);
