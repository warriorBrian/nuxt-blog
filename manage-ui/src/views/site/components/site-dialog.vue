<template>
  <div>
    <el-dialog :title="title" :visible.sync="siteDialogVisible" :close-on-click-modal="false" @close="siteDialogClose" @open="siteDialogOpen" width="30%">
      <el-form :model="siteModel" :default-expand-all="true" status-icon ref="siteForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input type="text" size="small" maxlength="20" show-word-limit v-model="siteModel.title" auto-complete="off" :placeholder="placeholder.title"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="siteModel.type" v-if="siteModel.type === 'index'" :disabled="siteModel.type !== 'index'" label="index">首页</el-radio>
          <el-radio v-model="siteModel.type" :disabled="siteModel.type === 'index'" label="navigation">导航</el-radio>
        </el-form-item>
        <el-form-item label="所属子集" v-if="siteModel.type !== 'index'">
          <el-select v-model="siteModel.parentId" :disabled="isDisabled(siteModel)" :placeholder="placeholder.parentId" class="site-dialog-select" size="small">
            <el-option
              v-for="(items, index) in typeLists"
              :key="index"
              :label="items.title"
              :value="items.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主标题" prop="desc">
          <el-input type="textarea" :rows="3" maxlength="50" show-word-limit v-model="siteModel.desc" auto-complete="off" :placeholder="placeholder.desc"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subDesc">
          <el-input type="textarea" :rows="3" maxlength="50" show-word-limit v-model="siteModel.subDesc" auto-complete="off" :placeholder="placeholder.subDesc"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型" prop="linkType">
          <el-radio-group v-model="siteModel.linkType">
            <el-radio :label="0">站内跳转</el-radio>
            <el-radio :label="1">新窗口打开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导航链接" prop="link">
          <el-input type="text" size="small" v-model="siteModel.link" :disabled="siteModel.type === 'index'" auto-complete="off" :placeholder="placeholder.link"></el-input>
        </el-form-item>
        <el-form-item label="banner图" prop="banner">
          <el-upload
            class="site-uploader"
            name="site"
            :action="uploadOptions.address"
            :headers="uploadOptions.uploadAccessToken"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <section v-if="siteModel.banner">
              <el-image :src="$convertURL(siteModel.banner.link)" fit="cover" class="site-uploader-img"></el-image>
<!--              <el-image :src="$convertURL('/static/site/site-1618548526421-818647525.png')" fit="cover" class="site-uploader-img"></el-image>-->
              <div class="site-img-mask" @click.stop>
                <i class="el-icon-delete" @click.stop="siteDeleteImgHandle"></i>
              </div>
            </section>
            <section v-else class="site-uploader-content">
              <i class="el-icon-plus site-uploader-icon"></i>
            </section>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="siteDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="tagsDialogHandle" size="small">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateFormat, success } from '@/plugins/core/lib';
export default {
  name: 'site-dialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    edit: {
      type: String,
      default: 'create'
    },
    data: {
      type: Object,
      default: () => ({})
    },
    typeCollections: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    const validateEmpty = (rule, value, callback) => {
      const emptyMapping = {
        title: '名称不能为空'
      };
      if (value === '') {
        return callback(new Error(emptyMapping[rule['fullField']]))
      }
      return callback();
    };
    const validateNavigation = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('导航链接不能为空'));
      }
      if (!validateFormat(value, ['domain', 'router'])) {
        return callback(new Error('导航链接必须是vue路由path或一个完整的url链接'));
      }
      return callback();
    };
    return {
      siteDialogVisible: false,
      siteModel: {
        title: '',
        type: 'navigation',
        parentId: '',
        desc: '',
        subDesc: '',
        link: '',
        linkType: 0,
        banner: ''
      },
      typeLists: [],
      rules: {
        title: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ],
        link: [
          { validator: validateNavigation, trigger: 'blur', required: true }
        ]
      },
      placeholder: {
        title: '请输入导航名称，名称不宜过长',
        parentId: '请选择所属子集 (如果不选或选择父级则为一级)',
        desc: '主标题为banner图居中显示文字(首行)\n建议输入十字以内文字保持简介效果更好',
        subDesc: '副标题为banner图居中显示第二行文字',
        link: '链接地址为路由path或者URL链接'
      },
      uploadOptions: {
        address: `${process.env.VUE_APP_API_PREFIX}/site-config/upload`,
        uploadAccessToken: {
          Authorization: "Bearer " + sessionStorage.getItem("access_token")
        }
      }
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.siteDialogVisible = val;
      },
      deep: true
    },
    data: {
      handler (val) {
        this.siteModel = val;
        console.log(val, 'val');
      },
      deep: true
    },
    typeCollections: {
      handler (val) {
        // 设置下拉框值时，排除当前自己数据，自身不能设置自身为父子级
        this.typeLists = val.filter(v => v.id !== this.data.id);
      },
      deep: true
    }
  },
  computed: {
    title () {
      const titleMapping = {
        'create': '创建站点配置',
        'edit': '编辑站点配置'
      };
      return titleMapping[this.edit];
    },
  },
  methods: {
    siteDialogClose () {
      this.$refs['siteForm'] && this.$refs['siteForm'].resetFields();
      this.$emit('update:status', false);
    },
    siteDialogOpen () {
      this.$emit('open')
    },
    tagsDialogHandle () {
      this.$refs['siteForm'].validate((valid) => {
        if (valid) {
          this.$emit('success', { ...this.siteModel }, this.edit);
        }
      });
    },
    handleAvatarSuccess (res) {
      this.siteModel.banner = res.data;
    },
    beforeAvatarUpload (file) {
      const reg = /^image\/(jpeg|png|jpg)$/.test(file.type);
      if (!reg) {
        this.$message.error('上传头像图片只能是 JPG, jpeg, png 格式!');
      }
      return reg;
    },
    siteDeleteImgHandle () {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.siteDeleteImg(this.siteModel.banner);
      }).catch(() => {});
    },
    async siteDeleteImg (params) {
      const { data } = await this.$axios.post('/site-config/upload/delete', { id: params.id });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.siteModel.banner = '';
      }
    },
    isDisabled (value) {
      // 判断如果children存在，或者children的长度大于0则认为是包含子集
      // 如果包含子集，并且parentId为0，则视为父级，条件成立时，则无法将父级进行分配给某个父级作为子集。
      const status = (value.children && value.children.length) || value.parentId === 0;
      return Boolean(status);
    }
  }
}
</script>

<style scoped lang="less">
.site-dialog-select {
  width: 100%;
}
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
