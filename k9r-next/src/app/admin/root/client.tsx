"use client";

import { BaseSyntheticEvent, useState } from "react";
import style from "./root.module.scss";
import { getPersonalUser } from "@/api/users/api";
import { setCookie } from "@/utils/cookies";

const AdminRootLoginClient = () => {
	const [root_token, setRootToken] = useState<string>("");

	const login = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
        console.log(root_token);

        if (root_token.length <= 0) {
            return;
        }

        const user_check = await getPersonalUser(root_token);
        if (user_check === null) {
            return;
        }

        setCookie("token", root_token, 5);
        window.location.href = "/";
	};

	return (
		<div className={style.container}>
			<div className={style.login}>
				<h3>Login with Root Token</h3>
				<input
					type="password"
					placeholder="Root Token"
					onChange={(e: BaseSyntheticEvent) =>
						setRootToken(e.target.value)
					}
				/>
				<button onClick={login}>Login</button>
			</div>
		</div>
	);
};

export default AdminRootLoginClient;
