// 总览
const overview = () => import('./../views/overview');

export default [
  {
    path: '/overview',
    name: 'overview',
    component: overview,
    meta: {
      title: '系统总览'
    }
  }
]
