"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./details.module.scss";
import LoadingAlert from "@/components/loading/loading-alert";
import { CommunityDetails } from "@/api/community-details/models";
import {
	getCommunityDetails,
	updateCommunityDetails,
} from "@/api/community-details/api";
import ImageUpload from "@/components/image-upload/image-upload";
import { COMMUNITY_FEATURE, FORUM_FEATURE, STORE_FEATURE } from "@/api/resources";
import { getAnyToken } from "@/utils/token";

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
			await getAnyToken(),
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
			<div className={`${style.container} flex col gap-1`}>
				<LoadingAlert />
			</div>
		);
	}

	return (
		<div className={`${style.container} flex col gap-1`}>
			<h2>Community Details</h2>
			<section className={`flex col gap-half`}>
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
			<section className={`flex col gap-half`}>
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
			<section className={`flex col gap-half`}>
				<label>Icon</label>
				<ImageUpload
					default_image_url={`${community_details.icon}`}
					on_upload={iconUpdate}
				/>
			</section>
			<section className={`flex col gap-half`}>
				<label>Banner</label>
				<ImageUpload
					default_image_url={`${community_details.banner}`}
					on_upload={bannerUpdate}
				/>
			</section>
			<h3>Features</h3>
			<section className={`flex col`}>
				<section className={`flex row`}>
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
				<section className={`flex row`}>
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
				<section className={`flex row`}>
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
