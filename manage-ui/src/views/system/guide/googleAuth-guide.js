export default [
  {
    element: '.googleAuth-switch-components',
    popover: {
      title: '谷歌验证器开关',
      description: '当开启谷歌验证后，后台登录时要求输入Google Authentication的六位验证码'
    }
  },
  {
    element: '.googleAuth-qrCode',
    popover: {
      title: '验证器二维码',
      description: `当开启谷歌验证后，必须扫描二维码进行绑定<br>安卓：Google身份验证器<br>IOS：Authenticator<br>绑定后将显示六位验证码，每隔30秒更换一次`
    }
  },
  {
    element: '.googleAuth-qrCode-test-input',
    popover: {
      title: '绑定测试',
      description: '当绑定成功后，可输入六位验证码进行测试绑定是否成功'
    }
  }
]
