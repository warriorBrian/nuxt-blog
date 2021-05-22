const chain = () => import('./../views/chain');
export default [
  {
    path: '/chain-manager',
    name: 'chain-manager',
    component: chain,
    meta: {
      title: '友链管理'
    }
  }
]
