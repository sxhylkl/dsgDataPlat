<!--  -->
<template>
  <div class="task-cont">
     <feed-list ref="feed" :taskInfo="taskInfo"></feed-list>
    <el-tabs tab-position="right" v-if="false">
     <!--  <el-tab-pane label="任务信息">
        <task-form :taskCont="taskInfo" :isDetail="true" title="任务详情"></task-form>
      </el-tab-pane> -->
      <el-tab-pane label="无版本">
        <feed-list ref="feed" :taskInfo="taskInfo"></feed-list>
      </el-tab-pane>
      <el-tab-pane label="流程列表(有版本)" v-if="false">
        <feed-list-version ref='feedVersion'></feed-list-version>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 例如：import 《组件名称》 from '《组件路径》';
import FeedList from './FeedList'
import FeedListVersion from './FeedListVersion'
// import TaskForm from './TaskForm'
export default {
  // import引入的组件需要注入到对象中才能使用/
  components: {
    FeedList,
    // TaskForm,
    FeedListVersion
  },
  props: ['taskInfo'],
  data() {
    // 这里存放数据
    return {
      filter: '',
      feedList: [],
      taskId: '',
      feedLoading: false
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    filter(val) {
      console.log(val)
    }
  },
  // 方法集合
  methods: {
    getCont(id) {
      this.$refs.feed.getFeedList(id)
      // this.$refs.feedVersion.getList(id)
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>