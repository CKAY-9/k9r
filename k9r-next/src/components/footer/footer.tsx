import { CommunityDetails } from "@/api/community-details/models";
import style from "./footer.module.scss";
import Link from "next/link";
import CommunityIcon from "../community-icon/community-icon";

type FooterProps = {
    community_details: CommunityDetails;
};

const Footer = (props: FooterProps) => {
    return (
        <footer className={style.footer}>
            <section>
                <section className={style.community}>
                    <CommunityIcon size_rems={3} community_details={props.community_details} />
                    <h3>{props.community_details.name}</h3>
                </section>
                <p>{props.community_details.description}</p>
            </section>
            <nav className={style.footer_nav}>
                <section>
                    <strong>General</strong>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/#about"}>About</Link>
                </section>
                <section>
                    <strong>Forum</strong>
                    <Link href={"/forum"}>Home</Link>
                    <Link href={"/forum/thread/search"}>Search Threads</Link>
                </section>
                <section>
                    <strong>Store</strong>
                </section>
                <section>
                    <strong>Community</strong>
                </section>
                <section>
                    <strong>Users</strong>
                    <Link href={"/user/login"}>Login/Register</Link>
                    <Link href={"/user/search"}>Search Users</Link>
                </section>
            </nav>
            <section>
                <Link href="https://github.com/CKAY-9/k9r">{"K9-Revive on GitHub"}</Link>
            </section>
        </footer>
    );
}

export default Footer;