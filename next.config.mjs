// import million from "million/compiler"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      {
        source: "/sign-up",
        destination: "/sign-up/email",
      },
      {
        source: "/sign-up/profile",
        destination: "/sign-up/profile/name",
      }
    ]
  },
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
      {
        hostname: 'ggvgrgddongthsuycbym.supabase.co',
        port: '',
      },
    ],
  },
  transpilePackages: ['lucide-react'],
};

// const millionConfig = {
//   auto: { rsc: true },
// }

// TODO: Add back millionConfig once it's fixed
// export default million.next(nextConfig, millionConfig)

export default nextConfig;
