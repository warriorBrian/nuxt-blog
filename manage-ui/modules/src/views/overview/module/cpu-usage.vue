<template>
  <div>
    <el-row style="background:#fff;">
      <section class="cpu-topBar">
        <p class="cpu-topBar-title">CPU使用率</p>
        <div class="cpu-calc-content">
          <span class="cpu-calc-item">Max: {{ cpu_max }}{{unit}}</span>
          <span class="cpu-calc-item">Avg: {{ cpu_avg }}{{unit}}</span>
          <span class="cpu-calc-item">Last: {{ cpu_last }}{{unit}}</span>
        </div>
      </section>
      <lineChart :chartData="lineChartData"></lineChart>
    </el-row>
  </div>
</template>

<script>
import lineChart from './../components/lineChart'
import { handleChartData, calcAvg } from '@/plugins/core/lib';
export default {
  name: 'index.vue',
  components: {
    lineChart
  },
  data () {
    return {
      unit: '%',
      lineChartData: {
        xData: [],
        data: []
      },
      wsLength: 60
    }
  },
  created () {
    this.$socket.connect();
    this.$socket.emit('GET_CPU');
    this.$socket.on('CPU_DATA', data => {
      handleChartData(data, this.lineChartData, this.wsLength, v => ({ xData: v.time, data: Number(v.values * 100).toFixed(2) }));
    })
  },
  computed: {
    cpu_max () {
      const data = this.lineChartData.data.reduce((acc, val) => (void (acc.push(Number(val))) || acc), []);
      return Math.max.apply(null, data);
    },
    cpu_avg () {
      return calcAvg(this.lineChartData.data);
    },
    cpu_last () {
      return this.lineChartData.data[this.lineChartData.data.length - 1];
    }
  }
}
</script>

<style scoped lang="less">
  .cpu-topBar {
    width: 100%;
    text-align: center;
    & .cpu-topBar-title {
      margin-bottom: 0;
      padding: 0;
      font-size: 14px;
      font-weight: 400;
    }
    & .cpu-calc-content {
      font-size: 13px;
      font-weight: 300;
      margin-top: 0.5rem;
      & .cpu-calc-item {
        padding: 0 5px;
      }
    }
  }
</style>
