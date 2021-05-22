<template>
  <div :class="className" :style="{width: width, height: height}">
  </div>
</template>

<script>
import resize from './mixins/resize';
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer, LegendComponent]
);
export default {
  name: 'lineChart',
  mixins: [resize],
  props: {
    chartData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    className: {
      type: String,
      default: 'lineChart'
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
      options: {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0];
            return params.name + ' : ' + `${params.value}%`;
          },
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          "axisTick": {
            "show": false
          },
          // axisLabel: {
          //   showMaxLabel: true
          // },
          data: []
        },
        yAxis: {
          type: 'value',
          scale: false,
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'
          },
          show: true
        },
        series: [{
          name: '模拟数据',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: [],
          // 设置折线图hover不加粗
          emphasis: {
            lineStyle: {
              width: 2
            }
          }
        }]
      },
      myChart: '',
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
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },
    setOptions ({ xData, data } = {}) {
      const options = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0];
            return params.name + ' : ' + `${params.value}%`;
          },
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisTick: {
            "show": false
          },
          axisLine: {
            show: false
          },
          data: xData
        },
        grid: {
          left: '2%',
          right: '2%',
          top: 20,
          bottom: 40,
          containLabel: true
        },
        yAxis: {
          type: 'value',
          scale: false,
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'
          },
          show: true
        },
        series: [{
          name: 'abc',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          smooth: false,
          // areaStyle: {
          //   color: "rgba(5,140,255, 0.1)"
          // },
          data: data,
          // 设置折线图hover不加粗
          emphasis: {
            lineStyle: {
              width: 2
            }
          }
        }]
      };
      this.chart.setOption(options);
    }
  }
}
</script>

<style scoped>

</style>
