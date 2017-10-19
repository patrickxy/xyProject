import '@common/css/reset.less';
import '../css/records.less'
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
    var $loading = $('#page-loading');
    var pageNum = 1;
    let curMobileLen = 0;
    let curPhoneNumber = '';
    const curUserIdentity = window.localStorage.getItem('useridentity');
    $('#js_search_mobile').on('input', function(e) {
        if ($('#js_search_mobile').val()) {
            $('#record-input i').show();
            if ($('#js_search_mobile').val().length == 13) {
                //验证手机号
                let str0 = $('#js_search_mobile').val().substr(0, 3);
                let str1 = $('#js_search_mobile').val().substr(3, 1);
                let str2 = $('#js_search_mobile').val().substr(4, 4);
                let str3 = $('#js_search_mobile').val().substr(8, 1);
                let str4 = $('#js_search_mobile').val().substr(9, 4);
                if (/^1[34578][0-9]{1}$/.test(str0) &&
                    /^[0-9]{4}$/.test(str2) &&
                    /^[0-9]{4}$/.test(str4) &&
                    (str1 == str3) && (str1 == ' ' || str1 == '-')
                ) {
                    $('#js_search_mobile').blur();
                } else {
                    $('#js_invalid_mobile').show();
                    $('#js_search_mobile').blur();
                }
            }
            if ($('#js_search_mobile').val().length == 11 && /^1[34578][0-9]{9}$/.test($('#js_search_mobile').val())) {
                let str0 = $('#js_search_mobile').val().substr(0, 3);
                let str1 = $('#js_search_mobile').val().substr(3, 4);
                let str2 = $('#js_search_mobile').val().substr(7, 4);
                $('#js_search_mobile').val(str0 + ' ' + str1 + ' ' + str2);
                $('#js_search_mobile').blur();
            }
            if ($('#js_search_mobile').val().length > curMobileLen) {
                if ($('#js_search_mobile').val().length == 4) {
                    let str0 = $('#js_search_mobile').val().substr(0, 3);
                    let str1 = $('#js_search_mobile').val().substr(3, 1);
                    $('#js_search_mobile').val(str0 + ' ' + str1);
                } else if ($('#js_search_mobile').val().length == 9) {
                    let str0 = $('#js_search_mobile').val().substr(0, 3);
                    let str1 = $('#js_search_mobile').val().substr(4, 4);
                    let str2 = $('#js_search_mobile').val().substr(8, 1);
                    $('#js_search_mobile').val(str0 + ' ' + str1 + ' ' + str2);
                }
            } else {
                if ($('#js_search_mobile').val().length == 4) {
                    var str0 = $('#js_search_mobile').val().substr(0, 3);
                    $('#js_search_mobile').val(str0);
                } else if ($('#js_search_mobile').val().length == 9) {
                    let str0 = $('#js_search_mobile').val().substr(0, 8);
                    $('#js_search_mobile').val(str0);
                }
            }
            curPhoneNumber = $('#js_search_mobile').val().substr(0, 3) + $('#js_search_mobile').val().substr(4, 4) + $('#js_search_mobile').val().substr(9, 4);
            curMobileLen = $('#js_search_mobile').val().length;
        }
    });
    $('#js_search').on('click', function() {
        //页面返回时 input中的值还在

        $('#js_records_list').empty();
        $('#js_get_more').hide();
        if (isphone()) {
            curPhoneNumber = $('#js_search_mobile').val().substr(0, 3) + $('#js_search_mobile').val().substr(4, 4) + $('#js_search_mobile').val().substr(9, 4);
            curMobileLen = $('#js_search_mobile').val().length;
            //手机号码提示
            $('#record-input i').hide();
            getRecordsList(false);
        } else if (!$('#js_search_mobile').val()) {
            // 没有手机号 默认查所有
            curPhoneNumber = '';
            curMobileLen = 0;
            getRecordsList(false);
        } else {
            //提示手机号码格式不对
            $('#js_invalid_mobile').show();
        }
    });
    // 聚焦时 改变右侧图标为× 去掉mobileTip 充值列表不可选择
    $('#js_search_mobile').on('focus', function() {
        //隐藏手机号码提示
        $('.common-tip').hide();
        $('#js_records_list').empty();
        $('#js_get_more').hide();
        if ($('#js_search_mobile').val()) {
            //右侧图标变化
            $('#record-input i').show();
        }

    });

    // 手机号码失去焦点时
    $('#js_search_mobile').on('blur', function() {

        //页面返回时 input中的值还在
        curPhoneNumber = $('#js_search_mobile').val().substr(0, 3) + $('#js_search_mobile').val().substr(4, 4) + $('#js_search_mobile').val().substr(9, 4);
        curMobileLen = $('#js_search_mobile').val().length;

        // 点击关闭时 触发了失去焦点事件 点击事件与失去焦点事件冲突 
        setTimeout(function() {
            if (isphone()) {
                //手机号码提示
                $('#record-input i').hide();
                getRecordsList(false);
            } else if (!$('#js_search_mobile').val()) {
                // 没有手机号 默认查所有
                curPhoneNumber = '';
                curMobileLen = 0;
                getRecordsList(false);
            } else {
                //提示手机号码格式不对
                $('#js_invalid_mobile').show();
            }
        }, 300)
    });

    //点击删除按钮
    $('#record-input i').on('click', function() {
        $('#js_search_mobile').val('');
        curPhoneNumber = '';
        $('#js_search_mobile').focus();
        //隐藏提示 列表
    })

    //点击查看更多
    $('#js_get_more').on('click', function() {
        getRecordsList(true);
    });

    //初始化进来时查询所有 
    $('#js_search').trigger('click');

    //页面返回时 input中的值还在 触发跟blur一样的操作
    if ($('#js_search_mobile').val()) {
        //页面返回时 input中的值还在 触发跟blur一样的操作
        curPhoneNumber = $('#js_search_mobile').val().substr(0, 3) + $('#js_search_mobile').val().substr(4, 4) + $('#js_search_mobile').val().substr(9, 4);
        curMobileLen = $('#js_search_mobile').val().length;
        $('#js_invalid_mobile').hide();
        // 点击关闭时 触发了失去焦点事件 点击事件与失去焦点事件冲突 
        setTimeout(function() {
            if (isphone()) {
                //手机号码提示
                $('#record-input i').hide();
                getRecordsList(false);
            } else if (!$('#js_search_mobile').val()) {
                // 没有手机号 默认查所有
                curPhoneNumber = '';
                curMobileLen = 0;
                getRecordsList(false);
            } else {
                //提示手机号码格式不对
                $('#js_invalid_mobile').show();
            }
        }, 300)
    }
    /**
     * 验证手机号是否合法
     * 
     * @returns 
     */
    function isphone() {
        return /^1[34578][0-9]{9}$/.test(curPhoneNumber)
    }

    /**
     * 获取记录列表
     *  应有下一页功能 如果是查看更多得到的 应该append
     * type 是否是查看更多 true表示是查看更多 
     */
    function getRecordsList(type) {
        type ? pageNum++ : pageNum = 1;
        $loading.show();
        $.ajax({
            type: 'POST',
            url: API + '/usp2c/api/post.do',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                method: "com.appwl.service.tel.order.list",
                partyId: "1",
                time: "20171018152708897",
                userIdentity: 'concurrent-test',
                v: "1.0",
                // userIdentity: curUserIdentity,
                respEncrypt: "0",
                sign: "421f9e1d04f9be5f8f80e9c258bb5295",
                data: {
                    "phoneNumber": curPhoneNumber,
                    "pageNo": pageNum,
                    "pageSize": "10"
                }
            }),
            success(res) {
                $loading.hide();
                if (res.resultCode == '00000') {
                    if (!type && !res.data.result.length) {
                        $('.common-tip').hide();
                        $('#js_no_record').show();
                        return;
                    }
                    // 第一次查询
                    let str = '';
                    res.data.result.forEach((item, index) => {
                        var statusArr = ['等待付款', '充值中', '关闭交易', '充值失败', '充值成功'];
                        var statusClassArr = [' wait', ' success', ' close', ' fail', ' success'];
                        // item.status
                        str += `<li>
                                <p class="time">${item.orderTime}<span class="status ${statusClassArr[item.status]}">${statusArr[item.status]}</span></p>
                                <div class="content" data-id="${item.orderId}">
                                    <p class="desc">充值${item.prodDesc}<i></i></p>
                                    <p class="number">${item.phoneNumber}<span class="price">${item.price}元</span></p>
                                </div>
                            </li>`
                    })
                    type ? $('.records-list').append(str) : $('.records-list').html(str);
                    // 是否有下一页
                    res.data.pageTotal > res.data.pageNo ? $('#js_get_more').show() : $('#js_get_more').hide();
                    $('.records-list .content').off('click').on('click', function() {
                        window.location.href = 'orderDetail.html?id=' + $(this).data('id');
                    })
                } else {
                    dialog(res.resultDesc);
                }
            },
            error(err) {
                $loading.hide();
                dialog('系统错误，请稍后再试');
            }
        });
    }


});