/**
 * Created by danielelisi on 2017-04-09.
 */

const webpack = require("webpack");
const path = require("path");

var jsFolder = path.resolve(__dirname, "js");
var buildFolder = path.resolve(__dirname, "build");

var config = {
    entry: {
        "welcome": jsFolder + "/welcome.js",
        "postsList": jsFolder + "/postsList.js",
        "post": jsFolder + "/post.js"
    },
    output: {
        filename: "[name]bundle.js",
        path: buildFolder
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};

module.exports = config;
