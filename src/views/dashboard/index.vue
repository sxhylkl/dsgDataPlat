<template>
  <div id="indexContainer" v-loading="loadingAll">
    <!-- <el-form-item label="年份" style="margin-bottom: 0">
          <el-select v-model="timeObj.year" placeholder="请选择年份">
            <el-option
              v-for="item in timeObj.yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份" style="margin-bottom: 0">
          <el-select v-model="timeObj.month" placeholder="请选择月份">
            <el-option
              v-for="item in timeObj.monthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-bottom: 0">
          <el-select v-model="timeObj.day" placeholder="请选择日">
            <el-option
              v-for="item in timeObj.monthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
    </el-form-item>-->
    <el-form>
      <el-form-item label="选择日期查看" label-width="100px">
        <div class="block">
          <el-date-picker
            v-model="timeObj.time"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </el-form-item>
    </el-form>

    <!-- <el-form-item style="margin-bottom: 0">
          <el-button type="primary" @click="serachFn">搜索</el-button>
    </el-form-item>-->
    <div class="report-box">
      <div>
        <report-Depart :data="departObj" @echarts-list="getChild"></report-Depart>
      </div>
      <div class="report-box-item-two">
        <report-task :data="taskObj" @echarts-list="getChild"></report-task>
        <report-theme :data="themeObj" @echarts-list="getChild"></report-theme>
      </div>
    </div>
    <div class="report-box">
      <div>
        <report-flow :data="flowObj" @echarts-list="getChild"></report-flow>
      </div>
      <div class="report-box-item-two">
        <report-standard :data="standardObj" @echarts-list="getChild"></report-standard>
        <report-business :data="businessObj" @echarts-list="getChild"></report-business>
      </div>
    </div>
    <div class="report-box">
      <div>
        <report-other @echarts-list="getChild" :data="handledObj"></report-other>
      </div>
      <div class="report-box-item-two">
        <report-source :data="sourceObj" @echarts-list="getChild"></report-source>
        <report-rule :data="ruleObj" @echarts-list="getChild"></report-rule>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  getDepartCount,
  getDepartDeptSummary,
  getDepartDeptDataSummary,
  getDepartDeptTaskSummary,
  getTaskCount,
  getTaskFeedSummary,
  getThemeCount,
  getThemeTableSummary,
  getFeedCount,
  getFeedStatus,
  getFeedType,
  getStandardCount,
  getStandardTableSummary,
  getBusinessCount,
  getBusinessTableSummary,
  getDataSourceCount,
  getDataSourceSummary,
  getRulesCount,
  getDashBoard,
  getRecentData
} from '@/api/dataLake/api.js'
import reportDepart from './index/depart.vue'
import reportTask from './index/task.vue'
import reportTheme from './index/theme.vue'
import reportFlow from './index/flow.vue'
import reportStandard from './index/standard.vue'
import reportBusiness from './index/business.vue'
import reportSource from './index/source.vue'
import reportRule from './index/rule.vue'
import reportOther from './index/other.vue'
export default {
  name: "index",
  components: {
    reportDepart,
    reportTask,
    reportTheme,
    reportFlow,
    reportStandard,
    reportBusiness,
    reportSource,
    reportRule,
    reportOther
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      loadingAll: true,
      resizeList: [],
      timeObj: { // 时间筛选obj
        time: ''
        // year: '',
        // month: '',
        // day: '',
        // yearOptions: [
        //   {
        //     value: '2019',
        //     label: '2019'
        //   }
        // ],
        // monthOptions: [
        //   {
        //     value: '1',
        //     label: '1'
        //   }
        // ]
      },
      departObj: { // 部门报表对象
        title: '部门报表',
        total: '', // 总数
        relationInfo: { // 关联信息-总数、业务数、主题数、标准数
          title: '关联信息数量',
          loading: false,
          colorList: ['#3398DB', '#61a0a8', '#2f4554', '#d48265'],
          data: {
            //departCnt: 10,
            businessCnt: 0,
            standardCnt: 0,
            subjectCnt: 0,
          },
          xData: ['关联业务', '关联标准', '关联主题']
        },
        throughputInfo: { // 处理量 
          title: '处理量',
          loading: false,
          colorList: ['#42b983', '#3398DB', '#ff6347', '#ff8170'],
          data: {
            departDataSize: 0, // 成功-数据总量
            departDataCnt: 0, // 成功-数据条数
            departFlowFailedCnt: 0, // 失败-流程数量
            deparJobFailedCnt: 0 // 失败-job数量
          },
          xData: ['成功-数据总量', '成功-数据条数', '失败-流程数量', '失败-job数量']
        }
      },
      taskObj: { // 任务报表对象
        title: '任务报表',
        total: 0,
        taskInfo: {
          title: '',
          loading: false,
          colorList: ['#ffcc00', '#42b983'],
          data: {
            emptyTaskCnt: 0, // 没有流程的任务个数
            enabledTaskCnt: 0 // 正在运行
          },
          xData: ['没有流程', '正在运行']
        }
      },
      themeObj: { // 主题报表对象
        title: '主题报表',
        total: 0,
        themeInfo: {
          title: '关联表数据',
          loading: false,
          colorList: ['#3398DB', '#61a0a8', '#2f4554'],
          data: {
            subjectAllTableCnt: 0, // 关联所有表的总数
            subjectDataSize: 0, // 关联所有表的数据总大小
            subjectDataCnt: 0 // 关联所有表的数据总记录数
          },
          xData: ['关联表总数', '数据总大小', '总记录数']
        }
      },
      flowObj: { // 流程报表对象
        title: '流程报表',
        total: 0, // 总数
        stateInfo: {
          title: '',
          // title: '启用/禁用',
          loading: false,
          className: 'stateInfo',
          colorList: ['#42b983', '#ff6347'],
          data: {
            // total: 10,
            enabled: 0,
            disabled: 0
          },
          xData: ['启用数', '禁用数']
        },
        runningInfo: {
          title: '',
          loading: false,
          className: 'runningInfo',
          colorList: ['#42b983', '#ff6347'],
          data: {
            // total: 10,
            flowHealthCnt: 0,
            flowUnhealthCnt: 0
          },
          xData: ['运行正常', '运行失败']
        },
        transformInfo: {
          title: '',
          loading: false,
          className: 'transformInfo',
          colorList: ['#3398DB', '#61a0a8'],
          data: {
            // total: 10,
            flowIngestCnt: 0,
            flowTransformCnt: 0
          },
          xData: ['采集', '转换']
        }
      },
      standardObj: { // 标准报表对象
        title: '标准报表',
        total: 0, // 总数
        standardInfo: {
          title: '',
          loading: false,
          colorList: ['#3398DB', '#61a0a8', '#2f4554', '#d48265'],
          className: 'standardInfo',
          data: {
            standardTableCnt: 0, // 标准表的总个数
            standardTableColumnCnt: 0, // 标准表的字段个数
            standardDataSize: 0, // 标准表的总大小
            standardDataCnt: 0 // 标准表的总记录数
          },
          xData: ['标准表总记录', '标准表字段数', '标准表总个数', '标准表总大小']
        },
      },
      businessObj: { // 业务报表对象
        title: '业务报表',
        total: 0,
        businessInfo: {
          title: '',
          loading: false,
          className: 'businessInfo',
          colorList: ['#3398DB', '#61a0a8'],
          data: {
            businessDataSize: 0, // 所有业务表的数据总量大小
            businessDataCnt: 0 // 所有业务表的数据总记录数
          },
          xData: ['数据总大小', '数据总记录数']
        }
      },
      sourceObj: { // 源端报表对象
        title: '源端报表',
        total: 0, // 总数
        sourceInfo: {
          title: '',
          loading: false,
          colorList: ['#3398DB', '#42b983', '#ff6347'],
          className: 'sourceInfo',
          data: {
            datasourceCnt: 0, // 数据源个数
            healthCnt: 0, // 数据源链接服务正常的数量
            unhealthCnt: 0, // 数据源链接服务异常的数量
          },
          xData: ['数据源个数', '数据源正常量', '数据源异常量']
        },
      },
      ruleObj: { // 规则报表对象
        title: '规则报表',
        total: 0,
        ruleInfo: {
          title: '',
          loading: false,
          className: 'RuleInfo',
          colorList: ['#3398DB'],
          data: {
            ruleTotalCnt: 0, // 所有业务表的数据总量大小
          },
          xData: ['规则总个数']
        }
      },
      handledObj: { // 异常状况报表对象
        title: '异常状况报表',
        handledInfo: {
          title: '',
          loading: false,
          className: 'handledInfo',
          colorList: ['#3398DB', '#61a0a8'],
          data: {
            handledCnt: 0, // 已处理作业数量
            unhandledCnt: 0 // 未处理作业数量
          },
          xData: ['已处理', '未处理']
        }
      }
    }
  },
  watch: {
    'timeObj.time' (val) {
      this.getAllData()
    }
  },
  mounted () {
    this.timeObj.time = this.getDate()
    //this.getAllData();
    //this.initData()
    setTimeout(() => {
      window.onresize = () => {
        this.resizeList.forEach(el => {
          el.resize()
        })
      }
    }, 100)
  },
  methods: {
    getAllData () {
      if (this.timeObj.time === this.getDate()) {
        getRecentData().then(res => {
          this.loadingAll = true
          getDashBoard(this.timeObj.time).then(res => {
            this.loadingAll = false
            this.dataM(res)
          }).catch(err => {
            // this.$message.error('主页接口出错')
            this.loadingAll = false
          })

        })
      }
      else {
        this.loadingAll = true
        getDashBoard(this.timeObj.time).then(res => {
          this.loadingAll = false
          this.dataM(res)
        }).catch(err => {
          // this.$message.error('主页接口出错')
          this.loadingAll = false
        })
      }


      // const res = {"msg":"success","sysmsg":"","code":0,"data":[{"dateTime":"20190129","Standard_total":1,"DataSource_datasourceCnt":0,"Category_total":3,"Feed_flowHealthCnt":0,"Feed_flowTransformCnt":0,"Feed_flowUnhealthCnt":0,"Feed_total":0,"Depart_subjectCnt":0,"Depart_businessCnt":0,"Subject_subjectAllTableCnt":0,"Standard_standardDataSize":0,"Subject_subjectDataCnt":0,"Depart_departDataCnt":1,"Business_total":0,"Category_taskCnt":0,"DataSource_unhealthCnt":0,"Depart_total":5,"Feed_flowIngestCnt":0,"Feed_enabled":0,"Subject_subjectDataSize":0,"Depart_departCnt":5,"Depart_standardCnt":0,"Category_emptyTaskCnt":0,"Depart_deparJobFailedCnt":0,"DataSource_healthCnt":0,"Standard_standardTableColumnCnt":0,"Business_businessDataSize":0,"Subject_total":0,"Standard_standardTableCnt":0,"Business_businessDataCnt":0,"Rule_ruleTotalCnt":22,"Depart_departDataSize":1,"Category_enabledTaskCnt":0,"Depart_departFlowFailedCnt":0,"Standard_standardDataCnt":0,"DataSource_total":16,"DataSource_tableSize":0,"Feed_disabled":0}]}
      // this.dataM (res)
    },
    dataM (res) {
      if (res.code === 0 && res.data.length > 0) {
        this.departObj.total = res.data[0].Depart_total
        this.departObj.relationInfo.data.businessCnt = res.data[0].Depart_businessCnt
        //this.departObj.relationInfo.data.departCnt = res.data[0].Depart_departCnt
        this.departObj.relationInfo.data.standardCnt = res.data[0].Depart_standardCnt
        this.departObj.relationInfo.data.subjectCnt = res.data[0].Depart_subjectCnt

        this.taskObj.taskInfo.data.emptyTaskCnt = res.data[0].Category_emptyTaskCnt
        this.taskObj.taskInfo.data.enabledTaskCnt = res.data[0].Category_enabledTaskCnt
        this.taskObj.total = res.data[0].Category_taskCnt

        this.themeObj.themeInfo.data.subjectAllTableCnt = res.data[0].Subject_subjectAllTableCnt
        this.themeObj.themeInfo.data.subjectDataSize = res.data[0].Subject_subjectDataSize
        this.themeObj.themeInfo.data.subjectDataCnt = res.data[0].Subject_subjectDataCnt
        this.themeObj.total = res.data[0].Subject_total

        this.flowObj.stateInfo.data.enabled = res.data[0].Feed_enabled
        this.flowObj.stateInfo.data.disabled = res.data[0].Feed_disabled
        this.flowObj.total = res.data[0].Feed_total

        this.flowObj.runningInfo.data.flowHealthCnt = res.data[0].Feed_flowHealthCnt
        this.flowObj.runningInfo.data.flowUnhealthCnt = res.data[0].Feed_flowUnhealthCnt

        this.flowObj.transformInfo.data.flowIngestCnt = res.data[0].Feed_flowIngestCnt
        this.flowObj.transformInfo.data.flowTransformCnt = res.data[0].Feed_flowTransformCnt

        this.standardObj.standardInfo.data.standardTableCnt = res.data[0].Standard_standardTableCnt
        this.standardObj.standardInfo.data.standardTableColumnCnt = res.data[0].Standard_standardTableColumnCnt
        this.standardObj.standardInfo.data.standardDataSize = res.data[0].Standard_standardDataSize
        this.standardObj.standardInfo.data.standardDataCnt = res.data[0].Standard_standardDataCnt
        this.standardObj.total = res.data[0].Standard_total

        this.businessObj.businessInfo.data.businessDataSize = res.data[0].Business_businessDataSize
        this.businessObj.businessInfo.data.businessDataCnt = res.data[0].Business_businessDataCnt
        this.businessObj.total = res.data[0].Business_total


        this.sourceObj.sourceInfo.data.datasourceCnt = res.data[0].DataSource_datasourceCnt
        this.sourceObj.sourceInfo.data.healthCnt = res.data[0].DataSource_healthCnt
        this.sourceObj.sourceInfo.data.unhealthCnt = res.data[0].DataSource_unhealthCnt
        this.sourceObj.total = res.data[0].DataSource_total
        res.data[0].Rule_ruleTotalCnt ? this.ruleObj.ruleInfo.data.ruleTotalCnt = res.data[0].Rule_ruleTotalCnt : this.ruleObj.ruleInfo.data.ruleTotalCnt = 0


        this.handledObj.handledInfo.data.handledCnt = res.data[0].KyloAlert_handledCnt
        this.handledObj.handledInfo.data.unhandledCnt = res.data[0].KyloAlert_unhandledCnt


      }
      else if (res.data.length === 0) {
        this.timeObj.time = this.getDate()
        this.$message.error('该日期没有记录!')
      }
    },
    initData () {
      this.getDepartCountApi()
      this.getDepartDeptSummaryApi()
      this.getDepartDeptDataSummaryApi()
      this.getDepartDeptTaskSummaryApi()
      this.getTaskCountApi()
      this.getTaskFeedSummaryApi()
      this.getThemeCountApi()
      this.getThemeTableSummaryApi()
      this.getFeedCountApi()
      this.getFeedStatusApi()
      this.getFeedTypeApi()
      this.getStandardCountApi()
      this.getStandardTableSummaryApi()
      this.getBusinessCountApi()
      this.getBusinessTableSummaryApi()
      this.getDataSourceCountApi()
      this.getDataSourceSummaryApi()
      this.getRulesCountApi()
    },
    getDate () {
      const nowTime = new Date()
      const yy = nowTime.getFullYear()
      const mm = `${nowTime.getMonth() + 1}`.padStart(2, '0')
      const dd = `${nowTime.getDate()}`.padStart(2, '0')
      const str = `${yy}${mm}${dd}`
      return str
    },
    /**
     * @description 获取所有部门总数api
     */
    getDepartCountApi () {
      getDepartCount(this.timeObj).then(res => {
        this.departObj = { ...this.departObj, ...res }
      })
    },
    /**
     * @description 获取所有部门关联业务、主题、标准数据个数api
     */
    getDepartDeptSummaryApi () {
      getDepartDeptSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.departObj.relationInfo.loading = false
          this.departObj.relationInfo.data = res.data
        }
      })
    },
    /**
     * @description 获取部门关联任务流程的所有表的数据量总大小与总条数
     */
    getDepartDeptDataSummaryApi () {
      getDepartDeptDataSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.departObj.throughputInfo.loading = false
          this.departObj.throughputInfo.data = { ...this.departObj.throughputInfo.data, ...res.data }
        }
      })
    },
    /**
     * @description 统计所有部门处理数据状态为失败的流程/job数
     */
    getDepartDeptTaskSummaryApi () {
      getDepartDeptTaskSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.departObj.throughputInfo.loading = false
          this.departObj.throughputInfo.data = { ...this.departObj.throughputInfo.data, ...res.data }
        }
      })
    },
    /**
     * @description 统计所有任务总的个数
     */
    getTaskCountApi () {
      getTaskCount(this.timeObj).then(res => {
        if (res.code === 0) {
          this.taskObj.total = res.data.taskCnt
        }
      })
    },
    /**
     * @description 统计所有任务中没有流程的任务个数,统计所有任务中有流程正在运行的任务个数
     */
    getTaskFeedSummaryApi () {
      getTaskFeedSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.taskObj.taskInfo.loading = false
          this.taskObj.taskInfo.data = res.data
        }
      })
    },
    /**
     * @description 统计所有主题下表的总的个数（各种表）、数据总量大小和条数
     */
    getThemeTableSummaryApi () {
      getThemeTableSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.themeObj.themeInfo.loading = false
          this.themeObj.themeInfo.data = res.data
        }
      })
    },
    /**
     * @description 统计所有主题总的个数
     */
    getThemeCountApi () {
      getThemeCount(this.timeObj).then(res => {
        this.themeObj.total = res.total
      })
    },
    /**
     * @description 统计所有流程总的个数,启用/禁用的流程个数
     */
    getFeedCountApi () {
      getFeedCount(this.timeObj).then(res => {
        const { total, enabled, disabled } = res
        this.flowObj.total = total
        this.flowObj.stateInfo.loading = false
        this.flowObj.stateInfo.data = { enabled, disabled }
      })
    },
    /**
     * @description 统计所有运行正常/失败
     */
    getFeedStatusApi () {
      getFeedStatus(this.timeObj).then(res => {
        if (res.code === 0) {
          this.flowObj.runningInfo.loading = false
          this.flowObj.runningInfo.data = res.data
        }
      })
    },
    /**
     * @description 统计所有采集/转换
     */
    getFeedTypeApi () {
      getFeedType(this.timeObj).then(res => {
        if (res.code === 0) {
          this.flowObj.transformInfo.loading = false
          this.flowObj.transformInfo.data = res.data
        }
      })
    },
    /**
     * @description 统计所有标准的总个数
     */
    getStandardCountApi () {
      getStandardCount(this.timeObj).then(res => {
        if (res.code === 0) {
          this.standardObj.total = res.data.total
        }
      })
    },
    /**
     * @description 统计所有标准下标准表的总个数/标准表的字段个数/数据总量大小/数据条数
     */
    getStandardTableSummaryApi () {
      getStandardTableSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.standardObj.standardInfo.loading = false
          this.standardObj.standardInfo.data = res.data
        }
      })
    },
    /**
     * @description 统计所有业务系统总个数
     */
    getBusinessCountApi () {
      getBusinessCount(this.timeObj).then(res => {
        this.businessObj.total = res.total
      })
    },
    /**
     * @description 统计所有业务表的数据总量大小和条数
     */
    getBusinessTableSummaryApi () {
      getBusinessTableSummary(this.timeObj).then(res => {
        if (res.code === 0) {
          this.businessObj.businessInfo.loading = false
          this.businessObj.businessInfo.data = res.data
        }
      })
    },
    /**
     * @description 统计源端数据源的类型的个数
     */
    getDataSourceCountApi () {
      getDataSourceCount(this.timeObj).then(res => {
        this.sourceObj.total = res.total
      })
    },
    /**
     * @description 统计源端已登记的源端信息个数/服务正常/异常/数据源采集的数据量
     */
    getDataSourceSummaryApi () {
      getDataSourceSummary(this.timeObj).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.sourceObj.sourceInfo.loading = false
          this.sourceObj.sourceInfo.data = res.data
        }
      })
    },
    getRulesCountApi () {
      getRulesCount(this.timeObj).then(res => {
        this.ruleObj.ruleInfo.loading = false
        this.ruleObj.ruleInfo.data = res.data
        this.ruleObj.ruleInfo.total = res.data.ruleTotalCnt
      })
    },
    /**
     * @description 搜索
     */
    serachFn () {
      this.departObj.throughputInfo.data = { ...this.departObj.throughputInfo.data, ...{ departDataSize: 9, departDataCnt: 8, } }
    },
    /**
     * @description 获取子组件传来的echarts对象
     */
    getChild (data) {
      this.resizeList = [...this.resizeList, ...data]
    }
  }
}
</script>

<style lang='scss' scoped>
#indexContainer {
  min-height: calc(100vh - 70px - 34px - 40px);
}
.report-box {
  display: flex;
  justify-content: space-between;
  height: calc((100vh - 70px - 34px - 40px) / 3);
  min-height: 200px;
  margin-top: 20px;
  > div {
    width: 49%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.report-box-item-two {
  display: flex;
  justify-content: space-between;
  > div {
    width: 49%;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>