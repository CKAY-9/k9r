"use client";

import Image from "next/image";
import style from "./icon.module.scss";
import { User } from "@/api/users/models";

type UserIconProps = {
    size_rems?: number;
    user: User;
};

const UserIcon = (props: UserIconProps) => {
    return (
        <>
            <Image
                src={props.user.avatar === "" ? null : props.user.avatar}
                alt="User Icon"
                width={0}
                height={0}
                sizes="100%"
                className={style.icon}
                style={{
                    "width": props.size_rems ? `${props.size_rems}rem` : "2rem",
                    "height": props.size_rems ? `${props.size_rems}rem` : "2rem"
                }}
            />
        </>
    );
}

export default UserIcon;