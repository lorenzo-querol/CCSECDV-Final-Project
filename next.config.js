/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/login",
				permanent: true,
			},
		];
	},
	images: {
		domains: ["cssecdv-final-project.s3-ap-southeast-1.amazonaws.com"],
	},
};

module.exports = nextConfig;
