import '@common/css/font.css';
import '../css/index.less';
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {} else {
    devTool();
}
$(function() {
    // Initialize your app
    // var myApp = new Framework7();

    // var mainView = myApp.addView('.view-main')
    // Export selectors engine
    // var $$ = Dom7;
    // $$('#approval-list').on('click', function() {
    //     mainView.router.loadPage('commonApproval.html');
    // })
});