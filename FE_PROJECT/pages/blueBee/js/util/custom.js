// 全部和用户相关的配置js
import $ from 'webpack-zepto';
import { getUrlParam } from './util.js';
// 背景图加载完毕后，页面开始展示,本地图片需要先require进来
require('../../images/popup_title_fail.png');
require('../../images/popup_bg_fail.png');
require('../../images/popup_title_success.png');
require('../../images/popup_bg_success.png');

let isMessageValidate = false;
let isPicValidate = false;
let config = {};

try {
    config = JSON.parse(window.CUSTOM_DATA.basicData).data;
} catch (error) {
    config = {};
}

isMessageValidate = config.isMessageValidate && getUrlParam('useSMS') === 'true';
isPicValidate = config.isPicValidate;

isMessageValidate ? $('#j_code_wrap').removeClass('hide') : $('#j_code_wrap').remove();
isPicValidate ? $('#j_captcha_wrap').removeClass('hide') : $('#j_captcha_wrap').remove();


let dpr = $('html').data('dpr');
let pageHeight = Math.ceil($('.page').height()/dpr);
let screenHeight = window.screen.height;
// 有图形、手机验证码时，高度增加
if(pageHeight <= screenHeight-64){
    $('.footer-notice').add($('body')).addClass('fixed');
}



loadImage();

function loadImage(){
    let loadTime = new Date().getTime();
    let allImages = [
        {dom: '.j_custom_bg',src: '/'+config.bannerImgUrl},
        {dom: '',src: 'images/popup_title_fail.png'},
        {dom: '',src: 'images/popup_bg_fail.png'},
        {dom: '',src: 'images/popup_title_success.png'},
        {dom: '',src: 'images/popup_bg_success.png'},
        {dom: '',src: 'images/bg_b.png'},
    ];    

    let imagesSize = allImages.length;
    let lessSize = imagesSize;
    let loadingNotice = $('.loading-inner p');

    function loadImage(imgObj){
        let img = new Image();
        let timer = null;
        timer = setInterval(()=>{
            if(img.width || img.height){
                --lessSize;
                if(!lessSize){
                    $(document).trigger('allImagesLoad');
                }
                imgObj.dom && $(imgObj.dom).css('backgroundImage',`url(${imgObj.src})`);
                clearInterval(timer);
            }
        },10);
        img.onerror = function(){
            --lessSize;
            showProcess(lessSize);
            if(!lessSize){
                $(document).trigger('allImagesLoad');
            }
            img.onerror = img.onload = null;
        }
        img.onload = function(){
            showProcess(lessSize);
            img.onerror = img.onload = null;
        }
        img.src = imgObj.src;
    }



    function showProcess(lessSize){
        let percent = Math.ceil(((imagesSize-lessSize)/imagesSize) * 100);
        loadingNotice.text(`稍等,加载 ${percent}%`)
    }

    allImages.forEach((val, index)=>{
        loadImage(val)
    })

    $(document).on('allImagesLoad',()=>{
        let distance = 1000 - (new Date().getTime() - loadTime);
        $('body').addClass('loaded');
        loadingNotice.text(`稍等,加载 100%`)
        setTimeout(function(){
            $('.loading').addClass('fadeOut');
            setTimeout(function(){
                $('.loading').hide();
            },1000)
        },distance < 0 ? 0 : distance)


    });


}

export {
    isMessageValidate,
    isPicValidate,
    config,
}
