import '@common/css/reset.less';
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {} else {
    devTool();
}
$(function() {

});