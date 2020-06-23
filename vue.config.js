module.exports = {
  devServer: {
    https: true,
    public: process.env.BASE_URL
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Draw Together'
    }
  }
}
