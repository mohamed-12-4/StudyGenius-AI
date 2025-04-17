/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'appwrite.io'],
    },
    eslint: {
        rules: {
            "react/no-unescaped-entities": "off",
        },
    },
    
};


export default nextConfig;
