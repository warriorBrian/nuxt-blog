<template>
  <div>
    <el-form :model="params" status-icon :rules="rules" :label-position="'top'" ref="ArticleForm" label-width="100px" class="articleComponent-form">
      <el-form-item label="标题" class="articleComponent-form-item" prop="title">
        <el-input type="text" v-model="params.title" maxlength="50" show-word-limit size="small" autocomplete="off" :placeholder="placeholder.title"></el-input>
      </el-form-item>
      <el-form-item label="标签" class="articleComponent-form-item" prop="tags">
        <custom-tags v-model="params.tag_id" :data="tagRequestLists" @visible-change="customTagsVisibleChange"></custom-tags>
      </el-form-item>
      <el-form-item label="图片" class="articleComponent-form-item">
        <upload v-model="params.banner"></upload>
      </el-form-item>
      <el-form-item label="简介" class="articleComponent-form-item" prop="introduction">
        <el-input type="textarea" :rows="4" maxlength="144" show-word-limit v-model="params.introduction" size="small" autocomplete="off" :placeholder="placeholder.introduction"></el-input>
      </el-form-item>
      <el-form-item label="内容" class="articleComponent-form-item" prop="original">
        <mavon-editor ref="mavonEditor" v-model="params.original" :toolbars="toolBars" fontSize="18px" :placeholder="placeholder.original" class="article-mavon-editor" @change="mavonEditorChangeHandle" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
      </el-form-item>
      <el-form-item>
        <section class="articleComponent-btn-group">
          <el-button :type="edit ? 'success' : 'primary'" :icon="articleBtnIconStyle" size="small" round @click="ArticleHandle('ArticleForm')">{{articleBtn}}</el-button>
        </section>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
 * @desc props description
 * @param edit {boolean} 区分编辑、新建关键字段 default false
 * */
import toolBars from './../../common/mavonEditorToolBars'
import { success } from '@/plugins/core/lib';
import customTags from './Tags'
import upload from "./upload";
export default {
  name: 'articleComponent',
  components: {
    customTags,
    upload
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: function () {
        return { title: '', introduction: '', original: '' }
      }
    }
  },
  watch: {
    formData: {
      handler (val) {
        if (this.edit) {
          this.params = Object.assign({}, val, { tag_id: val['tags'] });
        }
      },
      deep: true
    }
  },
  computed: {
    articleBtnIconStyle () {
      return this.edit ? 'el-icon-success' : 'el-icon-s-promotion'
    },
    articleBtn () {
      return this.edit ? '提交编辑' : '发布文章';
    }
  },
  created () {
    this.getTagLists();
  },
  data () {
    const validatePass = (rule, value, callback) => {
      const mappingError = {
        title: '文章标题不能为空',
        introduction: '文章简介不能为空',
        original: '文章内容不能为空'
      };
      if (value === '') {
        return callback(new Error(mappingError[rule['field']]));
      }
      callback();
    };
    return {
      toolBars,
      params: {
        title: '',
        introduction: '',
        content: '',
        original: '',
        tag_id: [],
        banner: ''
      },
      rules: {
        title: [
          { validator: validatePass, trigger: 'blur' }
        ],
        introduction: [
          { validator: validatePass, trigger: 'blur' }
        ],
        original: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      placeholder: {
        title: '请输入文章标题',
        introduction: '请输入文章简介',
        original: '请输入文章内容'
      },
      imagesMapping: {},
      tagLists: [],
      tagRequestLists: []
    }
  },
  methods: {
    async getTagLists () {
      const { data: { data } } = await this.$axios.get('/archive/tag', { params: { 'no-pagination': true } });
      this.tagRequestLists = data;
    },
    // 自定义tags组件下拉框打开时触发
    customTagsVisibleChange (visible) {
      if (visible) {
        this.getTagLists();
      }
    },
    mavonEditorChangeHandle (val, render) {
      this.params.content = render;
    },
    resetFields () {
      this.$refs['ArticleForm'].resetFields();
      this.params.tag_id = [];
      this.params.banner = '';
    },
    ArticleHandle (ref) {
      this.$refs[ref].validate((valid) => {
        const value = Object.assign({}, this.params, { tag_id: this.params.tag_id.map(v => v.id) });
        valid && this.$emit('success', value);
      });
    },
    imgAdd (pos, file) {
      const formData = new FormData();
      formData.append('article', file);
      this.$axios({
        url: '/article/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*'
        }
      }).then(res => {
        const { id, link } = res.data.data;
        // 为了兼容本地开发环境，使用转换函数进行地址转换
        const uri = this.$convertURL(link);
        this.$refs['mavonEditor'].$img2Url(pos, uri);
        this.imagesMapping[uri] = id;
      });
    },
    async imgDel ([index]) {
      const id = this.imagesMapping[index];
      const { data } = await this.$axios.post('/article/upload/delete', { id });
      if (success(data.code)) {
        delete this.imagesMapping[index];
        this.$notify({ title: '成功', message: data.message, type: 'success' });
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .article-mavon-editor {
  min-height: 750px;
  z-index: 1;
}
.articleComponent-form {
  margin-top: 20px;
}
.articleComponent-form-item {
  /deep/ label {
    font-size: 20px;
  }
}
.articleComponent-btn-group {
  width: 100%;
  display:flex;
  justify-content: flex-end;
}
</style>
