import $ from 'webpack-zepto';
import {
    getUrlParam,
    openModel,
    disabledModel,
    closeModel,
} from 'common_js';

import 'common_css';
import '../css/index.less';
console.log(env)
$(function(){

    let isClick = false; // 点击事件锁定
    let aid = getUrlParam('aid');
    let playCode = getUrlParam('code');
    let $body = $('body');
    let $li = $('li');
    let $logoRadios = $('.logo-radios');
    let $nameRadios = $('.name-radios');
    let $callbackPage = $('.callback-page');
    let $mainPage = $('.mainpage');
    let ls = window.localStorage;
    const PATH = env.api_path;

    // 拒绝用户参与
    if(playCode && playCode!=1){
        return disabledModel();
    }

    // 写入aid
    $('#j_aid').val(aid);


    // 选中投票项目
    $body.on('click','li',function(){
        $(this).toggleClass('checked');
    })

    // 获取投票项目
    function getField(){
        let form = new FormData();
        $li.filter('.checked').forEach(item=>{
            let val = $(item).attr('name');
            form.append(val,val);
        })
        return form;
    }

    // 判断是否当天
    function isToday(str){
        return (new Date().toDateString() === new Date( Number(str) ).toDateString());
    }


    // 提交表单
    ;(function(){

         $('#j_send').on('click',function(){

            // 每天只能投票一次
            if(isToday(ls.sendTime)){
                return openModel('fail','投票失败:一天只能投一次');
            }                 

            if(!$li.filter('.checked').length){
                return openModel('fail','请对作品投票')
            }

            recharge(getField());

        })

        function recharge(data){
            if(isClick) return;
            isClick = true;
            $.ajax({
                url: PATH+'/xinhua/volte.do',
                data,
                processData: false,
                contentType: false,
                type: 'POST',
                success(res) {},
                error(err) {},
                complete() {
                    $mainPage.hide();
                    $callbackPage.show();
                    isClick = false;
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    $body.addClass('show-page2');
                    $('#longtap').show()
                    ls.setItem('sendTime',new Date().getTime());
                }
            })
        }

    }())




    $('#j_back,#mask').click(function(){
        closeModel();
    })



})
