<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole"></component> -->
    <div class="echarts-box-left">
      <div class="box-top">
        <!-- 任务总数 -->
        <div class="echarts-item">
          <div class="echarts-item-title">
            <p>任务总数</p>
            <!-- <span>统计所有任务总数</span> -->
            <span>总数: {{taskCountObj.total ? taskCountObj.total + 3 : 0}}</span>
          </div>
          <div class="echarts-item-content">
            <div class="echarts-item-box" v-loading="taskCountObj.loading"></div>
            <!-- <p class="echarts-total">Total {{taskCountObj.total ? taskCountObj.total : 0}}</p> -->
          </div>
          <div class="echarts-item-footer">
            <div>
              <p style="color: #259A3d">{{taskCountObj.total ? taskCountObj.total : 0}}</p>
              <span>任务数</span>
            </div>
            <div>
              <p style="color: #37d8ff">3</p>
              <span>已启动</span>
            </div>
          </div>
        </div>
        <!-- 数据主题总数 -->
        <div class="echarts-item">
          <div class="echarts-item-title">
            <p>数据主题总数</p>
            <!-- <span>统计所有数据主题总数</span> -->
            <span>总数：{{dataCountObj.total ? dataCountObj.total + 3 : 0}}</span>
          </div>
          <div class="echarts-item-content">
            <div class="echarts-item-box" v-loading="dataCountObj.loading"></div>
            <!-- <p class="echarts-total">Total {{dataCountObj.total ? dataCountObj.total : 0}}</p> -->
          </div>
          <div class="echarts-item-footer">
            <div>
              <p>{{dataCountObj.total ? dataCountObj.total : 0}}</p>
              <span>主题数</span>
            </div>
            <div>
              <p>3</p>
              <span>数据大小</span>
            </div>
          </div>
        </div>
        <!-- 组织部门总数 -->
        <div class="echarts-item">
          <div class="echarts-item-title">
            <p>组织部门总数</p>
            <!-- <span>统计所有组织部门总数</span> -->
            <span>总数：{{departmentObj.total ? departmentObj.total + 5 : 0}}</span>
          </div>
          <div class="echarts-item-content">
            <div class="echarts-item-box" v-loading="departmentObj.loading"></div>
            <!-- <p class="echarts-total">Total {{departmentObj.total ? departmentObj.total : 0}}</p> -->
          </div>
          <div class="echarts-item-footer">
            <div>
              <p>{{departmentObj.total ? departmentObj.total : 0}}</p>
              <span>部门数</span>
            </div>
            <div>
              <p>5</p>
              <span>业务数</span>
            </div>
          </div>
        </div>
        <!-- 模板统计信息 -->
        <div class="echarts-item">
          <div class="echarts-item-title">
            <p>模板统计信息</p>
            <!-- <span>统计所有模板启用/注册信息</span> -->
            <span>总数：{{templateInfoObj.totalNum ? templateInfoObj.totalNum : 0}}</span>
          </div>
          <div class="echarts-item-content">
            <div class="echarts-item-box" v-loading="templateInfoObj.loading"></div>
            <!-- <p class="echarts-total">Total {{templateInfoObj.totalNum ? templateInfoObj.totalNum : 0}}</p> -->
          </div>
          <div class="echarts-item-footer">
            <div>
              <p>{{templateInfoObj.enabledNum}}</p>
              <span>启用</span>
            </div>
            <div>
              <p>{{templateInfoObj.registeredNum}}</p>
              <span>注册</span>
            </div>
          </div>
        </div>
        <!-- 流程统计信息 -->
        <div class="echarts-item">
          <div class="echarts-item-title">
            <p>流程统计信息</p>
            <!-- <span>统计所有流程启用/禁用信息</span> -->
            <span>总数：{{feedCountObj.total ? feedCountObj.total : 0}}</span>
          </div>
          <div class="echarts-item-content">
            <div class="echarts-item-box" v-loading="feedCountObj.loading"></div>
            <!-- <p class="echarts-total">Total {{feedCountObj.total ? feedCountObj.total : 0}}</p> -->
          </div>
          <div class="echarts-item-footer">
            <div>
              <p>{{feedCountObj.enabled}}</p>
              <span>启用</span>
            </div>
            <div>
              <p style="color: red">{{feedCountObj.disabled}}</p>
              <span>禁用</span>
            </div>
          </div>
        </div>
      </div>
      <div class="box-bottom">
        <div class="echart-broken-line"></div>
      </div>
    </div>
    <div class="echarts-box-right">
      <div class="right-title">
        <img src="../../../static/dataCenter/images/fail.png" alt>
        <p>告警</p>
      </div>
      <div
        v-if="alarmList.length"
        class="warning-item"
        v-for="(item,index) in alarmList"
        :key="index"
      >
        <div>
          <p class="warning-item-name">{{item.feedName}}</p>
          <p>{{item.typeDisplayName}}</p>
        </div>
        <div>
          <p class="warning-item-count">{{item.count}}告警</p>
          <p>{{timeTohours(item.lastAlertTimestamp)}} 以前</p>
        </div>
      </div>
      <p v-if="!alarmList.length" style="text-align:center;padding: 10px;">暂无告警信息</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { getTemplatesInfo, getFeedCount, getDataCount, getTaskCount, getDepartmentCount, getTemplatesAlarm } from '@/api/dataLake/api'
export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data () {
    return {
      currentRole: 'adminDashboard',
      templateInfoObj: { loading: true },
      feedCountObj: { loading: true },
      dataCountObj: { loading: true },
      taskCountObj: { loading: true },
      departmentObj: { loading: true },
      echartsList: [], // 存放重绘echarts图标对象的集合
      alarmList: [],
      alarmInterval: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created () {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  mounted () {
    this.initData()
    this.alarmInterval = setInterval(() => {
      this.getAlarmApi()
    }, 10000)
    window.onresize = () => {
      this.echartsList.forEach(el => {
        el.resize()
      })
    }
  },
  destroyed () {
    clearInterval(this.alarmInterval)
  },
  methods: {
    initData () {
      /**
       * @description 获取模板统计信息
       */
      getTemplatesInfo().then(res => {
        const { enabledNum, registeredNum } = res
        const params = {
          colorList: ['green', '#3c8dbc'],
          data: [
            {
              value: enabledNum,
              name: '启用'
            },
            {
              value: registeredNum,
              name: '注册'
            }
          ],
          name: '模板统计信息'
        }
        this.templateInfoObj = { ...res, ...{ loading: false } }
        this.drawLine(3, params)
      })
      /**
       * @description 获取流程统计信息
       */
      getFeedCount().then(res => {
        const { enabled, disabled } = res
        const params = {
          colorList: ['green', 'red'],
          data: [
            {
              value: enabled,
              name: '启用'
            },
            {
              value: disabled,
              name: '禁用'
            }
          ],
          name: '流程统计信息'
        }
        this.feedCountObj = { ...res, ...{ loading: false } }
        this.drawLine(4, params)
      })
      /**
       * @description 获取数据主题总数
       */
      getDataCount().then(res => {
        const params = {
          colorList: ['green', '#3c8dbc'],
          data: [
            {
              value: res.total,
              name: '数据主题总数'
            },
            {
              value: 3,
              name: '数据大小'
            }
          ],
          name: '数据主题总数'
        }
        this.dataCountObj = { loading: false, total: res.total }
        this.drawLine(1, params)
      })
      /**
       * @description 获取任务总数
       */
      getTaskCount().then(res => {
        const params = {
          colorList: ['#259A3d', '#37d8ff'],
          data: [
            {
              value: res.total,
              name: '任务总数'
            },
            {
              value: 3,
              name: '已启动'
            }
          ],
          name: '任务总数'
        }
        this.taskCountObj = { loading: false, total: res.total }
        this.drawLine(0, params)
      })
      /**
       * @description 获取组织部门总数
       */
      getDepartmentCount().then(res => {
        console.log(res)
        const params = {
          colorList: ['green', '#3c8dbc'],
          data: [
            {
              value: res.total,
              name: '组织部门总数'
            },
            {
              value: 5,
              name: '业务数'
            }
          ],
          name: '组织部门总数'
        }
        this.departmentObj = { loading: false, total: res.total }
        this.drawLine(2, params)
      })
      this.getAlarmApi()
      this.drawBrokenLine()
    },
    /**
     * @description 处理echarts画图
     * @param index { number } 第几个图表
     * @param params { object } color,value,name配置
     */
    drawLine (index, params) {
      const myChart = this.$echarts.init(document.getElementsByClassName('echarts-item-box')[index])
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: params.colorList,
        legend: {
          show: false,
          data: ['启用', '注册']
        },
        series: [
          {
            name: params.name,
            type: 'pie',
            radius: ['75%', '90%'],
            // radius: '90%',
            avoidLabelOverlap: false,
            hoverOffset: 5,
            clockwise: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '22',
                  fontWeight: 'bold'
                }
              }
            },
          data: params.data
          }
        ]
    }
      myChart.setOption(option)
      this.echartsList.push(myChart)
  },
  /**
   * @description 折线图
   */
  drawBrokenLine () {
    const myChart = this.$echarts.init(document.getElementsByClassName('echart-broken-line')[0])
    let gzData = [12.6, 25.9, 9.0, 62.4, 28.7, 70.7, 45.6, 82.2, 48.7, 18.8, 26.0, 22.3]
    let bjData = [13.9, 15.9, 11.1, 18.27, 48.3, 69.2, 31.6, 46.6, 55.4, 28.4, 20.23, 10.7]
    let XData = ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
    const option = {
      title: {
        text: "异常情况总览",
        x: 'left'
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        icon: 'roundRect',
        data: ['报警', '故障']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        // containLabel: true
      },
      xAxis: [{
        name: '时间',
        type: 'category',
        // axisPointer: {
        //   type: "line",
        //   shadowStyle: {
        //     color: "blue",
        //     opacity: 0.05

        //   }
        // },
        boundaryGap: false,
        data: XData
      }],
      yAxis: [
        {
          name: '(次)',
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'line'
            }
          },
        }
      ],
      series: [
        {
          id: 'y0',
          name: '故障',
          type: 'line',
          smooth: true,
          color: "orange",
          // symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'orange',
              lineStyle: {
                color: "orange",
                width: 1
              }
            }
          },
          data: gzData
        },
        {
          id: 'y1',
          name: '报警',
          type: 'line',
          smooth: true,
          // symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'red',
              lineStyle: {
                color: "red",
                width: 1
              }
            }
          },
          data: bjData
        },
      ]
    }
    myChart.setOption(option)
    this.echartsList.push(myChart)
  },
  /**
   * @description 获取模板告警信息
   */
  getAlarmApi () {
    console.log('调用')
    getTemplatesAlarm().then(res => {
      const { alerts } = res
      this.alarmList = alerts
    })
  },
  /**
   * @description 时间戳转换为小时/天数，小时>24转换为天数
   * @param time { number } 时间戳
   */
  timeTohours (time) {
    const nowTime = parseInt(new Date().getTime() / 1000)
    const tempTime = nowTime - (time / 1000)
    const hours = parseInt(tempTime / 60 / 60)
    const day = parseInt(tempTime / 60 / 60 / 24)
    const tempReturn = hours > 24 ? `${day}天` : `${hours}小时`
    return tempReturn
  }
}
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  height: calc(100vh - 70px - 34px - 40px);
}
.echarts-box-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.box-top {
  margin-bottom: 20px;
}
.box-top,
.box-bottom {
  display: flex;
  justify-content: space-between;
  height: 45%;
  .echarts-item {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 18%;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.echart-broken-line {
  width: 100%;
  height: 100%;
}
.echarts-item-title {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #dcdcdc;
  p {
    margin: 0;
    font-size: 18px;
    color: #444;
  }
  span {
    font-size: 18px;
    color: #444;
  }
}
.echarts-item-content {
  flex: 1;
  display: flex;
  position: relative;
}
.echarts-item-footer {
  display: flex;
  height: 55px;
  padding: 0 10px;
  justify-content: space-between;
  > div {
    display: flex;
    flex-direction: column;
    text-align: center;
    p {
      margin: 0;
      font-size: 25px;
      color: green;
    }
    &:nth-of-type(2) {
      p {
        color: #3c8dbc;
      }
    }
  }
}
.echarts-item-box {
  flex: 1;
}
.echarts-total {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: #79ddfb;
}
.box-bottom {
  flex: 1;
}
.echarts-box-right {
  width: 25%;
  min-width: 300px;
  margin-left: 20px;
  overflow-y: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .right-title {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 50px;
    font-size: 18px;
    border-bottom: 1px solid #dcdcdc;
    p {
      margin: 0;
      margin-left: 10px;
    }
  }
}
.warning-item {
  border-bottom: 1px solid #dcdcdc;
  padding: 10px;
  > div {
    display: flex;
    justify-content: space-between;
  }
  .warning-item-name {
    width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .warning-item-count {
    color: red;
  }
}
</style>

