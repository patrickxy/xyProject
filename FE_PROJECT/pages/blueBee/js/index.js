import $ from 'webpack-zepto';
import Weixin from './util/weixin.js';
import '../css/index.less';

$(function(){
    let signFlag = false;
    let loading = $('.loading');
   
    Weixin();

    // 监听微信签名成功
    $(document)
    .on('signSuccess',function(){
        signFlag = true;
        if(!loading.hasClass('hide')){
            hideLoading();
        }
    })
    .on('shareSuccess',function(){
        showLoading('分享成功，页面跳转中')
    });

    // 关闭弹窗
    $('body')
    .on('click','.share-mask',function(){
        $('.share-mask').addClass('hide');
        $('.btn-share').removeClass('hide');
    })
    .on('click','.btn-share', function(){
        // 提示用户去分享
        if(signFlag){
            return showShare();
        }
        showLoading();
    })

    function showShare(){
        $('.share-mask').removeClass('hide');
        $('.btn-share').addClass('hide');
    }

    function showLoading(txt){
        $('.share-mask').addClass('hide');
        loading.removeClass('hide').find('p').text(txt || '点赞处理中，请稍等');
    }
    function hideLoading(){
        loading.addClass('hide');
        showShare();
    }

    
})