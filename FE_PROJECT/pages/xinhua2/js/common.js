import $ from 'webpack-zepto';
let FastClick = require('./fastclick.js');


export default function common(){
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }

    // 扩展css动画
    $.fn.animateCss = function(animationName){
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }

    // 绑定点击效果
    $('body').on('touchstart','button',function(){
        let that = $(this);
        that.addClass('active');
        setTimeout(function(){
            that.removeClass('active');
        },300)
    })


    // 跑马灯
    let $light = $('#j_light');
    let $lightWeak = $('#j_light_weak');
    let state = false;

    setInterval(function(){
        state = !state;
        $light.css('display', state ? 'block' : 'none');
        $lightWeak.css('display', state ? 'none' : 'block');
    },100)

}