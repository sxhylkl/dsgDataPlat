<!--  -->
<template>
  <div>
    <standard-cont
      ref="model"
      :btnState="btnState"
      :modelTreee="tree"
      :modelConfig="model"
      @postData="postData"
      :nodeId="nodeId"
      :selectedData="selectedData"
    ></standard-cont>
  </div>
</template>

<script>
import StandardCont from './components/StandardCont.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    StandardCont
  },
  props: ['nodeId', 'btnState', 'selectedData'],
  data () {
    // 这里存放数据
    return {
      multipleSelection: [], // 多选框所选集合
      tree: {
        params: {
          type: 'MODEL',
          name: '模型'
        }
      },
      model: {
        title: '模型',
        isStandard: false,
        isModel: true,
        type: 'model',
        linkType: 'MODEL',
        tableType: 1
      },
      dialog: {
        standard: false,
        field: false,
        title: '关系列表',
        realationVisible: false,
        config: {
          data: [],
          fromCol: 'to_name',
          fromName: '',
          toCol: 'from_name',
          toType: 'from_type',
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
          type: 'model',
          typeArr: ['subject', 'business', 'rule', 'standard', 'model']
        }
      }
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
      this.$refs.model.getList()
    },
    postData (data) {
      this.multipleSelection = data
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  }
}
</script>
<style lang='scss' scoped>
</style>
