<template>
  <div id="themeContainer">
    <div class="header">{{data.title}}（主题数：{{data.total}}）</div>
    <div class="echarts-box">
      <div>
        <p>{{data.themeInfo.title}}</p>
        <div class="theme-info" v-loading="data.themeInfo.loading"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "theme",
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
      this.drawPie()
    },
    /**
     * @description 饼图
     */
    drawPie () {
      const { xData, data, title, colorList } = this.data.themeInfo
      const myChart = this.$echarts.init(document.getElementsByClassName('theme-info')[0])
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
#themeContainer {
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