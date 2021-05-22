<template>
  <div>
    <section v-if="!error">
      <div class="navBar">
        <section class="navBar-container">
          <section class="navBar-container-left">
            <div v-for="(items, index) in navList" :key="index">
              <!-- 博客title -->
              <h1 v-if="Object.is(items.type, 'index')" @click="navigationHandle(items)">{{ items.title }}</h1>
              <!-- 导航选项 -->
              <div class="navBar-navigation-content" v-else>
                <!-- 存在子项 -->
                <el-dropdown class="navBar-navigation-items" v-if="items.children.length">
                  <span class="el-dropdown-link">
                    {{ items.title }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(subs, idx) in items.children" :key="idx" @click.native="navigationHandle(subs)">
                      {{ subs.title }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- 不存在子项 -->
                <p v-else class="navBar-navigation-items" @click="navigationHandle(items)">{{ items.title }}</p>
              </div>
            </div>
          </section>
          <!-- 右侧选项 -->
          <!--<section class="navBar-container-right"></section>-->
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { validateFormat } from '~/plugins/core/lib';
export default {
  data () {
    return {
      list: {},
      navList: [],
      linkTypeMapping: { 0: '_self', 1: '_blank' },
      index: 0,
      error: false
    }
  },
  async fetch () {
    try {
      const { data: { data } } = await this.$axios.get('/site-config/list', {});
      this.navList = data.list;
      // 查找数据与路由进行对应
      const index = data.list.findIndex(v => v.link === this.$route.path);
      this.index = index;
      this.list = data.list[index];
    } catch (e) {
      this.error = true;
      this.$nuxt.error({ ...e.response.data });
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  methods: {
    navigationHandle (sub) {
      const routerLists = this.$router.options.routes.map(v => v.path);
      if (validateFormat(sub.link, ['domain'])) {
        // 域名跳转
        window.open(sub.link, this.linkTypeMapping[ sub['linkType'] ]);
        return false;
      }
      if (!routerLists.includes(sub.link)) {
        return this.$message.error('此路由暂不存在，无法进行跳转，请新增路由且页面再进行跳转!');
      }
      if (validateFormat(sub.link, ['router'])) {
        // 路由跳转
        const routeData = this.$router.resolve({ path: sub.link });
        window.open(routeData.href, this.linkTypeMapping[ sub['linkType'] ]);
        return false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navBar {
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  z-index: 999;
  position: fixed;
  top:0;
  left: 0;
  box-sizing: border-box;
  box-shadow: 0 0.3125rem 0.3125rem -0.3125rem rgb(0 0 0 / 12%);
  & .navBar-container {
    height: 100%;
    /*border: 1px solid red;*/
    display:flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 auto;
    & .navBar-container-left {
      /*width: 100%;*/
      display:flex;
      justify-content: flex-start;
      align-items: center;
      /* title */
      h1 {
        margin: 0;
        padding: 0;
        margin-right: 20px;
        font-size: 23px;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }
}
.navBar-navigation-content {
  display: flex;
  align-items: center;
  & .navBar-navigation-items {
    padding: 0 10px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.9);
    font-size: 14px;
  }
}
/* 修改下拉菜单样式 */
.el-dropdown-menu {
  & /deep/ .el-dropdown-menu__item {
    &:hover {
      background-color: #f8f9fa;
      color: #606266;
    }
  }
}
</style>
