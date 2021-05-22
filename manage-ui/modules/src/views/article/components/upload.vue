<template>
  <div style="width: 50%">
    <el-upload
      class="site-uploader"
      name="article"
      :action="uploadOptions.address"
      :headers="uploadOptions.uploadAccessToken"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <section v-if="params.banner">
        <el-image :src="$convertURL(params.banner.link)" fit="cover" class="site-uploader-img"></el-image>
        <div class="site-img-mask" @click.stop>
          <i class="el-icon-delete" @click.stop="articleDeleteImgHandle"></i>
        </div>
      </section>
      <section v-else class="site-uploader-content">
        <i class="el-icon-plus site-uploader-icon"></i>
      </section>
    </el-upload>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
export default {
  name: 'upload',
  model: {
    prop: 'value', // 绑定的值，通过父组件传递
    event: 'change' // 自定义事件名
  },
  props: {
    value: {}
  },
  data () {
    return {
      uploadOptions: {
        address: `${process.env.VUE_APP_API_PREFIX}/article/upload`,
        uploadAccessToken: {
          Authorization: "Bearer " + sessionStorage.getItem("access_token")
        }
      },
      params: {
        banner: ''
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        this.params.banner = val;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleAvatarSuccess (res) {
      this.params.banner = res.data;
      this.$emit('change', this.params.banner)
    },
    beforeAvatarUpload (file) {
      const reg = /^image\/(jpeg|png|jpg)$/.test(file.type);
      if (!reg) {
        this.$message.error('上传头像图片只能是 JPG, jpeg, png 格式!');
      }
      return reg;
    },
    async articleDeleteImg (params) {
      const { data } = await this.$axios.post('/article/upload/delete', { id: params.id });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.params.banner = '';
        this.$emit('change', this.params.banner)
      }
    },
    articleDeleteImgHandle () {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.articleDeleteImg(this.params.banner);
      }).catch(() => {});
    }
  }
}
</script>

<style scoped lang="less">
.site-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  width: 100%;
  height: 300px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409EFF;
  }
}
.site-uploader-img {
  width: 100%;
  height: 300px;
  position: relative;
}
.site-img-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 999;
  display:flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 1;
    background: rgba(101, 101, 101, 0.6);
    transition: all .3s ease-in-out;
    cursor: pointer;
  }
  & .el-icon-delete {
    color: #fff;
    font-size: 38px;
  }
}
.site-uploader-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.site-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
