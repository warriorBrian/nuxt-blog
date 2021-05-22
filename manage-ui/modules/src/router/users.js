// 用户管理
const users = () => import('./../views/users');

export default [
  {
    path: '/user-manager',
    name: 'user-manager',
    component: users,
    meta: {
      title: '用户管理'
    }
  }
]
