<!--  -->
<template>
  <div>
    <depart-cont ref="depart" @addLink="addLink" @linkDetail="LinkDetail"></depart-cont>
    <!--  添加关联 -->
    <depart-link ref="linkDialog" :config="dialog.linkConfig" @saveLink="saveLink"></depart-link>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
  </div>
</template>

<script>

import DepartCont from './components/DepartCont.vue'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
import DepartLink from '@/components/LinkDialog/DepartLink.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  props: ['btnState', 'selectedData'],
  components: {
    DepartCont,
    ReladionDialog,
    DepartLink
  },
  data() {
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
          type: 'depart',
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
    // 添加关联的
    addLink(obj) {
      this.dialog.linkConfig.selected = obj.row
      this.$refs.linkDialog.dialog.visible = true
    },
    // 查看关联信息
    LinkDetail(obj) {
      this.dialog.config.fromName = '部门名称'
      this.dialog.config.toName = obj.column.label.slice(0, 2) + '名称'
      this.dialog.config.data = obj.row[obj.column.labelClassName]
      this.dialog.realationVisible = true;
    },
    // 保存关联
    saveLink() {
      console.log('刷新数据')
      this.$refs.depart.getList()
    },
    // 获取列表
    getList() {
      this.$refs.depart.getList()
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