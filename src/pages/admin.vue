
<template>
    <div class="admin">
        <md-tabs md-centered>
            <md-tab md-label="文章管理" md-icon="assignment" class='nav'>
                <admin-article></admin-article>
            </md-tab>
            <md-tab md-label="标签管理" md-icon="bookmark" class='nav'>
                <admin-tag></admin-tag>
            </md-tab>
            <md-tab md-label="用户管理" md-icon="person" class='nav'>
                <admin-user></admin-user>
            </md-tab>
        </md-tabs>
    </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import {formatDate} from '../commons/js/date'
import adminArticle from '../components/AdminArticle'
import adminTag from '../components/AdminTag'
import adminUser from '../components/AdminUser'
    export default{
        data(){
            return {
                
            }
        },
        created(){
        },
        methods: {
        },
        watch:{
            /*监听url的改变，$router是vue-router的指令，表示当前url*/
            '$route':function(newVal){
            }
        },
        components:{
            //对象名必须用驼峰格式表示，换算到标签里就是'xx-xx'
            adminArticle,
            adminTag,
            adminUser
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>