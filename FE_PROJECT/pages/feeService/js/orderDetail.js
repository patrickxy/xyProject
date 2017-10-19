import '@common/css/reset.less';
import '../css/orderDetail.less'
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
    // 点击layer 关闭弹窗;
    $('#layer').on('click', function() {
        $('#layer').hide();
        $('#js_pay_way').hide();
    });
    //查询订单详情
    $loading.show();
    $.ajax({
        type: 'POST',
        url: API + '/usp2c/api/post.do',
        dataType: 'json',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
            method: "com.appwl.service.tel.order.detail",
            partyId: "1",
            time: "20171018152708897",
            v: "1.0",
            // userIdentity: curUserIdentity,
            userIdentity: 'concurrent-test',
            respEncrypt: "0",
            sign: "421f9e1d04f9be5f8f80e9c258bb5295",
            data: {
                "orderId": orderId,
            }
        }),
        success(res) {
            $loading.hide();
            if (res.resultCode == '00000') {
                $('#mobile').html(res.data.phoneNumber);
                $('#space').html(`${res.data.province}${res.data.city}`);
                $('#operator').html(res.data.operator);
                // $('#trafficType').html(res.data.areaType);
                // $('#content').html(res.data.prodDesc);
                $('#orderAmount').html(res.data.orderAmount);
                $('#orderNumber').html(res.data.orderId);
                var statusArr = ['等待付款', '充值中', '关闭交易', '充值失败', '充值成功', '已退款', '退款中'];
                var statusClassArr = [' wait', ' success', ' close', ' fail', ' success', 'close', 'wait'];
                if (res.data.status == 0) {
                    $('#confirm-pay').show();
                    $('#confirm-pay').off('click').on('click', function() {
                        $('#layer').show();
                        $('#js_pay_way').show();
                        payOrder();
                    });
                }
                if (res.data.status == 3) {
                    $('#fail-desc').show();
                }
                $('#status').html(statusArr[res.data.status]).addClass(statusClassArr[res.data.status]);
                $('#time').html(res.data.orderTime);
                $('#price').html(`${res.data.orderAmount}元`);
            } else {
                dialog(res.resultDesc);
            }
        },
        error(err) {
            $loading.hide();
            dialog('系统错误，请稍后再试');
        }
    });

    /**
     * 支付订单
     * 
     */
    function payOrder() {
        $('#js_pay_way ul li').off('click').on('click', function() {
            let curIndex = $(this).index();
            if (curIndex == 0) {
                curIndex = 11;
            } else if (curIndex == 1) {
                curIndex = 21;
            }
            $loading.show();
            $.ajax({
                type: 'POST',
                url: API + '/usp2c/api/post.do',
                dataType: 'json',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    "method": "com.appwl.service.traffic.order.pay",
                    "partyId": "100011",
                    "time": "20170522123513999",
                    "v": "1.0",
                    "userIdentity": curUserIdentity,
                    "respEncrypt": "0",
                    "sign": "asdsasssssssss",
                    "data": {
                        "orderId": orderId,
                        "payType": curIndex, //11支付宝 21 微信
                    }
                }),
                success(res) {
                    $loading.hide();
                    if (res.resultCode == '00000') {
                        if (curIndex == 11) {
                            $('body').append(res.data);
                            $('#alipaysubmit').submit();
                        } else if (curIndex == 21) {
                            window.location.href = res.data;
                        }
                    } else {
                        dialog(res.resultDesc);
                    }
                },
                error(err) {
                    $loading.hide();
                    dialog('系统错误，请稍后再试');
                }
            });
        })
    }

});