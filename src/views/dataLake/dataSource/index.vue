<!--  -->
<template>
  <div class>
    <datasource-cont ref="datasource" @addLink="addLink" @linkDetail="linkDetail"></datasource-cont>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
    <!--  添加关联 -->
    <datasource-link ref="linkDialog" :config="dialog.linkConfig" @saveLink="getList"></datasource-link>
  </div>
</template>

<script>
// 导入文件
import DatasourceCont from './components/DatasourceCont'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
import DatasourceLink from '@/components/LinkDialog/DatasourceLink.vue'
export default {
  components: {
    ReladionDialog,
    DatasourceLink,
    DatasourceCont
  },
  data () {
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
          type: 'subject',
          typeArr: ['depart', 'task']
        }
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    getList () {
      this.$refs.datasource.getList()
    },
    // 添加关联的
    addLink (obj) {
      this.dialog.linkConfig.selected = obj.row
      this.$refs.linkDialog.dialog.visible = true
    },
    // 查看关联信息
    linkDetail (obj) {
      this.dialog.config.fromName = '部门名称'
      this.dialog.config.toName = obj.column.label.slice(0, 2) + '名称'
      this.dialog.realationVisible = true;
      this.dialog.config.data = obj.row[obj.column.labelClassName]
    },
    // 保存关联
    saveLink () {
      this.$refs.datasource.getList()
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped>
</style>
