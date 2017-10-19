import '../css/error.less';
import { getUrlParam } from './util/util.js';


try {
    let basicData = JSON.parse(window.CUSTOM_DATA.basicData);
    document.querySelector('.j_custom_bg').style.backgroundImage = `url("/${basicData.data.bannerImgUrl}")`
} catch (error) {
    console.log(error);
}


// 出错信息
var errorInfo = decodeURIComponent(getUrlParam('message'));

document.querySelector('#error').innerHTML = errorInfo;

// 跳转回活动页面
var url = getUrlParam('url');

document.querySelector('#btn-close').onclick = function(){
    window.location.href = url;
}