<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="24" class="footer">
        <div class="footer-copyright">COPYRIGHT {{ currentYear }} {{ params.author | toUpper }}. ALL RIGHTS RESERVED.</div>
        <div class="footer-record">
          <a href="https://beian.miit.gov.cn/" target="_blank">{{ params.record }}</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'custom-footer',
  filters: {
    toUpper (val) {
      return val.toUpperCase();
    }
  },
  data () {
    return {
      params: {
        author: '',
        record: ''
      }
    }
  },
  async fetch () {
    const { data: { data } } = await this.$axios.get('/site-config/site');
    this.params = data;
  },
  computed: {
    currentYear () {
      return new Date().getFullYear();
    }
  }
}
</script>
<style lang="less" scoped>
  .footer {
    display:flex;
    position: relative;
    bottom: 0;
    justify-content:center;
    align-items:center;
    margin-top:8rem;
    height:60px;
    background:#23282D;
    color:#666;
    text-align:center;
    line-height:60px;
    & .footer-copyright {}
    & .footer-record {
      margin-left: 10px;
      a {
        text-decoration: none;
        color: #666;
      }
    }
  }
</style>
