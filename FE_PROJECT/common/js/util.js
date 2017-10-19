import $ from 'webpack-zepto';

// 获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/**
 * 提示弹窗类
 * 
 * @class Dialog
 */
class Dialog {
    show(str, cb) {
        $('body').append(this._html(str));
        var el = $('.ai-dialog-wrapper');
        el.show();
        $('.ai-dialog--button').one('click', () => {
            el.remove();
            cb && cb();
        });
    }
    _html(str) {
        return `
    <div class="ai-dialog-wrapper">
      <div class="ai-dialog-mask"></div>
      <div class="ai-dialog">
        <div class="ai-dialog__header">提示</div>
        <div class="ai-dialog__body">${str}</div>
        <div class="ai-dialog__footer">
          <div class="ai-dialog--button">知道了</div>
        </div>
      </div>
    </div>
    `
    }
}


function dialog() {
    return new Dialog().show(...arguments);
}

export {
    getUrlParam,
    dialog,
}