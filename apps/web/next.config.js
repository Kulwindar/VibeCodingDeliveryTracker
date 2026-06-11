const nextConfig = {
  transpilePackages: ['@deliverytracker/shared'],
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  async redirects() {
    return [
      {
        source: '/track',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;