"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { ForumSection, ForumTopic } from "@/api/forum/models";
import style from "./new.module.scss";
import { User } from "@/api/users/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
	createNewForumThread,
	getAllForumSections,
	getAllForumTopics,
	getForumSectionFromID,
} from "@/api/forum/api";
import LoadingAlert from "@/components/loading/loading-alert";
import MDEditor from "@uiw/react-md-editor";
import { getAnyToken } from "@/utils/token";

type NewForumThreadClientProps = {
	forum_topic: ForumTopic | null;
	community_details: CommunityDetails;
	personal_user: User;
};

const NewForumThreadClient = (props: NewForumThreadClientProps) => {
	const [parent_section, setParentSection] = useState<ForumSection | null>(
		null
	);
	const [parent_topic, setParentTopic] = useState<ForumTopic | null>(
		props.forum_topic
	);
	const [all_sections, setAllSections] = useState<ForumSection[]>([]);
	const [all_topics, setAllTopics] = useState<ForumTopic[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");

	useEffect(() => {
		(async () => {
			if (props.forum_topic !== null) {
				const section = await getForumSectionFromID(
					props.forum_topic.section
				);
				setParentSection(section);
			}

			const sections = await getAllForumSections();
			const topics = await getAllForumTopics();

			setAllSections(sections);
			setAllTopics(topics);

			setLoading(false);
		})();
	}, [props.forum_topic]);

	const chooseSection = (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const section_id = Number.parseInt(e.target.value);
		const section = all_sections.filter(v => v.id === section_id)[0];

		setParentSection(section);
	};

	const chooseTopic = (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const topic_id = Number.parseInt(e.target.value);
		const topic = all_topics.filter(v => v.id === topic_id)[0];

		setParentTopic(topic);
	};

	const createThread = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (title.length <= 0 || content.length <= 0) {
			return;
		}

		const response = await createNewForumThread(
			{
				id: -1,
				title: title,
				author: props.personal_user.id,
				created: "",
				updated: "",
				likes: [],
				dislikes: [],
				primary_post: -1,
				posts: [],
				topic: parent_topic?.id || -1,
				locked: false,
				sticky: true,
			},
			{
				id: -1,
				author: props.personal_user.id,
				content: content,
				json_content: "",
				created: "",
				updated: "",
				likes: [],
				dislikes: [],
				thread: -1,
			},
			await getAnyToken()
		);

		if (response !== null) {
			window.location.href = `/forum/topic/${response.topic}/${response.id}`;
		}
	};

	if (loading) {
		return (
			<div className={style.content}>
				<LoadingAlert message="Loading..." />
			</div>
		);
	}

	return (
		<div className={style.new_thread}>
			<h1>New Thread</h1>
			<section className={style.field}>
				<label>Section</label>
				<select
					defaultValue={
						parent_section !== null ? parent_section.id : 0
					}
					onChange={chooseSection}
				>
					<option value=""></option>
					{all_sections.map(section => {
						return (
							<option key={section.id} value={section.id}>
								{section.name}
							</option>
						);
					})}
				</select>
			</section>
			{parent_section !== null && (
				<section className={style.field}>
					<label>Topic</label>
					<select
						defaultValue={
							parent_topic !== null ? parent_topic.id : 0
						}
						onChange={chooseTopic}
					>
						<option value=""></option>
						{all_topics
							.filter(
								topic =>
									topic.section === parent_section.id
							)
							.map(topic => {
								return (
									<option key={topic.id} value={topic.id}>
										{topic.name}
									</option>
								);
							})}
					</select>
				</section>
			)}
			{parent_section !== null && parent_topic !== null && (
				<>
					<section className={style.field}>
						<label>Thread Title</label>
						<input
							onChange={(e: BaseSyntheticEvent) =>
								setTitle(e.target.value)
							}
							type="text"
							placeholder="Thread Title"
						/>
					</section>
					<section className={style.field}>
						<label>Thread Content</label>
						<MDEditor
							height="25rem"
							style={{
								width: "100%",
								fontSize: "1rem !important",
							}}
							onChange={(value: string | undefined) =>
								setContent(value || "")
							}
							value={content}
						></MDEditor>
					</section>
					<button onClick={createThread}>Create Thread</button>
				</>
			)}
		</div>
	);
};

export default NewForumThreadClient;
