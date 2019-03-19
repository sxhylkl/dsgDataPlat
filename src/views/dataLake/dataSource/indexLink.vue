<!--  -->
<template>
  <div>
    <datasource-cont
      ref="datasource"
      :btnState="btnState"
      :selectedData="selectedData"
      @postData="postData"
    ></datasource-cont>
  </div>
</template>

<script>

import DatasourceCont from './components/DatasourceCont'
export default {
  // import引入的组件需要注入到对象中才能使用
  props: ['btnState', 'selectedData'],
  components: {
    DatasourceCont
  },
  data () {
    // 这里存放数据
    return {
      multipleSelection: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 获取列表
    getList () {
      this.$refs.datasource.getList()
    },
    // 获取选中的数据
    postData (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
