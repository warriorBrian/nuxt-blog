<template>
  <div class="login_images">
      <!-- <router-link :to="{name:'admin'}">跳转admin页面</router-link> -->
      <Row>
        <Col span="4" offset="20" style="float:right;margin-right:10%;margin-top:20%;">
          <Card>
            <p slot="title">欢迎登录</p>
            <Input v-model="username" type="text" placeholder="请输入用户名" name="username">
              <span slot="prepend"><i class="icon iconfont icon-yonghu"></i></span>
            </Input>
            <br>
            <Input v-model="password" type="password" placeholder="请输入密码" name="password">
              <span slot="prepend"><i class="icon iconfont icon-mima"></i></span>
            </Input>
            <br>
            <Button type="primary" long @click="login(username,password)">登录</Button>
          </Card>
        </Col>
      </Row>
  </div>
</template>
<script>
import store from '@/vuex/store'
import {mapState,mapMutations} from 'vuex'
export default {
    data(){
        return{
            username:'',
            password:''
        }
    },
    mounted() {
        // 如果存在不需要重复登陆
        let storage = window.sessionStorage;
        this.setUserName(storage.getItem('username'));
        let store = this.$store.state.tokenName;
        if (!store) {
            this.$router.push({name:'Index'});
        }else {
            this.$router.push({name:'admin'});
        }
    },
    methods:{
        // 设置用户名vuex方法
        ...mapMutations(['setUserName']),
        login(username,password) {
            let json = {username,password};
            this.$axios.post('/api/login',json).then(res=>{
                let {error,username,msg} = res.data;
                if (Object.is(error,0)) {
                    let storage = window.sessionStorage;  //初始化sessionStorage
                    storage.setItem('username',username);
                    this.setUserName(storage.getItem('username'));
                    this.$router.push({name:'admin'});
                }else if(Object.is(error,1)) {
                    this.error('用户名错误',msg,false);
                }else {
                    this.error('密码错误',msg,false);
                }
            });
        },
        error (title,content,nodesc) {
            this.$Notice.error({
                title: title,
                desc: nodesc ? '' : content
            });
        }
    },
    store,
    computed:{
      ...mapState(['tokenName'])
    }
}
</script>
<style lang="less">
    .login_images {
        width:100%;
        height:100vh;
        background:url('/static/images/login.jpeg') no-repeat;
        background-size:cover;
        background-position: center center;
    }
</style>
