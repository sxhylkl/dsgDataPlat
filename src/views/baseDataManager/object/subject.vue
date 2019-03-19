<!--  -->
<template>
  <div>
    <theme-cont ref="theme" @addLink="addLink" @linkDetail="linkDetail"></theme-cont>
    <!--  添加关联 -->
    <subject-link ref="linkDialog" :config="dialog.linkConfig" @saveLink="saveLink"></subject-link>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
  </div>
</template>

<script>

import ThemeCont from './components/ThemeCont.vue'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
import SubjectLink from '@/components/LinkDialog/SubjectLink.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    SubjectLink,
    ReladionDialog,
    ThemeCont
  },
  props: ['nodeId'],
  data () {
    // 这里存放数据
    return {
      dialog: {
        linkVisible: false,
        title: '关联关系',
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
          type: 'SUBJECT',
          typeArr: ['depart', 'task']
        },
        realationVisible: false
      },
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 添加关联的
    addLink (obj) {
      this.dialog.linkConfig.selected = obj.row
      this.$refs.linkDialog.dialog.visible = true
    },
    // 查看关联信息
    linkDetail (obj) {
      console.log(obj)
      this.dialog.config.fromName = '主题名称'
      this.dialog.config.toName = obj.column.label.slice(0, 2) + '名称'
      if (obj.column.label === '任务数') {
        this.dialog.config.fromCol = 'from_name'
        this.dialog.config.toCol = 'to_name'
        this.dialog.config.toType = 'to_type'
      } else {
        this.dialog.config.fromCol = 'to_name'
        this.dialog.config.toCol = 'from_name'
        this.dialog.config.toType = 'from_type'
      }
      this.dialog.realationVisible = true;
      this.dialog.config.data = obj.row[obj.column.labelClassName]
    },
    // 保存关联
    saveLink () {
      console.log('刷新数据')
      this.$refs.theme.getList()
    },
    // 获取列表
    getList () {
      this.$refs.theme.getList()
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
