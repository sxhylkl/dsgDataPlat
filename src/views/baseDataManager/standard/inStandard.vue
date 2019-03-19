<template>
  <el-row :gutter="20">
    <my-tree ref="tree" :params="params" @nodeClick="nodeClick"></my-tree>
    <my-list
      ref="myList"
      :chooseNode="chooseNode"
      @link="link"
      :btnState="btnState"
      @topClick="topClick"
      @selectedTable="selectedTable"
    ></my-list>
    <el-dialog :visible.sync="dialogVisible" title="关联" width="65%" append-to-body>
      <my-tab ref="tableLink"></my-tab>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import myTree from '@/components/Tree/index'
import myList from '@/components/Tree/itemList'
import myTab from '@/components/Tree/table'
import { getTop } from '@/api/stander/index.js'
export default {
  name: 'inStandard',
  props: ['btnState'],
  components: {
    myTree,
    myList,
    myTab
  },
  data() {
    return {
      dialogVisible: false,
      params: {
        type: 'INDUSTRIAL',
        name: '行业标准'
      },
      chooseNode: null,
      seletedRow: [],
      seleted: [] // 选中的行业标准
    }
  },
  methods: {
    selectedTable(val) {
      // this.seleted = val
      console.log(val)
    },
    save() {
      console.log('--------------------')
      console.log(this.$refs.tableLink.selected)
      if (this.$refs.tableLink.selected.length > 1) {
        this.$message.warning('该数据不能多选')
        return
      }
      this.seleted = this.$refs.tableLink.selected
      this.dialogVisible = false
    },
    /**
     * 树点击事件
     */
    nodeClick(data) {
      console.log('-3234234')
      console.log(data)
      this.$refs.myList.updateNodeTabVisible = false
      if (data === 1) return;
      this.chooseNode = data
      console.log('-908888')
      console.log( this.chooseNode)
      // this.$refs.myList.getList()
    },
    // 最新10条点击事件
    topClick() {
      if (this.chooseNode && this.chooseNode.id) {
        this.chooseNode = null
      }
      this.$refs.tree.cancelCheck()
    },
    /**
     * 关联点击事件
     */
    link(row) {
      /*  if (!row.type) {
         this.$message.warning('数据格式错误,请检查')
         return
       } */
      this.dialogVisible = true
      console.log(row)
      const obj = Object.assign({}, row)
      obj.format = JSON.parse(obj.format)
      this.$nextTick(() => {
        this.$refs.tableLink.getStandarBaseColumnList({ url: obj.format.url, id: obj.id })
      })

      this.seletedRow = row
    }
  }
}
</script>
