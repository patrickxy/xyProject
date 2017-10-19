import $ from 'webpack-zepto';
import common from './util/common.js';
import replace from './util/replace';
import {
    getUrlParam,
    openModel,
    disabledModel,
    closeModel,
    isPhone,
    isCode,
} from './util/util.js';
import '../css/index.less';

$(function(){

    common();

    var isClick = false; // 点击事件锁定
    var aid = getUrlParam('aid');
    var playCode = getUrlParam('code');
    const PATH = $('body').attr('path') || '';

    // 拒绝用户参与
    if(playCode && playCode!=1){
        return disabledModel();
    }

    // 写入aid
    $('#j_aid').val(aid);


    // 点击开始转盘
    ;(function(){
        var $point = $('#j_point');
        var $rotate = $('#j_rotate');
        var $score = $('.j_score');
        var rotateTime = 5000; // 旋转转盘用时
        var rotateList = {};

        [5,10,20,50,100,200].map(function(item,index){
            var deg  = 3660-index*60;
            rotateList[item] = {
                '-webkit-transform':'rotate('+deg+'deg)',
                'transform':'rotate('+deg+'deg)',   
            };
        });

        rotateList['pre'] = {
            '-webkit-transform':'rotate(300deg)',
            'transform':'rotate(300deg)',   
        };
        rotateList['reset'] = {
            '-webkit-transform':'rotate(0deg)',
            'transform':'rotate(0deg)',   
        };

        $point.click(function(){
            
            if(isClick) return;
            isClick = true;

            resetPlay();
            
            // 弹窗有3种状态 got展示获取到的流量 input填写手机号 fail操作失败
            setTimeout(function(){
                prePlay();
                // faker();
                play();
            },1)

            
        })

        function prePlay(){
            $rotate.addClass('move').css(rotateList['pre']);
        }

        function resetPlay(){
            $rotate.removeClass('move').css(rotateList['reset']);
        }

        function faker(){
            setTimeout(function(){
                var score = 100; // 转到的流量数
                $rotate.addClass('move').css(rotateList[score]);
                $score.text(score+'M');

                setTimeout(function(){
                    openModel('got');
                    isClick = false;
                },rotateTime)

            },1000)
        }

        function play(){
          $.ajax({
            type: 'POST',
            dataType : 'json',
            url: PATH+'/xinhua/play.do',
            data: {aid},
            success: function(res){
              if(res.code !== 1){
                  isClick = false;
                  return openModel('fail');
              }
              var score = res.data.traffic; // 转到的流量数
              $rotate.addClass('move').css(rotateList[score]);
              $score.text(score+'M');

              setTimeout(function(){
                  openModel('got');
                  isClick = false;
              },rotateTime)
            },
            error: function(res){
              resetPlay();
              isClick = false;
              openModel('fail');
            }
          })

        }

    }())


    // 点击立即领取流量
    ;(function(){
        var $getLucky = $('#j_get');

        $getLucky.click(function(){
            if(isClick) return;
            isClick = true;
            openModel('input');
        })

    }())


    // 图形验证码
    ;(function(){
        var $verifyImg = $('#j_verifyImg');
        var src = PATH+'/web/system/securitycodeimage/createCode.do';
        $verifyImg.click(function(){
          this.src = src+'?'+Math.random();
        })
    }())


    // 提交表单
    ;(function(){
        var $mobile = $('#j_phone');
        var $code = $('#j_code');

         $('#j_send').on('click',function(e){

            e.preventDefault();
  
            // 验证手机号
            if(!isPhone($mobile.val())){
                return alert('错误的手机号码');
            }
      
            // 验证短信验证码
            if(!isCode($code.val())){
                return alert('错误的验证码');
            }

            recharge($form.serialize());

        })

        function recharge(data){
            if(isClick) return;
            isClick = true;
            $.post(PATH+'/xinhua/recharge.do',data,function(res){
                if(res.code !== 1){
                    return openModel('fail');
                }
                alert('流量充值成功')
                isClick = false;
            },function(err){
                isClick = false;
                openModel('fail');
            })
        }

    }())




    $('#j_back,#mask').click(function(){
        closeModel();
    })



})
