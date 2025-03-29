import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getAuthorizedServer } from "./api";

type RoomID = string;
type UserID = string;
type Message = {
	room: RoomID;
	sender: UserID;
	server_key?: string;
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

	socket.on("join_room", async (data: Message) => {
		const room_id = data.room;
		socket.join(room_id);
		console.log(`User ${socket.id} joined room ${room_id}`);
	});

	socket.on("update_interval", async (data: Message) => {
		console.log(data);

		if (!data.server_key || data.server_key === "") {
			return;
		}

		let game_server = await getAuthorizedServer(data.server_key);
		if (game_server === null) {
			return;
		}

		data.server_key = "";
		io.to(data.room).emit("update_interval", data);
	});

	socket.on("send_message", async (data: Message) => {
		console.log(`Message received in room ${data.room}:`, data.content);
		let game_server = null;
		if (data.server_key) {
			game_server = await getAuthorizedServer(data.server_key);
			if (game_server === null) {
				return;
			}
		}

		if (game_server !== null) {
			
		} else {
			
		}

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
