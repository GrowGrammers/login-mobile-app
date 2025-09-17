// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;

const custom = {
  resolver: {
    // yalc(=symlink) 패키지 추적
    unstable_enableSymlinks: true,

    // React/React Native 이중 설치 방지: 오직 현재 앱의 node_modules만 본다
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
  },
  // 특별한 경우 아니면 transformer/other 옵션 불필요
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), custom);
