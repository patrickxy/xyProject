const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const lessFunctions = require("less-plugin-functions");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const userConfig = require('./page.config');
const remUnit = userConfig.designWidth / 10;
let htmls = [];

for (let i in userConfig.template) {
    htmls.push(
        new HtmlWebpackPlugin({
            filename: `${i}.html`,
            chunks: [i],
            template: userConfig.template[i],
            inject: 'head'
        })
    )
}

let cssLoaders = [
    { loader: 'css-loader', options: { minimize: true } },
    { loader: 'autoprefixer-loader', options: { browsers: ["chrome > 1"] } },
    { loader: 'less-loader' },
];

let cssLoadersUseRem = [
    { loader: 'css-loader', options: { minimize: false } },
    { loader: 'autoprefixer-loader', options: { browsers: ["chrome > 1"] } },
    { loader: 'px2rem-loader', options: { remUnit, } },
    { loader: 'less-loader' },
];

module.exports = {
    entry: userConfig.entry,
    output: {
        // publicPath: `/mobile/${userConfig.dirname}/`,
        publicPath: `./`,
        // path: path.resolve(__dirname, `../mobile/${userConfig.dirname}`),
        path: path.resolve(__dirname, `../dist/${userConfig.dirname}`),
        filename: `js/[name].js`,
        chunkFilename: "js/[name].chunk.js",
    },
    resolve: userConfig.resolve,
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                use: [
                    { loader: 'html-loader' },
                    {
                        loader: 'ejs-html-loader',
                        options: {
                            NODE_ENV: 'prod',
                            env: 'prod',
                            baiduKey: userConfig.baiduKey,
                        }
                    },
                ]
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    publicPath: '../',
                    use: userConfig.useRem ? cssLoadersUseRem : cssLoaders,
                    fallback: 'style-loader',
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10,
                    name: `images/[name].[ext]`
                }
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: `css/[name].css`
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify("prod"),
            API: JSON.stringify(""),
        }),
        ...htmls,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ],

};