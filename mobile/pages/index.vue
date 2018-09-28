<template>
  <div>
    <nav-header />
    <v-container style="padding:7px;">
      <v-layout row wrap>
        <v-flex xs12 style="margin-bottom:20px;" v-for="item in list" :key="item._id">
          <v-card color="blue-grey lighten-2" class="white--text">
            <v-card-title primary-title>
              <div class="title article_title">{{ item.title }}</div>
              <div class="article_des">{{ item.des }}</div>
              <i class="icon iconfont icon-rili"></i><div class="article_time">{{ item.time }}</div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import NavHeader from '~/components/common/NavHeader'
export default {
  components: {
    NavHeader
  },
  data () {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ],
      mini: false,
      right: null
    }
  },
  async asyncData ({ app }) {
    try {
      let showPage = {page:1, pagesize: 3}
      let {data: {list}} = await app.$axios.get('http://api.brianlee.cn/api/article/getFrontArticle', {params: showPage})
      return { list }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    ...mapState(['count'])
  },
  methods: {
    async get () {
      // let {data} = await this.$axios.get('https://api.github.com/repos/warriorBrian/nuxt-blog')
      // console.log(data)
    }
  }
}
</script>
<style>
  .article_title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .article_des {
    margin:0.7rem 0;
    line-height:1.6rem;
    text-indent: 1rem;
  }
  .icon-rili {
    font-size:12px;
    margin:0 0.5rem 0 0;
  }
</style>
