<template>
  <div id="indexContainer">
    <div style="cursor: pointer;" @click="backFeedsList">
      <i class="el-icon-arrow-left"></i>
      返回流程管理
    </div>
    <el-table
      v-loading="loading"
      :data="tableList"
      :default-sort="{prop: 'date', order: 'descending'}"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item,index) in tableCloumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="true"
      ></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="bottom">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-zoom-in"
              plain
              @click="lookDetail(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10,20,50,100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
    <!-- 详情弹窗 -->
    <el-dialog
      :title="`流程配置文件：${dialogObj.title}`"
      :fullscreen="true"
      :visible.sync="dialogObj.isShow"
      @close="activeName = 'invalidTab'"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="有效" name="effectiveTab">
          <valid v-if="activeName === 'effectiveTab'" :params="validParams"></valid>
        </el-tab-pane>
        <el-tab-pane label="无效" name="invalidTab">
          <invalid v-if="activeName === 'invalidTab'" :params="validParams"></invalid>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDataQualityList, getDataQualityValid } from '@/api/dataLake/api'
import valid from './valid.vue'
import invalid from './invalid'
export default {
  name: "index",
  components: {
    valid,
    invalid
  },
  data () {
    return {
      activeName: 'effectiveTab',
      loading: false,
      tableList: [],
      allList: [], // 存放所有数据
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      query: '',
      tableCloumn: [
        {
          label: '记录数',
          prop: 'recordCount'
        },
        {
          label: '有效',
          prop: 'effectiveCount'
        },
        {
          label: '无效',
          prop: 'invalidCount'
        },
        {
          label: '修改时间',
          prop: 'time'
        }
      ],
      dialogObj: {
        title: '',
        isShow: false
      },
      validParams: {

      }
    }
  },
  computed: {
    feedId () {
      let tempId = ''
      this.$route.query.feedId 
      ? tempId = this.$route.query.feedId 
      : tempId = window.sessionStorage.getItem('qualityFeedId')
      return tempId
    },
    path () {
      let tempPath = ''
      this.$route.query.path
      ? tempPath = this.$route.query.path
      : tempPath = window.sessionStorage.getItem('qualityPath')
      return tempPath
    }
  },
  watch: {
    page: {
      handler (newVal, oldVal) {
        this.loading = true
        this.handletableData()
      },
      deep: true
    },
    query (val) {
      this.handletableData()
    }
  },
  mounted () {
    // 从面包屑进入的数据质量页面没有id和path，从流程管理跳转过来的时候，存入session
    if(this.path && this.feedId) {
      window.sessionStorage.setItem('qualityFeedId',this.feedId)
      window.sessionStorage.setItem('qualityPath',this.path)
    }
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      getDataQualityList(this.feedId).then(res => {
        const { pageSize } = this.page
        if (res.length) {
          this.allList = res.map(item => ({
            feedId: this.feedId,
            recordCount: item.TOTAL_COUNT,
            effectiveCount: item.VALID_COUNT,
            invalidCount: item.INVALID_COUNT,
            processing_dttm: item.jobid,
            time: this.dateTime(item.jobid)
          }))
          this.page.total = this.allList.length
          this.tableList = this.allList.slice(0, pageSize)
        }
        this.loading = false
      })
    },
    /**
     * @description 查看详情
     * @param row { obj } 当前行数据
     */
    lookDetail (row) {
      this.activeName = 'effectiveTab'
      this.dialogObj.isShow = true
      this.dialogObj.title = this.feedId
      this.validParams = {
        feedId: this.feedId,
        limit: 100,
        processing_dttm: row.processing_dttm
      }
    },
    handleClick (val) {
      console.log(this.activeName)
    },
    /**
     * @description 处理分页数据
     */
    handletableData () {
      const { pageSize, currentPage } = this.page
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = currentPage * pageSize
      this.loading = false
      this.tableList = this.allList.slice(startIndex, endIndex)
    },
    /**
     * @description pageSize改变
     */
    handleSizeChange (val) {
      this.page.pageSize = val
    },
    /**
     * @description 页数改变
     */
    handleCurrentChange (val) {
      this.page.currentPage = val
    },
    /**
     * @description 处理时间戳变为 2019-01-03 16时
     * @param time { number } 时间戳
     */
    dateTime(time) {
      const date = new Date(parseInt(time))
      const year = date.getFullYear()
      const month = `${date.getMonth()+1}`.padStart(2,'0')
      const day = `${date.getDate()}`.padStart(2,'0')
      const hour = `${date.getHours()}`.padStart(2,'0')
      const min = `${date.getMinutes()}`.padStart(2,'0')
      const second = `${date.getSeconds()}`.padStart(2,'0')
      return `${year}-${month}-${day} ${hour}:${min}:${second}`
    },
    backFeedsList () {
      console.log('返回')
      this.$router.push({ path: this.path })
    }
  }
}
</script>

<style lang='scss' scoped>
#indexContainer {
  .query-box {
    position: relative;
    display: flex;
    justify-content: space-around;
  }
}
</style>
<style>
#indexContainer .el-dialog__body {
  height: calc(100% - 54px);
  position: relative;
  overflow-y: auto;
}
</style>