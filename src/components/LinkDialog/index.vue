<template>
  <div>
    <!-- 关联模板 -->
    <el-dialog title="关联" :visible.sync="dialog.visible" width="85%">
      <el-tabs v-if="dialog.visible">
        <el-tab-pane label="数据源" name="datasource" v-if="handleTab('datasource')">
          <data-source ref="linkDataSource" :btnState="btnState"></data-source>
        </el-tab-pane>
        <el-tab-pane label="部门" name="depart" v-if="false">
        </el-tab-pane>
        <el-tab-pane label="主题" name="subject" v-if="handleTab('subject')">
          <subject ref="linkSubject" :btnState="btnState"></subject>
        </el-tab-pane>
        <el-tab-pane label="业务" name="business" v-if="handleTab('business')">
          <dataRun ref="linkBusiness"></dataRun>
        </el-tab-pane>
        <el-tab-pane label="标准" name="standard" v-if="handleTab('standard')">
          <div style="text-aglin:center;">敬请期待....</div>
        </el-tab-pane>
        <el-tab-pane label="模型" name="model" v-if="handleTab('model')">
          <div style="text-aglin:center;">敬请期待....</div>
        </el-tab-pane>
        <el-tab-pane label="任务" name="task" v-if="handleTab('task')">
          <div style="text-aglin:center;">敬请期待....</div>
        </el-tab-pane>
        <el-tab-pane label="规则" name="rule" v-if="handleTab('rule')">
          <div style="text-aglin:center;">敬请期待....</div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveLink">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
import { addRelation } from '@/api/curd/common.js'
import DataSource from '@/views/dataLake/dataSource/index.vue'
// import Depart from '@/views/baseDataManager/object/depart/index.vue'
import dataRun from '@/views/baseDataManager/object/dataRun.vue'
import subject from '@/views/baseDataManager/object/subject.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'LinkDialog',
  components: {
    DataSource,
    // Depart,
    dataRun,
    subject
  },
  props: ['config'],
  data() {
    // 这里存放数据
    return {
      dialog: {
        visible: false
      },
      activeName: '',
      btnState: true
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  mounted() {
    this.activeName = this.config.typeArr[0]
  },
  // 方法集合
  methods: {
    // 判断是否显示标签页
    handleTab(val) {
      if (this.config.typeArr.includes(val)) {
        return true
      } else {
        return false
      }
    },
    // 处理关联的数据
    handleLinkData(data) {
      const result = []
      const obj = {
        from_type: 'BUINESS',
        from_name: this.task.curr.name,
        parent_id: this.task.curr.id,
        relation_type: 'HAVE'
      }
      console.log(data)
      for (const o of data) {
        console.log(o.selected)
        for (const item of o.selected) {
          obj.to_id = item.id;
          obj.to_name = item.name;
          obj.to_type = o.type;
          result.push(obj)
        }
      }
      return result;
    },
    // 保存关联模板
    saveLink() {
      // 组合数据
      const data = [{ type: 'DEPARTMENT', selected: this.$refs.linkDepart.multipleSelection }, { type: 'DATASOURCE', selected: this.$refs.linkDataSource.multipleSelection }]
      const obj = this.handleLinkData(data)
      console.log(obj)
      addRelation(obj).then(res => {
        if (res.code !== 0) {
          this.$message.error('保存失败')
          return;
        }
        this.dialog.linkVisible = false;
        this.getList()
        this.$message.success('保存成功')
      })
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
