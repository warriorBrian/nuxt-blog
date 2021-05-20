<template>
  <div style="margin-top: 100px;">
    403
  </div>
</template>
<script>
export default {
  layouts: '403',
  props: ['error'],
  created () {
    console.log(this.error, '错误1111')
  }
}
</script>
