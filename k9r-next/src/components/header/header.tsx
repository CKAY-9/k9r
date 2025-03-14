"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./header.module.scss";
import Link from "next/link";
import CommunityIcon from "../community-icon/community-icon";
import { User } from "@/api/users/models";
import UserIcon from "../user/user-icon/user-icon";
import { useEffect, useState } from "react";
import { Usergroup } from "@/api/usergroups/models";
import { getUserUserGroupsFromID } from "@/api/users/api";
import { SITE_SETTINGS, usergroupsPermissionFlagCheck } from "@/api/permissions";
import MaterialIcon from "../material-icon/material-icon";

type HeaderProps = {
    community_details: CommunityDetails;
    personal_user: User | null;
};

const Header = (props: HeaderProps) => {
    const [usergroups, setUsergroups] = useState<Usergroup[]>([]);

    useEffect(() => {
        (async () => {
            if (props.personal_user === null) {
                return;
            }

            const groups = await getUserUserGroupsFromID(props.personal_user.id);
            setUsergroups(groups);
        })();
    }, [props.personal_user]);

    return (
        <header className={style.header}>
            <nav>
                <Link href={"/"}>
                    <CommunityIcon community_details={props.community_details} size_rems={3} />
                </Link>
                <Link href={"/forum"}>
                    <span>{"Forum"}</span>
                </Link>
                <Link href={"/store"}>
                    <span>{"Store"}</span>
                </Link>
                <Link href={"/community"}>
                    <span>{"Community"}</span>
                </Link>
            </nav>
            <nav>
                {props.personal_user !== null ? (
                    <>
                        {(usergroups.length >= 1 && usergroupsPermissionFlagCheck(usergroups, SITE_SETTINGS)) && (
                            <Link href={`/admin`}>
                                <MaterialIcon
                                    src="/icons/admin_settings.svg"
                                    alt="Admin Settings"
                                    size_rems={2}
                                />
                            </Link>
                        )}
                        <Link href={`/user/settings`}>
                            <MaterialIcon
                                src="/icons/settings.svg"
                                alt="User Settings"
                                size_rems={2}
                            />
                        </Link>
                        <Link href={`/user/${props.personal_user.id}`} className={style.user}>
                            <UserIcon size_rems={2} user={props.personal_user} />
                            <span>{props.personal_user.username}</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/user/login">
                            <span>{"Login/Register"}</span>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;