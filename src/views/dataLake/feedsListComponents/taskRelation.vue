<template>
      
</template>

<script>
import { getTaskRelationDetails } from '@/api/dataLake/api.js'
export default {
  props:['id'],
  data(){
    return{
      
    }
  },
  watch:{
     id(id){
        getTaskRelationDetails(id).then(res => {
        console.log(res)
      })
    }
  },
  methods:{

  }
}
</script>
