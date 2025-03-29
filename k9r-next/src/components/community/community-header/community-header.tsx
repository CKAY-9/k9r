"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./header.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";
import CommunityIcon from "@/components/community-icon/community-icon";
import { GameServer } from "@/api/game-servers/models";
import { useEffect, useRef, useState } from "react";
import { getUserCount } from "@/api/users/api";
import { K9R_WEBSOCKET_HOST } from "@/api/resources";
import io from "socket.io-client";

type CommunityHeaderProps = {
	community_details: CommunityDetails;
	game_servers: GameServer[];
};

const CommunityHeader = (props: CommunityHeaderProps) => {
	const [user_count, setUserCount] = useState<number>(0);
	const [active_user_count, setActiveUserCount] = useState<number>(0);
	const [_room_id, _setRoomID] = useState<string>("");
	const ws = useRef<SocketIOClient.Socket | null>(null);

	useEffect(() => {
		ws.current = io(K9R_WEBSOCKET_HOST);

		ws.current.on("connect", () => {
			joinRoom("active-users");
			sendMessage("active-users", "active-users");
		});

		ws.current.on("receive_message", (data: any) => {
			setActiveUserCount(Number.parseInt(data || "0"));
		});

		(async () => {
			const users = await getUserCount();
			setUserCount(users);
		})();

		return () => {
			if (!ws.current) return;
			ws.current.off("receive_message");
		};
	}, []);

	const joinRoom = (room: string) => {
		if (!ws.current) return;
		const message_data = {
			room,
			content: room,
			sender: ws.current.id,
			server_key: ""
		};
		ws.current.emit("join_room", JSON.stringify(message_data));
	};

	const sendMessage = (message: string, room: string) => {
		if (!ws.current) return;
		const message_data = {
			room,
			content: message,
			sender: ws.current.id,
			server_key: ""
		};
		ws.current.emit("send_message", JSON.stringify(message_data));
	};

	return (
		<>
			<header
				className={style.community_header}
				style={{
					background:
						props.community_details.banner !== ""
							? `url(${props.community_details.banner})`
							: "var(--foreground)",
				}}
			>
				<div className={style.content}>
					<section className={style.splash}>
						<CommunityIcon
							community_details={props.community_details}
							size_rems={15}
						/>
						<h2>{props.community_details.name}</h2>
					</section>
					<div className={style.stats_container}>
						<div className={style.stats}>
							<div className={style.stat}>
								<section className={style.heading}>
									<MaterialIcon
										src="/icons/groups.svg"
										alt="All Users"
										size_rems={2}
									/>
									<span>Registered Users</span>
								</section>
								<span>{user_count}</span>
							</div>
							<div className={style.stat}>
								<section className={style.heading}>
									<MaterialIcon
										src="/icons/internet.svg"
										alt="Active Users"
										size_rems={2}
									/>
									<span>Active Users</span>
								</section>
								<span>{active_user_count}</span>
							</div>
							<div className={style.stat}>
								<section className={style.heading}>
									<MaterialIcon
										src="/icons/controller.svg"
										alt="Active Users"
										size_rems={2}
									/>
									<span>Servers</span>
								</section>
								<span>{props.game_servers.length}</span>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default CommunityHeader;
