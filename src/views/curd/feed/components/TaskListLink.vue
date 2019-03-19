<!--  -->
<template>
  <div class="feed-cont">
    <el-card class="box-card" v-show="!isFeed">
      <div slot="header" class="clearfix">
        <span>任务列表</span>
        <span
          style="float:right;cursor:pointer"
          class="fa fa-refresh"
          title="最新数据"
          @click="getTopClick"
        ></span>
      </div>
      <div class="cont" v-loading="loading">
        <el-button
          type="primary"
          @click="addTask"
          style="margin-bottom:15px;"
          size="mini"
          v-if="false"
        >新增</el-button>
        <task-table
          ref="taskTable"
          :list="taskList"
          :selectedData="selectedData"
          @delTask="removeTab"
          @addTask="addTask"
          @handleFeed="handleFeed"
          @getTaskList="getTaskList(nodeId)"
        ></task-table>
      </div>
      <!-- <div class="cont" v-loading="loading">
        <el-tabs
          v-model="activeTabs"
          key="task"
          editable
          @tab-add="addTask"
          @tab-remove="removeTab"
          @tab-click="taskTabClick">
          <el-tab-pane :key="item.id" v-for="item in taskList" :label="item.name" :name="item.id"></el-tab-pane>
        </el-tabs>
        <task-cont v-show="taskList && taskList.length>0" ref="taskCont" :taskInfo="taskInfo"></task-cont>
        <p v-show=" !taskList || taskList.length===0">暂无数据</p>
      </div>-->
    </el-card>
    <el-card v-show="isFeed">
      <div slot="header" class="clearfix">
        <span>流程列表</span>
        <span style="float:right;cursor:pointer" @click="isFeed=false">返回</span>
      </div>
      <div>
        <el-button
          style="margin-bottom:10px"
          type="primary"
          size="mini"
          @click.native="creatFeed"
          v-show=" !(!taskList || taskList.length===0)"
        >新建流程</el-button>
        <el-button
          style="margin-bottom:10px"
          type="primary"
          size="mini"
          @click.native="preview"
          v-show=" !(!taskList || taskList.length===0)"
        >快速预览</el-button>
        <task-cont ref="taskCont" :taskInfo="taskInfo"></task-cont>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTask, delTask } from '@/api/curd/feed/index.js'
import TaskTable from './TaskTableLink.vue'
import TaskCont from './TaskCont'
export default {
  name: 'TaskListLink',
  // import引入的组件需要注入到对象中才能使用
  components: {
    TaskTable,
    TaskCont
  },
  props: ['selectedData'],
  data() {
    // 这里存放数据
    return {
      loading: false,
      activeTabs: '',
      taskInfo: null,
      taskList: [],
      nodeId: '',
      isFeed: false
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
  },
  // 方法集合
  methods: {
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
    selectionChange(val) {
      console.log('list-val')
      console.log(val)
      this.$emit('selectionChange', val)
    },
    handleFeed(data) {
      this.isFeed = true
      this.taskInfo = data
      this.$refs.taskCont.getCont(data.id)
    },
    creatFeed() {
      this.taskInfo.ds_list = this.meData(this.taskInfo)
      this.$router.push({ name: '流程详情', params: { taskInfo: this.taskInfo } })
    },
    preview() {
      this.taskInfo.ds_list = this.meData(this.taskInfo)
      this.$router.push({ name: '可视化查询', params: { taskParams: this.taskInfo } })
    },
    addTask() {
      this.$emit('addTask')
    },
    getTopClick() {
      this.$emit('getTopClik')
    },
    removeTab(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        delTask(id).then(res => {
          this.loading = false;
          if (res.code !== 0) {
            this.$message.error('删除失败')
            return;
          }
          this.$message.success('删除成功')
          this.getTaskList(this.nodeId)
        }).catch(() => {
          this.loading = false;
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    /*  taskTabClick(data) {
       this.taskInfo = this.taskList[data.index];
       this.$refs.taskCont.getCont(data.name)
     }, */
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
    // 获取任务列表
    getTaskList(id) {
      this.nodeId = id
      this.isFeed = false
      getTask(id).then(res => {
        if (res.code !== 0) {
          this.$message.error('获取数据失败');
          return;
        }
        this.taskList = res.data
        console.log('----------------')
        console.log(res)
        if (res.data && res.data.length > 0) {
          this.taskInfo = res.data[0]
          this.activeTabs = res.data[0].id;
          // this.$refs.taskCont.getCont(this.activeTabs)
        } else {
          this.taskInfo = {}
        }
        console.log(this.taskInfo)

      })
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
</style>

