"use client";

import { getAllForumSections, getAllForumTopics, updateAllSections, updateAllTopics } from "@/api/forum/api";
import { ForumSection, ForumTopic } from "@/api/forum/models";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./details.module.scss";
import { getCookie } from "@/utils/cookies";
import LoadingAlert from "@/components/loading/loading-alert"
import { CommunityDetails } from "@/api/community-details/models";
import { getCommunityDetails, updateCommunityDetails } from "@/api/community-details/api";

const CommunityDetailsAdmin = () => {
	const [community_details, setCommunityDetails] = useState<CommunityDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const details = await getCommunityDetails();
			setCommunityDetails(details);

			setLoading(false);
		})();
	}, []);

	const updateDetails = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		if (community_details === null) {
			return;
		}

		console.log(community_details);
		const response = await updateCommunityDetails(getCookie("token") || "", community_details);
		if (response !== null) {
			setCommunityDetails(response);
		}
	}

	if (loading || community_details === null) {
		return (
			<div className={style.container}>
				<LoadingAlert />
			</div>
		)
	}

	return (
		<div className={style.container}>
			<h2>Community Details</h2>
			<section className={style.edit}>
				<label>Name</label>
				<input type="text" onChange={(e: BaseSyntheticEvent) => {
					community_details.name = e.target.value;
					setCommunityDetails(community_details);
				}} placeholder="Community Name" defaultValue={community_details.name} />
			</section>
			<section className={style.edit}>
				<label>Description</label>
				<textarea rows={5} onChange={(e: BaseSyntheticEvent) => {
					community_details.description = e.target.value;
					setCommunityDetails(community_details);
				}} placeholder="Community Name" defaultValue={community_details.description} />
			</section>
			<section className={style.edit}>
				<label>Icon</label>
				<input type="file" />
			</section>
			<section className={style.edit}>
				<label>Banner</label>
				<input type="file" />
			</section>
			<button onClick={updateDetails}>Update</button>
		</div>
	);
};

export default CommunityDetailsAdmin;
