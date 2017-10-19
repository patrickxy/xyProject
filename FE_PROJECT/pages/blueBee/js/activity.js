import $ from 'webpack-zepto';
import { getUrlParam } from './util/util.js';
import { 
    isMessageValidate,
    isPicValidate,
    config, 
} from './util/custom.js';
import Weixin from './util/weixin.js';
import '../css/activity.less';

// 是否出现验证码，可以配置

const CUSTOM_DATA = window.CUSTOM_DATA;

$(function(){
    let form = $('.form')[0];
    let timer = null;
    let endTime = 60;
    let currentRequest = null;
    let getCaptchaWrap = $('#j_getCaptcha');

    Weixin();

    // 错误提示
    var errorTip = $('.model-wrap');

    function showError(type, txt){
        errorTip.attr('state', type).show().find('p').html(txt);
    }
    function hideError(){
        errorTip.hide();
    }

    $('.btn-close').click(function(){
        hideError();
        if(errorTip.attr('state') === 'success'){
            window.location.href = '/a/' + CUSTOM_DATA.aid;
        }
    })

    form.aid.value = CUSTOM_DATA.aid;
    form.wxid.value = getUrlParam('wxid');

    $('body')
    .on('click','#j_sendCode',function(){
        let that = $(this);

        if(!$('#phone').val().length){
            return showError('fail', '请输入手机号码')
        }
        if(!isphone()){
            return showError('fail', '请输入正确的手机号码')
        }

        that.addClass('disabled');

        $.ajax({
            url: API+'/actishare/getSMSCode.do',
            type: 'get',
            data: {
                mobile: $('#phone').val(),
                aid: CUSTOM_DATA.aid
            },
            success: function(res){
                if(res.code === 1){
                    timeLess();
                    form.smskey.value = res.smskey;
                }else{
                    that.removeClass('disabled');
                    showError('fail', res.message);
                }
                
            },
            error: function(err){
                console.error('获取验证码失败:', err)
                that.removeClass('disabled');
                showError('fail', '获取验证码失败');
            }
        })

    })
    .on('click','#j_submit',function(){
        let that = $(this);
        if(!$('#phone').val().length){
            return showError('fail', '请输入手机号码')
        }
        if(!isphone()){
            return showError('fail', '请输入正确的手机号码')
        }
        if(isPicValidate && !iscaptcha()){
            return showError('fail', '请输入图形验证码')
        }
        if(isMessageValidate && !iscode()){
            return showError('fail', '请输入手机验证码')
        }
        if(!isagree()){
            return showError('fail', '您没有同意条款')
        }

        that.addClass('disabled');
        submitForm();

    })
    .on('click','#j_showPaper',function(){
        $('.rules').removeClass('hide');
    })
    .on('click','#protocol-back',function(){
        $('.rules').addClass('hide');
    })
    .on('click','#j_getCaptcha',function(){
        // 图形验证码
        getCaptcha();
    })
    .on('click','.btn-confirm',function(){
        $('.model-wrap').addClass('hide');
        $('.form').removeClass('hide');
    })

    getCaptcha();

    function submitForm(){
        let that = $('#j_submit');
    
        $.ajax({
            url: API+'/actishare/play.do',
            type: 'post',
            data: $('form').serializeArray(),
            success: function(res){
                if(res.code !== 1){
                    that.removeClass('disabled');
                    showError('fail', res.message);
                    getCaptcha();
                }else{
                    form.reset();
                    showError('success', res.message);
                }
                
            },
            error: function(err){
                console.error('兑奖失败:', err);
                that.removeClass('disabled');
                getCaptcha();
                showError('fail', '兑奖失败');
            }
        })
    }

    function timeLess(){
        var that = $('#j_sendCode');

        clearInterval(timer);

        timer = setInterval(_=>{
            if(endTime <= 1){
                clearInterval(timer);
                that.text('获取验证码');
                that.removeClass('disabled');
                endTime = 60;
                return false;
            }
            endTime--;
            that.text(endTime+'s后可重发');
        },1000)
    }

    function isphone(){
        return /^1[34578][0-9]{9}$/.test($('#phone').val())
    }
    function iscode(){
        return $('#code').val().length
    }
    function iscaptcha(){
        return $('#captcha').val().length
    }
    function isagree(){
        return $('#agree').prop('checked')
    }
    
    function getCaptcha(){
        // 验证码请求独占，在一个验证码返回前，不能再次请求
        let img = new Image();
        let src = API+'/web/system/securitycodeimage/createCode.do?aid='+CUSTOM_DATA.aid+'&'+Math.random();
        getCaptchaWrap.addClass('disabled');
        getCaptchaWrap.find('img').removeAttr('src');
        img.onload = function(){
            $('#captcha_img').attr('src', src);
            getCaptchaWrap.removeClass('disabled');
        }
        img.onerror = function(){
            getCaptchaWrap.removeClass('disabled');
        }
        img.src = src;
    }

    function showPopup(content){
        $('.model-wrap').removeClass('hide');
        $('.form').addClass('hide');
        $('.popup-content').html(content);
    } 


    let url = window.location.href;
    let urlrepleat = '111111111111111111111111111111111111111111';
    // 禁止用户返回上一页面
    if (!!(window.history && history.pushState)){
        urlrepleat.split('').forEach(function(element) {
            history.pushState({url: url+'#'}, "", '#');
        });
    }

})