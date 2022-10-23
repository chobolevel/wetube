const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
  },
  mode: "development",
  watch: true, //계속 실행상태를 유지하기 위함
  plugins: [new MiniCssExtractPlugin({
    filename: "css/styles.css",
  })],
  output: {
    //확장자 js파일은 모두 아래 처리를 따름
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true, //시작하기 전에 폴더를 깨끗하게 비우는 옵션
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      }
    ],
  },
};