const site = () => import('./../views/site');
export default [
  {
    path: '/site',
    name: 'site',
    component: site,
    meta: {
      title: '站点设置'
    }
  }
]
