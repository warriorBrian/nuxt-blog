<template>
  <div>
    <section>
      <h3 class="item-title no-select">敏感词管理</h3>
      <el-upload
        class="sensitive-upload"
        drag
        :limit="10"
        :file-list="fileList"
        :action="uploadOptions.address"
        :headers="uploadOptions.uploadAccessToken"
        :on-success="uploadSuccessHandle"
        :on-exceed="uploadExceedHandle"
        :before-remove="beforeRemoveHandle"
        name="keywords"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip sensitive-upload-tips" slot="tip">只允许上传txt文件，且不宜过大</div>
      </el-upload>
    </section>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
export default {
  name: 'sensitiveManage',
  data () {
    return {
      fileList: [],
      // 增加数组,利用深拷贝同步fileList
      uploadedFiles: [],
      uploadOptions: {
        address: `${process.env.VUE_APP_API_PREFIX}/comment/upload`,
        uploadAccessToken: {
          Authorization: "Bearer " + sessionStorage.getItem("access_token")
        }
      }
    }
  },
  watch: {
    uploadedFiles: {
      handler (val) {
        this.$emit('files', val);
      },
      deep: true
    }
  },
  created () {
    this.initialSensitiveList();
  },
  methods: {
    // 初始化敏感词列表
    async initialSensitiveList () {
      const { data: { data } } = await this.$axios.get('/comment/upload/list');
      const value = data.list.map(item => ({ name: item['original_name'], id: item.id }));
      this.fileList = value;
      // 利用深拷贝同步fileList
      this.uploadedFiles = value;
    },
    // 上传成功触发
    async uploadSuccessHandle (response, file) {
      /**
       * 额外定义变量，对uploadedFiles进行操作
       * 利用深拷贝同步fileList
       * 不对fileList进行直接操作，否则会存在闪烁效果等
       * */
      this.uploadedFiles.push({ ...response.data, uid: file.uid });
      if (success(response.code)) {
        this.$notify({ title: '成功', message: '上传成功', type: 'success' });
      }
    },
    // 超出最大限制触发
    uploadExceedHandle () {
      this.$notify({ title: '失败', message: '超出上传最大数: 10', type: 'error' });
    },
    // 删除之前触发
    beforeRemoveHandle (file) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // confirm
        this.removeFileHandle(file);
      }).catch(() => {
        // cancel
        return false;
      });
      return false;
    },
    // 删除文件操作
    async removeFileHandle (file) {
      const { data } = await this.$axios.delete('/comment/upload/delete', { data: { id: file.id } });
      if (success(data.code)) {
        // 删除成功后，移除视图层文件列
        const index = this.fileList.findIndex(v => file.id === v.id);
        this.fileList.splice(index, 1);
        this.$notify({ title: '成功', message: data.message, type: 'success' });
      }
    }
  }
}
</script>

<style scoped lang="less">
.sensitive-upload {
  width: 360px;
  margin-bottom: 40px;
}
.sensitive-upload-tips {
  color: #C0C4CC;
}
</style>
