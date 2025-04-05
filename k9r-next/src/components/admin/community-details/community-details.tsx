"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./details.module.scss";
import { getCookie } from "@/utils/cookies";
import LoadingAlert from "@/components/loading/loading-alert";
import { CommunityDetails } from "@/api/community-details/models";
import {
	getCommunityDetails,
	updateCommunityDetails,
} from "@/api/community-details/api";
import ImageUpload from "@/components/image-upload/image-upload";
import { COMMUNITY_FEATURE, FORUM_FEATURE, STORE_FEATURE } from "@/api/resources";

const CommunityDetailsAdmin = () => {
	const [community_details, setCommunityDetails] =
		useState<CommunityDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const details = await getCommunityDetails();
			setCommunityDetails(details);

			setLoading(false);
		})();
	}, []);

	const updateDetails = async (e?: BaseSyntheticEvent) => {
		if (e) {
			e.preventDefault();
		}

		if (community_details === null) {
			return;
		}

		const response = await updateCommunityDetails(
			getCookie("token") || "",
			community_details
		);
		if (response !== null) {
			setCommunityDetails(response);
		}
	};

	const iconUpdate = (new_url: string) => {
		if (community_details === null) return;
		community_details.icon = new_url;
		updateDetails();
	};

	const bannerUpdate = (new_url: string) => {
		if (community_details === null) return;
		community_details.banner = new_url;
		updateDetails();
	};

	if (loading || community_details === null) {
		return (
			<div className={style.container}>
				<LoadingAlert />
			</div>
		);
	}

	return (
		<div className={style.container}>
			<h2>Community Details</h2>
			<section className={style.edit}>
				<label>Name</label>
				<input
					type="text"
					onChange={(e: BaseSyntheticEvent) => {
						community_details.name = e.target.value;
						setCommunityDetails(community_details);
					}}
					placeholder="Community Name"
					defaultValue={community_details.name}
				/>
			</section>
			<section className={style.edit}>
				<label>Description</label>
				<textarea
					rows={5}
					onChange={(e: BaseSyntheticEvent) => {
						community_details.description = e.target.value;
						setCommunityDetails(community_details);
					}}
					placeholder="Community Name"
					defaultValue={community_details.description}
				/>
			</section>
			<section className={style.edit}>
				<label>Icon</label>
				<ImageUpload
					default_image_url={`${community_details.icon}`}
					on_upload={iconUpdate}
				/>
			</section>
			<section className={style.edit}>
				<label>Banner</label>
				<ImageUpload
					default_image_url={`${community_details.banner}`}
					on_upload={bannerUpdate}
				/>
			</section>
			<h3>Features</h3>
			<section className={style.features}>
				<section className={style.feature_input}>
					<label>Enable Forum</label>
					<input
						type="checkbox"
						defaultChecked={
							community_details.features[FORUM_FEATURE]
						}
						onChange={(e: BaseSyntheticEvent) =>
							(community_details.features[FORUM_FEATURE] =
								e.target.checked)
						}
					/>
				</section>
				<section className={style.feature_input}>
					<label>Enable Store</label>
					<input
						type="checkbox"
						defaultChecked={community_details.features[STORE_FEATURE]}
						onChange={(e: BaseSyntheticEvent) =>
							(community_details.features[STORE_FEATURE] =
								e.target.checked)
						}
					/>
				</section>
				<section className={style.feature_input}>
					<label>Enable Community</label>
					<input
						type="checkbox"
						defaultChecked={community_details.features[COMMUNITY_FEATURE]}
						onChange={(e: BaseSyntheticEvent) =>
							(community_details.features[COMMUNITY_FEATURE] =
								e.target.checked)
						}
					/>
				</section>
			</section>
			<button onClick={updateDetails}>Update</button>
		</div>
	);
};

export default CommunityDetailsAdmin;
