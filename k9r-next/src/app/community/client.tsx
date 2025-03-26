"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { getAllGameServers } from "@/api/game-servers/api";
import { GameServer } from "@/api/game-servers/models";
import CommunityHeader from "@/components/community/community-header/community-header";
import CommunityServers from "@/components/community/servers/servers";
import LoadingAlert from "@/components/loading/loading-alert";
import { useEffect, useState } from "react";

type CommunityPageClientProps = {
    community_details: CommunityDetails;
};

const CommunityPageClient = (props: CommunityPageClientProps) => {
    const [game_servers, setGameServers] = useState<GameServer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        (async () => {
            const servers = await getAllGameServers();
            setGameServers(servers);

            setLoading(false);
        })();
    })

    if (loading) {
        return (
            <LoadingAlert message="Loading servers..." />
        )
    }

    return (
        <>
            <CommunityHeader game_servers={game_servers} community_details={props.community_details} />
            <CommunityServers />
        </>
    );
}

export default CommunityPageClient;