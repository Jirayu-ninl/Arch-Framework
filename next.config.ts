// @ts-check
import './global/env'
import type { NextConfig } from 'next'
import 'dotenv/config'
// import { fileURLToPath } from 'url'
// import path, { dirname } from 'path'
// import { createRequire } from 'node:module'
import withPlugins from '@theiceji/compose-plugins'
import withPWAInit from '@ducanh2912/next-pwa'
// import { withSentryConfig } from '@sentry/nextjs'
import bundleAnalyzer from '@next/bundle-analyzer'
import million from 'million/compiler'

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
})

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const require = createRequire(import.meta.url)

const appExportList = ['standalone', 'export']
const appExport = process.env.EXPORT !== undefined &&
  appExportList.includes(process.env.EXPORT.toLowerCase()) && {
    output: process.env.EXPORT.toLowerCase(),
  }

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    return {
      ...config,
      cache: { type: 'filesystem' },
      plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
          React: 'react',
        }),
      ],
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.(ogg|mp3|wav|mpe?g)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[name]-[hash][ext]',
            },
          },
          {
            test: /\.mp4$/,
            type: 'asset/resource',
          },
          {
            test: /\.(glsl|vs|fs|vert|frag|ps)$/,
            exclude: /node_modules/,
            use: ['glslify-import-loader', 'raw-loader', 'glslify-loader'],
          },
        ],
      },
    }
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
    typedRoutes: true,
    webVitalsAttribution: ['CLS', 'LCP'],
    swcTraceProfiling: true,
    // workerThreads: true, // Disabled due to issues with next build in NextJs 15
    // optimizeCss: true, // Disabled due to issues with next build
  },
  ...(appExport as NextConfig),
}

// const sentryWebpackPluginOptions = {
//   silent: true,
//   org: 'org_name',
//   project: 'project_name',
// }

const millionConfig = {
  auto: { rsc: true },
}

export default withPlugins(
  [
    // [withSentryConfig, sentryWebpackPluginOptions],
    withBundleAnalyzer,
    withPWA,
    [million.next, millionConfig],
  ],
  nextConfig,
)
