<template>
  <div>
    <el-row :gutter="40" class="statistics-row-box">
      <el-col :xs="12" :sm="12" :md="12" :lg="6">
        <section class="row-content">
          <section class="row-content-flex">
            <i class="icon iconfont icon-database"></i>
            <div class="serviceDetail-info">
              <p class="serviceDetail-info-title">主机名称</p>
              <p class="serviceDetail-info-data">{{ serviceDetail.nodename }}</p>
            </div>
          </section>
        </section>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="6">
        <section class="row-content">
          <section class="row-content-flex">
            <i class="icon iconfont icon-time"></i>
            <div class="serviceDetail-info">
              <p class="serviceDetail-info-title">系统运行时间</p>
              <p class="serviceDetail-info-data">{{ serviceDetail.runtime }}</p>
            </div>
          </section>
        </section>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="6">
        <section class="row-content">
          <section class="row-content-flex">
            <i class="icon iconfont icon-neicun"></i>
            <div class="serviceDetail-info">
              <p class="serviceDetail-info-title">内存总数</p>
              <p class="serviceDetail-info-data">{{ serviceDetail.memoryTotal }}</p>
            </div>
          </section>
        </section>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="6">
        <section class="row-content">
          <section class="row-content-flex">
            <i class="icon iconfont icon-cpu"></i>
            <div class="serviceDetail-info">
              <p class="serviceDetail-info-title">CPU核心数</p>
              <p class="serviceDetail-info-data">{{ serviceDetail.cpuTotal }}</p>
            </div>
          </section>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'statistics',
  components: {
  },
  data () {
    return {
      serviceDetail: {
        instance: '',
        job: '',
        nodename: '',
        runtime: '',
        memoryTotal: '',
        cpuTotal: ''
      }
    }
  },
  created () {
    this.$socket.emit('GET_SERVICE_DETAIL');
    this.$socket.on('SERVICE_DETAIL', data => {
      Object.keys(data).forEach(item => {
        this.serviceDetail[item] = data[item] || 'N/A'
      });
    });
  }
}
</script>

<style scoped lang="less">
.statistics-row-box {
  margin: 30px 0;
}
.row-content {
  height: 120px;
  background:#fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
}
.row-content-flex {
  display:flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  & .icon-database {
    font-size: 60px;
    color:#40d1e7;
    margin-left: 1rem;
  }
  & .icon-cpu {
    font-size: 60px;
    color:#8fc9fb;
    /*color: #40c9c6;*/
    margin-left: 1rem;
  }
  & .icon-neicun {
    .icon-cpu;
    color: #34bfa3;
  }
  & .icon-time {
    .icon-cpu;
    color: #86868b;
  }
}
/* 信息样式 */
.serviceDetail-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  margin-right: 1.5rem;
  & .serviceDetail-info-title {
    margin: 0;
    padding: 0;
    font-size: 16px;
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.45);
    font-weight: 700;
  }
  & .serviceDetail-info-data {
    font-size: 14px;
    font-weight: 700;
    margin: 0;
    padding: 0;
    color:#666;
  }
}
</style>
