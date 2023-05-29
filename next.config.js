/* eslint-disable prettier/prettier */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "d205bpvrqc9yn1.cloudfront.net",
      },
      {
        protocol: "https",
        hostname:
          "https://dskehelyakelwuozfzay.supabase.co/storage/v1/object/public/images/",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_RAPID_API_KEY: process.env.NEXT_PUBLIC_RAPID_API_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_RAPID_API_HOST: process.env.NEXT_PUBLIC_RAPID_API_HOST,
  },
};

module.exports = nextConfig;
