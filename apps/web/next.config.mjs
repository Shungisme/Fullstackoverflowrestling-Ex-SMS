/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: 'dist/.next',
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ["@repo/ui"],
};

export default nextConfig;
