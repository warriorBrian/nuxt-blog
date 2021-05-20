<template>
  <div>
    <!--配置展示-->
    <section>
      <div class="qiniu-show-config">
        <span class="qiniu-show-config-key">AccessKey (AK):</span>
        <span class="qiniu-show-config-value">{{config['qiniu_accessKey'] | handlerValue}}</span>
        <el-tooltip class="item" effect="dark" content="配置七牛云" placement="top">
          <i class="el-icon-edit qiniu-edit-icon" @click="changeQiniuConfigHandle"></i>
        </el-tooltip>
      </div>
      <div class="qiniu-show-config">
        <span class="qiniu-show-config-key">SecretKey (SK):</span>
        <span class="qiniu-show-config-value">{{config['qiniu_secretKey'] | handlerValue}}</span>
      </div>
      <div class="qiniu-show-config">
        <span class="qiniu-show-config-key">使用空间:</span>
        <span class="qiniu-show-config-value">{{config['qiniu_bucket'] | handlerValue}}</span>
      </div>
      <div class="qiniu-show-config">
        <span class="qiniu-show-config-key">使用域名:</span>
        <span class="qiniu-show-config-value">{{config['qiniu_domain'] | handlerValue}}</span>
      </div>
    </section>
    <!--七牛云drawer-->
    <section>
      <el-drawer
        class="qiniu-drawer"
        title="七牛云存储空间配置"
        :visible.sync="drawer"
        :direction="'rtl'"
        :wrapperClosable="false">
        <div class="qiniu-drawer-content">
          <el-steps :active="active" finish-status="success" class="qiniu-steps">
            <el-step title="设置AK/SK"></el-step>
            <el-step title="配置上传空间"></el-step>
            <el-step title="选择域名"></el-step>
          </el-steps>
          <section v-if="active === 0" class="qiniu-config-content">
            <div class="qiniu-config">
              <span class="qiniu-config-title">AK:</span>
              <el-input v-model="editConfig['qiniu_accessKey']" size="small" class="qiniu-config-input"></el-input>
            </div>
            <div class="qiniu-config">
              <span class="qiniu-config-title">SK:</span>
              <el-input v-model="editConfig['qiniu_secretKey']" size="small" class="qiniu-config-input"></el-input>
            </div>
            <span class="qiniu-tips">
              在七牛云中创建空间，正确配置AK/SK，下一步则会获取账户下所有的空间，配置过程中出现错误请参考:
              <el-link type="primary" :underline="false" href="https://developer.qiniu.com/kodo/3928/error-responses" target="_blank">错误响应</el-link>
            </span>
          </section>
          <section v-if="active === 1" class="qiniu-config-content">
            <div class="qiniu-config">
              <span class="qiniu-config-title">配置存储空间:</span>
              <el-select v-model="editConfig['qiniu_bucket']" placeholder="请选择存储空间" size="small">
                <el-option
                  v-for="(items, index) in bucketList"
                  :key="index"
                  :label="items"
                  :value="items">
                </el-option>
              </el-select>
            </div>
            <span class="qiniu-tips">
              选择图片存储空间，请先在七牛云中创建空间，空间需要绑定域名，请先绑定域名完成整体配置。
            </span>
          </section>
          <section v-if="active === 2" class="qiniu-config-content">
            <div class="qiniu-config">
              <span class="qiniu-config-title">配置域名前缀:</span>
              <el-select v-model="editConfig['qiniu_domain']" @change="getQiniuDomain" placeholder="请选择域名" size="small">
                <el-option
                  v-for="(items, index) in domainList"
                  :key="index"
                  :label="items"
                  :value="items">
                </el-option>
              </el-select>
            </div>
            <span class="qiniu-tips">
              选择使用域名，上传图片以后会以此域名进行作为前缀，不对历史数据生效。
            </span>
          </section>
          <section class="qiniu-content-btn">
            <el-button type="default" size="small" @click="previous" v-if="active > 0">上一步</el-button>
            <el-button type="primary" size="small" @click="next">{{active > 1 ? '完成' : '下一步' }}</el-button>
          </section>
        </div>
      </el-drawer>
    </section>
<!--    <el-button type="default" size="small" @click="drawer = !drawer">打开</el-button>-->
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
export default {
  name: 'qiniu',
  data () {
    return {
      drawer: false,
      active: 0,
      count: 0,
      config: {},
      editConfig: {},
      bucketList: [],
      domainList: []
    }
  },
  filters: {
    handlerValue (val) {
      return val || '暂无';
    }
  },
  created () {
    this.getQiniuConfig();
  },
  methods: {
    changeQiniuConfigHandle () {
      this.active = 0;
      this.count = 0;
      this.drawer = true;
    },
    async getQiniuConfig () {
      const { data: { data } } = await this.$axios.get('/uploadPic/qiniu');
      this.config = Object.assign({}, data);
      // 设置编辑回显
      this.editConfig = Object.assign({}, data);
    },
    previous () {
      this.active !== 0 && this.active--;
      this.count--;
      if (this.active === 0) {
        this.count = 0;
      }
      console.log(this.count, 'count');
    },
    next () {
      this.active < 2 && this.active++;
      this.count < 3 && this.count++;
      if (this.active === 1) {
        // 第二步，根据AK/SK获取bucket列表
        this.getQiniuBucket();
      }
      if (this.count === 2) {
        // 配置完bucket之后获取domain
        this.getQiniuDomain(this.editConfig['qiniu_bucket']);
      }
      if (this.count === 3) {
        // 点击完成触发
        this.setQiniuConfig();
      }
    },
    async getQiniuService (args) {
      const { qiniu_accessKey, qiniu_secretKey } = this.editConfig;
      return await this.$axios.post('/uploadPic/qiniu/service', { ak: qiniu_accessKey, sk: qiniu_secretKey, ...args });
    },
    // 获取七牛云bucket列表
    async getQiniuBucket () {
      try {
        const { data: { data } } = await this.getQiniuService({ type: 'bucket' });
        this.bucketList = data.list;
      } catch (e) {
        this.bucketList = [];
        this.active = 0;
      }
    },
    // 获取七牛云domain列表
    async getQiniuDomain (bucket) {
      try {
        const { data: { data } } = await this.getQiniuService({ type: 'domain', scope: bucket });
        this.domainList = data.list;
      } catch (e) {
        this.domainList = [];
        this.active = 1;
      }
    },
    // 设置七牛云配置信息
    async setQiniuConfig () {
      const { data } = await this.$axios.post('/uploadpic/qiniu', { ...this.editConfig });
      if (success(data.code)) {
        this.$notify({ title: '配置成功', message: data.message, type: 'success' });
        this.drawer = false;
        this.getQiniuConfig();
      }
    }
  }
}
</script>

<style scoped lang="less">
.qiniu-steps {
  margin-bottom: 30px;
  & /deep/ .el-step__title {
    font-size: 14px;
  }
}
.qiniu-config-content {
  height: 80%;
  border: 1px solid #fff;
}
.qiniu-drawer-content {
  padding: 20px 20px 0 20px;
  height: 100%;
}
.qiniu-content-btn {
  display:flex;
  align-items: center;
  justify-content: flex-end;
}
.qiniu-tips {
  font-size: 12px;
  color: #8c8c8c;
  & a {
    font-size: 12px;
  }
}
.qiniu-show-config {
  .qiniu-config;
  & .qiniu-show-config-key {
    display:block;
    width: 120px;
  }
  // 编辑配置图标
  & .qiniu-edit-icon {
    font-size: 16px;
    color:#303133;
    margin-left: 10px;
    cursor: pointer;
    outline: none;
  }
  & .qiniu-show-config-value {
    margin-left: 10px;
  }
}
.qiniu-config {
  display:flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0;
  & .qiniu-config-title {
    margin-right: 10px;
  }
  & .qiniu-config-input {
    width: 360px;
  }
}
.qiniu-drawer {
  /*padding: 0 20px;*/
  & /deep/ .el-drawer {
    outline: none;
  }
  & /deep/ .el-drawer__header {
    span {
      outline: none;
    }
  }
}
</style>
