import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

type RoomID = string;
type UserID = string;
type Message = {
	room: RoomID;
	sender: UserID;
	content: string;
};

const app = express();
const server = createServer(app);

const io = new Server(server, {
	cors: {
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket: Socket) => {
	console.log("A user connected:", socket.id);

	socket.on("join_room", (roomID: RoomID) => {
		socket.join(roomID);
		console.log(`User ${socket.id} joined room ${roomID}`);
	});

	socket.on("send_message", (data: Message) => {
		console.log(`Message received in room ${data.room}:`, data.content);
		if (data.content === "active-users") {
            io.to(data.room).emit("receive_message", io.sockets.sockets.size)
        }
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

const PORT = 8081;
server.listen(PORT, () => {
	console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
