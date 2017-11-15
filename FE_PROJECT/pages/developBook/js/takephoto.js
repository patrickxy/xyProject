import '@common/css/reset.less';
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {} else {
    devTool();
}
$(function() {
    // 摇一摇功能
    // 访问传感器的API 
    // 方向事件 deviceorientation
    window.addEventListener('deviceorientation', orientationHandle, true);

    function orientationHandle(evt) {
        //console.log(evt);/
    }
    // 移动事件 devicemotion 
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', motionHandle, false);
    }


    function motionHandle(event) {
        var acceleration = event.accelerationIncludingGravity;
        console.log(acceleration.x);
        console.log(acceleration.y);
        console.log(acceleration.z);
    }
});