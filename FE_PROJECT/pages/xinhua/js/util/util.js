import $ from 'webpack-zepto';
var $mask = $('#mask');
var $model = $('#model');
var $failModel = $('#j_fail_model'); 



// 获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null;
}

// 弹窗
function openModel(type){
    $mask.add($model).hide();
    $mask.show();
    $model.attr('state', type).show().animateCss('fadeInUp');
}

function disabledModel(){
    $('body').addClass('disabled');
    $failModel.find('p').text('非法请求!');

    openModel('fail');
}


function closeModel(){
    $mask.hide();
    $model.attr('state', '').animateCss('fadeOutDown');
    setTimeout(function(){
        $model.hide().removeClass('animated fadeOutDown');
    },1000);
}

// 验证表单
function isPhone(num){
    return /^1[345678][0-9]{9}$/.test(num);
}

function isCode(num){
    return /^[0-9]{4,6}$/.test(num);
}

export {
    getUrlParam,
    openModel,
    closeModel,
    disabledModel,
    isCode,
    isPhone,
}

