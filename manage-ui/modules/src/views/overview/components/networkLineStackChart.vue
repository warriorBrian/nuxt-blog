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
  name: 'networkLineStackChart',
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
    setOptions ({ times, transmit, receive, fill } = {}) {
      // 计算增加单位
      const calcUnit = (val, abs = false) => {
        const value = Math.abs(val);
        const data = abs ? value : val;
        if (Math.abs(val) > 1024) {
          return `${(data / 1024).toFixed(2)} MB`
        } else if (value > 1024 * 1024) {
          return `${(data / 1024 / 1024).toFixed(2)} GB`
        } else {
          return `${data} KB`
        }
      };
      const option = {
        title: {
          text: '网络流量',
          left: 'center',
          top: '3%',
          textStyle: {
            fontSize: '14px',
            fontWeight: '400'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let res = params[0].name + '<br/>';
            for (let i = 0, l = params.length; i < l; i++) {
              // 排除中位线数据
              if (i !== 1) {
                res += `
                  <span>${params[i].marker} ${params[i].seriesName}</span>
                  <span>${calcUnit(params[i].value, true)}</span>
                  <br />
                `;
              }
            }
            return res;
          }
        },
        legend: {
          data: ['下载', '上传'],
          top: '3%',
          right: '2%'
        },
        grid: {
          left: '2%',
          right: '2%',
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
            formatter: function (val) {
              return calcUnit(val);
            }
          },
        },
        series: [
          {
            name: '下载',
            type: 'line',
            // 设置只有hover显示圆点
            showSymbol: false,
            // 设置折线图hover不加粗
            emphasis: {
              lineStyle: {
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: '#7EB26D', // 折线圆点的颜色
                lineStyle: {
                  color: '#7EB26D' // 折线颜色
                }
              }
            },
            stack: '下行数据',
            data: receive
          },
          {
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
                color: '#ef843c', // 折线圆点的颜色
                lineStyle: {
                  color: '#ef843c' // 折线颜色
                }
              }
            },
            stack: '填充数据',
            data: fill
          },
          {
            name: '上传',
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
                color: '#6ED0E0', // 折线圆点的颜色
                lineStyle: {
                  color: '#6ED0E0' // 折线颜色
                }
              }
            },
            stack: '已用内存',
            data: transmit
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
