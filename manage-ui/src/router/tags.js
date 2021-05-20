const tags = () => import('./../views/tags');
export default [
  {
    path: '/tag-manager',
    name: 'tag-manager',
    component: tags,
    meta: {
      title: '标签管理'
    }
  }
]
