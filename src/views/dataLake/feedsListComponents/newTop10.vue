<template>
  <el-table :data="tabData" v-loading="loading" @row-click='rowClick'>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="description" label="说明"></el-table-column>
    <el-table-column prop="createTime" label="创建时间"></el-table-column>
    <el-table-column prop="updateTime" label="更新时间"></el-table-column>
    <el-table-column prop="dsList" label="数据源个数">
      <template slot-scope="scope">
          <span>{{lengthMes(scope.row,'dsList')}}</span>
      </template>
    </el-table-column>
      <el-table-column prop="ruleList" label="规则个数">
      <template slot-scope="scope">
          <span>{{lengthMes(scope.row,'ruleList')}}</span>
      </template>
    </el-table-column>
      <el-table-column prop="standardList" label="标准个数">
      <template slot-scope="scope">
          <span>{{lengthMes(scope.row,'standardList')}}</span>
      </template>
    </el-table-column>
      <el-table-column prop="subjectList" label="主题个数">
      <template slot-scope="scope">
          <span>{{lengthMes(scope.row,'subjectList')}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getTaskNum } from '@/api/dataLake/api.js'
export default {
  name: 'newTop',
  props: ['id'],
  data () {
    return {
      tabData: [],
      loading: false
    }
  },
  methods: {
    lengthMes(row,type){
        if(typeof(row[type]) != 'undefined'){
            return  row[type].length
        } 
        else{
          return 0 
        }
    },
    getTable () {
      this.loading = true
      getTaskNum(10).then(res => {
        if (res.code === 0) {
          this.tabData = res.data
          this.loading = false
        }
      })
    },
    rowClick(row){
      this.$emit('TopClick',row)
    }
  },
  mounted () {
      this.getTable()
  }
}
</script>
