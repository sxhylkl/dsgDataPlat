<template>
  <div v-loading="saveloading">
    <el-button
      type="success"
      style="margin-bottom: 14px;"
      icon="el-icon-edit"
      :disabled="newProdSecond"
      @click="newProdClick"
    >新建版本</el-button>
    <el-collapse v-model="activeNameCollapse" accordion>
      <div v-for="(prod,index) in prodArr">
        <el-collapse-item :title="prod.name" @click.native="getVersionId(prod)">
          <!--@click.native="getVersionProd(prod,index)"-->
          <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick(prod)">
            <el-tab-pane label="生产环境" name="first">
              <div>
                <div style="margin-bottom:20px;">
                  <!-- v-model="taskPrams.standard_list" -->
                  <el-form>
                    <el-form-item label-width="30" label="标准选择">
                      <el-select
                        clearable
                        value-key="id"
                        style="margin-right:10px;"
                        placeholder="请选择标准"
                        v-model="categoryDetails"
                        @change="showHide()"
                        :disabled="standardV"
                      >
                        <el-option
                          v-for="(item,index) in taskParams.standard_list"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        ></el-option>
                      </el-select>
                      <el-select
                        value-key="id"
                        clearable
                        style="margin-right:10px;"
                        @change="showHide()"
                        placeholder="请选择模型"
                        :disabled="modelV"
                        v-model="my.model"
                      >
                        <el-option
                          v-for="(item,index) in taskParams.model_list"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        ></el-option>
                      </el-select>

                      <el-button
                        type="primary"
                        icon="el-icon-edit"
                        @click="newVersionFeed(prod)"
                        :disabled="noColumns"
                      >构建查询</el-button>
                    </el-form-item>
                  </el-form>

                  <el-button
                    type="info"
                    icon="el-icon-edit"
                    @click="clickSchedule(prod)"
                    v-if="isSchedule"
                  >任务调度</el-button>
                  <el-button
                    type="warning"
                    @click="toFeedList(prod)"
                    :disabled="noColumns"
                    style="float: right;"
                    v-if="isSchedule"
                  >跳转至流程</el-button>
                  <div class="text item" v-if="isSchedule">
                    <el-row class="editRowStyle">
                      <el-col :span="6">策略：</el-col>
                      <el-col :span="12">{{saveFeedCopy.schedule.schedulingStrategy}}</el-col>
                    </el-row>
                    <el-row class="editRowStyle">
                      <el-col :span="6">周期：</el-col>
                      <el-col :span="12">{{saveFeedCopy.schedule.schedulingPeriod}}</el-col>
                    </el-row>
                  </div>
                </div>
                <!--计划-->
                <el-dialog
                  title="任务调度"
                  :visible.sync="dialogScheduleVisible"
                  width="50%"
                  append-to-body
                >
                  <div class="definedFeedmain">
                    <el-form :inline="true" :model="feedVersionInfo" class="demo-form-inline">
                      <el-form-item label="策略">
                        <el-select
                          v-model="feedVersionInfo.schedule.schedulingStrategy"
                          placeholder="请选择"
                          @change="onScheduleStrategyChange()"
                        >
                          <el-option
                            v-for="item in allScheduleStrategies"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <!--timer-->
                      <el-form-item label="运行计划" v-if="isTimer">
                        <el-input-number
                          v-model="timerAmount"
                          controls-position="right"
                          @change="handleTimerChange"
                          :min="1"
                          :max="10"
                        ></el-input-number>
                      </el-form-item>
                      <el-form-item label="运行单位" v-if="isTimer">
                        <el-select
                          v-model="timerUnits"
                          placeholder="请选择"
                          @change="handleTimerChange()"
                        >
                          <el-option
                            v-for="item in schemaTime"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                          ></el-option>
                        </el-select>
                      </el-form-item>

                      <!--cron-->
                      <el-form-item label="cron表达式" v-if="isCron">
                        <el-input v-model="feedVersionInfo.schedule.schedulingPeriod"></el-input>
                      </el-form-item>
                      <el-form-item label="cron预览" v-if="isCron">
                        <ul class="crolUl">
                          <li v-for="item in cronExpression">{{item}}</li>
                        </ul>
                      </el-form-item>
                    </el-form>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelSchedule()">取 消</el-button>
                    <el-button type="primary" @click="saveSchedule()">保存</el-button>
                  </span>
                </el-dialog>

                <div>
                  <el-row>
                    <el-col :span="12">
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>标准字段</span>
                          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                        </div>
                        <div>
                          <el-table
                            :data="categoryDetails.columns"
                            style="width: 100%;height:400px;overflow: scroll"
                          >
                            <el-table-column prop="name_en" label="英文编码" width="180"></el-table-column>
                            <el-table-column prop="name_cn" label="中文名称" width="180"></el-table-column>
                            <el-table-column prop="description" label="字段含义"></el-table-column>
                          </el-table>
                        </div>
                      </el-card>
                    </el-col>
                    <el-col :span="12">
                      <el-card class="box-card" v-if="saveSuccess">
                        <div slot="header" class="clearfix">
                          <span>流程字段</span>
                          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                        </div>
                        <div v-loading="feedLoading">
                          <!-- v-loading="testLoading" -->
                          <el-table
                            :data="prod.comparedCol"
                            style="width: 100%;height:400px;overflow: scroll"
                          >
                            <el-table-column prop="nameEN" label="英文编码" width="180"></el-table-column>
                            <el-table-column prop="nameCN" label="中文名称" width="180"></el-table-column>
                            <el-table-column prop="description" label="字段含义"></el-table-column>
                            <!--<el-table-column>
                                  <template slot="header" slot-scope="scope"  v-if="prod.comparedCol.nameEN!==''">
                                    <el-tooltip class="item" effect="dark" content="跳转至该流程详情" placement="left-end">
                                      <el-button type="success">跳转</el-button>
                                    </el-tooltip>
                                  </template>
                                  <template slot-scope="scope">
                                  </template>
                            </el-table-column>-->
                          </el-table>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-dialog title="新建版本" :visible.sync="dialogFormVisible" append-to-body>
                <el-form>
                  <el-form-item label="版本名称">
                    <el-input v-model="newPeodPostJson.name"></el-input>
                  </el-form-item>
                  <el-form-item label="版本系统名称">
                    <el-input v-model="newPeodPostJson.systemName" disabled></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="postSencondTo()">确 定</el-button>
                </div>
              </el-dialog>
              <el-dialog title="构建查询" :visible.sync="dialogVisible" width="80%" append-to-body id='getSearch'>
                <div>
                  <el-form>
                    <div v-show="step1">
                      <my-visualization
                        @getVirData="nextPost"
                        :nextShow="nextShow"
                        :beforeShow="beforeShow"
                        :dataBaseArr="Type"
                      ></my-visualization>
                    </div>
                    <el-row :gutter="20" v-if="step3">
                      <el-col>
                        <el-button type="info" @click="goToStep2" style="margin-bottom:10px">上一步</el-button>
                        <el-form ref="testForm" :model="feedForm" label-width="130px">
                           <!-- :rules="formRule.rule1" -->
                          <el-form-item label="流程显示名" prop="name">
                            <el-input v-model="feedForm.name"></el-input>
                          </el-form-item>
                          <el-form-item label="流程系统名" prop="systemName" >
                            <el-input v-model="feedForm.systemName" disabled></el-input>
                          </el-form-item>
                          <el-form-item
                            label="数据库名"
                            prop="dsgProperties.interface.targetDbName"
                          >
                            <el-input v-model="feedForm.dsgProperties.interface.targetDbName"></el-input>
                            <span style="color:red">数据库名只支持英文加下划线</span>
                          </el-form-item>
                          <el-form-item
                            label="hive 表名"
                            prop="dsgProperties.interface.targetTableName"
                          >
                            <el-input v-model="feedForm.dsgProperties.interface.targetTableName"></el-input>
                            <span style="color:red">hive 表名只支持英文加下划线</span>
                          </el-form-item>
                        </el-form>

                        <el-table :data="feedForm.table.fieldPolicies" stripe style="width: 100%">
                          <el-table-column prop="name" label="字段名" width="180"></el-table-column>
                          <el-table-column>
                            <template slot-scope="scope" slot="header">
                              <el-checkbox
                                v-model="checkAllIndex"
                                @change="handleCheckAllChangeIndex"
                              ></el-checkbox>
                              <span>索引</span>
                            </template>
                            <template slot-scope="scope">
                              <el-checkbox
                                v-model="scope.row.index"
                                @change="handleCheckItemChange"
                              ></el-checkbox>
                            </template>
                          </el-table-column>

                          <el-table-column>
                            <template slot-scope="scope" slot="header">
                              <el-checkbox
                                v-model="checkAllProfile"
                                @change="handleCheckAllChangeProfile"
                              ></el-checkbox>
                              <span>配置文件</span>
                            </template>
                            <template slot-scope="scope">
                              <el-checkbox
                                v-model="scope.row.profile"
                                @change="handleCheckItemChangeProfile"
                              ></el-checkbox>
                            </template>
                          </el-table-column>

                          <el-table-column label="选择标准字段">
                            <template slot-scope="scope">
                              <el-select
                                v-model="scope.row.nameEN"
                                filterable
                                placeholder="请选择"
                                @change="onStandarChange"
                              >
                                <el-option
                                  v-for="item in standardColumnArr"
                                  :key="item.name_en"
                                  :label="item.name_en | tolower"
                                  :value="item.name_en"
                                  :selected="item.name_en === scope.row.name"
                                ></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column prop="createdTracker" label="标准化&验证">
                            <template slot-scope="scope">
                              <el-button
                                type="primary"
                                icon="el-icon-plus"
                                circle
                                @click="openRule(scope.row)"
                              ></el-button>
                              <el-dialog
                                :title="fieldName"
                                :visible.sync="dialogRule"
                                width="45%"
                                append-to-body
                              >
                                <!--标准化已添加的规则-->
                                <!--<div v-if="radio=='1'&&standerData.length>0">-->
                                <div class="ruleBox">
                                  <el-row v-for="(item,index) in policyRules">
                                    <el-col :span="19">
                                      <span class="cont">1-{{index+1}}. {{item.type}}</span>
                                      <span>{{item.type | translate}}</span>
                                    </el-col>
                                    <el-col
                                      :span="5"
                                      style="text-align: right;color: grey; font-size: 16px;"
                                    >
                                      <!--<el-button type="text" icon="el-icon-edit" @click="editData('1',index)"></el-button>-->
                                      <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        @click="deletePolicyByIndex(index)"
                                      ></el-button>
                                    </el-col>
                                  </el-row>
                                </div>
                                <!--</div>-->
                                <!--验证已添加的规则-->
                                <h3>添加一项新的配置</h3>
                                <div class="t-radio">
                                  <el-radio-group
                                    v-model="selectedOptionType"
                                    @change="onChangedOptionType"
                                  >
                                    <!--(optionType.type)-->
                                    <el-radio
                                      v-for="optionType in optionTypes"
                                      :value="optionType.type"
                                      :label="optionType.name"
                                    >{{optionType.name | translate}}</el-radio>
                                  </el-radio-group>
                                </div>
                                <!--验证-->
                                <div>
                                  <!-- v-if="radiotest=='2'"-->
                                  <el-form
                                    ref="form"
                                    :model="verifyForm"
                                    label-position="top"
                                    size="medium"
                                  >
                                    <el-form-item label="选择规则类型">
                                      <el-select
                                        v-model="ruleType"
                                        placeholder="请选择"
                                        value-key="name"
                                        @change="onRuleTypeChange"
                                      >
                                        <!-- @change="onRuleTypeChange"-->
                                        <el-option
                                          v-for="item in options"
                                          :key="item.name"
                                          :label="item.displayName | translate"
                                          :value="item"
                                        ></el-option>
                                      </el-select>
                                    </el-form-item>
                                    <div v-if="ifEditRules">
                                      <div v-for="group in editRule.groups">
                                        <div
                                          v-for="property in group.properties"
                                          v-if="property.hidden == false"
                                        >
                                          <div
                                            v-if="property.type == 'number' || property.type =='string' || property.type == 'regex' || property.type == 'select' || property.type == 'feedSelect' || property.type == 'email' || property.type == 'emails' || property.type == 'currentFeed'  || property.type =='velocityTemplate' "
                                          >
                                            <p>{{property.displayName | translate}}</p>
                                            <el-input
                                              v-model="property.value"
                                              type="number"
                                              v-if="property.type == 'number'"
                                              @change="onPropertyChanged(property)"
                                            ></el-input>
                                            <el-input
                                              v-model="property.value"
                                              v-if="property.type == 'email'"
                                              @change="onPropertyChanged(property)"
                                            ></el-input>
                                            <el-input
                                              v-model="property.value"
                                              v-if="property.type == 'emails'"
                                              @change="onPropertyChanged(property)"
                                            ></el-input>
                                            <el-input
                                              v-model="property.value"
                                              v-if="property.type == 'string' || property.type =='regex'"
                                              @change="onPropertyChanged(property)"
                                            ></el-input>
                                            <el-select
                                              v-model="property.value"
                                              @change="onPropertyChanged(property)"
                                              v-if="(property.type == 'select' || property.type == 'feedSelect' || property.type == 'currentFeed' || property.type =='velocityTemplate' )"
                                            >
                                              <el-option
                                                v-for="value in property.selectableValues"
                                                :key="value.value"
                                                :label="value.label"
                                                :value="value.value"
                                              ></el-option>
                                            </el-select>

                                            <div
                                              v-if="property.errorMessage"
                                              class="hint"
                                            >{{property.errorMessage}}</div>
                                            <div
                                              v-if="property.hint"
                                              class="hint"
                                            >{{property.hint | translate}}</div>
                                          </div>
                                          <div v-if="property.type == 'cron'">
                                            <label>{{property.displayName | translate}}</label>
                                            <el-input
                                              v-model="property.value"
                                              @change="onPropertyChanged(property)"
                                            ></el-input>
                                            <div
                                              v-if="property.hint"
                                              class="hint"
                                            >{{property.hint | translate}}</div>
                                          </div>
                                          <div v-if="property.type == 'regex'">
                                            <span>
                                              <!--Test your Regex Pattern-->
                                              测试你的正则表达式
                                            </span>
                                            <div>
                                              <label>
                                                <!--Sample String-->
                                                示例字符串
                                              </label>
                                              <el-input
                                                v-model="property.regexSampleString"
                                                placeholder="请输入内容"
                                              ></el-input>
                                            </div>
                                            <div>{{property.regexValid}}</div>
                                          </div>
                                        </div>

                                        <!--<div v-if="property.type == 'date' ">
                                                <md-datepicker name="{{property.formKey}}" ng-required="property.required" ng-if="property.type == 'date' " ng-model="property.value" md-placeholder="property.placeholder"
                                                               ng-disabled="!vm.rule.editable" ng-change="vm.onPropertyChanged(property)">
                                                </md-datepicker>
                                                <div ng-if="property.hint && property.type == 'date' " class="hint">
                                                    {{property.hint | translate}}
                                                </div>
                                        </div>-->
                                        <!--<div v-if="property.type == 'regex'">
                                                <span>&lt;!&ndash;Test your Regex Pattern&ndash;&gt;测试你的正则表达式</span>
                                                <div >
                                                    <label>&lt;!&ndash;Sample String&ndash;&gt;示例字符串</label>
                                                    <el-input v-model="property.regexSampleString" placeholder="请输入内容"></el-input>
                                                </div>
                                                <div>
                                                    {{property.regexValid}}
                                                </div>
                                        </div>-->
                                        <!--<div v-if="property.type == 'chips' || property.type == 'feedChips'">
                                                <div>
                                                    <label>{{property.displayName}}</label>
                                                    <md-chips name="{{property.formKey}}" ng-model="property.values" md-autocomplete-snap md-on-add="vm.validateRequiredChips(property)"
                                                              md-on-remove="vm.validateRequiredChips(property) "
                                                              md-transform-chip="vm.transformChip($chip)"
                                                              md-require-match="true" >
                                                        <md-autocomplete
                                                            md-selected-item="vm.editChips.selectedItem"
                                                            md-search-text="vm.editChips.searchText"
                                                            md-items="item in vm.queryChipSearch(property,vm.editChips.searchText)"
                                                            md-item-text="item.label"
                                                            md-min-length="0"
                                                            placeholder="{{property.placeholder | translate}}"
                                                            ng-disabled="!vm.rule.editable">
                                                            <span md-highlight-text="editChips.searchText">{{item.label}}</span>
                                                        </md-autocomplete>
                                                        <md-chip-template>
                    <span>
                      <strong>{{$chip.label}}</strong>
                    </span>
                                                        </md-chip-template>
                                                    </md-chips>
                                                    <div ng-if="property.hint" class="hint">
                                                        {{property.hint | translate}}
                                                    </div>
                                                    <div ng-messages="vm.theForm[property.formKey].$error " ng-if="property.invalid == true" md-auto-hide="false">
                                                        <div ng-message="required">&lt;!&ndash;This field is required.&ndash;&gt;必填字段</div>
                                                    </div>
                                                </div>
                                        </div>-->
                                      </div>
                                    </div>
                                  </el-form>
                                </div>
                                <div>
                                  <!--  <el-button type="text" @click="cancelStanderRule" class="cancel">取消添加</el-button>-->
                                  <el-button
                                    v-if="!isEditData"
                                    type="text"
                                    @click="addPolicy()"
                                    class="add"
                                  >添加规则</el-button>
                                  <!-- <el-button v-if="isEditData" type="text" style="float: right" @click="saveEditData" class="add">保存编辑</el-button>-->
                                </div>
                                <div style="text-align: right">
                                  <el-button
                                    class="cancel"
                                    type="text"
                                    @click="dialogRule =false"
                                  >取消</el-button>
                                  <el-button class="complete" type="text" @click="doneRule()">完成</el-button>
                                </div>
                              </el-dialog>
                              <span
                                v-if="(scope.row.standardization != null && scope.row.standardization.length >0 || scope.row.validation != null && scope.row.validation.length >0)"
                                style="padding-left:15px; white-space: nowrap;float:right"
                              >
                                <span
                                  v-if="scope.row.standardization != null && scope.row.standardization.length >0"
                                >
                                  {{scope.row.standardization.length}}
                                  <!--Standardizers-->
                                  标准
                                </span>
                                <span
                                  v-if="scope.row.validation != null && scope.row.validation.length >0"
                                >
                                  {{scope.row.validation.length}}
                                  <!--Validators-->
                                  验证
                                </span>
                              </span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button
                    type="primary"
                    @click.native="saveFeedVersion(prod)"
                    :disabled=" isEqualLength || canSureDo"
                  >确 定</el-button>
                  <!--dialogVisible = false-->
                  <!-- canSureDo   -->
                </span>
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="测试环境" name="second">
              <div style="margin-bottom: 20px;">
                <el-button type="success" @click="createTest(prod)">创建测试</el-button>
                <el-button type="primary" @click="testFeed(prod)" v-if="prod.isCreateTestFeed">构建查询</el-button>
                <el-button
                  type="info"
                  icon="el-icon-edit"
                  @click="clickSchedule(prod)"
                  v-if="isTestSchedule"
                >任务调度</el-button>
                <el-button
                  type="warning"
                  @click="toFeedTestList"
                  :disabled="noColumns"
                  style="float: right;"
                  v-if="isTestSchedule"
                >跳转至流程</el-button>
                <div class="text item" v-if="isTestSchedule">
                  <el-row class="editRowStyle">
                    <el-col :span="6">策略：</el-col>
                    <el-col :span="12">{{saveTestFeedCopy.schedule.schedulingStrategy}}</el-col>
                  </el-row>
                  <el-row class="editRowStyle">
                    <el-col :span="6">周期：</el-col>
                    <el-col :span="12">{{saveTestFeedCopy.schedule.schedulingPeriod}}</el-col>
                  </el-row>
                </div>
                <!--this.$router.push({path:'/flowManage/feedsList'});-->
              </div>
              <div v-if="prod.isCreateTestFeed">
                <el-row>
                  <el-col :span="12">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>标准字段</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                      </div>
                      <div>
                        <el-table
                          :data="categoryDetails.columns"
                          style="width: 100%;height:400px;overflow: scroll"
                        >
                          <el-table-column prop="nameEN" label="英文编码" width="180"></el-table-column>
                          <el-table-column prop="nameCN" label="中文名称" width="180"></el-table-column>
                          <el-table-column prop="description" label="字段含义"></el-table-column>
                        </el-table>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="12">
                    <el-card class="box-card" v-if="saveSuccess">
                      <div slot="header" class="clearfix">
                        <span>流程字段</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                      </div>
                      <div>
                        <el-table
                          :data="prod.comparedColTest"
                          style="width: 100%;height:400px;overflow: scroll"
                        >
                          <el-table-column prop="nameEN" label="英文编码" width="180"></el-table-column>
                          <el-table-column prop="nameCN" label="中文名称" width="180"></el-table-column>
                          <el-table-column prop="description" label="字段含义"></el-table-column>
                          <!--<el-table-column>
                                <template slot="header" slot-scope="scope" v-if="prod.comparedColTest.length!==0">
                                  <el-tooltip class="item" effect="dark" content="跳转至该流程详情" placement="left-end">
                                    <el-button type="success">跳转</el-button>
                                  </el-tooltip>
                                </template>
                                <template slot-scope="scope">

                                </template>
                          </el-table-column>-->
                        </el-table>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </div>
    </el-collapse>

    <!--聚合函数-->
    <el-dialog :title="filterPz[0].name" :visible.sync="filterPz[0].visible">
      <el-form ref="dialog0" :model="filterPz[0].form">
        <!--设置分组的列-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置分组的列(groupBy)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[0].form.columnsArr.push({value:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[0].form.columnsArr">
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item :prop="`columnsArr.${index}.value`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.value" style="width:100%;">
                  <el-option v-for="two in resultColums" :label="two.key" :value="two.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[0].form.columnsArr.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!--设置聚合的函数-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置聚合的函数</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[0].form.aggArr.push({addType:'count',columns:'',otherName:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[0].form.aggArr">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item :prop="`aggArr.${index}.addType`" :rules="rules.required">
                <el-select v-model="one.addType" style="width:100%;">
                  <el-option v-for="two in aggArr" :label="two" :value="two"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :prop="`aggArr.${index}.columns`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.columns" style="width:100%;">
                  <el-option v-for="two in resultColums" :label="two.key" :value="two.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :prop="`aggArr.${index}.otherName`" :rules="rules.otherName">
                <el-input
                  v-model="one.otherName"
                  placeholder="请输入别名(不能输入中文和特殊符号)"
                  style="width:100%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[0].form.aggArr.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[0].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="filterPz[0].visible = false">取 消</el-button>
        <el-button type="primary" @click.native="filterPzSubmit(0)">确 定</el-button>
      </span>
    </el-dialog>

    <!--条件函数-->
    <el-dialog :title="filterPz[1].name" :visible.sync="filterPz[1].visible">
      <el-form ref="dialog1" :model="filterPz[1].form">
        <!--设置when条件-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置什么条件，取什么值(when)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[1].form.when.push({key:'',value:'',row:'',sign:'>',num:5})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>
        <template v-for="(one,index) in filterPz[1].form.when">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-col :span="8">
                <el-form-item :prop="`when.${index}.row`" :rules="rules.required">
                  <el-select placeholder="选择列" style="width: 100%" v-model="one.row">
                    <el-option v-for="one in resultColums" :label="one.key" :value="one.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :prop="`when.${index}.sign`" :rules="rules.required">
                  <el-select placeholder="选择符号" style="width: 100%" v-model="one.sign">
                    <el-option v-for="one in signArr" :label="one" :value="one"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :prop="`when.${index}.num`" :rules="rules.required">
                  <el-input placeholder="输入值" style="width: 100%" type="number" v-model="one.num"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="`when.${index}.value`" :rules="rules.required">
                <el-input placeholder="请输入值" v-model="one.value" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[1].form.when.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!--设置默认条件的取值(otherwise)-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="设置默认条件的取值(otherwise)" prop="otherwise" :rules="rules.required">
              <el-input placeholder="请输入值" v-model="filterPz[1].form.otherwise"></el-input>
            </el-form-item>
          </el-col>
          <!--设置新加列的别名-->
          <el-col :span="24">
            <el-form-item label="设置新加列的别名(as)" prop="as" :rules="rules.otherName">
              <el-input placeholder="请输入值(不允许中文)" v-model="filterPz[1].form.as"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[1].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="filterPzSubmit(1)">确 定</el-button>
      </span>
    </el-dialog>

    <!--透视聚合函数-->
    <el-dialog :title="filterPz[2].name" :visible.sync="filterPz[2].visible">
      <el-form ref="dialog2" :model="filterPz[2].form">
        <!--设置分组的列(groupBy)-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置分组的列(groupBy)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[2].form.groupBy.push({value:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[2].form.groupBy">
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item :prop="`groupBy.${index}.value`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.value" style="width:100%;">
                  <el-option v-for="two in resultColums" :label="two.key" :value="two.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[2].form.groupBy.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!--设置要应用行转列的字段(pivot)-->
        <el-row :gutter="20">
          <el-col :span="24">
            <h3>设置要应用行转列的字段(pivot)</h3>
          </el-col>
          <el-col :span="22">
            <el-form-item prop="pivot" :rules="rules.required">
              <el-select placeholder="请选择列" v-model="filterPz[2].form.pivot" style="width: 100%;">
                <el-option v-for="one in resultColums" :label="one.key" :value="one.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--设置行转列后列取值使用的聚合函数(agg)-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置行转列后列取值使用的聚合函数(agg)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[2].form.aggArr.push({addType:'count',columns:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[2].form.aggArr">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item :prop="`aggArr.${index}.addType`" :rules="rules.required">
                <el-select placeholder="请选择类型" v-model="one.addType" style="width:100%;">
                  <el-option v-for="two in aggArr" :label="two" :value="two"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="`aggArr.${index}.columns`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.columns" style="width:100%;">
                  <el-option v-for="two in resultColums" :label="two.key" :value="two.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[2].form.aggArr.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[2].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="filterPz[2].visible = false">取 消</el-button>
        <el-button type="primary" @click.native="filterPzSubmit(2)">确 定</el-button>
      </span>
    </el-dialog>

    <!--窗口函数-->
    <el-dialog :title="filterPz[3].name" :visible.sync="filterPz[3].visible">
      <el-form ref="dialog3" :model="filterPz[3].form">
        <!--设置新加列的取值(sum)-->
        <el-row :gutter="20">
          <h3>设置新加列的取值({{filterPz[3].form.sum.key}})</h3>
          <el-col :span="11">
            <el-form-item prop="sum.key" :rules="rules.required">
              <el-select v-model="filterPz[3].form.sum.key" style="width: 100%">
                <el-option v-for="one in aggArr" :label="one" :value="one"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="sum.value" :rules="rules.required">
              <el-select v-model="filterPz[3].form.sum.value" style="width: 100%">
                <el-option v-for="one in resultColums" :label="one.key" :value="one.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--设置新加列窗口条件(over)-->
        <el-row :gutter="20">
          <h3>设置新加列的窗口条件(over)</h3>
          <el-col :span="11">
            <el-form-item prop="over.key" :rules="rules.required">
              <el-select v-model="filterPz[3].form.over.key" style="width: 100%">
                <el-option label="orderBy" value="orderBy"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="over.value" :rules="rules.required">
              <el-select v-model="filterPz[3].form.over.value" style="width: 100%">
                <el-option v-for="one in resultColums" :label="one.key" :value="one.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--设置新加列的别名(as)-->
        <el-row :gutter="20">
          <h3>设置新加列的别名(as)</h3>
          <el-col :span="24">
            <el-form-item prop="as" :rules="rules.otherName">
              <el-input v-model="filterPz[3].form.as" placeholder="请输入别名(不能输入中文和特殊符号)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[3].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="filterPz[3].visible = false">取 消</el-button>
        <el-button type="primary" @click.native="filterPzSubmit(3)">确 定</el-button>
      </span>
    </el-dialog>
    <!--历史-->
    <el-dialog title="函数历史" :visible.sync="historyVisible">
      <h3 v-for="one in historySQL">{{one}}}</h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyVisible=false">取 消</el-button>
        <el-button type="primary" @click="historyVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { datasourceTable, datasource, getCategoriesForVersion, postProdVersion, postProdVersionChild, getFeedValidation, getFeedStandardization, getTransformTemplateId, getTemplateOne, saveFeed, createTestFeed, getStandarFeed, getCronExpression } from '../../api/dataLake/api'

/******可视化******/
import { transform, getUserDatasource, getHiveTables, baseInfo, transform2 } from '../../api/dataLake/api'
import jsplumb from 'jsplumb'
import { translateJsonData } from '../../utils/translate'
import myVisualization from './visualization'

export default {
  components: {
    myVisualization
  },
  data () {
    var validOtherName = (rule, value, callback) => {
      let reg = /[a-zA-Z]\w*/
      if (!(reg.test(value) || value === '')) {
        callback(new Error('不能输入中文和特殊符号且不能为数字开头'));
      }
      else {
        callback()
      }
    };
    var validOtherName2 = (rule, value, callback) => {
      let reg = /[a-zA-z]*_*/
      if ((!reg.test(value) || value === '')) {
        callback(new Error('只支持英文加下划线且不能为空'));
      }
      else {
        callback()
      }
    };
    return {
      formRule: {
        rule1: [
          {
            validator: validOtherName2, trigger: 'blur'
          }
        ]
      },
      my: {
        model: {}
      },
      standardV: false,
      modelV: false,

      transformData: null,
      standardChoosed: null,
      taskParams: {},
      isEqualLength: true,
      nextShow: true,
      beforeShow: false,
      //判断治理流程字段不匹配



      /*计划*/
      allScheduleStrategies: [
        { label: "Timer", value: "TIMER_DRIVEN" }, { label: "Cron", value: "CRON_DRIVEN" }],  /*, {label: "Trigger/Event", value: "TRIGGER_DRIVEN"},
                    {label: "On primary node", value: "PRIMARY_NODE_ONLY"}*/
      scheduleStrategies: [],
      timerAmount: 5,
      timerUnits: 'min',
      schemaTime: [{ value: 'hrs', label: '小时' }, { value: 'days', label: '天' }, { value: 'min', label: '分钟' }, { value: 'sec', label: '秒' }],
      cronExpression: [],
      isTimer: false,
      isCron: true,
      DEFAULT_CRON: "0 0 12 1/1 * ? *",
      dialogScheduleVisible: false,
      isSchedule: false,
      isTestSchedule: false,
      saveFeedCopy: {},
      saveTestFeedCopy: {},
      showFeedCopy: {
        id: null,
        versionName: null,
        templateId: '',
        templateName: "",
        feedName: '',
        description: '',
        systemFeedName: '',
        inputProcessorType: '',
        inputProcessorName: null,
        /* inputProcessorType: "org.apache.nifi.processors.standard.GetFile",
         inputProcessorName: "Filesystem",*/
        /* inputProcessor: null,
         nonInputProcessors: [],*/
        inputProcessor: null,
        nonInputProcessors: [],
        properties: [],
        securityGroups: [],
        schedule: { schedulingPeriod: '0 0 12 1/1 * ? *', schedulingStrategy: 'CRON_DRIVEN', concurrentTasks: 1 },
        defineTable: false,
        allowPreconditions: false,
        dataTransformationFeed: false,
        table: {
          tableSchema: { name: null, fields: [] },
          sourceTableSchema: { name: null, tableSchema: null, fields: [] },
          feedTableSchema: { name: null, fields: [] },
          method: 'SAMPLE_FILE',
          existingTableName: null,
          structured: false,
          targetMergeStrategy: 'DEDUPE_AND_MERGE',
          feedFormat: 'ROW FORMAT SERDE \'org.apache.hadoop.hive.serde2.OpenCSVSerde\''
            + ' WITH SERDEPROPERTIES ( \'separatorChar\' = \',\' ,\'escapeChar\' = \'\\\\\' ,\'quoteChar\' = \'"\')'
            + ' STORED AS TEXTFILE',
          targetFormat: null,
          fieldPolicies: [],
          partitions: [],
          options: { compress: false, compressionFormat: null, auditLogging: true, encrypt: false, trackHistory: false },
          sourceTableIncrementalDateField: null
        },
        category: { id: null, name: null, systemName: null },
        dataOwner: '',
        tags: [],
        reusableFeed: false,
        dataTransformation: {
          chartViewModel: {
            nodes: null,
            connections: null,
          },
          datasourceIds: [],
          datasources: null,
          dataTransformScript: null,
          sql: null,
          states: []
        },
        userProperties: [],
        options: { skipHeader: false },
        active: false,
        roleMemberships: [],
        owner: null,
        roleMembershipsUpdated: false,
        tableOption: {},
        cloned: false,
        usedByFeeds: [],
        view: {
          generalInfo: { disabled: false },
          feedDetails: { disabled: false },
          table: { disabled: false },
          dataPolicies: { disabled: false },
          properties: {
            disabled: false,
            dataOwner: { disabled: false },
            tags: { disabled: false }
          },
          accessControl: { disabled: false },
          schedule: {
            disabled: false,
            schedulingPeriod: { disabled: false },
            schedulingStrategy: { disabled: false },
            active: { disabled: false },
            executionNode: { disabled: false },
            preconditions: { disabled: false }
          }
        },
        dsgProperties: {
          "to_es": {},
          "features": {
            "toJdbc": false,
            "isToEs": false,
            "toHbaseDsg": false
          },
          "common": {
            "fileType": "CSV",
            "avro-schema": "{\"type\":\"record\",\"name\":\"subtest01.z\",\"fields\":[{\"name\":\"registration_dttm\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"id\",\"type\":[\"int\",\"null\"],\"default\":null},{\"name\":\"first_name\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"last_name\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"email\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"gender\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"ip_address\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"cc\",\"type\":[\"double\",\"null\"],\"default\":null},{\"name\":\"country\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"birthdate\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"salary\",\"type\":[\"double\",\"null\"],\"default\":null},{\"name\":\"title\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"comments\",\"type\":[\"string\",\"null\"],\"default\":\"\"}]}"
          },
          "to-jdbc": {},
          "to_hbase": {}
        }
      },
      /*计划*/

      /*判断是否是测试环境*/
      isTest: false,
      isProd: false,

      secondfeedId: "",
      testSecondFeedId: "",
      datasourceIds: [],
      checkedRes: [],
      arrPP: [],
      activeName: 'first',
      activeNameCollapse: '1',
      versionName: 'V1',
      prodArr: [],
      parentId: "",
      isSencond: false,
      newProdSecond: true,
      newPeodPostJson: { name: '', systemName: '' },
      dialogFormVisible: false,
      categoryDetails: {
      },
      dialogVisible: false,
      originalTableFields: [],
      isTip: true,
      testLoading: false,
      feedVersionInfo: {
        id: null,
        versionName: null,
        templateId: '',
        templateName: "",
        feedName: '',
        description: '',
        systemFeedName: '',
        inputProcessorType: '',
        inputProcessorName: null,
        /* inputProcessorType: "org.apache.nifi.processors.standard.GetFile",
         inputProcessorName: "Filesystem",*/
        /* inputProcessor: null,
         nonInputProcessors: [],*/
        inputProcessor: null,
        nonInputProcessors: [],
        properties: [],
        securityGroups: [],
        schedule: { schedulingPeriod: '0 0 12 1/1 * ? *', schedulingStrategy: 'CRON_DRIVEN', concurrentTasks: 1 },
        defineTable: false,
        allowPreconditions: false,
        dataTransformationFeed: false,
        table: {
          tableSchema: { name: null, fields: [] },
          sourceTableSchema: { name: null, tableSchema: null, fields: [] },
          feedTableSchema: { name: null, fields: [] },
          method: 'SAMPLE_FILE',
          existingTableName: null,
          structured: false,
          targetMergeStrategy: 'DEDUPE_AND_MERGE',
          feedFormat: 'ROW FORMAT SERDE \'org.apache.hadoop.hive.serde2.OpenCSVSerde\''
            + ' WITH SERDEPROPERTIES ( \'separatorChar\' = \',\' ,\'escapeChar\' = \'\\\\\' ,\'quoteChar\' = \'"\')'
            + ' STORED AS TEXTFILE',
          targetFormat: null,
          fieldPolicies: [],
          partitions: [],
          options: { compress: false, compressionFormat: null, auditLogging: true, encrypt: false, trackHistory: false },
          sourceTableIncrementalDateField: null
        },
        category: { id: null, name: null, systemName: null },
        dataOwner: '',
        tags: [],
        reusableFeed: false,
        dataTransformation: {
          chartViewModel: {
            nodes: null,
            connections: null,
          },
          datasourceIds: [],
          datasources: null,
          dataTransformScript: null,
          sql: null,
          states: []
        },
        userProperties: [],
        options: { skipHeader: false },
        active: false,
        roleMemberships: [],
        owner: null,
        roleMembershipsUpdated: false,
        tableOption: {},
        cloned: false,
        usedByFeeds: [],
        view: {
          generalInfo: { disabled: false },
          feedDetails: { disabled: false },
          table: { disabled: false },
          dataPolicies: { disabled: false },
          properties: {
            disabled: false,
            dataOwner: { disabled: false },
            tags: { disabled: false }
          },
          accessControl: { disabled: false },
          schedule: {
            disabled: false,
            schedulingPeriod: { disabled: false },
            schedulingStrategy: { disabled: false },
            active: { disabled: false },
            executionNode: { disabled: false },
            preconditions: { disabled: false }
          }
        },
        dsgProperties: {
          "to_es": {},
          "features": {
            "toJdbc": false,
            "isToEs": false,
            "toHbaseDsg": false
          },
          "common": {
            "fileType": "CSV",
            "avro-schema": "{\"type\":\"record\",\"name\":\"subtest01.z\",\"fields\":[{\"name\":\"registration_dttm\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"id\",\"type\":[\"int\",\"null\"],\"default\":null},{\"name\":\"first_name\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"last_name\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"email\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"gender\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"ip_address\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"cc\",\"type\":[\"double\",\"null\"],\"default\":null},{\"name\":\"country\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"birthdate\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"salary\",\"type\":[\"double\",\"null\"],\"default\":null},{\"name\":\"title\",\"type\":[\"string\",\"null\"],\"default\":\"\"},{\"name\":\"comments\",\"type\":[\"string\",\"null\"],\"default\":\"\"}]}"
          },
          "to-jdbc": {},
          "to_hbase": {}
        }
      },


      jsPlumbPz: {
        Connector: ["Flowchart", { curviness: 50 }],//连线类型，有直线，折线等，我这只用直线
        DragOptions: { cursor: "pointer", zIndex: 2000 },//拖动的时候
        PaintStyle: { strokeStyle: '#E8C870', lineWidth: 2 },
        EndpointStyle: { radius: 5, fillStyle: '#E8C870' },
        HoverPaintStyle: { strokeStyle: "#7073EB" },
        EndpointHoverStyle: { fillStyle: "#7073EB" },
        ConnectionOverlays: [
          ["Label", { label: "关联", cssClass: "csslabel" }]]//这个是鼠标拉出来的线的属性
      },
      //结合部分

      step2: false,
      step3: false,
      feedForm: null,
      checkAllIndex: false, //索引的全选
      checkedAllShops: [],
      checkItemData: [],
      checkAllProfile: true, //配置全选
      checkIndexModel: false,
      standardColumnArr: [],
      colMapping: {},
      isEditData: false,//是否在编辑规则
      standerForm: { type: '' },
      verifyForm: { type: '' },
      canSureDo: false,
      transformTemplateId: '',
      saveloading: false,
      isCreateTestFeed: false,
      newStr: "",
      newStrTest: "",
      saveSuccess: true,
      comparedCol: [],
      prodData: {},
      prodTestData: {},
      comparedColTest: [],
      /*当没有字段时，构建查询disabled*/
      noColumns: false,

      //验证
      CURRENT_FEED_DEFAULT_VALUE: "#currentFeed",
      validators: [],
      validatorsAndStandardizers: [],
      //   selectedOptionType:'standardization',
      formKeyNumber: 0,
      ruleType: null,
      editRule: null,
      options: [],
      ifEditRules: false,
      policyRules: null,
      ruleFileds: null,
      pendingEdits: false,
      dialogRule: false, // 规则模态框隐藏
      fieldName: '',//当前选中的字段名
      selectedOptionType: 'standardization',
      optionTypes: [{ type: 'standardization', name: 'Standardization' }, { type: 'validation', name: 'Validation' }],//规则验证
      dataTransformScript: "",

      //可视化部分
      loadding: false,
      columnsData: {},
      tableData: [],
      step1: true,
      pzArr: [],
      //构建查询'
      SQLStr: '',
      sqlJSON: [],
      connections: [],
      conn: {},
      isIndeterminate: false,
      checkAll: true,
      goStep2Dis: true,
      editSQLDis: true,
      title: '',
      isShowSure: false,
      modalzzz: false,
      isRule1: false,
      isIdType: false,
      isSex: false,
      isDate: false,
      Type: [],
      otherTable: [],
      HiveTable: [],
      zzz: 'Hive',
      zzz2: '',
      restaurants: [
        { "value": "Baseinfo", "address": "长宁区新渔路144号" },
        { "value": "Baseinfo_payway", "address": "上海市长宁区淞虹路661号" },
      ],
      containers: [],
      jsPlumb: '',
      list1: ['Inner Join', 'Left Join', 'Right Join'],
      chooseSourceKey: [],
      chooseTargetKey: [],
      sourceKey: '',
      targetKey: '',
      addType: 'Inner Join',
      ttt1: [{ name: 'Baseinfo', details: [{ 'name': 'HEALTH_RECORD_NO', 'type': 'varchar(255)' }, { 'name': 'NAME', 'type': 'varchar(10)' }, { 'name': 'SEX_CODE', 'type': 'smallint(6)' }, { 'name': 'BIRTH_DATE', 'type': 'datetime' }, { 'name': 'ID_TYPE_CODE', 'type': 'varchar(2)' }, { 'name': 'ID_NO', 'type': 'varchar(255)' }, { 'name': 'EMPLOYER_NAME', 'type': 'char(0)' }, { 'name': 'TEL_NO', 'type': 'varchar(255)' }, { 'name': 'CONTACT_NAME', 'type': 'char(0)' }, { 'name': 'CONTACT_TEL_NO', 'type': 'char(0)' }, { 'name': 'RESIDENCE_MARK', 'type': 'varchar(1)' }, { 'name': 'NATIONALITY_CODE', 'type': 'smallint(6)' }, { 'name': 'ABO_CODE', 'type': 'smallint(6)' }, { 'name': 'RH_CODE', 'type': 'char(0)' }, { 'name': 'EDUCATION_CODE', 'type': 'smallint(6)' }, { 'name': 'OCCUPATION_CODE', 'type': 'smallint(6)' }, { 'name': 'MARRIAGE_CODE', 'type': 'smallint(6)' }, { 'name': 'DRUG_ALLERGY_SOURCE', 'type': 'varchar(20)' }, { 'name': 'PAST_SICKNESS_TYPE_CODE', 'type': 'varchar(65)' }, { 'name': 'PAST_SICKNESS_CONFIRM_DATE', 'type': 'char(0)' }, { 'name': 'OPERATION_HISTORY', 'type': 'varchar(255)' }, { 'name': 'OPERATION_DTIME', 'type': 'char(0)' }, { 'name': 'TRAUMA_HISTORY_MARK', 'type': 'char(0)' }, { 'name': 'TRAUMA_NAME', 'type': 'char(0)' }, { 'name': 'TRAUMA_OCCUR_DTIME', 'type': 'char(0)' }, { 'name': 'BLOOD_TRANSF_MARK', 'type': 'char(0)' }, { 'name': 'BLOOD_TRANSF_CAUSE', 'type': 'char(0)' }, { 'name': 'BLOOD_TRANSF_DTIME', 'type': 'char(0)' }, { 'name': 'FAMILY_DISEASE_CODE', 'type': 'char(0)' }, { 'name': 'CONTACT_RELATIONSHIP', 'type': 'smallint(6)' }, { 'name': 'GENETIC_DISEASE_HISTORY', 'type': 'varchar(60)' }, { 'name': 'DISABILITY_MARK', 'type': 'char(0)' }, { 'name': 'EXHAUST_FACILITY_MARK', 'type': 'char(0)' }, { 'name': 'EXHAUST_FACILITY_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'FUEL_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'WATER_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'TOILET_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'LIVESTOCK_PEN_TYPE_CODE', 'type': 'char(0)' }] }, { name: 'Baseinfo_payway', details: [{ 'name': 'HEALTH_RECORD_NO', 'type': 'varchar(255)' }, { 'name': 'PAY_WAY_CODE', 'type': 'smallint(6)' }] }],
      booleanConnect: true,


      historyVisible: false,
      filterType: 1,
      filterPz: [
        {
          name: '聚合函数',
          visible: false,
          defaultSql: 'groupBy(COLUMN).agg(count("COLUMN")).as("VALUE")',
          form: {
            columnsArr: [{ value: '' }],
            aggArr: [
              {
                addType: 'count',
                columns: '',
                otherName: '',
              }
            ],
          },
        },
        {
          name: '条件函数',
          visible: false,

          defaultSql: `when(CONDITION,'VALUE').otherwise('VALUE').as('VALUE')`,
          form: {
            when: [{ key: '', value: '' }],
            otherwise: '',
            as: ''
          }
        },
        {
          name: '透视聚合函数',
          visible: false,
          defaultSql: 'groupBy(COLUMN).pivot("COLUMN").agg(count("COLUMN"))',
          form: {
            groupBy: [{ value: '' }],
            pivot: [{ value: '' }],
            aggArr: [
              {
                addType: 'count',
                columns: '',
              }
            ],
          },
        },
        {
          name: '窗口函数',
          visible: false,
          defaultSql: 'sum(COLUMN).over(orderBy(COLUMN)).as("COLUMN")',
          form: {
            sum: { key: 'sum', value: '' },
            over: { key: 'orderBy', value: '' },
            as: ''
          },
        }
      ],
      filterSQL: '',
      aggArr: ['count', 'sum', 'avg', 'min', 'max'],
      historySQL: [],

      resultColums: [],
      resultColumsRel: [],
      transformDetails: {},
      resultTableID: '',
      scriptStart: '',
      scriptArr: [],
      feedLoading: false, //流程字段加载状态
      sqlDisabled: true,
      signArr: ['>', '>=', '==', '<=', '<'],
      rules: {
        required: [
          { required: true, message: '该项为必填' }
        ],
        otherName: [
          { validator: validOtherName }
        ]
      },
    };
  },
  watch: {
    //标准规则自动匹配
    // 'feedForm.table.fieldPolicies'(val){
    //   this.categoryDetails.columns.forEach(one=>{
    //       this.feedForm.table.fieldPolicies.forEach((two,index)=>{
    //          if(one.standardColumnsName == two.name) this.policyRules[index] = one. 
    //       })
    //   })
    // },

    // 'standardColumnArr'(val){
    //   let arr = [];
    //   this.feedForm.table.fieldPolicies.forEach(el1=>{
    //     console.log(el1)
    //     val.forEach(el2=>{
    //     if(el2.nameEN === el1.name){
    //       el1.nameEN = el2.nameEN
    //     }
    //   })
    //   arr.push(el1)
    //   })
    //   this.feedForm.table.fieldPolicies = arr
    // },
    'categoryDetails.columns' (val) {
      this.isEqualLength = false
      this.canSureDo = false
    },
    'newPeodPostJson.name' (val) {
      let str = '';
      str = val.toLowerCase();
      if (val !== null && val !== "") {
        let reg = /[\u4e00-\u9fa5]/g;
        this.newPeodPostJson.systemName = str.replace(reg, "");
      }

    },
  },
  methods: {
       onStandarChange (policy) {
      let fieldLength = this.feedForm.table.fieldPolicies.length;
      for (let i = 0; i < fieldLength; i++) {
        if (this.step3 === true && this.feedForm.table.fieldPolicies[i].nameEN !== undefined) {
          this.canSureDo = false;
        }
        else {
          this.canSureDo = true;
        }
      }
    },
    showHide (val) {
      console.log(this.categoryDetails.columns)
      console.log(this.my.model)
      if (this.categoryDetails.columns === undefined && this.my.model.columns === undefined) {
        this.modelV = false;
        this.standardV = false;
      }
      else if (this.categoryDetails.columns !== undefined) {
        this.modelV = true;
        this.standardV = false;
      }
      else if (this.my.model.columns !== undefined) {
        this.modelV = false;
        this.standardV = true;
      }
    },
    postProdVersionChild (id) {
      let obj
      this.prodArr.map(one => {
        if (one === id) obj = one
      })
      return obj
    },

    /*计划*/
    onScheduleStrategyChange () {
      if (this.saveFeedCopy.id != undefined) {
        this.feedVersionInfo = Object.assign({}, this.saveFeedCopy);
      } else {
        this.feedVersionInfo = this.feedVersionInfo;
      }
      this.feedVersionInfo.schedule.schedulingStrategyTouched = true;
      if (this.feedVersionInfo.schedule.schedulingStrategy == "CRON_DRIVEN") {
        this.isTimer = false;
        this.isCron = true;
        if (this.feedVersionInfo.schedule.schedulingPeriod != this.DEFAULT_CRON) {
          this.setCronDriven();
        }
      } else if (this.feedVersionInfo.schedule.schedulingStrategy == "TIMER_DRIVEN") {
        this.isTimer = true;
        this.isCron = false;
        this.setTimerDriven();
      }
      console.log(this.feedVersionInfo);
      console.log(this.saveFeedCopy);
      console.log("1111")
    },

    //改变时间
    handleTimerChange () {
      if (this.timerAmount != null && (this.timerAmount == 0 || (this.timerAmount < 3 && this.timerUnits == 'sec'))) {
        this.$message.error('警告! 你有这个流程计划一个非常快的计时器。 请确保您希望在继续之前快速安排此流程');
      }
      this.feedVersionInfo.schedule.schedulingPeriod = this.timerAmount + " " + this.timerUnits;
      console.log(this.feedVersionInfo.schedule)
    },

    setCronDriven () {
      this.feedVersionInfo.schedule.schedulingStrategy = 'CRON_DRIVEN';
      this.feedVersionInfo.schedule.schedulingPeriod = this.DEFAULT_CRON;
    },
    setTimerDriven () {
      this.feedVersionInfo.schedule.schedulingStrategy = 'TIMER_DRIVEN';
      this.timerAmount = 5;
      this.timerUnits = "min";
      this.feedVersionInfo.schedule.schedulingPeriod = "5 min";
    },
    clickSchedule (prod) {
      console.log(prod);
      this.dialogScheduleVisible = true;
    },
    //保存计划
    saveSchedule (prod) {
      console.log(this.activeName)
      console.log(this.saveFeedCopy)
      console.log(this.saveTestFeedCopy)
      console.log("__________________")
      if (this.activeName == "first") {
        this.saveCommon(this.saveFeedCopy);
        this.saveFeedCopy.schedule = this.feedVersionInfo.schedule;
        console.log(this.saveFeedCopy.schedule)
        console.log("this.saveFeedCopy.schedule")
      } else {
        this.saveCommon(this.saveTestFeedCopy);
        this.saveTestFeedCopy.schedule = this.feedVersionInfo.schedule;
        console.log(this.saveTestFeedCopy.schedule)
        console.log("this.saveTestFeedCopy.schedule")
      }
      this.saveloading = true;
      //this.saveCommon(this.feedVersionInfo);
      this.dialogScheduleVisible = false;
    },
    //取消保存
    cancelSchedule () {
      this.setCronDriven();
      this.isTimer = false;
      this.isCron = true;
      this.dialogScheduleVisible = false;
    },


    /********
     1、一开始获取从任务列表传过来的taskid，GET /v1/feedmgr/categories/by-name/{categorySystemName}
     2、根据taskid找到categoryid（就是parentid 创建prod（POST /v1/feedmgr/categories/create/prod））
     3、
     ****/
    getStart () {
      let _this = this;
      let taskId = _this.$route.query.id;
      _this.$route.params.taskParams != 'undefined' ? _this.taskParams = _this.$route.params.taskParams : _this.taskParams = {}
      console.log(_this.$route)
      console.log(_this.taskParams)
      this.Type = _this.taskParams.ds_list
      console.log(taskId);
      _this.prodArr = [];
      _this.saveloading = true;
      //f114fc0e799a4f24b2fc5b581c80fc96
      getCategoriesForVersion(taskId).then(data => {
        let childId = data.id;
        _this.categoryDetails = data;
        if (_this.categoryDetails.columns === undefined) {
          _this.$message.error("标准字段配置有误，请参考文档重新配置");
          _this.noColumns = true;
        }
        _this.parentId = data.id;
        postProdVersionChild(childId).then(res => {
          if (res.length > 0) {
            _this.prodArr = res;
            _this.newProdSecond = false;
          } else {
            let params = { parentId: _this.parentId };
            postProdVersion(params).then(dataRes => {
              _this.prodArr.push(dataRes);
            }).then(err => {
            })
          }
          _this.saveloading = false;

        }).catch(err => {
          _this.$message.error("标准错误，请参考配置");
        });

        /*计划*/
        //从后台获取时间计划cron表达式 getCronExpression
        // let toCronExpression = _this.feedVersionInfo.schedule.schedulingPeriod;
        let toCronExpression = '0 0 12 1/1 * ? *';
        getCronExpression(toCronExpression).then(data => {
          this.cronExpression = data;
          console.log(this.cronExpression)

        }).catch(err => {
          console.log(err.data)
        })


      }).catch(err => {

      })

    },
    //点击新建版本按钮
    newProdClick () {
      let _this = this;
      _this.dialogFormVisible = true;
    },
    postSencondTo () {
      let _this = this;
      _this.saveloading = true;
      _this.dialogFormVisible = false;
      _this.newPeodPostJson['parentId'] = _this.parentId;
      let postParams = _this.newPeodPostJson;
      postProdVersion(postParams).then(data => {
        _this.saveloading = false;
        _this.$message.success('新建版本成功');
        _this.getStart();
      }).catch(err => {
        _this.saveloading = false;
        _this.$message.error('新建版本失败');
        _this.newProdSecond = false;
      })
    },
    goToConnection () {
      this.step1 = true;
      this.step2 = false;
    },

    //newVersionFeed 构建流程
    newVersionFeed (prod) {
      this.dialogVisible = true;
      let prodId = prod.id;
      let _this = this;
      _this.isTest = false;
      _this.isProd = true;
      _this.feedVersionInfo = Object.assign({}, _this.showFeedCopy);
      console.log(prodId)
      postProdVersionChild(prodId).then(data => {
        if (data.length === 0) {
          _this.$message.error('获取信息失败');
        }
        for (let dataIg = 0; dataIg < data.length; dataIg++) {
          let str = data[dataIg].systemName;
          _this.newStr = str.substring(str.lastIndexOf('_') + 1, str.length);
          if (_this.newStr == "prod") {
            _this.feedForm = data[dataIg];
          }
        }
        _this.feedForm.dsgProperties = {};
        _this.feedForm.dsgProperties.interface = {};
        _this.feedForm.dsgProperties.interface.targetDbName = "";
        _this.feedForm.dsgProperties.interface.targetTableName = "";
        _this.feedForm["table"] = this.feedVersionInfo.table;
        _this.feedForm.metadata = {};
        _this.feedForm.metadata.systemFeedName = _this.feedForm.systemName;
        console.log(_this.feedVersionInfo);
      }).catch(err => {

      })

    },


    //构建 testFeed 测试流程
    testFeed (prod) {
      this.dialogVisible = true;
      let prodId = prod.id;
      let _this = this;
      _this.isTest = true;
      _this.isProd = false;
      _this.feedVersionInfo = Object.assign({}, _this.showFeedCopy);
      console.log(_this.feedVersionInfo)
      console.log(_this.showFeedCopy)
      console.log("测试测试测试测试测试")
      postProdVersionChild(prodId).then(data => {
        for (let dataIgtetst = 0; dataIgtetst < data.length; dataIgtetst++) {
          let str = data[dataIgtetst].systemName;
          _this.newStrTest = str.substring(str.lastIndexOf('_') + 1, str.length);
          if (_this.newStrTest == "test") {
            _this.feedForm = data[dataIgtetst];
          }
        }
        _this.feedForm.dsgProperties = {};
        _this.feedForm.dsgProperties.interface = {};
        _this.feedForm.dsgProperties.interface.targetDbName = "";
        _this.feedForm.dsgProperties.interface.targetTableName = "";
        _this.feedForm["table"] = this.feedVersionInfo.table;
        _this.feedForm.metadata = {};
        _this.feedForm.metadata.systemFeedName = _this.feedForm.systemName;
        _this.feedForm.metadata.category = {};
        _this.feedForm.metadata.category.systemName = _this.feedForm.systemName;
        _this.feedForm.category = {};
        _this.feedForm.category.systemName = _this.feedForm.systemName;
        _this.feedVersionInfo.category.name = _this.feedForm.name;
        _this.feedVersionInfo.category.systemName = _this.feedForm.systemName;
        _this.feedVersionInfo.category.id = _this.feedForm.id;
        _this.feedVersionInfo.systemFeedName = _this.feedForm.systemName;
        console.log(_this.feedVersionInfo)
      }).catch(err => {

      })

    },

    //跳转至流程列表
    toFeedList (val) {
      console.log(val)
      if (this.saveFeedCopy.id != undefined) {
        console.log(this.saveFeedCopy)
        this.$router.push({ path: '/flowManage/editFeed', query: { feedDetail: this.saveFeedCopy } })
      }
      // this.$router.push({ path: '/flowManage/feedsList' })
    },
    toFeedTestList (val) {
      console.log(val)
      if (this.saveTestFeedCopy.id != undefined) {
        console.log(this.saveTestFeedCopy)
        this.$router.push({ path: '/flowManage/editFeed', query: { feedDetail: this.saveTestFeedCopy } })
      }
      // this.$router.push({ path: '/flowManage/feedsList' })
    },


    //点击版本 postProdVersionChild
    //点击版本 postProdVersionChild
    /*   getVersionProd(prod,index){
           console.log(prod)
           console.log(index)

       },*/
    onStandarChange (policy) {
      let fieldLength = this.feedForm.table.fieldPolicies.length;
      for (let i = 0; i < fieldLength; i++) {
        if (this.step3 === true && this.feedForm.table.fieldPolicies[i].nameEN !== undefined) {
          this.canSureDo = false;
        }
        else {
          this.canSureDo = true;
        }
      }
    },



    //结合部分获取字段数据
    //            和可视化结合部分
    //拼接字段
    newTableFieldPolicy (fieldName) {
      return { field: {}, name: fieldName || '', feedFieldName: fieldName || '', partition: null, profile: true, standardization: null, validation: null };
    },
    setTableFields (fields, policies) {
      this.feedForm.table.fieldPolicies = (policies != null && policies.length > 0) ? policies : fields.map(field => this.newTableFieldPolicy(field.name));
    },
    nextPost (data) {
      console.log(data)
      this.step1 = false;
      this.step3 = true;

      let _this = this;
      this.containers = data.containers
      this.connections = data.connections
      this.resultColumsRel = data.resultColumsRel
      this.transformData = data.transformData
      this.zzz = data.cDataSource
      this.SQLStr = data.SQLStr
      /* _this.checkedRes = [];
       _this.containers.forEach((item, index) => {
         let checkArr= item.checked;
         let findArr =item.fields;
         findArr.find((value, index,checkArr)=>{
           item.checked.forEach(iname=>{
             if(value.name == iname){
                 console.log(value)
               _this.checkedRes.push(value);
             }
 
           })
         })
       });*/
      let arrTans = []
      this.resultColumsRel.forEach((item, index) => {
        let json = {}
        json.derivedDataType = item.dataType;
        json.name = item.field;
        json.description = "";
        json.precisionScale = null;
        json.dataTypeDisplay = "";
        json.primaryKey = false;
        json.nullable = false;
        json.createdTracker = false;
        json.sampleValues = [];
        json.selectedSampleValue = "";
        json.tags = [];
        arrTans.push(json)
      })
      _this.feedForm.table.tableSchema.fields = arrTans;
      // _this.feedForm.table.tableSchema.fields = _this.checkedRes;
      console.log(arrTans);


      /*  let findArr =  _this.containers.fields;
        var c =  _this.containers.checked.filter(function(v){ return findArr.indexOf(v) > -1 })
        console.log(c)
        console.log("_________________")*/

      // let contanierLen = _this.containers.length;
      // console.log(_this.datasourceIds);
      // for (let i = 0; i < contanierLen; i++) {
      //   if (_this.containers[i].dataSourceId == "Hive") {
      //   }
      //   else {
      //     _this.datasourceIds.push(_this.containers[i].dataSourceId);
      //   }
      // }
      console.log(_this.datasourceIds)
      console.log("__________________________________");
      _this.originalTableFields = Object.assign(_this.feedForm.table.tableSchema.fields);
      //    _this.tableFieldsDirty = false;

      _this.feedForm.table.sourceTableSchema.fields = _this.originalTableFields;
      _this.setTableFields(_this.feedForm.table.tableSchema.fields);
      if (this.categoryDetails !== undefined && this.categoryDetails.columns) {
        _this.standardColumnArr = _this.categoryDetails.columns;
        console.log(_this.standardColumnArr)
        console.log(_this.originalTableFields)

        if (this.categoryDetails.columns !== '') {
          if (_this.originalTableFields.length != _this.standardColumnArr.length) {
            this.$message.error('标准数据和选择字段不统一，请重新选择');
            this.isEqualLength = true;
          } else {
            this.isEqualLength = false;
          }
        }


      }



      console.log("+++++++++++++++++++++")
      _this.feedVersionInfo.feedName = _this.feedForm.name;
      _this.feedVersionInfo.category.name = _this.feedForm.name;
      _this.feedVersionInfo.category.systemName = _this.feedForm.systemName;
      _this.feedVersionInfo.category.id = _this.feedForm.id;
      console.log(_this.feedForm)
      console.log(_this.feedVersionInfo);
      getTransformTemplateId().then(data => {
        _this.transformTemplateId = data.data;
        _this.feedVersionInfo.templateId = _this.transformTemplateId;
        //asdfg
        let templateId = _this.feedVersionInfo.templateId;
        getTemplateOne(templateId).then(data => {
          _this.feedVersionInfo.templateName = data.templateName;
        }).catch(err => {

        });

      }).catch(err => {

      });

    },
    goToStep2 () {
      this.step1 = true;
      this.step3 = false;
      //this.$set(this.feedForm.table.fieldPolicies,[])
    },
    //全选index 索引
    handleCheckAllChangeIndex (val) {
      this.feedForm.table.fieldPolicies.map((item) => {
        this.$set(item, 'index', val)
      })
    },
    //全选配置
    handleCheckAllChangeProfile (val) {
      this.feedForm.table.fieldPolicies.map((item) => {
        this.$set(item, 'profile', val)
      })
    },
    //index单选
    handleCheckItemChange (val) {
      for (let i = 0, l = this.feedForm.table.fieldPolicies.length; i < l; i++) {
        if (this.feedForm.table.fieldPolicies[i].index !== val) {
          this.checkAllIndex = false;
          return;
        }
      }
      this.checkAllIndex = val;
    },
    //配置单选
    handleCheckItemChangeProfile (val) {
      for (let i = 0, l = this.feedForm.table.fieldPolicies.length; i < l; i++) {
        if (this.feedForm.table.fieldPolicies[i].profile !== val) {
          this.checkAllProfile = false;
          return;
        }
      }
      this.checkAllProfile = val;
    },


    //            验证
    //验证规则 getFeedValidation getFeedStandardization
    openRule (val) {
      this.dialogRule = true;
      this.ruleFileds = val;
    },
    currentFeedValue: function (feed) {
      return feed.category.systemName + "." + feed.systemFeedName;
    },
    attachCurrentFeedValueToProperty (prop, feedName) {
      if (prop.value == undefined || prop.value == null || prop.value == this.CURRENT_FEED_DEFAULT_VALUE) {
        prop.value = feedName;
      }
    },
    attachCurrentFeedValues: function (data, feedName) {
      //set the currentFeed property value to be this.feed if it is not null
      let currentFeedProperties = [];
      let _this = this;
      _.each(data, function (rules) {
        _.each(rules.properties, function (prop) {
          if (prop.type == 'currentFeed' || prop.value == _this.CURRENT_FEED_DEFAULT_VALUE) {
            currentFeedProperties.push(prop);
          }
        });

      });
      _.each(currentFeedProperties, function (prop) {
        _this.attachCurrentFeedValueToProperty(prop, feedName);

      });

    },
    groupProperties (metric) {
      let group = _.groupBy(metric.properties, 'group');
      let groupedProperties = [];
      let index = 0;

      _.each(group, function (props, groupName) {
        let sortedProps = _.sortBy(props, 'groupOrder');
        let newGroup = { group: groupName, layout: groupName != '' ? 'row' : 'column', properties: sortedProps }
        groupedProperties.push(newGroup);
      });

      let allProps = [];
      _.each(groupedProperties, function (group) {
        _.each(group.properties, function (property) {
          //make the RegExp if it is supplied as a string
          if (property.pattern != null && property.pattern != undefined && property.pattern != "") {
            try {
              property.patternRegExp = new RegExp(property.pattern);
            } catch (err) {

            }
          }
          allProps.push(property);
        });
      });
      metric.properties = allProps;

      return groupedProperties;

    },
    groupPolicyOptions (options, currentFeedName) {
      if (currentFeedName != null && currentFeedName != undefined) {
        this.attachCurrentFeedValues(options, currentFeedName);
      }

      let optionsArr = [];
      /*options.forEach(options, function (opt) {
          opt.groups = this.groupProperties(opt);
          optionsArr.push(opt);
      });*/
      options.forEach(opt => {
        opt.groups = this.groupProperties(opt);
        optionsArr.push(opt);
      })
      return optionsArr;
    },
    changedOptionType (type) {
      if (type == "standardization" || type == "Standardization") {
        this.options = this.standardizers;
      } else {
        this.options = this.validators;
      }
      //  this.options = type == 'standardization' ? this.standardizers : this.validators;
      this.selectedOptionType = type;
    },
    findRuleType (ruleName, type) {
      return _.find(this.validatorsAndStandardizers, function (opt) {
        return opt.name == ruleName && opt.type == type;
      });
    },

    ruleTypesAvailable () {
      if (this.editRule != null) {
        this.ruleType = this.findRuleType(this.editRule.name, this.editRule.type);
        console.log(this.ruleType)
        if (this.ruleType && this.ruleType.type != this.selectedOptionType) {
          this.changedOptionType(this.ruleType.type);
        }
      }
    },
    getValidationOptions () {
      getFeedValidation().then(data => {
        let currentFeedValue = null;
        let _this = this;
        console.log(_this.feedVersionInfo);
        console.log("_this.feedForm_this.feedForm_this.feedForm_this.feedForm_this.feedForm")
        if (_this.feedVersionInfo != null) {
          currentFeedValue = _this.currentFeedValue(this.feedVersionInfo);
          currentFeedValue = currentFeedValue.toLowerCase();
        }
        console.log(currentFeedValue);
        let standardizationResults = [];
        let validationResults = [];
        validationResults = _.sortBy(data, function (r) {
          return r.name;
        });
        _.each(validationResults, function (result) {
          result.type = 'validation';
        })
        _this.validators = _this.groupPolicyOptions(validationResults, currentFeedValue);
        //  _this.validatorsAndStandardizers = _.union(_this.validators,_this.standardizers);
        //set the correct options in the drop down
        _this.changedOptionType(_this.selectedOptionType);
        _this.ruleTypesAvailable();
        // $scope.loadingPolicies = false;
      }).catch(err => { })
    },
    //standardization
    getStandardizationOptions () {
      getFeedStandardization().then(data => {
        let currentFeedValue = null;
        let _this = this;
        if (_this.feedVersionInfo != null) {

          currentFeedValue = _this.currentFeedValue(_this.feedVersionInfo);
          currentFeedValue = currentFeedValue.toLowerCase();
        }
        let standardizationResults = [];
        let validationResults = [];
        standardizationResults = _.sortBy(data, function (r) {
          return r.name;
        });
        _.each(standardizationResults, function (result) {
          result.type = 'standardization';
        })
        _this.standardizers = _this.groupPolicyOptions(standardizationResults, currentFeedValue);
        //  _this.validatorsAndStandardizers = _.union(_this.validators,_this.standardizers);
        //set the correct options in the drop down
        _this.changedOptionType(_this.selectedOptionType);
        _this.ruleTypesAvailable();
        // $scope.loadingPolicies = false;
      }).catch(err => { })
    },
    updatePropertyIndex (rule) {
      this.updatePropertyIndex(rule);
    },
    updatePropertyIndex (rule) {
      let _this = this;
      _.each(rule.properties, function (property) {
        property.formKey = 'property_' + _this.formKeyNumber++;
      });
    },
    //this.onChangedOptionType = changedOptionType;
    /* changedOptionType(type) {
         this.getValidationOptions();
         this.options = type == 'standardization' ? this.standardizers : this.validators;
         this.selectedOptionType = type;
     },*/
    onChangedOptionType (type) {
      console.log(type)
      if (type == "standardization" || type == "Standardization") {
        this.getStandardizationOptions();
        this.options = this.standardizers;
      } else {
        this.getValidationOptions();
        this.options = this.validators;
      }
      //this.options = type == 'standardization' ? this.standardizers : this.validators;
      this.selectedOptionType = type;
    },
    onRuleTypeChange (val) {
      if (this.ruleType != null) {
        let rule = this.ruleType;
        rule.groups = this.groupProperties(rule);
        this.updatePropertyIndex(rule);
        //make all rules editable
        rule.editable = true;
        this.editRule = rule;
        this.ifEditRules = true;
        this.setupPoliciesForFeed();
      }
      else {
        this.editRule = null;
      }
    },
    _cancelEdit () {
      this.ruleType = null;
      this.editRule = null;
    },
    getAllPolicyRules (field) {
      let arr = [];
      let standardizers = field['standardization'];
      let validators = field['validation'];

      //add in the type so we know what we are dealing with
      if (standardizers) {
        _.each(standardizers, function (item) {
          item.type = 'standardization';
        });
      }
      if (validators) {
        _.each(validators, function (item) {
          item.type = 'validation';
        });
      }
      let tmpArr = _.union(standardizers, validators);

      let hasSequence = _.find(tmpArr, function (item) {
        return item.sequence != null && item.sequence != undefined;
      }) != undefined;

      //if we dont have a sequence, add it in
      if (!hasSequence) {
        _.each(tmpArr, function (item, idx) {
          item.sequence = idx;
        });
      }

      arr = _.sortBy(tmpArr, 'sequence');
      return arr;
    },
    setupPoliciesForFeed () {
      let arr = this.getAllPolicyRules(this.ruleFileds);
      if (arr != null && arr != undefined) {
        this.policyRules = arr;
      }
    },
    cancelEdit ($event) {
      this._cancelEdit();
    },
    deletePolicyByIndex (index) {
      if (this.policyRules != null) {
        this.policyRules.splice(index, 1);
      }
      this.pendingEdits = true;
      // _cancelEdit();
    },
    onPropertyChanged (val) {
      console.log(val)
    },

    addPolicy ($event) {
      if (this.policyRules == null) {
        this.policyRules = [];
      }
      // buildDisplayString();
      //this.editRule.ruleType = this.ruleType;
      this.policyRules.push(this.editRule);
      this.pendingEdits = true;
      this.ifEditRules = true;
      // this._cancelEdit();
    },
    doneRule ($event) {
      let validators = [];
      let standardizers = [];
      let _this = this;
      _.each(_this.policyRules, function (rule, i) {
        rule.sequence = i;
        if (rule.type == 'validation') {
          validators.push(rule);
        }
        else if (rule.type == 'standardization') {
          standardizers.push(rule);
        }
      })
      _this.ruleFileds['validation'] = validators;
      _this.ruleFileds['standardization'] = standardizers;
      _this.dialogRule = false;
    },

    getVersionId (prod) {
      //创建测试之后，调用 postProdVersionChild 查找下面的children
      let _this = this;
      console.log(prod);
      postProdVersionChild(prod.id).then(data => {
        console.log(data)
        //一个版本下是否只有两个
        /* if(data.length==2){
             _this.isCreateTestFeed = true;
         }*/
        if (data.length === 1 && prod["isCreateTestFeed"] != true) {
          prod["isCreateTestFeed"] = false;
          //  _this.isCreateTestFeed = false;
        }
        else {
          //  _this.isCreateTestFeed = true;
          prod["isCreateTestFeed"] = true;
        }
        //查找标准流程 GET /v1/feedmgr/feeds/by-name/{feedName}
        for (let dataIg = 0; dataIg < data.length; dataIg++) {
          let str = data[dataIg].systemName;
          _this.newStr = str.substring(str.lastIndexOf('_') + 1, str.length);
          _this.isTestSchedule = false;
          if (_this.newStr == "test") {
            console.log('---------------------------------')
            _this.prodTestData = data[dataIg];
            if (JSON.stringify(_this.prodTestData) != "{}" || JSON.stringify(_this.prodTestData) != undefined) {
              let toGetFeedsTest = "";
              toGetFeedsTest = _this.prodTestData.systemName + "." + _this.prodTestData.systemName;
              getStandarFeed(toGetFeedsTest).then(res => {
                console.log(res);
                console.log("resresresres");
                if (res.id != undefined && _this.activeName == "second") {
                  // _this.testSecondFeedId = res.id
                  _this.saveTestFeedCopy = res;
                  _this.testSecondFeedId = res.id;
                  _this.feedVersionInfo = Object.assign({}, res);
                  _this.isTestSchedule = true;
                  //_this.feedVersionInfo.id = res.id;
                  //isTestSchedule
                  console.log(_this.feedVersionInfo.id)
                  _this.comparedColTest = res.dsgProperties.interface.interfaceColumns;
                  /*  prod["comparedColTest"] = _this.comparedColTest;*/

                  _this.$set(prod, 'comparedColTest', res.dsgProperties.interface.interfaceColumns);
                  console.log(res.dsgProperties.interface.interfaceColumns.length)
                  if (res.dsgProperties.interface.interfaceColumns.length > 0) {
                    _this.isTestSchedule = true;
                    if (_this.feedVersionInfo.schedule.schedulingStrategy == "CRON_DRIVEN") {
                      _this.isTimer = false;
                      _this.isCron = true;
                      if (_this.feedVersionInfo.schedule.schedulingPeriod != _this.DEFAULT_CRON) {
                        _this.setCronDriven();
                      }
                    } else if (_this.feedVersionInfo.schedule.schedulingStrategy == "TIMER_DRIVEN") {
                      _this.isTimer = true;
                      _this.isCron = false;
                      _this.setTimerDriven();
                    }
                  } else {
                    _this.isTestSchedule = false;
                  }
                } else {
                  _this.feedVersionInfo = Object.assign({}, _this.showFeedCopy);
                  _this.isTestSchedule = false;
                }
                console.log("______________________")

              }).catch(err => {

              })
            }

          } else {
            _this.prodData = data[dataIg];
            if (JSON.stringify(_this.prodData) != "{}" || JSON.stringify(_this.prodData) != undefined) {
              _this.feedLoading = true;
              let toGetFeedsProd = "";
              toGetFeedsProd = _this.prodData.systemName + "." + _this.prodData.systemName;
              getStandarFeed(toGetFeedsProd).then(prodRes => {
                console.log(prodRes)
                console.log(_this.saveFeedCopy);
                console.log(prodRes.id)
                console.log(_this.feedVersionInfo)
                if (prodRes.id != undefined && !_this.isTest) {
                  _this.saveFeedCopy = prodRes;
                  _this.feedVersionInfo = Object.assign({}, prodRes);
                  console.log(_this.feedVersionInfo);
                  console.log("测试吃啥-1")
                  _this.secondfeedId = prodRes.id;
                  // _this.feedVersionInfo.id = prodRes.id;
                  //_this.feedVersionInfo.feedId = prodRes.id;

                  _this.comparedCol = prodRes.dsgProperties.interface.interfaceColumns;
                  //  prod["comparedCol"] = _this.comparedCol;
                  _this.$set(prod, 'comparedCol', prodRes.dsgProperties.interface.interfaceColumns);
                  if (prodRes.dsgProperties.interface.interfaceColumns.length > 0) {
                    _this.isSchedule = true;
                    console.log(_this.saveFeedCopy);
                    console.log(_this.feedVersionInfo);
                    if (_this.feedVersionInfo.schedule.schedulingStrategy == "CRON_DRIVEN") {
                      _this.isTimer = false;
                      _this.isCron = true;
                      if (_this.feedVersionInfo.schedule.schedulingPeriod != _this.DEFAULT_CRON) {
                        _this.setCronDriven();
                      }
                    } else if (_this.feedVersionInfo.schedule.schedulingStrategy == "TIMER_DRIVEN") {
                      _this.isTimer = true;
                      _this.isCron = false;
                      _this.setTimerDriven();
                    }
                  } else {
                    _this.isSchedule = false;
                  }

                  console.log("+++++++++++++++++++++++")
                }
                else {
                  _this.feedVersionInfo = Object.assign({}, _this.showFeedCopy);
                  _this.isSchedule = false;
                }
                _this.feedLoading = false;
                console.log(_this.feedVersionInfo);

              }).catch(err => {
                _this.feedLoading = false;
              })
            }
          }
        }
      }).catch(err => {

      })
      console.log(_this.feedVersionInfo);
    },
    testForm (str) {
      let reg = /[a-zA-Z]*_*/
      return !reg.test(str) || str == ''
    },
    //
    scrollTo (element, to, duration) {
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;

      setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop == to) return;
        this.scrollTo(element, to, duration - 10);
      }, 10);
    },
    /*保存版本流程*/
    saveFeedVersion (prod) {
      console.log(prod);
      console.log(this.showFeedCopy)
      console.log(this.feedVersionInfo);
      console.log(this.feedForm.table.fieldPolicies)
      if (this.testForm(this.feedForm.dsgProperties.interface.targetDbName) || this.feedForm.name == '' || this.feedForm.systemName == '' || this.testForm(this.feedForm.dsgProperties.interface.targetTableName)) {
        this.$message({
          type: 'error',
          message: '请填写正确信息'
        })
        this.scrollTo(document.getElementById('getSearch'), 0, 11)
        return false
      }
      let _this = this;
      this.saveloading = true;
      this.dialogVisible = false;
      let fieldPoliciesLength = _this.feedForm.table.fieldPolicies.length;
      for (let j = 0; j < fieldPoliciesLength; j++) {
        let tableCol = _this.feedForm.table.fieldPolicies[j].name;
        let standarCol = _this.feedForm.table.fieldPolicies[j].nameEN;
        _this.colMapping[tableCol] = standarCol;
      }
      console.log(_this.containers)
      console.log(_this.datasourceIds)

      _this.feedForm.dsgProperties["interface"].interfaceSystemNameForNifi = _this.categoryDetails.systemName;
      _this.feedForm.dsgProperties["interface"].colMapping = _this.colMapping;
      _this.feedForm.dsgProperties["interface"].interfaceColumns = _this.standardColumnArr;

      _this.feedVersionInfo["metadata"] = _this.feedForm.metadata;
      _this.feedVersionInfo["dsgProperties"] = _this.feedForm.dsgProperties;
      _this.feedVersionInfo["dsgProperties"] = _this.feedForm.dsgProperties;
      _this.feedVersionInfo.templateTableOption = "DATA_TRANSFORMATION";

      _this.feedVersionInfo.dataTransformation.sql = _this.SQLStr;
      _this.feedVersionInfo.dataTransformation['$selectedDatasourceId'] = _this.zzz;
      _this.feedVersionInfo.dataTransformation.dataTransformScript = this.transformData.datasources.script;
      _this.feedVersionInfo.dataTransformation["datasourceIds"] = _this.datasourceIds;
      _this.feedVersionInfo.dataTransformation.chartViewModel["nodes"] = _this.containers;
      _this.feedVersionInfo.dataTransformation.chartViewModel["connections"] = _this.connections;
      _this.feedVersionInfo.systemFeedName = _this.feedForm.systemName;
      _this.feedVersionInfo.feedName = _this.feedForm.name;
      _this.feedForm.metadata.category = {};
      _this.feedForm.metadata.category.systemName = _this.feedForm.systemName;
      _this.feedForm.category = {};
      /* _this.feedForm.category.systemName = _this.feedForm.systemName;
       _this.feedVersionInfo.category.name = _this.feedForm.name;
       _this.feedVersionInfo.category.systemName = _this.feedForm.systemName;
       _this.feedVersionInfo.category.id = _this.feedForm.id;*/
      _this.feedVersionInfo.systemFeedName = _this.feedForm.systemName;
      _this.feedVersionInfo.inputProcessorName = "Run Feed";
      _this.feedVersionInfo.inputProcessorType = "org.apache.nifi.processors.standard.GenerateFlowFile";
      let feedNameStr = _this.feedForm.systemName.substring(_this.feedForm.systemName.lastIndexOf('_') + 1, _this.feedForm.systemName.length);
      console.log(feedNameStr);
      if (_this.secondfeedId != "" && feedNameStr == "prod") {
        _this.feedVersionInfo.id = _this.secondfeedId
        _this.feedVersionInfo.feedId = _this.secondfeedId
      }
      if (_this.testSecondFeedId != "" && feedNameStr == "test") {
        _this.feedVersionInfo.id = _this.testSecondFeedId;
        _this.feedVersionInfo.feedId = _this.testSecondFeedId;
      }
      let sign = ''
      if (this.modelV === false && this.standardV === false) sign = 'BASE'
      else if (this.modelV === false && this.standardV === true) sign = 'MODEL'
      else if (this.modelV === true && this.standardV === false) sign = 'STANDARD'
      _this.feedVersionInfo.dsgProperties.interface.targetTableType = sign
      
      _this.feedVersionInfo.dsgProperties.standard = this.categoryDetails
      _this.feedVersionInfo.dsgProperties.model = this.my.model 
      //获取模板信息
      let postFeedModel = _this.feedVersionInfo;
      console.log(_this.feedVersionInfo)
      console.log("保存保存保存")
      console.log(_this.saveFeedCopy)
      console.log("_this.saveFeedCopy");
      console.log(_this.saveTestFeedCopy);
      console.log("_this.saveTestFeedCopy")

      postFeedModel.dataTransformation.datasourceIds = this.transformData.datasources.map(el => el.id)
      postFeedModel.templateId = this.transformTemplateId
      console.log(this.transformTemplateId)
      postFeedModel.dataTransformation.dataTransformScript = this.transformData.script
      saveFeed(postFeedModel).then(data => {
        _this.saveloading = false;
        let feedStr = data.feedMetadata.systemFeedName;
        let feedStrs = feedStr.substring(feedStr.lastIndexOf('_') + 1, feedStr.length);
        console.log(feedStrs)
        console.log("feedStrs")
        if (feedStrs === "prod") {
          _this.comparedCol = data.feedMetadata.dsgProperties.interface.interfaceColumns;
          _this.$set(prod, 'comparedCol', data.feedMetadata.dsgProperties.interface.interfaceColumns);
          _this.saveFeedCopy.schedule = data.feedMetadata.schedule;
          console.log(_this.saveFeedCopy)
          console.log("_this.saveFeedCopy")
          _this.isSchedule = true;
          // prod["comparedCol"] = _this.comparedCol;
        } else {
          _this.comparedColTest = data.feedMetadata.dsgProperties.interface.interfaceColumns;
          _this.$set(prod, 'comparedColTest', data.feedMetadata.dsgProperties.interface.interfaceColumns);
          _this.saveTestFeedCopy.schedule = data.feedMetadata.schedule;
          _this.isTestSchedule = true;
          // prod["comparedColTest"] = _this.comparedColTest;
        }
        _this.$message.success('保存成功');

      }).catch(err => {
        _this.saveloading = false;
        // _this.$message.error('标准失败');
      })

    },
    saveCommon (postFeedModel) {
      let _this = this;
      saveFeed(postFeedModel).then(data => {
        _this.saveloading = false;
        let feedStr = data.feedMetadata.systemFeedName;
        let feedStrs = feedStr.substring(feedStr.lastIndexOf('_') + 1, feedStr.length);
        console.log(feedStrs)
        console.log("feedStrs")
        if (feedStrs === "prod") {
          _this.comparedCol = data.feedMetadata.dsgProperties.interface.interfaceColumns;
          //   _this.$set(prod, 'comparedCol', data.feedMetadata.dsgProperties.interface.interfaceColumns);
          _this.isSchedule = true;
          // prod["comparedCol"] = _this.comparedCol;
        } else {
          _this.comparedColTest = data.feedMetadata.dsgProperties.interface.interfaceColumns;
          _this.$set(prod, 'comparedColTest', data.feedMetadata.dsgProperties.interface.interfaceColumns);
          _this.isTestSchedule = true;
          // prod["comparedColTest"] = _this.comparedColTest;
        }
        _this.$message.success('保存成功');

      }).catch(err => {
        _this.saveloading = false;
        // _this.$message.error('标准失败');
      })
    },

    handleClick (prod) {

    },
    //创建测试
    createTest (prod) {
      //调用后台接口创建测试  createTestFeed
      //创建传的id是版本id
      let versionId = prod.id;
      let createTestJson = {};
      createTestJson["parentId"] = versionId;
      let _this = this;
      _this.saveloading = true;
      createTestFeed(createTestJson).then(data => {
        _this.$message.success('测试环境创建成功');
        _this.saveloading = false;
        prod.isCreateTestFeed = true;

      }).catch(err => {

      })
    },

  },
  filters: {
    tolower: function (value) {
      return value.toLowerCase();
    },
    translate (val) {
      if (translateJsonData[val] == "" || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
  },
  mounted () {
    this.getStart();
    /******可视化*******/
  }
};
</script>

<style>
.box-card {
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  border-radius: 4px;
  overflow: hidden;
}
#sec .el-dialog__headerbtn .el-dialog__close {
  color: white;
}
#sec .el-dialog__title {
  color: white;
}
#sec .el-dialog__header {
  background: #409eff;
}
#cantainer .el-card__body {
  max-height: 450px;
  overflow-y: auto;
}
#cantainer .el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #409eff;
  color: white;
}
</style>
<style scoped>
.editRowStyle {
  padding: 10px 0;
}
.box-card:hover {
  border: 1px solid #409eff;
}
.text {
  font-size: 14px;
}
.crolUl {
  list-style: none;
  width: 200px;
}
.crolUl li {
  /* padding: 0 35%;*/
  border: 1px solid #ddd;
}
.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

/*.box-card {
        width: 580px;
    }*/
/* .smartCard{
         padding: 5px;
     }*/
.el-dialog__body {
  max-height: 500px !important;
}
.el-table .el-button {
  padding: 1px 12px !important;
}
</style>