<template>
    <div class="admin">
        <md-table-card>
            <md-toolbar>
                <h1 class="md-title">用户管理</h1>           
                <md-button clsss="md-icon-button" id="user-add" @click.prevent.stop="add">
                    <md-icon>add</md-icon>
                </md-button>
            </md-toolbar>
            <md-table>
                <md-table-header>
                    <md-table-row>
                        <md-table-head md-sort-by="name">用户名</md-table-head>
                        <md-table-head md-sort-by="permission">权限</md-table-head>
                        <md-table-head md-sort-by="creatAt" class="middle">发布时间</md-table-head>
                        <md-table-head md-sort-by="updateAt" class="middle">修改时间</md-table-head>
                        <md-table-head>
                            <md-icon>settings</md-icon>
                            <span>操作</span>
                        </md-table-head>
                    </md-table-row>
                </md-table-header>

                <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in users" :key="rowIndex" md-selectable="single">
                        <md-table-cell>
                            {{row.username}}
                        </md-table-cell>                     
                        <md-table-cell>
                            <!--遍历permission数组，如果有一个元素id为4即删除文章，则是管理员;如果有一个元素id为1即添加文章，则是普通用户;如果没有id为1的元素即不能添加文章，则为访客-->
                            <!--但是要确保row.permissions已经存在，否则会报错影响后面的逻辑，这里表现为新数据无法添加到列表当中-->
                            {{row.permissions?row.permissions.some(i=>i.id==4)?'管理员':row.permissions.some(i=>i.id==1)?'普通用户':'访客':''}}
                        </md-table-cell>
                        <md-table-cell class="middle">
                            {{row.createdAt|formatDate}}
                        </md-table-cell>
                        <md-table-cell class="middle">
                            {{row.updatedAt|formatDate}}
                        </md-table-cell>
                        <md-table-cell>
                            <md-button :id="`user-del-${row.id}`" class="md-icon-button" @click.stop="remove(row.id)">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </md-table-cell>
                    </md-table-row>
                </md-table-body>
            </md-table>
        </md-table-card>

        <md-dialog md-open-from="#user-add" md-close-to="#user-add" ref="addDlg">
            <md-dialog-title>添加管理员用户</md-dialog-title>
            <md-dialog-content>
                <user-editor ref="addeditDlg" @dataadd="addRefresh"></user-editor>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="$refs.addDlg.close()">Cancel</md-button>
                <md-button class="md-primary" @click="closeDialog()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
           
        <md-dialog-confirm md-title="确认删除" :md-content-html="currentUser?currentUser:' '" md-ok-text="删除" md-cancel-text="取消" ref="removeDlg" @close="delUser">
        </md-dialog-confirm>            
    </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import {formatDate} from '../commons/js/date'
import userEditor from './userEditor'
import {port} from '../commons/js/port'
    export default{
        data(){
            return {
                users:[],
                //当前点击列表记录的id
                currentId:null
            }
        },
        components:{
            userEditor
        },
        computed:{
            currentUser(){
                let curUser=this.users.filter((i)=>{
                    return i.id==this.currentId
                })
                curUser=curUser[0]     
                if(curUser){
                    return curUser.username
                }else{
                    return ''
                }
            }
        },
        created(){
            this.getData()
        },
        methods: {
            getData(){
                axios.get(`http://${port}:3000/api/user`).then(res=>{
                    if(!res.err){
                        //axios对数据又做了一层封装，需要res.data.data
                        this.users=res.data.data  
                    }else{
                        console.log(res.err)
                    }
                })
            },
            addRefresh(data){
                this.users.splice(0,0,data)
            },
            add(){
                this.currentId=null
                this.openDialog("addDlg")
            },
            remove(id){
                this.currentId=id
                this.$refs['removeDlg'].open()
            },
            //对话框方法
            openDialog(ref) {
                this.$refs[ref].open()
            },
            closeDialog() {
                    this.$refs.addeditDlg.userCommit()
                    this.$refs.addDlg.close()
            },
            //confirm对话框，点击确定会默认触发close事件，自动传入type='ok'的参数，点击取消会默认触发close事件，自动传入type='cancel'参数。
            delUser(type){
                //点击了确认删除按钮，发送delete请求，其中currentId指定了待删除记录的id
                if(type=='ok'){
                    axios.delete(`http://${port}:3000/api/user/${this.currentId}`).then((res)=>{
                        if(res.data.err){
                            alert('删除失败,无法删除已登录用户')
                        }else{
                            alert('删除成功')
                            //删除成功，关闭confirm对话框
                            this.$refs.addDlg.close()
                            //用过滤的方法将当前删除的记录从articles数组中删除，注意map,filter方法的回调函数参数，必须return一个值才可以
                            //ES6箭头函数，i=>i.id!=this.currentId相当于(i)=>{return i.id!=this.currentId}
                            //this.articles=this.articles.filter(i=>i.id!=this.currentId)
                            this.users=this.users.filter((i)=>{return i.id!=this.currentId})
                        }
                    })
                }
            }
        },
        /*添加时间过滤器*/
        filters:{
            formatDate(time){
                let date=new Date(time)
                /*为了便于其他组件使用，将时间格式化方法formatDate在common/js中定义,通用方法抽象成模块*/
                return formatDate(date,'yyyy-MM-dd hh:mm')
            }
        },
        watch:{
            'users':function(newVal){
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.md-title
    font-size 16px
.admin
    width 100%
    .md-title
        font-size 16px
    .middle
        @media screen and (max-width:850px)
            display none
</style>