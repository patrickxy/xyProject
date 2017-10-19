const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const lessFunctions= require("less-plugin-functions"); 
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const userConfig = require('./page.config');
const remUnit = userConfig.designWidth/10;

let cssLoaders = [
    {loader: 'css-loader',options: {minimize: true}},
    {loader: 'autoprefixer-loader',options: {browsers: ["chrome > 1"] }},
    {loader: 'less-loader'},
];

let cssLoadersUseRem = [
    {loader: 'css-loader',options: {minimize: true}},
    {loader: 'autoprefixer-loader',options: {browsers: ["chrome > 1"] }},
    {loader: 'px2rem-loader',options: {remUnit, }},
    {loader: 'less-loader'},
];

module.exports = {
    entry: './pages/blueBee/js/end.js',
    output: {
        publicPath: `/mobile/${userConfig.dirname}`,
        path: path.resolve(__dirname, `../mobile/${userConfig.dirname}`),
        filename: `js/[name].js`
    },
    resolve: userConfig.resolve,
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader!ejs-html-loader?env=prod',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
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
                query: {
                    limit: 10,
                    name: `/images/[name].[ext]`
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
        new HtmlWebpackPlugin({
            filename: 'end.html',
            template: './pages/blueBee/end.html',
            inject: true,
            inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackInlineSourcePlugin(),
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