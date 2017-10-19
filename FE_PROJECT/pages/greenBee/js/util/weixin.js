import $ from 'webpack-zepto';
import wx from 'weixin-js-sdk'
import CUSTOM_DATA from './custom.js';
import { getUrlParam } from './util.js';


export default function weixin(){

    // 非微信浏览器则不应用
    // let ua = window.navigator.userAgent.toLowerCase();
    // if(!ua.match(/MicroMessenger/i)) return;

    let isShared = false;

    let jsApiList = [
        'hideOptionMenu','showOptionMenu','getLocation',
        'hideMenuItems','onMenuShareTimeline','onMenuShareAppMessage'
    ]; 

     let menuList = [
        'menuItem:favorite',
        'menuItem:copyUrl',
        'menuItem:openWithQQBrowser',
        'menuItem:openWithSafari', 
        'menuItem:share:QZone', 
        'menuItem:share:qq', 
        'menuItem:share:email'
    ];


    let basicData ={};
    let poster = {};

    try {
        basicData = CUSTOM_DATA.basicData ? JSON.parse(CUSTOM_DATA.basicData) : {};
        poster = CUSTOM_DATA.poster ? JSON.parse(CUSTOM_DATA.poster) : {};
    } catch (error) {
        console.error('读取配置项失败', error)
        basicData ={data: {}};
        poster = {};
    }


    // 按照页面不同配置分享
    if(CUSTOM_DATA.page !== 'index'){
        CUSTOM_DATA.actiTitle = basicData.data.actiTitle;
        CUSTOM_DATA.shareUrl = '/' + basicData.data.shareUrl;
        CUSTOM_DATA.shareImg = '/' + basicData.data.shareImg;
        CUSTOM_DATA.isMessageValidate = basicData.data.isMessageValidate;
        CUSTOM_DATA.isPicValidate = basicData.data.isPicValidate;
    }

    // 海报页面分享标题为poster.title
    if(CUSTOM_DATA.page === 'index'){
        CUSTOM_DATA.actiTitle = poster.title;
    }


    // 分享回调配置
    let shareImg = CUSTOM_DATA.actiImg || '';
    let shareOptions = {
        title: CUSTOM_DATA.actiTitle, // 分享标题
        link: CUSTOM_DATA.shareUrl, // 分享链接
        desc: poster.desc, // 分享副标题
        imgUrl: shareImg ? ('http://'+window.location.host + shareImg) : '', // 分享图标
        success: function () {

            // 只允许成功分享一次
            if(isShared) return;
            isShared = true;

            let urlPrefix = API+'/activity/posterToActivitPage.do?';
            let query = {
                aid: CUSTOM_DATA.aid,
                wxid: getUrlParam('wxid')
                // isPreview: query['isPreview'] == 'true',
            };

            // 跳转页面
            window.location.href = urlPrefix + $.param(query); 
   
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log('用户取消分享')
        }
    }


    // 获取签名
    $.ajax({
        url: API+'/activity/getWxJsConfig.do?time='+new Date(),
        method: "POST",
        data: {
            'aid': CUSTOM_DATA.aid, 
            'url': location.href.split('#').pop()
        },
        dataType:'json',
        success(res) {
            if(res.code == 1){
                init(res.data)
            }
        },
        error(err) {
            console.error('获取签名失败:', err)
        }
    })


    // 初始化微信
    function init(config){
        wx.config({
            debug: NODE_ENV === 'dev' ? true : false, 
            appId: config.appId, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature,// 必填，签名，见附录1
            jsApiList: jsApiList, 
        });

        wx.ready(function() {
            if(CUSTOM_DATA.page === 'focus'){
                menuList.push('menuItem:share:appMessage');
                menuList.push('menuItem:share:timeline');
            }

            wx.hideMenuItems({menuList: menuList}); 

            // 分享到朋友圈
            CUSTOM_DATA.shareCircle && wx.onMenuShareTimeline(shareOptions);

            // 分享给朋友
            CUSTOM_DATA.shareFriends && wx.onMenuShareAppMessage(shareOptions);

        })
    }


}