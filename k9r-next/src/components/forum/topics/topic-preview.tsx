"use client";

import { ForumTopic } from "@/api/forum/models";
import style from "./topics.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";

type TopicPreviewProps = {
    forum_topic: ForumTopic
};

const TopicPreview = (props: TopicPreviewProps) => {
    return (
        <div className={style.topic_preview}>
            <div className={style.info}> 
                <h4 style={{"color": `${props.forum_topic.color}`}}>{props.forum_topic.name}</h4>
                <span>{props.forum_topic.description}</span>
            </div>
            <div className={style.info} style={{"gap": "0.5rem"}}>
                <MaterialIcon size_rems={2} alt="Thread Count" src="/icons/thread.svg" />
                <span>0</span>
            </div>
        </div>
    );
}

export default TopicPreview;