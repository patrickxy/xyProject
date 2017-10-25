const path = require('path');
const glob = require('glob');
const DIR_NAME = 'developBook';
let getEntries = function(pattern) {
    let entries = {};
    glob.sync(`./pages/${DIR_NAME}/${pattern}`).forEach(item => {
        entries[item.split('/').pop().split('.').shift()] = item;
    })
    return entries;
}

module.exports = {
    dirname: DIR_NAME,
    designWidth: 750,
    useRem: false,
    entry: getEntries('js/*.js'),
    template: getEntries('*.html'),
    resolve: {
        alias: {
            "@common": path.resolve(__dirname, './common'),
            common_js: path.resolve(__dirname, './common/js/main.js'),
            common_css: path.resolve(__dirname, './common/css/main.less'),
            weui_css: path.resolve(__dirname, './common/css/weui.less'),
        },
    },
    proxy: {
        '/remote_api': {
            // target: 'http://192.168.4.82:8081',
            // target: 'http://micw.ngrok.cc',
            // target: 'http://45.32.67.192',
            target: 'http://183.131.4.101:23001',
            // target: 'http://bm.zhongguowangshi.com',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '^/remote_api': ''
            },
        },
        '/la': {
            target: 'http://bimplus.iask.in',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '^/la': ''
            },
        },
    }
};