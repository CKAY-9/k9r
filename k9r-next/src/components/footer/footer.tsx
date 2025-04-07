import { CommunityDetails } from "@/api/community-details/models";
import style from "./footer.module.scss";
import Link from "next/link";
import CommunityIcon from "../community-icon/community-icon";
import MaterialIcon from "../material-icon/material-icon";

type FooterProps = {
	community_details: CommunityDetails;
};

const Footer = (props: FooterProps) => {
	return (
		<footer className={`${style.footer} flex col gap-2`}>
			<section>
				<section className={`${style.community} flex row align gap-1`}>
					<CommunityIcon
						size_rems={3}
						community_details={props.community_details}
					/>
					<h3>{props.community_details.name}</h3>
				</section>
				<p>{props.community_details.description}</p>
			</section>
			<nav className={`${style.footer_nav} flex row gap-2`}>
				<section className="flex col">
					<strong>General</strong>
					<Link href={"/"}>Home</Link>
					<Link href={"/#about"}>About</Link>
					<Link href={"/support"}>Support</Link>
				</section>
				{props.community_details.features[0] && (
					<section className="flex col">
						<strong>Forum</strong>
						<Link href={"/forum"}>Home</Link>
						<Link href={"/forum/thread/search"}>
							Search Threads
						</Link>
					</section>
				)}
				{props.community_details.features[1] && (
					<section className="flex col">
						<strong>Store</strong>
					</section>
				)}
				{props.community_details.features[2] && (
					<section className="flex col">
						<strong>Community</strong>
						<Link href={"/community"}>Home</Link>
					</section>
				)}
				<section className="flex col">
					<strong>Users</strong>
					<Link href={"/user/login"}>Login/Register</Link>
					<Link href={"/user/search"}>Search Users</Link>
				</section>
			</nav>
			<section>
				<Link href="https://github.com/CKAY-9/k9r">
					<MaterialIcon
						src="/marks/github-mark-white.svg"
						size_rems={2}
						alt="K9R GitHub"
					/>
				</Link>
			</section>
		</footer>
	);
};

export default Footer;
