/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
    },
    async redirects() {
    return [
      {
        source: '/book-table',
        destination: 'https://your-backend.com/book-table',
        permanent: false, // Use true for 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
