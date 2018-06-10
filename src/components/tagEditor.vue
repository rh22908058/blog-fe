<template>
    <div class="tag-editor">
        <!--使用vue-material组件，包括响应式布局，输入框，按钮，表单-->
        <!--使用vue-editor组件作为输入框-->
        <form novalidate>
            <md-layout md-gutter class="wrapper">
                <md-layout md-flex-xsmall="100" md-flex-small="100" class="item">
                    <md-input-container>
                        <label>标签名</label>
                        <md-input v-model="tag.name"></md-input>
                    </md-input-container>
                </md-layout>   
                <md-layout md-flex-xsmall="100" md-flex-small="100" class="item">
                    <md-input-container>
                        <label>说明</label>
                        <md-input v-model="tag.desc"></md-input>
                    </md-input-container>
                </md-layout>
            </md-layout>
        </form>
    </div>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    export default{
        data(){
            return {
                tag:{}
            }
        },
        methods:{
            tagCommit(){
                axios.post("http://localhost:3000/api/tag",this.tag).then(res=>{
                    if(!res.data.err){
                        this.$emit('dataadd',res.data.data)
                        alert('提交成功')
                    }else{
                        alert('提交失败')
                    }
                })
            }  
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>