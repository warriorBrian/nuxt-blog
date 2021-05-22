<template>
  <div>
    <section class="banner-container">
      <div class="banner" :style="{backgroundImage: `url(${`${ (list && list.banner) ? convertURL( list.banner['link'] ) : defaultBanner }`})`}"></div>
      <div class="banner-text">
        <section class="banner-text-content">
          <h1 class="banner-text-desc">
            <slot name="title" v-if="$slots.title"></slot>
            <template v-else>{{ list['desc'] || '' }}</template>
          </h1>
          <h2 class="banner-text-subDesc">
            <slot name="desc" v-if="$slots.desc"></slot>
            <template v-else>{{ list['subDesc'] || '' }}</template>
          </h2>
        </section>
      </div>
    </section>
  </div>
</template>
<script>
import convertURL from '~/plugins/core/lib/internal/convertURI'
export default {
  props: {
    defaultBanner: {
      type: String,
      default: ''
    },
    list: {
      type: Object
    }
  },
  methods: {
    convertURL
  }
}
</script>
<style scoped lang="less">
.banner-container {
  width: 100%;
  height: 550px;
  position: relative;
  overflow: hidden;
  & .banner {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  & .banner-text {
    width: 100%;
    height: 100%;
    transform: translateZ(0);
    background-color: rgba(0, 0, 0, 0.35) !important;
    position: relative;
    z-index: 2;
    display:flex;
    justify-content: center;
    align-items: center;
    color:#fff;
    & .banner-text-content {
      width: 100%;
      text-align: center;
      & .banner-text-desc {
        font-size: 2.5rem;
        font-weight: 400;
      }
      & .banner-text-subDesc {
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
