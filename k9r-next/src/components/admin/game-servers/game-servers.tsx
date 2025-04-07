"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./servers.module.scss";
import { GameServer } from "@/api/game-servers/models";
import {
	createGameServer,
	deleteGameServerFromID,
	getAllGameServers,
	updateGameServerFromID,
} from "@/api/game-servers/api";
import Popup from "@/components/popup/popup";
import Image from "next/image";
import { getAnyToken } from "@/utils/token";

type GameServerEditProps = {
	game_server: GameServer;
	on_delete: any;
	on_update: any;
	on_create: any;
	index: number;
};

const GameServerEdit = (props: GameServerEditProps) => {
	const [game_server, setGameServer] = useState<GameServer>(
		props.game_server
	);

	const copyServerKey = (e: BaseSyntheticEvent) => {
		e.preventDefault();
		navigator.clipboard.writeText(props.game_server.server_key);
		alert("Copied server key to clipboard.");
	};

	return (
		<div className={style.server}>
			<section className={style.field}>
				<label>Name</label>
				<input
					type="text"
					defaultValue={game_server.name}
					placeholder="Server name"
					onChange={(e: BaseSyntheticEvent) => {
						game_server.name = e.target.value;
						setGameServer(game_server);
					}}
				/>
			</section>
			<section className={style.field}>
				<label>Description</label>
				<input
					type="text"
					defaultValue={game_server.description}
					placeholder="Server description"
					onChange={(e: BaseSyntheticEvent) => {
						game_server.description = e.target.value;
						setGameServer(game_server);
					}}
				/>
			</section>
			<section className={style.field}>
				<label>Game</label>
				<select
					defaultValue={game_server.game}
					onChange={(e: BaseSyntheticEvent) => {
						game_server.game = e.target.value;
						setGameServer(game_server);
					}}
				>
					<option value=""></option>
					<option value="minecraft">Minecraft</option>
				</select>
			</section>
			<section className={style.field}>
				<label>Host Address</label>
				<input
					type="text"
					defaultValue={game_server.host_address}
					placeholder="Server host"
					onChange={(e: BaseSyntheticEvent) => {
						game_server.host_address = e.target.value;
						setGameServer(game_server);
					}}
				/>
			</section>
			<section className={style.field}>
				<button onClick={copyServerKey}>Copy Server Key</button>
			</section>
			{props.game_server.id <= -1 ? (
				<button
					onClick={() => props.on_create(game_server, props.index)}
				>
					Create
				</button>
			) : (
				<button
					onClick={() => props.on_update(game_server, props.index)}
				>
					Update
				</button>
			)}
			<button
				onClick={() => props.on_delete(game_server.id, props.index)}
			>
				Delete
			</button>
		</div>
	);
};

const GameServersAdmin = () => {
	const [game_servers, setGameServers] = useState<GameServer[]>([]);
	const [showing_how, setShowingHow] = useState<boolean>(false);
	const [how_game, setHowGame] = useState<number>(0);

	useEffect(() => {
		(async () => {
			const servers = await getAllGameServers();
			setGameServers(servers);
		})();
	}, []);

	const deleteGameServer = async (game_server_id: number, index?: number) => {
		const servers = game_servers.filter(
			(server, server_index) => index !== server_index
		);

		setGameServers(servers);

		if (game_server_id <= 0) {
			return;
		}

		await deleteGameServerFromID(game_server_id, await getAnyToken());
	};

	const updateGameServer = async (game_server: GameServer, index: number) => {
		const response = await updateGameServerFromID(
			game_server.id,
			game_server,
			await getAnyToken()
		);
		if (response !== null) {
			const filtered = game_servers.filter(
				(server, server_index) => server_index !== index
			);
			setGameServers([...filtered, response]);
		}
	};

	const newGameServer = async (game_server: GameServer, index: number) => {
		const response = await createGameServer(
			game_server,
			await getAnyToken()
		);
		if (response !== null) {
			const filtered = game_servers.filter(
				(server, server_index) => server_index !== index
			);
			setGameServers([...filtered, response]);
		}
	};

	const generateNewGameServer = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const new_server: GameServer = {
			id: -(game_servers.length + 1),
			name: `Game Server #${game_servers.length + 1}`,
			description: "Game Server Description",
			game: "minecraft",
			server_key: "",
			host_address: "",
			latest_state: "",
		};

		setGameServers((old) => [...old, new_server]);
	};

	return (
		<>
			{showing_how && (
				<Popup close={() => setShowingHow(false)}>
					<>
						<h2>How to use K9R Game Servers</h2>
						<section>
							<button onClick={() => setHowGame(0)}>
								Minecraft
							</button>
							<button onClick={() => setHowGame(1)}>
								Garry&apos;s Mod{" "}
								<span style={{ opacity: "0.5" }}>
									(coming soon...)
								</span>
							</button>
						</section>
						{how_game === 0 && (
							// Minecraft
							<>
								<h4>Minecraft Servers</h4>
								<section>
									<span></span>
								</section>
								<div className={style.how_to}>
									<section className={style.step}>
										<span>
											Create a new game server here
										</span>
										<Image
											src="/games/minecraft_how1.png"
											alt="How To 1"
											sizes="100%"
											width={0}
											height={0}
											style={{
												height: "auto",
												width: "40rem",
											}}
										/>
									</section>
									<section className={style.step}>
										<span>
											Download the latest version of the
											K9R-Minecraft plugin
										</span>
										<Image
											src="/games/minecraft_how2.png"
											alt="How To 2"
											sizes="100%"
											width={0}
											height={0}
											style={{
												width: "40rem",
												height: "auto",
											}}
										/>
									</section>
									<section className={style.step}>
										<span>
											Place k9r-minecraft-version.jar into
											your server&apos;s /plugnis folder
										</span>
										<Image
											src="/games/minecraft_how3.png"
											alt="How To 3"
											sizes="100%"
											width={0}
											height={0}
											style={{
												width: "40rem",
												height: "auto",
											}}
										/>
									</section>
									<section className={style.step}>
										<span>Run your Minecraft server</span>
										<Image
											src="/games/minecraft_how4.png"
											alt="How To 4"
											sizes="100%"
											width={0}
											height={0}
											style={{
												width: "40rem",
												height: "auto",
											}}
										/>
										<span>
											Don&apos;t worry about the warning. You
											just haven&apos;t setup your server
											key/configuration.
										</span>
									</section>
									<section className={style.step}>
										<span>
											Edit your K9R config (either in game
											or through
											plugins/K9R-Minecraft/config.yml)
										</span>
										<Image
											src="/games/minecraft_how5.png"
											alt="How To 4"
											sizes="100%"
											width={0}
											height={0}
											style={{
												width: "40rem",
												height: "auto",
											}}
										/>
									</section>
									<section className={style.step}>
										<span>
											Restart your Minecraft server
										</span>
										<span>
											Upon restart, your server should
											connect to K9R. If it doesn&apos;t,
											something may be wrong with your
											server key or websocket/API host.
										</span>
									</section>
								</div>
							</>
						)}
					</>
				</Popup>
			)}
			<div className={style.container}>
				<section>
					<h2>Game Servers</h2>
					<span>
						K9-Revive&apos;s game servers service allows you to
						connect K9R with your game servers. Supported game(s):
						Minecraft
					</span>
				</section>
				<section>
					<button onClick={() => setShowingHow(true)}>
						How to use
					</button>
					<button onClick={generateNewGameServer}>New Server</button>
				</section>
				<div className={style.servers}>
					{game_servers.map((game_server, index) => {
						return (
							<GameServerEdit
								on_create={newGameServer}
								on_update={updateGameServer}
								on_delete={deleteGameServer}
								game_server={game_server}
								key={game_server.id}
								index={index}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default GameServersAdmin;
