const path = require("path");

const fnConfig = {
  devtool: false, 
  name: "client",
  target: "web",
  entry: {
    functions: "./src/client.js",
  },
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};

const swConfig = {
  devtool: false, 
  resolve: {
    extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'], 
  },
  name: "sw",
  target: "webworker",
  entry: {
    sw: "./src/sw.mjs",
  },
  output: {
    filename: "sw.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};

module.exports = [fnConfig, swConfig];