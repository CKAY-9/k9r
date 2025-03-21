"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./info.module.scss";
import CommunityIcon from "@/components/community-icon/community-icon";
import MaterialIcon from "@/components/material-icon/material-icon";
import { useEffect, useState } from "react";
import { getUserCount } from "@/api/users/api";
import { getForumPostCount, getForumThreadCount } from "@/api/forum/api";

type ForumInfoProps = {
    community_details: CommunityDetails;
};

const ForumInfo = (props: ForumInfoProps) => {
    const [total_users, setTotalUsers] = useState<number>(0);
    const [total_threads, setTotalThreads] = useState<number>(0);
    const [total_posts, setTotalPosts] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const us = await getUserCount();
            setTotalUsers(us);

            const ts = await getForumThreadCount();
            setTotalThreads(ts);

            const ps = await getForumPostCount();
            setTotalPosts(ps);
        })();
    }, []);
    
    return (
        <div className={style.forum_info}>
            <section className={style.info}>
                <CommunityIcon size_rems={5} community_details={props.community_details} />
                <h3>{props.community_details.name}</h3>
            </section>
            <section className={style.info} style={{"alignItems": "flex-start"}}>
                <div className={style.stat} style={{"marginBottom": "1rem"}}>
                    <MaterialIcon src="/icons/query_stats.svg" size_rems={2} alt="Forum Statistics" />
                    <h4>Statistics</h4>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/groups.svg" size_rems={2} alt="Total Users" />
                    <span>{total_users}</span>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/internet.svg" size_rems={2} alt="Online Users" />
                    <span>0</span>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/thread.svg" size_rems={2} alt="Forum Posts" />
                    <span>{total_threads}</span>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/forum.svg" size_rems={2} alt="Forum Comments" />
                    <span>{total_posts}</span>
                </div>
            </section>
        </div>
    );
}

export default ForumInfo;