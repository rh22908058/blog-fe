<template>
    <div class="admin">
        <md-table-card>
            <md-toolbar>
                <h1 class="md-title">标签管理</h1>           
                <md-button clsss="md-icon-button" id="tag-add" @click.prevent.stop="add">
                    <md-icon>add</md-icon>
                </md-button>
            </md-toolbar>
            <!--selectArticles=$event-->
            <md-table>
                <md-table-header>
                    <md-table-row>
                        <md-table-head md-sort-by="name">标签名</md-table-head>
                        <md-table-head md-sort-by="desc" class="small">说明</md-table-head>
                        <md-table-head md-sort-by="creatAt" class="middle">发布时间</md-table-head>
                        <md-table-head md-sort-by="updateAt" class="middle">修改时间</md-table-head>
                        <md-table-head>
                            <md-icon>settings</md-icon>
                            <span>操作</span>
                        </md-table-head>
                    </md-table-row>
                </md-table-header>

                <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in tags"  :key="rowIndex" md-selectable="single">
                        <md-table-cell>
                            {{row.name}}
                        </md-table-cell>                     
                        <md-table-cell>
                            {{row.desc}}
                        </md-table-cell>
                        <md-table-cell class="middle">
                            {{row.createdAt|formatDate}}
                        </md-table-cell>
                        <md-table-cell class="middle">
                            {{row.updatedAt|formatDate}}
                        </md-table-cell>
                        <md-table-cell>
                            <md-button :id="`tag-del-${row.id}`" class="md-icon-button" @click.stop="remove(row.id)">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </md-table-cell>
                    </md-table-row>
                </md-table-body>
            </md-table>
        </md-table-card>

        <md-dialog md-open-from="#tag-add" md-close-to="#tag-add" ref="addDlg">
            <md-dialog-title>添加标签</md-dialog-title>
            <md-dialog-content>
                <tag-editor ref="addeditDlg" @dataadd="addRefresh"></tag-editor>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="$refs.addDlg.close()">Cancel</md-button>
                <md-button class="md-primary" @click="closeDialog()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
           
        <md-dialog-confirm v-if="tags.length>0" md-title="确认删除" :md-content-html="currentTag?currentTag:' '" md-ok-text="删除" md-cancel-text="取消" ref="removeDlg" @close="delTag">
        </md-dialog-confirm>            
    </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import {formatDate} from '../commons/js/date'
import tagEditor from './tagEditor'
import {port} from '../commons/js/port'
    export default{
        data(){
            return {
                tags:[],
                //当前点击列表记录的id
                currentId:null,
            }
        },
        components:{
            tagEditor
        },
        computed:{
            currentTag(){
                let curTag=this.tags.filter((i)=>{
                    return i.id==this.currentId
                })
                curTag=curTag[0]
                
                if(curTag){
                    return curTag.name
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
                axios.get(`http://${port}:3000/api/tag`).then(res=>{
                    if(!res.err){
                        //axios对数据又做了一层封装，需要res.data.data
                        this.tags=res.data.data  
                    }else{
                        console.log(res.err)
                    }
                })
            },
            addRefresh(data){
                this.tags.splice(0,0,data)
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
                    this.$refs.addeditDlg.tagCommit()
                    this.$refs.addDlg.close()
            },
            //confirm对话框，点击确定会默认触发close事件，自动传入type='ok'的参数，点击取消会默认触发close事件，自动传入type='cancel'参数。
            delTag(type){
                //点击了确认删除按钮，发送delete请求，其中currentId指定了待删除记录的id
                if(type=='ok'){
                    axios.delete(`http://${port}:3000/api/tag/${this.currentId}`).then((res)=>{
                        if(res.data.err){
                            alert('删除失败,请先删除标签下的全部文章')
                        }else{
                            alert('删除成功')
                            //删除成功，关闭confirm对话框
                            this.$refs.addDlg.close()
                            //用过滤的方法将当前删除的记录从articles数组中删除，注意map,filter方法的回调函数参数，必须return一个值才可以
                            //ES6箭头函数，i=>i.id!=this.currentId相当于(i)=>{return i.id!=this.currentId}
                            //this.articles=this.articles.filter(i=>i.id!=this.currentId)
                            this.tags=this.tags.filter((i)=>{return i.id!=this.currentId})
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