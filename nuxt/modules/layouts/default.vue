<template>
  <div>
    <custom-header></custom-header>
    <Nuxt style="overflow: auto;" />
    <custom-footer></custom-footer>
  </div>
</template>

<script>
import customHeader from './custom-header';
import customFooter from './custom-footer';
export default {
  components: {
    customHeader,
    customFooter
  }
}
</script>
