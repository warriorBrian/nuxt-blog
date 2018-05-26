<template>
<div>
	<div class="nav">
	<el-row type="flex" class="NavHeader" justify="center">
		<el-col :span="20">
			<nuxt-link :to="{name:'index'}" class="logo">Brian's Blog</nuxt-link>
			<el-menu :default-active="active" class="el-menu-demo navbar" active-text-color="#41b883" text-color="#fff"  mode="horizontal" @select="handleSelect">
				<el-menu-item index="index">前端文章</el-menu-item>
				<el-menu-item index="Backarticle">后端文章</el-menu-item>
				<el-menu-item index="version">更新日志</el-menu-item>
				<el-menu-item index=""><a href="http://docs.brianlee.cn" class="docs" target="_blank">文档中心</a></el-menu-item>
				<el-menu-item index="about">关于我</el-menu-item>
			</el-menu>
		</el-col>
	</el-row>
	</div>
	<img src="~/static/images/banner.jpg" alt="banner" class="banner_img">
</div>
</template>

<script>
export default {
	data() {
		return {
			activeIndex:'index'
		}
	},
	methods:{
		handleSelect(key){
			this.$router.push({name:key});
		}
	},
	props:['active']
}
</script>
<style lang="less">
	@import './../assets/css/Index/NavHeader.less';
</style>
