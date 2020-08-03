const mongoose = require("mongoose");

let playerModel = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  screenName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sizePref: {
    type: Number,
    required: true,
  },
  campaignsPlayed: {
    type: Number,
    required: true,
  },
  yoe: {
    type: Number,
    required: true,
  },
  systemsPref: {
    type: [String],
    required: true,
  },
  genresPref: {
    type: [String],
    required: true,
  },
  combat: {
    type: String,
    required: true,
  },
  sexualContent: {
    type: String,
    required: true,
  },
  humor: {
    type: String,
    required: true,
  },
  violence: {
    type: String,
    required: true,
  },
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Group",
  },
});

playerModel.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = mongoose.model("players", playerModel);
