import 'common_css';
import '../css/registered.less';
import Popup from './popup.js';
if(NODE_ENV === 'dev'){
    console.log('页面实际大小: '+window.innerWidth)
}

let ls = window.localStorage;
const PATH = API;
let timer = null;
let endTime = 60;
let aid = getUrlParam('aid');
let userid = getUrlParam('userid');
const vm = new Vue({
    el: '#app',
    data() {
        return {
          phone: '',
          code: '',
          code_btn_txt: '获取验证码',
          err_phone: false,
          err_code: false,
          isSend: false,
          isClick: false,
           smsCodeKey:''
        }
    },
    methods: {
        getCode() {
            if(!this.valPhone()){
                this.err_phone = true;
                return false;
            }
            var that = this;
            axios.post(API+'/activity/sendSmsCode.do', {
                userid:userid,
                mobile: this.phone,
            })
                .then(function (response) {
                    if(response.data.code == 0){
                        that.showPopup('',false,response.data.message);
                    }else if(response.data.code == 1){
                        that.smsCodeKey = response.data.data.smsCodeKey;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.isSend = true;

            clearInterval(timer);

            timer = setInterval(_=>{
                if(endTime <= 1){
                    clearInterval(timer);
                    this.code_btn_txt = '获取验证码';
                    this.isSend = false;
                    endTime = 60;
                    return false;
                }
                endTime--;
                this.code_btn_txt = endTime+'s';
            },100)

        },
        submit() {
            if(!this.valPhone()){
                this.err_phone = true;
                return false;
            }
            if(!this.valCode()){
                this.err_code = true;
                return false;
            }

            this.isClick = true;
            this.isSend = true;
            var that = this;
            axios.post(API+'/activity/validUserMobile.do', {
                mobile: that.phone,
                userid:userid,
                smsCodeKey:that.smsCodeKey,
                smsCode:that.code
            })
                .then(function (response) {
                    if(response.data.code == 0){
                        that.showPopup('',false,response.data.message);
                    }else if(response.data.code == 1){
                        window.location.href='index.html'+location.search+'userid='+that.userid+'&aid='+aid;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });


        },
        valPhone() {
            this.err_phone = false;
            return /^1[345678][0-9]{9}$/.test(this.phone)
        },
        valCode(val) {
            this.err_code = false;
            return this.code.length
        },
        showPopup(title,flag,content) {
            this.$refs.popup.show = true;
            this.$refs.popup.content = content;
            this.$refs.popup.type_img = flag;
            this.$refs.popup.title = title || '您不是新用户';
            this.$refs.popup.btn_txt = '好的，朕知道了';
        }
    },
    created() {
      
    }
});






