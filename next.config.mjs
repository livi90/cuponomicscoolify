/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // Configuración de internacionalización
  i18n: {
    locales: ['es', 'en', 'fr', 'de', 'pt'],
    defaultLocale: 'es',
  },
}

export default nextConfig
