<!--  -->
<template>
  <div class="default-cont">
    <el-card class="box-card">
      <div class="cont">
        <el-tabs value="first">
          <el-tab-pane label="最近任务" name="first">
            <el-table
              ref="multipleTable"
              :data="topTaskList"
              v-loading="taskLoading"
              border
              style="width: 100%"
              @cell-click="cellClick"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" :selectable="isdisable" v-if="btnState"></el-table-column>
              <el-table-column prop="name" label="名称" width="120" applicaton sortable></el-table-column>
              <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column
                prop="creat_time"
                label="创建时间"
                :show-overflow-tooltip="true"
                sortable >
                <template slot-scope="scope">
                  <span>{{scope.row.creat_time | formatLongTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_time"
                label="更新时间"
                :show-overflow-tooltip="true"
                sortable>
                <template slot-scope="scope">
                  <span>{{scope.row.update_time | formatLongTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据源数" label-class-name="ds_list_relation">
                <template slot-scope="scope">
                  <span>{{ scope.row.ds_list_relation | count }}</span>
                </template>
              </el-table-column>
              <el-table-column label="模型数" label-class-name="model_list_relation">
                <template slot-scope="scope">
                  <span>{{ scope.row.model_list_relation | count }}</span>
                </template>
              </el-table-column>
              <el-table-column label="标准数" label-class-name="standard_list_relation">
                <template slot-scope="scope">
                  <span>{{ scope.row.standard_list | count }}</span>
                </template>
              </el-table-column>
              <el-table-column label="主题数" label-class-name="subject_list">
                <template slot-scope="scope">
                  <span>{{ scope.row.subject_list | count }}</span>
                </template>
              </el-table-column>
              <el-table-column label="规则数" label-class-name="rule_list">
                <template slot-scope="scope">
                  <span>{{ scope.row.rule_list | count }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="最近流程" name="second" v-if="!btnState">
            <el-table
              :data="topFeedList"
              v-loading="feedLoading"
              border
              style="width: 100%"
              @row-click="rowClick"
            >
              <el-table-column prop="feedName" label="流程名" width="120" show-overflow-tooltip sortable></el-table-column>
              <el-table-column label="状态" sortable>
                <template slot-scope="scope">
                  <span>{{scope.row.state | translate}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="categoryName" label="所属分类" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="templateName" label="类型" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column
                prop="updateDate"
                label="更新时间"
                :show-overflow-tooltip="true"
                sortable
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.updateDate | formatTime }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
  </div>
</template>

<script>

// 方法
import { translateJsonData } from '@/utils/translate'
import { getTopTask, getTopFeed, getFeedDetail } from '@/api/curd/feed/index.js'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    ReladionDialog
  },
  props: ['btnState', 'selectedData'],
  data() {
    // 这里存放数据
    return {
      taskLoading: true,
      topTaskList: [],
      feedLoading: true,
      topFeedList: [],
      feedQuery: {
        verbose: false,
        sort: '-updateDate',
        start: 0,
        limit: 10
      },
      dialog: {
        title: '关联关系',
        config: {
          data: [],
          fromCol: 'from_name',
          fromName: '',
          toCol: 'to_name',
          toName: ''
        },
        realationVisible: false
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  // 过滤
  filters: {
    count(arr) { // 计算个数
      if (Array.isArray(arr)) return arr.length;
      return 0
    },
    translate(val) {
      if (translateJsonData[val] === '' || translateJsonData[val] === undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
    formatTime(str) { // 把时间戳转为 2019/1/25 上午11:37:02
      return new Date(str).toLocaleString()
    }
  },
  methods: {
    //跳转
    rowClick(row) {
      console.log(row)
      getFeedDetail(row.id).then(res => {
        this.$router.push({ path: 'editFeed', query: { feedDetail: res } })
        window.localStorage.setItem('data', JSON.stringify(res));
      })
    },
    // 过滤掉选中的数据
    isdisable(row) {
      if (!this.selectedData) return true
      for (const o of this.selectedData) {
        if (row.id === o.parent_id || row.id === o.to_id) {
          return false
        }
      }
      return true
    },
    // 最近的任务
    getTopTaskList() {
      this.taskLoading = true;
      getTopTask().then(res => {
        this.taskLoading = false;
        if (res.code !== 0) {
          this.$message.error('获取最近任务失败')
          return;
        }
        this.topTaskList = res.data;
      }).catch(() => {
        this.taskLoading = false;
      })
    },
    handleSelectionChange(val) {
      console.log('list-val')
      console.log(val)
      this.$emit('selectionChange', val)
    },
    // 最近流程
    getTopFeedList() {
      this.feedLoading = true;
      getTopFeed(this.feedQuery).then(res => {
        this.feedLoading = false;
        if (res.status) {
          this.$message.error('获取最近流程失败')
          return;
        }
        this.topFeedList = res.data;
      }).catch(() => {
        this.feedLoading = false;
      })
    },
    // 单元格被点击
    cellClick(row, column) {
      console.log(row)
      if (!column.labelClassName) return;
      this.dialog.config.fromName = '任务名称'
      this.dialog.config.fromCol = 'to_name'
      this.dialog.config.toCol = 'from_name'
      this.dialog.config.toName = column.label.slice(0, column.label.length - 1) + '名称'
      this.dialog.realationVisible = true;
      this.dialog.config.data = row[column.labelClassName]
      console.log('传递的值')
      console.log(this.dialog.config.data)
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getTopTaskList();
    this.getTopFeedList()
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>