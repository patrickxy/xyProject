export default Vue.component('my-popup', {
  template: `
    <div class="model-wrap" v-if="show">
        <div id="mask" style="display:block;"></div>
        <div id="popup">
            <div class="popup-header">
                <span v-cloak v-if="type_img">{{title}}</span>
                <a class="btn-close" @click="close" href="javascript:void(0);">X</a>
            </div>
            <div class="popup-content">
                <span v-cloak :class="type_img ? 'content-img':'content-words'" class="flex flex-align-center">{{content}}</span>
            </div>
            <div class="popup-footer">
                <a @click="close" class="btn-confirm" href="javascript:void(0);">{{btn_txt}}</a>
            </div>
        </div>
    </div>
  `,
  data() {
      return {
          show: false,
          title: "",
          btn_txt: "",
          type_img: false,
          content: "",
      }
  },
  methods: {
      close() {
          this.show = false;
      }
  }
})