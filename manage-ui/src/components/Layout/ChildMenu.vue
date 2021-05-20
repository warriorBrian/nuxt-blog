<template>
  <div>
    <div>
      <el-submenu :index="menu.url">
        <template slot="title">
          <!-- icon -->
          <i v-if="menu.icon" class="icon iconfont navLeft-menu-item-icon" :class="menu.icon"></i>
          <!-- title -->
          {{menu.label}}
        </template>
        <template  v-for="(item) in menu.subs">
          <!--如果存在subs，表示多层级子集，则递归渲染-->
          <child-menu v-if="item.subs" :menu="item" :key="item.label"></child-menu>
          <!--否则停止递归，渲染完毕-->
          <el-menu-item class="children-menu-item" v-else :index="item.url" :key="item.label" :disabled="item.disabled" :class="{'active-menu': item.url === $route.path}">
            <!-- icon -->
            <i v-if="item.icon" class="icon iconfont navLeft-menu-item-icon" :class="item.icon"></i>
            <!--content-->
            {{item.label}}
          </el-menu-item>
        </template>
      </el-submenu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChildMenu',
  props: {
    menu: {
      required: true
    }
  }
}
</script>

<style scoped lang="less">
  @import "./style/index.less";
</style>
