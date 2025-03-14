"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./index.module.scss";
import Link from "next/link";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import CommunityIcon from "@/components/community-icon/community-icon";
import { User } from "@/api/users/models";

type IndexClientProps = {
    community_details: CommunityDetails;
    personal_user: User | null;
};

const IndexClient = (props: IndexClientProps) => {
    return (
        <>
            <Header personal_user={props.personal_user} community_details={props.community_details} />
            <div className={style.splash} style={{"background": `url(${props.community_details.banner ? props.community_details.banner : "/wikimedia_commons_backgorund.gif"})`}}>
                <div className={style.content}>
                    <CommunityIcon size_rems={15} community_details={props.community_details} />
                    <span>{props.community_details.description.slice(0, 100)}{props.community_details.description.length >= 100 && `...`}</span>
                    <nav className={style.nav}>
                        <Link href="/forum">Forum</Link>
                        <Link href="/store">Store</Link>
                        <Link href="/community">Community</Link>
                    </nav>
                    {props.personal_user === null && (
                        <Link className={style.get_started} href="/user/login">Get Started</Link>
                    )}
                </div>
            </div>
            <main className="container">
                <section id="about">
                    <h2>{`About ${props.community_details.name}`}</h2>
                    <p>{`${props.community_details.description}`}</p>
                </section>
            </main>
            <Footer community_details={props.community_details} />
        </>
    );
}

export default IndexClient;