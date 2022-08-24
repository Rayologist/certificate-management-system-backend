import * as path from "path";
import * as webpack from "webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import webpackNodeExternals from "webpack-node-externals";

const config: webpack.Configuration = {
  context: path.resolve(__dirname, "src"),
  entry: ["./index.ts"],
  externals: [webpackNodeExternals()],
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  node: {
    __dirname: true,
  },
  output: {
    publicPath: "dist",
    filename: "index.js",
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [new NodePolyfillPlugin()],
  target: "node"
};

export default config;
