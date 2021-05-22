<template>
  <div>
    <section class="sensitive-recognition">
      <h3 class="item-title no-select">敏感词文本识别</h3>
      <el-input
        v-model="sensitiveWords"
        type="textarea"
        class="sensitive-recognition-textarea"
        :rows="5"
        maxlength="600"
        :placeholder="placeholder"
        :disabled="disabled"
        show-word-limit>
      </el-input>
      <section class="sensitive-recognition-result" v-if="Object.keys(sensitiveResult).length">
        <div class="sensitive-check-result" :class="[sensitiveResult['pass'] ? 'text-success' : 'text-error']">
          检测结果:
          <span>{{sensitiveResult['pass'] | filterPass}}</span>
        </div>
        <div class="sensitive-check-result text-error" v-if="sensitiveResult['words'].length">
          敏感词:
          <span>{{sensitiveResult['words'] | filterWords}}</span>
        </div>
      </section>
      <div class="sensitive-recognition-btn-content">
        <el-button type="primary" size="small" class="sensitive-recognition-btn" :loading="loading" :disabled="disabled || !sensitiveWords.length" @click="sensitiveDetectionHandle">开始检测</el-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'sensitiveRecognition',
  props: {
    sensitiveList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      sensitiveWords: '',
      sensitiveResult: {},
      loading: false
    }
  },
  computed: {
    disabled () {
      return !this.sensitiveList.length;
    },
    placeholder () {
      return this.disabled ? '请先上传敏感词文件' : '请输入检测文本，不超过600字';
    }
  },
  methods: {
    async sensitiveDetectionHandle () {
      this.loading = true;
      const { data: { data } } = await this.$axios.post('/comment/detection/sensitive', { text: this.sensitiveWords });
      this.sensitiveResult = data;
      this.loading = false;
    }
  },
  filters: {
    filterPass (val) {
      return val ? '通过' : '不通过';
    },
    filterWords (val) {
      return val.toString();
    }
  }
}
</script>

<style scoped lang="less">
.sensitive-recognition {
  width: 360px;
  margin-bottom: 20px;
  & .sensitive-recognition-result {
    /*margin: 20px 0;*/
    & .sensitive-check-result{
      text-align: center;
      margin: 5px 0;
    }
    & .text-success {
      color: #67C23A;
    }
    & .text-error {
      color:#F56C6C;
    }
  }
  & .sensitive-recognition-btn-content {
    display: flex;
    justify-content: center;
    align-items: center;
    & .sensitive-recognition-btn {
      margin: 10px 0 0 0;
    }
  }
}
</style>
