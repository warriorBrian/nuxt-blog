export default [
  { label: '系统总览', url: '/overview', disabled: false, icon: 'icon-icon' },
  // { label: '预留', url: '/envs', disabled: true },
  // { label: '预留', url: '/configures', disabled: true },
  {
    label: '文章管理',
    url: '/console',
    icon: 'icon-svgwrite',
    subs: [
      { label: '发布文章', url: '/publish-article' },
      { label: '文章列表', url: '/articleLists' }
    ]
  },
  {
    label: '评论管理',
    url: '/comment',
    icon: 'icon-pinglun',
    subs: [
      { label: '评论列表', url: '/commentLists' },
      { label: '评论设置', url: '/comment-configure' }
    ]
  },
  { label: '标签管理', url: '/tag-manager', icon: 'icon-icontag' },
  { label: '友链管理', url: '/chain-manager', icon: 'icon-lianjie' },
  { label: '用户管理', url: '/user-manager', icon: 'icon-yonghuguanli' },
  { label: '站点设置', url: '/site', icon: 'icon-web' },
  { label: '系统设置', url: '/system', icon: 'icon-xitongshezhi' }
  // {
  //   label: '多级路由',
  //   url: '/console',
  //   subs: [
  //     { label: '多级路由子集', url: '/console-subs' },
  //     { label: '树形路由子集', url: '/subs1', subs: [{ label: '子集2', url: '/subs2', subs: [{ label: '子集3', url: '/subs3', subs: [{ label: '子集4', url: '/subs4' }] }] }] }
  //   ]
  // }
]
