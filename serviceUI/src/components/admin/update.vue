<template>
<div>
	<Row>
		<!-- 左侧 -->
		<Col span="19">
			<label for="title" class="article">撰写新文章</label>
			<Input v-model="title" size="large" placeholder="在此输入文章标题" name="title" class="article_title"></Input>

            <label for="title" class="article">文章简介</label>
			<Input v-model="des" size="large" placeholder="在此输入文章标题" name="title" class="article_title"></Input>

			<mavon-editor @change="changeContent" @save="save" class="article_content" v-model="content" fontSize="18px" placeholder="开始编写文章内容..." style="min-height:600px;" />
			<Button type="warning" class="article_button" @click="submitArticle">修改文章</Button>
		</Col>
		<!-- 右侧 -->
		<Col span="4" offset="1" class="content_right">
			<Card class="card">
				<label for="date" class="article" slot="title">发布日期</label>
                <DatePicker @on-change="dateContent" :value="date" type="date" name="date" size="large" class="data_picker" placeholder="Select date" style="width:100%;"></DatePicker>
            </Card>
			<Card class="card">
                <p slot="title">分类目录</p>
				<RadioGroup v-model="radio" vertical>
			        <Radio label="Front">
			            <i class="iconfont icon-h5"></i>
			            <span class="list_menu">前端开发</span>
			        </Radio>
			        <Radio label="Back">
			            <Icon class="iconfont icon-nodejs"></Icon>
			            <span class="list_menu">后端开发</span>
			        </Radio>
			        <Radio label="about-me">
			            <Icon class="iconfont icon-guanyuwomen"></Icon>
			            <span class="list_menu">关于我</span>
			        </Radio>
			    </RadioGroup>
            </Card>
		</Col>
	</Row>
</div>
</template>
<script>
export default {
	data() {
		return {
			title:'',
			content:'',
			htmlContent:'',
			date:FormatDate(new Date()),
			radio:'',
            contentValue:'',
            des:'',
            original:''
		}
	},
    created() {
        this.init();
    },
    mounted() {

    },
	methods:{
        init() {
            let id = this.$route.params.id;
            this.$axios.get('/api/article/update',{params:{id}}).then(res=>{
                let [data] = res.data;
                // console.log(data);
                this.title = data.title;
                this.des = data.des;
                this.content = data.original;
                this.date = data.time;
                this.radio = data.list;
            });
        },
		changeContent(value,render) {
			this.htmlContent = render;
            this.original = value;
		},
		save(value,render) {
			this.htmlContent = render;
            this.original = value;
            console.log(this.contentValue);
			this.submitArticle();
		},
		submitArticle() {
			let param = {
                title:this.title,
				content:this.htmlContent,
				date:this.date,
				des:this.des,
				original:this.original,
				list:this.radio
			}
			if (this.title == '') {
				this.error('文章标题留空无法保存','请仔细检查文章标题',false);
			}else{
                this.$axios.post(`/api/article/insert${this.radio}`,param).then(res=>{
					let {error} =res.data;
					if (Object.is(error,0)) {
						this.success('修改成功','',true);
					}else {
						this.error('修改失败','未知原因',false);
					}
				});
			}
		},
		dateContent(val) {
			this.date = FormatDate(val);
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
/*封装格式化日期*/
function FormatDate (strTime) {
    var date = new Date(strTime);
	return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
}
</script>
<style>
    @import './../../assets/css/admin/article.less';
</style>
