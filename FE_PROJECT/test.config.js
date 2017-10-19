const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");
const excludeHtmlWebpackPlugin = require("html-webpack-exclude-assets-plugin");
const lessFunctions= require("less-plugin-functions"); 
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const imageminMozjpeg  = require('imagemin-mozjpeg'); 
const vConsolePlugin = require('vconsole-webpack-plugin'); ; 
const userConfig = require('./page.config');
const remUnit = userConfig.designWidth/10;
let htmls  = [];

for(let i in userConfig.template){
    htmls.push(
        new HtmlWebpackPlugin({
            filename: `${i}.html`,
            chunks: [i],
            template: userConfig.template[i],
            inject: true,
            excludeAssets: [/.*.css/]
        })       
    );
    htmls.push(
        new StyleExtHtmlWebpackPlugin({chunks: [i]})     
    );
}

let cssLoaders = [
    {loader: 'css-loader'},
    {loader: 'autoprefixer-loader',options: {browsers: ["chrome > 1"] }},
    {loader: 'less-loader'},
];

let cssLoadersUseRem = [
    {loader: 'css-loader'},
    {loader: 'autoprefixer-loader',options: {browsers: ["chrome > 1"] }},
    {loader: 'px2rem-loader',options: {remUnit, }},
    {loader: 'less-loader'},
];


module.exports = {
    entry: userConfig.entry,
    output: {
        publicPath: `/mobile/test/${userConfig.dirname}`,
        path: path.resolve(__dirname, `../mobile/test/${userConfig.dirname}`),
        filename: `js/[name].js`
    },
    resolve: userConfig.resolve,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader!ejs-html-loader?env=prod',
            },
            {
                test: /\.less$/,
                // loader: 'style-loader!css-loader!less-loader',
                use: ExtractTextPlugin.extract({
                    use: userConfig.useRem ? cssLoadersUseRem : cssLoaders,
                    fallback: 'style-loader',
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 5000,
                    name: `/images/[name].[ext]`
                }
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'css/[name].css',
        }),
        new vConsolePlugin({
            enable: false
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify("test"),
            API: JSON.stringify(""),
        }),
        ...htmls,
        new excludeHtmlWebpackPlugin(),
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
