<template>
  <div>
	  <Row type="flex" justify="start">
          <Col span="12" offset="1">
			  <span>版本号：</span>
              <Input v-model="version" size="large" placeholder="输入版本号，例如:1.0.0"></Input>
          </Col>
	  </Row>
	  <Row type="flex" justify="center">
          <Col span="22">
              <mavon-editor @change="changeContent" class="version_content" v-model="content" fontSize="18px" placeholder="# 发布版本内容" style="min-height:600px;" />

			  <Button type="success" class="version_button" @click="sublimtContent">发布新版本</Button>
          </Col>
	  </Row>
  </div>
</template>

<script>
export default {
	data() {
		return {
			version:'1.0.0',
			content:'',
			htmlContent:''
		}
	},
	methods:{
		changeContent(content,render) {
			this.htmlContent = render;
		},
		sublimtContent() {
			let json = {
				version:this.version,
				content:this.htmlContent
			}
			this.$axios.post('/api/version/insert',json).then(res=>{
                let {error} =res.data;
                if (Object.is(error,0)) {
                    this.success('文章发布成功','',true);
                    [this.version,this.content,this.htmlContent] = [''];
                }else {
                    this.error('发布失败','未知原因',false);
                }
			});
		},
        error (title,content,nodesc) {
            this.$Notice.error({
                title: title,
                desc: nodesc ? '' : content
            });
        },
		success(title,content,nodesc) {
			this.$Notice.success({
				title:title,
				desc:nodesc ? '' :content
			});
		}
	}
}
</script>
<style lang="less">
	.version_content {
		margin-top:2rem;
	}
	.version_button {
		float:right;
		margin-top:2rem;
	}
</style>
