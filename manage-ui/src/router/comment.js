const commentLists = () => import('./../views/comment/commentLists');
const commentConfigure = () => import('./../views/comment/commentConfigure');

export default [
  {
    path: '/commentLists',
    name: 'commentLists',
    component: commentLists,
    meta: {
      title: '评论列表'
    }
  },
  {
    path: '/comment-configure',
    name: 'commentConfigure',
    component: commentConfigure,
    meta: {
      title: '评论设置'
    }
  }
];
