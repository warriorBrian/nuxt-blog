<template>
  <div class="panel">
    <h3 class="item-title">
      腾讯 WebService API 秘钥配置
      <i class="el-icon-question guide" @click="webServiceGuideHandle"></i>
    </h3>
    <section class="webservice-content item-title-content">
      <section class="webservice-input-content">
        <el-input v-model="key" class="webservice-key-input" :disabled="disabled" size="small" :type="inputStatus ? 'text' : 'password'" placeholder="请输入秘钥"></el-input>
        <button class="webservice-paw-show" @click="inputStatus = !inputStatus">{{inputStatus ? '隐藏' : '显示'}}</button>
      </section>
      <el-button type="default" size="small" class="webservice-key-button" v-if="!disabled" @click="cancelChangeHandle">取消</el-button>
      <el-button type="primary" size="small" class="webservice-key-button" v-else @click="changeWebServiceKeyHandle">编辑</el-button>
      <el-button type="info" icon="el-icon-refresh" size="small" v-if="disabled" @click="getQpsData" class="webservice-key-button-refresh">刷新</el-button>
      <el-button type="success" size="small" class="webservice-key-button" v-if="!disabled" :loading="buttonLoading" @click="storeWebServiceKeys(key)">保存</el-button>
    </section>
    <section class="webservice-location item-title-content" v-if="Object.keys(locationData).length > 0">
      <!--显示IP地址-->
      <h2 class="webservice-location-ip">{{locationData.ip}}</h2>
      <!--显示国家-->
      <country-flag class="webservice-location-iso" :country='isoAlpha2' size="normal" rounded></country-flag>
      <!--显示地址信息-->
      <h2 class="webservice-location-address">{{locationData['ad_info'].name}}</h2>
    </section>
    <bar-chart :x-data="xData" :series-data="seriesData" v-if="seriesData.length > 0"></bar-chart>
  </div>
</template>

<script>
import BarChart from "./echarts/BarChart";
import { numericToAlpha2 } from 'i18n-iso-countries';
import webserviceGuide from './../guide/webservice-guide'
import googleAuthGuide from "../guide/googleAuth-guide";
export default {
  name: 'WebService',
  components: {
    BarChart
  },
  data () {
    return {
      key: '',
      inputStatus: false,
      disabled: true,
      buttonLoading: false,
      // 图表数据
      xData: [],
      seriesData: [],
      // 位置数据
      locationData: {},
      // isoAlpha2
      isoAlpha2: ''
    }
  },
  created () {
    this.getWebserviceKeys();
    this.getQpsData();
  },
  methods: {
    // 获取webservice keys
    async getWebserviceKeys () {
      const { data: { data } } = await this.$axios.get('/location/keys');
      this.key = data.key;
    },
    // 获取调用统计
    async getQpsData () {
      try {
        const { data: { data } } = await this.$axios.get('/location/limit');
        const qps = { current_qps: '当前每秒并发量', limit_qps: '每秒并发配额', current_pv: '今日调用量', limit_pv: '日请求配额' };
        if (data.status) {
          return false;
        }
        /* 设置地址回显数据 */
        this.locationData = data;
        this.isoAlpha2 = numericToAlpha2(data['ad_info'].nation_code);
        /* 设置图表数据 */
        this.xData = [];
        this.seriesData = [];
        Object.keys(qps).forEach(item => {
          this.xData.push(qps[item]);
          this.seriesData.push(data[item]);
        });
      } catch (e) {
        this.locationData = {};
        this.seriesData = [];
      }
    },
    // 编辑，保存keys
    async storeWebServiceKeys (key) {
      try {
        this.buttonLoading = true;
        await this.$axios.post('/location/store', { key });
        this.getWebserviceKeys();
        // this.$message.success('保存修改成功');
        // 获取统计数据
        this.getQpsData();
        this.resetChangeButton();
      } catch (e) {
        this.buttonLoading = false;
      }
    },
    resetChangeButton () {
      this.disabled = !this.disabled;
      this.buttonLoading = false;
      this.inputStatus = false;
    },
    changeWebServiceKeyHandle () {
      this.disabled = !this.disabled;
      this.inputStatus = true;
    },
    cancelChangeHandle () {
      this.resetChangeButton();
      this.getWebserviceKeys();
    },
    webServiceGuideHandle () {
      this.$driver.defineSteps(webserviceGuide);
      this.$driver.start();
    }
  }
}
</script>

<style scoped lang="less">
@import "./../style/webservice.less";
</style>
