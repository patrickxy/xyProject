import 'common_css';
import '../css/index.less';
import '../css/result.less';
import { getUrlParam } from './geturlparam';
import Popup from './popup.js';

// 业务流程
// 1，点击按钮，判断是否有资格，有资格者是否已注册
// 2，用户注册逻辑，验证码逻辑
// 3，奖项、剩余次数、获奖结果获取


if(NODE_ENV === 'dev'){
    console.log('页面实际大小: '+window.innerWidth)
}


let isClick = false; // 点击事件锁定
let ls = window.localStorage;
const PATH = API;
let aid = getUrlParam('aid');
let userid = getUrlParam('userid');
const vm = new Vue({
    el: '#app',
    data() {
        return {
          data: [],
          loadding: true,
          loading_txt: 'loading'
        }
    },
    methods:{
        showPopup(title,flag,content) {
            this.$refs.popup.show = true;
            this.$refs.popup.content = content;
            this.$refs.popup.type_img = flag;
            this.$refs.popup.title = title || '您不是新用户';
            this.$refs.popup.btn_txt = '好的，朕知道了';
        }
    },
    created() {
      // setTimeout(_=>{
      //   this.data = Math.random() > 1 ? [] : [1,2,3,5,4].map(item=>{
      //     return {
      //       name: '获得500M',
      //       date: '2017-03-15 18:00:00',
      //     }
      //   })
    // if(this.data.length) {
    //   this.loadding = false;
    // }else{
    //   this.loading_txt = '您还没有中过奖';
    // }

    // },1000)
        var that = this;
          axios.post(API+'/activity/myPrizes.do', {
              aid: aid,
              userid: userid,
          })
              .then(function (response) {
                  if(response.data.code == 1){
                      if(response.data.data.length) {
                          response.data.data.map(item=>{
                            that.data.push({name: '获得'+item.prizeName,date: item.prizeTime})
                          });
                          that.loadding = false;
                      }else{
                          that.loading_txt = '您还没有中过奖';
                      }
                  }else if(response.data.code == 0){
                      that.showPopup('',false,response.data.message);
                  }
              })
              .catch(function (error) {
                  that.showPopup('',false,error);
              });
    }
});







