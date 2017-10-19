import '@common/css/reset.less';
import '../css/success.less'
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {
    // replace();
} else {
    devTool();
}
$(function() {
    const orderId = getUrlParam('id');
    const status = getUrlParam('status');
    const $loading = $('#page-loading');
    const $refresh = $('.js_refresh');
    const curUserIdentity = window.localStorage.getItem('useridentity');
    if (status == 1) {
        // 成功
        $('.show-success').show();
    } else if (status == 2) {
        // 失败
        $('.show-fail').show();
    } else {
        dialog('系统错误!');
    }
    $('.js_check').on('click', function() {
        window.location.href = "orderDetail.html?id=" + orderId;
    });
});