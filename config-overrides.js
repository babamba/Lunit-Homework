const {
  addDecoratorsLegacy,
  fixBabelImports,
  addBabelPlugin,
  disableEsLint,
  addWebpackAlias,
  override
} = require('customize-cra');
const path = require('path');

module.exports = {
  // customize-cra와 react-app-rewired 를 이용하여 cra eject 없이 cra 커스터마이징.
  webpack: override(
    // antd 컴포넌트를 import 할떄 자동으로 저용량 es 폴더 쪽으로 경로를 지정.
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    // 스타일 컴포넌트의 이름을 해쉬 앞에 접두사로 붙여서 넣어주어 보기쉽게.
    addBabelPlugin([
      'babel-plugin-styled-components',
      {
        displayName: true
      }
    ]),
    disableEsLint(), // mobx 설정 중 하나. eslint를 끄는 것이 아님.
    addDecoratorsLegacy(), // decorator를 사용할 수 있도록 해주는 config
    // 자주 사용하는 경로를 alias 처리
    addWebpackAlias({
      ['components']: path.resolve(__dirname, './src/components'),
      ['interface']: path.resolve(__dirname, './src/interface'),
      ['hooks']: path.resolve(__dirname, './src/hooks'),
      ['pages']: path.resolve(__dirname, './src/pages'),
      ['store']: path.resolve(__dirname, './src/stores')
    })
  )
};
