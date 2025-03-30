import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getAuthorizedServer, getPersonalUser } from "./api";

type RoomID = string;
type UserID = string;
type Message = {
	room: RoomID;
	sender: UserID;
	server_key: string;
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

	socket.on("join_room", async (data: string) => {
		let parsed = JSON.parse(data);
		const room_id = parsed.room;
		socket.join(room_id);
	});

	socket.on("update_interval", async (data: string) => {
		let parsed = JSON.parse(data);
		if (parsed.server_key === "") {
			return;
		}

		let game_server = await getAuthorizedServer(parsed.server_key);
		if (game_server === null) {
			return;
		}

		parsed.server_key = "";
		io.to(parsed.room).emit("update_interval", data);
	});

	socket.on("player_chat", async (data: string) => {
		let parsed = JSON.parse(data);
		if (parsed.server_key === "") {
			return;
		}

		let game_server = await getAuthorizedServer(parsed.server_key);
		if (game_server === null) {
			return;
		}

		parsed.server_key = "";
		io.to(parsed.room).emit("player_chat", data);
	});

	socket.on("send_chat_message", async (data: string) => {
		let parsed = JSON.parse(data);
		if (parsed.server_key === "") {
			return;
		}

		let user = await getPersonalUser(parsed.server_key);
		if (user === null) {
			return;
		}

		parsed.content = JSON.stringify(parsed.content);
		parsed.server_key = "";
		io.to(parsed.room).emit("send_chat_message", JSON.stringify(parsed));
	});

	socket.on("send_message", async (data: string) => {
		let parsed = JSON.parse(data);
		let game_server = await getAuthorizedServer(parsed.server_key);
		if (game_server !== null) {
			return;
		}
		
		if (parsed.content === "active-users") {
			io.to(parsed.room).emit("receive_message", io.sockets.sockets.size);
		}
	});

	socket.on("disconnect", () => {});
});

const PORT = 8081;
server.listen(PORT, () => {
	console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
