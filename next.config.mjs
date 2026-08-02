/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  devIndicators: false,
  // The work listing lives on the index now. Temporary, not permanent: a 308 is
  // cached forever by browsers, and this is cheap to keep. Case studies at
  // /work/<slug> are untouched.
  async redirects() {
    return [{ source: '/work', destination: '/#work', permanent: false }];
  },
};
export default nextConfig;
