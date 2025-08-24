import { execSync } from 'child_process'
import fs from 'fs'
import webpackPaths from '../configs/webpack.paths'

// Safely import dependencies from release package.json, fallback to empty object
let dependencies = {}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
  const releasePackage = require('../../release/app/package.json')
  dependencies = releasePackage.dependencies || {}
} catch {
  // Release package.json doesn't exist or doesn't have dependencies
  dependencies = {}
}

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(webpackPaths.appNodeModulesPath)
) {
  const electronRebuildCmd =
    '../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .'
  const cmd =
    process.platform === 'win32'
      ? electronRebuildCmd.replace(/\//g, '\\')
      : electronRebuildCmd
  execSync(cmd, {
    cwd: webpackPaths.appPath,
    stdio: 'inherit'
  })
}
