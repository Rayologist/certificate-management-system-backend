import * as path from "path";
import * as webpack from "webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import webpackNodeExternals from "webpack-node-externals";
import DotenvWebpackPlugin from "dotenv-webpack";

const config: webpack.Configuration = {
  target: "node",
  mode: "production",
  context: path.resolve(__dirname, "src"),
  entry: ["./index.ts", "./api/index.ts"],
  externals: [webpackNodeExternals()],
  optimization: {
    minimize: false,
    nodeEnv: "production"
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
  plugins: [
    new NodePolyfillPlugin(),
    new DotenvWebpackPlugin({ path: "./.env.production.local" }),
  ]
};

export default config;
