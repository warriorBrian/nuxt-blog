import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Admin from '@/components/admin/admin.vue'
import Admin_index from '@/components/admin/Admin-index.vue'
import Article from '@/components/admin/Article.vue'
import Update from '@/components/admin/update.vue'
import ArticleList from '@/components/admin/ArticleList.vue'
import Version from '@/components/admin/Version.vue'
import NoFound from '@/components/NoFound.vue'
Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta:{requireAuth:false}
    },
    {
      path:'/admin',
      component:Admin,
      meta:{requireAuth:true},
      children:[
          {
              path:"/admin/",
              name:'admin',
              component:Admin_index,
              meta:{requireAuth:true}
          },
          {
              path:'article',
              name:'article',
              component:Article,
              meta:{keepAlive:true,requireAuth:true}
          },
          {
              path:'article/:id',
              name:'update',
              component:Update,
              meta:{requireAuth:true}
          },
          {
              path:'list',
              name:'articleList',
              component:ArticleList,
              meta:{requireAuth:true}
          },
          {
              path:'version',
              name:'version',
              component:Version,
              meta:{requireAuth:true}
          }
      ]
    },
    {
        path:'*',
        component:NoFound,
        meta:{
            title:'404未找到'
        }
    }
  ]
})
