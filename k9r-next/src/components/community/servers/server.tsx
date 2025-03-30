"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { GameServer, ServerMessage } from "@/api/game-servers/models";
import { User } from "@/api/users/models";
import style from "./servers.module.scss";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { K9R_WEBSOCKET_HOST } from "@/api/resources";
import io from "socket.io-client";
import MaterialIcon from "@/components/material-icon/material-icon";
import { getCookie } from "@/utils/cookies";
import UserIcon from "@/components/user/user-icon/user-icon";
import { getUserFromID } from "@/api/users/api";

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

type K9RChatMessage = {
	id: number;
	username: string;
	display_name: string;
	message: string;
};

type K9RMinecraftMessageProps = {
	message: K9RChatMessage;
};

const K9RChatMessage = (props: K9RMinecraftMessageProps) => {
	const [sender, setSender] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			const s = await getUserFromID(props.message.id);
			setSender(s);
		})();
	}, [props.message.id]);

	return (
		<div className={style.chat_message}>
			<section className={style.user_data}>
				{sender !== null && <UserIcon user={sender} size_rems={2} />}
				<span>{props.message.display_name}</span>
				<span style={{"opacity": "0.5"}}>[K9R]</span>
			</section>
			<section className={style.content}>
				<p>{props.message.message}</p>
			</section>
		</div>
	);
};

const GameServerView = (props: GameServerProps) => {
	const [background, setBackground] = useState<string>("");
	const ws = useRef<SocketIOClient.Socket | null>(null);
	const [player_count, setPlayerCount] = useState<number>(0);
	const [server_active, setServerActive] = useState<boolean>(false);
	const [chat_message, setChatMessage] = useState<string>("");
	const [chat_messages, setChatMessages] = useState<
		K9RChatMessage[] | MinecraftPlayerChatMessage[] | any[]
	>([]);

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
	};

	const sendChatMessage = async (e: BaseSyntheticEvent) => {
		if (
			!ws.current ||
			props.personal_user === null ||
			chat_message.length <= 0
		)
			return;
		const message_data = {
			room: `${props.game_server.name}-${props.game_server.id}`,
			content: {
				id: props.personal_user.id,
				username: props.personal_user.username,
				display_name: props.personal_user.display_name,
				message: chat_message,
			},
			sender: ws.current.id,
			server_key: getCookie("token") || "",
		};
		ws.current.emit("send_chat_message", JSON.stringify(message_data));
		setChatMessage("");
		const input_element: HTMLInputElement | null = document.getElementById(
			"minecraft_chat_input"
		) as HTMLInputElement;
		if (input_element !== null) {
			input_element.value = "";
		}
	};

	useEffect(() => {
		const room = `${props.game_server.name}-${props.game_server.id}`;
		if (props.game_server.game === "minecraft") {
			setBackground("url(/games/minecraft_default.png)");
		}

		ws.current = io(K9R_WEBSOCKET_HOST);

		ws.current.on("connect", () => {
			joinRoom(room);
		});

		ws.current.on("update_interval", (data: string) => {
			const parsed: ServerMessage = JSON.parse(data);
			if (props.game_server.game === "minecraft") {
				const parsed_content = JSON.parse(parsed.content);
				setPlayerCount(parsed_content.player_count);
			}

			setServerActive(true);
		});

		ws.current.on("player_chat", (data: string) => {
			const parsed: ServerMessage = JSON.parse(data);
			if (props.game_server.game === "minecraft") {
				const parsed_content: MinecraftPlayerChatMessage = JSON.parse(
					parsed.content
				);
				setChatMessages((old) => [...old, parsed_content]);
			}
		});

		ws.current.on("send_chat_message", (data: string) => {
			const parsed: ServerMessage = JSON.parse(data);
			if (props.game_server.game === "minecraft") {
				const parsed_content: K9RChatMessage = JSON.parse(
					parsed.content
				);
				setChatMessages((old) => [...old, parsed_content]);
			}
		});

		return () => {
			if (!ws.current) return;
			ws.current.close();
		};
	}, [
		props.game_server.game,
		props.game_server.id,
		joinRoom,
		props.game_server.name,
	]);

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
					{chat_messages.map((message: any, index: number) => {
						if (
							props.game_server.game === "minecraft" &&
							typeof message?.uuid === "string"
						) {
							const msg = message as MinecraftPlayerChatMessage;
							return (
								<div key={index} className={style.chat_message}>
									<section className={style.user_data}>
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

						return (
							<K9RChatMessage
								key={index}
								message={message as K9RChatMessage}
							/>
						);

						return <></>;
					})}
					{props.personal_user !== null && (
						<div className={style.chat_input}>
							<input
								type="text"
								placeholder={`Send a message to ${props.game_server.name}`}
								className={style.input}
								defaultValue={chat_message}
								onChange={(e: BaseSyntheticEvent) =>
									setChatMessage(e.target.value)
								}
								id="minecraft_chat_input"
							/>
							<button
								onClick={sendChatMessage}
								className={style.send_button}
							>
								<MaterialIcon
									src="/icons/send.svg"
									alt="Send message"
									size_rems={2}
								/>
							</button>
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default GameServerView;
