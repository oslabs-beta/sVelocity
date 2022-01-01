[npm_img]: https://img.shields.io/npm/v/webpack-electron-reload.svg?style=flat-square
[npm_site]: https://www.npmjs.org/package/webpack-electron-reload

[![npm info][npm_img]][npm_site]

# webpack-electron-reload
[Webpack](https://webpack.js.org/) plugin that restarts [Electron](https://electronjs.org/) main process automatically on webpack build. Inspired by [electron-reload-webpack-plugin](https://github.com/O4epegb/electron-reload-webpack-plugin).

## Installation
```
npm install --save-dev webpack-electron-reload
```

## Usage

### Add plugin to webpack config

```
const path = require('path');
const ElectronReloadPlugin = require('webpack-electron-reload')({
  path: path.join(__dirname, './dist/main.js'),
});

module.exports = {
    // ...

    target: 'electron-main',

    plugins: [
        // ...
        ElectronReloadPlugin()
    ],

    // ...
};
```

### Start webpack with 'watch' option
```
webpack --watch
```

Plugin will start/restart electron app when webpack rebuilds sources.
