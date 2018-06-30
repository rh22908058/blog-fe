<template>
    <div class="artical-editor">
        <!--使用vue-material组件，包括响应式布局，输入框，按钮，表单-->
        <!--使用vue-editor组件作为输入框-->
        <form novalidate>
            <md-layout md-gutter class="wrapper">
                <md-layout md-flex-xsmall="100" md-flex-small="100" class="item">
                    <md-input-container>
                        <label>标题</label>
                        <md-input v-model="article.title"></md-input>
                    </md-input-container>
                </md-layout>
                <!--如果是修改，则显示拼接后的标签target-->
                <md-layout md-flex-xsmall="100" md-flex-small="100" class="item" v-if="articleId">
                    <md-input-container>
                        <label>标签</label>
                        <md-input v-model="article.target" disabled></md-input>
                    </md-input-container>
                </md-layout>
                <!--如果是添加，则显示所有tag-->
                <md-layout class="item tagitem" md-flex-xsmall="100" md-flex-small="100" v-else>
                    <div class="tagwrapper" v-for="tag in tags">
                        <input type="checkbox" v-model="selectTags" :value="tag.id" class="tag"/>
                        <label>{{tag.name}}</label>
                    </div>
                </md-layout>
            </md-layout>
            <vue-editor v-model="tempContent"></vue-editor>
        </form>
    </div>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    import {VueEditor} from 'vue2-editor'
    import {port} from '../commons/js/port'
    export default{
        data(){
            return {
                article:{
                    content:'',
                    title:'',
                    tags:[],
                    target:''
                },
                tags:[],
                selectTags:[],
                tempContent:''
            }
        },
        props:{
            articleId:{
                type:Number,
                default:null
            }
        },
        created(){
            this._getTag()
            console.log('editor created')
        },
        components:{
            VueEditor
        },
        methods:{
            clean(){
                this.tempContent=''
            },
            articleCommit(id){
                //如果是修改，则发送put请求
                if(id){
                    axios.put(`http://${port}:3000/api/article/${id}`,this.article).then(res=>{
                        if(!res.data.err){
                            this.tempContent=res.data.data.content
                            this.$emit('datachange',res.data.data)
                            alert('修改成功') 
                            console.log(res.data.data)                     
                        }else{
                            alert('修改失败')
                        }
                    })
                    
                }
                //如果是添加，则发送post请求
                else{
                    for(let i=0;i<this.selectTags.length;i++){
                        this.article.tags.push(this.selectTags[i])
                    }
                    axios.post(`http://${port}:3000/api/article`,this.article).then(res=>{
                        if(!res.data.err){
                            this.$emit('dataadd',res.data.data)
                            alert('提交成功')
                        }else{
                            alert('提交失败')
                        }
                    })
                }  
            },
            _getArticle(){
                //URL中有动态参数，说明是修改，不是添加
                //要修改数据，首先需要把原始数据渲染进来
                //let {id}=this.$route.params
                //作为adminArticle的子组件，就不能从url中获取参数id了，要从props中获取
                if(this.articleId){
                    //按id获取article，用响应数据渲染页面
                    axios.get(`http://${port}:3000/api/article/${this.articleId}`).then(res=>{
                        if(!res.data.err){
                            //还是解构
                            this.article=res.data.data
                            /*将tags数组中的标签拼接成target*/
                            this.article.target=''
                            this.article.tags.forEach((tag)=>{
                                this.article.target+=' '+tag.name
                            })
                            this.tempContent=this.article.content
                        }
                    })
                }         
            },
            _getTag(){
                axios.get(`http://${port}:3000/api/tag`).then(res=>{
                    if(!res.data.err){
                        //还是解构
                        this.tags=res.data.data
                    }
                })
            },
            clearData(){
                this.article.title=''
                this.article.target=''
                this.article.content=''
                this.article.tags=[]
                this.selectTags=[]
            }
        },
        //router切换vue并不重新加载，所以要监听路由改变，重新发送请求获取新的article数据并渲染
        watch:{
            '$route':function(newVal){
                this._getArticle()
                this._getTag()
            },
            'articleId':function(newVal){
                if(this.articleId){
                    this._getArticle()
                }else{
                    this.article.title=''
                    this.article.target=''
                    this.article.content=''
                    this.article.tags=[]
                    this.selectTags=[]
                } 
            },
            'tempContent':function(newVal){
                this.article.content=newVal
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .wrapper
        padding-bottom 20px
        .item
            padding 0 20px
        .tagwrapper
            padding 5px 20px
            display inline-block
        .tagitem
            display block
</style>