/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'k.kakaocdn.net',
        port: '',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
