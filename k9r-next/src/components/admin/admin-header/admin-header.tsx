import { Usergroup } from "@/api/usergroups/models";
import { User } from "@/api/users/models";
import style from "./header.module.scss";
import Link from "next/link";
import { MANAGE_DETAILS, MANAGE_FORUMS, MANAGE_USERGROUPS, usergroupsPermissionFlagCheck } from "@/api/permissions";

type AdminHeaderProps = {
    personal_user: User;
    usergroups: Usergroup[];
    set_view: Function;
};

const AdminHeader = (props: AdminHeaderProps) => {
    return (
        <>
            <nav className={style.admin_header}>
                {(usergroupsPermissionFlagCheck(props.usergroups, MANAGE_FORUMS)) && (
                    <button className={style.link} onClick={() => props.set_view(0)}>Manage Forum</button>
                )}
                {(usergroupsPermissionFlagCheck(props.usergroups, MANAGE_DETAILS)) && (
                    <button className={style.link} onClick={() => props.set_view(1)}>Manage Details</button>
                )}
                {(usergroupsPermissionFlagCheck(props.usergroups, MANAGE_USERGROUPS)) && (
                    <button className={style.link} onClick={() => props.set_view(2)}>Usergroups</button>
                )}
            </nav>
        </>
    );
}

export default AdminHeader;