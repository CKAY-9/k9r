"use client";

import {
	getAllForumSections,
	getAllForumTopics,
	updateAllSections,
	updateAllTopics,
} from "@/api/forum/api";
import { ForumSection, ForumTopic } from "@/api/forum/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./forum.module.scss";
import LoadingAlert from "@/components/loading/loading-alert";
import ImageUpload from "@/components/image-upload/image-upload";
import { getAnyToken } from "@/utils/token";

type SectionsProps = {
	forum_sections: ForumSection[];
	set_sections: any;
};

type TopicsProps = {
	forum_topics: ForumTopic[];
	forum_sections: ForumSection[];
	set_topics: any;
};

const Sections = (props: SectionsProps) => {
	const [sections, setSections] = useState<ForumSection[]>(
		props.forum_sections
	);

	const generateNewSection = (e: BaseSyntheticEvent) => {
		e.preventDefault();

		setSections((prev) => [
			...prev,
			{
				id: -(sections.length + 1),
				name: `Section ${sections.length + 1}`,
				description: `Section ${sections.length + 1} Description`,
				color: `#ffffff`,
				icon: ``,
				topics: [],
				sort_order: -1,
			},
		]);
	};

	const updateSections = async (e?: BaseSyntheticEvent) => {
		if (e) {
			e.preventDefault();
		}

		const update = await updateAllSections(
			sections,
			await getAnyToken()
		);
		props.set_sections(update);
		setSections(update);
	};

	const removeSection = (index: number) => {
		setSections(sections.filter((v, i) => i !== index));
	};

	return (
		<div className={`flex col gap-1 ${style.content}`}>
			<h2>Sections</h2>
			<button onClick={generateNewSection}>New Section</button>
			<div className={`${style.sections} flex row gap-1`}>
				{sections.map((section: ForumSection, index: number) => {
					return (
						<div key={index + Math.random()} className={`${style.edit} flex col gap-1`}>
							<section className={`flex col gap-half`}>
								<label>Name</label>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										sections[index].name = e.target.value;
										setSections(sections);
									}}
									type="text"
									defaultValue={section.name}
									placeholder="Section Name"
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Description</label>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										sections[index].description =
											e.target.value;
										setSections(sections);
									}}
									type="text"
									defaultValue={section.description}
									placeholder="Section Description"
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Color</label>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										sections[index].color = e.target.value;
										setSections(sections);
									}}
									type="color"
									value={section.color}
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Icon</label>
								<ImageUpload
									on_remove={() => {
										sections[index].icon = "";
										updateSections();
									}}
									on_upload={(new_url: string) => {
										sections[index].icon = new_url;
										updateSections();
									}}
									default_image_url={sections[index].icon}
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Sort Order</label>
								<input
									type="number"
									min={-1}
									max={9999}
									defaultValue={sections[index].sort_order}
									onChange={(e: BaseSyntheticEvent) => {
										sections[index].sort_order =
											Number.parseInt(e.target.value);
										setSections(sections);
									}}
									placeholder="Sort Order"
								/>
							</section>
							<button
								onClick={() => {
									removeSection(index);
								}}
							>
								Remove
							</button>
						</div>
					);
				})}
			</div>
			{sections.length > 0 && (
				<>
					<span>Some changes won&apos;t be reflected until updated.</span>
					<button onClick={updateSections}>Update</button>
				</>
			)}
		</div>
	);
};

const Topics = (props: TopicsProps) => {
	const [topics, setTopics] = useState<ForumTopic[]>(props.forum_topics);

	const generateNewTopic = (e: BaseSyntheticEvent) => {
		e.preventDefault();

		setTopics((prev) => [
			...prev,
			{
				id: -(topics.length + 1),
				name: `Topic ${topics.length + 1}`,
				description: `Topic ${topics.length + 1} Description`,
				icon: ``,
				color: `#ffffff`,
				section: 1,
				threads: [],
			},
		]);
	};

	const updateTopics = async (e?: BaseSyntheticEvent) => {
		if (e) {
			e.preventDefault();
		}

		const update = await updateAllTopics(topics, await getAnyToken());
		props.set_topics(update);
		setTopics(update);
	};

	const removeTopic = (index: number) => {
		setTopics(topics.filter((v, i) => i !== index));
	};

	if (props.forum_sections.length <= 0) {
		return (
			<div className={`flex col gap-1`}>
				<h2>Topics</h2>
				<span>A section must exist before you can create a topic!</span>
			</div>
		);
	}

	return (
		<div className={`flex col gap-1 ${style.content}`}>
			<h2>Topics</h2>
			<button onClick={generateNewTopic}>New Topic</button>
			<div className={`${style.topics} flex row gap-1`}>
				{topics.map((topic: ForumTopic, index: number) => {
					return (
						<div key={index + Math.random()} className={`${style.edit} flex col gap-1`}>
							<section className={`flex col gap-half`}>
								<label>Name</label>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										topics[index].name = e.target.value;
										setTopics(topics);
									}}
									type="text"
									defaultValue={topic.name}
									placeholder="Section Name"
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Description</label>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										topics[index].description =
											e.target.value;
										setTopics(topics);
									}}
									type="text"
									defaultValue={topic.description}
									placeholder="Section Description"
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Color</label>
								<input
									onChange={(e: BaseSyntheticEvent) => {
										topics[index].color = e.target.value;
										setTopics(topics);
									}}
									type="color"
									value={topic.color}
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Icon</label>
								<ImageUpload
									on_remove={() => {
										topics[index].icon = "";
										updateTopics();
									}}
									on_upload={(new_url: string) => {
										topics[index].icon = new_url;
										updateTopics();
									}}
									default_image_url={topics[index].icon}
								/>
							</section>
							<section className={`flex col gap-half`}>
								<label>Section</label>
								<select
									defaultValue={topic.section}
									onChange={(e: BaseSyntheticEvent) => {
										topics[index].section = Number.parseInt(
											e.target.value
										);
										setTopics(topics);
									}}
								>
									<option value=""></option>
									{props.forum_sections.map(
										(section, index) => {
											return (
												<option
													value={section.id}
													key={index + Math.random()}
												>
													{section.name}
												</option>
											);
										}
									)}
								</select>
							</section>
							<button
								onClick={() => {
									removeTopic(index);
								}}
							>
								Remove
							</button>
						</div>
					);
				})}
			</div>
			{topics.length > 0 && (
				<>
					<span>Some changes won&apos;t be reflected until updated.</span>
					<button onClick={updateTopics}>Update</button>
				</>
			)}
		</div>
	);
};

const ForumManagementAdmin = () => {
	const [sections, setSections] = useState<ForumSection[]>([]);
	const [topics, setTopics] = useState<ForumTopic[]>([]);
	const [view, setView] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const s = await getAllForumSections();
			setSections(s);

			const t = await getAllForumTopics();
			setTopics(t);

			setLoading(false);
		})();
	}, []);

	const changeView = (index: number) => {
		setView(index);
	};

	if (loading) {
		return (
			<div className={style.container}>
				<LoadingAlert />
			</div>
		);
	}

	return (
		<div className={`${style.container} flex row gap-1`}>
			<nav className="flex col">
				<button className="no-border" style={{"borderRadius": "0"}} onClick={() => changeView(0)}>Sections</button>
				<button className="no-border" style={{"borderRadius": "0"}} onClick={() => changeView(1)}>Topics</button>
				<button className="no-border" style={{"borderRadius": "0"}} onClick={() => changeView(2)}>Threads/Posts</button>
			</nav>
			<section>
				<div style={{ display: view === 0 ? "block" : "none" }}>
					<Sections
						set_sections={setSections}
						forum_sections={sections}
					/>
				</div>
				<div style={{ display: view === 1 ? "block" : "none" }}>
					<Topics
						set_topics={setTopics}
						forum_sections={sections}
						forum_topics={topics}
					/>
				</div>
			</section>
		</div>
	);
};

export default ForumManagementAdmin;
