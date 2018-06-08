<template>
    <div class="admin">
        <md-table-card>
            <md-toolbar>
                <h3 class="md-title">文章管理</h3>           
                <md-button clsss="md-icon-button" id="article-add" @click.prevent.stop="add">
                    <md-icon>add</md-icon>
                </md-button>
                <!--删除所有选中记录的按钮，如没有选中记录则禁用-->
                <md-button class="md-icon-button" :disabled="selectArticles.length==0" @click="$refs['removeAllDlg'].open()">
                    <md-icon>delete</md-icon>
                </md-button>
            </md-toolbar>
            <!--selectArticles=$event-->
            <md-table md-sort="dessert" md-sort-type="desc" @select="onSelect" @sort="onSort">
                <md-table-header>
                    <md-table-row>
                        <md-table-head md-sort-by="title">标题</md-table-head>

                        <md-table-head md-sort-by="userId" class="small">作者</md-table-head>

                        <md-table-head md-sort-by="tag" class="small">标签</md-table-head>

                        <md-table-head md-sort-by="creatAt" class="middle">发布时间</md-table-head>
                        <md-table-head md-sort-by="updateAt" class="middle">修改时间</md-table-head>
                        <md-table-head>
                            <md-icon>settings</md-icon>
                            <span>操作</span>
                        </md-table-head>
                    </md-table-row>
                </md-table-header>

                <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in articles" :key="rowIndex" :md-item="row" md-auto-select md-selection>
                        <md-table-cell>
                            {{row.title}}
                        </md-table-cell>
                        
                        <md-table-cell class="small">
                            {{row.user?row.user.username:'无'}}
                        </md-table-cell>

                        <md-table-cell class="small">
                            {{row.target}}
                        </md-table-cell>
                        <md-table-cell  class="middle">
                            {{row.createdAt|formatDate}}
                        </md-table-cell>
                        <md-table-cell  class="middle">
                            {{row.updatedAt|formatDate}}
                        </md-table-cell>
                        <md-table-cell>
                            <!--按数据id定义了按钮的id，作为对话框弹出的源头-->
                            <!--模板字符串也是一个表达式，作为动态属性的运算同样需要用引号包裹-->
                            <md-button :id="`article-edit-${row.id}`" class="md-icon-button" @click.stop="edit(row.id)">
                                <md-icon>edit</md-icon>
                            </md-button>
                            <md-button :id="`article-del-${row.id}`" class="md-icon-button" @click.stop="remove(row.id)">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </md-table-cell>
                    </md-table-row>
                </md-table-body>
            </md-table>

            <md-table-pagination
                :md-size="pagination.pageSize"
                :md-total="pagination.total"
                :md-page="page"
                md-label="Rows"
                md-separator="of"
                :md-page-options="[5, 10, 25, 50]"
                @pagination="onPagination"
            >
            </md-table-pagination>
        </md-table-card>

        <md-dialog :md-open-from="currentId?`#article-edit-${currentId}`:'#article-add'" :md-close-to="`#article-del-${currentId}`" ref="editDlg">
            <md-dialog-title>{{currentId?'修改':'添加'}}文章</md-dialog-title>
            <md-dialog-content>
                <article-editor :article-id="currentId" ref="addeditDlg" @datachange="refreshData" @dataadd="addRefresh"></article-editor>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="$refs.editDlg.close()">Cancel</md-button>
                <md-button class="md-primary" @click="closeDialog(currentId)">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog-confirm v-if="articles.length>0" md-title="确认删除" :md-content-html="currentArticle?currentArticle:' '" md-ok-text="删除" md-cancel-text="取消" ref="removeDlg" @close="delArticle">
        </md-dialog-confirm>

        <md-dialog-confirm md-title="确认删除" :md-content-html="currentSelectArticle?currentSelectArticle:' '" md-ok-text="删除" md-cancel-text="取消" ref="removeAllDlg" @close="removeSelect">
        </md-dialog-confirm>          
    </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import {formatDate} from '../commons/js/date'
import articleEditor from './articleEditor'
    export default{
        data(){
            return {
                articles:[],
                //当前点击列表记录的id
                currentId:null,
                //分页器对象
                pagination:{
                    pageSize:10
                },
                //页码
                page:1,
                selectArticles:[],
                //排序方式,默认按id升序排列
                sortBy:{
                    name:'id',
                    type:'desc'
                }
            }
        },
        components:{
            articleEditor
        },
        computed:{
            currentArticle(){
                let curArt=this.articles.filter((i)=>{
                    return i.id==this.currentId
                })
                curArt=curArt[0]
                //计算属性在VUE加载时就计算渲染，而articles是异步请求，加载瞬间articles为空，curArt也为空，所以要做if判断。
                if(curArt){
                    return curArt.title
                }else{
                    return ''
                }
            },
            currentSelectArticle(){
                return `删除${this.selectArticles.length}条记录？`
            }
        },
        created(){
            //向后端3000端口请求所有article数据,和默认的分页
            this.getData()
            console.log(this.articles)
        },
        methods: {
            getData(){
                //向后端3000端口请求以offset和pageSize为参数的数据
                //其中包含排序参数sort，其值是一个JSON，从sortBy属性中获取
                axios.get(`http://39.105.136.160:3000/api/article?offset=${(this.page-1)*this.pagination.pageSize}&pageSize=${this.pagination.pageSize}`+
                `&sort=${JSON.stringify([this.sortBy.name,this.sortBy.type])}`).then(res=>{
                    if(!res.err){
                        //axios对数据又做了一层封装，需要res.data.data
                        this.articles=res.data.data
                        this.articles.forEach((item)=>{
                            item.target=''
                            item.tags.forEach((tag)=>{
                                item.target+=' '+tag.name
                            })
                        })
                        this.pagination=res.data.pagination
                    }else{
                        console.log(res.err)
                    }
                })
            },
            addRefresh(data){
                this.getData()
                this.articles.splice(0,0,data)
                //添加完数据后(将新数据保存到数据库并在admin页面渲染)，调用子组件方法将子组件articleEditor清空
                this.$refs['addeditDlg'].clearData()             
            },
            edit(id){
                setTimeout(()=>{
                    this.currentId=id
                    this.openDialog("editDlg")
                },10)
            },
            add(){
                this.currentId=null
                this.$refs.addeditDlg.clean()
                this.openDialog("editDlg")
            },
            remove(id){
                this.currentId=id
                this.$refs['removeDlg'].open()
            },
            //对话框方法
            openDialog(ref) {
                this.$refs[ref].open()
            },
            closeDialog(id) {
                this.$refs.addeditDlg.articleCommit(id)
                this.$refs.editDlg.close()
            },
            refreshData(data){        
                //直接用this.articles[i]=data会破坏vue属性对象的set/get方法，不会实时刷新，所以用splice方法
                for(let i=0;i<this.articles.length;i++){
                    if(data.id==this.articles[i].id){
                        data.target=''
                        data.tags.forEach((tag)=>{
                            data.target+=' '+tag.name
                        })
                        this.articles.splice(i,1,data)  
                        return
                    }
                }                 
            },
            //confirm对话框，点击确定会默认触发close事件，自动传入type='ok'的参数，点击取消会默认触发close事件，自动传入type='cancel'参数。
            delArticle(type){
                //点击了确认删除按钮，发送delete请求，其中currentId指定了待删除记录的id
                if(type=='ok'){
                    axios.delete(`http://39.105.136.160:3000/api/article/${this.currentId}`).then((res)=>{
                        if(res.data.err){
                            alert('删除失败')
                        }else{
                            alert('删除成功')
                            //删除成功，关闭confirm对话框
                            this.$refs.editDlg.close()
                            //用过滤的方法将当前删除的记录从articles数组中删除，注意map,filter方法的回调函数参数，必须return一个值才可以
                            //ES6箭头函数，i=>i.id!=this.currentId相当于(i)=>{return i.id!=this.currentId}
                            //this.articles=this.articles.filter(i=>i.id!=this.currentId)
                            this.articles=this.articles.filter((i)=>{return i.id!=this.currentId})
                        }
                    })
                }
            },
            //分页改变的回调函数,参数pagination包含page(当前页码)和size(每页记录数)
            onPagination(pagination){
                console.log(pagination)
                this.pagination.pageSize=pagination.size
                //如果改变后的页码超过记录总数范围，则将当前页码改成1
                if((pagination.page-1)*pagination.size>this.pagination.total){
                    this.page=1
                }else{
                    this.page=pagination.page
                }
                this.getData()
            },
            //选中行触发，参数items是选中的所有行对象数组
            onSelect(items){
                this.selectArticles=items
                console.log(this.selectArticles)
            },
            onSort(sort){
            },
            removeSelect(){
                let arr=[]
                arr=this.selectArticles.map(i=>axios.delete(`http://39.105.136.160:3000/api/article/${i.id}`))         
                Promise.all(arr).then((resArr)=>{
                    for(let i=0;i<resArr.length;i++){
                        if(resArr[i].data.err!=0){
                            alert('删除失败')
                            return
                        }
                    }               
                    //清除已删除的记录，articles改变重新渲染。
                    this.articles=this.articles.filter((i)=>{
                        return this.selectArticles.indexOf(i)==-1
                    })                     
                    this.selectArticles=[]
                    alert('删除成功')                
                })
            }
        },
        watch:{
            /*监听url的改变，$router是vue-router的指令，表示当前url*/
            '$route':function(newVal){
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
    .small
        @media screen and (max-width:640px)
            display none
</style>