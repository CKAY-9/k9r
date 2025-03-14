"use client";

import { ForumTopic } from "@/api/forum/models";
import { User } from "@/api/users/models";
import style from "./topics.module.scss";
import MaterialIcon from "@/components/material-icon/material-icon";

type TopicProps = {
	personal_user: User | null;
	forum_topic: ForumTopic;
};

const Topic = (props: TopicProps) => {
	return (
		<div className={style.topic_container}>
			<header className={style.header}>
				<section>
					<h3 style={{"color": `${props.forum_topic.color}`}}>{props.forum_topic.name}</h3>
				</section>
				<span>{props.forum_topic.description}</span>
				<section className={style.stats}>
                    <section className={style.stat}>
                        <MaterialIcon alt="Threads" size_rems={2} src="/icons/thread.svg" />
                        <span>0</span>
                    </section>
                    <section className={style.stat}>
                        <MaterialIcon alt="Posts" size_rems={2} src="/icons/forum.svg" />
                        <span>0</span>
                    </section>
                </section>
			</header>
		</div>
	);
};

export default Topic;
