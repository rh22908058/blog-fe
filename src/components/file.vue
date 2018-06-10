<template>
    <div class="file">
        <h3 class="title">文章归档</h3>
        <ul class="item-wrapper">
            <!--HTML标签中部可以直接使用模板字符串，要用"包裹-->
          <li class="item" v-for="item in archives"><a :href="`http://localhost:8090/#/archive/${item.year}/${item.month}`">{{item.year}}年{{item.month}}月({{item.articleNum}})</a></li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    export default{
        data(){
            return {
                archives:[]
            }
        },
        async created(){
            /*created中含有异步GET请求，可以用async/await取代Promise，await的结果就是请求成功过的返回数据，可以直接赋值*/
            let {data:archiveRes}=await axios.get('http://localhost:3000/api/archive')
            this.archives=archiveRes.data
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.file
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