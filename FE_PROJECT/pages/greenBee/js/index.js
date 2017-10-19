import $ from 'webpack-zepto';
import Weixin from './util/weixin.js';
import '../css/index.less';

$(function(){
   
    Weixin();
    
    // 关闭弹窗
    $('body')
    .on('click','.share-mask',function(){
        $('.share-mask').addClass('hide');
        $('.btn-share').removeClass('hide');
    })
    .on('click','.btn-share', function(){
        // 提示用户去分享
        showShare();
    })

    function showShare(){
        $('.share-mask').removeClass('hide');
        $('.btn-share').addClass('hide');
    }
    
})