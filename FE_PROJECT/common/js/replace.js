import $ from 'webpack-zepto';

window.$ = $;
// 开发时虚构basicData
if(NODE_ENV === 'dev'){
  window.CUSTOM_DATA = '{"code":1,"data":{"isPicValidate":1,"isMessageValidate":1,"endDate":"2017.4.30","bannerImgUrl":"images/3333.jpg","actiLogoImgUrl":"","isPoster":1,"threshold":"","remindFlag":0,"actiModelId":2,"drawWay":0,"isOpenGPS":1,"oldUserDateFlag":"2017-04-20","isLimitPosi":0,"actiTitle":"gg","actiImg":"fileupload/1492760672685.jpg","ruleDesc":"办有流量套餐,符合商家规则","appId":"wx0f5990b7dc23fa76","cosRemind":"0","componentAppId":"wx8a62e7b275d9d03e","bannerImg":"521","thresholdType":"0","traffic":"20-30","orcodeImgUrl":"fileupload/1492691628513.png","shareCircle":1,"jointype":0,"subscribe":1,"stores":"","cosRemindder":"","endDateTime":"23:59:59","custName":"thx2","useStore":0,"startDateTime":"06:00:00","shareUrl":"a/JVR7Nv","shareFriends":1,"startDate":"2017.4.20","lngLatPointsRange":""}}';
}

const CONFIG_DATA = JSON.parse(window.CUSTOM_DATA)['data'];
let loadImgs = [];

// 根据配置项重构页面元素
function replace(){
  $(function(){
    var span = $('#loading-span');
    var index = 0;
    var timer = null;
    timer = setInterval(()=>{
      index++;
      if(index>2){index = 0};
      span.html('加载中 '+'...'.substr(index))
    },500)

    $('.j_edit').each(editDom);

    Promise
    .all(loadImgs)
    .catch(err=>{
      console.log('图片加载失败:'+err.target.currentSrc)
    })
    .then(data=>{
      console.log('全部图片加载成功或失败');
      span.html('加载完成^_^');
      clearInterval(timer);
      setTimeout(function(){$('#loading').remove();},500);
    })

  })
}

// 替换方法组
let replaceBus = {
  image(dom, key) {
    loadImgs.push(loadImg(dom[0]));
    dom.attr('src',CONFIG_DATA[key]);
  },
  html(dom, key){
    dom.html(CONFIG_DATA[key]);
  },
  dateRange(dom, key){
    var startDate = formatDate(CONFIG_DATA['startDate']);
    var endDate = formatDate(CONFIG_DATA['endDate']);
    dom.html(startDate+'—'+endDate);
  }
}

function editDom(){
  var dom = $(this);
  var type = dom.attr('data-type');
  var key = dom.attr('data-key');
  replaceBus[type](dom, key)
}

function formatDate(date){
  var arr = date.split('.');
  return `${arr[1]}月${arr[2]}日`;
}

function loadImg(dom){
  return new Promise((resolve, reject)=>{
    dom.onload = resolve;
    dom.onerror = reject;
  })
}



export default replace;
