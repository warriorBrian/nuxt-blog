<template>
  <div>
    <el-row class="network-content">
      <network-line-stackChart :chart-data="network"></network-line-stackChart>
    </el-row>
  </div>
</template>

<script>
import networkLineStackChart from "../components/networkLineStackChart";
import { handleChartData } from '@/plugins/core/lib';
export default {
  name: 'network',
  components: {
    networkLineStackChart
  },
  data () {
    return {
      network: {
        times: [],
        transmit: [],
        receive: [],
        fill: []
      }
    }
  },
  created () {
    this.$socket.emit('GET_NETWORK');
    this.$socket.on('NETWORK_DATA', data => {
      handleChartData(data, this.network)
    });
  }
}
</script>

<style scoped lang="less">
.network-content {
  background:#fff;
  margin-top: 20px;
}
</style>
