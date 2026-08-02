/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  devIndicators: false,
  // `next dev` and `next build` both write to `.next`. Building while the dev
  // server is up therefore interleaves two sets of artefacts in one directory,
  // and dev sweeps away chunks the built server still expects — `next start`
  // then 500s every route on `Cannot find module './vendor-chunks/*.js'`. Giving
  // dev its own directory means the two can never tread on each other.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  // The work listing lives on the index now. Temporary, not permanent: a 308 is
  // cached forever by browsers, and this is cheap to keep. Case studies at
  // /work/<slug> are untouched.
  async redirects() {
    return [{ source: '/work', destination: '/#work', permanent: false }];
  },
};
export default nextConfig;
