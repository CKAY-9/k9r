"use client";

import { getAllForumSections, getAllForumTopics, updateAllSections, updateAllTopics } from "@/api/forum/api";
import { ForumSection, ForumTopic } from "@/api/forum/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./forum.module.scss";
import { getCookie } from "@/utils/cookies";
import LoadingAlert from "@/components/loading/loading-alert";

type SectionsProps = {
	forum_sections: ForumSection[];
	set_sections: Function;
};

type TopicsProps = {
	forum_topics: ForumTopic[];
	forum_sections: ForumSection[];
	set_topics: Function;
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

	const updateSections = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		const update = await updateAllSections(sections, getCookie("token") || "");
		props.set_sections(update);
		setSections(update);
	};

	const removeSection = (index: number) => {
		setSections(sections.filter((v, i) => i !== index));
	};

	return (
		<div className={style.content}>
			<h2>Sections</h2>
			<button onClick={generateNewSection}>New Section</button>
			<div className={style.sections}>
				{sections.map((section: ForumSection, index: number) => {
					return (
						<div key={index + Math.random()} className={style.edit}>
							<section className={style.field}>
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
							<section className={style.field}>
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
							<section className={style.field}>
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
							<section className={style.field}>
								<label>Icon</label>
								<span>TODO: Add file uploading</span>
							</section>
							<section className={style.field}>
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
				{sections.length <= 0 && <span>No sections setup!</span>}
			</div>
			<button onClick={updateSections}>Update</button>
		</div>
	);
};

const Topics = (props: TopicsProps) => {
	const [topics, setTopics] = useState<ForumTopic[]>(
		props.forum_topics
	);

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

	const updateTopics = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		
		const update = await updateAllTopics(topics, getCookie("token") || "");
		props.set_topics(update);
		setTopics(update);
	};

	const removeTopic = (index: number) => {
		setTopics(topics.filter((v, i) => i !== index));
	};

    if (props.forum_sections.length <= 0) {
        return (
            <div className={style.content}>
                <h2>Topics</h2>
                <span>A section must exist before you can create a topic!</span>
            </div>
        )
    }

	return (
		<div className={style.content}>
			<h2>Topics</h2>
			<button onClick={generateNewTopic}>New Topic</button>
			<div className={style.sections}>
				{topics.map((topic: ForumTopic, index: number) => {
					return (
						<div key={index + Math.random()} className={style.edit}>
							<section className={style.field}>
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
							<section className={style.field}>
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
							<section className={style.field}>
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
							<section className={style.field}>
								<label>Icon</label>
								<span>TODO: Add file uploading</span>
							</section>
                            <section className={style.field}>
                                <label>Section</label>
                                <select defaultValue={topic.section} onChange={(e: BaseSyntheticEvent) => {
                                    topics[index].section = Number.parseInt(e.target.value);
                                    setTopics(topics);
                                }}>
									<option value=""></option>
                                    {props.forum_sections.map((section, index) => {
                                        return (
                                            <option value={section.id} key={index + Math.random()}>{section.name}</option>
                                        )
                                    })}
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
				{topics.length <= 0 && <span>No topics setup!</span>}
			</div>
			<button onClick={updateTopics}>Update</button>
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
		)
	}

	return (
		<div className={style.container}>
			<nav>
				<button onClick={() => changeView(0)}>Sections</button>
				<button onClick={() => changeView(1)}>Topics</button>
				<button onClick={() => changeView(2)}>Threads/Posts</button>
			</nav>
			<section className={style.content}>
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
