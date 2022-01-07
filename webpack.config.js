const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/index.tsx',
    content: './src/content.tsx',
    background: './src/background.ts',
  },
  output: {
    // eslint-disable-next-line no-path-concat
    path: __dirname + '/dist',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './public/manifest.json',
          to: './manifest.json',
        },
        {
          from: './public/popup.html',
          to: './popup.html',
        },
        // {
        //   from: './public/content.html',
        //   to: './content.html',
        // },
        {
          from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
        },
      ],
    }),
  ],
};
