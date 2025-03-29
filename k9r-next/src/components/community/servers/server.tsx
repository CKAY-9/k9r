"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { GameServer, ServerMessage } from "@/api/game-servers/models";
import { User } from "@/api/users/models";
import style from "./servers.module.scss";
import { useEffect, useRef, useState } from "react";
import { K9R_WEBSOCKET_HOST } from "@/api/resources";
import io from "socket.io-client";
import MaterialIcon from "@/components/material-icon/material-icon";

type GameServerProps = {
	game_server: GameServer;
	community_details: CommunityDetails;
	personal_user: User | null;
};

type MinecraftPlayerChatMessage = {
	uuid: string;
	username: string;
	display_name: string;
	message: string;
	world_name: string;
};

const GameServerView = (props: GameServerProps) => {
	const [background, setBackground] = useState<string>("");
	const [_room_id, setRoomID] = useState<string>("");
	const ws = useRef<SocketIOClient.Socket | null>(null);
	const [player_count, setPlayerCount] = useState<number>(0);
	const [server_active, setServerActive] = useState<boolean>(false);
	const [chat_messages, setChatMessages] = useState<
		MinecraftPlayerChatMessage[] | any[]
	>([]);

	useEffect(() => {
		if (props.game_server.game === "minecraft") {
			setBackground("url(/games/minecraft_default.png)");
		}

		ws.current = io(K9R_WEBSOCKET_HOST);

		ws.current.on("connect", () => {
			joinRoom(`${props.game_server.name}-${props.game_server.id}`);
		});

		ws.current.on("update_interval", (data: string) => {
			let parsed: ServerMessage = JSON.parse(data);
			if (props.game_server.game === "minecraft") {
				let parsed_content = JSON.parse(parsed.content);
				setPlayerCount(parsed_content.player_count);
			}

			setServerActive(true);
			setTimeout(() => {
				setServerActive(false);
			}, 1000 * 60);
		});

		ws.current.on("player_chat", (data: string) => {
			let parsed: ServerMessage = JSON.parse(data);
			if (props.game_server.game === "minecraft") {
				let parsed_content: MinecraftPlayerChatMessage = JSON.parse(
					parsed.content
				);
				setChatMessages((old) => [...old, parsed_content]);
			}
		});

		return () => {
			if (!ws.current) return;
			ws.current.off("receive_message");
		};
	}, [props.game_server.game, props.game_server.id]);

	const joinRoom = (room: string) => {
		if (!ws.current) return;
		ws.current.emit(
			"join_room",
			JSON.stringify({
				room: room,
				sender: props.personal_user?.id || -1,
				server_key: "",
				content: "join-room",
			})
		);
		setRoomID(room);
	};

	const _sendMessage = (message: string, room: string) => {
		if (!ws.current) return;
		const message_data = {
			room,
			content: message,
			sender: ws.current.id,
			server_key: "",
		};
		ws.current.emit("send_message", JSON.stringify(message_data));
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
			<div className="container" style={{ gap: "1rem" }}>
				<h2>Information</h2>
				<section className={style.info}>
					<div className={style.info_block}>
						<section className={style.title}>
							<MaterialIcon
								src="/icons/internet.svg"
								alt="Online Players"
								size_rems={2}
							/>
							<h4>Status</h4>
						</section>
						<span>{server_active ? "Online" : "Offline"}</span>
					</div>
					<div className={style.info_block}>
						<section className={style.title}>
							<MaterialIcon
								src="/icons/groups.svg"
								alt="Online Players"
								size_rems={2}
							/>
							<h4>Online Players</h4>
						</section>
						<span>{player_count}</span>
					</div>
				</section>
				<h2>In-game Chat</h2>
				<section className={style.game_chat}>
					{chat_messages.length <= 0 && (
						<span>No chat messages.</span>
					)}
					{chat_messages.map(
						(
							message: MinecraftPlayerChatMessage,
							index: number
						) => {
							if (props.game_server.game === "minecraft") {
								const msg =
									message as MinecraftPlayerChatMessage;
								return (
									<div
										key={index}
										className={style.minecraft_message}
									>
										<section className={style.player_data}>
											<MaterialIcon
												src={`https://mc-heads.net/avatar/${msg.uuid}`}
												alt="Player head"
												size_rems={2}
											/>
											<span>{msg.display_name}</span>
											<span style={{ opacity: "0.5" }}>
												[{msg.world_name}]
											</span>
										</section>
										<section className={style.content}>
											<p>{msg.message}</p>
										</section>
									</div>
								);
							}

							return <></>;
						}
					)}
				</section>
			</div>
		</div>
	);
};

export default GameServerView;
