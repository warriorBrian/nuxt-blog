<template>
<div>
  <Menu mode="horizontal" theme="light" active-name="1">
    <Row type="flex" justify="center">
      <Col span="23">
      <div class="nav-left">
          <div class="logo">
              Brian's Blog
          </div>
      </div>
      <div class="nav-right">
            <MenuItem name="1">
            <Icon type="ios-paper"></Icon>
            待定内容
            </MenuItem>
            <MenuItem name="2">
            <Icon type="ios-people"></Icon>
            待定内容
            </MenuItem>
            <MenuItem name="3">
            <Icon type="settings"></Icon>
            待定内容
            </MenuItem>
      </div>
      </Col>
    </Row>
  </Menu>
</div>
</template>
<script>
export default {
    methods:{

    }
}
</script>
<style lang="less">
    .logo {
        font-size:25px;
        font-weight:bold;
        float:left;
        color:#41b883;
    }
    .nav-right {
        float:right;
        line-height:58px;
    }
</style>
