export const configure = [
  {
    element: '.comment-switch-component',
    popover: {
      title: '评论开关',
      description: `
          控制前台评论<br>
          当关闭时前台无法评论<br>
      `
    }
  },
  {
    element: '.recordIp-switch-component',
    popover: {
      title: '评论记录IP开关',
      description: `
          前置条件：<br>
          必须前往 <b>系统配置 => 腾讯位置服务配置webservice API</b>配置可用key<br>
          当开启时每次评论都会调用位置服务，则调用次数 +1<br>
          (注意此服务使用量)
      `
    }
  },
  {
    element: '.conduct-geetest-id',
    popover: {
      title: '极验行为验证配置',
      description: `
         如果配置极验行为验证，则评论时必须通过行为验证 <br>
         否则如果留空则评论时不进行行为验证 (注意：如果不开启行为验证可能存在恶意刷评论情况，请谨慎)<br>
         如果配置错误ID或者KEY将不会在前端显示行为验证组件，请注意！
      `
    }
  },
  {
    element: '.sensitive-upload',
    popover: {
      title: '敏感词管理',
      description: `
        上传敏感词: <br>
        当上传敏感词后，系统会自动合并所有的文件中包含的敏感词，且去重。<br>
        请使用通过敏感词文件格式排版，可参考常用敏感词txt文件。<br>
      `
    }
  },
  {
    element: '.sensitive-recognition-textarea',
    popover: {
      title: '敏感词文本识别',
      description: `
        当上传成功敏感词文件后，可使用此功能检测敏感词是否生效及过滤词汇等。<br>
      `
    }
  }
];
