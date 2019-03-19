<template>
  <div>
    <el-row>
      <el-col :span="24" v-show="lineAgeIf">
        <div id="chartBloodline" style="height:800px;width: 100%;"></div>
        <ul
          class="el-dropdown-menu el-popper"
          id="dropdown-menu"
          x-placement="bottom-end"
          style="display: none"
        >
          <li tabindex="-1" class="el-dropdown-menu__item" @click="before" v-show="!showPd">上卷</li>
          <li tabindex="-1" class="el-dropdown-menu__item" @click="next" v-show="showPd">下拽</li>
          <!-- <li tabindex="-1" class="el-dropdown-menu__item" @click="details">详情</li> -->
          <div x-arrow class="popper__arrow" style="left: 40px;"></div>
        </ul>
      </el-col>
      <el-col :span="24" v-show="!lineAgeIf">
        <div style="height: 600px;width: 1250px;">
          <span class="el-table__empty-text" style="top: 40% !important;">找不到血统数据</span>
        </div>
      </el-col>
      <!--<el-col>
        <el-tabs type="border-card">
          <el-tab-pane name="1" label="血统" >

          </el-tab-pane>
          <el-tab-pane name="2" label="关系" >
            <el-col :span="24" v-show="relationshipIf">
              &lt;!&ndash;关联信息模态框&ndash;&gt;
              <el-dialog :title="series.name" :visible.sync="relationShipModal" :close-on-click-modal="true"   :modal-append-to-body="false" >
                <el-form>
                  <el-input v-model="searchName" placeholder="搜索实体"></el-input>
                </el-form>
                <el-card class="box-card">
                  <div v-for="(o,index) in filterEntityList" :key="o.guid" class="item">
                    {{index+1}}.<span  class="text" @click="rJump(o.guid,o.displayText)">{{o.displayText}}({{o.typeName}})</span>
                  </div>
                </el-card>
              </el-dialog>
              <div id="chartRelationship" style="height: 600px;width: 1250px;"></div>
            </el-col>
            &lt;!&ndash;-无关系数据情况&ndash;&gt;
            <el-col :span="24" v-show="!relationshipIf">
              <div style="height: 600px;width: 1250px;">
                <span class="el-table__empty-text" style="top: 40% !important;">找不到关系数据</span>
              </div>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import { GetAllRoot, GetNextLevel, GetAllChildren } from '@/api/sug/blood'
import { dataResp } from '@/utils/dataResp'
export default {
  data () {
    return {
      //血统图部分
      lineAgeIf: true,
      chartBloodline: null,
      option2: {
        title: {
          text: '血缘关系图'
        },
        tooltip: {},
        animation: false,
        // animationDurationUpdate: 10, //数据更新动画的时长
        // animationEasingUpdate: 'quinticInOut',//数据更新动画的缓动效果
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        cursor: 'pointer',
        series: [
          {
            force: {
              repulsion: 1500, //斥力因子
              //layoutAnimation:false , //是否显示布局动画

            },
            tooltip: {
              formatter: (params) => {
                let typeName;
                params.data.type === 'ROOT' ? typeName = this.typeTarget2[params.data.id].name : typeName = this.typeTarget2[params.data.type].name
                let name = params.name.substring(0, 60)
                name === params.name ? name = name : name = name + '...'
                return `<span style="color: rgb(64, 158, 255)">${name}</span><br>(${typeName})`
              }
            },//鼠标划过节点显示信息
            type: 'graph',
            layout: 'force',
            draggable: true,//节点是否能被拖拽
            symbolSize: 50,//图标大小设置
            focusNodeAdjacency: true,
            roam: true,
            label: {
              normal: {
                color: 'rgb(64, 158, 255)',//头部字体颜色rgb(64, 158, 255)
                show: true,
                position: 'top',
              }
            },
            edgeSymbol: ['circle', 'arrow'],//节点形状和箭头形状
            lineStyle: {
              normal: {
                opacity: 5,
                width: 2,
                curveness: 0,
                color: '#CC3333' //连线颜色black
              }
            },
            edgeSymbolSize: [5, 7], //节点大小
            itemStyle: {
              normal: {
                borderColor: '#000000',//外边框颜色#3c8dbc
                borderWidth: 5,//外边框宽度
                shadowBlur: 10,//
                shadowColor: '#000000', //节点外阴影颜色#3c8dbc
                color: '#000000' //节点颜色#32c5e9
              }
            },
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20
                }
              }
            },

            /*  symbol ='image://./static/dataCenter/images/icon-table.png'
            }
          else if(typeName==='LoadProcess'||typeName.indexOf('process')>-1){
        symbol ='image://./static/dataCenter/images/icon-gear.png'
      }
    else if(typeName==='Table'||typeName.indexOf('table')>-1&&key===this.$route.query.guid){
        symbol ='image://./static/dataCenter/images/icon-table-active.png'*/
            data: [],
            // links: [],
            links: [],
          }
        ],
      },
      departmentObj: [
        /*{
          symbol:'image://static/dataCenter/images/bloodImg/department.png',
          name: '二级部门-1',
          type:'department',
          id:"2-1",
          children:[
            {
              symbol:'image://static/dataCenter/images/bloodImg/department.png',
              name: '三级部门-1',
              id:"2-1-1",
              type:'department',
            },
            {
              symbol:'image://static/dataCenter/images/bloodImg/department.png',
              name: '三级部门-2',
              id:"2-1-2",
              type:'department',
            }
          ]
        },
        {
          symbol:'image://static/dataCenter/images/bloodImg/department.png',
          name: '二级部门-2',
          id:"2-2",
          type:'department',
          children:[
            {
              symbol:'image://static/dataCenter/images/bloodImg/department.png',
              name: '三级部门-3',
              id:"2-2-1",
              type:'department',
            },
            {
              symbol:'image://static/dataCenter/images/bloodImg/department.png',
              name: '三级部门-4',
              id:"2-2-2",
              type:'department',
            }
          ]
        }*/
      ],
      chooseNode: {},//右键选择的节点具体信息
      typeTarget: {
        TASK: { name: '任务', symbol: 'image://./static/dataCenter/images/bloodImg/task.png' },
        DEPARTMENT: { name: '部门', symbol: 'image://static/dataCenter/images/bloodImg/department.png' },
        BUSINESS: { name: '业务', symbol: 'image://./static/dataCenter/images/bloodImg/business.png' },
        SUBJECT: { name: '主题', symbol: 'image://./static/dataCenter/images/bloodImg/subject.png' },
        RULE: { name: '规则', symbol: 'image://./static/dataCenter/images/bloodImg/rule.png' },
        DATASOURCE: { name: '数据源', symbol: 'image://./static/dataCenter/images/bloodImg/dataSource.png' },
        STANDARD: { name: '标准', symbol: 'image://./static/dataCenter/images/bloodImg/standard.png' },
        STANDARDTAB: { name: '标准表', symbol: 'image://./static/dataCenter/images/bloodImg/standardTable.png' },
        MODEL: { name: '模型', symbol: 'image://./static/dataCenter/images/bloodImg/model.png' },
        MODELTAB: { name: '模型表', symbol: 'image://./static/dataCenter/images/bloodImg/modelTable.png' },
        BASE: { name: '基础', symbol: 'image://./static/dataCenter/images/bloodImg/base.png' },
        BASETAB: { name: '基础表', symbol: 'image://./static/dataCenter/images/bloodImg/baseTable.png' },
        COLLECTIONFLOW: { name: '采集流程', symbol: 'image://./static/dataCenter/images/bloodImg/collect.png' },
        TRANSFORMATIONFLOW: { name: '转换流程', symbol: 'image://./static/dataCenter/images/bloodImg/transform.png' },
        SERVICETAB: { name: '服务表', symbol: 'image://./static/dataCenter/images/bloodImg/service.png' },
      },
      typeTarget2: {
        TASK: { name: '任务', symbol: 'image://./static/dataCenter/images/bloodImg2/task.png' },
        DEPARTMENT: { name: '部门', symbol: 'image://static/dataCenter/images/bloodImg2/department.png' },
        BUSINESS: { name: '业务', symbol: 'image://./static/dataCenter/images/bloodImg2/business.png' },
        SUBJECT: { name: '主题', symbol: 'image://./static/dataCenter/images/bloodImg2/subject.png' },
        RULE: { name: '规则', symbol: 'image://./static/dataCenter/images/bloodImg2/rule.png' },
        DATASOURCE: { name: '数据源', symbol: 'image://./static/dataCenter/images/bloodImg2/dataSource.png' },
        STANDARD: { name: '标准', symbol: 'image://./static/dataCenter/images/bloodImg2/standard.png' },
        STANDARDTAB: { name: '标准表', symbol: 'image://./static/dataCenter/images/bloodImg2/standardTable.png' },
        MODEL: { name: '模型', symbol: 'image://./static/dataCenter/images/bloodImg2/model.png' },
        MODELTAB: { name: '模型表', symbol: 'image://./static/dataCenter/images/bloodImg2/modelTable.png' },
        BASE: { name: '基础', symbol: 'image://./static/dataCenter/images/bloodImg2/base.png' },
        BASETAB: { name: '基础表', symbol: 'image://./static/dataCenter/images/bloodImg2/baseTable.png' },
        COLLECTIONFLOW: { name: '采集流程', symbol: 'image://./static/dataCenter/images/bloodImg2/collect.png' },
        TRANSFORMATIONFLOW: { name: '转换流程', symbol: 'image://./static/dataCenter/images/bloodImg2/transform.png' },
        SERVICETAB: { name: '服务表', symbol: 'image://./static/dataCenter/images/bloodImg2/service.png' },
      },
      showPd: true,//判断子节点数组是否为0
    }
  },
  methods: {
    //类型转symbol
    typeToSymbol (str) {
      switch (str) { }
    },
    //获取血缘第一层信息
    getLevelOne () {
      GetAllRoot().then(data => {
        dataResp(data, () => {
          data.data.map(one => {
            let newObj = { id: one.uuid, name: one.name, type: one.type, symbol: this.typeTarget2[one.uuid].symbol, symbolSize: 70, type: one.type }
            this.option2.series[0].data.push(newObj)
          })
          this.chartBloodline.setOption(this.option2)
        })
      })
    },
    drawBloodlineChart () {
      this.chartBloodline = echarts.init(document.getElementById('chartBloodline'));
      this.chartBloodline.setOption(this.option2)
      this.chartEvent()
    },
    //上卷或者下卷响应事件
    dblCkick (params) {
      GetNextLevel(params.data.id).then(data => {
        dataResp(data, () => {
          let typeTranslate = { HAVE: '拥有', HAVED: '拥有', USE: '使用', USED: '使用' }
          let arrData = []
          let arrLink = []
          //数据获取links 和 data
          for (let key in data.data) {
            data.data[key].map(one => {
              //data注入
              arrData.push(Object.assign(one, { id: one.uuid, symbol: this.typeTarget2[one.type].symbol, symbolSize: 50, type: one.type }))
              //links注入
              data.data[key].map(one => {
                if (one.parUuid === params.data.id) {
                  if (key.indexOf('ED') > -1) arrLink.push({ target: one.parUuid, source: one.uuid, label: { normal: { show: true, formatter: typeTranslate[key], fontWeight: 'normal', fontSize: 12 } } })//typeTranslate[key]
                  else {
                    arrLink.push({ target: one.uuid, source: one.parUuid, label: { normal: { show: true, formatter: typeTranslate[key], fontWeight: 'normal', fontSize: 12 } } })//连线上信息样式
                  }
                }
                else {
                  if (key.indexOf('ED') > -1) arrLink.push({ target: params.data.id, source: one.uuid, label: { normal: { show: true, formatter: typeTranslate[key], fontWeight: 'normal', fontSize: 12 } } })//typeTranslate[key]
                  else {
                    arrLink.push({ target: one.uuid, source: params.data.id, label: { normal: { show: true, formatter: typeTranslate[key], fontWeight: 'normal', fontSize: 12 } } })//连线上信息样式
                  }

                }

              })
            })
          }
          //判断是否有子节点
          if (arrData.length === 0) {
            this.$message({
              type: 'info',
              message: '该节点下没有子节点'
            })
          }
          //有子节点情况
          else {
            let sign = 0;
            let startData = [...this.option2.series[0].data]
            let startLink = [...this.option2.series[0].links]
            startData.map(one => {
              arrData.map((test, index) => {
                if (one.id === test.id) {
                  sign = 1;
                  // startLink.map(el => {
                  //   if ((el.source === one.id && el.target === params.data.id) || (el.target === params.data.id && el.source === one.id)) {
                  //     sign = 2
                  //     arrData.splice(index, 1)
                  //   }
                  // })

                }
              })
            })
            console.log(`sign${sign}`)

            //有子节点且不存在与界面上(直接注入)
            if (sign === 0 || sign === 2) {
              this.option2.series[0].data = [...this.option2.series[0].data.concat(arrData)]
              this.option2.series[0].links = [...this.option2.series[0].links.concat(arrLink)]
              this.chartBloodline.setOption(this.option2)
            }
            //有子节点切已经但存在与界面上
            else if (sign === 1) {
              //该子节点已有连线(遍历存在节点和link从数组中splice)

              GetAllChildren(params.data.id).then(data => {
                dataResp(data, () => {
                  let sign_ = 0
                  data.data.map(one => {
                    this.option2.series[0].data.map((two, index) => {
                      if (one.uuid === two.id) {
                        //this.option2.series[0].data.splice(index, 1)
                        // startLink.map(el => {
                        //   if (el.source === one.uuid || el.target === one.uuid) {
                        //     // this.option2.series[0].data.splice(index, 1)
                        //     sign_ = 1
                        //   }
                        //   else {
                        //     // sign_ = 1
                        //     console.log(111111111111111111)
                        //     // this.dblCkick(params)
                        //   }
                        // })
                        this.option2.series[0].data.splice(index, 1)
                      }
                    })
                  })
                  console.log(sign_)
                  this.chartBloodline.setOption(this.option2)
                  // if (sign_ === 0) this.dblCkick(params)
                })
              })
            }

          }
        })
      })
    },
    //判断右击上卷或者下卷时是否显示
    showNR (params) {
      GetNextLevel(params.data.id).then(data => {
        dataResp(data, () => {
          let arrData = []
          //数据获取links 和 data
          for (let key in data.data) {
            data.data[key].map(one => {
              //data注入
              arrData.push(Object.assign(one, { id: one.uuid, symbol: this.typeTarget2[one.type].symbol, symbolSize: 50, type: one.type }))
            })
          }
          //sign 为1 当前有子节点 下拽操作隐藏 sign 为0 当前无子节点 上卷操作隐藏
          let sign = 0;
          this.option2.series[0].data.map(one => {
            arrData.map(two => {
              if (one.id === two.id) {
                sign = 1;
              }
            })
          })
          sign === 0 ? this.showPd = true : this.showPd = false
          let menu = document.getElementById('dropdown-menu')
          menu.style.left = params.event.offsetX - 35 + `px`
          menu.style.top = params.event.offsetY + `px`
          menu.style.display = 'block'
        })
      })
    },
    //图形事件配置
    chartEvent () {
      //双击血统图节点事件
      this.chartBloodline.on('dblclick', params => {
        this.dblCkick(params)
      });

      let chartBox = document.getElementById('chartBloodline');

      chartBox.oncontextmenu = function () { return false; }; //阻止浏览器指定区域的右键默认事件

      //右击显示选择框
      this.chartBloodline.on('contextmenu', (params) => {
        console.log(params)
        this.showNR(params)

        this.chooseNode = params
      });
      this.outHide()
    },
    //选择框默认移出屏蔽
    outHide () {
      document.getElementById('dropdown-menu').onmouseout = function () {
        this.style.display = 'none'
      }
      document.getElementById('dropdown-menu').onmouseover = function () {
        this.style.display = 'block'
      }
    },
    //上卷
    before () {
      this.dblCkick(this.chooseNode)
    },
    next () {
      this.dblCkick(this.chooseNode)
    },
    details () {
      alert('查看详情')
    },
    //获取第二层与第三层
    getLevelOneT () {
      this.departmentObj.map(one => {
        this.option2.series[0].links.push({ source: '2', target: one.id })
        this.option2.series[0].data.push(one)
        one.children.map(two => {
          this.option2.series[0].links.push({ source: one.id, target: two.id })
          this.option2.series[0].data.push(two)
        })
        this.chartBloodline.setOption(this.option2)
        // this.chartEvent()
      })
    }
  },
  mounted () {
    this.drawBloodlineChart()
    this.getLevelOne()
  },
}

</script>



<style scoped="">
[v-cloak] {
  display: none !important;
}
.input {
  width: 250px;
}
.box {
  border: 1px solid #eaeefb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.box2 {
  padding: 10px 15px 0px 15px;
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eee;
}

.pz {
  margin-top: 4px;
  margin-right: 11px;
  margin-left: 8px !important;
}

.addbtn {
  margin-left: 2px !important;
}

.tagbtn {
  margin-left: 8px !important;
  cursor: pointer;
}

a {
  text-decoration: none;
  cursor: pointer;
  color: #38bb9b;
}

a:hover {
  color: #337ab7;
  text-decoration: underline;
}

.title2 {
  font-size: 30px;
  font-weight: 700;
  color: #475669;
}
.box-card {
  padding: 0px 0px !important;
}
.text {
  font-size: 14px;
  cursor: pointer;
  color: #2c8aff;
}
.text:hover {
  text-decoration: underline;
}
.item {
  padding: 5px 0px;
}
.el-card__body {
  padding: 10px 0px 10px 0px !important;
  max-height: 170px;
  overflow: auto;
}
</style>
