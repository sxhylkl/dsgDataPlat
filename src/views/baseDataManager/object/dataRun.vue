<!--  -->
<template>
  <div>
    <!-- 内容 -->
    <business-cont ref="business" @addLink="addLink" @linkDetail="linkDetail"></business-cont>
    <!--  添加关联 -->
    <business-link ref="linkDialog" :config="dialog.linkConfig" @saveLink="saveLink"></business-link>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
  </div>
</template>

<script>

import BusinessCont from './components/BusinessCont.vue'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
import BusinessLink from '@/components/LinkDialog/BusinessLink.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    BusinessCont,
    ReladionDialog,
    BusinessLink
  },
  data () {
    // 这里存放数据
    return {
      dialog: {
        linkVisible: false,
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
          typeArr: ['datasource', 'depart', 'rule',]
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
    addLink (obj) {
      this.dialog.linkConfig.selected = obj.row
      this.$refs.linkDialog.dialog.visible = true
    },
    // 查看关联信息
    linkDetail (obj) {
      if (!obj.column.labelClassName) return;
      this.dialog.config.fromName = '业务名称'
      this.dialog.config.toName = obj.column.label.slice(0, obj.column.label.length - 1) + '名称'
      if (obj.column.label === '部门数') {
        this.dialog.config.fromCol = 'to_name'
        this.dialog.config.toCol = 'from_name'
        this.dialog.config.toType = 'from_type'
      } else {
        this.dialog.config.fromCol = 'from_name'
        this.dialog.config.toCol = 'to_name'
        this.dialog.config.toType = 'to_type'
      }
      this.dialog.realationVisible = true;
      this.dialog.config.data = obj.row[obj.column.labelClassName]
    },
    // 保存关联
    saveLink () {
      this.$refs.business.getList()
    },
    // 获取列表
    getList () {
      this.$refs.business.getList()
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
