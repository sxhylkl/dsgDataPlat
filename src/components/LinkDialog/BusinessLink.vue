<template>
  <div>
    <!-- 关联模板 -->
    <el-dialog title="关联" :visible.sync="dialog.visible" width="85%">
      <el-tabs v-model="activeName" v-if="dialog.visible">
        <el-tab-pane label="数据源" name="datasource" v-if="handleTab('datasource')">
          <data-source ref="linkDataSource" :btnState="btnState" :selectedData="config.selected.datasource"></data-source>
        </el-tab-pane>
        <el-tab-pane label="部门" name="depart">
          <depart ref="linkDepart" :btnState="btnState" :selectedData="config.selected.depart"></depart>
        </el-tab-pane>
        <el-tab-pane label="规则" name="rule" v-if="handleTab('rule')">
          <div style="text-aglin:center;">敬请期待....</div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.stop="saveLink">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
import { addRelation } from '@/api/curd/common.js'
import depart from '@/views/baseDataManager/object/depart/indexLink.vue'
import DataSource from '@/views/dataLake/dataSource/indexLink.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'BusinessLink',
  components: {
    depart,
    DataSource
  },
  props: ['config'],
  data() {
    // 这里存放数据
    return {
      dialog: {
        visible: false
      },
      btnState: true,
      activeName: 'datasource'
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    dialog: {
      handler(newValue) {
        if (newValue.visible) {
          this.$nextTick(() => {
            this.clearSelection()
          })
        }
      },
      deep: true
    }
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
    // 清空选中的数据
    clearSelection() {
      this.$refs.linkDataSource.$refs.multipleTable.clearSelection();
      this.$refs.linkDepart.$refs.depart.$refs.multipleTable.clearSelection();
      // this.$refs.linkDepart.multipleTable.clearSelection();
    },
    // 处理关联的数据
    handleLinkData(fromData, toData) {
      const result = []
      for (const o of toData) {
        for (const item of o.data) {
          let obj = null
          if (o.type === 'DEPARTMENT') {
            obj = {
              from_type: o.type,
              from_name: item.name,
              parent_id: item.id,
              relation_type: 'HAVE'
            }
            obj.to_id = fromData.data.id;
            obj.to_name = fromData.data.name;
            obj.to_type = fromData.type;
          } else {
            obj = {
              from_type: fromData.type,
              from_name: fromData.data.name,
              parent_id: fromData.data.id,
              relation_type: 'HAVE'
            }
            obj.to_id = item.id;
            obj.to_name = item.name;
            obj.to_type = o.type;
          }
          result.push(obj)
        }
      }
      return result;
    },
    // 保存关联模板
    saveLink() {
      // 组合数据
      const fromData = { type: 'BUSINESS', data: this.config.selected }
      const toData = [{ type: 'DEPARTMENT', data: this.$refs.linkDepart.multipleSelection },
      { type: 'DATASOURCE', data: this.$refs.linkDataSource.multipleSelection }]
      const obj = this.handleLinkData(fromData, toData)
      addRelation(obj).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
          return;
        }
        this.dialog.visible = false;
        this.$emit('saveLink')
        this.$message.success('保存成功')
      })
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
