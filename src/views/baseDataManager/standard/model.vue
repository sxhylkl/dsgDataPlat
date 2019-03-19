<!--  -->
<template>
  <div>
    <standard-cont
      ref="standard"
      :modelTreee="tree"
      :modelConfig="model"
      @postData="postData"
      :nodeId="nodeId"
      @addLink="addLink"
      @linkDetail="LinkDetail"
    ></standard-cont>
    <!--  添加关联 -->
    <standard-link ref="linkDialog" :config="dialog.linkConfig" @saveLink="saveLink"></standard-link>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
  </div>
</template>

<script>

import StandardCont from './components/StandardCont.vue'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
import StandardLink from '@/components/LinkDialog/StandardLink.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  props: ['nodeId'],
  components: {
    StandardLink,
    ReladionDialog,
    StandardCont
  },
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
          type: 'STANDARD',
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
    addLink (obj) {
      this.dialog.linkConfig.selected = obj.row
      this.$refs.linkDialog.dialog.visible = true
    },
    // 查看关联信息
    LinkDetail (obj) {
      this.dialog.config.fromName = obj.row.type === 0 ? '标准名称' : '模型名称'
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
      this.dialog.config.data = obj.row[obj.column.labelClassName]
      this.dialog.config.linkName = obj.column.labelClassName
      this.dialog.config.fromeValue = obj.row.name
      this.dialog.realationVisible = true;
    },
    // 保存关联
    saveLink () {
      this.$refs.standard.getList()
    },
    // 获取列表
    getList () {
      this.$refs.standard.getList()
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
