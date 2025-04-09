#!/bin/bash

# Extract projectName from the first argument
projectName=$1

# Check if projectName is provided
if [ -z "$projectName" ]; then
  echo "Error: Project name is required. Usage: ./build.sh <projectName>"
  exit 1
fi

# Define variables
currentDate=$(date +%Y%m%d)
outputFile="${projectName}_${currentDate}.7z"
sourceDir=$(pwd)
wslDir="$HOME/Celestia-$projectName"

# Clean up
echo "### Cleaning project..."
rm -rf packages/**/dist
rm -rf .next out dist
rm -rf pnpm-lock.yaml bun.lockb node_modules packages/**/node_modules
rm -f "$outputFile"

# Move project to WSL file system
echo "### Copying project to WSL file system..."
rm -rf "$wslDir"
cp -r "$sourceDir" "$wslDir"
cd "$wslDir" || exit 1

echo "### Installing dependencies..."
pnpm install
pnpm pre:db

echo "### Building app..."
pnpm build

echo "### Preparing app for deployment..."
mv ".next/static" ".next/standalone/.next/static"
cp -r "public" ".next/standalone/public"
rm ".next/standalone/.env"
mv ".env.prod" ".next/standalone/.env"
cd ".next/standalone" || exit 1

echo "### Compressing..."
7z a -t7z "$outputFile" .next .env *
echo "### Compression complete: $outputFile"
mv "$outputFile" "$sourceDir/$outputFile"

# Clean up WSL directory
echo "### Cleaning up WSL directory..."
rm -rf "$wslDir"

echo "### DONE ###"
read -n 1 -s -r -p "Press any key to exit ..."
exit