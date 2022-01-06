const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/Main.tsx',
    content: './src/content.tsx',
    background: './src/background.ts',
  },
  output: {
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
      ],
    }),
  ],
}