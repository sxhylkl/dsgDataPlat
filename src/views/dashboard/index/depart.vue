<template>
  <div id="departContainer">
    <div class="header">{{data.title}}（部门数：{{data.total}}）</div>
    <div class="echarts-box">
      <div>
        <p>{{data.relationInfo.title}}</p>
        <div class="relation-info" v-loading="data.relationInfo.loading"></div>
      </div>
      <div>
        <p>{{data.throughputInfo.title}}</p>
        <div class="throughput-info" v-loading="data.throughputInfo.loading"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "depart",
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      echartsList: [] // 存放echarts对象
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    echartsList(val) {
      this.$emit('echarts-list',val)
    },
    data: {
      handler (newV,old) {
        setTimeout(() => {
          this.initData()
        },100)
      },
      deep: true
    }
  },
  methods: {
    initData () {
      this.drawBar()
      this.drawPie()
    },
    /**
     * @description 柱状图
     */
    drawBar () {
      const { xData, data, title, colorList } = this.data.relationInfo
      let yData = []
      const myChart = this.$echarts.init(document.getElementsByClassName('relation-info')[0])
      for (let key in data) {
        yData.push(data[key])
      }
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,          // 坐标轴两边留白
          barCateGoryGap: 20,
          splitLine: {                // 网格线 x轴对应的是否显示
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 30,
            show: true,
            splitNumber: 15,
            textStyle: {
              //fontFamily: "微软雅黑",
              fontSize: 12,
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          data: xData
        },
        yAxis: {
          name: '数量',
          type: 'value'
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: 18,
            data: yData,
            itemStyle: {
              normal: {
                color: params => {
                  return colorList[params.dataIndex]
                }
              }
            }
          },
        ]
      }
      myChart.setOption(option)
      this.echartsList.push(myChart)
    },
    /**
     * @description 饼图
     */
    drawPie () {
      const { xData, data, title, colorList } = this.data.throughputInfo
      const myChart = this.$echarts.init(document.getElementsByClassName('throughput-info')[0])
      const optionData = xData.map((item, index) => ({
        name: item,
        value: Object.values(data)[index]
      }))
      const option = {
        color: colorList,
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        legend: {
            data: xData
        },
        series: [{
            type: 'pie',
            radius: ['20%', '55%'],
            center: ['50%', '60%'],
            data: data,
            roseType: 'rose',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: optionData
        }]
      }
      myChart.setOption(option)
      this.echartsList.push(myChart)
    }
  }
}
</script>

<style lang='scss' scoped>
#departContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    background-color: #3c8dbc;
    color: #eee;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
  }
  .echarts-box {
    flex: 1;
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      flex-direction: column;
      width: 49%;
      height: 100%;
      p{
        font-size: 14px;
        text-align: center;
        margin-top: 3px;
      }
      >div{
        flex: 1
      }
    }
  }
}
</style>