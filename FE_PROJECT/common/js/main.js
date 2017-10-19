import $ from 'webpack-zepto';
let FastClick = require('./fastclick.js');

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

// 扩展css动画
$.fn.animateCss = function(animationName, cb){
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.css('willChange','transform');
    this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName).css('willChange','auto');
        cb && cb();
    });
}

let $mask = $('#mask');
let $model = $('#model');
let $failModel = $('#j_fail_model'); 

$('#j_back,#mask').click(function(){
    closeModel();
})

// 获取url参数
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    let r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null;
}

// 弹窗
function openModel(type,failMsg){
    $mask.add($model).hide();
    $mask.show();
    if(type === 'fail' && failMsg){
        $model.find('.fail_model__content').text(failMsg);
    }
    $model.attr('state', type).show().animateCss('fadeInUp');
}

function disabledModel(str){
    $('body').addClass('disabled');
    $failModel.find('p').text(str ||　'非法请求!');
    openModel('fail');
}


function closeModel(){
    $mask.hide();
    $model.attr('state', '').animateCss('fadeOutDown',function(){
        $model.hide();
    });
}

export {
    getUrlParam,
    openModel,
    closeModel,
    disabledModel,
}

