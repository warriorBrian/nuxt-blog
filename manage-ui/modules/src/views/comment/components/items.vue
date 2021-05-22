<template>
  <div :class="{'row-striped': odd }">
    <section class="customArticle-items-box" :class="{'is-active': source.id === source.active}" @click="articleListClickHandle(source.id)">
      <section class="customArticle-items-title">
        <h3>{{source.title}}</h3>
        <i class="icon iconfont icon-xuanzhong" v-if="source.id === source.active"></i>
      </section>
      <section class="customArticle-items-bottom">
        <div class="customArticle-items-bottom-time">{{source['createdAt'] | formatDate}}</div>
        <el-tag effect="dark" size="mini" type="info">{{`${source.count}条评论`}}</el-tag>
      </section>
    </section>
  </div>
</template>

<script>
import dateProcess from "@/plugins/core/lib/dateProcess";
export default {
  name: 'items',
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    articleListClickHandle (id) {
      this.$eventBus.$emit('articleListClickHandle', id);
    }
  },
  filters: {
    formatDate (val) {
      return dateProcess(val, 'YYYY-MM-DD hh:mm:ss');
    }
  },
  computed: {
    odd () {
      return !((this.index + 1) % 2)
    }
  }
}
</script>

<style scoped lang="less">
  // striped
.row-striped {
  background: #fafafa;
}
.is-active {
  background:#ecf5ff;
  &:hover {
    background:#ecf5ff !important;
  }
}
.customArticle-items-box {
  height: 70px;
  padding: 10px 15px;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  &:hover {
    background:#f5f7fa;
    cursor: pointer;
  }
  & h3 {
    font-size: 16px;
    width: 98%;
    color:#2c3e50;
    font-weight: 500;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    padding: 0;
    margin: 0;
  }
  // 列表title区域
  & .customArticle-items-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & .icon-xuanzhong {
      color: #6699CC;
    }
  }
  // 列表底部区域
  & .customArticle-items-bottom {
    width: 100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    & .customArticle-items-bottom-count, .customArticle-items-bottom-time {
      color:#86868b;
      font-size: 14px;
    }
  }
}
</style>
