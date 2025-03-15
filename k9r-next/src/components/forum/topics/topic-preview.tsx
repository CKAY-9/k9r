"use client";

import { ForumThread, ForumTopic } from "@/api/forum/models";
import style from "./topics.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";
import { useEffect, useState } from "react";
import { getForumThreadsInForumTopicFromID } from "@/api/forum/api";
import { User } from "@/api/users/models";

type TopicPreviewProps = {
    forum_topic: ForumTopic
};

const TopicPreview = (props: TopicPreviewProps) => {
    const [threads, setThreads] = useState<ForumThread[]>([]);

    useEffect(() => {
        (async () => {
            const ts = await getForumThreadsInForumTopicFromID(props.forum_topic.id);
            setThreads(ts);
        })();
    }, [props.forum_topic.id]);

    return (
        <div className={style.topic_preview}>
            <div className={style.info}> 
                <h4 style={{"color": `${props.forum_topic.color}`}}>{props.forum_topic.name}</h4>
                <span>{props.forum_topic.description}</span>
            </div>
            <div className={style.info} style={{"gap": "0.5rem"}}>
                <MaterialIcon size_rems={2} alt="Thread Count" src="/icons/thread.svg" />
                <span>{threads.length}</span>
            </div>
        </div>
    );
}

export default TopicPreview;