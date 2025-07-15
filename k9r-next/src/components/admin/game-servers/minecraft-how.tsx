import Image from "next/image";
import style from "./servers.module.scss";
import Link from "next/link";

const MinecraftHow = () => {
	return (
		<>
			<div className={`${style.how_to} flex col gap-1`}>
				<h4>Minecraft Servers</h4>
				<section className={`${style.step} flex col gap-half`}>
					<span>Create a new Minecraft server here</span>
					<Image
						src="/games/minecraft_how1.png"
						alt="How To 1"
						sizes="100%"
						width={0}
						height={0}
					/>
				</section>
				<section className={`${style.step} flex col gap-half`}>
					<span>
						Download the latest version of the <Link href={"https://github.com/CKAY-9/k9r"}>k9r-minecraft</Link>
					</span>
					<Image
						src="/games/minecraft_how2.png"
						alt="How To 2"
						sizes="100%"
						width={0}
						height={0}
					/>
				</section>
				<section className={`${style.step} flex col gap-half`}>
					<span>
						Place k9r-minecraft-version.jar into your server&apos;s
						/plugnis folder
					</span>
					<Image
						src="/games/minecraft_how3.png"
						alt="How To 3"
						sizes="100%"
						width={0}
						height={0}
					/>
				</section>
				<section className={`${style.step} flex col gap-half`}>
					<span>Run your Minecraft server</span>
					<Image
						src="/games/minecraft_how4.png"
						alt="How To 4"
						sizes="100%"
						width={0}
						height={0}
					/>
					<span>
						Don&apos;t worry about the warning. You just
						haven&apos;t setup your server key/configuration.
					</span>
				</section>
				<section className={`${style.step} flex col gap-half`}>
					<span>
						Edit your K9R config (either in game or through
						plugins/K9R-Minecraft/config.yml)
					</span>
					<Image
						src="/games/minecraft_how5.png"
						alt="How To 4"
						sizes="100%"
						width={0}
						height={0}
					/>
				</section>
				<section className={`${style.step} flex col gap-half`}>
					<span>Restart your Minecraft server</span>
					<span>
						Upon restart, your server should connect to K9R. If it
						doesn&apos;t, something may be wrong with your server
						key or websocket/API host.
					</span>
				</section>
			</div>
		</>
	);
};

export default MinecraftHow;
