const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const lessFunctions = require("less-plugin-functions");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const vConsolePlugin = require('vconsole-webpack-plugin');
const ip = require('my-local-ip')();
const userConfig = require('./page.config');
const remUnit = userConfig.designWidth / 10;

let htmls = [];

for (let i in userConfig.template) {
    htmls.push(
        new HtmlWebpackPlugin({
            filename: i + '.html',
            chunks: [i],
            template: userConfig.template[i],
            inject: 'head'
        })
    )
}


let cssLoaders = [
    { loader: 'css-loader' },
    { loader: 'less-loader' },
]

let cssLoadersUseRem = [
    { loader: 'css-loader' },
    { loader: 'px2rem-loader', options: { remUnit, } },
    { loader: 'less-loader' },
]

module.exports = {
    entry: userConfig.entry,
    output: {
        publicPath: `http://192.168.4.133:8088/`,
        filename: '[name].js',
        chunkFilename: "[name].chunk.js",
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
                loader: 'html-loader!ejs-html-loader?NODE_ENV=dev&env=dev',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader' },
                    ],
                    fallback: 'style-loader',
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: userConfig.useRem ? cssLoadersUseRem : cssLoaders,
                    fallback: 'style-loader',
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: [path.resolve(__dirname, './common/css/weui.less')],
                query: {
                    limit: 10,
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10,
                    name: 'fonts/[name].[ext]'
                }
            },
        ]
    },
    plugins: [
        ...htmls,
        new ExtractTextPlugin({ filename: '[name].css' }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify("dev"),
            API: JSON.stringify("/remote_api"),
        }),
        new vConsolePlugin({
            enable: false
        }),
    ],
    devtool: '#cheap-module-eval-source-map',
    devServer: {
        port: 8088,
        disableHostCheck: true,
        proxy: userConfig.proxy
    }
};