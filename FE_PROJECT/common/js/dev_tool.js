import $ from 'webpack-zepto';
import '../css/qrcode.less';
require("./qrcode.js");

// 插入二维码dom到html
let qrcode_html = `
  <div id="hide_debug">清理屏幕</div>
  <div class="code-wrap">
      <div id="create_qrcode">生成二维码</div>
      <div id="qrcode"></div>
  </div>
`;

function bindEvent(){
  $(function(){
    $('body').append(qrcode_html);
    var codeDom = $('#qrcode');
    var w = window.innerWidth * 0.8;
    const QRCODE = new QRCode(codeDom[0],{
      width: w,
      height: w,
      colorDark : "#000000",
      colorLight : "#ffffff",
    });

    $('body')
    .on('click','#create_qrcode', function(){
      codeDom.show();   
      QRCODE.makeCode(window.location.href);
    })
    .on('click','#qrcode', function(){
      codeDom.hide();
    })
    .on('click','#hide_debug', function(){
      $('.code-wrap')
      .add($('#hide_debug'))
      .add($('#__vconsole'))
      .hide();
    })

  })
}


export default bindEvent;