// const CopyPlugin = require('copy-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');
// const webpack = require('webpack');

// const IS_DEV = process.env.NODE_ENV === 'development';

// module.exports = {
//   context: __dirname, // ForkTsCheckerWebpackPluginが自動的にtsconfig.jsonを見つけるために必要

//   entry: {
//     main: './src/index.tsx',
//     content: './src/content.tsx',
//     background: './src/background.ts',
//   },
//   output: {
//     // eslint-disable-next-line no-path-concat
//     path: __dirname + '/dist',
//   },
//   resolve: {
//     extensions: ['.js', '.ts', '.tsx'],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'thread-loader',
//             options: {
//               workers: 2,
//               workerParallelJobs: 80,
//               workerNodeArgs: ['--max-old-space-size=512'],
//               name: 'ts-loader-pool',
//             },
//           },
//           {
//             loader: 'esbuild-loader',
//             options: {
//               loader: 'ts',
//               minify: !IS_DEV,
//               target: 'es6',
//             },
//           },
//         ],
//       },
//       {
//         test: /\.tsx$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'thread-loader',
//             options: {
//               workers: 2,
//               workerParallelJobs: 80,
//               workerNodeArgs: ['--max-old-space-size=512'],
//               name: 'tsx-loader-pool',
//             },
//           },
//           {
//             loader: 'esbuild-loader',
//             options: {
//               loader: 'tsx', // loaderはstring型なのでtsとtsxファイルの設定を別々に定義する必要がある
//               minify: !IS_DEV,
//               target: 'es6',
//             },
//           },
//         ],
//       },
//     ],
//   },
//   optimization: {
//     minimizer: [
//       new TerserPlugin({
//         extractComments: false,
//       }),
//     ],
//   },
//   plugins: [
//     new ForkTsCheckerWebpackPlugin(),
//     new CopyPlugin({
//       patterns: [
//         {
//           from: './public/manifest.json',
//           to: './manifest.json',
//         },
//         {
//           from: './public/popup.html',
//           to: './popup.html',
//         },
//         // {
//         //   from: './public/content.html',
//         //   to: './content.html',
//         // },
//         {
//           from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
//         },
//       ],
//     }),
//   ],
// };
