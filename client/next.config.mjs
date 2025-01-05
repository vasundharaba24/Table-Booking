/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
    },
    async redirects() {
    return [
      {
        source: '/book-table',
        destination: 'https://table-booking-hzcopvvm2-vasundharaba24s-projects.vercel.app',
        permanent: false, // Use true for 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
