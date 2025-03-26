"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { GameServer } from "@/api/game-servers/models";
import { User } from "@/api/users/models";
import style from "./servers.module.scss";
import { useEffect, useRef, useState } from "react";
import { K9R_WEBSOCKET_HOST } from "@/api/resources";

type GameServerProps = {
	game_server: GameServer;
	community_details: CommunityDetails;
	personal_user: User | null;
};

const GameServerView = (props: GameServerProps) => {
	const [background, setBackground] = useState<string>("");
	const [_room_id, setRoomID] = useState<string>("");
	const ws = useRef<SocketIOClient.Socket | null>(null);

	useEffect(() => {
		if (props.game_server.game === "minecraft") {
			setBackground("url(/games/minecraft_default.png)");
		}

		ws.current = io(K9R_WEBSOCKET_HOST);

		ws.current.on("connect", () => {
			if (props.game_server.game === "minecraft") {
                joinRoom(`minecraft-server-${props.game_server.id}`);
            }
		});

		ws.current.on("receive_message", (_data: string) => {
			
		});

		return () => {
			if (!ws.current) return;
			ws.current.off("receive_message");
		};
	}, [props.game_server.game, props.game_server.id]);

	const joinRoom = (room: string) => {
		if (!ws.current) return;
		ws.current.emit("join_room", room);
		setRoomID(room);
	};

	const _sendMessage = (message: string, room: string) => {
		if (!ws.current) return;
		const messageData = {
			room,
			content: message,
			sender: ws.current.id,
		};
		ws.current.emit("send_message", messageData);
	};

	return (
		<div className={style.server_container}>
			<div
				className={style.server_splash}
				style={{ background: background }}
			>
				<div className={style.content}>
					<h1>{props.game_server.name}</h1>
					<span>{props.game_server.description}</span>
					<section className={style.options}>
						{props.game_server.game === "minecraft" && (
							<div style={{ textAlign: "center" }}>
								<span style={{ opacity: "0.5" }}>
									Connect using
								</span>
								<h3>{props.game_server.host_address}</h3>
							</div>
						)}
					</section>
				</div>
			</div>
			<div className="container"></div>
		</div>
	);
};

export default GameServerView;
