/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { readFileSync } from 'fs'
import { join } from 'path'
import webpackPaths from './webpack.paths'

// Safely import dependencies from release package.json, fallback to empty object
let externals: Record<string, string> = {}
try {
  const packagePath = join(__dirname, '../../release/app/package.json')
  const packageContent = readFileSync(packagePath, 'utf8')
  const releasePackage = JSON.parse(packageContent)
  externals = releasePackage.dependencies || {}
} catch {
  // Release package.json doesn't exist or doesn't have dependencies
  externals = {}
}

const configuration: webpack.Configuration = {
  externals: [
    ...Object.keys(externals || {}),
    'esbuild',
    'uglify-js',
    '@swc/core',
    'fs'
  ],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext'
            }
          }
        }
      }
    ]
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2'
    }
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules']
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new NodePolyfillPlugin()
  ]
}

export default configuration
