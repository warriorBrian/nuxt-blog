<template>
  <div>
    <!-- banner -->
    <custom-banner :list="list"></custom-banner>
    <section class="container-box chain-container-box">
      <el-card :body-style="{ padding: '0px' }" v-for="(chain, index) in chainLists" :key="index" class="chain-card">
        <section @click="navigationChainHandle(chain)">
          <el-image fit="cover" style="width: 150px;height: 150px;" :src="chain['avatarLink']">
            <div slot="placeholder" class="chain-image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
            <div slot="error" class="chain-image-slot">
              <i class="icon iconfont icon-icontouxiang"></i>
            </div>
          </el-image>
          <p class="chain-name">{{ chain['name'] }}</p>
        </section>
      </el-card>
      <section v-if="!chainLists.length" class="chain-empty">
        <empty>友链页面空空如也~</empty>
      </section>
      <no-ssr>
        <post-chain></post-chain>
      </no-ssr>
    </section>
  </div>
</template>
<script>
import customBanner from '~/layouts/custom-banner';
import empty from '~/components/empty';
import postChain from '~/components/post-chain';
export default {
  components: {
    customBanner,
    empty,
    postChain
  },
  data () {
    return {
      list: {},
      chainLists: []
    }
  },
  async fetch () {
    await this.getBannerData();
    await this.getChainLists();
  },
  head () {
    return {
      title: '友链'
    }
  },
  methods: {
    // 获取banner数据
    async getBannerData () {
      try {
        const { data: { data } } = await this.$axios.get('/site-config/list', {});
        // 查找数据与路由进行对应
        const index = data.list.findIndex(v => v.link === this.$route.path);
        this.list = data.list[index];
      } catch (e) {
        this.$nuxt.error({ ...e.response.data });
      }
    },
    // 获取链接
    async getChainLists () {
      const { data: { data } } = await this.$axios.get('/chain/list');
      this.chainLists = data.list;
    },
    // 跳转友链
    navigationChainHandle (chain) {
      window.open(chain.link, '_blank');
    }
  }
}
</script>
<style scoped lang="less">
.chain-container-box {
  margin-top: 4rem;
  display: flex;
  overflow: hidden;
  padding: 4rem 2rem 2rem;
  flex-direction: row;
  flex-wrap: wrap;
  & .chain-card {
    width: 150px;
    height: 200px;
    margin: 0 22px 60px;
    cursor: pointer;
    &:hover {
      transform: translateY(-4px) scale(1.05) translateZ(0);
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
    & /deep/ .el-card__body {
      display:flex;
      justify-content: flex-start;
      flex-direction: column;
    }
  }
  & /deep/ .chain-image-slot {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    & .el-icon-picture-outline {
      font-size: 42px;
      color: #999;
    }
    & .icon-icontouxiang {
      font-size: 42px;
      color: #999;
    }
  }
  & .chain-name {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
  }
}
.chain-empty {
  width: 100%;
}
</style>
