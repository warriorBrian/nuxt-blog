<template>
  <div>
    <section id="main" style="width: 1000px;height: 600px;margin-top: 20px;"></section>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, ToolboxComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([GridComponent, BarChart, CanvasRenderer, TitleComponent, ToolboxComponent, LegendComponent]);
function tranNumber (num, point) {
  // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
  const numStr = num.toString().split('.')[0];
  if (numStr.length < 6) { // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
    return numStr;
  } else if (numStr.length >= 6 && numStr.length <= 8) { // 如果数字大于6位,小于8位,让其数字后面加单位万
    const decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
    // 由千位,百位组成的一个数字
    return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
  } else if (numStr.length > 8) { // 如果数字大于8位,让其数字后面加单位亿
    const decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
    return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
  }
}
export default {
  name: 'BarChart',
  props: ['xData', 'seriesData'],
  watch: {
    seriesData: {
      handler () {
        this.draw();
      },
      deep: true
    }
  },
  data () {
    return {
      charts: null
    }
  },
  mounted () {
    this.charts = echarts.init(document.getElementById('main'));
    this.draw();
  },
  methods: {
    draw () {
      const options = {
        title: {
          text: 'WebService API 调用统计',
          subtext: '(非实时统计)',
          top: '3%'
        },
        xAxis: {
          max: 'dataMax',
          type: 'log',
          axisLabel: {
            formatter: (param) => {
              return tranNumber(param, 0);
            }
          },
          axisLine: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: this.xData,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
        },
        series: [{
          realtimeSort: true,
          type: 'bar',
          data: this.seriesData,
          label: {
            show: true,
            // position: 'right',
            // valueAnimation: true
          }
        }],
        toolbox: {
          show: true,
          feature: {
            myTop5: {
              show: true,
              title: 'TOP5', // 鼠标移动上去显示的文字
              option: {},
              onclick: function (option1) {
                console.log('aaa');
              }
            }
          }
        },
        // legend: {
        //   show: true
        // },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      };
      this.charts.setOption(options);
      this.charts.resize();
    }
  }
}
</script>

<style scoped>

</style>
