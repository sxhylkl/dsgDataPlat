<!--  -->
<template>
  <div class="list-box">
    <el-row>
      <my-tree ref="tree" :params="treeParams" @nodeClick="treeNodeClick"></my-tree>
      <el-col :span="18">
        <default-cont v-if="states.defaultContState" @selectionChange="selectionChange"></default-cont>
        <task-list
          ref="task"
          v-show="states.taskListState"
          :list="task.list"
          @addTask="addTask"
          @selectionChange="selectionChange"
          @getTopClik="getTopClik"
          @refresh="refresh"
        ></task-list>
        <task-form
          v-show="states.taskFormState"
          :isDetail="isDetail"
          :nodeId="tree.nodeId"
          :taskCont="taskForm"
          @saveTask="saveTask"
          title="新建任务"
        ></task-form>
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
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    myTree,
    DefaultCont,
    TaskList,
    TaskForm
  },
  data () {
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
      multipleSelection: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    treeNodeClick (data) {
      if (data === 1) {
        if (this.tree.nodeId) {
          this.states.taskListState = true
          this.states.defaultContState = false
        } else {
          this.states.taskListState = false
          this.states.defaultContState = true
        }
        this.states.taskFormState = false
        this.states.feedInfo = false
        return;
      }
       this.tree.nodeId = data ? data.id:''
      if (!data){
        this.states.taskListState = false
        this.states.defaultContState = true
        this.states.taskFormState = false
        this.states.feedInfo = false
        return;
      }
      this.states.taskListState = true
      this.states.defaultContState = false
      this.states.taskFormState = false
      this.$refs.task.getTaskList(data.id)
    },
    selectionChange (val) {
      this.multipleSelection = val
    },
    // 子组件的事件
    addTask (data) {
      this.states.taskListState = false
      this.states.defaultContState = false
      this.states.taskFormState = true
      if (data.isEdit) {
        this.isDetail = false
        this.taskForm = data.data
      } else {
        this.taskForm = {
          description: '',
          name: '',
          referId: '',
          parent_id: ''
        }
      }
    },
    // 获取最近10条
    getTopClik () {
      this.states.taskListState = false
      this.states.defaultContState = true
      this.states.taskFormState = false
      if (this.tree.nodeId) {
        this.tree.nodeId = ''
      }
      this.$refs.tree.cancelCheck();
    },
    refresh () {
      this.getList()
    },
    getList () {
      if (!this.tree.nodeId) {
        this.getTopClik();
      } else {
        this.states.taskListState = true
        this.states.defaultContState = false
        this.states.taskFormState = false
        this.$refs.task.getTaskList(this.tree.nodeId)
      }
    },
    /**
     * @description: 保存任务
     * @param { }
     * @return: ture-更新数据/false--不更新数据
     */
    saveTask (data) {
      if (data) {
        this.$refs.task.getTaskList(this.tree.nodeId)
      }
      this.states.taskListState = true
      this.states.defaultContState = false
      this.states.taskFormState = false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    const nodeId = this.$route.query.nodeId
    if (nodeId) {
      this.states.defaultContState = false;
      this.states.taskListState = true
      this.$nextTick(() => {
        this.$refs.task.getTaskList(nodeId)
      })
    } else {
      this.states.defaultContState = true;
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
