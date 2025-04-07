import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: "*",
			},
			{
				protocol: 'http',
				hostname: "*",
			},
		],
	},
	devIndicators: false
};

export default nextConfig;
