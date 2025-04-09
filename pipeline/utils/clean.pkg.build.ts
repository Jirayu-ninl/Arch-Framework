import { rimraf } from 'rimraf'
import { glob } from 'glob'

// Build and output directories
const BUILD_PATTERNS = [
  'out',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'storybook-static',
]

// Cache and temporary files
const CACHE_PATTERNS = ['.cache', '.turbo', 'node_modules', '.verdaccio-cache']

// Test and coverage
const TEST_PATTERNS = [
  'coverage',
  '.nyc_output',
  '__snapshots__',
  'test-results',
]

// Temporary and system files
const TEMP_PATTERNS = [
  'tmp',
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  '*.tsbuildinfo',
]

// Generate patterns with packages prefix
const generatePackagePatterns = (patterns: string[]): string[] => {
  return patterns.map((pattern) => `packages/**/${pattern}`)
}

// Combine all patterns
const patternsToRemove = [
  // Root level files
  'pnpm-lock.yaml',
  'yarn.lock',
  'package-lock.json',
  'bun.lockb',
  '.env.local',

  // Patterns for packages directory
  ...generatePackagePatterns(BUILD_PATTERNS),
  ...generatePackagePatterns(CACHE_PATTERNS),
  ...generatePackagePatterns(TEST_PATTERNS),
  ...generatePackagePatterns(TEMP_PATTERNS),
]

interface CleanOptions {
  dryRun?: boolean
}

async function cleanDirectories(options: CleanOptions = {}): Promise<void> {
  const { dryRun = false } = options

  try {
    let totalFiles = 0
    const startTime = Date.now()

    console.log(`🔍 ${dryRun ? '[DRY RUN] ' : ''}Scanning directories...\n`)

    for (const pattern of patternsToRemove) {
      const files = await glob(pattern, {
        ignore: {
          childrenIgnored: (p: { isNamed: (name: string) => boolean }) =>
            p.isNamed('node_modules'),
        },
        dot: true,
      })

      if (files.length > 0) {
        totalFiles += files.length
        if (!dryRun) {
          await rimraf(files)
          console.log(
            `✓ Removed ${files.length.toString().padStart(3, ' ')} matches for: ${pattern}`,
          )
        } else {
          console.log(
            `📦 Would remove ${files.length.toString().padStart(3, ' ')} matches for: ${pattern}`,
          )
          for (const file of files) {
            console.log(`   - ${file}`)
          }
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(
      `\n🧹 ${dryRun ? '[DRY RUN] ' : ''}Cleanup ${dryRun ? 'would remove' : 'removed'} ${totalFiles} files in ${duration}s`,
    )
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
}

// Check for --dry-run flag
const isDryRun = process.argv.includes('--dry-run')

// Execute cleanup
cleanDirectories({ dryRun: isDryRun })
