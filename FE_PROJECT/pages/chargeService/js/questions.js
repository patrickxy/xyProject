import '@common/css/reset.less';
import '../css/questions.less'
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {
    // replace();
} else {
    devTool();
}