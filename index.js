// importing modules
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const Room = require("./models/room");
var io = require("socket.io")(server);

// middle ware
app.use(express.json());

const DB =
  "mongodb+srv://assadullahuk786:tbUwGsh4Jfz6CHKS@cluster0.yzqevsq.mongodb.net/?retryWrites=true&w=majority";

io.on("connection", (socket) => {
  console.log("connected from App");
  socket.on("checkRoom", async ({ name, id, price, roomId }) => {
    console.log("checking room");
    try {
      // let checkRooms = await Room.find({ joined: { $ne: 4 } });

      // if (checkRooms.length == 0) {
      if (roomId == "") {
        createRoom(name, id, price);
      }

      // } else {
      else {
        joinRoom(roomId, name, id);
      }

      // }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnectRoom", async ({}) => {
    console.log("disconnect socket");
    try {
      socket;
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("runPawnAuto", async ({ dice, type, roomId }) => {
    

    socket.to(roomId).emit("runPawnListener", dice);

    try {
      // let checkRooms = await Room.find({ joined: { $ne: 4 } });
      // if (checkRooms.length == 0) {
      //   createRoom(name, id);
      // } else {
      //   joinRoom(checkRooms[0]["_id"], checkRooms[0]["joined"], name, id);
      // }
    } catch (e) {
      console.log(e);
    }
  });
  var count = 0;
  socket.on("runPawn", async ({ type, index, step, roomId }) => {
    console.log("count " + count++);
    console.log("Run runMove");

    console.log(type);
    console.log(index);
    console.log("step  ", step);
    data = {
      type: type,
      index: index,
      step: step,
    };
    socket.to(roomId).emit("runPawnListenerOnTap", data);

    try {
      // let checkRooms = await Room.find({ joined: { $ne: 4 } });
      // if (checkRooms.length == 0) {
      //   createRoom(name, id);
      // } else {
      //   joinRoom(checkRooms[0]["_id"], checkRooms[0]["joined"], name, id);
      // }
    } catch (e) {
      console.log(e);
    }
  });

  async function createRoom(name, id, price) {
    console.log("created new room");
    let room = new Room();

    let currentPlayer = {
      socketID: socket.id,
      name: name,
      id: id,
      playerType: "LudoPlayerType.green",
    };
    room.joined = 1;
    room.price = price;
    room.players.push(currentPlayer);
    room = await room.save();
    console.log("on create " + room);
    const roomIdDB = room._id.toString();

    socket.join(roomIdDB);
    io.to(socket.id).emit("getMyData", "LudoPlayerType.green");
    io.to(roomIdDB).emit("createRoomSuccess", room);
  }

  async function joinRoom(roomId, name, id) {
    console.log("joined new room");

    let room = await Room.findById(roomId);
    // console.log(room);
    if (room != null) {
      var playerType = "";
      if (room.joined == 1) {
        playerType = "LudoPlayerType.yellow";
      }
      if (room.joined == 2) {
        playerType = "LudoPlayerType.blue";
      }
      if (room.joined == 3) {
        playerType = "LudoPlayerType.red";
      }
      let currentPlayer = {
        socketID: socket.id,
        name: name,
        id: id,
        playerType: playerType,
      };
      room.players.push(currentPlayer);
      room.joined = parseInt(room.joined) + 1;

      room = await room.save();
      console.log("on join " + room);
      const roomIdDB = room._id.toString();
      // const allusers = room.players;
      // console.log(allusers);

      socket.join(roomIdDB);
      io.to(socket.id).emit("getMyData", playerType);
      io.to(roomIdDB).emit("createRoomSuccess", room);
      if (room.joined == 4) {
        io.to(roomIdDB).emit("returnAllUsers", room);
      }
    } else {
      var data = [];
      data.push({ value: "No Room Found of this Room ID" });

      console.log(data);
      io.to(socket.id).emit("errorListener", data);
      console.log("No Room Found of this ID");
    }
  }

  socket.on("friendsRoom", async ({ name, id }) => {
    console.log("created new room");
    let room = new Room();

    let currentPlayer = {
      socketID: socket.id,
      name: name,
      id: id,
      playerType: "LudoPlayerType.green",
    };
    room.joined = 1;
    room.players.push(currentPlayer);
    room = await room.save();

    const roomIdDB = room._id.toString();

    socket.join(roomIdDB);
    io.to(socket.id).emit("getMyData", "LudoPlayerType.green");
    io.to(roomIdDB).emit("friendsRoomSuccessListener", room);
  });
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((e) => {
    console.log(e);
  });

// app.use(express.json);
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
app.get("/get-roooms", async (request, response) => {
  let rooms = await Room.find({ joined: { $ne: 4 } });
  response.status(200).send({
    status_code: 200,
    rooms: rooms,
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server started and running on port ${port}`);
});
