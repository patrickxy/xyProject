import Scratchcard from './scratchcard.min.js';
import { getUrlParam } from './geturlparam';
const aid = '777fq2';
export default Vue.component('my-card', {
  template: `
    <div class="pad">      
        <div class="pad-body">       
            <div class="pad-inner-wrap">
                <div class="pad-inner" id="pad_dom">
                    <div class="pad-loading" v-if="state === 'loading'">计算中...</div>
                    <div class="pad-done" v-if="state === 'done'">
                        <div class="title">恭喜你获得<em>{{prize}}</em>流量</div>
                        <div class="footer">
                            <a @click="reset">继续刮奖</a> &gt;
                        </div>
                    </div>
                    <div class="pad-fail" v-if="state === 'fail'">
                        <div class="title">抱歉您没有中奖</div>
                        <div class="footer">
                            <a @click="reset">继续刮奖</a> &gt;
                        </div>
                    </div>
                </div>
                </div>
            </div>
        <div class="pad-head">您共有<em>{{time}}</em>次刮奖机会</div>
    </div>
  `,
  props:['time','userid'],
  data() {
      return {
          show: false,
          prize: "500M",
          state: 'loading',
          scratchTitle:'立即刮奖',
          progress:false
      }
  },
  mounted() {
      this.init();
  },
  methods: {
      init() {
            var that = this;
            var painter = new Scratchcard.Painter({color: '#d3d3d3'});
            var img = new Image();
            img.src = '../images/pad_bg.png';
            painter.reset = function reset(ctx, width, height) {
                ctx.fillStyle = this.options.color;
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillRect(0, 0, width, height);
                ctx.font = (60/75)+'rem yahei';
                ctx.fillStyle = '#484848';
                img.onload = function () {
                    ctx.drawImage(img,0,0,width,height);
                    var dpr = window.document.documentElement.getAttribute('data-dpr');
                    ctx.fillText(that.scratchTitle, (width/2)-60*dpr, (height/2)+30/2);
                }
            };

            var scratchcard = new Scratchcard(document.querySelector('#pad_dom'), {
                realtime: true,
                painter: painter
            });

            scratchcard.on('progress', function onProgress(progress) {
                if ((progress > 0.5) && (progress < 1)) {
                    scratchcard.complete();
                }
                if(that.progress){
                    return;
                }
                that.progress = true;
                axios.post(API+'/actiluckscratch/play.do', {
                    aid: aid,
                    userid: that.userid,
                })
                    .then(function (response) {
                        console.log(response);
                        if(response.data.code == 1){
                            that.state = 'done';
                            that.$emit('time',response.data.data.canPlayNum);
                            that.prize = response.data.data.traffic+'M';
                        }else if(response.data.code == 0){
                            that.showPopup(response.data.message , )
                        }
                    })
                    .catch(function (error) {

                    });
            });
      },
      reset() {
          if(this.time < 1){
              this.$emit('marq');
              return this.$emit('notice','您没有刮奖机会了')
          }
          this.init();
          this.progress = false;
          this.state = 'loading';
      }
  }
})