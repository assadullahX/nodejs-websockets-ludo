const mongoose = require("mongoose");
const playerSchema = require("./player");

// const roomSchema = new mongoose.Schema({
//   occupancy: {
//     type: Number,
//     default: 2,
//   },
//   maxRounds: {
//     type: Number,
//     default: 6,
//   },
//   currentRound: {
//     required: true,
//     type: Number,
//     default: 1,
//   },
//   players: [playerSchema],
//   isJoin: {
//     type: Boolean,
//     default: true,
//   },
//   turn: playerSchema,
//   turnIndex: {
//     type: Number,
//     default: 0,
//   },
// });

const roomSchema = new mongoose.Schema({
  isJoin: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  joined: {
    type: Number,
    default: 0,
  },
  currentColor: {
    type: String,
    default: "green",
  },
  players: [playerSchema],
});

const roomModel = mongoose.model("Room", roomSchema);
module.exports = roomModel;
