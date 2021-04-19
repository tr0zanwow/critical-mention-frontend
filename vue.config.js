module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/main.scss";`,
      },
    },
  },
  publicPath:
    process.env.NODE_ENV === 'production' ? '/weatherapp/' : '/',
  runtimeCompiler: true,
}
