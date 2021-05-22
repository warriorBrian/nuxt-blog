export const blacklist = [
  {
    element: '.blacklist-switch-components',
    popover: {
      title: '访问黑名单开关',
      description: `
          当禁用某个IP时开启访问黑名单, 使用Webservice API 进行获取IP。<br>
          开启时被添加黑名单IP则无法访问前台。<br>
          这意味着每次用户访问将增加<b>调用次数</b>。<br>
          影响范围：前台访问文章列表、文章详情等。<br>
          (不影响后台功能)
      `
    }
  }
];
