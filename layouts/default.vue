<style scoped>
  .app-layout{
    margin:0;padding:0;
    background:#ccc
  }
</style>
<template>
  <v-app class="app-layout">
    <v-app-bar app dense
      color="deep-purple accent-4"  >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <custom-page ref="page"/>
      </v-container>
    </v-main>
    <v-footer app></v-footer>
  </v-app>
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
      // link: [
      //   { rel: 'favicon', href: 'favicon.ico' }
      // ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/vue@2.6.14' },
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
  methods:{
    onClick(){
      console.log('onClick title')
    }
  }
}
</script>