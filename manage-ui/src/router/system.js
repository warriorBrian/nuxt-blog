// 系统配置
import GoogleAuth from "../views/system/components/GoogleAuth";

const system = () => import('./../views/system');
const configurationCenter = () => import('./../views/system/components/ConfigurationCenter');
const email = () => import('./../views/system/components/email');
const googleAuth = () => import('./../views/system/components/GoogleAuth');
const webService = () => import('./../views/system/components/WebService');
const blacklist = () => import('./../views/system/components/Blacklist');
const uploadPic = () => import('./../views/system/components/uploadPic');

export default [
  {
    path: '/system',
    name: 'system',
    component: system,
    meta: {
      title: '系统配置'
    },
    redirect: '/system/configurationCenter',
    children: [
      {
        path: 'configurationCenter',
        name: 'configurationCenter',
        component: configurationCenter,
        meta: {
          title: '配置中心'
        }
      },
      {
        path: 'email',
        name: 'email',
        component: email,
        meta: {
          title: '邮箱配置'
        }
      },
      {
        path: 'googleAuthentication',
        name: 'googleAuthentication',
        component: googleAuth,
        meta: {
          title: '谷歌身份验证配置'
        }
      },
      {
        path: 'blacklist',
        name: 'blacklist',
        component: blacklist,
        meta: {
          title: '访问黑名单'
        }
      },
      {
        path: 'webService',
        name: 'webService',
        component: webService,
        meta: {
          title: '腾讯位置服务配置'
        }
      },
      {
        path: 'uploadPic',
        name: 'uploadPic',
        component: uploadPic,
        meta: {
          title: '图片上传配置'
        }
      }
    ]
  }
]
