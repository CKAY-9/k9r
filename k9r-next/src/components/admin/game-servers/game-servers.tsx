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
import { getCookie } from "@/utils/cookies";

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

		await deleteGameServerFromID(
			game_server_id,
			getCookie("token") || ""
		);
	};

	const updateGameServer = async (game_server: GameServer, index: number) => {
		const response = await updateGameServerFromID(
			game_server.id,
			game_server,
			getCookie("token") || ""
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
			getCookie("token") || ""
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
		<div className={style.container}>
			<section>
				<h2>Game Servers</h2>
				<span>
					K9-Revive&apos;s game servers service allows you to connect K9R
					with your game servers. Supported game(s): Minecraft
				</span>
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
				<button onClick={generateNewGameServer}>New Server</button>
			</div>
		</div>
	);
};

export default GameServersAdmin;
