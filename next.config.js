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
    webpack: (config, { isServer, nextRuntime }) => {
        if (isServer && nextRuntime === "nodejs")
            config.plugins.push(
                new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ })
            );
        return config;
    },
};

module.exports = nextConfig;
