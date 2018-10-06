<template>
  <div>
    <nav-header />
    <v-container style="padding:7px;">
      <v-layout row wrap>
        <v-flex xs12 style="margin-bottom:20px;" v-for="item in list" :key="item._id">
          <!--card list start-->
          <v-card>
            <v-img :lazy-src="item.banner" :src="item.banner" aspect-ratio="2.75" height="200" v-show="item.banner"></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ item.title }}</h3>
                <div style="display:flex;align-items:center;margin:1rem 0 0 0;"><i class="icon iconfont icon-rili"></i><div class="article_time">{{ item.time }}</div></div>
                <div class="article_des grey--text">{{ item.des }}</div>
              </div>
            </v-card-title>
          </v-card>
          <!--card list end-->
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
      right: null,
      show: false
    }
  },
  async asyncData ({ app }) {
    try {
      let showPage = {page:1, pagesize: 6}
      let {data: {list}} = await app.$axios.get('/api/article/getFrontArticle', {params: showPage})
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
<style lang="css">
  .article_des {
    margin:0.7rem 0;
    line-height:1.6rem;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient:vertical;
    /* autoprefixer: on */
    -webkit-line-clamp:2;
  }
  .icon-rili {
    font-size:12px;
    margin:0 0.5rem 0 0;
  }
</style>
