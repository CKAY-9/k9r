"use client";

import { User } from "@/api/users/models";
import style from "./container.module.scss";
import NavigateBack from "@/components/nav-back/nav-back";
import { useRouter } from "next/navigation";

type UserContainerProps = {
	user: User;
	children: any;
};

const UserContainer = (props: UserContainerProps) => {
	const router = useRouter();

	return (
		<>
			<NavigateBack>
				<button
					style={{
						backgroundColor: "var(--background)",
						width: "fit-content",
					}}
					onClick={() => router.back()}
				>
					Go Back
				</button>
			</NavigateBack>
			<div
				className={`${style.user_container} flex row`}
				style={{
					backgroundColor:
						props.user.banner.length >= 1
							? "rgb(0, 0, 0, 0.75)"
							: "var(--foreground)",
					marginTop: "1rem",
				}}
			>
				{props.children}
			</div>
		</>
	);
};

export default UserContainer;
