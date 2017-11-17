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
    // window.addEventListener('deviceorientation', orientationHandle, true);

    // function orientationHandle(evt) {
    //console.log(evt);/
    // }
    // 移动事件 devicemotion 
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', motionHandle, false);
    }
    var SHARE_SPEED_THRESHOLD = 300; //摇动速度阈值
    var lastTime = 0; //上次变化的时间

    let x = 0,
        y = 0,
        z = 0,
        lastX = 0,
        lastY = 0,
        lastZ = 0;
    console.log(test1);

    function motionHandle(event) {
        var acceleration = event.accelerationIncludingGravity;

        let nowTime = new Date();
        if ((nowTime - lastTime) > 120) { //大于120ms
            let diffTime = nowTime - lastTime; //时间差 用于求速度
            lastTime = nowTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 1000; //1s的速度
            if (speed > SHARE_SPEED_THRESHOLD) {
                alert('您摇动了手机！')
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        }
    }
});