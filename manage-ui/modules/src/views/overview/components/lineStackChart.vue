<template>
  <div :class="className" :style="{width: width, height: height}"></div>
</template>

<script>
import resize from "./mixins/resize";
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use(
  [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]
);
export default {
  name: 'lineStackChart',
  mixins: [resize],
  props: {
    chartData: {
      type: Object,
      required: false,
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
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChars();
    });
  },
  watch: {
    chartData: {
      handler (val) {
        this.setOptions(val);
      },
      deep: true
    }
  },
  methods: {
    drawChars () {
      this.chart = echarts.init(this.$el);
      this.setOptions(this.chartData);
    },
    setOptions ({ times, memoryTotalData, memoryUsedData, memoryAvailableData } = {}) {
      const option = {
        title: {
          text: '内存使用率',
          left: 'center',
          top: '3%',
          textStyle: {
            fontSize: '14px',
            fontWeight: '400'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总内存', '已用内存', '可用内存'],
          top: '3%',
          right: '2%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: 40,
          containLabel: true
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
          data: times
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} GiB'
          },
        },
        series: [
          {
            name: '总内存',
            type: 'line',
            // 设置只有hover显示圆点
            showSymbol: false,
            // 设置折线图hover不加粗
            emphasis: {
              lineStyle: {
                width: 2
              }
            },
            // areaStyle: {
            //   normal: {
            //     color: '#091e3b' // 区域颜色
            //   }
            // },
            itemStyle: {
              normal: {
                color: '#c41b2a', // 折线圆点的颜色
                lineStyle: {
                  color: '#c41b2a' // 折线颜色
                }
              }
            },
            stack: '总内存',
            data: memoryTotalData
          },
          {
            name: '可用内存',
            type: 'line',
            showSymbol: false,
            // 设置折线图hover不加粗
            emphasis: {
              lineStyle: {
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: '#9ac48a', // 折线圆点的颜色
                lineStyle: {
                  color: '#9ac48a' // 折线颜色
                }
              }
            },
            stack: '可用内存',
            data: memoryAvailableData
          },
          {
            name: '已用内存',
            type: 'line',
            showSymbol: false,
            // 设置折线图hover不加粗
            emphasis: {
              lineStyle: {
                width: 2
              }
            },
            // areaStyle: {
            //   normal: {
            //     color: '#00d1ff' // 区域颜色
            //   }
            // },
            itemStyle: {
              normal: {
                color: '#eab838', // 折线圆点的颜色
                lineStyle: {
                  color: '#eab838' // 折线颜色
                }
              }
            },
            stack: '已用内存',
            data: memoryUsedData
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
