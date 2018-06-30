
<template>
    <div>
    <div class="artical">
        <div class="back" @click="back">
            <i class="icon-circle-left"></i>
        </div>
        <h3 class="title" v-if="article.title">{{article.title}}</h3> 
        <div class="info" v-if="article.clickTimes">
            <span class="info-item">{{tagStr}}◈</span>
            <span class="info-item">{{article.createdAt|formatDate}}◈</span>
            <span class="info-item">浏览</span>
            <span class="info-item">{{article.clickTimes}}次</span>
        </div>
        <p class="detailcontent" v-html="article.content" v-if="article.content"></p>
        <loading v-if="!article.content"></loading>
    </div>
    <div class="overflow"></div>
    </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import {formatDate} from '../commons/js/date'
import Loading from '../components/load'
import {port} from '../commons/js/port'
    export default{
        name:'detail',
        data(){
            return {
                article:{}
            }
        },
        computed:{
            tagStr(){
                if(this.article.tags){
                    return this.article.tags.map(i=>i.name).join(",")
                }         
            }
        },
        //add
        methods:{
            back(){
                history.back()
                //this.$router.back(-1)
            }
        },
        created(){
            console.log(this.$route)
            //向后端3000端口请求指定一条article数据
            //vue-router组件的$route指令获取url相关对象，$route.params可以获取动态参数
            axios.get(`http://${port}:3000/api/article/${this.$route.params.id}`).then(res=>{
                if(!res.err){
                    //axios对数据又做了一层封装，需要res.data.data
                    this.article=res.data.data
                }else{
                    console.log(res.err)
                }
            })
        },
        /*添加时间过滤器*/
        filters:{
            formatDate(time){
                let date=new Date(time)
                /*为了便于其他组件使用，将时间格式化方法formatDate在common/js中定义,通用方法抽象成模块*/
                return formatDate(date,'yyyy-MM-dd hh:mm')
            }
        },
        beforeRouteLeave(to, from, next) {
                // 设置下一个路由的 meta
            to.meta.keepAlive = true;
            next();
        },
        components:{
            Loading
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .overflow
        position fixed
        top 210px
        bottom 0
        left 0
        right 0
        background #d8e2eb
        z-index 10
    .artical
        margin 10px 0 20px 0
        background #fff
        border-radius 4px
        box-shadow 1px 2px 3px #adc2d7
        border 1px solid #adc2d7
        z-index 100
        position relative
        .back
            position absolute
            top 15px
            left 15px
            font-size 30px
            border-radius 50%
            background red
        .title
            font-size 20px
            text-align center
            font-weight bold
            line-height 1.1
        .info
            text-align center
            font-size 14px
        .detailcontent
            font-size 15px
            line-height 1.77
            color #333
            padding 10px
            overflow hidden
</style>