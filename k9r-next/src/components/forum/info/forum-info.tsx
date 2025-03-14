import { CommunityDetails } from "@/api/community-details/models";
import style from "./info.module.scss";
import CommunityIcon from "@/components/community-icon/community-icon";
import MaterialIcon from "@/components/material-icon/material-icon";

type ForumInfoProps = {
    community_details: CommunityDetails;
};

const ForumInfo = (props: ForumInfoProps) => {
    return (
        <div className={style.forum_info}>
            <section className={style.info}>
                <CommunityIcon size_rems={5} community_details={props.community_details} />
                <h3>{props.community_details.name}</h3>
            </section>
            <section className={style.info} style={{"alignItems": "flex-start"}}>
                <div className={style.stat} style={{"marginBottom": "1rem"}}>
                    <MaterialIcon src="/icons/query_stats.svg" size_rems={2} alt="Forum Statistics" />
                    <h4>Statistics</h4>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/groups.svg" size_rems={2} alt="Total Users" />
                    <span>0</span>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/internet.svg" size_rems={2} alt="Online Users" />
                    <span>0</span>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/thread.svg" size_rems={2} alt="Forum Posts" />
                    <span>0</span>
                </div>
                <div className={style.stat}>
                    <MaterialIcon src="/icons/forum.svg" size_rems={2} alt="Forum Comments" />
                    <span>0</span>
                </div>
            </section>
        </div>
    );
}

export default ForumInfo;