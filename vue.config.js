module.exports = {
  devServer: {
    https: true,
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("vue", "@vue/compat");

    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: "Draw Together",
    },
  },
};
