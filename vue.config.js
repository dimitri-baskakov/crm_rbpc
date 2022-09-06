module.exports = {
  devServer: {
    disableHostCheck: true,
    allowedHosts: ["*"]
  },

  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  // watchOptions: {
  //   ignored: /node_modules/,
  // },
}
