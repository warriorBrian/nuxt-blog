var Geetest = require('./../gt-sdk');

var captcha = new Geetest({
    geetest_id: '',	// 源码删除:极验获取 id,必须配置
    geetest_key: ''  // 源码删除:极验云获取 key,必须配置
});

module.exports = captcha;
