const path = require('path');

module.exports = {
  entry: { main: "./src/index.js"},
  mode: "development", // "production" | "development" | "none"
  output: {
    path: path.resolve(__dirname, "./wwwroot/dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "bundle.js", // the filename template for entry chunks
    publicPath: "dist/", // string    // the url to the output directory resolved relative to the HTML page
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              "react-hot-loader/babel",
            ]
          }
        }
      },
      {
       test: /\.css$/,
       use: ['style-loader', 'css-loader'],
     }
    ]
  }
}