<!--  -->
<template>
  <div>
    <business-cont
      ref="business"
      :btnState="btnState"
      :selectedData="selectedData"
      @postData="postData"
    ></business-cont>
  </div>
</template>

<script>

import BusinessCont from './components/BusinessCont.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  props: ['btnState', 'selectedData'],
  components: {
    BusinessCont
  },
  data () {
    // 这里存放数据
    return {
      dialog: {
        title: '关系列表',
        realationVisible: false,
        config: {
          data: [],
          fromCol: 'from_name',
          fromName: '',
          toCol: 'to_name',
          toName: ''
        },
        linkConfig: {
          selected: {
            depart: [],
            task: [],
            subject: [],
            business: [],
            standard: [],
            model: [],
            rule: [],
            datasource: []
          },
          type: 'business',
          typeArr: ['subject', 'business', 'rule', 'standard', 'model']
        }
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
    // 获取列表
    getList () {
      this.$refs.business.getList()
    },
    //获取选中的数据
    postData (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
