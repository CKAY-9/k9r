"use client";

import { CommunityDetails } from "@/api/community-details/models";
import Image from "next/image";
import style from "./icon.module.scss";

type CommunityIconProps = {
	size_rems?: number;
	community_details: CommunityDetails;
};

const CommunityIcon = (props: CommunityIconProps) => {
	return (
		<>
			<Image
				src={
					props.community_details.icon
						? props.community_details.icon
						: "/icon.png"
				}
				alt="Community Icon"
				width={0}
				height={0}
				sizes="100%"
				className={style.icon}
				style={{
					width: props.size_rems ? `${props.size_rems}rem` : "2rem",
					height: props.size_rems ? `${props.size_rems}rem` : "2rem",
				}}
			/>
		</>
	);
};

export default CommunityIcon;
