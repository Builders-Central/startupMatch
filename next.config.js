/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Remove or comment out the output: 'export' line if it exists
  // output: 'export'
  eslint: {
    // Warning: Only disable these if you're sure you want to
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
