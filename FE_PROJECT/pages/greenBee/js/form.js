import $ from 'webpack-zepto';
import CUSTOM_DATA from './util/custom.js';
import { getUrlParam } from './util/util.js';
import Weixin from './util/weixin.js';
import '../css/form.less';

// 是否出现验证码，可以配置


$(function(){
    let form = $('.form')[0];
    let timer = null;
    let endTime = 60;
    let isMessageValidate = false;
    let isPicValidate = false;
    let currentRequest = null

    Weixin();
    

    try {
        let basicData = CUSTOM_DATA.basicData;
        basicData = typeof basicData === 'object' ? basicData : JSON.parse(basicData);
        if(NODE_ENV !== 'dev'){
            $('.j_custom_bg').css('background-image', `url(/"${basicData.data.shareUrl}")`) 
        }

        // 设置背景图
        $('.j_custom_bg').css('backgroundImage',`url(/"${basicData.data.bannerImgUrl}")`);


        if(basicData.data.isMessageValidate){
            $('#j_code_wrap').removeClass('hide');
            isMessageValidate = true;
        }else{
             $('#j_code_wrap').remove();
        }
    
    } catch (error) {
        console.log(error);
    }

    try {
        let basicData = CUSTOM_DATA.basicData;
        basicData = typeof basicData === 'object' ? basicData : JSON.parse(basicData);
        if(basicData.data.isPicValidate){
            $('#j_captcha_wrap').removeClass('hide');
            isPicValidate = true;
        }else{
             $('#j_captcha_wrap').remove();
        }
    
    } catch (error) {
        console.log(error);
    }


    // 如果活动日期无效 endDate
    // try {

    //     let basicData = CUSTOM_DATA.basicData;
    //     basicData = typeof basicData === 'object' ? basicData : JSON.parse(basicData);
            
    //     if(new Date(basicData.data.startDate).getTime() > new Date()){
    //         return showPopup('亲,活动尚未开始哦!');
    //     }else if(new Date(basicData.data.endDate).getTime() < new Date()){
    //         return showPopup('亲,活动已经结束哦!');
    //     }
    // } catch (error) {
    //     console.error('判断活动生效日期错误:', error)
    // }





    form.aid.value = CUSTOM_DATA.aid;
    form.wxid.value = getUrlParam('wxid');

    $('body')
    .on('click','#j_sendCode',function(){
        let that = $(this);

        if(!isphone()){
            return alert('请输入手机号码')
        }

        that.addClass('disabled loading');

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
                    that.removeClass('disabled loading');
                    alert(res.message);
                }
                
            },
            error: function(err){
                console.error('获取验证码失败:', err)
                that.removeClass('disabled loading');
                alert('获取验证码失败');
            }
        })

    })
    .on('click','#j_submit',function(){
        let that = $(this);
        
        if(!isphone()){
            return alert('请输入手机号码')
        }
        if(isPicValidate && !iscaptcha()){
            return alert('请输入图形验证码')
        }
        if(isMessageValidate && !iscode()){
            return alert('请输入手机验证码')
        }
        if(!isagree()){
            return alert('您没有同意条款')
        }

        that.addClass('disabled loading');

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
    .on('input','#phone',function(){
        // 查询中奖记录
        if(isphone()){
            getPackage();
        }else{
            $('#result').val('获取中')
        }
    })
    .on('click','.btn-confirm',function(){
        $('.model-wrap').addClass('hide');
        $('.form').removeClass('hide');
    })

    getCaptcha();
    getPackage();


    function submitForm(){
        let that = $('#j_submit');
    
        $.ajax({
            url: API+'/actishare/play.do',
            type: 'post',
            data: $('form').serializeArray(),
            success: function(res){
                if(res.code !== 1){
                    that.removeClass('disabled loading');
                    alert(res.message);
                    getCaptcha();
                }else{
                    that.removeClass('loading');
                    form.reset();
                    alert(res.message);
                    window.location.href = '/a/'+CUSTOM_DATA.aid;
                }
                
            },
            error: function(err){
                console.error('兑奖失败:', err);
                that.removeClass('disabled loading');
                getCaptcha();
                alert('兑奖失败');
            }
        })
    }

    function getPackage(){

        currentRequest && currentRequest.abort();

        currentRequest = $.ajax({
            url: API+'/activity/getTraffic.do',
            type: 'post',
            data: {
                mobile: form.mobile.value,
                aid: form.aid.value,
            },
            success: function(res){
                if(res.code === 1){
                    return $('#result').val(res.data+'M')
                }
                console.error('获取流量包失败:', res.message);
            },
            error: function(err){
                console.error('获取流量包失败:', err)
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
        $('#captcha_img').attr('src',API+'/web/system/securitycodeimage/createCode.do?'+Math.random());
    }

    function showPopup(content){
        $('.model-wrap').removeClass('hide');
        $('.form').addClass('hide');
        $('.popup-content').html(content);
    } 
})