<template>
  <div :style="{width: width, height: height}"></div>
</template>

<script>
import resize from './mixins/resize';
import * as echarts from 'echarts/core';
import { TooltipComponent } from 'echarts/components';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use(
  [TooltipComponent, GaugeChart, CanvasRenderer]
);
export default {
  name: 'gaugeChart',
  mixins: [resize],
  props: {
    chartData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      handler (val) {
        this.setOptions(val);
      },
      deep: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChars();
    });
  },
  methods: {
    drawChars () {
      this.chart = echarts.init(this.$el);
      this.setOptions();
    },
    setOptions ({ time, values } = {}) {
      const option = {
        series: [{
          type: 'gauge',
          progress: {
            show: true,
            width: 10
          },
          detail: {
            formatter: '{value}%',
            offsetCenter: [0, "60%"]
          },
          center: ["50%", "55%"], // 仪表位置
          radius: "90%", // 仪表大小
          title: {
            show: true,
            offsetCenter: [0, "40%"],
          },

          data: [{
            value: values,
            name: 'CPU总使用率'
          }]
        }]
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
