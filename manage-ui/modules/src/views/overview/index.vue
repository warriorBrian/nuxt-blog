<template>
  <div class="system-overview">
    <!-- 服务概览 -->
    <statistics></statistics>
    <!-- CPU 使用率 -->
    <cpu-usage></cpu-usage>
    <!-- 服务统计 -->
    <service-statistic></service-statistic>
    <!-- 网络使用率 -->
    <network></network>
  </div>
</template>
<script>
import statistics from "./module/statistics";
import cpuUsage from './module/cpu-usage';
import serviceStatistic from './module/service-statistic';
import network from "./module/network";
export default {
  components: {
    cpuUsage,
    statistics,
    serviceStatistic,
    network
  },
  beforeDestroy () {
    this.$socket.disconnect();
  }
}
</script>
<style scoped lang="less">
.system-overview {
  margin-bottom: 20px;
}
.chart-wrapper {
  background:#fff;
  /*padding: 16px 0 0;*/
  margin-bottom: 32px;
}
</style>
