<template>
  <div>
    <nav-header :active="active"></nav-header>
    <el-row type="flex" justify="center">
      <el-col :span="14" class="detail_title">
          <div>{{title}}</div>
          <div class="time">发布时间：{{time}}&nbsp;&nbsp;&nbsp;&nbsp;分类：{{list === 'Front' ? '前端文章' : '后端文章'}}</div>
      </el-col>

    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="14" class="detail_content">
        <div v-show="!content">暂无文章数据...</div>
        <div v-html="content" class="md markdown-body"></div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="14">
        <h2 style="color:#3D5064;border-top:1px dashed #3D5064;padding-top:15px;margin-top:30px;">发表评论：</h2>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="15" class="detail_content" style="margin-left:-63px;">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="ruleForm.email" autocomplete="off" placeholder="请输入邮箱 (不会呈现给任何人)"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" :rows="8" v-model="ruleForm.content" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="detail_content">
      <el-col :span="14">
        <el-card class="box-card" v-for="o in 4" :key="o">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;">Brian <el-tag type="success">作者</el-tag> 说：</span>
            <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            <span style="float: right; padding: 3px 0;font-weight: bold;"><Time :time="time3" :interval="1" /></span>
          </div>
          <div>
            aaaaa
            <el-button type="primary" @click="commentLists($route.params.id)">提交</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NavHeader from '~/components/NavHeader.vue';
import {baseurl} from '~/plugins/url.js';
import Time from '~/plugins/time'
import Vue from 'vue'
export default {
	data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      } else {
        callback()
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的邮箱'));
      } else {
        callback();
      }
    };
    var validateContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入评论内容'));
      } else {
        callback();
      }
    };
		return {
      active:'index',
      ruleForm: {
        username: '',
        email: '',
        content: ''
      },
      rules: {
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        content: [
          { validator: validateContent, trigger: 'blur' }
        ]
      },
      time3: new Date().getTime()
    }
	},
	async asyncData({app,params}) {
		let json = {id:params.id}
		let result = await app.$axios.get(`${baseurl}/api/article/getFrontArticleInfo`,{params:json});
    let {error,info} = result.data;
    let {content,des,list,time,title} = info[0];
		return {title,des,content,list,time}
	},
  head() {
		return {
			title:this.title,
      meta:[
				{hid:'description',name:'description',content:`${this.des}`},
				{hid:'author',content:'brian'}
			]
		}
	},
  components:{
    NavHeader,
    Time
  },
  mounted () {
	  this.commentLists(this.$route.params.id)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let json = Object.assign({}, {comment: Object.assign(this.ruleForm, {time: new Date().getTime()}), id: this.$route.params.id})
          this.commentsSubmit(json, formName)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async commentsSubmit (json, formName) {
      try {
        let {data: {result: {ok}}} = await this.$axios.post(`${baseurl}/api/comment`, json)
        if (Object.is(ok, 1)) {
          this.$refs[formName].resetFields()
          this.$notify({
            title: '评论成功',
            message: '发布评论成功，请注意言论',
            type: 'success'
          });
        }
      } catch (error) {
        // handle error
      }
    },
    async commentLists (id) {
      try {
        let result = await this.$axios.post(`${baseurl}/api/articleComments`, {id: '5c3e9e2b39bb0c39ddac508f'})
        console.log(result)
      } catch (error) {
        // handle error
      }
    }
  }
}
</script>
<style lang="less">
  @import './../../assets/css/Index/Detail.less';
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    border:1px solid #dcdfe6 !important;
    border-radius: 5px;
    margin-bottom:1rem;
  }
  .el-card__body {
    background:rgb(248, 248, 248) !important;
  }
  .el-tag {
    padding:0 6px !important;
    height:25px !important;
    line-height: 25px !important;
  }
</style>
