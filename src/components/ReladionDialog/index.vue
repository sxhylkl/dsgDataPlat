
<template>
  <div>
    <!-- 关联关系弹窗 -->
    <el-table :data="config.data" v-loading="loading" v-if="config.linkName !== 'flows'">
      <el-table-column :prop="config.fromCol" :label="config.fromName"></el-table-column>
      <el-table-column :prop="config.toCol" :label="config.toName"></el-table-column>
      <el-table-column prop="creat_time" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.creat_time | formatLongTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="detailRelation(scope.row)" type="primary" size="mini" plain>查看</el-button>
          <el-button @click="delRelation(scope.$index,scope.row)" type="danger" size="mini" plain>解除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  查看关联的流程 -->
    <el-table :data="config.data" v-loading="loading" v-if="config.linkName === 'flows'">
      <el-table-column :label="config.fromName">
        <template slot-scope="scope">
          <span>{{config.fromeValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称">
        <template slot-scope="scope">
          <span>{{scope.row.feedName}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { delRelation, getDetail } from '@/api/curd/common.js'
export default {
  name: 'scrollBar',
  props: ['config'],
  inject: ['reload'],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    // 解除关系
    delRelation (index, row) {
      console.log(row)
      console.log(index)
      const msg = '此操作将永久解除关联关系, 是否继续？'
      this.openConfirm(msg, () => {
        this.loading = true
        delRelation(row.id).then(res => {
          this.loading = false
          if (res.code !== 0) {
            this.$message.error('失败')
            return;
          }
          const data = this.config.data
          data.splice(index, 1)
          this.$message.success('成功')
        })
      })
    },
    // 查看关系详情
    detailRelation (row) {
      console.log('查看详情的参数')
      console.log(this.config)
      console.log(row)
      const name = this.config.toName.slice(0, -2)
      const idCol = this.handleId(this.config.toCol)
      console.log(idCol)
      let obj = {}
      switch (name) {
        case '主题':
          obj = { url: 'Subject', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/templateManage/object', query: { type: 'SUBJECT', nodeId } })
            this.reload()
          })
          break;
        case '业务':
          obj = { url: 'Business', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/templateManage/object', query: { type: 'BUSINESS', nodeId } })
            this.reload()
          })
          break;
        case '部门':
          obj = { url: 'Department', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/templateManage/object', query: { type: 'DEPARTMENT', nodeId } })
            this.reload()
          })
          break;
        case '标准':
          obj = { url: 'StandardTable', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/templateManage/standard', query: { type: 'STANDARD', nodeId } })
            this.reload()
          })
          break;
        case '模型':
          obj = { url: 'StandardTable', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/templateManage/standard', query: { type: 'MODEL', nodeId } })
            this.reload()
          })
          break;
        case '任务':
          obj = { url: 'DsgTask', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/flowManage/feedsList', query: { nodeId } })
            this.reload()
          })
          break;
        case '数据源':
          obj = { url: 'DsgDatasource', id: row[idCol] }
          this.getDetailData(obj, nodeId => {
            this.$router.push({ path: '/templateManage/dataSource', query: { nodeId } })
            this.reload()
          })
          break;
        default:
      }
    },
    // 获取详细
    getDetailData (obj, callback) {
      getDetail(obj).then(res => {
        if (res.code !== 0) {
          this.$message.warning('查看详情错误')
          return
        }
        callback(res.data.parent_id);
      })
    },
    // 获取id
    handleId (name) {
      if (name.indexOf('from') !== -1) {
        return 'parent_id'
      } else {
        return 'to_id'
      }
    },
    // 确认框
    openConfirm (msg, callback) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

