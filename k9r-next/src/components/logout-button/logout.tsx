"use client";

import { BaseSyntheticEvent } from "react";
import MaterialIcon from "../material-icon/material-icon";
import { eraseCookie } from "@/utils/cookies";
import style from "./logout.module.scss";

type LogoutButtonProps = {
	button_type: "icon" | "text";
};

const LogoutButton = (props: LogoutButtonProps) => {
	const logout = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
        eraseCookie("token");

        window.location.href = "/user/login";
	};

	if (props.button_type === "icon") {
		return (
			<>
				<button onClick={logout} className={style.logout_button}>
					<MaterialIcon
						src="/icons/logout.svg"
						size_rems={2}
						alt="Logout"
					/>
				</button>
			</>
		);
	}

	return (
		<>
			<button onClick={logout}>Logout</button>
		</>
	);
};

export default LogoutButton;
