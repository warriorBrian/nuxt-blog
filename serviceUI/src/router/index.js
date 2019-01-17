import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import(/* webpackChunkName: 'index' */ '@/components/Index'),
      meta: {requireAuth: false}
    },
    {
      path: '/admin',
      component: () => import(/* webpackChunkName: 'admin' */ '@/components/admin/admin.vue'),
      meta: {requireAuth: true},
      children: [
        {
          path: '/admin/',
          name: 'admin',
          component: () => import(/* webpackChunkName: 'Admin-index' */ '@/components/admin/Admin-index.vue'),
          meta: {requireAuth: true}
        },
        {
          path: 'article',
          name: 'article',
          component: () => import(/* webpackChunkName: 'article' */ '@/components/admin/Article.vue'),
          meta: {keepAlive: true, requireAuth: true}
        },
        {
          path: 'article/:id',
          name: 'update',
          component: () => import(/* webpackChunkName: 'update' */ '@/components/admin/update.vue'),
          meta: {requireAuth: true}
        },
        {
          path: 'list',
          name: 'articleList',
          component: () => import(/* webpackChunkName: 'articleList' */ '@/components/admin/ArticleList.vue'),
          meta: {requireAuth: true}
        },
        {
          path: 'version',
          name: 'version',
          component: () => import(/* webpackChunkName: 'version' */ '@/components/admin/Version.vue'),
          meta: {requireAuth: true}
        },
        {
          path: 'comment',
          name: 'comment',
          component: () => import(/* webpackChunkName: 'version' */ '@/components/admin/Comment.vue'),
          meta: {requireAuth: true}
        }
      ]
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: 'noFound' */ '@/components/NoFound.vue'),
      meta: {
        title: '404未找到'
      }
    }
  ]
})
