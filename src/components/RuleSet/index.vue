<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="12">
                <span>知识包</span>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-input
              v-model="keyWords"
              placeholder="编码或名称"
              class="handle-input mr10"
              suffix-icon="el-icon-search"
            ></el-input>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="listLoading"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table :data="props.row.resourceItems" style="width: 100%">
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="path" label="资源文件路径"></el-table-column>
                    <el-table-column prop="version" label="版本"></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="编码"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="createDate" label="创建时间"></el-table-column>
            </el-table>
            <div class="pagination" v-show="page.total">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currPage"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                :total="page.total"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getKnowledge, getRuleName } from '@/api/ruleSet/index.js'
export default {
  props: {
    selection: Array
  },
  data() {
    return {
      list: [],
      tableData: [],
      multipleSelection: [],
      keyWords: '',
      listLoading: true,
      page: {
        total: 0,
        page: 1,
        currPage: 1,
        pageSize: 10
      },
      ruleName: ''
    }
  },
  watch: {
    keyWords() {
      this.page.currPage = 1;
      this.handletableData()
    }
  },
  created() {
    this.getRuleName()
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getKnowledge(this.ruleName).then(data => {
        this.listLoading = false;
        this.list = data ? data : [];
        this.page.total = data.length;
        this.tableData = this.list.slice(0, this.page.pageSize);
      })
    },
    // 获取ruleName
    getRuleName() {
      getRuleName().then(data => {
        this.ruleName = data ? data : ''
      })
    },
    // 表格选中变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // pageSize变化
    handleSizeChange(val) {
      // pageSize
      this.page.pageSize = val;
      this.handletableData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.currPage = val;
      this.handletableData();
    },
    // 处理分页数据
    handletableData() {
      const { pageSize, currPage } = this.page;
      const startIndex = (currPage - 1) * pageSize;
      const endIndex = currPage * pageSize;
      let tempList = [];
      for (const item of this.list) {
        if (item.name.includes(this.keyWords) || item.id.includes(this.keyWords)) {
          tempList.push(item);
        }
      }
      this.page.total = tempList.length;
      tempList = tempList.slice(startIndex, endIndex);
      this.tableData = tempList;
      this.loading = false;
    }
  }
}
</script>

