<template>
  <div class="main-content">
    <div class="scroll-top" @click="scrollToTop">
      <i class="icon-circle-up"></i>
    </div>
    <div class="right-wrapper">
        <lateart></lateart>
        <file :hidden="fileH" @fileSelect="hiddenT"></file>
        <tag :hidden="tagH" @tagSelect="hiddenF" @home="goHome"></tag>
    </div>
    <!--在滚动区域的容器中使用infinte-scroll下拉加载组件的指令-->
    <div class="content-wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">   
      <div v-for="item in articles">
        <artical :article="item" class="article"></artical>
      </div>     
      <loading v-if="!isEnd"></loading>
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
import Loading from '../components/load'

export default {
  //add
  name:'main',
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
      //路由更改时，会自动触发loadMore，造成重复发送get请求
      //设置标志禁止在loadMore中再次调用sendGetReq发送get请求
      isLoadMore:false,
      //只有当一次get请求获得相应数据后才可以在loadMore回调中再次发送get请求获取下一页数据
      //当网速较慢时，一页数据没有加载完毕时禁止在loadMore回调中再次发送get请求
      canLoadMore:true,
      //文章是否加载完毕，如果加载完毕则隐藏loading
      isEnd:false,
      date:{},
      tagid:'',
      tagH:true,
      fileH:true
    }
  },
  components:{
    artical,
    lateart,
    file,
    tag,
    Loading
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
    //初始化滚动高度
    sessionStorage.setItem("scrollTop",0)
    console.log('maincreated')
    this.changeFilter()
  },
  activated(){
    console.log('mainactivated')
    var scrollTop=sessionStorage.getItem("scrollTop")
    setTimeout(()=>{
      window.scrollTo(0, scrollTop)
    },1000)
  },
  methods:{
    hiddenT(){
      this.tagH=false
      this.fileH=true
    },
    hiddenF(){
      this.fileH=false
      this.tagH=true
    },
    scrollToTop(){
      window.scrollTo(0, 0)
      sessionStorage.setItem("scrollTop",0)
    },
    goHome(){
      this.changeFilter()
    },
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
      if(this.$route.name!='Home'){
        return
      }
      //只有当不是路由改变触发的loadMore事件且只有当上一次get请求获取到响应数据时，才发送请求获取下一页数据
      if(!this.isLoadMore&&this.canLoadMore){
        debounce(this.sendGetReq,1000)()
        //this.sendGetReq()
        this.isLoadMore=false
      }
      this.isLoadMore=false
    },
    //封装GET请求
    sendGetReq(){
      this.canLoadMore=false
      //按路由名分类，对tag路由进行/tag/:id请求，对其他路由不带参数直接请求，如/article,/archive
      let resource
      if(this.resource=="tag"){
        resource="tag/"+this.queryId
      }
      else{
        resource=this.resource
      }
      console.log('resource'+this.resource)
      if(!this.isEnd){
        axios.get(`http://localhost:3000/api/${resource}?pageSize=${this.pageSize}&offset=${this.articles.length}&filter=${JSON.stringify(this.filter)}`).then(({data:res})=>{
          if(!res.err){
            //用解构语法追加，不可以直接赋值(之前的数据都会丢失)
            this.articles=[...this.articles,...res.data]
            this.canLoadMore=true
            //count<pageSize说明已经到了最后一条记录，隐藏loading
            console.log(res.pagination.count+' '+res.pagination.pageSize)
            if(res.pagination.count<res.pagination.pageSize){
              this.isEnd=true
            }
          }else{
            console.log(res.err)
          }
        })
      }
    },
    //筛选条件改变时，封装filter对象，清空articles，重新发送GET请求获取条件筛选后的数据
    changeFilter(){
      this.isEnd=false
      console.log(this.$route.hash)
      //new Router创建路由时加入了name属性可以用$route.name取到，path中的参数可以由$route.params取到
      //const {year,month}=this.$route.params  
      //如果是Archive路由，则按时间范围进行筛选，修改data中的filter属性，从而在GET请求中加入filter参数进行筛选
      if(/archive/.test(this.$route.hash)){
        console.log('articlechange')
        this.resource="article"

        const result=this.$route.hash.match(/\d+/g)
        //如果archive请求与上次archive请求url相同，则说明是返回，使用缓存不必重新请求
        if((+result[0]==this.date.year)&&(+result[1]==this.date.month)){
          return
        }
        //是新的archive请求，更新date属性并发送请求
        this.date.year=+result[0]
        this.date.month=+result[1]
        this.filter={
          createdAt:{
            '$lt':`${this.date.year}-${this.date.month+1}-1`,
            '$gte':`${this.date.year}-${this.date.month}-1`
          }
        }
        //对于不同的路由，需要清空articles再进行请求，确保各个参数都是初始状态。
        this.articles=[]
        this.sendGetReq()
        this.isLoadMore=true
      }
      else if(/tag/.test(this.$route.hash)){
        console.log('tagchange')
        this.resource="tag"
        //如果tag请求与上次tag请求url相同，则说明是返回，使用缓存不必重新请求
        const result=this.$route.hash.match(/\d+/g)
        if(result[0]==this.tagid){
          return
        }
        //是tag请求，更新当前的tagid并发送请求
        this.tagid=result[0]
        this.queryId=this.tagid
        //对于不同的路由，需要清空articles再进行请求，确保各个参数都是初始状态。
        this.articles=[]
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
      console.log('changefilter')
      console.log(newVal)
      //如果还是Home路由则不发送请求，Home路由hash为空
      if(this.$route.hash){
        this.changeFilter()
      }
      //路由改变，重新筛选数据
      //this.changeFilter()
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
    .scroll-top
      position fixed
      bottom 20px
      right 20px
      border-radius 50%
      width 30px
      height 30px
      font-size 30px
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
