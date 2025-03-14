import { CommunityDetails } from "@/api/community-details/models";
import CommunityIcon from "@/components/community-icon/community-icon";
import style from "./header.module.scss";
import DropdownTab from "@/components/dropdown-tab/dropdown-tab";
import Link from "next/link";

type ForumHeaderProps = {
    community_details: CommunityDetails;
};

const ForumHeader = (props: ForumHeaderProps) => {
    return (
        <header className={style.forum_header}>
            <div 
                className={style.forum_information}
                style={{"background": `url(${props.community_details.banner ? props.community_details.banner : "/wikimedia_commons_backgorund.gif"})`}}
            >
                <section className={style.content}>
                    <CommunityIcon size_rems={10} community_details={props.community_details} />
                    <h2>{props.community_details.name}&apos;s Forum</h2>
                </section>
            </div>
            <nav className={style.forum_nav}>
                <DropdownTab title="General">
                    <Link href="/forum">Home</Link>
                    <Link href="/">Site Homepage</Link>
                    <Link href="/#about">About</Link>
                </DropdownTab>
                <DropdownTab title="Threads">
                    <Link href="/forum/thread/search">Search Threads</Link>
                    <Link href="/forum/thread/new">New Thread</Link>
                </DropdownTab>
                <DropdownTab title="Users">
                    <Link href="/user/search">Search Users</Link>
                </DropdownTab>
            </nav>
        </header>
    );
}

export default ForumHeader;