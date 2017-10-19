import '@common/css/reset.less';
import '../css/index.less'
import '../css/pay2wx.less'
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
    const $loading = $('#page-loading');
    const curUserIdentity = window.localStorage.getItem('useridentity');
    const tryHref = getUrlParam('pay');
    $('#js_other_pay').on('click', function() {
        $(this).attr('href', "orderDetail.html?id=" + orderId);
    });
    $('#js_wx_try').on('click', function() {
        $(this).attr('href', tryHref);
    });
    $('#js_refresh').on('click', function() {
        getOrderResult();
    });

    let curOrderId = getUrlParam('id'); //订单id
    let urlMobile = getUrlParam('mobile');

    //  * 查询订单结果
    function getOrderResult() {
        $loading.show();
        $.ajax({
            type: 'POST',
            url: API + '/usp2c/api/post.do',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                method: "com.appwl.service.traffic.order.detail",
                partyId: "100011",
                time: "20170522123513",
                v: "1.0",
                userIdentity: curUserIdentity,
                respEncrypt: "0",
                sign: "asdsasssssssss",
                data: {
                    "orderId": curOrderId,
                }
            }),
            success(res) {
                $loading.hide();
                if (res.resultCode == '00000') {
                    if (res.data.status == 0) {
                        // 失败
                        window.location.href = 'success.html?status=2&id=' + curOrderId;
                    } else {
                        //成功
                        window.location.href = 'success.html?status=1&id=' + curOrderId;
                    }
                } else {
                    dialog(res.resultDesc);
                }
            },
            error(err) {
                $loading.hide();
                // 刷新
                dialog('系统错误，请稍后再试');
            }
        });
    }
});