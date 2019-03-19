<!--  -->
<template>
  <div class>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据采集详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="back">返回数据采集列表</el-button>
      </div>
      <el-table
        :data="tData"
        v-loading="loading"
        border
        style="width: 100%"
        @cell-dblclick="editTableName"
      >
        <!-- prop="tableName" -->
        <el-table-column align="center" prop="tableName" label="表名">
          <template slot-scope="scope">
            <span v-if="scope.row.isEdit">
              <el-input autosize autofocus v-model="editData.alias"></el-input>
              <!--
                  @keyup.enter.native.prevent="saveEdit(scope.row)"
                @keyup.esc.native.prevent.stop="cancelEdit(scope.row)"
              -->
            </span>
            <span v-else>{{scope.row.alias?scope.row.alias:scope.row.tableName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="topicName" label="topic名称"></el-table-column>
        <el-table-column align="center" prop="description" label="描述"></el-table-column>
        <el-table-column align="center" prop="dailyVolume" label="采集量"></el-table-column>
        <el-table-column align="center" prop="ratePerMinute" label="平均速率/分钟"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 导入文件
import { getCollectList, updateTableName } from '@/api/dataExchange/index.js'
export default {
  components: {},
  data () {
    return {
      id: '',
      loading: false,
      timer: null,
      tLoading: false,
      tData: [],
      editState: false,
      row: {},
      editData: {
        alias: ''
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取列表
    getList () {
      const query = { topicId: this.id }
      getCollectList(query).then(res => {
        this.loading = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取数据失败')
          return;
        }
        if (this.editState) return
        this.tData = this.readTableData(res.data)
      })
    },
    // 编辑
    editTableName (row, column, cell) {
      if (column.property !== 'tableName') return
      if (this.editState) {
        this.$message.warning('请先保存当前编辑项');
        return;
      }
      this.editData = Object.assign({}, row)
      if (!this.editData.alias) this.editData.alias = this.editData.tableName
      this.row = row
      console.log(row)
      console.log(column)
      console.log(cell)

      this.editState = true
      this.clearTimer()
      row.isEdit = true
    },
    // 读取表格数据
    readTableData (data) {
      // 根据实际情况，自己改下啊
      data.map(item => {
        item.isEdit = false; // 给后台返回数据添加`isSet`标识
        return item;
      });
      return data
    },
    // 保存编辑
    saveEdit () {
      if (!this.editState) return
      if (!this.editData.alias) {
        this.$message.warning('表名不能为空')
        return
      }
      this.loading = true
      const obj = {
        tableName: this.row.tableName,
        alias: this.editData.alias
      }
      updateTableName(obj).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '保存失败')
          this.loading = false
          return;
        }
        this.$message.success('保存成功')
        this.editState = false
        this.editData = { tableName: '' }
        this.row = {}
        this.getList()
        this.pollList()
      }).catch(() => {
        this.loading = false
      })
    },
    // 取消编辑
    cancelEdit () {
      if (!this.editState) return
      this.row.isEdit = false;
      this.editState = false;
      this.editData = { tableName: '' }
      this.row = {}
      this.$message.info('取消编辑')
      this.pollList()
    },
    //  清除定时器
    clearTimer () {
      clearInterval(this.timer)
      this.timer = null;
    },
    // 循环调用接口
    pollList () {
      this.timer = setInterval(() => {
        this.getList()
      }, 60000)
    },
    // 返回
    back () {
      this.clearTimer()
      this.$router.go(-1)
    }
  },

  // 组件销毁之前
  beforeDestroy () {
    this.clearTimer()
  },
  created () {
    const _this = this;
    this.clearTimer()
    document.onkeydown = function () {
      const key = window.event.keyCode;
      if (key === 13) {
        _this.saveEdit()
      } else if (key === 27) {
        _this.cancelEdit()
      }
    }
    const id = this.$route.query.id
    // 刷新页面返回数据采集列表页
    if (!id) {
      this.$router.go(-1)
      return;
    }
    this.id = id;
    this.loading = true
    this.getList()
    this.pollList()
  }
}
</script>
<style lang='scss' scoped>
</style>
