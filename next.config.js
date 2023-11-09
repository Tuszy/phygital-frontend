/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_IPFS_DOMAIN,
                port: '',
                pathname: '/ipfs/**',
            },
        ],
    },
}

module.exports = nextConfig
