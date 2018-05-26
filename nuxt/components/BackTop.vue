<template>
	<!-- 封装返回顶部组件 -->
  <div>
	 <div class="back">
	 	<div class="back_top" @click="top">
			TOP
		</div>
	 </div>
  </div>
</template>

<script>
export default {
	data() {
		return {}
	},
	mounted() {
		this.init();
	},
	methods:{
		init() {
			if(process.browser) {	//判断为浏览器
                window.onscroll = function () {
					let top = document.documentElement.scrollTop;
					let backTop = document.querySelector('.back_top');
					top >= 500 ? backTop.style.opacity = 1 : backTop.style.opacity = 0;
				}
			}
		},
		top() {
			if (process.browser) {	//判断为浏览器
				let timer = null;
				timer = setInterval(()=>{
					let top = document.documentElement.scrollTop;
					top -=10;
					if (top>0) {
						window.scrollTo(0,top);
					}else {
						window.scrollTo(0,0);
						clearInterval(timer);
					}
				});
			}
		}
	}
}
</script>

<style lang="less">
	@import './../assets/css/Index/BackTop.less';
</style>
