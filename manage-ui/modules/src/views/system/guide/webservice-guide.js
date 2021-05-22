export default [
  {
    element: '.webservice-input-content',
    popover: {
      title: '腾讯位置服务API配置',
      description: `
        <div>
        首次初始化系统需要配置WebService API, 此API将从
          <a target="_blank" href="https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview">WebService API</a>
        中获取
        </div>

        <div style="margin: 5px 0;">配置成功后将显示<b>本机IP地址</b>及<b>调用统计信息</b></div>

        <i>(注意：调用统计信息不会实时统计，当调用位置信息接口时统计)</i>
      `
    }
  },
  {
    element: '.webservice-key-button-refresh',
    popover: {
      title: '刷新操作',
      description: `
        <div>当点击刷新时，系统将重新获取位置信息及调用统计信息</div>
        <div>此操作将获取一次位置信息，今日调用量+1</div>
      `
    }
  }
]
