"use server";

import { getCommunityDetails } from "@/api/community-details/api";
import { getGameServerFromID } from "@/api/game-servers/api";
import { getPersonalUser } from "@/api/users/api";
import GameServerView from "@/components/community/servers/server";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";

export const generateMetadata = async ({
	params,
}: {
	params: {
		id: string;
	};
}): Promise<Metadata> => {
	const details = await getCommunityDetails();

	const server_id = Number.parseInt(params.id || "-1");
	const game_server = await getGameServerFromID(server_id);

	if (game_server !== null) {
		return {
			title: `${game_server.name} - ${details.name}`,
			description: `View the details of ${details}'s ${game_server.game} server. Server Description: ${game_server.description}. ${details.description}`,
		};
	}

	return {
		title: `Community - ${details.name}`,
		description: `Community homepage for ${details.name}. ${details.description}`,
	};
};

const GameServerPage = async ({
	params,
}: {
	params: {
		id: string;
	};
}) => {
	const details = await getCommunityDetails();

	const server_id = Number.parseInt(params.id || "-1");
	const game_server = await getGameServerFromID(server_id);

	const user_token = await getStoredCookie("token");
	const personal_user = await getPersonalUser(user_token);

	return (
		<>
			<Header community_details={details} personal_user={personal_user} />
			{game_server === null ? (
				<main className="container">
					<h2>Failed to find game server.</h2>
				</main>
			) : (
				<GameServerView
					game_server={game_server}
					community_details={details}
					personal_user={personal_user}
				/>
			)}

			<Footer community_details={details} />
		</>
	);
};

export default GameServerPage;
