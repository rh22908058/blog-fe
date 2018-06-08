<template>
    <div class="lateart">
        <h3 class="title">近期文章</h3>
        <ul class="item-wrapper">
            <li v-for="item in lastArt" class="item"><router-link class="todetail" :to="`/detail/${item.id}`">{{item.title}}</router-link></li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    export default{
        data(){
            return {
                lastArt:[]
            }
        },
        async created(){
            let {data:res}=await axios.get('http://39.105.136.160:3000/api/article?pageSize=3&sort=["id","desc"]')
            this.lastArt=res.data
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .lateart
        /*这里要指定宽度，否则父组件外层容器指定了宽度，子组件宽度大于容器宽度时会撑开*/
        width 100%
        padding 10px 20px 20px 20px
        border-radius 4px
        box-shadow 1px 2px 3px #adc2d7
        border 1px solid #acd2d7
        background #fff
        margin-bottom 30px
        .title
            font-size 16px
            color #40759b
            border-bottom 1px solid #d8e2eb
            line-height 2.7
        .item-wrapper
            padding-left 0
            .item
                list-style none
                white-space nowrap
                text-overflow ellipsis
                overflow hidden
                line-height 1.5
                font-size 15px
                a
                    text-decoration none
                    color #333
                    
</style>