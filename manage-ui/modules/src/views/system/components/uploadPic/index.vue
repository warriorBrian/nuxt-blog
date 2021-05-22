<template>
  <div class="uploadPic-content">
    <div class="panel">
      <h3 class="item-title no-select">图片上传配置</h3>
      <section class="item-title-content item-style">
        <div class="uploadPic-storage">
          <span>图片上传方式:</span>
          <el-select class="uploadPic-storage-mode" v-model="uploadPicType" @change="changeUploadPicTypeHandle" size="mini" placeholder="请选择图片上传方式">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <section class="uploadPic-storage-components" v-if="uploadPicType === 'qiniu'">
          <qiniu></qiniu>
        </section>
<!--        <el-button type="primary" size="small">保存</el-button>-->
      </section>
    </div>
  </div>
</template>

<script>
import qiniu from './qiniu';
import { success } from '@/plugins/core/lib';
export default {
  components: {
    qiniu
  },
  name: 'index',
  data () {
    return {
      uploadPicType: 'local',
      options: [
        {
          value: 'local',
          label: '本地存储'
        },
        {
          value: 'qiniu',
          label: '七牛云存储'
        }
      ]
    }
  },
  created () {
    this.getUploadPicType();
  },
  methods: {
    async getUploadPicType () {
      const { data: { data } } = await this.$axios.get('/uploadPic');
      this.uploadPicType = data.type;
    },
    async changeUploadPicTypeHandle (type) {
      const { data } = await this.$axios.post('/uploadPic', { type });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
      }
    }
  }
}
</script>

<style scoped lang="less">
.uploadPic-storage {
  display:flex;
  align-items: center;
  justify-content: flex-start;
}
.uploadPic-storage-mode {
  margin-left: 10px;
}
.uploadPic-storage-components {
  width: 500px;
}
</style>
