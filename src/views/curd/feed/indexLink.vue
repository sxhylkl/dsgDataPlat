<!--  -->
<template>
  <div class="list-box">
    <el-row>
      <my-tree ref="tree" :params="treeParams" @nodeClick="treeNodeClick" :btnState="btnState"></my-tree>
      <el-col :span="18">
        <default-cont
          ref="top"
          v-if="states.defaultContState"
          :selectedData="selectedData"
          @selectionChange="selectionChange"
          :btnState="btnState"
        ></default-cont>
        <task-list
          ref="task"
          v-show="states.taskListState"
          :list="task.list"
          :selectedData="selectedData"
          @addTask="addTask"
          @getTopClik="getTopClik"
          @selectionChange="selectionChange"
        ></task-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 导入方法
// 导入组件
import myTree from '@/components/Tree/index'
import DefaultCont from './components/DefaultCont'
import TaskList from './components/TaskListLink.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    myTree,
    DefaultCont,
    TaskList
  },
  props: ['btnState', 'selectedData'],
  data() {
    // 这里存放数据
    return {
      treeParams: {
        type: 'TASK',
        name: '任务'
      },
      tree: {
        nodeId: ''
      },
      task: {
        list: []
      },
      taskForm: {
        description: '',
        name: '',
        referId: '',
        parent_id: ''
      },
      isDetail: false,
      states: {
        defaultContState: true,
        taskListState: false,
        taskFormState: false,
        feedInfo: false
      },
      multipleSelection: [],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    treeNodeClick(data) {
      console.log(data);
      this.tree.nodeId = data.id
      this.states = { taskListState: true, defaultContState: false, taskFormState: false }
      this.$refs.task.getTaskList(data.id)
    },
    selectionChange(val) {
      this.multipleSelection = val
    },
    // 子组件的事件
    addTask(data) {
      console.log(data)
      if (data.isEdit) {
        this.isDetail = false
        this.taskForm = data.data
      }
      this.states = { taskListState: false, defaultContState: false, taskFormState: true }
    },
    // 获取最近10条
    getTopClik() {
      this.states = { taskListState: false, defaultContState: true, taskFormState: false }
      if (this.tree.nodeId) {
        this.$refs.tree.cancelCheck();
        this.tree.nodeId = ''
      }
    },
    /**
     * @description: 保存任务
     * @param { }
     * @return: ture-更新数据/false--不更新数据
     */
    saveTask(data) {
      if (data) {
        this.$refs.task.getTaskList(this.tree.nodeId)
      }
      this.states = { taskListState: true, defaultContState: false, taskFormState: false }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.defaultContState = true;
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>