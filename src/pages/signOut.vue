
<template>
    <div class="sign-out">
       您已成功登出,{{remainTime}}秒后跳转至<router-link to="/">首页</router-link>
    </div>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    export default{
        data(){
            return {
                remainTime:5,
                timer:null
            }
        },
        created(){
            //发送登出的delete请求
            axios.delete('http://localhost:3000/api/session')
            //设置5s定时器，跳转到根目录
            this.timer=setInterval(()=>{
                if(this.remainTime>0){
                    this.remainTime--
                }else{
                    clearInterval(this.timer)
                    //跳转到根目录,用编程式导航$router.push
                    this.$router.push('/')
                }
            },1000)
        },
        //路由改变时清除定时器
        watch:{
            '$route':function(newVal){
                //清除定时器
                clearInterval(this.timer)
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.sign-out
    background #d8e2eb
    position fixed
    top 300px
    bottom 0
    left 0
    right 0
</style>