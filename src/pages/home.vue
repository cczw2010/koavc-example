<style scoped>
  .home{
    color:brown
  }
</style>
<template>
  <v-row justify="center">
    <!-- <v-date-picker v-model="dates"  multiple ></v-date-picker> -->
    <ComponentA title="conter"></ComponentA>
  </v-row>
</template>
<script type="text/javascript">
  export default {
    asyncData(data){
      return {
        title : `${data.title||'asyncData home inject title'}`
      }
    },
    head(){
      return {
        title:this.title,
        style: [
          { cssText: '.headhome { color: red }', type: 'text/css' }
        ]
      }
    },
    layout:'default',
    data(){
      return {
        title:"home title",
        dates: ['2021-09-15', '2021-09-20'],
      }
    },
    methods:{
     
    }
  }
</script>