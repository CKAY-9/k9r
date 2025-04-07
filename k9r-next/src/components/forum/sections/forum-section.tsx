"use client";

import { ForumSection, ForumTopic } from "@/api/forum/models";
import style from "./sections.module.scss";
import { useEffect, useState } from "react";
import { getForumSectionTopicsFromID } from "@/api/forum/api";
import LoadingAlert from "@/components/loading/loading-alert";
import TopicPreview from "../topics/topic-preview";
import Link from "next/link";
import MaterialIcon from "@/components/material-icon/material-icon";

type ForumSectionProps = {
	forum_section: ForumSection;
};

const Section = (props: ForumSectionProps) => {
	const [topics, setTopics] = useState<ForumTopic[]>([]);
	const [loading_topics, setLoadingTopics] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const t = await getForumSectionTopicsFromID(props.forum_section.id);
			setTopics(t);
			setLoadingTopics(false);
		})();
	}, [props.forum_section]);

	return (
		<div className={`${style.forum_section} flex col gap-1`}>
			<section
				className={`${style.header} flex col gap-1`}
				style={{ borderBottomColor: `${props.forum_section.color}` }}
			>
				<section className={`flex row gap-1 align`}>
					{props.forum_section.icon.length >= 1 && (
						<MaterialIcon src={props.forum_section.icon} alt="Section Icon" size_rems={2} />
					)}
					<h3 style={{ color: `${props.forum_section.color}` }}>
						{props.forum_section.name}
					</h3>
				</section>
				<span>{props.forum_section.description}</span>
			</section>

			{loading_topics ? (
				<LoadingAlert message="Loading topics..." />
			) : (
				<>
					{topics.length <= 0 ? (
						<span>No topics in this section.</span>
					) : (
						<>
							{topics.map((topic, index) => {
								return (
									<Link
										className={style.topic_link}
										href={`/forum/topic/${topic.id}`}
										key={index + Math.random()}
									>
										<TopicPreview forum_topic={topic} />
									</Link>
								);
							})}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Section;
