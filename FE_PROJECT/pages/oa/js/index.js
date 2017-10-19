import '@common/css/font.css';
import '../css/index.less';
import $ from 'webpack-zepto';
import devTool from '@common/js/dev_tool.js';
import { getUrlParam, dialog } from '@common/js/util.js';
// 在发布后再执行替换操作
if (NODE_ENV === 'prod') {} else {
    devTool();
}
$(function() {
    // Initialize your app
    var myApp = new Framework7();

    // Export selectors engine
    var $$ = Dom7;

    // Add views
    var view1 = myApp.addView('#view-1', {
        dynamicNavbar: true
    });
    var view2 = myApp.addView('#view-2', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: true
    });
    var view3 = myApp.addView('#view-3', {
        dynamicNavbar: true
    });

    $$(document).on('pageInit', function(e) {
        var page = e.detail.page;
        // Code for About page
        console.log(page.name);
        // if (page.name === 'about') {
        //     // We need to get count GET parameter from URL (about.html?count=10)
        //     var count = page.query.count;
        //     // Now we can generate some dummy list
        //     var listHTML = '<ul>';
        //     for (var i = 0; i < count; i++) {
        //         listHTML += '<li>' + i + '</li>';
        //     }
        //     listHTML += '</ul>';
        //     // And insert generated list to page content
        //     $$(page.container).find('.page-content').append(listHTML);
        // }
        // // Code for Services page
        if (page.name === 'commonApproval') {
            $$(page.container).find('.action1').on('click', function() {
                // 删除
                alert(1);
            })
            $$(page.container).find('#js_add_attachment').on('click', function() {
                // 增加附件
                alert(2);
            })
        }
    });
});