import 'common_css';
import '../css/index.less';
import Popup from './popup.js';
import Card from './card';
import { getUrlParam } from './geturlparam';

// 业务流程
// 1，点击按钮，判断是否有资格，有资格者是否已注册
// 2，用户注册逻辑，验证码逻辑
// 3，奖项、剩余次数、获奖结果获取

if(NODE_ENV === 'dev'){
    console.log('页面实际大小: '+window.innerWidth)
}

// 生成随机手机号码
var nums = [
    '130','133','135','138','182','188',
    '152','156','153','136'
];
var prizes = ['30M流量包','100M流量包','500M流量包','1G流量包'];
function randomPhone(){
    return nums[Math.floor(Math.random() * 10)] +'****'+ (Math.floor(Math.random() * 8000)+1000);
}
function randomPrize(){
    return '刮出' + prizes[Math.floor(Math.random() * 4)];
}

function random(){
    return {
        phone: randomPhone(),
        prize: randomPrize(),
    }
}

var itemList = [1,2,3,4,5].map(item=>{return random()});

let isClick = false; // 点击事件锁定
let ls = window.localStorage;
const PATH = API;
const key = getUrlParam('key');
const iv = getUrlParam('iv');
const cipher = getUrlParam('cipher');
const aid = getUrlParam('aid') || '777fq2';
function rem(num){
    return num / 75 + 'rem';
}

const vm = new Vue({
    el: '#app',
    components: {
        "my-popup": Popup,
        "my-card": Card,
    },
    data() {
        return {
            news: itemList,
            marq: '0',
            marqClass: '',
            init: true,
            custom: window.custom,
            rulesopen:false,
            ruleBtn:'查看更多',
            canPlayNum:'',
            userid:''
        }
    },
    mounted() {
        // ppp()
    },
    methods: {
        initPage(){
            var that = this;
            axios.post(API+'/activity/posterToActivitPage.do', {
                key:key,
                iv:iv,
                cipher:cipher,
                aid:aid
            })
                .then(function (response) {
                    console.log(response);
                    if(response.data.code == 0){
                        that.showPopup(response.data.message , false);
                    }else if(response.data.code == 1){
                        that.userid = response.data.data.userid;
                        that.canPlayNum = response.data.data.canPlayNum;
                        that.mobile = response.data.data.mobile;
                        if(response.data.data.mobile){
                            that.init = false;
                            that.custom.slogan = '当前手机号:' + response.data.data.mobile;
                        }else{
                            //注册
                            window.location.href='registered.html'+location.search+'userid='+that.userid+'&aid='+aid;
                        }
                    }else if(response.data.code == -1){
                        //普通错误
                        that.showPopup('', false, response.data.message);
                    }else if(response.data.code == -2){
                        //不是新用户 非法用户
                        that.showPopup(false, true,'');
                    }else{
                        that.showPopup('', false,response.data.message);
                    }
                })
                .catch(function (error) {
                    that.showPopup('', false, error);
                });
        },
        showPopup(title,flag,content) {
            this.$refs.popup.show = true;
            this.$refs.popup.type_img = flag;
            this.$refs.popup.content = content;
            this.$refs.popup.title = title || '您不是新用户';
            this.$refs.popup.btn_txt = '好的，朕知道了';
        },
        addNew() {
            this.news.push({
                phone: '我的手机号', prize: '获得500M流量'
            })
        },
        showMoreRule() {
            this.rulesopen = !this.rulesopen;
            if(this.rulesopen){
                this.ruleBtn = '收起';
            }else{
                this.ruleBtn = '查看更多';
            }
        },
        goResult(){
            var that = this;
            window.location.href='result.html'+location.search+'&userid='+that.userid+'&aid='+aid;
        },
        counttime(time){
            this.canPlayNum = time;
        },
        reset() {
            ppp();
        }
    }
});


function loop() {
    vm.marqClass = '';
    vm.marq = '-0.8rem';
    vm.news.push(random());

    setTimeout(function(){
        vm.news.shift();
        vm.marqClass = 'reset';
        vm.marq = '0';
    },1100);
    
    setTimeout(loop, 3000)
}

loop();






