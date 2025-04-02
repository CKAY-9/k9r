"use client";

import { getAllGameServers } from "@/api/game-servers/api";
import { GameServer } from "@/api/game-servers/models";
import LoadingAlert from "@/components/loading/loading-alert";
import { useEffect, useState } from "react";
import style from "./servers.module.scss";
import Link from "next/link";

type CommunityServerProps = {
	server: GameServer;
};

const CommunityServer = (props: CommunityServerProps) => {
	const [background, setBackground] = useState<string>("var(--foreground)");

	useEffect(() => {
		// TODO: custom background
		switch (props.server.game) {
			case "minecraft":
				setBackground(`url(/games/minecraft_default.png)`);
				break;
			default:
				break;
		}
	}, [props.server.game]);

	return (
		<div className={style.server} style={{ background: background }}>
			<div className={style.content}>
				<h3>{props.server.name}</h3>
				<span>{props.server.description}</span>

				<span style={{"textTransform": "capitalize"}}>{props.server.game.toWellFormed()}</span>
			</div>
		</div>
	);
};

const CommunityServers = () => {
	const [servers, setServers] = useState<GameServer[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const s = await getAllGameServers();
			setServers(s);

			setLoading(false);
		})();
	}, []);

	return (
		<>
			<h2>Servers</h2>
			{loading ? (
				<LoadingAlert message="Loading servers..." />
			) : (
				<div className={style.servers}>
					{servers.map((server, index) => {
						return (
							<Link style={{"borderBottom": "0"}} href={`/community/server/${server.id}`} key={index}>
								<CommunityServer server={server} />
							</Link>
						);
					})}
					{servers.length <= 0 && (
						<span>No servers found...</span>
					)}
				</div>
			)}
		</>
	);
};

export default CommunityServers;
