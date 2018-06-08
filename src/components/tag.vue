<template>
    <div class="tag">
        <h3 class="title">标签</h3>
        <ul class="content">
            <li class="label" v-for="item in tags">
                <!--遍历tags，对每个tag设置/tag/:id的路由，这个路由的组件同样是首页mainContent-->
                <a :href="`http://39.105.136.160:8090/#/tag/${item.id}`">{{item.name}}</a>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    export default{
        data(){
            return {
                tags:{}
            }
        },
        async created(){
            let {data}=await axios.get('http://39.105.136.160:3000/api/tag')
            this.tags=data.data
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.tag
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
    .content
        padding-left 0
        .label
            display inline-block
            list-style none
            padding 3px 8px
            border 1px solid green
            border-radius 5px
            margin 10px 3px
            font-size 15px
            a
                text-decoration none
                color #333
</style>