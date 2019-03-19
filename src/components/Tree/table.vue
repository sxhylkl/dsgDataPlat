<template>
  <section>
    <el-row :gutter="20">
      <el-row>
        <el-col :span="18">
          <el-form>
            <el-form-item label="过滤" label-width="200px">
              <el-input placeholder="请输入中文名称进行查询" v-model="query"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-col :span="24">
        <el-table
          :data="ServiceData"
          style="width: 100%"
          border
          v-loading="loadding"
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="namecn" label="中文名称" sortable width="180"></el-table-column>
          <el-table-column label="英文名称" prop="nameen" sortable width="180"></el-table-column>

          <el-table-column label="说明" prop="description" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="data_type" label="数据类型"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
        </el-table>

        <div class="block" style="float:right;margin-top: 12px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </section>
</template>


<style scoped>
</style>

<script>
import { getTab, getStandarBaseColumn } from '@/api/Tree/relation'
export default {
  name: 'myTab',
  data() {
    return {
      loadding: false,
      query: '',
      currentPage: 1,
      ServiceData: [],
      tableData1: [],
      ServiceAllData: [],
      total: 20,
      pageSize: 10,
      selected: []
    }
  },
  watch: {
    query() {
      this.serviceDataChange()
    }
  },
  methods: {
    getTable() {
      this.loadding = true
      getTab().then(res => {
        let data = res.data
        this.ServiceData = data.slice(0, 10)
        this.ServiceAllData = data
        this.total = data.length
        this.loadding = false
      })
    },
    // 获取字段信息
    getStandarBaseColumnList(obj) {
      this.loadding = true
      getStandarBaseColumn(obj).then(res => {
        const data = res.data
        this.ServiceData = data.slice(0, 10)
        this.ServiceAllData = data
        this.total = data.length
        this.loadding = false
      })
    },
    serviceDataChange() {
      let ServiceAllData = [...this.ServiceAllData]
      let newArr = [];
      ServiceAllData.forEach(one => {
        if (one.namecn.indexOf(this.query) > -1) {
          newArr.push(one)
        }
      })
      this.total = newArr.length
      this.ServiceData = newArr.slice((this.currentPage - 1) * this.pageSize, this.pageSize * this.currentPage)
      console.log(this.ServiceData)
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.serviceDataChange()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.serviceDataChange()
    }
  },
  mounted() {
    // this.getTable()
  }
}
</script>
