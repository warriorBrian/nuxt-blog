<template>
  <div class="empty-context">
    <i class="icon-empty-color"></i>
    <div class="empty-text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'empty'
}
</script>

<style scoped lang="less">
.empty-context {
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.icon-empty-color {
  background-image: url("./../../assets/empty.svg");
  background-repeat: no-repeat;
  background-size: 300px;
  width: 300px;
  height: 300px;
  display:block;
}
.empty-text {
  color:#cdd2d9;
}
</style>
