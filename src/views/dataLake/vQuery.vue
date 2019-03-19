
<template>
  <my-visualization :nextShow = 'nextShow' :beforeShow = 'beforeShow' :dataBaseArr='dataBaseArr'></my-visualization>
</template>

<script>
import  myVisualization  from './visualization.vue'
export default {
  name: 'vQuery',
  components: {
    myVisualization
  },
  data(){
    return{
      nextShow:false,
      beforeShow:false,
      dataBaseArr:[],
    }
  },
  mounted () {
     console.log(this.$route.params)
    this.dataBaseArr =  this.$route.params.taskParams.ds_list
    
  }
}
</script>
