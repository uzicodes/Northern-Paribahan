/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 86400,
    },
};

module.exports = nextConfig;
