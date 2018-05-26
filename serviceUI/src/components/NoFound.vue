<template>
  <div>
	  <Row type="flex" justify="center" align="middle" class="error_box">
  		<!-- 左侧 -->
  		<Col span="18">
  			<div class="error_logo"></div>
		</Col>
		<Col span="18">
			<div class="error_text">未经管理员授权禁止访问授权地址！</div>
			<div class="error_text error_back"><router-link :to="{path:'/'}">返回首页</router-link></div>
		</Col>
	  </Row>
  </div>
</template>
<style lang="less" scoped>
	.error_box {
		margin-top:10rem;
		.error_logo {
			width:800px;
			height:155px;
			margin:0 auto;
			background:url('/static/images/stop.png') no-repeat;
			background-size:cover;
			background-position:center center;
		}
		.error_text {
			text-align:center;
			font-weight:bold;
			font-size:30px;
			padding-top:2rem;
			// color:#D80C18;
		}
		.error_back{
			font-size:20px;
			a {
				color:#495060;
				text-decoration: underline
			}
		}
	}
</style>
