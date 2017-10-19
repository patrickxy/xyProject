import '@common/css/reset.less';
import '../css/index.less';
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {} else {
    devTool();
}
$(function() {
    const $loading = $('#page-loading');
    let productsData = []; //产品列表
    let curProdId = 0; //产品id
    let curPhoneNumber = ''; //当前手机号码
    let curOrderId = ''; //订单id
    let curMobileLen = 0;
    let curUserIdentity = '';
    let urlMobile = getUrlParam('mobile');
    // 手机号码改变时
    $('#js_mobile').on('input', function() {
        if ($('#js_mobile').val()) {
            $('.input-wrap i').addClass('active');

            if ($('#js_mobile').val().length == 13) {
                //验证手机号
                let str0 = $('#js_mobile').val().substr(0, 3);
                let str1 = $('#js_mobile').val().substr(3, 1);
                let str2 = $('#js_mobile').val().substr(4, 4);
                let str3 = $('#js_mobile').val().substr(8, 1);
                let str4 = $('#js_mobile').val().substr(9, 4);
                if (/^1[34578][0-9]{1}$/.test(str0) &&
                    /^[0-9]{4}$/.test(str2) &&
                    /^[0-9]{4}$/.test(str4) &&
                    (str1 == str3) && (str1 == ' ' || str1 == '-')
                ) {
                    $('#js_mobile').blur();
                } else {
                    showMobileTip('请输入正确的手机号码', 2);
                    $('#js_mobile').blur();
                }
            }
            if ($('#js_mobile').val().length == 11 && /^1[34578][0-9]{9}$/.test($('#js_mobile').val())) {
                let str0 = $('#js_mobile').val().substr(0, 3);
                let str1 = $('#js_mobile').val().substr(3, 4);
                let str2 = $('#js_mobile').val().substr(7, 4);
                $('#js_mobile').val(str0 + ' ' + str1 + ' ' + str2);
                $('#js_mobile').blur();
            }
            if ($('#js_mobile').val().length > curMobileLen) {
                if ($('#js_mobile').val().length == 4) {
                    let str0 = $('#js_mobile').val().substr(0, 3);
                    let str1 = $('#js_mobile').val().substr(3, 1);
                    $('#js_mobile').val(str0 + ' ' + str1);
                } else if ($('#js_mobile').val().length == 9) {
                    let str0 = $('#js_mobile').val().substr(0, 3);
                    let str1 = $('#js_mobile').val().substr(4, 4);
                    let str2 = $('#js_mobile').val().substr(8, 1);
                    $('#js_mobile').val(str0 + ' ' + str1 + ' ' + str2);
                }
            } else {
                if ($('#js_mobile').val().length == 4) {
                    var str0 = $('#js_mobile').val().substr(0, 3);
                    $('#js_mobile').val(str0);
                } else if ($('#js_mobile').val().length == 9) {
                    let str0 = $('#js_mobile').val().substr(0, 8);
                    $('#js_mobile').val(str0);
                }
            }
            curPhoneNumber = $('#js_mobile').val().substr(0, 3) + $('#js_mobile').val().substr(4, 4) + $('#js_mobile').val().substr(9, 4);
            curMobileLen = $('#js_mobile').val().length;

        }
    });
    // 手机号码失去焦点时
    $('#js_mobile').on('blur', function() {

        //页面返回时 input中的值还在
        curPhoneNumber = $('#js_mobile').val().substr(0, 3) + $('#js_mobile').val().substr(4, 4) + $('#js_mobile').val().substr(9, 4);
        curMobileLen = $('#js_mobile').val().length;

        // 点击关闭时 触发了失去焦点事件 点击事件与失去焦点事件冲突 
        setTimeout(function() {
            if (isphone()) {
                //手机号码提示
                showMobileTip('', 1);
                //右侧图标变化
                $('#js_input-wrap i').removeClass('active');
                getProductList();
            } else if ($('#js_mobile').val().length) {
                showMobileTip('请输入正确的手机号码', 2);
            }
        }, 300)
    });
    // 聚焦时 改变右侧图标为× 去掉mobileTip 显示默认列表
    $('#js_mobile').on('focus', function() {
        //手机号码提示
        showMobileTip('', 1);
        if ($('#js_mobile').val()) {
            //右侧图标变化
            $('#js_input-wrap i').addClass('active');
        } else {
            //右侧图标变化
            $('#js_input-wrap i').removeClass('active');
        }
        //列表不可选
        $('#default-list').show();
        $('#js_nopack_tip').hide();
        $('#charge-list').hide();
        $('#js_discount').hide();
    });
    //点击删除按钮
    $('#js_input-wrap i').on('click', function() {
        if ($('#js_input-wrap i').hasClass('active')) {
            curPhoneNumber = '';
            $('#js_mobile').val('');
            showMobileTip('', 1);
            $('#js_input-wrap i').removeClass('active');
            //列表不可选
            $('#default-list').show();
            $('#charge-list').hide();
            $('#js_discount').hide();
        }
    });
    // 点击layer 关闭弹窗;
    $('#layer').on('click', function() {
        $('#layer').hide();
        $('#js_pay_way').hide();
    });

    // 页面初始化传递参数
    pageInit();

    //页面返回时 input中的值还在 触发跟blur一样的操作
    if ($('#js_mobile').val()) {
        //页面返回时 input中的值还在 触发跟blur一样的操作
        curPhoneNumber = $('#js_mobile').val().substr(0, 3) + $('#js_mobile').val().substr(4, 4) + $('#js_mobile').val().substr(9, 4);
        curMobileLen = $('#js_mobile').val().length;

        // 点击关闭时 触发了失去焦点事件 点击事件与失去焦点事件冲突 
        setTimeout(function() {
            if (isphone()) {
                //手机号码提示
                showMobileTip('', 1);
                //右侧图标变化
                $('#js_input-wrap i').removeClass('active');
                getProductList();
            } else if ($('#js_mobile').val().length) {
                showMobileTip('请输入正确的手机号码', 2);
            }
        }, 300)
    }


    /**
     * 验证手机号码 合格后返回可以充值的流量包
     * 
     */
    function getProductList() {
        $loading.show();
        $.ajax({
            type: 'POST',
            url: API + '/usp2c/api/post.do',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                method: "com.appwl.service.traffic.products",
                partyId: "100011",
                time: "20170522123513",
                v: "1.0",
                userIdentity: curUserIdentity,
                respEncrypt: "0",
                sign: "asdsasssssssss",
                data: {
                    "phoneNumber": curPhoneNumber
                }
            }),
            success(res) {
                $loading.hide();
                if (res.resultCode == '00000') {
                    // 判断输入号码 是否跟url传入号码一致
                    if (curPhoneNumber == urlMobile && isphone()) {
                        showMobileTip(`默认号码`, 1);
                    } else {
                        showMobileTip(`${res.data.province}${res.data.operator}`, 1);
                    }
                    productsData = res.data.packageList;
                    if (res.data.packageList.length == 0) {
                        $('#default-list').hide();
                        $('#js_nopack_tip').html(res.data.errorDesc).show();
                        return;
                    }
                    $('#js_nopack_tip').hide();
                    $('#default-list').hide();
                    $('#charge-list').show();
                    var str = '';
                    res.data.packageList.forEach((item, index) => {
                        var classArr = 'traffic-list';
                        if (item.isRecommend) {
                            classArr += ' recommend';
                        }
                        str += `<div class="${classArr}">
                            <em>${item.packageName}</em> <span>${item.minPrice}元</span>  
                            </div>`
                    })
                    $('#charge-list').html(str).addClass('active').show();
                    $('#charge-list .traffic-list').off('click').on('click', function() {
                        if (!$(this).hasClass('active')) {
                            $('#charge-list .traffic-list').removeClass('active');
                            $(this).addClass('active');
                            //根据流量大小查询打折流量包
                            var index = $(this).index();
                            getDiscountList(index);
                        }
                    });
                } else {
                    $('#default-list').hide();
                    $('#js_nopack_tip').html(res.resultDesc).show();
                }
            },
            error(err) {
                $loading.hide();
                dialog('系统错误，请稍后再试');
            }
        })
    }

    /**
     * 验证手机号是否合法
     * 
     * @returns 
     */
    function isphone() {
        return /^1[34578][0-9]{9}$/.test(curPhoneNumber);
    }

    /**
     * 
     * 
     * @param {any} str 提示的字符串
     * @param {any} type  提示的类型 1->普通 2-》error
     */
    function showMobileTip(str, type) {
        $('#js_mobile_tip').html(str);
        if (type == 1) {
            $('#js_mobile_tip').removeClass('error');
        } else {
            $('#js_mobile_tip').addClass('error');
        }
    }

    /**
     * 显示对应打折列表
     * 生成订单
     *  @param {any} index   点击的产品列表的index
     */
    function getDiscountList(index) {
        var str = '';
        // 显示对应的可购买列表
        productsData[index].productList.forEach((item, index) => {
            var activity = '';
            if (item.activity) {
                activity = `<span>${item.activity}</span>`
            }
            str += `<li class="discount-list">
            <div class="discount-left">
                <p class="prize">${item.price}元${activity}</p>
                <p class="desc"><i>${item.type}</i>${item.desc}</p>
            </div>
            <div class="discount-right">
                <a data-id="${item.prodId}">购买</a>
            </div>
        </li>`
        })
        $('#js_discount').html(str).show();
        $('#js_discount .discount-list .discount-right a').on('click', function() {
            $loading.show();
            curProdId = $(this).data('id');
            $.ajax({
                type: 'POST',
                url: API + '/usp2c/api/post.do',
                dataType: 'json',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    method: "com.appwl.service.traffic.order",
                    partyId: "100011",
                    time: "20170522123513",
                    v: "1.0",
                    userIdentity: curUserIdentity,
                    respEncrypt: "0",
                    sign: "asdsasssssssss",
                    data: {
                        "phoneNumber": curPhoneNumber,
                        "prodId": curProdId,
                    }
                }),
                success(res) {
                    $loading.hide();
                    if (res.resultCode == '00000') {
                        curOrderId = res.data.orderId;
                        $('#layer').show();
                        $('#js_pay_way').show();
                        payOrder();
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
                        "orderId": curOrderId,
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

    /**
     * 页面初始化时
     * 
     */
    function pageInit() {
        let userId = getUrlParam('userId');
        let mobile = getUrlParam('mobile');
        let clietLable = getUrlParam('clientLable');
        let clientType = getUrlParam('clientType');
        let clientVer = getUrlParam('clientVer');
        let clientOS = getUrlParam('clientOS');
        let clientModel = getUrlParam('clientModel');
        let clientNet = getUrlParam('clientNet');
        let userIdentity = '';
        if (userId) {
            userIdentity = userId;
            window.localStorage.setItem('useridentity', userIdentity);
        } else if (clietLable) {
            userIdentity = clietLable;
            window.localStorage.setItem('useridentity', userIdentity);
        }
        curUserIdentity = window.localStorage.getItem('useridentity');
        $.ajax({
            type: 'POST',
            url: API + '/usp2c/api/post.do',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                "method": "com.appwl.service.init",
                "partyId": "100011",
                "time": "20170522123513999",
                "v": "1.0",
                "userIdentity": curUserIdentity,
                "respEncrypt": "0",
                "sign": "asdsasssssssss",
                "data": {
                    "userId": userId,
                    "mobile": mobile,
                    "clientLable": clietLable,
                    "clientType": clientType,
                    "clientVer": clientVer,
                    "clientOS": clientOS,
                    "clientModel": clientModel,
                    "clientNet": clientNet
                }
            }),
            success(res) {
                if (res.resultCode == '00000') {
                    // 填写默认号码
                    if (/^1[34578][0-9]{9}$/.test(mobile)) {
                        $('#js_mobile').val(mobile.substr(0, 3) + ' ' + mobile.substr(3, 4) + ' ' + mobile.substr(7, 4));
                        curPhoneNumber = $('#js_mobile').val().substr(0, 3) + $('#js_mobile').val().substr(4, 4) + $('#js_mobile').val().substr(9, 4);
                        curMobileLen = $('#js_mobile').val().length;
                        showMobileTip('默认号码', 1)
                        getProductList();
                    }
                } else {
                    // dialog(res.resultDesc);
                }
            },
            error(err) {
                // dialog('系统错误，请稍后再试');
            }
        });
    }

});