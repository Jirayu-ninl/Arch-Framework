// @ts-check
import './global/env'
import type { NextConfig } from 'next'
import 'dotenv/config'
import withPWAInit from '@ducanh2912/next-pwa'
// import { withSentryConfig } from '@sentry/nextjs'
import bundleAnalyzer from '@next/bundle-analyzer'
import withPlugins from '@theiceji/compose-plugins'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  dest: 'public',
  fallbacks: {
    document: '/offline',
  },
  register: true,
  disable: process.env.NODE_ENV === 'development',
})

const appExportList = ['standalone', 'export']
const appExport = process.env.EXPORT !== undefined &&
  appExportList.includes(process.env.EXPORT.toLowerCase()) && {
    output: process.env.EXPORT.toLowerCase(),
  }

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // GLSL / shader files → import as string (and/or glslify transform)
      '*.{glsl,vs,fs,vert,frag,ps}': {
        loaders: [
          // Most stable baseline:
          'raw-loader',

          // Optional: enable if your shaders rely on glslify features
          // (If this breaks under Turbopack, remove it and keep raw-loader only.)
          'glslify-loader',

          // Optional: only add if you truly need it and it works in your repo
          // 'glslify-import-loader',
        ],
        as: '*.js',
      },
    },
  },
  // biome-ignore lint/suspicious/useAwait: NextJs type
  headers: async () => {
    return [
      {
        source: '/api/public/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  poweredByHeader: false, // Hides "X-Powered-By: Next.js" for security
  generateEtags: true, // Enables ETags for caching
  compress: true, // Enables gzip/ Brotli compression
  productionBrowserSourceMaps: true, // Enables source maps for Sentry
  typedRoutes: true,
  experimental: {
    staleTimes: {
      dynamic: 180,
      static: 600,
    },
    serverActions: {
      // TODO: 1.0 - Update app url for server action
      allowedOrigins: ['nexellab.com', '*.nexellab.com'],
      bodySizeLimit: '10mb',
    },
    webVitalsAttribution: ['CLS', 'LCP'],
    // workerThreads: true, // Disabled due to issues with next build in NextJs 15
    // optimizeCss: true, // Disabled due to issues with next build
  },
  ...(appExport as NextConfig),
}

// const sentryWebpackPluginOptions = {
//   org: 'org_name',
//   project: 'project_name',
//   silent: !process.env.CI,
//   widenClientFileUpload: true,
//   reactComponentAnnotation: {
//     enabled: true,
//   },
//   tunnelRoute: '/monitoring',
//   hideSourceMaps: true,
//   disableLogger: true,
//   automaticVercelMonitors: true,
// }

export default withPlugins(
  [
    // [withSentryConfig, sentryWebpackPluginOptions],
    withBundleAnalyzer,
    withPWA,
  ],
  nextConfig,
)
