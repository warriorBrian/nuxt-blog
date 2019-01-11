<template>
<div>
  <Row>
  <!-- 左侧 -->
  <Col span="19">
    <Icon type="md-close"></Icon>
    <label for="title" class="article">撰写新文章</label>
    <Input v-model="collections.title" size="large" placeholder="在此输入文章标题" name="title" class="article_title"></Input>
    <label for="title" class="article">文章简介</label>
    <Input v-model="collections.des" size="large" placeholder="在此输入文章标题" name="title" class="article_title"></Input>
    <Row>
          <Col span="10" style="margin-bottom:20px;">
            <Card>
              <div v-if="img.path">
                <Poptip @on-ok="confirmDelete" confirm title="您确定要删除么？" style="width:100%;">
          <i class="icon iconfont icon-guanbi"></i>
                </Poptip>
                <div style="text-align:center">
                  <img :src="img.path" alt="" style="background-size:cover;max-width:100%;height:128px;">
                  <h3>{{img.filename}}</h3>
                </div>
              </div>
              <div v-else>
                <h3 style="text-align: center;">上传Banner图</h3>
                <Upload multiple type="drag" :on-success="uploadSuccess" :on-error="uploadError" :data="{id: $route.params.id, radio: collections.radio}" action="http://localhost:3000/api/upload" :show-upload-list="false" :format="['jpg','jpeg','png']">
                  <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击上传或拖拽上传Banner图</p>
                  </div>
                </Upload>
              </div>
            </Card>
          </Col>
        </Row>
    <mavon-editor @change="changeContent" @save="save" class="article_content" v-model="collections.content" fontSize="18px" placeholder="开始编写文章内容..." style="min-height:600px;" />
    <Button type="warning" class="article_button" @click="submitArticle">修改文章</Button>
  </Col>
  <!-- 右侧 -->
  <Col span="4" offset="1" class="content_right">
    <Card class="card">
      <label for="date" class="article" slot="title">发布日期</label>
              <DatePicker @on-change="dateContent" :value="collections.date" type="date" name="date" size="large" class="data_picker" placeholder="Select date" style="width:100%;"></DatePicker>
          </Card>
    <Card class="card">
              <p slot="title">分类目录</p>
      <RadioGroup v-model="collections.radio" vertical>
            <Radio label="Front">
                <i class="iconfont icon-h5"></i>
                <span class="list_menu">前端开发</span>
            </Radio>
            <Radio label="Back">
                <Icon class="iconfont icon-nodejs"></Icon>
                <span class="list_menu">后端开发</span>
            </Radio>
            <!--<Radio label="about-me">-->
                <!--<Icon class="iconfont icon-guanyuwomen"></Icon>-->
                <!--<span class="list_menu">关于我</span>-->
            <!--</Radio>-->
        </RadioGroup>
      </Card>
  </Col>
</Row>
</div>
</template>
<script>
export default {
  data () {
    return {
      collections: {
        title: '',
        content: '',
        htmlContent: '',
        date: FormatDate(new Date()),
        radio: '',
        contentValue: '',
        des: '',
        original: '',
        id: ''
      },
      img: {
        path: '',
        filename: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let id = this.$route.params.id
      this.$axios.get('/api/article/update', {params: {id}}).then(res => {
        let {data: [{_id, title, des, original, time, list}]} = res
        console.log(res.data)
        Object.assign(this.collections, {id: _id, title, des, content: original, date: time, radio: list})
        this.defaultRequest()
      })
    },
    uploadSuccess (file) {
      this.success(`上传成功`, `上传banner图成功`, false)
      Object.assign(this.img, file)
    },
    uploadError (error, file) {
      this.error(`出现错误`, `错误信息：${error},${file}`, false)
    },
    changeContent (value, render) {
      this.collections.htmlContent = render
      this.collections.original = value
    },
    async confirmDelete () {
      /* 删除 */
      try {
        let {data: {status, result: {nModified}}} = await this.$axios.post('/api/deleteFile', {id: this.$route.params.id, radio: this.collections.radio})
        if (Object.is(status, 200)) {
          this.defaultRequest()
          this.success(`删除成功`, `删除${nModified}个文件`, false)
        }
      } catch (error) {
        this.error(`发生错误`, `${error}`, false)
      }
    },
    async defaultRequest () {
      /* 获取显示图片 */
      let {data: {result}} = await this.$axios.post('/api/findOneArticle', {id: this.$route.params.id, radio: this.collections.radio})
      if (Object.is(result.banner, undefined)) {
        Object.assign(this.img, {path: '', filename: ''})
      } else {
        Object.assign(this.img, {path: result.banner, filename: result.imgFileName})
      }
    },
    save (value, render) {
      this.collections.htmlContent = render
      this.collections.original = value
      this.submitArticle()
    },
    submitArticle () {
      if (Object.is(this.title, '')) {
        this.error('文章标题留空无法保存', '请仔细检查文章标题', false)
      } else {
        this.$axios.post(`/api/article/insert${this.collections.radio}`, this.collections).then(res => {
          let {error} = res.data
          console.log(res.data)
          if (Object.is(error, 0)) {
            this.success('修改成功', '', true)
          } else {
            this.error('修改失败', '未知原因', false)
          }
        })
      }
    },
    dateContent (val) {
      this.date = FormatDate(val)
    },
    error (title, content, nodesc) {
      this.$Notice.error({
        title: title,
        desc: nodesc ? '' : content
      })
    },
    success (title, content, nodesc) {
      this.$Notice.success({
        title: title,
        desc: nodesc ? '' : content
      })
    }
  }
}
/* 封装格式化日期 */
function FormatDate (strTime) {
  var date = new Date(strTime)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
</script>
<style>
    @import './../../assets/css/admin/article.less';
</style>
