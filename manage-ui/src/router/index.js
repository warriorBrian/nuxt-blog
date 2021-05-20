import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Layout/Index'
// 总览
import overview from "./overview";
import system from "./system";
import users from "./users";
import article from "./article";
import comment from "./comment";
import tags from './tags'
import site from './site';
import chain from "./chain";

// 解决路由跳转相同的地址报错( 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题 )
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  try {
    return originalPush.call(this, location).catch(err => err);
  } catch (error) {
    console.error(error);
  }
};
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    redirect: '/overview',
    children: [
      ...overview,
      ...system,
      ...users,
      ...article,
      ...comment,
      ...tags,
      ...site,
      ...chain
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
