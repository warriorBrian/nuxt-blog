<template>
  <div style="margin-bottom:60px;">
    <!--头部导航栏-->
    <v-toolbar :fixed="true">
      <v-btn icon>
        <i class="icon iconfont icon-github" v-if="$route.name === 'index'" @click="hrefGitHub"></i>
        <i class="icon iconfont icon-fanhui" @click="$router.back(-1)" v-else></i>
      </v-btn>
      <!--<v-toolbar-side-icon />-->
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <i class="icon iconfont icon-liebiao" @click.stop="drawer = !drawer"></i>
        <!--<v-icon>list</v-icon>-->
      </v-btn>
    </v-toolbar>
    <!--左侧导航栏-->
    <v-layout wrap style="position:absolute;">
      <v-navigation-drawer v-model="drawer" :mini-variant="mini" right fixed temporary>
        <v-list class="pa-1">
          <v-list-tile v-if="mini" @click.stop="mini = !mini">
            <v-list-tile-action>
              <v-icon>chevron_right</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
          <v-divider light></v-divider>

          <v-list-tile v-for="item in items" :key="item.title" @click="get(item.route)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Brian\'s Blog'
    }
  },
  data() {
    return {
      drawer: null,
      items: [
        {title: '首页', route: 'index', icon: 'dashboard'},
        {title: '前端文章', route: 'beforeArticle', icon: 'dashboard'},
        {title: '后端文章', route: 'backArticle', icon: 'question_answer'},
        {title: '更新日志', route: 'version', icon: 'dashboard'}
      ],
      mini: false,
      right: null
    }
  },
  methods: {
    get (title) {
      this.$router.push({name: title})
    },
    hrefGitHub () {
      window.open('https://github.com/warriorBrian/nuxt-blog')
    }
  }
}
</script>
<style scoped>
  .icon {
    font-size:20px;
    font-weight: bold;
  }
</style>
