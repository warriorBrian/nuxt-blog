<template>
  <div class="error-container">
    <!-- 访问被拒绝 -->
    <section class="error-access" v-if="error.statusCode === 403">
      <div class="error-access-text">
        <h1 class="access-text-title">Oops!</h1>
        <h2>{{ error.message }}</h2>
        <p style="color:#666;">此图片来自 <a style="text-decoration:none;color:#666;" href="https://zh.airbnb.com/">airbnb</a> 页面，如有侵权请告知删除</p>
        <p>可能存在以下原因，请联系管理员</p>
        <ul class="access-list">
          <li>当前IP被禁止访问</li>
          <li>您没有权限去该页面</li>
        </ul>
      </div>
      <div class="error-access-gif"></div>
    </section>
    <!-- 404 -->
    <section class="error-not-found" v-if="error.statusCode === 404">
      <div class="error-access-text">
        <h1 class="access-text-title">Oops!</h1>
        <h2>{{ error.message }}</h2>
        <p>请检查URL是否输入正确</p>
        <NuxtLink to="/" class="error-not-found-back">回到首页</NuxtLink>
      </div>
      <div class="error-not-found-pic"></div>
    </section>
    <!-- 50x -->
    <section class="error-server" v-if="serverErrorList.includes(error.statusCode)">
      <div class="error-access-text">
        <h1 class="access-text-title">Oops!</h1>
        <h2>{{ error.statusCode }}</h2>
      </div>
      <div class="error-server-pic"></div>
    </section>
    <!-- 否则不包含以上错误，但发生了错误 -->
    <section class="error-other" v-if="!remain.includes(error.statusCode) && !serverErrorList.includes(error.statusCode)">
      <div class="error-access-text">
        <h1 class="access-text-title">Oops!</h1>
        <h2>{{ error.message }}</h2>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layouts: 'error',
  props: ['error'],
  data () {
    return {
      serverErrorList: [500, 501, 502, 504],
      remain: [403, 404]
    }
  },
  head () {
    return {
      title: this.error.message,
      meta: [
        { hid: 'description', name: 'description', content: this.error.message },
      ]
    }
  },
  created () {
    console.log(this.error, 'error');
  }
}
</script>
<style lang="less" scoped>
.error-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display:flex;
  justify-content: center;
  align-items: center;
  /* 访问拒绝区域 */
  & .error-access, .error-not-found, .error-server, .error-other {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    & .error-access-text {
      width: 350px;
      .access-text-title {
        font-size: 60px;
        font-weight: 700;
        color: #484848;
      }
      & .access-list {
        line-height: 35px;
      }
    }
    & .error-access-gif {
      width: 350px;
      height: 500px;
      background: url('~static/images/403.gif') no-repeat;
    }
  }
  /* 404 */
  & .error-not-found {
    & .error-not-found-pic {
      width: 350px;
      height: 500px;
      background-size: cover;
      background-position: center;
      background:url('~static/images/404.jpg') no-repeat;
    }
    & .error-not-found-back {
      text-decoration: none;
      color:#fff;
      width: 110px;
      height: 35px;
      background: #409eff;
      border-radius: 100px;
      font-size: 14px;
      padding: 5px 20px;
      cursor: pointer;
    }
  }
  /* 50x */
  & .error-server {
    & .error-server-pic {
      width: 350px;
      height: 500px;
      background-size: cover;
      background-position: center;
      background:url('~static/images/50x.jpg') no-repeat;
    }
  }
}
</style>
