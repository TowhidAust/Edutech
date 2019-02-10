const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const MergeIntoSingleFilePlugin = require("webpack-merge-and-include-globally");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const modeConfig = mode => require(`./webpack.${mode}`);

module.exports = ({ mode } = { mode: "production" }) => {
  return webpackMerge(
    {
      mode,
      output: {
        filename: mode === "production" ? "bundle[hash].js" : "bundle.js"
      },
      module: {
        rules: [{ test: /\.css$/, use: [MiniCSSExtractPlugin.loader, "css-loader"] }]
      },
      plugins: [
        new HtmlWebpackPlugin({ template: "EDUTECH_TeacherProfile.html" }),
        new CleanWebpackPlugin(["dist"]),
        new MiniCSSExtractPlugin(),
        new CopyWebpackPlugin([
          { from: "src/assets/css/font-icons/entypo/fonts", to: "assets/fonts" },
          { from: "src/assets/images", to: "assets/images" },
          {
            from: "src/mergedAssets/assets.min.css",
            to: "assets/css/assets.min.css",
            toType: "file"
          }
        ]),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.$": "jquery",
          "window.jQuery": "jquery"
        })
        // new MergeIntoSingleFilePlugin({
        //   files: {
        //     "assets.js": [
        //       "src/assets/js/Libraries/gsap/TweenMax.min.js",
        //       "src/assets/js/Libraries/jquery-ui/js/jquery-ui-1.10.3.minimal.min.js",
        //       "src/assets/js/Libraries/bootstrap.js",
        //       "src/assets/js/Libraries/joinable.js",
        //       "src/assets/js/Libraries/resizeable.js",
        //       "src/assets/js/Libraries/neon-api.js",
        //       "src/assets/js/Libraries/jquery.validate.min.js",
        //       "src/assets/js/Libraries/jvectormap/jquery-jvectormap-1.2.2.min.js",
        //       "src/assets/js/HomeTab/TODO.js",
        //       "src/assets/js/HomeTab/DonutChart.js",
        //       "src/assets/js/StudentTab/AcceptedPanel.js",
        //       "src/assets/js/StudentTab/GeneralInterface.js",
        //       "src/assets/js/StudentTab/RollCall.js",
        //       "src/assets/js/Libraries/toastr.js",
        //       "src/assets/js/Libraries/bootstrap-colorpicker.min.js",
        //       "src/assets/js/Libraries/neon-custom.js",
        //       "src/assets/js/Libraries/neon-demo.js",
        //       "src/assets/js/Libraries/Chart.min.js"
        //     ]
        //   }
        // transform: {
        //   "assets.js": code => require("uglify-js").minify(code).code
        // }
        // })
      ]
    },
    modeConfig(mode)
  );
};
