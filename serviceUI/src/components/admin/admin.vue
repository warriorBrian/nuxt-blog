<template>
  <div>
    <nav-header></nav-header>
    <Row type="flex" justify="space-between" style="min-width:1200px;">
        <Col span="3">
            <nav-left class="navleft"></nav-left>
        </Col>
        <Col span="21" class="routerView">
            <!-- <keep-alive>
                <router-view v-if="$route.meta.keep_alive"></router-view>
            </keep-alive>
            <keep-alive>
                <router-view v-if="!$route.meta.keep_alive"></router-view>
            </keep-alive> -->
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
    },
    mounted() {
        // this.init();
    },
    methods:{
        // init() {
        //     let odiv = document.querySelector('.nav');
        //     let divLeft = document.querySelector('.navleft');
        //     divLeft.style.height = odiv.offsetHeight + 'px';
        //     window.onresize = function () {
        //         divLeft.style.height = odiv.offsetHeight + 'px';
        //     }
        // }
    }
}
</script>
<style lang="less">
    @import './../../assets/css/admin/style.less';
    body {
        min-width:1200px;
    }
</style>
