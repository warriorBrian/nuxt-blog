<template>
  <div class="service-statistic">
    <section class="service-statistic-content">
      <div class="row-panel" style="width: 30%">
        <gauge-chart :chartData="lineChartData"></gauge-chart>
      </div>
      <div class="row-panel" style="width: 69%;">
        <line-stack-chart :chartData="memory"></line-stack-chart>
      </div>
    </section>
  </div>
</template>

<script>
// cpu 仪表板图表
import gaugeChart from "../components/gaugeChart";
// 内存折线图表
import lineStackChart from "../components/lineStackChart";
import { handleChartData } from '@/plugins/core/lib';
export default {
  name: 'service-statistic',
  components: {
    gaugeChart,
    lineStackChart
  },
  data () {
    return {
      lineChartData: {
        time: null,
        values: null
      },
      memory: {
        times: [],
        memoryTotalData: [],
        memoryUsageData: [],
        memoryAvailableData: []
      }
    }
  },
  created () {
    this.$socket.connect();
    // 获取CPU统计信息
    this.$socket.emit('GET_CPU_USAGE');
    this.$socket.on('CPU_USAGE', data => {
      this.lineChartData = { time: data.time, values: Number(data.values).toFixed(2) };
    });
    // 获取内存统计信息
    this.$socket.emit('GET_MEMORY');
    this.$socket.on('MEMORY_DATA', data => {
      handleChartData(data, this.memory);
    });
  }
}
</script>

<style scoped lang="less">
.service-statistic {
  width: 100%;
  margin-top: 20px;
  & .service-statistic-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.row-panel {
  background:#fff;
}
</style>
