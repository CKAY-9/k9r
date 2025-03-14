import { User } from "@/api/users/models";
import style from "./info.module.scss";
import UserIcon from "../user-icon/user-icon";

type UserInfoProps = {
    user: User;
};

const UserInfo = (props: UserInfoProps) => {
    return (
        <div className={style.user_info}>
            <section className={style.display}>
                <UserIcon size_rems={10} user={props.user} />
                <h2 className={style.display_name}>{props.user.display_name}</h2>
                <span className={style.username}>({props.user.username})</span>
                <p className={style.description}>{props.user.description}</p>
            </section>
            <section className={style.display}>
                
            </section>
        </div>
    );
}

export default UserInfo;