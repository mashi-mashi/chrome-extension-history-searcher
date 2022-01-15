const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === '"development"';

const watchConfig = () =>
  isDev
    ? {
        onRebuild(err, result) {
          console.log(JSON.stringify(err?.errors));
          console.log(JSON.stringify(result?.warnings));
        },
      }
    : undefined;

build({
  define: {
    'process.env.NODE_ENV': process.env.NODE_ENV,
    global: 'window',
  },
  target: 'es2015',
  platform: 'browser',
  entryPoints: {
    main: './src/index.tsx',
    content: './src/content.tsx',
    background: './src/background.ts',
  },
  outdir: path.resolve(__dirname, 'dist'),
  bundle: true,
  resolveExtensions: ['.js', '.ts', '.tsx'],
  minify: !isDev,
  sourcemap: isDev,
  watch: watchConfig(),
})
  .then(() => {
    console.log('===========================================');
    console.log(`${new Date().toLocaleString()}: ${isDev ? `watching...` : `completed`}`);
  })
  .catch((e) => console.error('failed to build', e));

// コピープラグインがうまく動かないので一旦自前で静的ファイルをコピー
const copyAssets = () => {
  const DIST_PATH = './dist';
  const targets = [
    { from: './public/manifest.json', to: DIST_PATH + '/manifest.json' },
    { from: './public/popup.html', to: DIST_PATH + '/popup.html' },
    { from: './node_modules/webextension-polyfill/dist/browser-polyfill.js', to: DIST_PATH + '/browser-polyfill.js' },
  ];

  if (!fs.existsSync(DIST_PATH + '/')) fs.mkdirSync(DIST_PATH + '');

  targets.forEach(({ from, to }) => {
    fs.copyFileSync(from, to);
  });
};

copyAssets();
