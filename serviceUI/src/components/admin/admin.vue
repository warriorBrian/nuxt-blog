<template>
  <div>
    <nav-header></nav-header>
    <Row type="flex" justify="space-between" style="min-width:1200px;">
        <Col span="3">
            <nav-left class="navleft"></nav-left>
        </Col>
        <Col span="21" class="routerView">
            <router-view></router-view>
        </Col>
    </Row>

  </div>
</template>
<script>
import NavHeader from '@/components/admin/NavHeader'
import NavLeft from '@/components/admin/NavLeft'
export default {
    data() {
        return {
            value:''
        }
    },
    components:{
        NavHeader,
        NavLeft
    }
}
</script>
<style lang="less">
    @import './../../assets/css/admin/style.less';
    body {
        min-width:1200px;
    }
</style>
