// 全部和用户相关的配置js
import $ from 'webpack-zepto';
let data  = window.CUSTOM_DATA;
let ua = window.navigator.userAgent.toLowerCase();

// 微信浏览器才会加载sdk.js
// if(ua.match(/MicroMessenger/i)){
//     require.ensure([], function(require) {
//         let Weixin = require('./weixin')['default']
//         Weixin();
//     })
// }


if(NODE_ENV === 'dev'){

    data = {
        aid: 'Ujuimi',
        page: 'index',
        shareCircle: '1',
        shareFriends: '1',
        shareUrl: '${data.shareUrl}',
        actiImg: '${data.actiImg}',
        actiTitle: '${data.actiTitle}',
        shareUrl: '${data.shareUrl}',
        fimgUrl: '${data.poster.fimgUrl}',
        poster: '{"button":"0","fimg":"0","title":"将海报分享到朋友圈并获得手机流量","bimg":"522","desc":"分享送流量具有裂变式的广告效果，能达到病毒式传播，让广告迅速占领朋友圈"}',  
        buttonUrl: '${data.poster.buttonUrl}', 
        basicData: '{"code":1,"data":{"isMessageValidate":1,"endDate":"2017.4.30","bannerImgUrl":"fileupload/1492760676332.jpg","actiLogoImgUrl":"","isPoster":1,"isPicValidate":1,"threshold":"","remindFlag":0,"actiModelId":2,"drawWay":0,"isOpenGPS":1,"oldUserDateFlag":"2017-04-20","isLimitPosi":0,"actiTitle":"gg","actiImg":"fileupload/1492760672685.jpg","ruleDesc":"办有流量套餐,符合商家规则","appId":"wx0f5990b7dc23fa76","cosRemind":"0","componentAppId":"wx8a62e7b275d9d03e","bannerImg":"521","thresholdType":"0","traffic":"20-30","orcodeImgUrl":"fileupload/1492691628513.png","shareCircle":1,"jointype":0,"subscribe":1,"stores":"","cosRemindder":"","endDateTime":"23:59:59","custName":"thx2","useStore":0,"startDateTime":"06:00:00","shareUrl":"a/JVR7Nv","shareFriends":1,"startDate":"2017.4.20","lngLatPointsRange":""}}',
    }
}




export default data;