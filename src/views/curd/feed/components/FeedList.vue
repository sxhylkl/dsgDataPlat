<!--  -->
<template>
  <div class="feed-list">
    <div class="table-box">
      <div class="table-btn">
        <el-row>
          <el-col :span="12">
            <!-- <el-button type="primary" size="mini" @click.native="creatFeed">新建流程</el-button>
            <el-button type="primary" size="mini" @click.native="preview">快速预览</el-button>
            <el-button type="primary" size="mini" @click.native="relativeFeed">关联流程</el-button>-->
          </el-col>
          <el-col :span="6" style="float: right;    margin-top: -40px;">
            <el-input prefix-icon="el-icon-search" v-model="keyWords" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-table :data="feedList" border style="width: 100%" v-loading="feedLoading">
        <el-table-column prop="feedName" label="流程名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <span>{{scope.row.state | translate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="所属分类" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="templateName" label="类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="address" label="更新时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{(new Date(scope.row.updateDate)).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="导出流程" placement="bottom">
              <el-button type="primary" size="small" plain>
                <a :href="'/datalake-feed_/v1/feedmgr/admin/export-feed/'+scope.row.id">
                  <i class="el-icon-upload2"></i>
                </a>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑流程" placement="bottom">
              <el-button type="primary" size="small" plain @click="editFedd(scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除流程" placement="bottom">
              <el-button
                type="danger"
                size="small"
                plain
                @click="delFedd(scope.row)"
                :disabled="scope.row.state==='ENABLED'"
              >
                <i class="el-icon-delete"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看流程质量列表" placement="bottom">
              <el-button type="success" size="small" plain @click="lookQuality(scope.row)">
                <i class="el-icon-zoom-in"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-show="page.total">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// 例如：import 《组件名称》 from '《组件路径》';
import { translateJsonData } from '@/utils/translate'
import { getFeed, getFeedDetail, delFeed } from '@/api/curd/feed/index.js'
import { getDataSourceById } from '@/api/dataLake/api'
export default {
  // import引入的组件需要注入到对象中才能使用/
  components: {},
  props: ['taskInfo'],
  data() {
    // 这里存放数据
    return {
      keyWords: '',
      list: [],
      feedList: [],
      taskId: '',
      page: {
        total: 0,
        page: 1,
        current: 1,
        size: 10
      },
      feedLoading: false
    };
  },
  filters: {
    translate(val) {
      if (translateJsonData[val] === '' || translateJsonData[val] === undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    keyWords() {
      this.page.current = 1;
      this.handletableData()
    }
  },
  // 方法集合
  methods: {
    // 传参过滤
    meData(data) {
      const arr = [{ name: 'Hive', id: 'Hive' }]
      data.ds_list.map(one => {
        const filterArr = ["Oracle", "DB2", "SqlServer", "PostgreSQL", "MySQL", "HIVE"];
        filterArr.map(filterOne => {
          if (one.type === filterOne) {
            getDataSourceById(one.id).then(data => {
              arr.push(data.data)
              console.log('----------get')
            })
          }
        })

      })
      return arr
    },
    /* 跳转至治理流程 */
    relativeFeed(data) {
      this.taskInfo.ds_list = this.meData(this.taskInfo)
      this.$router.push({ name: '治理流程', query: { id: this.taskInfo.referId }, params: { taskParams: this.taskInfo } }); /* query:{ id:'2'}} */
    },
    creatFeed() {
      this.taskInfo.ds_list = this.meData(this.taskInfo)
      this.$router.push({ name: '流程详情', params: { taskInfo: this.taskInfo } })
    },
    preview() {
      this.taskInfo.ds_list = this.meData(this.taskInfo)
      this.$router.push({ name: '可视化查询', params: { taskParams: this.taskInfo } })
    },
    editFedd(row) {
      getFeedDetail(row.id).then(res => {
        this.$router.push({ path: 'editFeed', query: { feedDetail: res } })
        window.localStorage.setItem('data', JSON.stringify(res));
      })
    },
    delFedd(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.feedLoading = true
        delFeed(row.id).then(res => {
          this.feedLoading = false
          if (res.status === 'error') {
            this.$message.error('删除失败');
            return;
          }
          this.$message.success('删除成功');
          this.getFeedList(this.taskId);
        }).catch(() => {
          this.feedLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    lookQuality(row) {
      const { feedId } = row
      const path = this.$route.path
      this.$router.push({ path: '/dataQuality', query: { feedId, path } })
    },
    // 确认框
    confirm(callback) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 获取流程列表
    getFeedList(id) {
      this.taskId = id;
      this.feedLoading = true
      getFeed(id).then(res => {
        this.feedLoading = false
        if (res.status) {
          this.$message.error('获取数据失败');
          return;
        }
        this.feedList = res;
        this.list = res;
        // this.handletableData()
      }).catch(() => {
        this.feedLoading = false
      })
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
      /* const { size, current } = this.page;
        const startIndex = (current - 1) * pageSize;
        const endIndex = current * size; */
      let tempList = [];
      for (const item of this.list) {
        console.log(item)
        if (item.feedName.includes(this.keyWords)) {
          tempList.push(item);
        }
      }
      this.feedList = tempList;
      /* this.page.total = tempList ? tempList.length : 0;
      tempList = tempList.slice(startIndex, endIndex);
      this.feedList = tempList;
      this.loading = false; */
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.table-btn {
  margin-bottom: 10px;
}
.feed-list {
  min-height: 350px;
}
</style>
