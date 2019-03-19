<template>
  <div id="sourceContainer">
    <div class="header">{{data.title}}（数据源类型：{{data.total}}）</div>
    <div class="echarts-box">
      <div>
        <p>{{data.sourceInfo.title}}</p>
        <div :class="data.sourceInfo.className" v-loading="data.sourceInfo.loading"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
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
      this.drawBar(this.data.sourceInfo)
    },
    /**
     * @description 柱状图
     * @param objInfo { object } 信息对象
     */
    drawBar (objInfo) {
      const { xData, data, className, colorList } = objInfo
      let yData = []
      const myChart = this.$echarts.init(document.getElementsByClassName(className)[0])
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
            name:'数量',
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
  }
}
</script>

<style lang='scss' scoped>
#sourceContainer {
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
      width: 100%;
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