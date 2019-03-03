<template>
  <div>
    <div ref="captchaBox" class="captchaBox">
      <div id="wait" v-show="waitShow">
        <div class="loading">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import gt from '~/plugins/gt.js'
export default {
  name: 'Geetest',
  props: {
    data: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      geet: {
        challenge: '',
        gt: ''
      },
      waitShow: true
    }
  },
  created () {
    this.defaultPost()
  },
  methods: {
    async defaultPost () {
      let { data } = await this.$axios.get(this.data.baseUrl)
      await Object.assign(this.geet, {challenge: data.challenge, gt: data.gt})
      await this.geetTest(this.geet.challenge, this.geet.gt)
    },
    async geetTest (challenge, gt) {
      let self = this
      let captchaBox = this.$refs.captchaBox
      let captch = await new Promise((resolve) => {
        window.initGeetest({gt: gt, challenge: challenge, lang: 'zh-cn', product: this.data.product, offline: false, new_captcha: true, width: '100%'}, (captch) => resolve(captch))
      })
      Vue.prototype.$captch = captch
      captch.appendTo(captchaBox) // 添加进DOM
      captch.onReady(() => {
        this.$emit('on-ready')
        self.waitShow = false // 关闭loading
      })
      captch.onError(e => this.$emit('on-error', e)) // 失败回调
      captch.onSuccess(() => this.$emit('on-success', captch.getValidate())) // 成功回调
      captch.onClose(() => this.$captch.reset()) // 关闭回调
    }
  }
}
</script>

<style scoped>
  .captchaBox {
    width: 100%;
  }
  #wait {
    height: 40px;
    width: 100%;
    text-align: center;
    background: #fff;
    border: 1px solid #E3E3E3;
  }
  .loading {
    margin: auto;
    width: 70px;
    height: 40px;
  }
  .loading-dot {
    float: left;
    width: 8px;
    height: 8px;
    margin: 18px 4px;
    background: #409EFF;

    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;

    opacity: 0;

    -webkit-box-shadow: 0 0 2px #409EFF;
    -moz-box-shadow: 0 0 2px #409EFF;
    -ms-box-shadow: 0 0 2px #409EFF;
    -o-box-shadow: 0 0 2px #409EFF;
    box-shadow: 0 0 2px #409EFF;

    -webkit-animation: loadingFade 1s infinite;
    -moz-animation: loadingFade 1s infinite;
    animation: loadingFade 1s infinite;
  }

  .loading-dot:nth-child(1) {
    -webkit-animation-delay: 0s;
    -moz-animation-delay: 0s;
    animation-delay: 0s;
  }

  .loading-dot:nth-child(2) {
    -webkit-animation-delay: 0.1s;
    -moz-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  .loading-dot:nth-child(3) {
    -webkit-animation-delay: 0.2s;
    -moz-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  .loading-dot:nth-child(4) {
    -webkit-animation-delay: 0.3s;
    -moz-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  @-webkit-keyframes loadingFade {
    0% { opacity: 0; }
    50% { opacity: 0.8; }
    100% { opacity: 0; }
  }

  @-moz-keyframes loadingFade {
    0% { opacity: 0; }
    50% { opacity: 0.8; }
    100% { opacity: 0; }
  }

  @keyframes loadingFade {
    0% { opacity: 0; }
    50% { opacity: 0.8; }
    100% { opacity: 0; }
  }
</style>
