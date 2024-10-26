/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: '**.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/manage/manual',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
