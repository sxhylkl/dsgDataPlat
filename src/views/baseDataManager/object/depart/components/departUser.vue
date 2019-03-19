<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  type="primary" @click="onSubmit">添加</el-button>
    </div>
    <el-table ref="userTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column width="200" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="账户">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  page
} from '@/api/admin/user/index';
export default {
  name: 'userSelect',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      tableKey: 0,
      selects: []
    }
  },
  created() {
    this.selects = []
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          for (let i = 0; i < this.selects.length; i++) {
            for (let j = 0; j < response.data.rows.length; j++) {
              if (response.data.rows[j].id === this.selects[i].id) {
                response.data.rows.splice(j, 1);
              }
            }
          }
          const rows = this.selects.concat(response.data.rows);
          this.list = rows;
          this.total = response.data.total;
          this.listLoading = false;
          page(this.listQuery)
            .then(() => {
              for (let i = 0; i < this.selects.length; i++) {
                this.$refs.userTable.toggleRowSelection(this.selects[i]);
              }
            });
        })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    onSubmit() {
      this.$emit('closeUserDialog', this.selects);
    },
    clear() {
      this.selects = []
      this.getList()
    },
    handleSelectionChange(val, row) {
      let flag = true;
      let repeat = false;
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === row.id) {
          for (let j = 0; j < this.selects.length; j++) {
            if (this.selects[j].id === row.id) {
              repeat = true
            }
          }
          if (!repeat) {
            this.selects.push(row);
            flag = false;
          }
          break;
        }
      }
      if (flag) {
        const index = this.list.indexOf(row);
        this.selects.splice(index, 1);
      }
    }
  }
}
</script>