#!/usr/bin/env bun
import { $ } from 'bun'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

interface BuildConfig {
  projectName: string
  sourceDir: string
  wslDir: string
  outputFile: string
  includeEnv: boolean
}

async function getConfig(): Promise<BuildConfig> {
  const args = process.argv.slice(2)
  const projectName = args[0]
  const includeEnv = args.includes('-env')

  if (!projectName) {
    console.error(
      'Error: Project name is required. Usage: bun run build.ts <projectName> [-env]',
    )
    process.exit(1)
  }

  const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const outputFile = `app-${projectName}_${currentDate}.7z`
  const sourceDir = process.cwd()
  const wslDir = join(process.env.HOME || '', `Arch-${projectName}`)

  return { projectName, sourceDir, wslDir, outputFile, includeEnv }
}

async function cleanDirectory(path: string) {
  if (existsSync(path)) {
    await $`rm -rf ${path}`
  }
}

async function cleanProject() {
  console.log('### Cleaning project...')

  // Clean build outputs
  const dirsToClean = ['.next', 'out', 'dist', 'bun.lockb', 'node_modules']

  for (const dir of dirsToClean) {
    await cleanDirectory(dir)
  }

  // Clean packages if they exist
  if (existsSync('packages')) {
    await $`find packages -type d -name "dist" -exec rm -rf {} +`
    await $`find packages -type d -name "node_modules" -exec rm -rf {} +`
  }
}

async function setupWslDirectory(config: BuildConfig) {
  console.log('### Copying project to WSL file system...')
  await cleanDirectory(config.wslDir)
  await $`cp -r ${config.sourceDir} ${config.wslDir}`
  process.chdir(config.wslDir)
}

async function buildApp() {
  console.log('### Installing dependencies...')
  await $`bun install`

  if (existsSync('pre:db')) {
    await $`bun run pre:db`
  }

  console.log('### Building app...')
  await $`bun run build`
}

async function prepareForDeployment(config: BuildConfig) {
  console.log('### Preparing app for deployment...')

  // Create necessary directories if they don't exist
  await $`mkdir -p .next/standalone/.next`

  // Move static files
  if (existsSync('.next/static')) {
    await $`mv .next/static .next/standalone/.next/static`
  }

  // Copy public directory if it exists
  if (existsSync('public')) {
    await $`cp -r public .next/standalone/public`
  }

  // Handle environment files
  await cleanDirectory('.next/standalone/.env')
  if (existsSync('.env.prod')) {
    await $`mv .env.prod .next/standalone/.env`
  }

  process.chdir('.next/standalone')

  console.log('### Compressing...')
  if (config.includeEnv) {
    await $`7z a -t7z ${config.outputFile} .next .env *`
  } else {
    await $`7z a -t7z ${config.outputFile} .next *`
  }
  console.log(`### Compression complete: ${config.outputFile}`)
  await $`cp ${config.outputFile} ${config.sourceDir}/${config.outputFile}`
  await $`rm ${config.outputFile}`
}

async function cleanup(config: BuildConfig) {
  console.log('### Cleaning up WSL directory...')
  await cleanDirectory(config.wslDir)
}

async function main() {
  try {
    const config = await getConfig()

    // Clean existing build artifacts
    await cleanProject()

    // Setup WSL directory
    await setupWslDirectory(config)

    // Build the application
    await buildApp()

    // Prepare and compress for deployment
    await prepareForDeployment(config)

    // Cleanup
    await cleanup(config)

    console.log('### DONE ###')

    // Wait for user input before exit
    console.log('Press any key to exit...')
    await new Promise((resolve) => {
      process.stdin.setRawMode(true)
      process.stdin.resume()
      process.stdin.on('data', () => {
        process.stdin.setRawMode(false)
        resolve(undefined)
      })
    })
  } catch (error) {
    console.error('Error during build:', error)
    process.exit(1)
  }
}

// Run the build script
main()
