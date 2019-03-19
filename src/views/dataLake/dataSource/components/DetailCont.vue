<template>
  <div class="detail-cont">
    <el-tabs v-model="activeName" v-if="data">
      <el-tab-pane label="配置信息" name="first">
        <el-form label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="名称">
                <span>{{ data.name }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ data.type }}</span>
              </el-form-item>
              <el-form-item label="业务系统名称">
                <span>{{ data.businessName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="连接URL">
                <span>{{ data.url }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ data.userName }}</span>
              </el-form-item>
              <el-form-item label="Processor 引用">
                <span>{{ data.connectCount }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="关联流程信息" name="second">
        <div class="handle-box">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="keyWords"
                placeholder="名称"
                class="handle-input mr10"
                suffix-icon="el-icon-search"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="feedList"
          @row-click="feedDetail"
          v-loading="loading"
          style="cousor:pointer"
        >
          <el-table-column property="displayName" label="名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="激活">
            <template slot-scope="scope">
              <span>
                <el-tag v-show="scope.row.state !== 'DISABLED'" type="success">是</el-tag>
                <el-tag v-show="scope.row.state === 'DISABLED'" type="info">否</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column property="modifiedTime" label="最近修改" sortable prop="modifiedTime">
            <template slot-scope="scope">
              <span>{{scope.row.modifiedTime | getLocalTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-show="page.total">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currPage"
            :page-sizes="page.limit"
            layout="total, sizes, prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      activeName: 'first',
      loading: false,
      keyWords: '',
      feedList: null,
      page: {
        total: 0, // 条数
        page: 1, // 总页数
        curr: 1, // 当前页
        size: 10, // 显示条数
        limit: [10, 20, 50, 100]
      }
    }
  },
  watch: {
    data() {
      this.activeName = 'first'
      // this.handletableData()
    },
    keyWords() {
      this.page.curr = 1;
      this.handletableData()
    }
  },
  filters: {
    // 把时间戳转为标准格式
    getLocalTime(value) {
      return new Date(parseInt(value))
        .toLocaleString()
        .replace(/:\d{1,2}$/, '');
    }
  },
  created() {
    // this.handletableData()
  },
  methods: {
    // 跳转到流程详情
    feedDetail(row) {
      this.$router.push({
        path: '/flowManage/editFeed',
        query: { feedDetail: row }
      });
    },
    // 搜索
    search() {
      this.page.curr = 1;
      this.handletableData();
    },
    // 处理分页数据
    handletableData() {
      if (!this.sourceForFeeds || datathis.data.sourceForFeeds.length === 0) {
        return;
      }
      this.loading = true
      const { size, curr } = this.page;
      const startIndex = (curr - 1) * size;
      const endIndex = curr * size;
      let tempList = [];
      for (const item of this.data.sourceForFeeds) {
        if (item.displayName.includes(this.keyWords)) {
          tempList.push(item);
        }
      }
      this.page.total = tempList.length;
      tempList = tempList.slice(startIndex, endIndex);
      this.feedList = tempList;
      this.loading = false;
    },
    // pageSize变化
    handleSizeChange(val) {
      // pageSize
      this.page.size = val;
      this.handletableData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.curr = val;
      this.handletableData();
    }
  }
}
</script>
<style scoped>
.detail-cont {
  margin-top: -15px;
}
</style>


