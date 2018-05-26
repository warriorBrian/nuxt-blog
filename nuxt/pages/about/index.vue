<template>
<div>
	<nav-header :active="active"></nav-header>
	<!-- 并非采用后台动态添加，后期增加动态修改 -->
	<el-row type="flex" justify="center" class="about_content">
		<el-col :span="15" class="about">
			<el-card class="box-card">
				<h1>About Blog</h1>
				<hr class="line"/>
    			<p>简单介绍下博客使用技术：</p>
    			<p class="about_title">博客前端：</p>
    			<p class="about_text"><b>采用服务器端渲染(ssr)</b>,基于 Vue.js 的通用应用框架:<b>Nuxt.js + Element-UI + @nuxtjs/axios + Less</b></p>
    			<p class="about_title">博客后端:</p>
    			<p class="about_text">UI层：使用 <b>Vue + Vue-Router + Vue-cli + Vue + Axios + Less + Iview</b></p>
    			<p class="about_text">服务层：使用 <b>Node.js + Koa2 + MongoDB + Mongoose + Koa-session</b></p>
    			<p class="about_text">(就写这么多，后期想起来再补充~)</p>
    			<h1>About Me</h1>
				<hr class="line"/>
				<p class="about_title">个人简介</p>
				<ul>
					<li>姓名：李闯</li>
					<li>英文名：Brian Lee</li>
					<li>爱好：写代码</li>
					<li>座右铭：人生为棋，我愿为卒，行动虽慢可谁曾见我退后一步？</li>
				</ul>
				<p class="about_title">技能</p>
				<ul>
					<li>前端：HTML、CSS、Javacript(ES next)、JQuery、Vue全家桶、微信小程序开发、Hybrid APP混合开发等等</li>
					<li>UI框架：Bootstrap、Layer-UI、WEUI、Muse-UI、Vux、MUI+HUI、Element-UI、Mint-UI、Iview 等等</li>
					<li>后端：NodeJs、MongoDB数据库、Mongoose(ORM层)、Express、Koa2、Egg.js 等等</li>
					<li>网络安全：</li>
					<li>熟练使用Kali Linux、手工SQL注入、脚本注入、内网渗透、中间人(MITM)攻击、内网渗透、APT攻击</li>
					<li>XSS跨站攻击、CSRF跨站伪造请求、学习脱过SE的壳、反汇编等等。</li>
					<li>(不过都是曾经，目前专注开发，偶尔玩玩MITM)</li>
				</ul>
				<p class="about_title">个人评价</p>
				<p class="about_text">能从hack角度考虑问题，专注编写代码。</p>
				<p class="about_text">未来1-3年规划：精通前端各种模式框架，学习golang等技术，学习大数据等(我一直认为它是一个趋势)。</p>
				<p class="about_title">联系方式</p>
				<p class="about_text">邮箱：cn_brian@163.com</p>
			</el-card>
		</el-col>
	</el-row>
</div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue'
export default {
	data() {
		return {
			active:'about'
		}
	},
	components:{
		NavHeader
	},
	head() {
		return {
			title:'个人简介-Brian的个人博客',
			meta:[
				{hid:'description',name:'description',content:'李闯个人博客，是一个记录博主学习和成长的自媒体博客。关注于web前端技术和web全栈技术的学习研究。'},
				{hid:'keywords',name:'keywords',content:'李闯,互联网,自媒体,李闯博客,新鲜科技,科技博客,Brian,独立博客,个人博客,原创博客,brianlee,brian,前端,前端开发,全栈,全栈开发,nuxt,nuxtjs,vue,vuejs'},
				{hid:'author',content:'brian'}
			]
		}
	}
}
</script>

<style lang="less" scoped>
	@import './../../assets/css/Index/About.less';
</style>
