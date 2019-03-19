<template>
  <section id="timeToString">
    <el-row :gutter="20" v-show="!details" style="margin:0">
      <el-row>
        <el-col :span="18">
          <el-form> 
            <el-form-item label="作业监控管理" label-width="200px">
              <el-input placeholder="请输入查询条件" v-model="query"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-col :span="24" style="padding: 0">
        <el-tabs v-model="activeName" style="margin-bottom: 15px;">
          <el-tab-pane label="所有" name></el-tab-pane>
          <el-tab-pane label="正在运行" name="running"></el-tab-pane>
          <el-tab-pane label="失败" name="failed"></el-tab-pane>
          <el-tab-pane label="已完成" name="completed"></el-tab-pane>
          <el-tab-pane label="丢弃" name="abandoned"></el-tab-pane>
        </el-tabs>
        <el-table
          :data="ServiceData"
          row-key="instanceId"
          style="width: 100%"
          v-loading="loadding"
          @row-click="rowClick"
        >
          <el-table-column prop="jobName" label="作业名称" sortable width="180"></el-table-column>
          <el-table-column label="状态" sortable prop="displayStatus" width="180">
            <template slot-scope="scope">
              <div
                v-if="scope.row.displayStatus==='COMPLETED'"
                style="color: #28b758;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/succes.png"
                  style=" float: left;margin-top: 3px;margin-right: 5px;"
                  alt
                >
                <div style="float: left;">已完成</div>
              </div>
              <div
                v-if="scope.row.displayStatus==='STARTED'"
                style="color: #28b758;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/running.png"
                  style=" float: left;margin-top: 3px;margin-right: 5px;"
                  alt
                >
                <div style="float: left;">正在运行</div>
              </div>
              <div
                v-if="scope.row.displayStatus==='FAILED'"
                style="color: #d81e06;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/fail.png"
                  style=" float: left;margin-top: 3px;margin-right: 5px;"
                  alt
                >
                <div style="float: left;">失败</div>
              </div>
              <div
                v-if="scope.row.displayStatus==='ABANDONED'"
                style="color: #d81e06;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/trash.png"
                  style=" float: left;margin-top: 3px;margin-right: 5px;"
                  alt
                >
                <div style="float: left;">丢弃</div>
              </div>
              <div
                v-if="scope.row.displayStatus==='STOPPED'"
                style="color: #d81e06;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/trash.png"
                  style=" float: left;margin-top: 3px;margin-right: 5px;"
                  alt
                >
                <div style="float: left;">已停止</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="流程" prop="feedName" width="180"></el-table-column>
          <el-table-column label="开始时间">
            <template slot-scope="scope">
              <span>{{(new Date(scope.row.startTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="运行时间">
            <template slot-scope="scope">
              <span>{{scope.row.runTime|filter1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status==='COMPLETED'">
                <div style="float: left;">已完成</div>
              </div>
              <div v-if="scope.row.status==='STARTED'">
                <div style="float: left;">正在运行</div>
              </div>
              <div v-if="scope.row.status==='FAILED'">
                <div style="float: left;">失败</div>
              </div>
              <div v-if="scope.row.status==='ABANDONED'">
                <div style="float: left;">丢弃</div>
              </div>
              <div v-if="scope.row.status==='STOPPED'">
                <div style="float: left;">已停止</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="动作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status==='FAILED'" @click.stop="toAbon(scope.$index)">丢弃</el-button>

              <el-button v-if="scope.row.status!=='FAILED'" @click.stop="toFail(scope.$index)">失败</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block" style="float:right;margin-top: 12px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-row v-show="details" :gutter="20">
      <el-col :span="17" style="padding: 0">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>作业执行情况</span>
            <el-button
              style="float: right; padding:2px 7px"
              type="success"
              @click="details = false"
            >返回列表</el-button>
          </div>
          <div>
            <el-row style="display: flex">
              <div class="flex">
                <span class="overhide">{{detailsData.jobName}}</span>
                <!-- <span  class='help-block'><img src="@/static/dataCenter/images/running.png" >已启动</span>-->
                <span
                  class="help-block"
                  v-if="detailsData.displayStatus==='COMPLETED'"
                  style="color: #28b758;font-weight:bold;"
                >
                  <img
                    src="@/static/dataCenter/images/succes.png"
                    style=" float: left;margin-right: 5px;"
                    alt
                  >
                  <span style="float: left;">已完成</span>
                </span>
                <span
                  class="help-block"
                  v-if="detailsData.displayStatus==='STARTED'"
                  style="color: #28b758;font-weight:bold;"
                >
                  <img
                    src="@/static/dataCenter/images/running.png"
                    style=" float: left;margin-right: 5px;"
                    alt
                  >
                  <span style="float: left;">正在运行</span>
                </span>
                <span
                  class="help-block"
                  v-if="detailsData.displayStatus==='FAILED'"
                  style="color: #d81e06;font-weight:bold;"
                >
                  <img
                    src="@/static/dataCenter/images/fail.png"
                    style=" float: left;margin-right: 5px;"
                    alt
                  >
                  <span style="float: left;">失败</span>
                </span>
                <span
                  class="help-block"
                  v-if="detailsData.displayStatus==='ABANDONED'"
                  style="color: #d81e06;font-weight:bold;"
                >
                  <img
                    src="@/static/dataCenter/images/trash.png"
                    style=" float: left;margin-right: 5px;"
                    alt
                  >
                  <span style="float: left;">丢弃</span>
                </span>
                <span
                  class="help-block"
                  v-if="detailsData.displayStatus==='STOPPED'"
                  style="color: #d81e06;font-weight:bold;"
                >
                  <img
                    src="@/static/dataCenter/images/trash.png"
                    style=" float: left;margin-right: 5px;"
                    alt
                  >
                  <span style="float: left;">已停止</span>
                </span>
              </div>
              <div class="flex">
                <span>{{(new Date(detailsData.startTime)).toLocaleString()}}</span>
                <span class="help-block">开始时间</span>
              </div>
              <div class="flex">
                <span>{{detailsData.runTime|filter1}}</span>
                <span class="help-block">运行时间</span>
              </div>
            </el-row>
            <el-row style="display: flex;padding-top: 20px;padding-bottom: 20px">
              <div class="flex" style="width: 100%;">
                <span>退出说明</span>
                <span class="help-block_">{{detailsData.exitStatus|filter2}}</span>
              </div>
            </el-row>

            <el-tabs v-model="activeName2" style="margin-bottom: 0px;">
              <el-tab-pane label="作业详情" name="De_job">
                <el-button-group class="btnGroup1">
                  <el-button
                    size="large"
                    :autofocus="true"
                    @click="jobParams"
                    :style="btn1"
                  >&nbsp&nbsp&nbsp&nbsp作业参数&nbsp&nbsp&nbsp&nbsp</el-button>
                  <el-button
                    size="large"
                    @click="jobData"
                    :style="btn2"
                  >&nbsp&nbsp&nbsp&nbsp执行前后数据&nbsp&nbsp&nbsp&nbsp</el-button>
                </el-button-group>

                <el-table :data="detailsData.jobParameters|filter3" v-show="jobParamsShow">
                  <el-table-column label="参数" prop="key"></el-table-column>
                  <el-table-column label="值" prop="value"></el-table-column>
                </el-table>

                <el-table :data="detailsData.executionContext|filter3" v-show="!jobParamsShow">
                  <el-table-column label="前后参数" prop="key"></el-table-column>
                  <el-table-column label="值" prop="value"></el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="步骤详情" name="De_step">
                <el-table :data="detailsData.executedSteps">
                  <el-table-column label="步骤名称">
                    <template slot-scope="scope">
                      <span>Step {{scope.$index +1}} - {{scope.row.stepName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="开始时间">
                    <template slot-scope="scope">
                      <span>{{(new Date(scope.row.startTime)).toLocaleString()}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="运行时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.runTime|filter1}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>作业详情</span>
          </div>
          <el-button
            v-if="detailsData.status==='FAILED'"
            @click="toAbon2(detailsData.instanceId)"
          >丢弃</el-button>
          <el-button
            v-if="detailsData.status!=='FAILED'"
            @click="toFail2(detailsData.instanceId)"
          >失败</el-button>
          <el-row>
            <div class="flex maxw100 boderB" style="padding-top: 20px">
              <span class="overhide">{{detailsData.jobName}}</span>
              <!-- <span  class='help-block'><img src="@/static/dataCenter/images/running.png" >已启动</span>-->
              <span
                class="help-block"
                v-if="detailsData.displayStatus==='COMPLETED'"
                style="color: #28b758;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/succes.png"
                  style=" float: left;margin-right: 5px;"
                  alt
                >
                <span style="float: left;">已完成</span>
              </span>
              <span
                class="help-block"
                v-if="detailsData.displayStatus==='STARTED'"
                style="color: #28b758;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/running.png"
                  style=" float: left;margin-right: 5px;"
                  alt
                >
                <span style="float: left;">正在运行</span>
              </span>
              <span
                class="help-block"
                v-if="detailsData.displayStatus==='FAILED'"
                style="color: #d81e06;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/fail.png"
                  style=" float: left;margin-right: 5px;"
                  alt
                >
                <span style="float: left;">失败</span>
              </span>
              <span
                class="help-block"
                v-if="detailsData.displayStatus==='ABANDONED'"
                style="color: #d81e06;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/trash.png"
                  style=" float: left;margin-right: 5px;"
                  alt
                >
                <span style="float: left;">丢弃</span>
              </span>
              <span
                class="help-block"
                v-if="detailsData.displayStatus==='STOPPED'"
                style="color: #d81e06;font-weight:bold;"
              >
                <img
                  src="@/static/dataCenter/images/trash.png"
                  style=" float: left;margin-right: 5px;"
                  alt
                >
                <span style="float: left;">已停止</span>
              </span>
            </div>
          </el-row>

          <div class="flex maxw100 boderB">
            <span>{{detailsData.jobType}}</span>
            <span class="help-block">作业类型</span>
          </div>

          <div class="flex maxw100 boderB">
            <span>{{(new Date(detailsData.startTime)).toLocaleString()}}</span>
            <span class="help-block">开始时间</span>
          </div>

          <div class="flex maxw100 boderB">
            <span>{{(new Date(detailsData.endTime)).toLocaleString()}}</span>
            <span class="help-block">结束时间</span>
          </div>

          <div class="flex maxw100 boderB">
            <span>{{detailsData.runTime|filter1}}</span>
            <span class="help-block">运行时间</span>
          </div>

          <div class="flex maxw100 boderB">
            <span v-if="detailsData.status==='COMPLETED'">已完成</span>
            <span v-if="detailsData.status==='STARTED'">正在运行</span>
            <span v-if="detailsData.status==='FAILED'">失败</span>
            <span v-if="detailsData.status==='ABANDONED'">丢弃</span>
            <span v-if="detailsData.status==='STOPPED'">已停止</span>
            <span class="help-block">返回码</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>


<style scoped>
.overhide {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#timeToString .el-tabs__header {
  margin: 0;
}
#timeToString .el-table tr {
  cursor: pointer;
}
.boderB {
  padding: 10px;
  border-bottom: 1px #eee solid;
}
.flex {
  font-weight: 500;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 100%;
  flex: 1 1 100%;
  box-sizing: border-box;
  max-width: 40%;
  max-height: 100%;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.maxw100 {
  max-width: 100% !important;
}
.help-block {
  color: #868686;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 10px;
  vertical-align: bottom;
  display: table-cell;
  min-height: 20px;
}
.help-block_ {
  color: #868686;
  font-size: 12px;
  padding-top: 10px;
  vertical-align: bottom;
  display: table-cell;
  min-height: 20px;
}
.btnGroup1 {
  float: right;
  padding: 10px;
}
</style>
<script>
import { serviceMonitor, jobs, fail, abandon, includeSteps } from '@/api/dataLake/api'
import { timeToString } from '@/utils/timeToString'
export default {
  name: 'homeWork',
  data () {
    return {
      interval1: {},
      interval2: {},
      chooseId: '',
      btn1: {
        'border-color': '#c6e2ff',
        'color': ' #409EFF',
        'background-color': '#ecf5ff'
      },
      btn2: {},
      btnClick: {
        'border-color': '#c6e2ff',
        'color': ' #409EFF',
        'background-color': '#ecf5ff'
      },
      jobParamsShow: true,
      activeName2: 'De_job',
      detailsData: {},
      details: false,
      loadding: false,
      activeName: '',
      query: '',
      currentPage: 1,
      ServiceData: [],
      total: 20,
      pageSize: 10,
      sort: '-startTime',
    }
  },
  filters: {
    filter1 (val) {
      return timeToString(parseInt((val) / 1000))
    },
    filter2 (val) {
      if (val) {
        return val
      }
      else {
        return '没有具体说明'
      }
    },
    filter3 (val) {
      let arr = [];
      for (let key in val) {
        let json = { key: key, value: val[key] }
        arr.push(json)
      }
      return arr
    }
  },
  watch: {
    query () {
      this.getTable()
    },
    activeName (val) {
      this.pageSize = 10
      this.currentPage = 1
      this.getTable()
    }
  },
  methods: {
    jobParams () {
      this.jobParamsShow = true
      this.btn1 = Object.assign({}, this.btnClick)
      this.btn2 = {}

    },
    jobData () {
      this.jobParamsShow = false
      this.btn2 = Object.assign({}, this.btnClick)
      this.btn1 = {}
    },
    rowClick (row, event, column) {
      this.details = true
      this.chooseId = row.instanceId
      //   this.interval2 = setInterval(includeSteps(this.chooseId).then(data => {
      //     this.detailsData = data
      //   }), 1000)
      //   this.interval2
      //   this.clearInterval(interval1)
      includeSteps(this.chooseId).then(data => {
        this.detailsData = data
      })

    },
    toFail (index) {
      let id = this.ServiceData[index].instanceId
      fail(id).then(data => {
        if (data.status === "error") {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
        else {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.ServiceData.splice(index, 1, data)
        }

      })
    },
    toAbon (index) {
      let id = this.ServiceData[index].instanceId
      abandon(id).then(data => {
        if (data.status === "error") {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
        else {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.ServiceData.splice(index, 1, data)
        }


      })
    },
    toFail2 (id) {
      fail(id).then(data => {
        includeSteps(this.chooseId).then(data => {
          if (data.status === "error") {
            this.$message({
              type: 'error',
              message: data.message
            })
          }
          else {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.detailsData = data
          }

        })
      })
    },
    toAbon2 (id) {
      abandon(id).then(data => {
        includeSteps(this.chooseId).then(data => {
          if (data.status === "error") {
            this.$message({
              type: 'error',
              message: data.message
            })
          }
          else {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.detailsData = data
          }
        })
      })
    },
    getParams () {
      let params
      let type
      this.activeName == 0 ? type = '' : type = this.activeName
      if (this.query) {
        params = { content: { filter: this.query, limit: this.pageSize, sort: this.sort, start: (this.currentPage - 1) * this.pageSize }, type: type }

      }
      else {
        params = { content: { limit: this.pageSize, sort: this.sort, start: (this.currentPage - 1) * this.pageSize }, type: type }
      }
      return params
    },
    getTable () {
      // this.loadding = true
      jobs(this.getParams()).then(data => {
        this.ServiceData = data.data
        this.total = data.recordsTotal
        // this.loadding = false
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getTable()

    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getTable()
    }
  },
  mounted () {
    //注册定时器
    //this.interval1 = setInterval(this.getTable, 1000)
    this.getTable()
  },
  //销毁定时器
  //   beforeDestroy () {
  //     clearInterval(this.interval1)
  //     clearInterval(this.interval2)
  //   }

}
</script>
