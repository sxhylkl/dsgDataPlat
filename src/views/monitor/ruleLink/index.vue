<template>
  <div class="rule-link-box">
    <div v-if='false'>
      <rule-set></rule-set>
    </div>
    <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="请输入查询条件"
          v-model="listQuery.name"
        ></el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="search" @click="handleRule">关联规则</el-button>
      </div>
      <el-table
        :data="list"
        v-loading.body="listLoading"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
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
        <el-table-column width="110" align="center" label="身份">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isSuperAdmin === '0' ? 'primary' : 'warning'" close-transition>
              <span v-if="scope.row.isSuperAdmin === '0'">普通身份</span>
              <span v-else-if="scope.row.isSuperAdmin === '1'">超级管理员</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="300" align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" label="最后时间">
          <template slot-scope="scope">
            <span>{{scope.row.updTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="最后更新人">
          <template slot-scope="scope">
            <span>{{scope.row.updUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <el-button plain size="small" type="success" @click="handleRule(scope.row)">
              <!--<i class="el-icon-edit" />-->
              添加规则
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-show="!listLoading&&total">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="关联规则" :visible.sync="dialogVisible" width="100%" :fullscreen="true">
      <rule-link-cont @saveRule="saveRule"></rule-link-cont>
    </el-dialog>
  </div>
</template>
<script>
import RuleSet from '@/components/RuleSet/index.vue'
import RuleLinkCont from './components/RuleLinkCont.vue'
export default {
  components: {
    RuleLinkCont,
    RuleSet
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        username: undefined
      },
      dialogVisible: false
    }
  },
  created() {
    this.listLoading = false;
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      this.listQuery.username = this.listQuery.name;
      page(this.listQuery)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
    },
    // 添加规则
    handleRule(row) {
      console.log(row)
      this.dialogVisible = true
    },
    // 保存规则
    saveRule() {
      console.log('保存操作')
      this.dialogVisible = false;
    },
    // 搜索
    handleFilter() {
      this.getList();
    },
    // pageSize变化
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    // 翻页
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
}
</script>

