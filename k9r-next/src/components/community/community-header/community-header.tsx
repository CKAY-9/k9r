"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./header.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";
import CommunityIcon from "@/components/community-icon/community-icon";
import { GameServer } from "@/api/game-servers/models";
import { useEffect, useState } from "react";
import { User } from "@/api/users/models";
import { getUserCount } from "@/api/users/api";

type CommunityHeaderProps = {
    community_details: CommunityDetails;
    game_servers: GameServer[];
};

const CommunityHeader = (props: CommunityHeaderProps) => {
    const [user_count, setUserCount] = useState<number>(0);
    const [active_user_count, setActiveUserCount] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const users = await getUserCount();
            setUserCount(users);
        })();
    }, []);
    
    return (
        <>
            <header className={style.community_header}>
                <section className={style.splash}>
                    <CommunityIcon community_details={props.community_details} size_rems={15} />
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
            </header>
        </>
    );
}

export default CommunityHeader;