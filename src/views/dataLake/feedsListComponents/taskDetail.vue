<template>
  <el-table :show-header="false" :data='tabData'>
    <el-table-column prop='key'>
    </el-table-column>
    <el-table-column prop='value'>
    </el-table-column>
  </el-table>
</template>

<script>
import { getTaskDetails } from '@/api/dataLake/api.js'
export default {
  props: ['id'],
  data () {
    return {
      tabData:[],
    }
  },
  watch: {
    id(id){
        getTaskDetails(id).then(res => {
            let arr = []
            for(let key in res.data){
              let json = {}
              console.log(res.data[key])
              if(typeof(res.data[key]) !== 'string' ){
                  json = {key:key,value:res.data[key].length}
              }
              else{
                  json = {key:key,value:res.data[key]}
              }
              arr.push(json)
            }
            console.log(arr)
            this.tabData = arr
      })
    }
  },
  methods: {
  }
}
</script>
