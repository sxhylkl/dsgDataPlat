<template>
  <div>
      <el-row>
      <el-col :span="24" style="margin-top: 10px">
      <span class="title2">{{entityName}}({{typeName}})</span>
          <el-col :span="24">
              <span>标签:</span>
              <el-tag v-for="(details,index) in entityMessage.entity.classifications" :closable="true" class="tagbtn"  style="margin-top: 10px" type="primary" @close="deleteTag(index)">{{details.typeName}}</el-tag>
              <el-button type="primary" size="mini" style="margin-left: 8px;margin-right: 10px;margin-top: 10px "
                         @click="showTagModal" title="添加标签"><i class="fa fa-plus"></i></el-button>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px">
      <span>术语:</span>
              <el-tag v-for="(details,index) in entityMessage.entity.relationshipAttributes.meanings" :closable="true"  style="margin-top: 10px" class="tagbtn" type="primary" @close="deleteTerm(index)">{{details.displayText}}</el-tag>
              <el-button type="primary" size="mini" style="margin-left: 8px;margin-right: 10px;margin-top: 10px "
                 @click="showTermModal" title="添加术语"><i class="fa fa-plus"></i></el-button>

          </el-col>

      </el-col>
        <el-col>
            <el-tabs type="border-card">
                <el-tab-pane name="0" label="属性">
                    <el-table :data="KeyValue" height="500">
                        <el-table-column prop="key" label="key" align="center" min-width="640">

                        </el-table-column>

                        <el-table-column label="value" align="center" min-width="640">
                            <template scope="scope">
                              <span v-if="!Array.isArray(scope.row.value)">

                                  <span>{{scope.row.value}}</span>
                                  <!--
                                                                    <span v-if="scope.row.value['guid']!==undefined" class="text" @click="rJump(entityMessage.entity.relationshipAttributes[scope.row.key].guid,entityMessage.entity.relationshipAttributes[scope.row.key].displayText)">{{entityMessage.entity.relationshipAttributes[scope.row.key].displayText}}</span>
                                  -->
                              </span>
                                <div v-if="Array.isArray(scope.row.value)" v-for="one in entityMessage.entity.relationshipAttributes[scope.row.key]">
                                    <a class="text" @click="rJump(one.guid,one.displayText)">{{one.displayText}}</a>
                                </div>
                                <!-- <span v-if="scope.row.value===null">null</span>-->
                            </template>

                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="1" label="血统" >
                    <el-col :span="24" v-show="lineAgeIf">
                        <div id="chartBloodline" style="height: 600px;width: 1250px;"></div>
                    </el-col>
                    <el-col :span="24" v-show="!lineAgeIf">
                        <div style="height: 600px;width: 1250px;">
                            <span class="el-table__empty-text" style="top: 40% !important;">找不到血统数据</span>
                        </div>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane name="2" label="关系" >
                    <el-col :span="24" v-show="relationshipIf">
                        <!--关联信息模态框-->
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
                    <!---无关系数据情况-->
                    <el-col :span="24" v-show="!relationshipIf">
                        <div style="height: 600px;width: 1250px;">
                            <span class="el-table__empty-text" style="top: 40% !important;">找不到关系数据</span>
                        </div>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane name="3" label="标签" >
                    <el-table :data="entityMessage.entity.classifications" height="500">
                        <el-table-column prop="typeName" label="标签" align="center" min-width="425">

                        </el-table-column>
                        <el-table-column  label="属性" align="center" min-width="425">
                            <template scope="scope">
                                <el-table :data="scope.row.attributes | filterData" v-if="scope.row.attributes"  :show-header="true" :highlight-current-row="false">
                                    <el-table-column label="key" prop="key" align="center">

                                    </el-table-column>
                                    <el-table-column label="value" prop="value" align="center">

                                    </el-table-column>
                                </el-table>
                                <p v-if="!scope.row.attributes">NA</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation" label="操作" align="center" min-width="425">
                            <template scope="scope">
                                <el-button size="mini" type="danger" @click="deleteTag(scope.$index)"><i class="fa fa-trash"></i></el-button>
                                <el-button size="mini" type="primary" @click="editTag(scope.row)"><i class="fa fa-edit"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane >
                <el-tab-pane name="4" label="审计">
                    <el-table :data="auditMessage" height="500">
                        <el-table-column prop="user" label="用户" min-width="320" >

                        </el-table-column>
                        <el-table-column prop="timestamp" label="时间戳" min-width="320">

                        </el-table-column>
                        <el-table-column prop="action" label="操作" min-width="320">

                        </el-table-column>
                        <el-table-column label="工具" min-width="320">
                            <template scope="scope">
                                <el-button type="primary" size="small" @click="showDetailAudit(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
      </el-row>
      <!--添加标签界面-->
      <el-dialog title="添加标签" :visible.sync="addTagFormVisible" :close-on-click-modal="false">
          <el-form :model="addTagForm.classification" :rules="addTagFormRules" ref="addTagForm">
              <div>
                  <el-form-item prop="typeName">
                      <el-select v-model="addTagForm.classification.typeName" auto-complete="off" @change="tagChange" filterable  placeholder="---从下拉列表中选择一个标签---" style="width: 60%;">
                          <el-option :label="tagOne.name" v-for="(tagOne,index) in tagList2" :value="index" :key="index">

                          </el-option>
                      </el-select>
                      <el-col style="float: right;width: 30%">
                          <el-checkbox label="传播" v-model="addTagForm.classification.propagate"></el-checkbox>
                          <el-checkbox label="应用有效期" style="margin-left: 52px;"
                                       v-model="tagFilterTwo"></el-checkbox>
                      </el-col>
                  </el-form-item>
              </div>
              <br>
              <hr>
              <el-button type="info" style="float: right;margin-bottom: 20px; " size="small" @click="addTimeOne"
                         v-if="addTimeBtn"><i class="fa fa-plus"></i>添加有效期
              </el-button>
              <el-col class="box" :span="24" v-if="addTimeBtn">
                  <el-col class="box2" :span="24" v-for="(timeOne,index) in addTagForm.classification.validityPeriods" :key="index">
                      <el-col :span="7">
                          <el-form-item :prop="'validityPeriods.'+index+'.startTime'" :rules="addTagFormRules.startTime">
                              <el-date-picker v-model="timeOne.startTime" type="datetime" @change="getTime1(index,$event)"  placeholder="开始时间"></el-date-picker>
                          </el-form-item>
                      </el-col>

                      <el-col :span="7">
                          <el-form-item :prop="'validityPeriods.'+index+'.endTime'" :rules="addTagFormRules.endTime">
                              <el-date-picker v-model="timeOne.endTime" type="datetime" @change="getTime2(index,$event)" placeholder="结束时间" style="margin-left: 10px; ;"></el-date-picker>
                          </el-form-item>
                      </el-col>

                      <el-col :span="7">
                          <el-form-item :prop="'validityPeriods.'+index+'.timeZone'" :rules="addTagFormRules.timeZone">
                              <el-select v-model="timeOne.timeZone" placeholder="选择时区" filterable style="margin-left: 10px; ;">
                                  <el-option :value="timeZoneOne" v-for="timeZoneOne in timeZoneList">{{timeZoneOne}}
                                  </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>

                      <el-button icon="el-icon-delete" type="danger" title="删除" @click="deleteTimeOne(index)"
                                 style="margin-left: 20px; ;"></el-button>
                  </el-col>
              </el-col>
              <el-col :span="24" v-if="this.attributeDefsList.length>0">
                  <p>标签属性（可选）</p>

                  <p>添加此标签的属性值</p>
                  <el-form-item v-for="(attributeDefs,index) in attributeDefsList" :label="attributeDefs.name+`(${attributeDefs.typeName})`" prop="attr" :key="index">
                      <el-input v-model="attributesArr[index]"></el-input>
                  </el-form-item>
              </el-col>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click.native="addTagFormVisible = false">取消</el-button>
              <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
          </div>
      </el-dialog>
      <!--添加术语界面-->
      <el-dialog title="将术语分配给实体" :visible.sync="addTermFormVisible" :close-on-click-modal="false">
          <el-input placeholder="搜索字词" v-model="addTermForm.searchWord" style="margin-bottom: 10px"></el-input>
          <el-tree
                  class="filter-tree"
                  :data="addTermForm.data2"
                  :props="addTermForm.defaultProps"
                  :filter-node-method="filterNode"
                  :expand-on-click-node="true"
                  :highlight-current="true"
                  node-key="id"
                  check-strictly
                  @check-change="handleClick"
                  :show-checkbox="true"
                  ref="tree2">
          </el-tree>
          <div slot="footer" class="dialog-footer">
              <el-button @click.native="addTermFormVisible = false">取消</el-button>
              <el-button type="primary" @click.native="giveSubmit" :loading="addLoading">分配</el-button>
          </div>
      </el-dialog>
      <!--审计详情界面-->
      <el-dialog :title="auditTitle" :visible.sync="auditVisible">
          <el-table :data="auditDetails" v-if="showAuditDetails">
              <el-table-column prop="key" label="key">

              </el-table-column>
              <el-table-column prop="value" label="value">

              </el-table-column>
          </el-table>
          <h3 v-if="!showAuditDetails">
              {{auditDeleteMessage}}
          </h3>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="auditVisible = false">确 定</el-button>
          </div>
      </el-dialog>
      <!--编辑标签界面-->
      <el-dialog title="编辑标签" :visible.sync="editTagFormVisible" :close-on-click-modal="false">
          <el-form :model="editTagForm" :rules="editTagFormRules" ref="editTagForm">
              <div>
                  <el-form-item prop="typeName">
                      <span v-model="editTagForm.typeName">{{editTagForm.typeName}}</span>
                      <el-col style="float: right;width: 30%">
                          <el-checkbox label="传播" v-model="editTagForm.propagate"></el-checkbox>
                          <el-checkbox label="应用有效期" style="margin-left: 52px;"
                                       v-model="tagFilterTwo_"></el-checkbox>
                      </el-col>
                  </el-form-item>
              </div>
              <br>
              <hr>
              <el-button type="info" style="float: right;margin-bottom: 20px; " size="small" @click="addTimeOne_"
                         v-if="addTimeBtn_"><i class="fa fa-plus"></i>添加有效期
              </el-button>
              <el-col class="box" :span="24" v-if="addTimeBtn_">
                  <el-col class="box2" :span="24" v-for="(timeOne,index) in editTagForm.validityPeriods" :key="index">
                      <el-col :span="7">
                          <el-form-item :prop="'validityPeriods.'+index+'.startTime'" :rules="editTagFormRules.startTime">
                              <el-date-picker v-model="timeOne.startTime" type="datetime" @change="getTime1_(index,$event)"  placeholder="开始时间"></el-date-picker>
                          </el-form-item>
                      </el-col>

                      <el-col :span="7">
                          <el-form-item :prop="'validityPeriods.'+index+'.endTime'" :rules="editTagFormRules.endTime">
                              <el-date-picker v-model="timeOne.endTime" type="datetime" @change="getTime2_(index,$event)" placeholder="结束时间" style="margin-left: 10px; ;"></el-date-picker>
                          </el-form-item>
                      </el-col>

                      <el-col :span="7">
                          <el-form-item :prop="'validityPeriods.'+index+'.timeZone'" :rules="editTagFormRules.timeZone">
                              <el-select v-model="timeOne.timeZone" placeholder="选择时区" filterable style="margin-left: 10px; ;">
                                  <el-option :value="timeZoneOne" v-for="timeZoneOne in timeZoneList">{{timeZoneOne}}
                                  </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>

                      <el-button icon="el-icon-delete" type="danger" title="删除" @click="deleteTimeOne_(index)"
                                 style="margin-left: 20px; ;"></el-button>
                  </el-col>
              </el-col>
              <el-col :span="24" v-if="this.editTagForm.attributes!==undefined">
                  <p>标签属性（可选）</p>

                  <p>添加此标签的属性值</p>
                  <el-form-item v-for="(value,key) in editTagForm.attributes" :label="key" prop="attr" :key="key">
                      <el-input v-model="editTagForm.attributes[key]"></el-input>
                  </el-form-item>
              </el-col>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click.native="editTagFormVisible = false">取消</el-button>
              <el-button type="primary" @click.native="addSubmit_" :loading="addLoading">提交</el-button>
          </div>
      </el-dialog>



  </div>
</template>

<script>
    import echarts from 'echarts'
    import {getEntityDetails,typedefs,deleteTag,addTag,getTerm,deleteTerm,addTerm,getAuditDetails,lineage,editTag,spliceTerm} from  '../../api/dataSource/api'
    export default {
        data() {
            return {
                activeName:'0',
                //操作汉化
                toChinese:{
                    'TERM_ADD':'添加术语',
                    'CLASSIFICATION_ADD':'添加标签',
                    'CLASSIFICATION_DELETE':'删除标签',
                    'CLASSIFICATION_UPDATE':'修改标签',
                    'ENTITY_CREATE':'创建实体',
                    'ENTITY_UPDATE':'更新实体',
                    'ENTITY_DELETE':'删除实体',
                    'PROPAGATED_CLASSIFICATION_ADD':'添加传播标签',
                    'PROPAGATED_CLASSIFICATION_DELETE':'删除传播标签',

                },
                auditVisible:false,
                i:0,
                //添加标签页面数据
                addTagFormVisible: false,//添加标签模态框是否显示
                //添加术语页面数据
                //添加术语页面
                addTermForm:{
                    searchWord:'',
                    data2: [],
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    },
                },
                addTermFormVisible:false,//添加术语模态框是否显示
                //编辑实体页面数据
                editEntityForm:{
                  typeArr:['Asset','avro_collection'],
                    attributes:[
                        {
                            cardinality: "SINGLE",
                            includeInNotification: false,
                            isIndexable: true,
                            isOptional: false,
                            isUnique: false,
                            name: "type",
                            typeName: "string",
                            valuesMaxCount: 1,
                        },
                        {
                            cardinality: "SINGLE",
                            includeInNotification: false,
                            isIndexable: false,
                            isOptional: false,
                            isUnique: false,
                            name: "items",
                            typeName: "array<string>",
                            valuesMaxCount: 1,
                            valuesMinCount: 1
                        }
                    ]


                },
                editEntityFormVisible:false,//创建实体模态框是否显示
                KeyValue:[],
                //关系图部分
                chartRelationship: null,
                //血统图部分
                chartBloodline:null,
                relationShipModal:false,
                option:{
                    title: {
                        text: '关系关系图'
                    },
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series : [{
                            force: {
                                repulsion: 3000
                            },
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 50,
                            focusNodeAdjacency: true,
                            roam: true,
                            label: {
                                normal: {
                                    show: true,
                                    position:'top'
                                },

                            },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1,
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.3)',
                                color:'#32c5e9'
                            }
                        },
                            edgeSymbol: ['circle', 'arrow'],//节点形状和箭头形状
                            edgeSymbolSize: [4, 6],
                            edgeLabel: {
                                normal: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [],
                            // links: [],
                            links: [],
                        lineStyle: {
                            normal: {
                                opacity: 5,
                                width:2,
                                curveness:0,
                                color:'#8bc152'
                            }
                        }
                        }
                    ],
                },
                option2:{
                    title: {
                        text: '血统关系图'
                    },
                    tooltip: {},
                    animationDurationUpdate: 600,
                    animationEasingUpdate: 'quinticInOut',
                    series : [

                        {
                            force: {
                                repulsion: 800
                            },
                            tooltip:{
                                formatter: function (params) {
                                     console.log(params);
                                     let typeName = params.data.typeName;
                                     let name = params.name.substring(0,60)
                                    name===params.name?name=name:name=name+'...'
                                    if(typeName==='LoadProcess'||typeName.indexOf('process')>-1){
                                        return `<span style="color: #359f89">${name}</span><br>(加载过程)`
                                    }
                                    else if(typeName==='Table'||typeName.indexOf('table')>-1){
                                        return `<span style="color: #359f89">${name}</span><br>(表)`
                                    }
                                    else if(typeName==='Path'||typeName.indexOf('path')>-1){
                                        return `<span style="color: #359f89">${name}</span><br>(路径)`
                                    }

                               /*     for (var i = 0; i < this.option2.series[0].data.length; i++) {
                                        if (this.option2.series[0].data[i].name == params) {
                                            return params
                                        }
                                    }*/
                                }
                            },
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 40,
                            focusNodeAdjacency: true,
                            roam: true,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                }
                            },
                            edgeSymbol: ['circle', 'arrow'],//节点形状和箭头形状
                            edgeSymbolSize: [5,15 ],
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                                    color:'#32c5e9'
                                }
                            },
                            edgeLabel: {
                                normal: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [{
                                name: 'erzi',
                                draggable:true
                            }, {
                                name: 'baba',
                                draggable:true
                            }, {
                                // symbol:'image://static/dataCenter/images/file.png',
                                name: 'nainai',
                                draggable:true
                            }],
                            // links: [],
                            links: [ {
                                source: 'erzi',
                                target: 'baba',
                            }, {
                                source: 'baba',
                                target: 'nainai'
                            }],
                            lineStyle: {
                                normal: {
                                    opacity: 5,
                                    width:2,
                                    curveness:0,
                                    color:'#8bc152'
                                }
                            }
                        }
                    ],
                },
                //实体列表
                entityList:[],
                //实体显示列表
                filterEntityList:[],
                searchName:'',
                MyMar:'',
                series:{
                    name:'',
                },
                //审计表部分
                tag:[],



                typeName:'',
                tagList:[],
                tagList2:[],
                timeZoneList: ["Africa/Abidjan","Africa/Accra","Africa/Algiers","Africa/Bissau","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/El_Aaiun","Africa/Johannesburg","Africa/Juba","Africa/Khartoum","Africa/Lagos","Africa/Maputo","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Asuncion","America/Atikokan","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Cayenne","America/Chicago","America/Chihuahua","America/Costa_Rica","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fort_Wayne","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Inuvik","America/Iqaluit","America/Jamaica","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/La_Paz","America/Lima","America/Los_Angeles","America/Maceio","America/Managua","America/Manaus","America/Martinique","America/Matamoros","America/Mazatlan","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Johns","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kathmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vladivostok","Asia/Yakutsk","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney","CET","CST6CDT","EET","EST","EST5EDT","Etc/GMT+0","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT+8","Etc/GMT+9","Etc/GMT-1","Etc/GMT-13","Etc/GMT-14","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-8","Etc/UCT","Etc/UTC","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Helsinki","Europe/Istanbul","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Lisbon","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/Saratov","Europe/Simferopol","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zaporozhye","Europe/Zurich","HST","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Reunion","MET","MST","MST7MDT","PST8PDT","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","WET"],

                //添加标签页面
                addTagForm: {
                    classification:{
                        typeName: '',
                        attributes:{},
                        propagate: true,
                        validityPeriods: [],
                    },
                    entityGuids:[],
                },
                addLoading:false,
                attributeDefsList:[],
                attributesArr:[],
                tagFilterTwo: false,
                addTimeBtn: false,
                addTagFormRules:{
                    typeName:[{required:true,message:'请选择标签'}],
                    startTime:[{required:true,message:'请输入开始时间'}],
                    endTime:[{required:true,message:'请输入结束时间'}],
                    timeZone:[{required:true,message:'请选择时区'}],
                },
                entityMessage:{"referredEntities":{"cd527d4c-b3ca-47cb-b7d6-05d28b6e36fd":{"typeName":"BJ1_column","attributes":{"owner":null,"isnull":"false","qualifiedName":"tongdaoming123123","name":"id","batch":0,"description":null,"op_type":null,"create_date":1533744000000,"col_type":"int","object_id":"123456789","col_comment":null,"table":{"guid":"00870e56-8c7f-4e43-a465-5e1305146d79","typeName":"BJ1_table"}},"guid":"cd527d4c-b3ca-47cb-b7d6-05d28b6e36fd","status":"DELETED","createdBy":"admin","updatedBy":"admin","createTime":1533749978263,"updateTime":1534287498744,"version":0,"relationshipAttributes":{"schema":[],"inputToProcesses":[],"meanings":[],"table":{"guid":"00870e56-8c7f-4e43-a465-5e1305146d79","typeName":"BJ1_table","displayText":"ML_Iteration567019","relationshipGuid":"6ce31128-3ea8-4b63-9d4b-2190e8320ed4","relationshipStatus":"DELETED","relationshipAttributes":{"typeName":"BJ1_table_columns"}},"outputFromProcesses":[]}}},"entity":{"typeName":"BJ1_table","attributes":{"owner":"tjf","tableType":"0","partition":null,"qualifiedName":"BJ1_table.Channelname001","columns":[{"guid":"cd527d4c-b3ca-47cb-b7d6-05d28b6e36fd","typeName":"BJ1_column"}],"name":"ML_Iteration567019","description":"作为测试的直接通过Json创建","comment":"test,json-create","create_date":1490559613675,"object_id":"123456","status":"SYNC"},"guid":"00870e56-8c7f-4e43-a465-5e1305146d79","status":"DELETED","createdBy":"admin","updatedBy":"admin","createTime":1533749581623,"updateTime":1534983123230,"version":0,"relationshipAttributes":{"schema":[],"inputToProcesses":[],"partition":null,"columns":[{"guid":"cd527d4c-b3ca-47cb-b7d6-05d28b6e36fd","typeName":"BJ1_column","displayText":"id","relationshipGuid":"62218987-f69d-49cb-99d1-e062bd2021b8","relationshipStatus":"DELETED","relationshipAttributes":{"typeName":"BJ1_table_columns"}}],"meanings":[],"outputFromProcesses":[]},"classifications":[]}},
                entityName:'',
                auditMessage:[],
                auditDetails:[],
                showAuditDetails:false,
                auditName:'',
                auditTitle:'',
                auditDeleteMessage:'',
                relationshipIf:false,
                lineAgeIf:false,
                //编辑标签
                editTagFormVisible:false,
                editTagForm:{
                    attributes: {},
                    propagate: true,
                    typeName: "",
                    validityPeriods: []
                },
                editTagFormRules:{
                    startTime:[{required:true,message:'请输入开始时间'}],
                    endTime:[{required:true,message:'请输入结束时间'}],
                    timeZone:[{required:true,message:'请选择时区'}],
                },
                tagFilterTwo_:false,
                addTimeBtn_: false,
               // lineAge:{baseEntityGuid: "995fcdf7-6227-4123-8cc5-78d332cf5eab", guidEntityMap:{}, lineageDepth: 3,lineageDirection: "BOTH", relations: []},//血缘图信息
            }
        },
        watch: {
            'editTagForm.validityPeriods':function (val) {
                if(val.length>0){
                    this.tagFilterTwo_ = true
                }
                else{
                    this.tagFilterTwo_ = false
                }
            },
            'activeName':function(val) { //监听切换状态-计划单
             this.getEntityDetails_();
            },
            '$route'(to,from){
                this.getEntityDetails_();
                this.relationShipModal=false
            },
            entityMessage(){
              let json  = Object.assign({},this.entityMessage.entity.attributes);
              let arr = [];
              for(let key in json){
                  let json2 = {};
                  json2['key'] = key;
                  json2['value'] = json[key];
                  arr.push(json2)
              }
                this.KeyValue = arr
            },
            //监测添加标签模态框应用有效期是否选中
            'tagFilterTwo': function () {
                if (this.tagFilterTwo) {
                    this.addTagForm.classification.validityPeriods = [{'startTime': '', 'endTime': '', 'timeZone': ''}];
                    this.addTimeBtn = true
                }
                else {
                    this.addTagForm.classification.validityPeriods = [];
                    this.addTimeBtn = false
                }
            },
            //监测编辑标签模态框应用有效期是否选中
            'tagFilterTwo_': function (val) {
                if (val) {
                    if(this.editTagForm.validityPeriods.length===0){
                        this.editTagForm.validityPeriods.push({'startTime': '', 'endTime': '', 'timeZone': ''});
                    }
                    this.addTimeBtn_ = true
                }
                else {
                    this.editTagForm.validityPeriods = [];
                    this.addTimeBtn_ = false
                }
            },
            //监测添加标签模态框中应用有效期数组长度
            'addTagForm.classification.validityPeriods':function () {
                if(this.addTagForm.classification.validityPeriods.length===0){
                    this.addTimeBtn = false;
                    this.tagFilterTwo = false
                }
            },
            //检测术语过滤输入框
            'addTermForm.searchWord'(val) {
                this.$refs.tree2.filter(val)
            },
            //搜索实体
            searchName(val){
            this.filterEntityList = this.entityList.filter(function (one) {
                let str = ''
                str = one.displayText +"("+one.typeName+")"
                 if(str.indexOf(val)!==-1){
                     return one
                 }
            })
            }
        },
        filters: {
            filterData(val) {
                let arr = [];
             for(let key in val){
                 let json={};
                 if(val[key]===null)val[key] = ''
                 json['key'] = key;
                 json['value'] = val[key]
                 arr.push(json)
             }
             return arr
            },
        },
        methods: {
            rJump(guid,name){
                if(guid!==this.$route.query.guid){
                    this.$router.push({ path: '/dataSource/detailPage', query: { guid: guid ,name:name}})
                }
            },
            tagChange(val){
                if(typeof(val)==='number'){
                    this.attributeDefsList = this.tagList2[val].attributeDefs
                    this.attributesArr = [];
                }
                else{
                    this.attributeDefsList = []
                }
            },
            //获取实体信息
            getEntityDetails_(){
                getEntityDetails(this.$route.query.guid).then(res=>{
                    this.entityMessage =res;
                    this.entityName = this.$route.query.name
                    this.typeName = this.entityMessage.entity.typeName
                    //表数据添加
                    let relationship = Object.assign({},res.entity.relationshipAttributes);
                    let data = [];
                    let link = [];
                    data.push({name:this.typeName,draggable:true, itemStyle: {normal: {color: '#1984c7'}},symbol:'image://static/dataCenter/images/file4.png'})
                    for(let key in relationship){
                        if(relationship[key]&&relationship[key].length!==0){
                            data.push({name:key,draggable:true,symbol:'image://static/dataCenter/images/file3.png'})
                            link.push({source:this.typeName,target:key})
                        }
                    }
                    this.option.series[0].data  = data
                    this.option.series[0].links  = link
                    if(data.length>0){
                        this.drawRelationshipChart()
                        this.showModal()
                        this.relationshipIf = true
                    }
                    else{
                        this.relationshipIf = false
                    }

                })
                this.getLineAge()
                this.getAudit()
            },
            //审计数据获取
            getAudit(){
                let params = {guid:this.$route.query.guid,count:0}
               getAuditDetails(params).then(res=>{
                   let arr = [...res]
                   let newArr = arr.map((one)=>{
                       one.timestamp =new Date(one.timestamp).toLocaleString()
                       if(this.toChinese[one.action]){
                           one.action = this.toChinese[one.action]
                       }
                       return one;
                   })
                   this.auditMessage = newArr;

               })
            },
            //审计详情
            showDetailAudit(details){
                this.auditVisible = true;
                let action = details.action
                this.auditTitle = action
                if(details.details.indexOf('{')>-1){
                    this.showAuditDetails = true
                    let details_ = JSON.parse(details.details.substring(details.details.indexOf('{'),details.details.lastIndexOf('}')+1))
                    this.auditName = details_.typeName
                    let newArr = []
                    for(let key in details_){
                            let json = {};
                            let value = details_[key];
                            if(key==='attributes'||key==='relationshipAttributes')value=JSON.stringify(value)
                            json['key'] = key;
                            json['value'] = value.toString()
                            newArr.push(json)
                    }
                    this.auditDetails = newArr
                }
                else{
                    this.showAuditDetails = false
                    this.auditDeleteMessage = details.details
                }

            },
            //标签获取
            getTag:function () {
                var this_ = this;
                typedefs({type:'classification'}).then((res)=>{
                    let data = res;
                    let classificationDefs = data.classificationDefs;
                    this_.tagList= classificationDefs
                    this_.tagList2= classificationDefs
                })
            },
            //删除标签
            deleteTag:function (index) {
                let that = this
                this.$confirm('是否删除该标签?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    let param = {guid:that.$route.query.guid,tagName:that.entityMessage.entity.classifications[index].typeName};
                    deleteTag(param).then(res=>{
                        that.entityMessage.entity.classifications.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //编辑标签
            editTag:function (row) {
                delete this.editTagForm.attributes
                this.editTagForm = Object.assign(this.editTagForm,row)
                this.editTagFormVisible = true
            },
            //术语获取
            getTerm:function () {
                var this_ = this;
                getTerm().then((res)=>{
                    let data = spliceTerm(res);
                    let arr=[]
                    //数据处理
                    for(let value of data){
                        let json = {};
                        let guid = value.guid;
                        let name = value.name;
                        json['id'] = guid;
                        json['label'] = name;
                        json['disabled'] = true
                        let arr2 = [];
                        for(let key in value.terms){
                            let json2 = {};
                            let displayText = value.terms[key].displayText;
                            let termGuid = value.terms[key].termGuid;
                            json2['id'] = termGuid;
                            json2['label']= displayText;
                            arr2.push(json2)
                        }
                        json['children'] = arr2
                        arr.push(json)
                    }
                    this_.addTermForm.data2 = arr
                })
            },
            handleClick(data,checked, node) {
                this.i++;
                if(this.i%2==0){
                    if(checked){
                        this.$refs.tree2.setCheckedNodes([]);
                        this.$refs.tree2.setCheckedNodes([data]);
                        //交叉点击节点
                    }else{
                        this.$refs.tree2.setCheckedNodes([]);
                        //点击已经选中的节点，置空
                    }
                }
            },
            //分配术语
            giveSubmit:function () {
                let guidList = this.$refs.tree2.getCheckedKeys();
                let arr = [];
                let params = {
                    pguid :guidList[0],
                    guid:[{guid:this.$route.query.guid}]
                }
                this.addTermFormVisible = false
                addTerm(params).then((res)=>{
                    this.$message({
                        type:'success',
                        message:'分配成功'
                    })
                    this.getEntityDetails_()
                }).catch(err=>{
                    this.$message({
                        type:'error',
                        message:'分配失败'
                    })
                })
            },
            //删除术语
            deleteTerm:function (index) {
                let that = this
                this.$confirm('是否删除该术语?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    let params = {guid:[{guid:that.$route.query.guid,relationshipGuid:that.entityMessage.entity.relationshipAttributes.meanings[index].relationshipGuid}],termid:that.entityMessage.entity.relationshipAttributes.meanings[index].guid};
                    deleteTerm(params).then(res=>{
                        that.entityMessage.entity.relationshipAttributes.meanings.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err=>{
                        this.listLoading = false;
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //获取血统图信息
            getLineAge:function(){
             let params = this.$route.query.guid
             lineage(params).then(res=>{
                 //表数据添加
                 let lineAge = Object.assign({},res);
                 let data = [];
                 let link = [];
                 if(lineAge['relations'].length!==0){
                     for(let key in lineAge['guidEntityMap']){
                          let symbol;
                          let typeName = lineAge['guidEntityMap'][key]['typeName']
                          if(typeName==='Table'||typeName.indexOf('table')>-1&&key!==this.$route.query.guid){
                              symbol ='image://./static/dataCenter/images/icon-table.png'
                          }
                          else if(typeName==='LoadProcess'||typeName.indexOf('process')>-1){
                             symbol ='image://./static/dataCenter/images/icon-gear.png'
                          }
                          else if(typeName==='Table'||typeName.indexOf('table')>-1&&key===this.$route.query.guid){
                              symbol ='image://./static/dataCenter/images/icon-table-active.png'
                          }
                          else{
                              symbol= 'image://./static/dataCenter/images/icon-table.png'
                          }
                         let name = lineAge['guidEntityMap'][key]['displayText'].substring(0,20)
                         name===lineAge['guidEntityMap'][key]['displayText']?name=name:name=name+'...'
                         data.push({name:name,draggable:true,id:lineAge['guidEntityMap'][key]['guid'],symbol:symbol,typeName:typeName})
                     }
                     for(let value of lineAge['relations']){
                        let source =  value['fromEntityId']
                        let target =  value['toEntityId']
                        let json = {source:source,target:target}
                        link.push(json)
                     }
                     this.option2.series[0].data  = data
                     this.option2.series[0].links  = link

                     this.drawBloodlineChart()
                     this.showModal2()
                     this.lineAgeIf = true
                 }
                 else{
                     this.lineAgeIf = false
                 }
             })
            },







            //显示添加标签模态框
            showTagModal: function () {
                this.addTagFormVisible = true;
                this.addTagForm.classification.validityPeriods = [];
                this.addTagForm.classification.propagate=true;
                this.addTimeBtn = false;
                this.tagFilterTwo=false;
                this.addTagForm.classification.typeName='';
                this.addTagForm.entityGuids = [this.$route.query.guid]
                if(this.entityMessage.entity.classifications){
                    var tag2 = this.entityMessage.entity.classifications.map((one)=>one.typeName)
                    var tag1 =  this.tagList.slice(0)
                    var newArr = []
                    for(let key1=0;key1<tag1.length;key1++){
                        for(let key2=0;key2<tag2.length;key2++){
                            if(tag1[key1].name===tag2[key2]){
                                newArr.push(tag2[key2])
                            }
                        }
                    }
                    for(let value of newArr){
                        tag1.splice(tag1.findIndex(item=>item.name===value),1)
                    }
                    this.tagList2 = tag1
                }


            },
            getTime1(index,val){
                this.addTagForm.classification.validityPeriods[index].startTime = val
            },
            getTime2(index,val){
                this.addTagForm.classification.validityPeriods[index].endTime = val
            },
            getTime1_(index,val){
                val = val.replace(/\-/g,'/')
                this.editTagForm.validityPeriods[index].startTime = val
            },
            getTime2_(index,val){
                val = val.replace(/\-/g,'/')
                this.editTagForm.validityPeriods[index].endTime = val
            },
            //添加一个有效期
            addTimeOne: function () {
                this.addTagForm.classification.validityPeriods.push({'startTime': '', 'endTime': '', 'timeZone': ''})
            },
            //删除一个有效期
            deleteTimeOne: function (index) {
                this.addTagForm.classification.validityPeriods.splice(index,1)
            },
            //添加一个有效期
            addTimeOne_: function () {
                this.editTagForm.validityPeriods.push({'startTime': '', 'endTime': '', 'timeZone': ''})
            },
            //删除一个有效期
            deleteTimeOne_: function (index) {
                this.editTagForm.validityPeriods.splice(index,1)
            },
            //新增
            addSubmit: function () {
                var this_ = this
                this.$refs['addTagForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let params = this_.addTagForm;
                            params.classification.typeName = this_.tagList2[this_.addTagForm.classification.typeName].name
                            for(let key in this_.attributeDefsList){
                                this_.addTagForm.classification.attributes[this_.attributeDefsList[key].name] =  this_.attributesArr[key]
                            }
                            addTag(params).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '添加标签成功',
                                    type: 'success'
                                });
                                this.addTagFormVisible = false;
                                this.getEntityDetails_();
                            }).catch(err=>{
                                this.$notify.error({
                                    title:'错误',
                                    message:'接口报错',
                                })
                                this.addTagFormVisible = false;
                                this.addLoading = false;
                            });
                        });
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //编辑标签
            addSubmit_: function () {
                var this_ = this
                this.$refs['editTagForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let params = Object.assign({},this_.editTagForm);
                            let entityGuid = params.entityGuid
                            delete params['entityGuid']
                            let params_ = {entityGuid:entityGuid,main:params}

                            editTag(params_).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '编辑标签成功',
                                    type: 'success'
                                });
                                this.editTagFormVisible = false;
                                this.getEntityDetails_();
                            }).catch(err=>{
                                this.$notify.error({
                                    title:'错误',
                                    message:'接口报错',
                                })
                                this.editTagFormVisible = false;
                                this.addLoading = false;
                            });
                        });
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //显示添加术语页面
            showTermModal:function () {
                this.addTermFormVisible = true
            },
            //
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //显示编辑实体界面
            editEntityModal:function () {
                this.editEntityFormVisible = true
            },
            //关系图
            drawRelationshipChart() {
                this.chartRelationship = echarts.init(document.getElementById('chartRelationship'));
                this.chartRelationship.setOption(this.option);
                /* this.chartRelationship.dispatchAction({
                     type:'focusNodeAdjacency',
                     dataIndex: [0,1,2,3,4],
                 })*/ //使节点高亮

            },
            drawBloodlineChart(){
              this.chartBloodline = echarts.init(document.getElementById('chartBloodline'));
              this.chartBloodline.setOption(this.option2)
            },
            //点击关系图节点事件
            showModal(){
                let this_ = this
                this.chartRelationship.on('click', function (params) {
                    this_.series.name = params.name
                    this_.relationShipModal = true
                    if(this_.typeName===params.name){
                        let arr = [{typeName:this_.typeName,displayText:this_.entityName,guid:this_.$route.query.guid}]
                        this_.entityList =arr
                        this_.filterEntityList = arr
                    }
                    else{
                        let relationship = Object.assign({},this_.entityMessage['entity']['relationshipAttributes'])
                        let arr = relationship[params.name]
                        if(arr){
                            if(arr.length===undefined){
                                arr = [arr]
                                this_.entityList =arr
                                this_.filterEntityList = arr
                            }
                            else{
                                this_.entityList =arr
                                this_.filterEntityList = arr
                            }
                        }


                    }

                });
            },
            //
            //双击血统图节点事件
            showModal2(){
                let this_ = this
                this.chartBloodline.on('dblclick', function (params) {
                    this_.$router.push({ path: '/dataSource/detailPage', query: { guid: params.data.id ,name:params.name}})
                });
            },
        },
        mounted() {
            this.getEntityDetails_()
            this.getTag()
            this.getTerm()


        },
    }

</script>



<style scoped="">
    [v-cloak] {
        display: none !important;
    }
    .input{
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
        color: #38bb9b
    }

    a:hover {
        color: #337ab7;
        text-decoration: underline
    }

    .title2 {
        font-size: 30px;
        font-weight: 700;
        color: #475669
    }
    .box-card{
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
    .el-card__body{
        padding: 10px 0px 10px 0px !important;
        max-height: 170px;
        overflow: auto;
    }
</style>
