import type { Metadata } from "next";
import "./globals.scss";
import { getCommunityDetails } from "@/api/community-details/api";

export const generateMetadata = async (): Promise<Metadata> => {
	const details = await getCommunityDetails();
	return {
		title: details.name,
		description: details.description,
		icons: [details.icon ? details.icon : "/icon.png"]
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}
