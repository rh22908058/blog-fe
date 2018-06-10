<template>
  <div id="app">
    <div class="nav">
      <div class="left-wrapper">
        <img class='pic' src="./assets/logo.png" width='60' height='60'>
        <div class="title">
          TT的技术博客
        </div>
      </div>
      <div class="right-wrapper" @click.stop.prevent="changeClass($event)" ref="items">
        <div class="nav-item current"><router-link to='/'>主页</router-link></div>
        <!--这里需要用v-show依据isSign标识显示隐藏不同的div，而不可以用v-if，如果用v-if，同一位置绑定的事件会随v-if切换-->
        <!--也就是'登录'绑定的点击事件，当isSignin为true时，会绑定到'注销'上-->
        <div class="nav-item" v-show="!isSignin" @click="signin" id="signin"><a href="#">登录</a></div>
        <div class="nav-item" v-show="!isSignin" @click="signup" id="signup"><a href="#">注册</a></div>
        <div class="nav-item" v-show="isSignin"><router-link to="/admin">管理</router-link></div>
        <div class="nav-item" v-show="isSignin"><router-link to="/sign-out">注销</router-link></div>
        <div class="nav-item"><router-link to='/about'>关于</router-link></div>
      </div>
      <div class="welcome" v-show="isSignin">欢迎{{user.username}}</div>
    </div>
    <router-view></router-view>

    <!--登录弹出对话框-->
    <md-dialog md-open-from="#signin" md-close-to="#signin" ref="signinDialog">
      <md-dialog-title>用户登录</md-dialog-title>
      <md-dialog-content>
        <form novalidate @submit.stop.prevent="submit">
          <md-input-container>
            <label>用户名</label>
            <md-input v-model="user.username" required></md-input>
          </md-input-container>
          <md-input-container>
            <label>密码</label>
            <md-input v-model="user.password" required  type="password"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog('signinDialog')">取消</md-button>
        <md-button class="md-primary" @click="signinCommit()">提交</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!--注册弹出对话框-->
    <md-dialog md-open-from="#signup" md-close-to="#signup" ref="signupDialog">
      <md-dialog-title>用户注册</md-dialog-title>
      <md-dialog-content>
        <form novalidate @submit.stop.prevent="submit">
          <md-input-container>
            <label>用户名</label>
            <md-input v-model="user.username" required></md-input>
          </md-input-container>
          <md-input-container>
            <label>密码</label>
            <md-input v-model="user.password" required  type="password"></md-input>
          </md-input-container>
          <md-input-container>
            <label>密码</label>
            <md-input v-model="user.passwordRpt" required  type="password"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Email</label>
            <md-input v-model="user.email"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog('signupDialog')">取消</md-button>
        <md-button class="md-primary" @click="signupCommit()">提交</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import {hasClass,addClass,removeClass} from './commons/js/dom'
export default {
  data(){
    return {
      user:{
        username:'',
        password:'',
        passwordRpt:'',
        email:''
      },
      //是否登录
      isSignin:false
    }
  },
  async created(){
    //页面创建或者页面刷新时都需要重新发送GET请求
    let {data:res}=await axios.get('http://localhost:3000/api/session')
    if(!res.data){
      this.isSignin=false
    }else{
      this.isSignin=true
      this.user=res.data
      //将userId添加进localStorage
      window.localStorage.setItem('userId',this.user.id)
    }
  },
  methods:{
    //弹出相应对话框
    signup(){
      this.user.username=''
      this.user.password=''
      this.user.passwordRpt=''
      this.user.email=''
      this.$refs["signupDialog"].open()
    },
    signin(){
      this.user.username=''
      this.user.password=''
      this.user.passwordRpt=''
      this.user.email=''
      this.$refs["signinDialog"].open()
    },
    changeClass(event){
      let el=event.target
      let children=this.$refs.items.children
      let index=0
      console.log(children)
      for(let i=0;i<children.length;i++){
        removeClass(children[i],'current')
        if(el===children[i].children[0]){
          index=i
        }
      }
      console.log(el)
      addClass(children[index],'current')
    },
    //关闭相应对话框
    closeDialog(ref){
      this.$refs[ref].close()
    },
    async signupCommit(){
      let{data:res}=await axios.post('http://localhost:3000/api/user',this.user)
      if(res.err){
        alert('注册出错:'+res.info)
      }else{
        this.$refs["signupDialog"].close()
        alert('注册成功')
      }
    },
    async signinCommit(){
      let{data:res}=await axios.post('http://localhost:3000/api/session',this.user)
      if(res.err){
        alert('登录出错:'+res.info)
      }else{
        this.$refs["signinDialog"].close()
        alert('登录成功')
        this.isSignin=true
        //将userId添加进localStorage
        window.localStorage.setItem('userId',res.data.id)
      }
    }
  },
  //监听路由，只要路由切换到登出路由，就将登录状态置为false
  watch:{
    '$route':function(newVal){
        //signOut是在router中定义的路由，name为signOut，对应sign-out路由
        if(newVal.name=='signOut'){
          //用户登出，清除localstorage
          window.localStorage.clear()
          this.isSignin=false
          this.user={}
        }
    }  
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
body
  background #d8e2eb
  #app
    box-sizing border-box
    padding 0 50px
    font-size 16px
    position relative
    background #d8e2eb url('./bg.jpg') no-repeat top center
    @media screen and (max-width:500px)
      padding 0 5px
    .nav 
      text-align left
      width 100%
      height 300px
      position relative
      @media screen and (max-width:600px)
            height 200px
      .left-wrapper
        padding-top 100px
        .title
          font-size 42px
          font-weight bold
          color #fff
          text-shadow 1px 3px 6px #113f6e
          line-height 1.2
          @media screen and (max-width:600px)
            font-size 30px
        .pic
          float left
          margin 0
      .right-wrapper
        position absolute
        right 0
        top 0
        margin 20px 0
        .nav-item
          display inline-block
          padding 3px 18px 3px
          line-height 30px
          color #fff
          font-size 16px
          border 1px solid transparent
          @media screen and (max-width:600px)
            padding 3px 10px 3px
          &:hover
            border-bottom 1px solid #fff
            box-shadow 0 0 10px #adc2d7 inset
          &.current
            border-bottom 1px solid #fff
            box-shadow 0 0 10px #adc2d7 inset
          a
            text-decoration none
            color #fff
      .welcome
        color #fff
        padding 15px 0 0 60px
</style>
