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
import { getAnyToken } from "@/utils/token";
import MinecraftHow from "./minecraft-how";

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
		<div className={`${style.server} flex col gap-1`}>
			<section className={`flex col gap-half`}>
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
			<section className={`flex col gap-half`}>
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
			<section className={`flex col gap-half`}>
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
			<section className={`flex col gap-half`}>
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
			<section className={`flex col gap-half`}>
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

enum HowToView {
	MINECRAFT,
}

const GameServersAdmin = () => {
	const [game_servers, setGameServers] = useState<GameServer[]>([]);
	const [showing_how, setShowingHow] = useState<boolean>(false);
	const [how_game, setHowGame] = useState<HowToView>(HowToView.MINECRAFT);

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
				<Popup remove_padding={true}>
					<>
						<nav className={style.nav}>
							<button
								className="no-border"
								onClick={() => setShowingHow(false)}
							>
								Close
							</button>
							<button
								className="no-border"
								onClick={() => setHowGame(HowToView.MINECRAFT)}
							>
								Minecraft
							</button>
						</nav>
						{how_game === HowToView.MINECRAFT && (
							<MinecraftHow />
						)}
					</>
				</Popup>
			)}
			<div className={`${style.container} flex col gap-1`}>
				<section>
					<h2>Game Servers</h2>
					<span>
						K9-Revive&apos;s game servers service allows you to
						connect K9R with your game servers. Supported game(s):
						Minecraft
					</span>
				</section>
				<section className="flex row gap-1">
					<button onClick={() => setShowingHow(true)}>
						How to use
					</button>
					<button onClick={generateNewGameServer}>New Server</button>
				</section>
				<div className={`${style.servers} flex row gap-1 wrap`}>
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
