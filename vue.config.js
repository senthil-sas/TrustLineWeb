module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: { output: { filename: '[name].[hash].bundle.js?ver=0.0.1' } },
}
