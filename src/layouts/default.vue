<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
</style>
<template>
<el-container>
  <el-aside width="200px">Aside</el-aside>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
      <custom-page></custom-page>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</el-container>
</template>
<script>

export default {
  head:{
      title:"layout title",
      meta:[
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {name: 'keywords', content: 'test' }
      ],
  },
  asyncData(data){
    return {
      title : `asyncData layout ${data.title||'inject title'}`
    }
  },
  data(){
    return {
      title:'layout title'
    }
  },
}
</script>