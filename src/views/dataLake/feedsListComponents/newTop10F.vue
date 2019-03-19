<template>
  <el-table :data="tabData" v-loading="loading" style="width: 100%" @row-click="rowClick">
    <el-table-column prop="feedName" label="流程名"></el-table-column>
    <el-table-column label="状态" prop="state" sortable>
      <template slot-scope="scope">
        <span>{{scope.row.state | translate}}</span>
      </template>
    </el-table-column>
    <el-table-column label="所属分类" prop="categoryName"></el-table-column>
    <el-table-column label="类型" prop="templateName"></el-table-column>
    <el-table-column label="更新时间">
      <template slot-scope="scope">
        <span>{{(new Date(scope.row.updateDate)).toLocaleString()}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getFeedsList } from '@/api/dataLake/api.js'
import { translateJsonData } from '@/utils/translate'

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
    getTable () {
      this.loading = true
      let params = `verbose=false&sort=-updateDate&limit=10&start=0`;
      getFeedsList(params).then(res => {
          this.tabData = res.data
          this.loading = false
      })
    },
    rowClick (row) {
      this.$emit('TopClick', row)
    }
  },
  filters: {
      translate (val) {
      if (translateJsonData[val] == "" || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
  },
  mounted () {
    this.getTable()
  }
}
</script>
