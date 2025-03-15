import { User } from "@/api/users/models";
import UserIcon from "../user-icon/user-icon";
import style from "./tab.module.scss";

type UserTabProps = {
    user: User;
};

const UserTab = (props: UserTabProps) => {
    return (
        <div className={style.user_tab}>
            <UserIcon 
                size_rems={2}
                user={props.user}
            />
            <span>{props.user.display_name}</span>
        </div>
    );
}

export default UserTab;