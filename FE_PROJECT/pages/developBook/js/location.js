import '@common/css/reset.less';
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {} else {
    devTool();
}
$(function() {
    function success(position) {
        console.log('获取位置成功' + position.coords);
        alert(position.coords.latitude + 'latitude');
        alert(position.coords.longitude + 'longitude');
        alert(position.coords.accuracy + 'accuracy');
    }

    function error(error) {
        console.log('获取位置失败', error.code, error.message);
        alert(error.message);
    }
    let option = {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 0
    }
    if (navigator.geolocation) {
        // navigator.geolocation.getCurrentPosition(success, error, option);

        //var watchId = navigator.geolocation.watchPosition(success, error, option); //持续监听
        //navigator.geolocation.clearWatch(watchId); //取消监听
    } else {
        alert('您的浏览器不支持geolocation！');
    }

});