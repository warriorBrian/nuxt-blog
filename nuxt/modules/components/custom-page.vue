<template>
  <div>
    <section class="page-container container-box" :style="{'justify-content': page > 1 ? 'space-between' : 'flex-end'}">
      <div class="pre-btn" v-if="page > 1" @click="paginationHandle('pre')">上一页</div>
      <div class="nuxt-btn" v-if="nextBtn" @click="paginationHandle('next')">下一页</div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    pageSize: {
      type: Number,
      default: 15
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      page: 1,
      internalPageSize: 0,
      btnShow: false
    }
  },
  computed: {
    internalPageCount () {
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    },
    nextBtn () {
      return !this.btnShow && this.internalPageCount > 1
    }
  },
  watch: {
    pageSize: {
      immediate: true,
      handler (val) {
        this.internalPageSize = 10 || val;
      }
    }
  },
  methods: {
    paginationHandle (val) {
      Object.is(val, 'next') ? ++this.page : --this.page;
      this.btnShow = Math.ceil(this.total / this.pageSize) === this.page;
      this.$emit('current-change', this.page);
    }
  },
  beforeDestroy () {
    this.page = 0;
    this.internalPageSize = 0;
    this.btnShow = false;
  }
}
</script>
<style lang="less" scoped>
.page-container {
  width: 100%;
  height: 40px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  & .nuxt-btn {
    width: 130px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    cursor: pointer;
    transition: 0.3s ease all;
    border: 1px solid #000;
    &:hover {
      background: #333;
      color:#fff;
    }
  }
  .pre-btn {
    .nuxt-btn
  }
}
</style>
