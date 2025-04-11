"use client";

import { CommunityDetails } from "@/api/community-details/models";
import { ForumPost, ForumSection, ForumThread, ForumTopic } from "@/api/forum/models";
import style from "./new.module.scss";
import { User } from "@/api/users/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
	createNewForumThread,
	getAllForumSections,
	getAllForumTopics,
	getForumPostFromID,
	getForumSectionFromID,
	getForumThreadFromID,
} from "@/api/forum/api";
import LoadingAlert from "@/components/loading/loading-alert";
import MDEditor from "@uiw/react-md-editor";
import { getAnyToken } from "@/utils/token";
import { MANAGE_POSTS, usergroupsPermissionFlagCheck } from "@/api/permissions";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NewForumThreadClientProps = {
	forum_topic: ForumTopic | null;
	community_details: CommunityDetails;
	personal_user: User;
};

const NewForumThreadClient = (props: NewForumThreadClientProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const template_id_str = searchParams.get("template");
	const template_id = Number.parseInt(template_id_str || "0");

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
	const [allow_template, setAllowTemplate] = useState<boolean>(false);
	const [sticky, setSticky] = useState<boolean>(false);
	const [locked, setLocked] = useState<boolean>(false);
	const [usergroups, setUsergroups] = useState<Usergroup[]>([]);
	const [template_thread, setTemplateThread] = useState<ForumThread | null>(null);
	const [template_post, setTemplatePost] = useState<ForumPost | null>(null);

	useEffect(() => {
		(async () => {
			if (template_id >= 1) {
				const t_thread = await getForumThreadFromID(template_id);
				if (t_thread !== null) {
					const t_post = await getForumPostFromID(t_thread.primary_post);
					if (t_post !== null) {
						setContent(t_post.content);
						setTitle(t_thread.title);
						setTemplateThread(t_thread);	
						setTemplatePost(t_post);
					}
				}
			}

			const groups = await getUserUserGroupsFromID(
				props.personal_user.id
			);
			setUsergroups(groups);

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
		const section = all_sections.filter((v) => v.id === section_id)[0];

		setParentSection(section);
	};

	const chooseTopic = (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const topic_id = Number.parseInt(e.target.value);
		const topic = all_topics.filter((v) => v.id === topic_id)[0];

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
				locked: locked,
				sticky: sticky,
				template: allow_template,
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
				template: allow_template,
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
		<div className={`${style.new_thread} flex col gap-1`}>
			<h1>New Thread {template_thread && `From Template: ${template_thread.title}`}</h1>
			<section className={`flex col gap-1`}>
				<label>Section</label>
				<select
					defaultValue={
						parent_section !== null ? parent_section.id : 0
					}
					onChange={chooseSection}
				>
					<option value=""></option>
					{all_sections.map((section) => {
						return (
							<option key={section.id} value={section.id}>
								{section.name}
							</option>
						);
					})}
				</select>
			</section>
			{parent_section !== null && (
				<section className={`flex col gap-1`}>
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
								(topic) => topic.section === parent_section.id
							)
							.map((topic) => {
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
					<section className={`flex col gap-1`}>
						<label>Thread Title</label>
						<input
							onChange={(e: BaseSyntheticEvent) =>
								setTitle(e.target.value)
							}
							type="text"
							defaultValue={title}
							placeholder="Thread Title"
						/>
					</section>
					<section className={`flex col gap-1`}>
						<label>Thread Content</label>
						<MDEditor
							height="25rem"
							style={{
								fontSize: "1rem !important",
							}}
							onChange={(value: string | undefined) =>
								setContent(value || "")
							}
							value={content}
						></MDEditor>
					</section>
					{usergroupsPermissionFlagCheck(
						usergroups,
						MANAGE_POSTS
					) && (
						<div className="flex row align gap-1">
							<section className="flex row align gap-half">
								<label>Template</label>
								<input
									type="checkbox"
									onChange={(e: BaseSyntheticEvent) => setAllowTemplate(e.target.checked)}
									defaultChecked={allow_template}
								/>
							</section>
							<section className="flex row align gap-half">
								<label>Locked</label>
								<input
									type="checkbox"
									onChange={(e: BaseSyntheticEvent) => setLocked(e.target.checked)}
									defaultChecked={locked}
								/>
							</section>
							<section className="flex row align gap-half">
								<label>Sticky</label>
								<input
									type="checkbox"
									onChange={(e: BaseSyntheticEvent) => setSticky(e.target.checked)}
									defaultChecked={sticky}
								/>
							</section>
						</div>
					)}
					<button
						style={{ width: "fit-content" }}
						onClick={createThread}
					>
						Create Thread
					</button>
				</>
			)}
		</div>
	);
};

export default NewForumThreadClient;
