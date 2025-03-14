"use client";

import { User } from "@/api/users/models";
import style from "./container.module.scss";

type UserContainerProps = {
    user: User;
    children: any;
};

const UserContainer = (props: UserContainerProps) => {
    return (
        <>
            <div className={style.user_container}>
                {props.children}
            </div>
        </>
    );
}

export default UserContainer;