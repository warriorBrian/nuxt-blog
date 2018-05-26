<template>
  <div>
  	<nav-header :active="active"></nav-header>
	<el-row type="flex" justify="center">
		<el-col :span="10">
			<h1>更新日志</h1>
		</el-col>
	</el-row>
	<el-row type="flex" class="version" justify="center" v-for="item in list" :key="item._id">
		<el-col :span="10">
			<el-card class="box-card">
			  <div slot="header" class="clearfix">
			    <span style="font-weight:bold;">{{item.version}}</span>
			    <span style="float:right">{{item.time}}</span>
			  </div>
			  <div v-html="item.content">
                  {{item.content}}
              </div>
			</el-card>
		</el-col>
	</el-row>
  </div>
</template>

<script>
import NavHeader from '~/components/NavHeader.vue'
import {baseurl} from '~/plugins/url.js'
export default {
    data() {
        return {
            active:'version'
        }
    },
    async asyncData({app}) {
        let result = await app.$axios.get(`${baseurl}/api/version/getVersion`);
        let {error,list} = result.data;
        return {list}
    },
    components:{
        NavHeader
    },
    head() {
		return {
			title:'更新日志-Brian的个人博客',
			meta:[
				{hid:'description',name:'description',content:'李闯个人博客，是一个记录博主学习和成长的自媒体博客。关注于web前端技术和web全栈技术的学习研究。'},
				{hid:'keywords',name:'keywords',content:'李闯,互联网,自媒体,李闯博客,新鲜科技,科技博客,Brian,独立博客,个人博客,原创博客,brianlee,brian,前端,前端开发,全栈,全栈开发,nuxt,nuxtjs,vue,vuejs'},
				{hid:'author',content:'brian'}
			]
		}
	}
}
</script>

<style>
    .version {
        margin-bottom:2rem;
    }
</style>
