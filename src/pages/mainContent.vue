<template>
  <div class="main-content">
    <div class="right-wrapper">
        <lateart></lateart>
        <file></file>
        <tag></tag>
    </div>
    <!--在滚动区域的容器中使用infinte-scroll下拉加载组件的指令-->
    <div class="content-wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div v-for="item in articles">
        <artical :article="item" class="article"></artical>
      </div>
    </div>
  </div>
</template>

<script>
import artical from '../components/artical'
import lateart from '../components/lateart'
import file from '../components/file'
import tag from '../components/tag'
import axios from 'axios'
import {debounce} from '../commons/js/date'

export default {
  data () {
    return {
      articles:[],
      pageSize:10,
      //条件查询的过滤器
      filter:{},
      //路由名
      resource:'article',
      //路由参数中的id号
      queryId:null,
      isLoadMore:false
    }
  },
  components:{
    artical,
    lateart,
    file,
    tag
  },
  async created(){
    /*
    //向后端3000端口请求所有article数据
    axios.get('http://localhost:3000/api/article').then(res=>{
      if(!res.err){
        //axios对数据又做了一层封装，需要res.data.data
        this.articles=res.data.data
      }else{
        console.log(res.err)
      }
    })
    */
    console.log('maincreated')
    this.changeFilter()
    //this.loadMore()
  },
  activated(){
    console.log('mainactivated')
  },
  methods:{
    //从articles数组中删除指定id的数据
    /*
    deleteArticle(id){
      this.articles.forEach((article,index)=>{
        if(article.id==id){
          this.articles.splice(index,1)
        }
      })
    }
    */
    //加载更多，给GET请求加入pageSize，offset，filter的参数，其中filter需要将filter对象转换为JSON字符串
    loadMore() {
      console.log('loadmore')
      if(!this.isLoadMore){
        debounce(this.sendGetReq,100)()
        //this.sendGetReq()
        this.isLoadMore=false
      }
      this.isLoadMore=false
    },
    //封装GET请求
    sendGetReq(){
      //按路由名分类，对tag路由进行/tag/:id请求，对其他路由不带参数直接请求，如/article,/archive
      let resource
      if(this.resource=="tag"){
        resource="tag/"+this.queryId
      }
      else{
        resource=this.resource
      }
      axios.get(`http://localhost:3000/api/${resource}?pageSize=${this.pageSize}&offset=${this.articles.length}&filter=${JSON.stringify(this.filter)}`).then(({data:res})=>{
        if(!res.err){
          //用解构语法追加，不可以直接赋值(之前的数据都会丢失)
          this.articles=[...this.articles,...res.data]
        }else{
          console.log(res.err)
        }
      })
    },
    //筛选条件改变时，封装filter对象，清空articles，重新发送GET请求获取条件筛选后的数据
    changeFilter(){
      //new Router创建路由时加入了name属性可以用$route.name取到，path中的参数可以由$route.params取到
      const {year,month}=this.$route.params  
      //如果是Archive路由，则按时间范围进行筛选，修改data中的filter属性，从而在GET请求中加入filter参数进行筛选
      if(this.$route.name==='Archive'){
        this.resource="article"
        this.filter={
          createdAt:{
            '$lt':`${year}-${+month+1}-1`,
            '$gte':`${year}-${month}-1`
          }
        }
        //对于不同的路由，需要清空articles再进行请求，确保各个参数都是初始状态。
        this.articles=[]
        this.sendGetReq()
        this.isLoadMore=true
      }
      else if(this.$route.name==='Tag'){
        this.resource="tag"
        const {id}=this.$route.params
        this.queryId=id
        //对于不同的路由，需要清空articles再进行请求，确保各个参数都是初始状态。
        this.articles=[]
        console.log('gotoTag')
        this.sendGetReq()
        this.isLoadMore=true
      }
      //如果是Home路由首页，则不加过滤
      else if(this.$route.name==='Home'){
        this.resource="article"
        this.filter={}
        this.articles=[]
        this.sendGetReq()
        this.isLoadMore=true
      }
    }
  },
  watch:{
    /*监听url的改变，$route是vue-router的指令，表示当前url*/
    '$route':function(newVal){
      //路由改变，重新筛选数据
      this.changeFilter()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-content
    margin-top 50px
    display flex
    flex-direction row-reverse
    @media screen and (max-width:960px)
        display block
    .content-wrapper
      width 75%
      margin 0
      padding 0
      @media screen and (max-width:960px)
        width 100%
        margin 0
        padding 0
      .article
        background #fff
        border-radius 4px
        box-shadow 1px 2px 300px #adc2d7
        border 1px solid #adc2d7
        margin-bottom 40px
    .right-wrapper
      width 25%
      margin-left 2%
      @media screen and (max-width:960px)
        width 100%
        margin-left 0
</style>
