<template>
  <div class="post-form-content">
    <el-form :model="postModel" class="post-form" status-icon :rules="rules" label-position="top" ref="postForm" label-width="80px">
      <el-form-item label="姓名" prop="username">
        <el-input type="text" size="small" :disabled="!comment_status" v-model="postModel.username" autocomplete="off" :placeholder="placeholder.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" size="small" :disabled="!comment_status" v-model="postModel.email" autocomplete="off" :placeholder="placeholder.email"></el-input>
      </el-form-item>
      <el-form-item prop="content">
        <span slot="label">
          评论内容
          <el-tooltip class="item" effect="dark" content="评论规范" placement="top">
            <i class="el-icon-info" @click="standardDialog = true"></i>
          </el-tooltip>
        </span>
        <el-input type="textarea" :disabled="!comment_status" :rows="5" maxlength="255" show-word-limit size="small" v-model="postModel.content" :placeholder="placeholder.content" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="comment_status && geet.success" label="验证" prop="captcha">
        <no-ssr>
          <geetest :data="geet" @on-success="geetSuccess" @on-error="geetError"></geetest>
        </no-ssr>
      </el-form-item>
      <el-form-item class="post-form-btn">
        <el-button type="info" size="small" :disabled="!comment_status" @click="submitForm('postForm')">提交</el-button>
        <el-button size="small" :disabled="!comment_status" @click="resetForm('postForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--规范声明-->
    <el-dialog
      title="评论规范"
      :close-on-click-modal="false"
      :visible.sync="standardDialog"
      width="40%">
      <div>
        违反法律法规：发布违反国家相关法律法规及「七条底线」、「九不准」管理规定的信息，包括但不限于：
        <ul style="line-height: 30px;">
          <li>反对宪法所确定的基本原则</li>
          <li>危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一</li>
          <li>损害国家荣誉和利益</li>
          <li>煽动民族仇恨、民族歧视，破坏民族团结</li>
          <li>侮辱、滥用英烈形象，否定英烈事迹，美化粉饰侵略战争行为的</li>
          <li>破坏国家宗教政策，宣扬邪教和封建迷信</li>
          <li>散布谣言，扰乱社会秩序，破坏社会稳定</li>
          <li>宣扬淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪</li>
          <li>煽动非法集会、结社、游行、示威、聚众扰乱社会秩序</li>
          <li>诽谤他人，泄露他人隐私，侵害他人合法权益</li>
          <li>含有法律、行政法规禁止的其他内容的信息</li>
        </ul>
        违反评论行为，包括但不限于：
        <ul style="line-height: 30px;">
          <li>不能涉及国家领导人、公检法军、国徽国旗等形象或词语</li>
          <li>不能借社会负面事件、热点事件、敏感事件、红歌军歌、革命烈士等进行商业营销宣传</li>
          <li>不能涉及邪教宗教、封建迷信、反动组织等相关元素</li>
          <li>不能涉及违法违规、低俗色情、血腥恐怖相关元素</li>
          <li>不能出现违反公序良俗、社会价值观相关元素，如出轨、家暴、炫富、歧视、引战、抽烟、脏话、整蛊、恶搞、虐待等</li>
        </ul>
        不友善行为，包括但不限于：
        <ul style="line-height: 30px;">
          <li>轻蔑：贬低、轻视他人及其劳动成果</li>
          <li>诽谤：捏造、散布虚假事实，损害他人名誉</li>
          <li>嘲讽：以比喻、夸张、侮辱性的手法对他人或其行为进行揭露或描述，以此来激怒他人</li>
          <li>挑衅：以不友好的方式激怒他人，意图使对方对自己的言论作出回应，蓄意制造事端</li>
          <li>羞辱：贬低他人的能力、行为、生理或身份特征，让对方难堪</li>
          <li>谩骂：以不文明的语言对他人进行负面评价</li>
          <li>歧视：针对他人的民族、种族、宗教、性取向、性别、年龄、地域、生理特征等身份或者归类的攻击</li>
          <li>威胁：许诺以不良的后果来迫使他人服从自己的意志</li>
        </ul>
        不得发布广告，包括但不限于：
        <ul style="line-height: 30px;">
          <li>发布带有商业推广性质的活动链接、二维码引导下载或买卖、QQ号、微信号、欺骗性诱导外链等</li>
        </ul>
        违规处理流程：
        <ul style="line-height: 30px;">
          <li>通过主动发现违规行为，进行评论删除</li>
        </ul>
        个人信息保护：
        <ul style="line-height: 30px;">
          <li>保护用户个人信息是一项基本原则，未经用户许可本博客将不会向第三方公开、透露个人信息</li>
          <li>不包括：用户发生重大违反规定、个人利益侵害，包括但不限于以上准则</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="standardDialog = false">我已了解</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import geetest from '~/components/geetest'
import { success } from '~/plugins/core/lib'
export default {
  components: {
    geetest
  },
  data () {
    const validateEmpty = (rule, value, callback) => {
      const keyMap = {
        username: '姓名不能为空',
        email: '邮箱不能为空',
        content: '内容不能为空'
      };
      if (value === '') {
        return callback(new Error(keyMap[ rule['fullField'] ]))
      }
      return callback()
    }
    const validateEmail = (rule, value, callback) => {
      const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if (value === '') {
        return callback(new Error('请输入您的邮箱'));
      }
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式不正确'));
      }
      return callback();
    }
    const validateCaptcha = (rule, value, callback) => {
      if (!Object.keys(this.postModel.captcha).length) {
        return callback(new Error('请进行验证'));
      }
      return callback();
    }
    return {
      placeholder: {
        username: '请输入姓名',
        email: '请输入邮箱 (不会呈现给任何人)',
        content: '请输入评论内容，注意言论。\n\n了解更多可点击上方提示图标'
      },
      postModel: {
        username: '',
        email: '',
        content: '',
        captcha: {}
      },
      geet: {},
      standardDialog: false,
      rules: {
        username: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur', required: true }
        ],
        content: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ],
        captcha: [
          { validator: validateCaptcha, trigger: 'blur', required: true }
        ]
      },
      comment_status: 1
    }
  },
  async fetch () {
    await this.getGeetestCaptcha();
    // 评论开启状态
    await this.getCommentStatus();
  },
  methods: {
    async getCommentStatus () {
      const { data: { data } } = await this.$axios.get('/comment/switch');
      if (!data.comment_status) {
        this.placeholder = { username: '', email: '', content: '评论已关闭' };
      }
      this.comment_status = data.comment_status;
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postComment();
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.postModel.captcha = {};
      // 如果存在验证
      this.geet.success && this.$captch.reset()
    },
    // 提交评论
    async postComment () {
      const { data } = await this.$axios.post('/comment', { ...this.postModel, article_id: this.$route.params.id });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: '评论成功', type: 'success' });
        this.resetForm('postForm');
        this.$emit('success')
      }
    },
    // 获取极验验证码
    async getGeetestCaptcha () {
      const { data: { data } } = await this.$axios.get('/geetest/options');
      this.geet = data;
    },
    // 将验证提交给评论
    geetSuccess (data) {
      this.postModel.captcha = data;
    },
    geetError (error) {
      this.$notify({ type: 'error', title: '错误', message: error });
    }
  }
}
</script>
<style lang="less" scoped>
.post-form-content {
  margin-bottom: 6rem;
}
.post-form {
  & /deep/ .el-form-item__label {
    padding: 0;
  }
  & .el-icon-info {
    cursor: pointer;
  }
}
.post-form-btn {
  display: flex;
  justify-content: flex-end;
  margin: 2rem 0;
}
</style>
