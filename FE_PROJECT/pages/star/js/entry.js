import $ from 'webpack-zepto';
import {
    getUrlParam,
} from 'common_js';

import 'common_css';
import '../css/index.less';

// 卫星名称释义

const STAR_NAME = {
    Name1: {
        name: '凤舞',
        detail: '在东西方文化中,凤鸟都是涅盘重生的神鸟,正如恒星在爆炸中涅盘而生的黑洞、中子星等神奇致密天体。观测这些天体的爆发活动就像欣赏凤舞九天的壮丽奇景。HXMT卫星将在太空搜寻并见证原来仅存在于神话奇幻中的图景。'
    },
    Name2: {
        name: '天巡',
        detail: '“天”,既代表空间项目,又直接表明研究对象是天体和宇宙；“巡”,HXMT的核心科学目标之一是通过巡天扫描发现新的X射线源,“巡”字也描绘了HXMT围绕地球飞行的姿态。'
    },
    Name3: {
        name: '星海',
        detail: '表示在茫茫无边的宇宙星海中,用X射线来观测寻找新喷发X射线的黑洞和中子星。'
    },
    Name4: {
        name: '慧眼',
        detail: 'HXMT卫星如同慧眼,能穿过星际物质的遮挡发现黑洞,也表示HXMT是科学家利用智慧打造的观天利器。'
    },
    Name5: {
        name: '仙女',
        detail: 'HXMT主要研究的是X射线天文,观测的是美丽的银河系,任务神圣而唯美。X在生物学上可理解为女性。HXMT美如飘在太空中的仙女,并具有非凡的能力,为了给予HXMT美好的祝愿,起名仙女号,英文Fairy。'
    },
    Name6: {
        name: '天镜',
        detail: '天镜,在古代比喻监察天下的能力,恢而不漏,与HXMT巡天模式及天体探测能力相呼应。同时,天镜中“天”体现空间探测能力,与巡天相对；“镜”表明HXMT实际上就是天文望远镜。'
    },
    Name7: {
        name: '硬X射线调制望远镜卫星工程简介',
        detail: `
            <section>
                <p>硬X射线调制望远镜（Hard X-ray Modulation Telescope，简称HXMT）卫星是我国首颗X射线天文卫星，是基于我国学者上世纪九十年代末提出的直接解调成像方法所设计的，具有1-250keV的宽谱段、几百到几千平方厘米的大有效面积以及几度的大视场，黑洞和中子星是其主要观测目标。该卫星将主要开展以下科学研究：</p>
            </section>

            <section>
                <ol>
                    <li>（1）对银河系进行扫描巡天监视，通过捕捉银河系内黑洞和中子星吸引其周围物质的过程中产生的X射线的变化，发现新的黑洞和中子星；</li>
                    <li>（2）通过HXMT指向其巡天发现或者已知的黑洞和中子星进行详细的观测，理解地球实验室中无法研究的宇宙极端条件下的物理规律；</li>
                    <li>（3）利用其扩展到300keV-3MeV能段的伽马射线暴探测能力，研究宇宙深处大质量恒星的死亡以及中子星并合等过程中黑洞的形成。</li>
                </ol>
            </section>
        `,
    }
};


$(function(){
    if(NODE_ENV === 'dev'){

        console.log('页面初始字体: '+$('html').css('fontSize'))
        console.log('页面实际大小: '+window.innerWidth)

    }


    let isClick = false; // 点击事件锁定
    let $body = $('body');
    let $li = $('.radios>li');
    let $callbackPage = $('.callback-page');
    let $mainPage = $('.mainpage');
    let $mask = $('#mask');
    let $model = $('#j_model_desc');
    let $modelShort = $('#j_model_desc_short');
    let $modelShortWrap = $('.model-desc-short__wrap');
    let $modelTitle = $('.model-desc__title');
    let $modelInner =  $('.model-desc__inner');
    let ls = window.localStorage;
    const PATH = API;

    // 选中投票项目
    $body
    .on('click','.radios>li',function(){
        $(this).toggleClass('checked');
    })

    $('.j_show_detail').on('click',function(e){
        // 展开查看更多
        e.stopPropagation();
        let name = $(this).attr('name');
        $modelTitle.attr('name',name);
        $modelInner.html(STAR_NAME[name].detail);

        openDetail( $modelShort);

    })

    function openDetail(model){
        if(model.attr('id') === 'j_model_desc_short'){
            $modelShortWrap.show();
        }else{
            $mask.show();
        }
        model.show();
    }

    function closeDetail(model){
        $modelShortWrap.hide();
        $mask.hide();
        model.hide();
    }

    // 关闭简介
    $('.j_close_desc_1').click(function(){
        closeDetail($model);
    })
    $('.j_close_desc_2').click(function(){
        closeDetail($modelShort);
    })


    // 提交表单
    $('#j_send').on('click',function(){

        // 每天只能投票一次
        if(isToday(ls.sendTime)){
            return alert('投票失败:一天只能投一次');
        }                 

        if(!$li.filter('.checked').length){
            return alert('请对作品投票')
        }


        recharge(getField());

    })

    function recharge(data){
        if(isClick) return;
        isClick = true;
        $.ajax({
            url: PATH+'/xinhua/volte.do',
            data: data,
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
                $('#longtap').show();
                ls.setItem('sendTime',new Date().getTime());
            }
        })
    }


    // 判断是否当天
    function isToday(str){
        return (new Date().toDateString() === new Date( Number(str) ).toDateString());
    }

    // 获取投票项目
    function getField(){
        let form = new FormData();
        $li.filter('.checked').forEach(item=>{
            let val = $(item).attr('name');
            form.append(val,val);
        })
        return form;
    }

})
