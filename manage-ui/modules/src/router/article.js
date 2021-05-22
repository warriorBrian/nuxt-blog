// 文章管理
const publishArticle = () => import('./../views/article/publishArticle');
const articleLists = () => import('./../views/article/ArticleLists');
const articleDetail = () => import('./../views/article/articleDetail');

export default [
  {
    path: '/publish-article',
    name: 'publishArticle',
    component: publishArticle,
    meta: {
      title: '发布文章'
    }
  },
  {
    path: '/articleLists',
    name: 'articleLists',
    component: articleLists,
    meta: {
      title: '文章列表'
    }
  },
  {
    path: '/article/detail/:id',
    name: 'articleDetail',
    component: articleDetail,
    meta: {
      title: '文章详情'
    }
  }
]
