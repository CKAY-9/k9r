"use client";

import { getAllGameServers } from "@/api/game-servers/api";
import { GameServer } from "@/api/game-servers/models";
import LoadingAlert from "@/components/loading/loading-alert";
import { useEffect, useState } from "react";
import style from "./servers.module.scss";

type CommunityServerProps = {
    server: GameServer;
};

const CommunityServer = (props: CommunityServerProps) => {
    const [background, setBackground] = useState<string>("var(--foreground)");

    useEffect(() => {
        // TODO: custom background
        switch (props.server.game) {
            case "minecraft":
                setBackground(`url(/games/minecraft_default.png)`)
                break;
            default:
                break;
        }
    }, []);

    return (
        <div className={style.server} style={{"background": background}}>
            <div className={style.content}>
                <h3>{props.server.name}</h3>
                <span>{props.server.description}</span>

                <span>Connect: {props.server.host_address}</span>
            </div>
        </div>
    )
}

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
                            <CommunityServer server={server} key={index} />
                        )
                    })}
                </div>
            )}
        </>
    );
}

export default CommunityServers;