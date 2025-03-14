"use client";

import { CommunityDetails } from "@/api/community-details/models";
import style from "./login.module.scss";
import CommunityIcon from "@/components/community-icon/community-icon";
import Header from "@/components/header/header";
import { DISCORD_OAUTH, GITHUB_OAUTH } from "@/api/resources";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { setCookie } from "@/utils/cookies";
import { User } from "@/api/users/models";

type LoginClientProps = {
    community_details: CommunityDetails;
    personal_user: User | null;
};

const LoginClient = (props: LoginClientProps) => {
    const search_params = useSearchParams();
    const token = search_params.get("token");
    if (token !== null) {
        setCookie("token", token, 999);
        window.location.href = "/"
    }

    return (
        <>
            <Header personal_user={props.personal_user} community_details={props.community_details} />
            <main className={style.login_container}>
                <div className={style.login}>
                    <CommunityIcon size_rems={10} community_details={props.community_details} />
                    <h1 style={{ "fontSize": "1.5rem" }}>Login to {props.community_details.name}</h1>

                    <section className={style.oauths}>
                        {DISCORD_OAUTH &&
                            <Link href={DISCORD_OAUTH || "/user/login"} className={style.oauth} style={{ "backgroundColor": "#5865F2" }}>
                                <Image
                                    src="/marks/discord-mark-white.svg"
                                    alt="Discord Logo"
                                    sizes="100%"
                                    width={0}
                                    height={0}
                                />
                                <span>Login with Discord</span>
                            </Link>
                        }
                        {GITHUB_OAUTH &&
                            <Link href={GITHUB_OAUTH || "/user/login"} className={style.oauth} style={{ "backgroundColor": "#181818" }}>
                                <Image
                                    src="/marks/github-mark-white.svg"
                                    alt="Discord Logo"
                                    sizes="100%"
                                    width={0}
                                    height={0}
                                />
                                <span>Login with GitHub</span>
                            </Link>
                        }
                    </section>
                </div>
            </main>
        </>
    );
}

export default LoginClient;