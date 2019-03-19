<template>
  <div v-loading="saveLoadding">
    <el-steps
      :active="active"
      simple
      id="steps"
      finish-status="success"
      v-if="isTransformBool && !isRuleTemplate"
    >
      <!--feedInfo.templateName==='Data Transformation'-->
      <el-step title="基本信息"></el-step>
      <el-step title="流程详情"></el-step>

      <!--数据转换的两步-->
      <el-step title="构建查询"></el-step>

      <el-step title="数据表"></el-step>
      <el-step title="数据处理"></el-step>
      <el-step title="属性"></el-step>
      <!--  <el-step title="控制访问"></el-step>-->
      <el-step title="调度"></el-step>
    </el-steps>
    <el-steps :active="active" simple finish-status="success" v-else-if="isRuleTemplate">
      <!-- feedInfo.templateName!=='Data Transformation'-->
      <!--feedInfo.templateName==='Data Transformation'-->
      <el-step title="基本信息"></el-step>
      <el-step title="流程详情"></el-step>

      <!--数据转换的两步-->
      <el-step title="构建查询"></el-step>

      <el-step title="数据表"></el-step>
      <el-step title="属性"></el-step>
      <!--  <el-step title="控制访问"></el-step>-->
      <el-step title="调度"></el-step>
    </el-steps>
    <el-steps :active="active" simple finish-status="success" v-else>
      <!-- feedInfo.templateName!=='Data Transformation'-->
      <el-step title="基本信息"></el-step>
      <el-step title="流程详情"></el-step>

      <el-step title="数据表"></el-step>
      <el-step title="数据处理"></el-step>
      <el-step title="属性"></el-step>
      <!--  <el-step title="控制访问"></el-step>-->
      <el-step title="调度"></el-step>
    </el-steps>

    <!--步骤1 基本信息-->
    <div v-show="isStepFirst" style="margin-top:10px;">
      <el-row :gutter="20">
        <el-col :span="12" :offset="2">
          <div class="definedFeedmain">
            <el-form label-width="100px" class="demo-ruleForm">
              <el-form-item label="模板名称">
                <el-input v-model="feedInfo.templateName" disabled></el-input>
              </el-form-item>
            </el-form>
            <el-form :model="feedInfo" label-width="100px" class="demo-ruleForm">
              <el-form-item label="流程显示名">
                <el-input v-model="feedInfo.feedName" @focus="regChineseMethod"></el-input>
                <!-- <span style="color: #999" v-show="regChinese">（流程名不支持特殊字符）</span> -->
              </el-form-item>
              <el-form-item label="系统名称">
                <div style="display: flex;">
                  <el-input v-model="feedInfo.systemFeedName" :disabled="baseInfoObj.isDisabled"></el-input>
                  <div style="margin-left: 10px;">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="baseInfoObj.isDisabled = !baseInfoObj.isDisabled"
                    >{{baseInfoObj.isDisabled ? '改变系统名' : '使用默认'}}</el-button>
                  </div>
                </div>
                <span style="color: #999">（系统名可自定义,不支持中文和特殊字符,支持英文字母和数字）</span>
              </el-form-item>
              <el-form-item label="类别" v-if="false">
                <div style="display: flex;">
                  <el-input v-model="feedInfo.category.name" autocomplete="off" disabled></el-input>
                  <div class="selectTree" style="margin-left: 10px;">
                    <el-button
                      size="mini"
                      v-show="!treeState"
                      @click="treeState=true"
                      type="primary"
                    >选择分类</el-button>
                    <el-button
                      size="mini"
                      v-show="treeState"
                      @click="treeState=false"
                      type="primary"
                    >关闭分类</el-button>
                  </div>
                </div>
                <search-tree :data="treeData" v-if="treeState" @selectNode="selectNode"></search-tree>
              </el-form-item>
              <el-form-item label="主题">
                <el-select
                  v-model="feedInfo.dsgProperties.subjectID"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(item,index) in taskInfo.subject_list"
                    :key="item.id"
                    :label="item.from_name"
                    :value="item.parent_id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- taskInfo -->
              <el-form-item label="标准" v-if="!isRuleTemplate">
                <el-select
                  v-model="feedInfo.dsgProperties.standard"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width: 100%;"
                  @change="showHide()"
                  :disabled="standardV"
                  value-key="id"
                >
                  <el-option
                    v-for="(item,index) in taskInfo.standard_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="模型" v-if="!isRuleTemplate">
                <el-select
                  v-model="feedInfo.dsgProperties.model"
                  filterable
                  :disabled="modelV"
                  @change="showHide()"
                  clearable
                  placeholder="请选择"
                  value-key="id"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(item,index) in taskInfo.model_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="输出表类型">
                <el-input v-model="feedInfo.type" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="feedInfo.description"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--步骤2 流程详情-->
    <div v-show="isStepSecond" style="margin-top:10px;">
      <el-row :gutter="20">
        <el-col :span="12" :offset="2">
          <div class="definedFeedmain">
            <el-form
              :model="feedInfo"
              :rules="rules"
              ref="ruleForm"
              label-width="180px"
              class="demo-ruleForm"
            >
              <el-form-item label="选择数据源" v-if="feedInfo.inputProcessor !=null">
                <!--<el-radio v-model="radio" v-for="one in feedInfo.inputProcessors" :label="one" >{{one.name | translate}}</el-radio>-->
                <el-radio-group v-model="inputProcessorId">
                  <el-radio
                    v-for="inputProcessor in inputProcessors"
                    :label="inputProcessor.processorId"
                  >{{inputProcessor.name | toCN}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!--数据库-->
              <!--文件系统-->
              <div
                v-if="feedInfo.inputProcessor !=null&& (feedInfo.inputProcessor.feedPropertiesUrl == null || feedInfo.inputProcessor.feedPropertiesUrl == undefined)"
              >
                <!--radio === 'Filesystem'-->
                <el-form-item
                  v-for="property in feedInfo.inputProcessor.properties"
                  :label="property.key | translate"
                  v-if="property.userEditable"
                >
                  <el-input v-model="property.value"></el-input>
                </el-form-item>
              </div>

              <div v-if="!isIngestBool">
                <!--feedInfo.templateName !=='Data Ingest'-->
                <el-form-item
                  label="其他选项："
                  v-for="processor in feedInfo.nonInputProcessors"
                  v-if="processor.userEditable"
                >
                  <div
                    v-if="processor.feedPropertiesUrl == null  || processor.feedPropertiesUrl == undefined"
                  >
                    <el-form
                      label-width="100px"
                      v-for="property in processor.properties"
                      v-if="property.key!='CSV Header Definition' && property.key != 'index-columns' && !(property.processorName=='ConvertJSONToSQL' && property.key=='JDBC Connection Pool') "
                    >
                      <el-form-item
                        :label="property.key | translate"
                        v-if="property.renderType == null || !( property.renderType == 'checkbox-true-false' || property.renderType == 'checkbox-custom')"
                        :class="{'label-small md-container-ignore':property.renderWithCodeMirror || property.renderType =='radio'}"
                      >
                        <div v-if="!property.renderWithCodeMirror && !property.isLoading">
                          <el-input
                            v-model="property.value"
                            v-if="!property.sensitive && (property.renderType == 'text' || property.renderType == null)"
                          ></el-input>
                          <el-input
                            v-model="property.value"
                            v-if="property.renderType == 'number'"
                            ng-required="property.required"
                            ng-disabled="propertyDisabled"
                            type="number"
                          ></el-input>
                          <el-input
                            v-model="property.value"
                            v-if="property.renderType == 'password' || (property.renderType == 'text' && property.sensitive)"
                          ></el-input>
                          <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="property.value"
                            v-if="property.renderType == 'textarea'"
                          ></el-input>
                          <el-checkbox
                            v-model="property.value"
                            v-if="property.renderType == 'checkbox-true-false'"
                          >{{property.key}}</el-checkbox>
                          <el-checkbox
                            v-model="property.value"
                            v-if="property.renderType == 'checkbox-custom'"
                          >{{property.key}}</el-checkbox>
                          <el-radio-group
                            v-model="property.value"
                            v-if="property.renderType == 'radio' && property.propertyDescriptor.allowableValues != null "
                          >
                            <el-radio
                              :label="allowableValue.value"
                              :value="allowableValue.value"
                              v-for="allowableValue in property.propertyDescriptor.allowableValues"
                            >{{allowableValue.displayName}}</el-radio>
                          </el-radio-group>
                          <el-select
                            v-model="property.value"
                            filterable
                            placeholder="请选择"
                            @change="selectDataBase"
                            v-if="property.key!='JDBC Connection Pool'&& property.renderType == 'select' &&  (property.propertyDescriptor.allowableValues != null && property.propertyDescriptor.allowableValues.length > 0)"
                          >
                            <el-option
                              v-for="item in dataBaseArr"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-form-item>
              </div>

              <!--当为数据采集时-->
              <!--feedInfo.templateName ==='Data Ingest'-->
              <div
                v-if="isIngestBool && feedInfo.inputProcessor.name == 'Database'"
                style="margin-left:9%;"
              >
                <el-form label-width="120px">
                  <el-form-item label="源数据库连接">
                    <el-select
                      v-model="dataBaseValue"
                      filterable
                      style="width:50%"
                      placeholder="请选择"
                      @change="selectDataBase"
                    >
                      <!-- v-if="feedInfo.templateTableOption ==='DEFINE_TABLE'"-->
                      <el-option
                        v-for="item in dataBaseArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型表名">
                    <el-select
                      v-model="typeTableName"
                      style="width:50%"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="remoteMethod"
                      :loading="loading"
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in optionsTbaleName"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-form label-width="120px">
                  <el-form-item label="加载策略">
                    <el-radio-group v-model="strategyRadio" @change="changeStratege">
                      <el-radio
                        v-for="strategy in loadStrategyOptions"
                        :label="strategy.name"
                      >{{strategy.name | toCN}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="strategyRadio !== 'FULL_LOAD'" label="高阀值日期字段">
                    <el-select v-model="inTop" filterable @change="filterDateOption">
                      <el-option
                        v-for="item in tableFields"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                        v-if="item.derivedDataType ==='timestamp' || item.derivedDataType ==='date'"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-form label-width="120px">
                  <el-form-item label="输出类型">
                    <el-select v-model="outPutStr" placeholder="请选择" filterable>
                      <!-- @change="outPutChange"-->
                      <el-option
                        v-for="item in outPut"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--数据转换的两步  feedInfo.templateTableOption ==='DATA_TRANSFORMATION' -->
    <div v-show="isStep1" style="margin-top:10px;">
      <my-visualization
        @getVirData="nextPost"
        :nextShow="nextShow"
        @beforeClick="beforeClick_"
        :beforeShow="beforeShow"
        :dataBaseArr="dsListArr"
        ref="visua"
      ></my-visualization>
    </div>

    <!--步骤三 数据表-->
    <div v-show="isStepThird" style="margin-top:10px;">
      <el-row :gutter="20">
        <el-col :span="18" :offset="1">
          <div class="definedFeedmain">
            <el-collapse v-model="activeName" accordion>
              <!-- isRuleTemplate -->
              <el-collapse-item title="表信息" name="1" v-if="isRuleTemplate">
                <div>
                  <el-form
                    :model="ruleInfo"
                    :rules="ruleRules"
                    ref="ruleEngineForm"
                    label-width="100px"
                  >
                    <el-form-item label="数据库名" prop="targetDbName">
                      <el-input v-model="ruleInfo.targetDbName"></el-input>
                    </el-form-item>
                    <el-form-item label="数据表名" prop="targetTableName">
                      <el-row>
                        <el-col :span="16">
                          <el-input v-model="ruleInfo.targetTableName"></el-input>
                        </el-col>
                        <el-col :span="3" style="margin-left:10px;">
                          <el-button @click="createLibrary" size="small">创建变量库</el-button>
                          <!-- :disabled="!isCreateLibraryState" -->
                        </el-col>
                        <el-col :span="3" style="margin-left:10px;">
                          <el-button @click="handleRuleConfig" size="small">配置规则</el-button>
                          <!-- :disabled="isCreateLibraryState" -->
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="知识包名" prop="knowPackage">
                      <el-select
                        v-if="knowPackageState"
                        @click.native="getLoadPackagesList"
                        v-model="ruleInfo.knowPackage"
                        placeholder="规则引擎知识包名"
                        clearable
                        style="100%"
                      >
                        <!-- :disabled="!isSetLibraryState" -->
                        <el-option
                          v-for="rule in taskInfo.ruleList"
                          :label="rule.name"
                          :value="rule.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </el-collapse-item>
              <el-collapse-item
                title="选择方法:示例文件"
                name="2"
                v-if="isTansform && (feedInfo.inputProcessor!= null && feedInfo.inputProcessor.name != 'Database')"
              >
                <el-form :inline="true" :model="feedInfo" class="demo-form-inline">
                  <el-form-item>
                    <el-radio
                      v-model="selectMethod"
                      v-for="itemOption in this.tableCreateMethods"
                      :label="itemOption.name"
                      @change="ifIsHand"
                    >{{itemOption.name | translate}}</el-radio>
                  </el-form-item>
                </el-form>
                <!--手动 addColumn -->
                <div v-if="selectMethod !== 'Sample File'"></div>
                <!--示例文件上传-->
                <div v-if="selectMethod === 'Sample File'">
                  <el-form ref="form" :model="feedInfo" label-width="80px">
                    <el-form-item label="选择格式">
                      <el-select v-model="schemaParser" filterable placeholder="请选择">
                        <el-option
                          v-for="item in getSchemaParser"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <el-upload
                    class="upload-template"
                    ref="upload"
                    action="doUpload"
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :limit="1"
                  >
                    <el-button size="small" type="text" style="margin-top: 68px;">选择文件</el-button>
                    <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>

                    <!--   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                  </el-upload>
                  <el-button
                    type="primary"
                    @click.native="submitUploadFile()"
                    :disabled="fileName == ''"
                  >上传文件</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item title="表架构" name="tableJG">
                <el-button
                  size="mini"
                  type="text"
                  title="还原"
                  @click="returnFirst()"
                  style="float:right;margin-right: 8px;"
                >
                  <i class="fa fa-undo"></i>
                </el-button>
                <el-table
                  :data="feedInfo.table.tableSchema.fields"
                  stripe
                  style="width: 100%"
                  @row-click="setRowCol"
                >
                  <el-table-column label="字段名" width="180">
                    <template slot-scope="scope">
                      <el-input v-if="!scope.row.deleted" v-model="scope.row.name"></el-input>
                      <del v-if="scope.row.deleted">{{scope.row.name}}</del>
                    </template>
                  </el-table-column>
                  <el-table-column prop="derivedDataType" label="数据类型" width="120">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.derivedDataType"
                        placeholder="请选择"
                        :disabled="feedInfo.type === 'STANDARD'"
                      >
                        <!-- :disabled="scope.row.deleted" -->
                        <el-option
                          v-for="item in columnDefinitionDataTypes"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="选择标准字段"
                    width="120"
                    v-if="feedInfo.dsgProperties.standard && feedInfo.dsgProperties.standard.columns"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.nameEN"
                        filterable
                        clearable
                        placeholder="请选择"
                        @change="chooseStandard($event,scope.row)"
                      >
                        <el-option
                          v-for="item in feedInfo.dsgProperties.standard.columns"
                          :key="item.id"
                          :label="item.name_en "
                          :value="item.name_en"
                          :selected="item.name_en === scope.row.name"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createdTracker"
                    label="转换&验证"
                    width="180"
                    v-if="feedInfo.dsgProperties.standard && feedInfo.dsgProperties.standard.columns"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        circle
                        v-show="!(feedInfo.dsgProperties.standard &&feedInfo.dsgProperties.standard.columns)"
                        @click="openRule(scope.row)"
                      ></el-button>
                      <el-dialog :title="fieldName" :visible.sync="dialogRule" width="45%">
                        <!--标准化已添加的规则-->
                        <!--<div v-if="radio=='1'&&standerData.length>0">-->
                        <div class="ruleBox">
                          <el-row v-for="(item,index) in policyRules">
                            <el-col :span="19">
                              <span class="cont">1-{{index+1}}. {{item.type}}</span>
                              <span>{{item.type | translate}}</span>
                              <span style="color:green">({{item.displayName | translate}})</span>
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
                                    <p
                                      style="margin-top:6px;"
                                      v-if="property.displayName == 'Regex expression'"
                                    >正则表达式匹配示例:
                                      <br>^abc$ : 只匹配字符串"abc"
                                      <br>abc : 如果一个模式不包括^和$，那么它与任何包含该模式(包含abc)的字符串匹配
                                    </p>
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
                              </div>
                            </div>
                          </el-form>
                        </div>
                        <div>
                          <el-button
                            v-if="!isEditData"
                            type="text"
                            @click="addPolicy()"
                            class="add"
                          >添加规则</el-button>
                        </div>
                        <div style="text-align: right">
                          <el-button class="cancel" type="text" @click="dialogRule =false">取消</el-button>
                          <el-button class="complete" type="text" @click="doneRule()">完成</el-button>
                        </div>
                      </el-dialog>
                      <div
                        v-if="(scope.row.standardization != null && scope.row.standardization.length >0 || scope.row.validation != null && scope.row.validation.length >0)"
                      >
                        <el-tooltip
                          placement="bottom"
                          effect="light"
                          v-if="scope.row.standardization != null && scope.row.standardization.length >0"
                        >
                          <div slot="content">
                            <p
                              v-for="valid in scope.row.standardization"
                              :key="valid.name"
                            >{{valid.displayName | translate}}</p>
                          </div>
                          <el-button size="mini">{{scope.row.standardization.length}} 标准</el-button>
                        </el-tooltip>

                        <el-tooltip
                          placement="bottom"
                          effect="light"
                          v-if="scope.row.validation != null && scope.row.validation.length >0"
                        >
                          <div slot="content">
                            <p
                              v-for="valid in scope.row.validation"
                              :key="valid.name"
                            >{{valid.displayName | translate}}</p>
                          </div>
                          <el-button size="mini">{{scope.row.validation.length}} 验证</el-button>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="primaryKey" label="主键">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.primaryKey" :disabled="scope.row.deleted"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createdTracker" label="创建日期">
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.createdTracker"
                        :disabled="(scope.row.derivedDataType !=='date' && scope.row.derivedDataType !=='timestamp') || scope.row.deleted"
                      ></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="updatedTracker" label="更新日期">
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.updatedTracker"
                        :disabled="(scope.row.derivedDataType !=='timestamp' && scope.row.derivedDataType !=='date')|| scope.row.deleted"
                      ></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="mini"
                        @click="removeColumnDel(scope.$index)"
                        :disabled="scope.row.deleted"
                      >
                        <i class="fa fa-trash"></i>
                      </el-button>
                      <el-button type="primary" v-if=" scope.row.status === 1 && false">
                        <i class="fa fa-undo"></i>
                      </el-button>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column>
                                        <template slot-scope="scope">
                                            <el-button type="success" icon="el-icon-back" circle size="mini" @click="unDoColumnDel(scope.$index)" v-if="scope.row.deleted"></el-button>
                                        </template>
                  </el-table-column>-->
                </el-table>
                <el-button
                  type="success"
                  v-if="selectMethod !== 'Sample File'"
                  @click="addColumn()"
                >添加字段</el-button>
                <!-- @click="addColumn"-->
              </el-collapse-item>
              <el-collapse-item title="定义表分区" name="4">
                <el-row :gutter="20">
                  <el-col :span="6">源字段</el-col>
                  <el-col :span="6">分区公式</el-col>
                  <el-col :span="6">分区名称</el-col>
                  <el-col :span="6"></el-col>
                </el-row>
                <el-row :gutter="20" v-for="(partition,index) in feedInfo.table.partitions">
                  <el-col :span="6">
                    <el-select
                      v-model="partition.columnDef"
                      filterable
                      placeholder="请选择"
                      @change="onPartitionSourceFieldChange($event,partition)"
                      value-key="name"
                    >
                      <el-option
                        v-for="field in feedInfo.table.tableSchema.fields"
                        :key="field.name"
                        :label="field.name"
                        :value="field"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      filterable
                      placeholder="请选择"
                      v-model="partition.formula"
                      @change="onPartitionFormulaChange(partition)"
                    >
                      <el-option
                        v-for="item in partitionFunctions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-input
                      placeholder="请输入内容"
                      v-model="partition.field"
                      :disabled="partition.formula == 'val'"
                    ></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="removePartition(index)"
                    ></el-button>
                  </el-col>
                </el-row>
                <el-button type="success" @click.native="addPartition()">添加分区</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
        <el-col :span="5">
          <div
            style="border:1px solid #dddddd;min-height:300px;margin-left:4%;padding: 5px 20px;"
            v-if="isClickRow"
          >
            <p>字段详情</p>
            <el-tag type="warning">{{detalColName}}</el-tag>
            <el-form :model="detailRow" label-width="90px">
              <el-form-item label="示例字段值">
                <el-select v-model="detailRow.selectedSampleValue" placeholder="示例字段值">
                  <el-option
                    v-for="itemValue in detailRow.sampleValues"
                    :value="itemValue"
                  >{{itemValue}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="字段描述">
                <el-input type="textarea" v-model="detailRow.description"></el-input>
              </el-form-item>
              <!--   <el-form-item label="标签">
                                <el-input v-model="detailRow.tags" placeholder="添加一个标签"></el-input>
              </el-form-item>-->
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--步骤4 数据处理-->
    <div v-show="isStepfour" style="margin-top:10px;">
      <el-row :gutter="20">
        <el-col :span="18" :offset="1">
          <div class="definedFeedmain">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="数据信息" name="0" v-if="!isRuleTemplate">
                <el-form label-width="80px" ref="formFone" :model="ruleInfo">
                  <el-form-item label="数据库名" prop="targetDbName_2" :rules="formFoneR.req">
                    <el-autocomplete
                      class="inline-input"
                      style="width:50%"
                      v-model="ruleInfo.targetDbName_2"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入数据库名"
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="数据表名" prop="targetTableName_2" :rules="formFoneR.req">
                    <el-autocomplete
                      class="inline-input"
                      style="width:50%"
                      v-model="ruleInfo.targetTableName_2"
                      :fetch-suggestions="querySearch2"
                      placeholder="请输入数据表名"
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="表备注" prop="targetTableComment_2" :rules="formFoneR.req">
                    <el-input
                      v-model="ruleInfo.targetTableComment_2"
                      style="width:50%"
                      placeholder="请输入表备注"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="字段策略" name="1">
                <el-table :data="feedInfo.table.fieldPolicies" stripe style="width: 100%">
                  <el-table-column prop="name" label="字段名" width="180"></el-table-column>
                  <el-table-column>
                    <template slot-scope="scope" slot="header">
                      <el-checkbox v-model="checkAllIndex" @change="handleCheckAllChangeIndex"></el-checkbox>
                      <span>索引</span>
                    </template>
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.index" @change="handleCheckItemChange"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope" slot="header">
                      <el-checkbox v-model="checkAllProfile" @change="handleCheckAllChangeProfile"></el-checkbox>
                      <span>配置文件</span>
                    </template>
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.profile"
                        @change="handleCheckItemChangeProfile"
                      ></el-checkbox>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="选择标准字段"
                    v-if="feedInfo.dsgProperties.standard &&feedInfo.dsgProperties.standard.columns"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.nameEN"
                        filterable
                        clearable
                        placeholder="请选择"
                        @change="chooseStandard($event,scope.row)"
                      >
                        <el-option
                          v-for="item in feedInfo.dsgProperties.standard.columns"
                          :key="item.id"
                          :label="item.name_en "
                          :value="item.name_en"
                          :selected="item.name_en === scope.row.name"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column prop="createdTracker" label="转换&验证">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        circle
                        v-show="!(feedInfo.dsgProperties.standard &&feedInfo.dsgProperties.standard.columns)"
                        @click="openRule(scope.row)"
                      ></el-button>
                      <el-dialog :title="fieldName" :visible.sync="dialogRule" width="45%">
                        <!--标准化已添加的规则-->
                        <!--<div v-if="radio=='1'&&standerData.length>0">-->
                        <div class="ruleBox">
                          <el-row v-for="(item,index) in policyRules">
                            <el-col :span="19">
                              <span class="cont">1-{{index+1}}. {{item.type}}</span>
                              <span>{{item.type | translate}}</span>
                              <span style="color:green">({{item.description}})</span>
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
                                    <p
                                      style="margin-top:6px;"
                                      v-if="property.displayName == 'Regex expression'"
                                    >正则表达式匹配示例:
                                      <br>^abc$ : 只匹配字符串"abc"
                                      <br>abc : 如果一个模式不包括^和$，那么它与任何包含该模式(包含abc)的字符串匹配
                                    </p>
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
                          <el-button class="cancel" type="text" @click="dialogRule =false">取消</el-button>
                          <el-button class="complete" type="text" @click="doneRule()">完成</el-button>
                        </div>
                      </el-dialog>
                      <span
                        v-if="(scope.row.standardization != null && scope.row.standardization.length >0 || scope.row.validation != null && scope.row.validation.length >0)"
                      >
                        <el-tooltip
                          placement="bottom"
                          effect="light"
                          v-if="scope.row.standardization != null && scope.row.standardization.length >0"
                        >
                          <div slot="content">
                            <p
                              v-for="valid in scope.row.standardization"
                              :key="valid.name"
                            >{{valid.displayName | translate}}</p>
                          </div>
                          <el-button size="mini">{{scope.row.standardization.length}} 标准</el-button>
                        </el-tooltip>

                        <el-tooltip
                          placement="bottom"
                          effect="light"
                          v-if="scope.row.validation != null && scope.row.validation.length >0"
                        >
                          <div slot="content">
                            <p
                              v-for="valid in scope.row.validation"
                              :key="valid.name"
                            >{{valid.displayName | translate}}</p>
                          </div>
                          <el-button size="mini">{{scope.row.validation.length}} 验证</el-button>
                        </el-tooltip>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="选择合并去重" name="2">
                <!--<el-tooltip class="item" effect="dark" content="替换整个表内容" placement="bottom">
                          <el-radio v-model="selectAdll" label="1">同步</el-radio>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="替换匹配分区中的内容" placement="bottom">
                          <el-radio v-model="selectAdll" label="2" disabled >滚动同步</el-radio>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="插入所有行" placement="bottom">
                          <el-radio v-model="selectAdll" label="3">合并</el-radio>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="插入忽略重复行" placement="bottom">
                          <el-radio v-model="selectAdll" label="4">重复和合并</el-radio>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="使用主键的Upsert" placement="bottom">
                          <el-radio v-model="selectAdll" label="5" disabled >使用主键合并</el-radio>
                </el-tooltip>-->
                <el-radio-group v-model="feedInfo.table.targetMergeStrategy">
                  <el-radio
                    v-for="strategy in mergeStrategies"
                    :value="strategy.type"
                    :label="strategy.type"
                    :disabled="strategy.disabled"
                  >{{strategy.name | translate}}</el-radio>
                </el-radio-group>
              </el-collapse-item>
              <el-collapse-item title="选择目标格式" name="3">
                <el-form label-width="80px">
                  <el-form-item label="目标格式">
                    <el-select
                      v-model="feedInfo.table.targetFormat"
                      filterable
                      placeholder="请选择"
                      @change="onTableFormatChange()"
                    >
                      <el-option
                        v-for="item in targetFormatOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="压缩选项">
                    <el-select
                      v-model="feedInfo.table.options.compressionFormat"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in compressionOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="选项">
                    <el-checkbox v-model="feedInfo.options.skipHeader">跳过标题行</el-checkbox>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--步骤5 属性-->
    <div v-show="isStepFive" style="margin-top:10px;">
      <el-row :gutter="20">
        <el-col :span="12" :offset="2">
          <div class="definedFeedmain">
            <el-form label-width="80px" :model="feedInfo">
              <el-form-item label="数据所属">
                <el-input v-model="feedInfo.dataOwner"></el-input>
              </el-form-item>
              <el-form-item label="属性">
                <div>
                  <el-row :gutter="20" v-for="(property,index) in propertyList">
                    <el-col :span="6">
                      <el-input v-model="property.systemName" placeholder="属性"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="property.value" placeholder="值"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="removePropertyFeed(index)"
                      ></el-button>
                    </el-col>
                  </el-row>
                  <el-button type="success" @click="addProperty()">添加属性</el-button>
                </div>
              </el-form-item>
              <el-form-item label="标签">
                <el-input v-model="tag"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--步骤7 时间表-->
    <div v-show="isStepSeven" style="margin-top:10px;margin-left:9%;">
      <el-row :gutter="20">
        <el-col>
          <div class="definedFeedmain">
            <el-form :inline="true" :model="feedInfo" class="demo-form-inline">
              <el-form-item label="策略">
                <el-select
                  v-model="feedInfo.schedule.schedulingStrategy"
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
                <el-select v-model="timerUnits" placeholder="请选择" @change="handleTimerChange()">
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
                <el-input v-model="feedInfo.schedule.schedulingPeriod"></el-input>
              </el-form-item>
              <el-form-item label="cron预览" v-if="isCron">
                <ul class="crolUl">
                  <li v-for="item in cronExpression">{{item}}</li>
                </ul>
              </el-form-item>
            </el-form>
            <div style="margin-top: 20px;">
              <el-checkbox
                v-model="feedInfo.active"
                :disabled="feedInfo.view.schedule.disabled || feedInfo.view.schedule.active.disabled"
              >立即启用流程</el-checkbox>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <el-col :span="5" :offset="20">
        <el-button
          style="margin-top: 12px;"
          @click="beforeClick"
          :disabled="beforeButton"
          v-show="!((active===2)&& isTransformBool)"
        >上一步</el-button>
        <!--feedInfo.templateName==='Data Transformation'-->
        <el-button
          style="margin-top: 12px;"
          @click="next"
          v-if="isFinash"
          href="#steps"
          v-show="!((active===2)&& isTransformBool)"
          :disabled=" mustChoose || !(/\w+/.test(feedInfo.systemFeedName)) || nextDisabled || nextDisabledRule || nextDisabledTable || nextDisabledIngest"
        >下一步</el-button>
        <!-- || (active===3&&!isSetLibraryState） -->
        <!--feedInfo.templateName==='Data Transformation'-->
        <el-button style="margin-top: 12px;" @click="saveFeedPost()" v-if="isSaveBtn">保存</el-button>
      </el-col>
    </el-row>

    <!-- 配置规则 -->
    <el-dialog title="配置规则" :visible.sync="dialogRuleConfigVisible" width="100%" :fullscreen="true">
      <div slot="title">
        <span style="line-height: 24px;font-size: 18px; color: #303133;">配置规则</span>
        <el-button @click="reloadComponent" type="text" style="margin-left:5px" title="刷新">
          <i class="fa fa-refresh"></i>
        </el-button>
      </div>

      <rule-link-cont @saveRule="saveRule" v-if="ruleIf"></rule-link-cont>
    </el-dialog>
  </div>
</template>
<script>
// 数据源的默认值
const DEFAULT_DATASOURCE = { name: 'Hive', id: 'Hive' }
import {  datasource, datasourceTable, getCategories, getRegisteredTemplateAllProperty,
  uploadFile, getSchemaParser, getPartitionFunctions, getCronExpression, saveFeed,
  getDataBaseArr, getTbaleName, getTbales, getFeedValidation, getFeedStandardization,
  setLibrary, checkName, saveLibrary, getLoadPackages, getSchemasName, getAllTablesFS} from '../../api/dataLake/api'
import { transform, getUserDatasource, getHiveTables, baseInfo, transform2 } from '../../api/dataLake/api'
import { handleParams } from '@/utils/workflow/common'
import jsplumb from 'jsplumb'
import { translateJsonData } from '../../utils/translate'
import { toTreeData } from '@/utils/workflow/tree.js'
import SearchTree from '@/views/dataLake/dataSource/components/SearchTree'
import myVisualization from './visualization.vue'
import RuleLinkCont from './components/RuleLinkCont.vue'
import { tree } from '../../api/dataSource/subject';
import { getRuleName } from '@/api/ruleSet/index.js'
// import _ from 'lodash';
export default {
  components: {
    SearchTree,
    myVisualization,
    RuleLinkCont
  },
  data () {
    const validOtherName = (rule, value, callback) => {
      console.log('====================================355454632')
      const reg = /[a-zA-Z]\w*/
      if (value === '') {
        callback(new Error('不能为空'));
      } else if (!(reg.test(value) || value === '')) {
        callback(new Error('不能输入中文和特殊符号且不能为数字开头'));
      } else {
        callback()
      }
    };
    const validRuleName = (rule, value, callback) => {
      if (this.isSetLibraryState) {
        callback()
        return;
      }
      this.isCreateLibraryState = false
      console.log('=========================12312312------------------')
      const reg = /[a-zA-Z]\w*/
      const obj = { fullFileName: `/${this.ruleName}/${this.ruleInfo.targetTableName}.vl.xml` }
      checkName(obj).then(res => {
        console.log(res)
        console.log(res.valid)
        return res.valid
      })
      if (value === '') {
        callback(new Error('不能为空'));
      } else if (!(reg.test(value) || value === '')) {
        callback(new Error('不能输入中文和特殊符号且不能为数字开头'));
      } else {
        const obj = { fullFileName: `/${this.ruleName}/${this.ruleInfo.targetTableName}.vl.xml` }
        checkName(obj).then(res => {
          if (res.valid) {
            callback()
            this.isCreateLibraryState = true
          } else {
            callback(new Error('已存在'));
          }
        })
      }
    };
    return {
      knowPackageState: true,
      historyTB: [],
      ruleName: '', // 规则库的名字
      schemaList: [],
      schemaTabList: [],
      ruleIf: true,
      formFoneR: {
        req: [{ required: true, message: '该项不能为空' }]
      },
      transformData: {},
      choosedConId: '',
      dsListArr: [],
      standardV: false,
      modelV: false,


      dialogRuleConfigVisible: false,
      beforeShow: true,
      nextShow: true,
      taskInfo: {
        ruleList: []
      }, // 任务信息
      ruleInfo: { // 规则新增的
        sql: '',
        targetTableName: '',
        targetDbName: '',
        fields: [],
        knowPackage: ''
      },
      isRuleTemplate: false, // 是否为规则引擎模板
      baseInfoObj: {
        isDisabled: true,
        standardOptions: [{ value: '选项1', label: '黄金糕' }],
        modelOptions: [{ value: '选项1', label: '黄金糕' }]
      }, // 基本信息对象（古元坤）
      //当转换之后的字段
      newFieldTransArr: [],
      newFieldTrans: {
        name: '',
        description: '',
        derivedDataType: 'string',
        precisionScale: null,
        dataTypeDisplay: '',
        primaryKey: false,
        nullable: false,
        createdTracker: false,
        updatedTracker: false,
        sampleValues: [],
        selectedSampleValue: '',
        tags: [],
      },
      //判断是否为数据转换
      isTransformBool: false,
      //判断是否为数据采集
      isIngestBool: false,
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

      checkedRes: [],
      treeData: null, //树形数据
      treeState: false, //树形菜单的显示
      ClearTableName: "",  //清除类型表名
      common: {
        maxConnections: 1
      },
      tempFeedInfo: {}, // 临时存储数据
      isTempFeedInfo: false,
      isTansform: true,
      loadding: false,
      saveLoadding: false,
      columnsData: {},
      tableData: [],
      step1: true,
      pzArr: [],
      regChinese: false, //显示验证是否为中文
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
      Type: ['Hive'],
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
      sqlDisabled: true,
      signArr: ['>', '>=', '==', '<=', '<'],
      rules: {
        required: [
          { required: true, message: '该项为必填' }
        ],
        targetTableName: [
          { required: true, message: '该项为必填', trigger: 'blur' },
          { validator: validOtherName }
        ],
        targetDbName: [
          { required: true, message: '该项为必填', trigger: 'blur' },
          { validator: validOtherName }
        ],
        otherName: [
          { validator: validOtherName }
        ]
      },
      isStep1: false,
      isStep2: false,
      getTemplateInfoList: {},
      templateId: '',
      tag: '',
      active: 0,
      isFinash: true,
      beforeButton: true,
      isSaveBtn: false,
      isStepFirst: true,
      isStepSecond: false,
      isStepThird: false,
      isStepfour: false,
      isStepFive: false,
      isStepSix: false,
      isStepSeven: false,
      isTransform: false,
      activeName: '0',
      radio: 'Filesystem',
      selectMethod: 'Sample File',
      selectAdll: '1',
      isTimer: false,
      isCron: true,
      isStartFeed: false,
      input: '',
      uploadFormatText: '',
      fileList: [],
      fileName: "",
      files: {},
      partitionFunctions: [],
      schemaParser: {},
      getSchemaParser: {},
      postSchemaParser: "",
      defalutVal: "CSV",
      fields: [],
      isTypeOfDate: true,
      detalColName: '',
      dataBaseType: "", //第二步
      inTop: '',
      dataBaseArr: [],
      tableName: [],
      optionsTbaleName: [],
      value9: '',
      list: [],
      loading: false,
      strategyRadio: 'FULL_LOAD',
      loadStrategyOptions: [{ name: 'FULL_LOAD', type: 'SNAPSHOT', strategy: 'FULL_LOAD', hint: 'Replace entire table' }, {
        name: 'INCREMENTAL', type: 'DELTA', strategy: 'INCREMENTAL', hint: 'Incremental load'
          + ' based on a '
          + ' high watermark', incremental: true, restrictDates: true
      }],
      tableSampleValues: [],
      detailRow: {},
      isClickRow: false,
      selectPartition: "",
      partitionColumnDef: "",
      compressionOptions: ['NONE'],
      useUnderscoreInsteadOfSpaces: true,
      propertyList: [], //属性列表
      checkAllIndex: false, //索引的全选
      checkedAllShops: [],
      checkItemData: [],
      checkAllProfile: true, //配置全选
      checkIndexModel: false,
      allScheduleStrategies: [
        { label: "Timer", value: "TIMER_DRIVEN" }, { label: "Cron", value: "CRON_DRIVEN" }],  /*, {label: "Trigger/Event", value: "TRIGGER_DRIVEN"},
                    {label: "On primary node", value: "PRIMARY_NODE_ONLY"}*/
      scheduleStrategies: [],
      timerAmount: 5,
      timerUnits: 'min',
      schemaTime: [{ value: 'hrs', label: '小时' }, { value: 'days', label: '天' }, { value: 'min', label: '分钟' }, { value: 'sec', label: '秒' }],
      cronExpression: [],
      dialogRule: false, // 规则模态框隐藏
      selectedOptionType: 'standardization',
      optionTypes: [{ type: 'standardization', name: 'Standardization' }, { type: 'validation', name: 'Validation' }],//规则验证
      cronLi: [{
        value: '2018/11/12'
      }, {
        value: '2018/11/11'
      }, {
        value: '2018/11/10'
      }],
      isClustered: true,
      supportsExecutionNode: true,
      getCategory: [],

      createFeedModel: {},
      /**
       * The Feed Model that is being Edited when a user clicks on a Feed Details
       */
      editFeedModel: {},

      viewFeedModel: {},
      //验证/标准化
      standardizers: [],
      newTableFieldDefinition: function () {
        var newField = {
          sourceName: '',
          name: '',
          description: '',
          derivedDataType: 'string',
          precisionScale: null,
          dataTypeDisplay: '',
          primaryKey: false,
          nullable: false,
          createdTracker: false,
          updatedTracker: false,
          sampleValues: [],
          selectedSampleValue: '',
          tags: [],
          validationErrors: {
            name: {},
            precision: {}
          },
          isValid: function () {
            return this.name != '' && this.derivedDataType != '';
          },
          _id: _.uniqueId()
        };
        return newField;
      },
      /**
       * The initial CRON expression used when a user selects Cron for the Schedule option
       */

      compressionMethods: { "STORED AS ORC": ['NONE', 'SNAPPY', 'ZLIB'], "STORED AS PARQUET": ['NONE', 'SNAPPY'], "AVRO": ['NONE'] },

      /**
       * In the Data Processing section these are the available Strategies a user can choose when defining the feed
       */
      mergeStrategies: [
        { name: 'Sync', type: 'SYNC', hint: 'Replace table content', disabled: false },
        { name: 'Rolling sync', type: 'ROLLING_SYNC', hint: 'Replace content in matching partitions' },
        { name: 'Merge', type: 'MERGE', hint: 'Insert all rows', disabled: false },
        { name: 'Dedupe and merge', type: 'DEDUPE_AND_MERGE', hint: 'Insert rows ignoring duplicates', disabled: false },
        { name: 'Merge using primary key', type: 'PK_MERGE', hint: 'Upsert using primary key' }
      ],

      /**
       * The available Target Format options
       */
      targetFormatOptions: [
        { label: "ORC", value: 'STORED AS ORC' },
        { label: "PARQUET", value: 'STORED AS PARQUET' },
        { label: "AVRO", value: 'STORED AS AVRO' },
        {
          label: "TEXTFILE",
          value: 'ROW FORMAT SERDE \'org.apache.hadoop.hive.serde2.OpenCSVSerde\' WITH SERDEPROPERTIES ( \'separatorChar\' = \',\' ,\'escapeChar\' = \'\\\\\' ,\'quoteChar\' = \'"\')'
            + ' STORED AS'
            + ' TEXTFILE'
        },
        { label: "RCFILE", value: 'ROW FORMAT SERDE "org.apache.hadoop.hive.serde2.columnar.ColumnarSerDe" STORED AS RCFILE' }],
      /**
       * The available Compression options for a given targetFormat {@see this#targetFormatOptions}
       */

      /**
       * Standard data types for column definitions
       */
      columnDefinitionDataTypes: ['string', 'int', 'bigint', 'tinyint', 'decimal', 'double', 'float', 'date', 'timestamp', 'boolean', 'binary'],
      DEFAULT_CRON: "0 0 12 1/1 * ? *",
      tableCreateMethods: [{ type: 'MANUAL', name: 'Manual' }, { type: 'SAMPLE_FILE', name: 'Sample File' }],
      feedInfo: {
        standard: '', // 标准
        model: '', // 模型
        type: '', // 输出表类型
        id: null,
        versionName: null,
        templateId: '',
        feedName: '',
        description: '',
        systemFeedName: '',
        inputProcessorType: '',
        inputProcessorName: null,
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
        options: { skipHeader: true },
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
          "to_hbase": {},
          'interface': {},
          standard: [],
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      value8: '',
      strategySelect: 'Timer',
      schemaTimeSelect: '分钟',
      sourceCol: "",
      partitionFormula: "",
      partitionName: "",
      formInline: {
        user: '',
        region: '',
        cronData: ""
      },
      control: {
        owner: ''
      },
      num8: 1,
      /*验证*/
      radiotest: '1',//验证规则弹窗单选
      collapsed: false,
      isEditData: false,//是否在编辑规则
      standerForm: { type: '' },
      verifyForm: { type: '' },
      standerData: [],//标准化数据
      verifyData: [],//验证数据
      dialogVisible: false,
      verifyText: '',//验证的文字
      currIndex: '',//当前正在编辑的规则序号
      fieldIndex: '',//字段的索引
      fieldName: '',//当前选中的字段名

      customPropertyRendering: ["metadata.table.targetFormat", "metadata.table.feedFormat"],
      GET_TABLE_DATA_PROCESSOR_TYPE: "com.thinkbiganalytics.nifi.GetTableData",
      GET_TABLE_DATA_PROCESSOR_TYPE2: "com.thinkbiganalytics.nifi.v2.ingest.GetTableData",
      WATERMARK_PROCESSOR: 'com.thinkbiganalytics.nifi.v2.core.watermark.LoadHighWaterMark',
      SQOOP_PROCESSOR: 'com.thinkbiganalytics.nifi.v2.sqoop.core.ImportSqoop',
      inputProcessors: [],
      inputChangedCounter: 0,
      inputProcessorId: null,
      nonPro: {},
      orginNonPro: "",
      tableSchema: null,
      originalTableFields: [],
      tableFields: null,

      //第二步
      dataBaseValue: "",
      typeTableName: '',
      outPut: [{ name: 'DELIMITED', value: 'DELIMITED' }, { name: 'AVRO', value: 'AVRO' }],
      outPutStr: "DELIMITED",
      dataTransformScript: "",
      datasourceIds: [],




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


      // 接收数据转换的值
      isSetLibraryState: false, // 判断变量库是否创建成功
      isCreateLibraryState: false, // 判断创建变量按钮是否可以点击
      PackagesTimer: null, // 获取知识包的定时器
      transformFeedInfo: {},
      transCon: {},
      ruleRules: {
        targetTableName: [{ required: true, message: '必填', trigger: 'change' },
        { validator: validRuleName, trigger: 'change' }],
        targetDbName: [{ required: true, message: '必填', trigger: 'blur' },
        { validator: validOtherName, trigger: 'blur' }]
      }
    }
  },
  computed: {
    mustChoose () {
      return this.feedInfo.systemFeedName == '' || this.feedInfo.feedName == '' || this.feedInfo.templateName == '' || !this.feedInfo.dsgProperties.subjectID
    },
    nextDisabled () {
      return !this.isRuleTemplate && this.isStepfour === true && (!this.ruleInfo.targetDbName_2 || !this.ruleInfo.targetTableName_2 || !this.ruleInfo.targetTableComment_2)
    },
    nextDisabledRule () {
      return this.isRuleTemplate && this.isStepThird && (!this.ruleInfo.targetDbName || !this.ruleInfo.targetTableName || !this.ruleInfo.knowPackage)
    },
    nextDisabledTable () {
      if (this.isRuleTemplate) {
        return false
      }
      else if (this.feedInfo.type === 'STANDARD') {
        let sign = 0
        console.log(`***********
         ***************`)
        console.log(this.feedInfo.dsgProperties.standard.columns.length)
        console.log(this.feedInfo.table.tableSchema.fields.length)
        this.feedInfo.table.tableSchema.fields.forEach(el => {
          if (!el.nameEN) {
            sign = 1
          }
        })
        return this.isStepThird && (sign === 1 || this.feedInfo.dsgProperties.standard.columns.length !== this.feedInfo.table.tableSchema.fields.length)
      }

    },
    nextDisabledIngest () {
      return !this.isTransformBool && this.isStepSecond && (!this.dataBaseValue || !this.typeTableName)
    }
  },
  watch: {
    'activeName' (val) {
      console.log("9999999999999999999999999999999999999")
      console.log(val)
      if (val == 1) {
        this.feedInfo.table.fieldPolicies = this.getDefaultSelect(this.feedInfo.table.fieldPolicies)
        if (this.feedInfo.table.tableSchema.fields) {
          this.setTableFields(this.feedInfo.table.tableSchema.fields);
        }
      }
      else if (val === 'tableJG') {
        this.feedInfo.table.tableSchema.fields = this.getDefaultSelect(this.feedInfo.table.tableSchema.fields)
      }
    },
    'ruleInfo.targetDbName_2' (val) {
      if (val) this.getSchemasTableList(val)
    },
    'baseInfoObj.isDisabled' (val) { // 改变基本信息系统名称
      if (val) {
        this.feedInfo.systemFeedName = this.getUUid()

      }
      else {
        this.feedInfo.systemFeedName = ''
      }
    },
    containers (val) {
      // val.length === 0 ? this.editSQLDis = true : this.editSQLDis = false

      let sign = 0
      val.map((one, index) => {
        if (one.dataSourceId !== 'Hive') {
          sign = 1
          return false
        }
      })
      if (val.length === 0) this.goStep2Dis = true
      else if (val.length === 1) this.goStep2Dis = false
      sign === 1 && val.length > 1 && this.connections.length === 0 ? this.goStep2Dis = true : this.goStep2Dis = false

    },
    connections (val2) {
      let val = this.containers
      val.length === 0 ? this.goStep2Dis = true : this.goStep2Dis = false
      let sign = 0
      val.map((one, index) => {
        if (one.dataSourceId !== 'Hive') {
          sign = 1
          return false
        }
      })
      if (val.length === 0) this.goStep2Dis = true
      else if (val.length === 1) this.goStep2Dis = false
      sign === 1 && val.length > 1 && val2.length === 0 ? this.goStep2Dis = true : this.goStep2Dis = false

    },
    zzz (val) {
      if (val !== 'Hive') {
        let params = { id: val, name: '' };
        datasource(params).then(res => {
          let arr = []
          res.map(one => {
            let json = { value: one }
            arr.push(json)
          })
          this.restaurants = arr
        })
      }
      else {
        this.restaurants = [...this.HiveTable]
      }
      this.zzz2 = ''
    },
    filterType (val) {
      if (val) {
        this.$message({ type: 'success', message: '已进入高级模式' })
        this.sqlDisabled = true
      }
      else {
        this.$message({ type: 'success', message: '已进入简单模式' })
        this.sqlDisabled = false
      }
    },
    // 'feedInfo.feedName' (val) {
    //   console.log(val)
    //   let str = '';
    //   str = val.toLowerCase();
    //   if (val !== null && val !== "") {
    //     let reg = /[\u4e00-\u9fa5]/g;
    //     this.feedInfo.systemFeedName = str.replace(reg, "");
    //   }
    // },
    'inputProcessorId' (val) {
      this.updateInputProcessor(val)
    },
    /* 'feedInfo.category.name'(val) {
      console.log(this.getCategory);
      let cateGoryLength = this.getCategory.length;
      for (let x = 0; x < cateGoryLength; x++) {
        if (this.feedInfo.category.name === this.getCategory[x].name) {
          this.feedInfo.category.id = this.getCategory[x].id;
          this.feedInfo.category.systemName = this.getCategory[x].systemName;
        }
      }
    }, */
    'tag' (val) {
      this.tag = val;
    },
    schemaParser: function (val, oldVal) {
      console.log(val)
      console.log(oldVal)
      this.getSchemaParser.map(function (item) {
        if (val == item.name) {
          console.log(item);
          return item.name;
        }
      })
    }
  },
  methods: {
    handleSql (sql) {
      const str1 = sql.slice(sql.indexOf('("') + 2, sql.indexOf('")'))
      return str1
    },
    returnFirst () {
      this.feedInfo.table.tableSchema.fields = this.getDefaultSelect(this.historyTB)
    },
    //
    getDefaultSelect (params) {
      params = params.map(el => {
        if (this.feedInfo.dsgProperties.standard) {
          this.feedInfo.dsgProperties.standard.columns.map(el2 => {
            if (el.name == el2.name_en) {
              console.log('*')
              el.nameEN = el2.name_en
              el.standardization = el2.standardization
              el.validation = el2.validation
              el.derivedDataType = el2.datatype
            }
          })
        }
        return el
      })
      return params
    },
    // 获取知识包库名
    getRuleName () {
      getRuleName().then(data => {
        this.ruleName = data ? data : ''
      })
    },
    querySearch (queryString, cb) {
      let restaurants;
      restaurants = [...this.schemaList]
      console.log(restaurants)
      let results;
      if (queryString) {
        let arr = [];
        restaurants.forEach(one => {
          if (one.value.indexOf(queryString) > -1) {
            arr.push(one)
          }
        })
        results = arr
      }
      else {
        results = restaurants
      }
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch2 (queryString, cb) {
      let restaurants;
      restaurants = [...this.schemaTabList]
      console.log(restaurants)
      let results;
      if (queryString) {
        let arr = [];
        restaurants.forEach(one => {
          if (one.value.indexOf(queryString) > -1) {
            arr.push(one)
          }
        })
        results = arr
      }
      else {
        results = restaurants
      }
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getSchemasList () {
      getSchemasName().then(res => {
        let arr = []
        res.forEach(el => { arr.push({ value: el }) })
        this.schemaList = arr
      })
    },
    getSchemasTableList (name) {
      getAllTablesFS(name).then(res => {
        let arr = []
        res.forEach(el => { arr.push({ value: el }) })
        this.schemaTabList = arr
      })
    },
    chooseStandard (val, row) {
      console.log(val)
      if (val) {
        this.feedInfo.dsgProperties.standard.columns.forEach(one => {
          if (one.name_en === val) {
            row.standardization = one.standardization
            row.validation = one.validation
            row.derivedDataType = one.datatype
          }
        })
      }
      else {
        row.standardization = []
        row.validation = []
      }

    },
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
    reloadComponent () {
      this.ruleIf = false
      this.$nextTick(() => {
        this.ruleIf = true
      })
    },
    showHide (val) {
      console.log('标准')
      console.log(this.feedInfo)
      if (this.isRuleTemplate) {
        this.feedInfo.type = 'RULE'
      }
      else {
        if (!this.feedInfo.dsgProperties.standard && !this.feedInfo.dsgProperties.model) {
          this.modelV = false
          this.standardV = false
          this.feedInfo.type = 'BASE'
          this.feedInfo.dsgProperties.standardId = ''
          this.feedInfo.dsgProperties.modelId = ''
        } else if (this.feedInfo.dsgProperties.standard && this.feedInfo.dsgProperties.standard.columns) {
          this.modelV = true
          this.standardV = false
          this.feedInfo.type = 'STANDARD'
          this.feedInfo.dsgProperties.standardId = this.feedInfo.dsgProperties.standard.id
          this.feedInfo.dsgProperties.modelId = ''
        } else if (this.feedInfo.dsgProperties.model && this.feedInfo.dsgProperties.model.columns) {
          this.modelV = false
          this.standardV = true
          this.feedInfo.type = 'MODEL'
          this.feedInfo.dsgProperties.standardId = ''
          this.feedInfo.dsgProperties.modelId = this.feedInfo.dsgProperties.model.id
        }
      }

      // 以前的
      /* if (this.feedInfo.dsgProperties.standard.columns === undefined && this.feedInfo.dsgProperties.model.columns === undefined) {
        this.modelV = false;
        this.standardV = false;
        this.feedInfo.type = 'BASE'
      } else if (this.feedInfo.dsgProperties.standard.columns !== undefined) {
        this.modelV = true;
        this.standardV = false;
        this.feedInfo.type = 'STANDARD'
      } else if (this.feedInfo.dsgProperties.model.columns !== undefined) {
        this.modelV = false;
        this.standardV = true;
        this.feedInfo.type = 'MODEL'
      } */
    },
    // 配置规则
    handleRuleConfig () {
      if (!this.ruleInfo.targetTableName) {
        this.$message.warning('数据表名不能为空')
        return;
      }
      this.isSetLibraryState = true;
      this.savesFile()
      this.dialogRuleConfigVisible = true
    },
    // 保存规则配置
    saveRule () {
      this.knowPackageState = false
      this.dialogRuleConfigVisible = false
      this.ruleInfo.knowPackage = ''
      this.getLoadPackagesList()
    },
    beforeClick_ () {
      this.beforeClick()
    },
    filedMes () {
      if (this.isTransformBool || this.isRuleTemplate) {
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
        this.feedInfo.table.fieldPolicies = arrTans;
      }
    },
    nextPost (data) {
      this.contaners = data.contaners
      this.connections = data.connections
      this.resultColumsRel = data.resultColumsRel
      this.transformData = data.transformData
      this.zzz = data.cDataSource
      this.SQLStr = data.SQLStr
      this.active = 2
      this.ruleInfo.sql = this.handleSql(this.SQLStr)
      this.filedMes()
      console.log(this.resultColumsRel)
      this.next()
    },
    getUUid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return ('feed_' + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    submitzz () {
      this.pzArr.push({ sourceKey: this.sourceKey, targetKey: this.targetKey })
      this.modalzzz = false;
      this.booleanConnect = true;
      this.isShowSure = true;
      this.$message({
        type: 'success',
        message: '关联成功'
      })
      this.getAllConnection()
      console.log(this.jsPlumb.getAllConnections())
      console.log(this.containers)
    },
    closezz () {
      this.pzArr.splice(-1, 1)
      this.modalzzz = false;
      this.booleanConnect = false;
      this.$message({
        type: 'info',
        message: '已取消关联'
      })
      this.jsPlumb.deleteConnectionsForElement(this.conn.sourceId, this.conn.targetId)
      this.getAllConnection()
    },
    regChineseMethod () {
      this.regChinese = true;
    },
    isCustomPropertyRendering: function (key) {
      var custom = _.find(this.customPropertyRendering, function (customKey) {
        return key == customKey;
      });
      return custom !== undefined;
    },
    initSensitivePropertyForEditing (property) {
      var self = this;
      if (property.sensitive && !self.isMasked(property.value)) {
        property.encryptedValue = property.value;
        property.value = '******';
      }
    },
    isMasked (value) {
      return value != null && _.every(value.split(''), function (char) {
        return char == '*';
      });
    },
    updateDisplayValue (property) {
      property.displayValue = property.value;
      if (property.key == "Source Database Connection" && property.propertyDescriptor != undefined && property.propertyDescriptor.allowableValues) {
        var descriptorOption = _.find(property.propertyDescriptor.allowableValues, function (option) {
          return option.value == property.value;
        });
        if (descriptorOption != undefined && descriptorOption != null) {
          property.displayValue = descriptorOption.displayName;
        }
      }
    },
    isGetTableDataProcessor: function (processor) {
      return this.GET_TABLE_DATA_PROCESSOR_TYPE == processor.type || this.GET_TABLE_DATA_PROCESSOR_TYPE2 == processor.type;
    },
    isWatermarkProcessor: function (processor) {
      return this.WATERMARK_PROCESSOR == processor.type;
    },
    removeNonUserEditableProperties (processorArray, keepProcessorIfEmpty) {
      let getThis = this;
      //only keep those that are userEditable:true
      let validProcessors = [];
      let processorsToRemove = [];
      //temp placeholder until Register Templates allows for user defined input processor selection

      _.each(processorArray, function (processor, i) {
        processor.allProperties = processor.properties;

        var validProperties = _.reject(processor.properties, function (property) {
          return !property.userEditable;
        });


        processor.properties = validProperties;
        if (validProperties != null && validProperties.length > 0) {
          validProcessors.push(processor);
        }
        if (getThis.isGetTableDataProcessor(processor) || getThis.isWatermarkProcessor(processor)) {
          processor.sortIndex = 0;
        }
        else {
          processor.sortIndex = i;
        }
      });
      var arr = null;

      if (keepProcessorIfEmpty != undefined && keepProcessorIfEmpty == true) {
        arr = processorArray;
      }
      else {
        arr = validProcessors;
      }
      // sort it
      return _.sortBy(arr, 'sortIndex');

    },
    initializeProperties (template, mode, feedProperties) {
      let self = this;
      let savedProperties = {};
      if (feedProperties) {
        _.each(feedProperties, function (property) {
          if (property.userEditable && property.templateProperty) {
            savedProperties[property.templateProperty.idKey] = property;
          }
        });
      }

      function updateProperties (processor, properties) {
        _.each(properties, function (property) {
          //set the value if its saved
          if (savedProperties[property.idKey] != undefined) {
            property.value == savedProperties[property.idKey]
          }
          //mark as not selected
          property.selected = false;

          //  property.value = data.deriveExpression(property.value, false);
          // property.renderWithCodeMirror = data.isRenderPropertyWithCodeMirror(property);

          //if it is a custom render property then dont allow the default editing.
          //the other fields are coded to look for these specific properties
          //otherwise check to see if it is editable
          if (self.isCustomPropertyRendering(property.key)) {
            property.customProperty = true;
            property.userEditable = false;
          } else if (property.userEditable == true) {
            processor.userEditable = true;
          }

          //if it is sensitive treat the value as encrypted... store it off and use it later when saving/posting back if the value has not changed
          self.initSensitivePropertyForEditing(property);
          self.updateDisplayValue(property);
        })

      }

      _.each(template.inputProcessors, function (processor) {
        //ensure the processorId attr is set
        processor.processorId = processor.id;
        updateProperties(processor, processor.properties)
        //  setRenderTemplateForProcessor(processor, mode);
      });
      _.each(template.nonInputProcessors, function (processor) {
        //ensure the processorId attr is set
        processor.processorId = processor.id;
        updateProperties(processor, processor.properties)
        // setRenderTemplateForProcessor(processor, mode);
      });

    },
    matchInputProcessor (inputProcessor, inputProcessors) {

      if (inputProcessor == null || inputProcessor == "undefined") {
        //input processor is null when feed is being created
        return undefined;
      }

      var matchingInput = _.find(inputProcessors, function (input) {
        if (input.id == inputProcessor.id) {
          return true;
        }
        return (input.type == inputProcessor.type && input.name == inputProcessor.name);
      });

      return matchingInput;
    },
    initializePropertiesMethod (template) {
      let that = this;
      that.initializeProperties(template, 'create', this.feedInfo.properties);
      let inputProcessors = that.removeNonUserEditableProperties(template.inputProcessors, true);
      console.log(inputProcessors)
      //sort them by name
      that.inputProcessors = _.sortBy(inputProcessors, 'name')

      that.feedInfo.allowPreconditions = template.allowPreconditions;

      that.feedInfo.nonInputProcessors = that.removeNonUserEditableProperties(template.nonInputProcessors, false);
      if (that.feedInfo.inputProcessor === null) {
        var match = that.matchInputProcessor(that.feedInfo.inputProcessor, that.inputProcessors);
        if (match !== null && match !== undefined) {
          that.inputProcessor = match;
          that.inputProcessorId = match.id;
        }
      }

      if (that.inputProcessorId == null && that.inputProcessors != null && that.inputProcessors.length > 0) {
        that.inputProcessorId = that.inputProcessors[0].id;
      }
      // Skip this step if it's empty
      if (that.inputProcessors.length === 0 && !_.some(that.nonInputProcessors, function (processor) {
        return processor.userEditable
      })) {
      }
      /*  //遍历nonInput
        let nonLength = that.feedInfo.nonInputProcessors.length;
        for(let i=0;i<nonLength;i++){
            that.feedInfo.nonInputProcessors[i].properties.map(item=>{
                console.log(item)
                if(item.key === "Source Database Connection"){
                    item.propertyDescriptor.allowableValues = _.map(that.dataBaseArr, function (dataBaseArr) {
                        return {displayName: dataBaseArr.name, value: dataBaseArr.id}
                    });
                }
            })
        }*/
      console.log(that.feedInfo.nonInputProcessors)
      console.log(that.feedInfo);
    },
    isRenderProcessorGetTableDataProcessor: function (inputProcessor) {
      let render = false;
      let _this = this;
      //if the processor to check is GetTable Data it should be rendered only if it is the input, or if the input is watermark
      if (inputProcessor != undefined && (_this.isGetTableDataProcessor(inputProcessor) || _this.isWatermarkProcessor(inputProcessor))) {
        render = true;
      }

      return render;
    },
    updateGetTableDataRendering: function (inputProcessor, nonInputProcessors) {
      let _this = this;
      let renderGetData = _this.isRenderProcessorGetTableDataProcessor(inputProcessor);
      let getTableDataProcessors = _.filter(nonInputProcessors, function (processor) {
        return _this.isGetTableDataProcessor(processor);
      })
      _.each(getTableDataProcessors, function (processor) {
        processor.userEditable = renderGetData;
      });
      //if the flow starts with the watermark and doesnt have a downstream getTableData then dont render the table
      if (renderGetData && _this.isWatermarkProcessor(inputProcessor) && getTableDataProcessors.length == 0) {
        renderGetData = false;
      }
      return renderGetData;
    },

    updateInputProcessor (processorId) {
      // Find the processor object
      let self = this;
      var processor = _.find(self.inputProcessors, function (processor) {
        return (processor.processorId === processorId);
      });
      if (processor === "undefined") {
        return;
      }

      self.inputChangedCounter++;

      let clonedAndInputChanged = function (inputProcessorId) {
        return (self.feedInfo.cloned == true && self.inputChangedCounter > 1);
      }

      let notCloned = function () {
        return (self.feedInfo.cloned === "undefined" || self.feedInfo.cloned == false);
      }

      // Determine render type
      let renderGetTableData = self.updateGetTableDataRendering(processor, self.feedInfo.nonInputProcessors);

      if (renderGetTableData) {

        if (self.feedInfo.table.method != null && self.feedInfo.table.method != 'EXISTING_TABLE') {
          //reset the fields
          self.feedInfo.table.tableSchema.fields = [];
        }
        self.feedInfo.table.method = 'EXISTING_TABLE';
        self.feedInfo.options.skipHeader = true;  /*true*/  /*20181024*/
        self.feedInfo.allowSkipHeaderOption = true;

      } else if (!self.isTransformBool && (clonedAndInputChanged(processorId) || notCloned())) {
        /*self.feedInfo.templateName !== 'Data Transformation'*/
        self.feedInfo.table.method = 'SAMPLE_FILE';
        self.feedInfo.table.tableSchema.fields = [];
      }

      // Update model
      self.feedInfo.inputProcessor = processor;
      self.feedInfo.inputProcessorType = processor.type;
      console.log(self.feedInfo.inputProcessorType)
      self.feedInfo.inputProcessorName = processor.name;
    },
    setTableFields (fields, policies) {
      this.feedInfo.table.tableSchema.fields = fields;
      // this.handleTableFields(fields)
      if (policies && policies.length > 0) {
        this.feedInfo.table.fieldPolicies = policies
      } else {
        this.feedInfo.table.fieldPolicies = fields.map(field => this.newTableFieldPolicy(field.name, field))
      }
      console.log('处理完后的字段策略')
      console.log(this.feedInfo.table.fieldPolicies)
      // this.feedInfo.table.fieldPolicies = (policies != null && policies.length > 0) ? policies : fields.map(field => this.newTableFieldPolicy(field.name));
    },
    // 处理表的字段为[{"field":"idcard","dataType":"string"}]
    handleTableFields (fields) {
      console.log('================================fileds')
      console.log(fields)
      const resule = []
      for (let field of fields) {
        // const fieldName = field.name.slice(field.name.lastIndexOf('_') + 1)
        resule.push({ "field": field.name, "dataType": field.derivedDataType })
      }
      this.ruleInfo.fields = JSON.stringify(resule);
      return JSON.stringify(resule)
    },
    selectChange (val) {
      console.log(val);
      let _this = this;
      if (_this.nonPro != null && _this.nonPro.value != null) {
        /*_this.nonPro = Object.assign({},_this.orginNonPro);*/
        //var serviceId = _this.nonPro.value;
        var serviceId = _this.orginNonPro;
        console.log(serviceId)
        console.log("serviceId++++++++++++++++++++++++++++++++++++++++++")
        var serviceNameValue = _.find(_this.nonPro.propertyDescriptor.allowableValues, function (allowableValue) {
          return allowableValue.value == serviceId;
        });
        console.log(serviceNameValue);
        let tableName = val.split('.')[1];
        _this.nonPro["tableName"] = tableName;
        let serviceName = serviceNameValue != null && serviceNameValue != undefined ? serviceNameValue.displayName : '';
        console.log(serviceName);
        let params = _this.nonPro;
        params.schema = val.split('.')[0];
        params.serviceName = serviceName;
        console.log(params);
        params.value = this.controllerServiceId
        getTbaleName(params).then(data => {
          console.log(data)
          if (data.status) {
            this.$message.error('获取数据失败,' + data.message);
          }
          if (!data) {
            this.$message.error('该表无数据');
          } else {
            console.log("8888888888888888888888888");
            console.log(data)
            _this.tableSchema = data;
            _this.tableFields = _this.tableSchema.fields;
            _this.tableSchema.fields = [..._this.tableSchema.fields.map(el => {
              el.sourceName = el.name
              return el
            })]
            _this.originalTableFields = Object.assign(_this.tableSchema.fields);
            //    _this.tableFieldsDirty = false;

            _this.feedInfo.table.sourceTableSchema.fields = [..._this.originalTableFields];

            _this.setTableFields(_this.tableSchema.fields);
            _this.feedInfo.table.method = 'EXISTING_TABLE';

            if (_this.tableSchema.schemaName != null) {
              // this.dataBaseArr.forEach(one => {
              //   if (one.id === this.dataBaseValue) {
              //     let reg = /[a-z]/
              //     if (one.type === 'oracle' && reg.test(_this.tableSchema.name)) {
              //       _this.feedInfo.table.existingTableName = _this.tableSchema.schemaName + `.\\"` + _this.tableSchema.name +`\\"`;
              //     }
              //     else {
              //       _this.feedInfo.table.existingTableName = _this.tableSchema.schemaName + "." + _this.tableSchema.name;
              //     }
              //   }
              // })
              _this.feedInfo.table.existingTableName = _this.tableSchema.schemaName + "." + _this.tableSchema.name;
            }
            else {
              _this.feedInfo.table.existingTableName = _this.tableSchema.name;
            }
            _this.feedInfo.table.sourceTableSchema.name = _this.feedInfo.table.existingTableName;
            _this.activeName = "2";
            console.log(_this.feedInfo.table)
            this.historyTB = [...this.feedInfo.table.tableSchema.fields]
          }

        }).catch(err => {

        })

      }
    },
    //判断是否为数据转换
    isTransForm () {
      let fdStart = this.feedInfo.templateName.indexOf("Data Transformation");
      let fdStartlower = this.feedInfo.templateName.indexOf("data-transform");
      const name = this.feedInfo.templateName.toLowerCase()
      if (fdStart == 0 || fdStartlower == 0) {
        this.isTransformBool = true;
      } else if (fdStart == -1 || fdStartlower == -1) {
        this.isTransformBool = false;
      }
    },
    // 判断是否为规则模板
    isRule () {
      const templateName = this.feedInfo.templateName.toLowerCase()
      if (templateName.includes('rule')) {
        this.isRuleTemplate = true
        this.feedInfo.type = 'RULE'
      } else {
        this.isRuleTemplate = false
        this.feedInfo.type = 'BASE'
      }
    },
    isIngest () {
      let fdStartIngest = this.feedInfo.templateName.indexOf("data-ingest");
      let fdStartlowerIngest = this.feedInfo.templateName.indexOf("Data Ingest");
      if (fdStartIngest == 0 || fdStartlowerIngest == 0) {
        this.isIngestBool = true;
      } else if (fdStartIngest == -1 || fdStartlowerIngest == -1) {
        this.isIngestBool = false;
      }
    },
    getTemplateInfo () {
      this.getTemplateInfoList = this.$route.query.template;
      if (this.getTemplateInfoList !== undefined) {
        this.templateId = this.getTemplateInfoList.id;
        console.log(this.templateId)
        if (this.templateId === undefined) {
          this.$router.push('flowManage/feedDetails');
        }
        this.saveLoadding = true;
        let _this = this;
        if (_this.templateId != "" || _this.templateId != undefined || _this.templateId != null) {
          getRegisteredTemplateAllProperty(_this.templateId).then(data => {
            if (data) {
              this.saveLoadding = false;
              let data_ = data.data;
              /*     _this.feedInfo.templateName = data.templateName;
                   _this.feedInfo.templateTableOption = data.templateTableOption;
                //   this.feedInfo.inputProcessors = data.inputProcessors;
                   _this.feedInfo.templateId = data.id;*/

              _this.feedInfo.templateId = data_.id;
              _this.feedInfo.templateName = data_.templateName;
              //判断是否为数据转换
              _this.isTransForm();
              //判断是否为数据采集
              _this.isIngest();
              // 判断是否为规则模板
              _this.isRule();
              this.filterDatasourceHive([...this.dataBaseArr]);
              //setup some initial data points for the template
              _this.feedInfo.defineTable = data_.defineTable; /*采集*/
              _this.feedInfo.allowPreconditions = data_.allowPreconditions;
              _this.feedInfo.dataTransformationFeed = data_.dataTransformation; /*转换*/

              // Determine table option
              if (data_.templateTableOption) {
                _this.feedInfo.templateTableOption = data_.templateTableOption;
              } else if (data_.defineTable) {
                _this.feedInfo.templateTableOption = "DEFINE_TABLE";
              } else if (data_.dataTransformation) {
                _this.feedInfo.templateTableOption = "DATA_TRANSFORMATION";
              }
              /*else if(template.templateTableOption){
                  self.model.templateTableOption = "TO_ES";
              }*/
              else {
                _this.feedInfo.templateTableOption = "NO_TABLE"; /*NO_TABLE*/

              }
              _this.feedInfo.renderTemporaryPreStep = false;

              //获取数据库列表
              let dataNonLength = data_.properties.length;
              for (let i = 0; i < dataNonLength; i++) {
                if (data_.properties[i].propertyDescriptor.name === "Source Database Connection") {
                  _this.dataBaseType = data_.properties[i].propertyDescriptor.identifiesControllerService;
                }
              }

              // _this.initializeProperties(data, 'create', _this.feedInfo.properties);
              _this.initializePropertiesMethod(data_);
              _this.getDataBaseArrOption();

              console.log(_this.feedInfo)


            } else {
              this.$message.error('模板接口返回空')
            }
          }).catch(err => {
            console.log(err.data)
          })
        }
        getSchemaParser().then(data => {
          //    this.schemaParser = res.data
          this.getSchemaParser = data

        }).catch(err => {
          console.log(err.data)
        });

        //从后台获取分区公式 getPartitionFunctions
        getPartitionFunctions().then(data => {
          this.partitionFunctions = data;

        }).catch(err => {
          console.log(err.data)
        })

        //从后台获取时间计划cron表达式 getCronExpression
        let toCronExpression = this.feedInfo.schedule.schedulingPeriod
        getCronExpression(toCronExpression).then(data => {
          this.cronExpression = data;
          console.log(this.cronExpression)

        }).catch(err => {
          console.log(err.data)
        })
      }
    },
    next () {
      window.scrollTo(0, 0)
      let _this = this;
      console.log('------------------------------------------------------------' + this.active)
      //isStepFirst
      //      this.feedInfo.templateName !== 'Data Transformation'
      if (!this.isTransformBool) {
        switch (this.active) {
          case 0:
            this.isStepFirst = false;
            this.isStepSecond = true;
            break;
          case 1:
            console.log('------------------------------------------------------------1')
            this.isStepSecond = false;
            this.isStepThird = true;
            break;
          case 2:
            console.log('------------------------------------------------------------2')
            _this.isStepThird = false;
            _this.isStepfour = true;
            _this.activeName = "0";

            _this.feedInfo.table.tableSchema.fields.forEach((one, index) => {
              if (_this.feedInfo.table.tableSchema.fields[index].deleted != true) {
                _this.feedInfo.table.fieldPolicies[index].name = _this.feedInfo.table.tableSchema.fields[index].name
              }
            })
            this.feedInfo.table.fieldPolicies = this.getDefaultSelect(this.feedInfo.table.fieldPolicies)
            if (this.feedInfo.table.tableSchema.fields) {
              this.setTableFields(this.feedInfo.table.tableSchema.fields);
            }
            break;
          case 3:
            //Ingest 数据处理步骤
            console.log('------------------------------------------------------------3')
            this.isStepfour = false;
            this.isStepFive = true;
            // this.$refs.formFone.validate(bol => {
            //   if (bol) {
            //     this.isStepfour = false;
            //     this.isStepFive = true;
            //   }
            //   else {
            //     this.active = 3
            //     return false
            //   }
            // })23

            break;
          case 4:
            console.log(123465)
            this.isStepFive = false;
            //this.isStepSix = true;
            this.isStepSeven = true;
            break;
          case 5:
            console.log('------------------------------------------------------------5')
            this.isStepSix = false;
            this.isStepSeven = true;
            break;
          default:

        }
        this.beforeButton = false;
        if (this.active++ > 3) {
          this.isFinash = false;
          this.isSaveBtn = true;
        }
      }
      else if (this.isRuleTemplate) {
        switch (this.active) {
          case 0:
            this.isStepFirst = false;
            this.isStepSecond = true;
            break;
          case 1:
            this.isStepSecond = false;
            this.isStep1 = true;
            break;
          case 2:
            /*if(this.feedInfo.templateTableOption ==='DATA_TRANSFORMATION'){
                this.isTransform = false;
            }else {
                this.isStepSecond=false;
                this.isStepThird = true;
            }
            this.isStepThird = false;
            this.isStepfour = true;

            */
            console.log(this.containers)
            /*if(this.containers.fields.length>0){
                this.feedInfo.table.tableSchema = this.containers.fields;
            }*/
            // let _this = this;
            console.log(_this.resultColumsRel);
            console.log("resultColumsresultColumsresultColumsresultColumsresultColums");
            if (this.isTransformBool || this.isRuleTemplate) {
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
              _this.feedInfo.table.tableSchema.fields = arrTans;
              let contanierLen = this.containers.length;

              for (let i = 0; i < contanierLen; i++) {
                if (_this.containers[i].dataSourceId == "Hive") {
                }
                else {
                  _this.datasourceIds.push(_this.containers[i].dataSourceId);
                }
              }

              /*
                 description: '',
                 precisionScale: null,
                 dataTypeDisplay: '',
                 primaryKey: false,
                 nullable: false,
                 createdTracker: false,
                 updatedTracker: false,
                 sampleValues: [],
                 selectedSampleValue: '',
                 tags: [],*/
            } else {
              _this.checkedRes = [];
              let contanierLen = this.containers.length;

              for (let i = 0; i < contanierLen; i++) {
                if (_this.containers[i].dataSourceId == "Hive") {
                }
                else {
                  _this.datasourceIds.push(_this.containers[i].dataSourceId);
                }
              }
              _this.containers.forEach((item, index) => {
                let checkArr = item.checked;
                let findArr = item.fields;
                findArr.find((value, index, checkArr) => {
                  item.checked.forEach(iname => {
                    if (value.name == iname) {
                      console.log(value)
                      _this.checkedRes.push(value);
                    }

                  })
                })
              });
              _this.feedInfo.table.tableSchema.fields = _this.checkedRes;
            }

            _this.isTansform = false;
            _this.activeName = "2";
            console.log(_this.feedInfo.table.tableSchema)
            console.log(_this.feedInfo.table.fieldPolicies)
            _this.feedInfo.dataTransformation.sql = _this.SQLStr;
            _this.dataTransformScript = _this.SQLStr;
            console.log(_this.dataTransformScript);
            console.log(_this.containers);
            console.log("__________________________________________")
            console.log(_this.datasourceIds);
            _this.feedInfo.dataTransformation.dataTransformScript = _this.dataTransformScript;
            _this.feedInfo.dataTransformation['$selectedDatasourceId'] = _this.zzz;
            //     _this.feedInfo.dataTransformation.datasources = _this.containers;
            _this.feedInfo.dataTransformation.chartViewModel["nodes"] = _this.containers;
            _this.feedInfo.dataTransformation["datasourceIds"] = _this.datasourceIds;
            _this.feedInfo.dataTransformation.chartViewModel["connections"] = _this.connections;
            console.log(_this.transCon)
            console.log(typeof (_this.transCon.connection))
            //_this.feedInfo.dataTransformation.chartViewModel.connections = _this.transCon;
            /*  this.tempFeedInfo = JSON.parse(JSON.stringify(this.feedInfo))
              this.tempFeedInfo.dataTransformation.chartViewModel.connections = {..._this.transCon}
              this.isTempFeedInfo = true;*/
            _this.isStep1 = false;
            _this.isStepThird = true;
            console.log('*********************************')
            console.log(this.feedInfo.table.tableSchema)
            console.log('*********************************')
            this.handleTableFields(this.feedInfo.table.tableSchema.fields)
            this.getLoadPackagesList()
            this.historyTB = [..._this.feedInfo.table.tableSchema.fields]
            break;
          case 3:
            console.log('------------------------------------------------------------4')
            console.log(this.isRuleTemplate)
            if (this.isRuleTemplate) {
              /*  if(this.ruleInfo.targetTableName){
                 return
               } */
              console.log('------------------------------------------------------------ruleEngineForm')
              this.$refs['ruleEngineForm'].validate((valid) => {
                console.log('------------------------------------------------------------valid')
                console.log(valid)
                if (valid) {
                  this.isStepThird = false;
                  //this.isStepSix = true;
                  this.activeName = "0";
                  this.setTableFields(this.feedInfo.table.tableSchema.fields);
                  this.isStepThird = false
                  this.isStepFive = true;
                } else {
                  console.log('ruleEngineForm error submit!!');
                  return false;
                }
              });
            } else {
              this.isStepThird = false;
              //this.isStepSix = true;
              this.activeName = "0";
              this.setTableFields(this.feedInfo.table.tableSchema.fields);
              this.isStepFive = true;
            }
            /* this.isStepThird = false;
            //this.isStepSix = true;
            this.activeName = "1";
            console.log('------------------------------------909009009-1')
            this.setTableFields(this.feedInfo.table.tableSchema.fields); */
            /*  this.feedInfo.table.tableSchema.fields.forEach((one,index)=>{
                  this.feedInfo.table.fieldPolicies[index].name = this.feedInfo.table.tableSchema.fields[index].name
              })*/
            this.isStepThird = false;
            this.isStepFive = true;
            break;
          case 4:
            //过滤st
            this.isStepFive = false;
            this.isStepSeven = true;
            break;
          default:

        }
        this.beforeButton = false;
        if (this.active++ > 3) {
          this.isFinash = false;
          this.isSaveBtn = true;
        }
      }
      else if (this.isTransformBool && !this.isRuleTemplate) {
        switch (this.active) {
          case 0:
            this.isStepFirst = false;
            this.isStepSecond = true;
            break;
          case 1:
            this.isStepSecond = false;
            this.isStep1 = true;
            break;
          case 2:
            /*if(this.feedInfo.templateTableOption ==='DATA_TRANSFORMATION'){
                this.isTransform = false;
            }else {
                this.isStepSecond=false;
                this.isStepThird = true;
            }
            this.isStepThird = false;
            this.isStepfour = true;

            */
            console.log(this.containers)
            /*if(this.containers.fields.length>0){
                this.feedInfo.table.tableSchema = this.containers.fields;
            }*/
            // let _this = this;
            console.log(_this.resultColumsRel);
            console.log("resultColumsresultColumsresultColumsresultColumsresultColums");
            if (this.isTransformBool || this.isRuleTemplate) {
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
              _this.feedInfo.table.tableSchema.fields = arrTans;
              let contanierLen = this.containers.length;

              for (let i = 0; i < contanierLen; i++) {
                if (_this.containers[i].dataSourceId == "Hive") {
                }
                else {
                  _this.datasourceIds.push(_this.containers[i].dataSourceId);
                }
              }

              /*
                 description: '',
                 precisionScale: null,
                 dataTypeDisplay: '',
                 primaryKey: false,
                 nullable: false,
                 createdTracker: false,
                 updatedTracker: false,
                 sampleValues: [],
                 selectedSampleValue: '',
                 tags: [],*/
            } else {
              _this.checkedRes = [];
              let contanierLen = this.containers.length;

              for (let i = 0; i < contanierLen; i++) {
                if (_this.containers[i].dataSourceId == "Hive") {
                }
                else {
                  _this.datasourceIds.push(_this.containers[i].dataSourceId);
                }
              }
              _this.containers.forEach((item, index) => {
                let checkArr = item.checked;
                let findArr = item.fields;
                findArr.find((value, index, checkArr) => {
                  item.checked.forEach(iname => {
                    if (value.name == iname) {
                      console.log(value)
                      _this.checkedRes.push(value);
                    }

                  })
                })
              });
              _this.feedInfo.table.tableSchema.fields = _this.checkedRes;
            }

            _this.isTansform = false;
            _this.activeName = "2";
            console.log(_this.feedInfo.table.tableSchema)
            console.log(_this.feedInfo.table.fieldPolicies)
            _this.feedInfo.dataTransformation.sql = _this.SQLStr;
            _this.dataTransformScript = _this.SQLStr;
            console.log(_this.dataTransformScript);
            console.log(_this.containers);
            console.log("__________________________________________")
            console.log(_this.datasourceIds);
            _this.feedInfo.dataTransformation.dataTransformScript = _this.dataTransformScript;
            _this.feedInfo.dataTransformation['$selectedDatasourceId'] = _this.zzz;
            //     _this.feedInfo.dataTransformation.datasources = _this.containers;
            _this.feedInfo.dataTransformation.chartViewModel["nodes"] = _this.containers;
            _this.feedInfo.dataTransformation["datasourceIds"] = _this.datasourceIds;
            _this.feedInfo.dataTransformation.chartViewModel["connections"] = _this.connections;
            console.log(_this.transCon)
            console.log(typeof (_this.transCon.connection))
            //_this.feedInfo.dataTransformation.chartViewModel.connections = _this.transCon;
            /*  this.tempFeedInfo = JSON.parse(JSON.stringify(this.feedInfo))
              this.tempFeedInfo.dataTransformation.chartViewModel.connections = {..._this.transCon}
              this.isTempFeedInfo = true;*/
            _this.isStep1 = false;
            _this.isStepThird = true;
            console.log('*********************************')
            console.log(this.feedInfo.table.tableSchema)
            console.log('*********************************')
            this.handleTableFields(this.feedInfo.table.tableSchema.fields)
            this.getLoadPackagesList()
            this.historyTB = [..._this.feedInfo.table.tableSchema.fields]
            break;
          case 3:
            console.log('------------------------------------------------------------4')
            console.log(this.isRuleTemplate)
            if (this.isRuleTemplate) {
              /*  if(this.ruleInfo.targetTableName){
                 return
               } */
              console.log('------------------------------------------------------------ruleEngineForm')
              this.$refs['ruleEngineForm'].validate((valid) => {
                console.log('------------------------------------------------------------valid')
                console.log(valid)
                if (valid) {
                  this.isStepThird = false;
                  //this.isStepSix = true;
                  this.activeName = "0";
                  this.setTableFields(this.feedInfo.table.tableSchema.fields);
                  this.isStepThird = false
                  this.isStepfour = true;
                } else {
                  console.log('ruleEngineForm error submit!!');
                  return false;
                }
              });
            } else {
              this.isStepThird = false;
              //this.isStepSix = true;
              this.activeName = "0";
              this.setTableFields(this.feedInfo.table.tableSchema.fields);
              this.isStepfour = true;
            }
            /* this.isStepThird = false;
            //this.isStepSix = true;
            this.activeName = "1";
            console.log('------------------------------------909009009-1')
            this.setTableFields(this.feedInfo.table.tableSchema.fields); */
            /*  this.feedInfo.table.tableSchema.fields.forEach((one,index)=>{
                  this.feedInfo.table.fieldPolicies[index].name = this.feedInfo.table.tableSchema.fields[index].name
              })*/
            this.isStepThird = false;
            this.isStepfour = true;
            break;
          case 4:
            //过滤st
            this.isStepfour = false;
            this.isStepFive = true;
            break;
          case 5:
            this.isStepFive = false;
            this.isStepSeven = true;
            break;
          default:

        }
        this.beforeButton = false;
        if (this.active++ > 4) {
          this.isFinash = false;
          this.isSaveBtn = true;
        }
      }


    },
    beforeClick () {
      //      this.feedInfo.templateName !== 'Data Transformation'
      if (!this.isTransformBool) {
        switch (this.active) {
          case 1:
            this.isStepFirst = true;
            this.isStepSecond = false;
            break;
          case 2:
            this.isStepSecond = true;
            this.isStepThird = false;
            break;
          case 3:
            this.isStepThird = true;
            this.isStepfour = false;
            break;
          case 4:
            this.isStepfour = true;
            this.isStepFive = false;
            this.isStepSeven = false;
            break;
          case 5:
            this.isStepFive = true;
            this.isStepSix = false;
            this.isStepSeven = false;
            break;
          case 6:
            this.isStepSix = true;
            this.isStepSeven = false;
            break;
          default:

        }
      }
      else if (this.isRuleTemplate) {
        switch (this.active) {
          case 1:
            this.isStepFirst = true;
            this.isStepSecond = false;
            break;
          case 2:
            this.isStepSecond = true;
            this.isStep1 = false;
            break;
          case 3:
            this.isStep1 = true;
            this.isStepThird = false;
            break;
          case 4:
            this.isStepThird = true;
            this.isStepFive = false;
            break;
          case 5:
            this.isStepFive = true;
            this.isStepSeven = false;
            break;
          default:
        }
      }
      else if (this.isTransformBool && !this.isRuleTemplate) {
        switch (this.active) {
          case 1:
            this.isStepFirst = true;
            this.isStepSecond = false;
            break;
          case 2:
            this.isStepSecond = true;
            this.isStep1 = false;
            break;
          case 3:
            this.isStep1 = true;
            this.isStepThird = false;
            break;
          case 4:
            this.isStepThird = true;
            this.isStepfour = false;
            break;
          case 5:
            this.isStepfour = true;
            this.isStepFive = false;
            break;
          case 6:
            this.isStepFive = true;
            this.isStepSeven = false;
            break;
          default:
        }
      }
      this.isFinash = true;
      this.isSaveBtn = false;
      if (this.active-- <= 1) {
        this.beforeButton = true;
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleChange (value) {
      console.log(value);
    },
    getCategoryData () {
      //获取分类列表
      getCategories().then(data => {
        this.getCategory = data;
        let getCategorySelf = [...data];
        this.treeData = toTreeData(getCategorySelf, {
          id: 'id',
          parentId: 'parentId',
          name: 'name',
          rootId: undefined
        })
        console.log(this.getCategory)

        //    this.updateScheduleStrategies()

      }).catch(err => {
        console.log(err.data)
      })
    },
    // 选中的分类
    selectNode (data) {
      if (this.feedInfo.category.name) {
        this.feedInfo.category.name = data.label
      } else {
        this.$set(this.feedInfo.category, 'name', data.label)
      }
    },

    //获取dataBaseArr 第二步  getDataBaseArr
    getDataBaseArrOption () {
      /*  let type = this.dataBaseType;
       let _this = this;
       getDataBaseArr(type).then(data => {
         _this.dataBaseArr = data;
         //遍历nonInput
         let nonLength = _this.feedInfo.nonInputProcessors.length;
         for (let i = 0; i < nonLength; i++) {
           _this.feedInfo.nonInputProcessors[i].properties.map(item => {
             console.log(item)
             if (item.key === "Source Database Connection") {
               item.propertyDescriptor.allowableValues = _.map(_this.dataBaseArr, function (dataBaseArr) {
                 return { displayName: dataBaseArr.name, value: dataBaseArr.id }
               });
             }
           })
         }
         //console.log(this.dataBaseArr)

         //    this.updateScheduleStrategies()


       }).catch(err => {
         console.log(err.data)
       })*/
    },
    selectDataBase (val) {
      console.log(this.feedInfo)
      console.log(val);
      console.log(val)
      console.log("______________________val")
      console.log(this.feedInfo.nonInputProcessors)
      let that = this;
      that.orginNonPro = val;
      //清空类型表名
      that.typeTableName = "";
      that.optionsTbaleName = [];
      //遍历feedInfo.nonInputProcessors
      let valueLength = that.feedInfo.nonInputProcessors.length;
      for (let a = 0; a < valueLength; a++) {
        let proLength = that.feedInfo.nonInputProcessors[a].properties.length;
        for (let b = 0; b < proLength; b++) {
          if (that.feedInfo.nonInputProcessors[a].properties[b].propertyDescriptor.name == "Source Database Connection") {
            that.value8 = that.feedInfo.nonInputProcessors[a].properties[b].value;
            if (that.feedInfo.nonInputProcessors[a].properties[b].value == "") {
              that.feedInfo.nonInputProcessors[a].properties[b].value = val;
            }
            // that.dataBaseValue = that.feedInfo.nonInputProcessors[a].properties[b].value; //当为数据采集时
            // that.dataBaseValue = that.feedInfo.nonInputProcessors[a].properties[b].value; //当为数据采集时
            console.log(that.feedInfo.nonInputProcessors[a].properties[b])
            that.nonPro = that.feedInfo.nonInputProcessors[a].properties[b];

          }
        }
      }
      that.dataBaseArr.map(property => {
        /*property.id==that.value8 ||*/
        if (property.id == that.dataBaseValue) {
          console.log(property);
          this.controllerServiceId = property.controllerServiceId
          getTbales(property.controllerServiceId).then(data => {
            if (data.status == "error") {
              that.$message.error('数据源错误，请查看数据源详情');

            }
            that.tableName = data;
            that.list = that.tableName.map(item => {
              return { value: item, label: item };
            });
          }).catch(err => {

          })
        }
      })
    },
    remoteMethod (query) {
      console.log('--------list')
      console.log(this.list)
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.optionsTbaleName = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.optionsTbaleName = [];
      }
    },
    filterDateOption (val) {
      this.feedInfo.nonInputProcessors.forEach((item, index) => {
        let _this = this;
        _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild, i) => {
          let that = this;
          if (that.feedInfo.nonInputProcessors[index].properties[i].key == "Date Field") {
            that.feedInfo.nonInputProcessors[index].properties[i].value = val;
          }
        })

      })
    },
    changeStratege (val) {
      if (val === "FULL_LOAD") {
        this.feedInfo.nonInputProcessors.forEach((item, index) => {
          let _this = this;
          _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild, i) => {
            let that = this;
            if (that.feedInfo.nonInputProcessors[index].properties[i].key == "Load Strategy") {
              that.feedInfo.nonInputProcessors[index].properties[i].value = val;
            }
          })

        })
      } else if (val === "INCREMENTAL") {
        this.feedInfo.nonInputProcessors.forEach((item, index) => {
          let _this = this;
          _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild, i) => {
            let that = this;
            if (that.feedInfo.nonInputProcessors[index].properties[i].key == "Load Strategy") {
              that.feedInfo.nonInputProcessors[index].properties[i].value = val;
            }
          })

        })
      }
      console.log(this.feedInfo)
    },
    outPutChange (val) {
      alert(val)
      if (val === "DELIMITED") {
        this.feedInfo.nonInputProcessors.forEach((item, index) => {
          let _this = this;
          _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild, i) => {
            let that = this;
            if (that.feedInfo.nonInputProcessors[index].properties[i].key == "Output Type") {
              that.feedInfo.nonInputProcessors[index].properties[i].value = val;
              that.feedInfo.table.feedFormat = that.feedInfo.table.feedFormat
            }
          })

        })
      } else if (val === "AVRO") {
        this.feedInfo.nonInputProcessors.forEach((item, index) => {
          let _this = this;
          _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild, i) => {
            let that = this;
            if (that.feedInfo.nonInputProcessors[index].properties[i].key == "Output Type") {
              that.feedInfo.nonInputProcessors[index].properties[i].value = val;
              that.feedInfo.table.feedFormat = 'STORED AS AVRO'
            }
          })

        })
      }
      console.log(this.feedInfo)
    },



    /**
     * Returns an array of all the compression options regardless of the {@code targetFormat}
     * (i.e. ['NONE','SNAPPY','ZLIB']
     * @returns {Array}
     */
    /*allCompressionOptions: function () {
        let arr: any[] = [];
        _.each(this.compressionOptions, function (options: any) {
            arr = _.union(arr, options);
        });
        return arr;
    },*/
    //上传之前的校验
    beforeUpload (file) {
      console.log(file, '文件');
      console.log(typeof (file));
      this.files = file;
      /*const extension = file.name.split('.')[2] === 'xml';
      const extension2 = file.name.split('.')[2] === 'zip';
      //const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
          this.$message.warning('上传模板只能是 xml、zip格式!')
          return
      }*/
      /*if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 5MB!')
          return
      }*/
      this.fileName = file.name;
      console.log(this.schemaParser.name)
      console.log(this.schemaParser)

      return false // 返回false不会自动上传
    },
    replaceSpaces (str) {
      if (str != undefined) {
        return str.replace(/ /g, '_');
      }
      else {
        return '';
      }
    },
    //上传文件
    submitUploadFile () {
      // this.$refs.upload.submit();
      if (this.fileName === "") {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      let parserLength = this.getSchemaParser.length;
      if (JSON.stringify(this.schemaParser) == "{}") {
        this.schemaParser = "CSV"
      } else {
        this.schemaParser = this.schemaParser;
      }
      for (let i = 0; i < parserLength; i++) {
        if (this.schemaParser == this.getSchemaParser[i].name) {
          this.postSchemaParser = JSON.stringify(this.getSchemaParser[i])
        }
      }
      let fileFormDataFeed = new FormData();
      fileFormDataFeed.append('file', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormDataFeed.append('parser', this.postSchemaParser);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      let that = this;
      uploadFile(fileFormDataFeed).then(res => {
        // that.feedInfo.table.tableSchema.fields = res.data.fields;
        that.feedInfo.table.tableSchema.fields = res.fields;
        that.feedInfo.table.tableSchema.name = this.feedInfo.feedName;
        console.log(that.feedInfo.table.tableSchema.fields)
        // that.feedInfo.table.fieldPolicies = that.feedInfo.table.tableSchema.fields
        let fieldsLength = that.feedInfo.table.tableSchema.fields.length;
        for (let x = 0; x < fieldsLength; x++) {
          console.log(that.feedInfo.table.tableSchema.fields)

          that.initFeedColumn(that.feedInfo.table.tableSchema.fields[x]);
          let col = this.newColumnDefinition();
          col = Object.assign(col, that.feedInfo.table.tableSchema.fields[x]);
          //  console.log(that.feedInfo.table.tableSchema)
          that.addColumn(col, false)
          let name = that.feedInfo.table.tableSchema.fields[x].name;
          if (name != undefined) {
            that.feedInfo.table.fieldPolicies[x].name = name;
            that.feedInfo.table.fieldPolicies[x].feedFieldName = name;
            //assign pointer to the field?
            that.feedInfo.table.fieldPolicies[x].field = col;
          }
          else {
            if (that.feedInfo.table.fieldPolicies[x].field) {
              that.feedInfo.table.fieldPolicies[x].field == null;
            }
          }

          // this.feedInfo.table.tableSchema.fields.push(that.feedInfo.table.tableSchema.fields[x]);
        }
        this.$message.success('上传文件成功');
        this.activeName = "2";

      }).catch(err => {
        console.log(err.data)
        this.$message.error('上传文件失败');
      });
      /* while (self.model.table.partitions.length) {
           self.model.table.partitions.pop();
       }*/
    },
    createHistoryRecord (columnDef) {
      return { name: columnDef.name, derivedDataType: columnDef.derivedDataType, precisionScale: columnDef.precisionScale, deleted: columnDef.deleted, primaryKey: columnDef.primaryKey, updatedTracker: columnDef.updatedTracker, createdTracker: columnDef.createdTracker };
    },
    addHistoryItem (columnDef) {
      var historyItem = this.createHistoryRecord(columnDef);
      columnDef.history.push(historyItem);
    },
    removePartitionField (index) {
      this.feedInfo.table.partitions.splice(index, 1);
      //  partitionNamesUnique();
    },
    removefieldPoliciesField (index) {
      this.feedInfo.table.fieldPolicies.splice(index, 1);
      console.log(this.feedInfo.table.fieldPolicies)
      //  partitionNamesUnique();
    },
    removeColumnDel (index) {
      // console.log("removeColumn");
      let _this = this;
      let columnDef = _this.feedInfo.table.tableSchema.fields[index];
      //_this.$set(columnDef, 'deleted', true);
      console.log(columnDef)
      // columnDef.deleted=true
      this.$set(this.feedInfo.table.tableSchema.fields[index], 'status', 1)
      _this.feedInfo.table.tableSchema.fields.splice(index, 1);
      _this.feedInfo.table.fieldPolicies.splice(index, 1);
      // this.addHistoryItem(columnDef);
      // //remove any partitions using this field
      // //  _this.removefieldPoliciesField(index);

      // _this.feedInfo.table.fieldPolicies.forEach((item, i) => {
      //   /* if(i=0){
      //      _this.feedInfo.table.tableSchema.fields.forEach((one,index)=>{
      //        _this.feedInfo.table.fieldPolicies[index].name = _this.feedInfo.table.tableSchema.fields[index].name
      //      })
      //    }*/
      //   /*    if(item.name === columnDef.name || item.name=== ""){
      //         _this.removefieldPoliciesField(i)
      //       }*/
      // });
      // let matchingPartitions = _.filter(_this.feedInfo.table.partitions, function (partition) {
      //   return partition.columnDef.name == columnDef.name;
      // });
      // if (matchingPartitions) {
      //   _.each(matchingPartitions, function (partition) {
      //     let idx = _.indexOf(_this.feedInfo.table.partitions, partition.sourceField)
      //     if (idx >= 0) {
      //       _this.removePartitionField(idx);
      //     }
      //   });
      // }
      console.log('________________________________________')
      console.log(_this.feedInfo.table.tableSchema.fields)
      console.log(_this.feedInfo.table.fieldPolicies)
    },
    unDoColumnDel (index) {
      let columnDef = this.feedInfo.table.tableSchema.fields[index];
      columnDef.history.pop();
      let prevValue = columnDef.history[columnDef.history.length - 1];

      // Set to previous history value
      columnDef.name = prevValue.name;
      columnDef.derivedDataType = prevValue.derivedDataType;
      columnDef.precisionScale = prevValue.precisionScale;
      columnDef.deleted = prevValue.deleted;
      columnDef.primaryKey = prevValue.primaryKey;
      columnDef.createdTracker = prevValue.createdTracker;
      columnDef.updatedTracker = prevValue.updatedTracker;

      this.syncTableFieldPolicyNames();
      /* this.feedInfo.table.fieldPolicies.push(columnDef);*/
    },
    initFeedColumn (columnDef) {
      if (columnDef.origName == undefined) {
        columnDef.origName = columnDef.name;
        columnDef.origDataType = columnDef.derivedDataType;
        this.$set(columnDef, 'deleted', false);
        // columnDef.deleted = false;
        columnDef.history = [];
        console.log(this.feedInfo)
        this.addHistoryItem(columnDef);
      }
    },
    newColumnDefinition () {
      return this.newTableFieldDefinition();
    },
    replaceSpaces (str) {
      if (str != undefined) {
        return str.replace(/ /g, '_');
      }
      else {
        return '';
      }
    },
    /*手动添加字段*/
    ifIsHand () {
      if (this.selectMethod !== 'Sample File') {
        this.activeName = "2"
      } else {
        this.activeName = "1"
      }
    },
    newColumnPolicy () {
      return this.newTableFieldPolicy();
    },
    newTableFieldPolicy (fieldName, field) {
      return { field: {}, name: fieldName || '', feedFieldName: fieldName || '', partition: null, profile: true, standardization: field.standardization || [], validation: field.validation || [], nameEN: field.nameEN || '' };
    },
    addColumn (columnDef, syncFieldPolicies) {
      // console.log("addColumn");
      if (columnDef == null) {
        columnDef = this.newColumnDefinition();
      }

      // Detect domain type and select sample value
      let policy = this.newColumnPolicy();
      if (columnDef.sampleValues != null && columnDef.sampleValues.length > 0) {
        columnDef.selectedSampleValue = columnDef.sampleValues[0];
      } else {
        columnDef.selectedSampleValue = null;
      }

      if (this.useUnderscoreInsteadOfSpaces) {
        columnDef.name = this.replaceSpaces(columnDef.name);
      }
      this.initFeedColumn(columnDef);
      //add the column to both the source and destination tables as well as the fieldPolicies array
      if (this.selectMethod !== 'Sample File') {
        this.feedInfo.table.tableSchema.fields.push(columnDef);
      }
      this.feedInfo.table.fieldPolicies.push(policy);

      this.feedInfo.table.sourceTableSchema.fields.push(this.newColumnDefinition());
      //    self.validateColumn(columnDef);
      if (syncFieldPolicies == undefined || syncFieldPolicies == true) {
        this.syncTableFieldPolicyNames();
      }


    },
    syncTableFieldPolicyNames () {
      let _this = this;
      _this.feedInfo.table.tableSchema.fields.forEach(function (columnDef, index) {
        //update the the policy
        let inArray = index < _this.feedInfo.table.tableSchema.fields.length && index >= 0;
        if (inArray) {
          let name = _this.feedInfo.table.tableSchema.fields[index].name;
          if (name != undefined) {
            _this.feedInfo.table.fieldPolicies[index].name = name;
            _this.feedInfo.table.fieldPolicies[index].feedFieldName = name;
            //assign pointer to the field?
            _this.feedInfo.table.fieldPolicies[index]["field"] = columnDef;
          }
          else {
            if (_this.feedInfo.table.fieldPolicies[index].field) {
              _this.feedInfo.table.fieldPolicies[index].field == null;
            }
          }
        }
      });
      //remove any extra columns in the policies
      /*  while (_this.feedInfo.table.fieldPolicies.length > _this.feedInfo.table.tableSchema.fields.length) {
            _this.feedInfo.table.fieldPolicies.splice(_this.feedInfo.table.tableSchema.fields.length, 1);
        }*/
    },
    onFieldChange (columnDef) {
      this.detailRow = columnDef;
      this.addHistoryItem(columnDef);
    },
    onNameFieldChange (columnDef) {
      // console.log("onNameFieldChange, columnDef", columnDef);

      if (this.useUnderscoreInsteadOfSpaces) {
        columnDef.name = this.replaceSpaces(columnDef.name);
      }

      if (columnDef.derivedDataType !== 'decimal') {
        columnDef.precisionScale = null;
      }
      this.onFieldChange(columnDef);

      //update the partitions with "val" on this column so the name matches
      _.each(this.feedInfo.table.partitions, function (partition) {
        if (partition.columnDef == columnDef) {
          partition.sourceDataType = columnDef.derivedDataType;
          partition.sourceField = columnDef.name;
          this.updatePartitionFieldName(partition);
        }
      });
      this.syncTableFieldPolicyNames();
    },

    //定义table>partitions
    newPartitionField (index) {
      return { columnDef: {}, position: index, field: '', sourceField: '', formula: '', sourceDataType: '', _id: _.uniqueId() }
    },
    onPartitionFormulaChange (partition) {
      console.log(partition)
      this.updatePartitionFieldName(partition);
      // partitionNamesUnique();
    },
    getColumnDefinitionByName: function (name) {
      return _.find(this.feedInfo.table.tableSchema.fields, function (columnDef) {
        return columnDef.name == name;
      });
    },
    //添加分区
    addPartition () {
      let partitionLength = this.feedInfo.table.partitions.length;
      let partition = this.newPartitionField(partitionLength);
      console.log(this.feedInfo.table.partitions)
      this.feedInfo.table.partitions.push(partition);
      // this.partitionNamesUnique()
    },
    removePartition (index) {
      this.feedInfo.table.partitions.splice(index, 1)
    },
    //改变分区
    onPartitionSourceFieldChange (event, partition) {
      this.$nextTick(data => {
        partition.columnDef = event;
        console.log(this.feedInfo.table.partitions)
        //set the partition data to match the selected sourceField
        if (partition.columnDef != null) {
          partition.sourceField = partition.columnDef.name
          partition.sourceDataType = partition.columnDef.derivedDataType;
        }
        else {
          //  console.error("NO FIELD FOR partition ",partition)
        }
        //if there is only 1 option in the formula list then auto select it
        // var formulas = $filter('filterPartitionFormula')(self.partitionFormulas, partition);
        /*if (formulas.length == 1) {
            partition.formula = formulas[0];
        }*/
        this.updatePartitionFieldName(partition);

      })

    },
    /*   partitionNamesUnique() {
               _.chain(self.model.table.partitions).groupBy(function (partition) {
                   return partition.field
               }).each(function (group, name) {
                   if (group.length > 1) {
                       _.each(group, function (partition) {
                         //  self.defineFeedTableForm['partition_name' + partition._id].$setValidity('notUnique', false);
                       });
                   }
                   else {
                       _.each(group, function (partition) {
                           //valid this is a unique partition name
                          // self.defineFeedTableForm['partition_name' + partition._id].$setValidity('notUnique', true);
                       });
                   }
               });

               //an array of column names
               var columnNames = _.map(self.model.table.tableSchema.fields, function (columnDef) {
                   return columnDef.name;
                   console.log(columnDef.name);
               });
               var countPartitionNames = {};
               //add the angular errors
               _.each(self.model.table.partitions, function (partition) {
                   if (partition.formula != undefined && partition.formula != 'val' && _.indexOf(columnNames, partition.field) >= 0) {
                      // self.defineFeedTableForm['partition_name' + partition._id].$setValidity('notUnique', false);
                   }
               });

           },*/

    updatePartitionFieldName (partition) {
      if (partition.formula != 'val') {
        console.log(partition.formula)
        /*&& (partition.field == null || partition.field == '' || partition.field == partition.sourceField + "_")*/
        if (partition.sourceField != null) {
          partition.field = partition.sourceField + "_" + partition.formula;
        }
      }
      else {
        console.log(partition.formula)
        partition.field = partition.columnDef ? partition.columnDef.name : partition.sourceField;
      }
    },
    //点击某行，编辑某行数据
    setRowCol (row, index) {
      console.log(row)
      this.isClickRow = true;
      this.detalColName = row.name;
      console.log(JSON.stringify(this.feedInfo))
      this.detailRow = row;
      if (this.detailRow.selectedSampleValue == null && this.detailRow.sampleValues.length > 0) {
        this.detailRow.selectedSampleValue = this.detailRow.sampleValues[0];
      }
      // Ensure tags is an array
      if (!Array.isArray(this.detailRow.tags)) {
        this.detailRow.tags = [];
      }
      console.log("this.feedInfo:")
      console.log(this.feedInfo)
    },

    //全选index 索引
    handleCheckAllChangeIndex (val) {
      this.feedInfo.table.fieldPolicies.map((item) => {
        this.$set(item, 'index', val)
      })
    },
    //全选配置
    handleCheckAllChangeProfile (val) {
      this.feedInfo.table.fieldPolicies.map((item) => {
        this.$set(item, 'profile', val)
      })
    },
    //index单选
    handleCheckItemChange (val) {
      for (let i = 0, l = this.feedInfo.table.fieldPolicies.length; i < l; i++) {
        if (this.feedInfo.table.fieldPolicies[i].index !== val) {
          this.checkAllIndex = false;
          return;
        }
      }
      this.checkAllIndex = val;
      console.log(this.feedInfo)
    },
    //配置单选
    handleCheckItemChangeProfile (val) {
      for (let i = 0, l = this.feedInfo.table.fieldPolicies.length; i < l; i++) {
        if (this.feedInfo.table.fieldPolicies[i].profile !== val) {
          this.checkAllProfile = false;
          return;
        }
      }
      this.checkAllProfile = val;
      console.log(this.feedInfo)
    },

    //改变目标格式
    onTableFormatChange () {
      console.log(this.feedInfo)
      //  this.compressionOptions = ['NONE'];//目标格式
      let format = this.feedInfo.table.targetFormat;
      if (this.compressionMethods[format]) this.compressionOptions = this.compressionMethods[format]
      else this.compressionOptions = ['NONE']
    },

    //添加属性
    addProperty () {
      this.propertyList.push({ description: null, displayName: null, locked: false, order: this.propertyList.length, required: true, systemName: "", value: "", $error: {} });
    },
    removePropertyFeed (index) {
      this.propertyList.splice(index, 1);
    },



    tableRowClassName ({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    addRules (row) {
      console.log(row)
      this.fieldIndex = row.index;
      this.fieldName = 'Add 字段配置 为字段' + row.name
      if (row.standerData && row.standerData.length > 0) {
        this.standerData = row.standerData.slice(0)
      }
      if (row.verifyData && row.verifyData.length > 0) {
        this.verifyData = row.verifyData.slice(0)
      }
      this.dialogVisible = true;
      this.isEditData = false;

    },
    onSubmit () {
      console.log(this.fieldIndex)
      console.log(this.clData)
      this.clData[this.fieldIndex].standerData = this.standerData;
      this.clData[this.fieldIndex].verifyData = this.verifyData;
      this.dialogVisible = false
    },
    cancelDialog () {
      this.dialogVisible = false;
      this.standerForm = { type: '' };
      this.standerData = [];
      this.verifyForm = { type: '' };
      this.verifyData = [];
    },
    cancelStanderRule () { //取消标准化规则
      this.standerForm = { type: '' };
      this.verifyForm = { type: '' };
    },
    addStanderRule () { //添加标准化规则
      if (this.radio == '1') {
        this.standerData.push(this.standerForm);
        this.standerForm = { type: '' };
      } else {
        this.verifyData.push(this.verifyForm);
        this.verifyForm = { type: '' };
      }
    },
    standerRuleChange () { //标准化规则类型改变
      var self = this;
      switch (self.verifyForm.type) {
        case 'base64解码':
          self.standerForm['output'] = '';
          break;
        case 'base64编码':
          self.standerForm['output'] = '';
          break;
        case '日期/时间':
          self.standerForm['dateFormat'] = '';
          self.standerForm['outputFormat'] = '';
          self.standerForm['inputZone'] = '';
          self.standerForm['outputZone'] = '';
          break;
        case '默认值':
          self.standerForm['value'] = '';
          break;
        case '正则表达式':
          self.standerForm['mode'] = '';
          self.standerForm['replace'] = '';
          break;
        default:
      }
    },
    verifyRuleChange () {
      var self = this;
      switch (self.verifyForm.type) {
        case '日期':
          self.verifyText = '验证Hive友好的日期格式';
          break;
        case '电子邮箱':
          self.verifyText = '有效的电子邮箱地址';
          break;
        case 'IP地址':
          self.verifyText = '有效的IP地址';
          break;
        case 'Credit card':
          self.verifyText = 'Valid credit card';
          break;
        case '美国电话':
          self.verifyText = '验证美国电话';
          break;
        case '美国邮编':
          self.verifyText = '验证美国邮编';
          break;
        case '长度':
          self.verifyForm['minL'] = '';
          self.verifyForm['maxL'] = '';
          break;
        case '非空':
          break;
        case '范围':
          self.verifyForm['min'] = '';
          self.verifyForm['max'] = '';
          break;
        case '正则表达式':
          self.verifyForm['reg'] = '';
          break;
        case '时间戳':
          self.verifyForm['isNull'] = '否';
          break;
        case '验证字符':
          self.verifyForm['sType'] = '';
          break;
        default:
          self.verifyText = ''
      }
    },
    editData (radio, index) {//编辑标准haul规则
      this.isEditData = true;
      this.radio = radio;
      this.currIndex = index;
      if (radio == '1') {
        this.standerForm = Object.assign({}, this.standerData[index]);
      } else {
        this.verifyForm = Object.assign({}, this.verifyData[index]);
      }
    },
    delData (radio, index) {//删除标准化规则数据
      if (radio == '1') {
        this.standerData.splice(index, 1);
      } else {
        this.verifyData.splice(index, 1);
      }
    },
    saveEditData () {
      if (this.radio == '1') {
        this.standerData[this.currIndex] = this.standerForm;
        this.standerForm = { type: '' }
      } else {
        this.verifyData[this.currIndex] = this.verifyForm;
        this.verifyForm = { type: '' }
      }

      this.isEditData = false;

    },
    setCronDriven () {
      this.feedInfo.schedule.schedulingStrategy = 'CRON_DRIVEN';
      this.feedInfo.schedule.schedulingPeriod = this.DEFAULT_CRON;
    },
    setTimerDriven () {
      this.feedInfo.schedule.schedulingStrategy = 'TIMER_DRIVEN';
      this.timerAmount = 5;
      this.timerUnits = "min";
      this.feedInfo.schedule.schedulingPeriod = "5 min";
    },
    onScheduleStrategyChange () {
      console.log("1111")
      this.feedInfo.schedule.schedulingStrategyTouched = true;
      if (this.feedInfo.schedule.schedulingStrategy == "CRON_DRIVEN") {
        this.isTimer = false;
        this.isCron = true;
        if (this.feedInfo.schedule.schedulingPeriod != this.DEFAULT_CRON) {
          this.setCronDriven();
        }
      } else if (this.feedInfo.schedule.schedulingStrategy == "TIMER_DRIVEN") {
        this.isTimer = true;
        this.isCron = false;
        this.setTimerDriven();
      }
      console.log(this.feedInfo)
    },

    //改变时间
    handleTimerChange () {
      if (this.timerAmount != null && (this.timerAmount == 0 || (this.timerAmount < 3 && this.timerUnits == 'sec'))) {
        this.$message.error('警告! 你有这个流程计划一个非常快的计时器。 请确保您希望在继续之前快速安排此流程');
      }
      this.feedInfo.schedule.schedulingPeriod = this.timerAmount + " " + this.timerUnits;
      console.log(this.feedInfo.schedule)
    },
    // 获取知识包
    getLoadPackagesList () {
      const obj = { project: this.ruleName }
      getLoadPackages(obj).then(data => {
        console.log('------知识包')
        /*  this.taskInfo.ruleList = []
         this.$set(this.taskInfo, 'ruleList', data) */
        this.$nextTick(() => {
          this.taskInfo.ruleList = data
          this.knowPackageState = true
          console.log(this.taskInfo.ruleList)
        })
        // this.taskInfo.ruleList.reverse()
        // this.taskInfo.ruleList = data
      })
    },
    // 保存变量数据
    savesFile () {
      console.log('----==================')
      console.log(this.ruleInfo)
      const obj = { file: `/${this.ruleName}/${this.ruleInfo.targetTableName}.vl.xml`, tableName: this.ruleInfo.targetTableName, columns: this.handleTableFields(this.feedInfo.table.tableSchema.fields) }
      saveLibrary(obj).then(res => {
        console.log(res)
      })
    },
    saveFeedPost () {
      this.ruleInfo.knowPackage = `${this.ruleName}/${this.ruleInfo.knowPackage}`
      this.feedInfo.tags.push(this.tag);
      this.feedInfo.table.tableSchema.name = this.feedInfo.feedName;
      if (this.feedInfo.properties.length === 0 && this.feedInfo.inputProcessorName === "Filesystem") {
        this.feedInfo.properties = this.feedInfo.inputProcessor.properties;
      } else if (this.feedInfo.properties.length === 0 && this.feedInfo.inputProcessorName === "Database") {
        this.feedInfo.properties = this.feedInfo.nonInputProcessors[0].properties;
      } else if (this.isTransformBool) {
        this.feedInfo.properties = this.feedInfo.inputProcessor.properties;
      }
      this.feedInfo.userProperties = this.propertyList;
      if (this.isTransformBool) {
        this.feedInfo.dsgProperties.interface = {};
        this.feedInfo.dsgProperties.interface.targetDbName = this.ruleInfo.targetDbName;
        this.feedInfo.dsgProperties.interface.targetTableName = this.ruleInfo.targetTableName;
      }
      this.feedInfo.dsgProperties.rule = this.ruleInfo

      console.log('==========================保存')
      console.log(params)
      // return;
      if (this.transformData.datasources !== undefined) {
        this.feedInfo.dataTransformation.datasourceIds = this.transformData.datasources.map(el => el.id)
        this.feedInfo.dataTransformation.dataTransformScript = this.transformData.script
        this.feedInfo.dataTransformation.sql = this.SQLStr
      }
      else {
        this.feedInfo.dataTransformation.datasourceIds = [this.dataBaseValue]
        this.feedInfo.dataTransformation.dataTransformScript = this.transformData.script
        this.feedInfo.dataTransformation.sql = this.SQLStr
      }
      if (this.ruleInfo.targetDbName_2) {
        this.feedInfo.dsgProperties.interface.targetDbName = this.ruleInfo.targetDbName_2;
        this.feedInfo.dsgProperties.interface.targetTableComment = this.ruleInfo.targetTableComment_2
        if (this.ruleInfo.targetTableName_2.indexOf('.') > -1) {
          this.feedInfo.dsgProperties.interface.targetTableName = this.ruleInfo.targetTableName_2.split('.')[1];
        }
        else {
          this.feedInfo.dsgProperties.interface.targetTableName = this.ruleInfo.targetTableName_2
        }

      }
      this.feedInfo.dsgProperties.interface.targetTableType = this.feedInfo.type
      this.feedInfo.table.sourceTableSchema.fields = JSON.parse(JSON.stringify(this.feedInfo.table.tableSchema.fields))
      if (this.feedInfo.type = 'STANDARD') {
        let Arr = Object.assign([], this.feedInfo.table.tableSchema.fields)
        this.feedInfo.table.tableSchema.fields = Arr.map(el => { el.name = el.nameEN; return el })
        // let arr = [...this.feedInfo.table.tableSchema.fields];
        // this.feedInfo.table.tableSchema.fields = [...arr.map(el => { el.name = el.nameEN; return el })]
        // this.feedInfo.table.sourceTableSchema.fields = [...arr.map(el => { el.name = el.sourceName; return el })]
        this.feedInfo.table.fieldPolicies = this.feedInfo.table.fieldPolicies.map(el => { el.name = el.feedFieldName = el.nameEN;; return el })
      }

      // this.feedInfo.table.fieldPolicies = this.feedInfo.table.tableSchema.fields
      if (!this.isTransformBool) this.feedInfo.nonInputProcessors[0].allProperties[13].value = this.outPutStr
      let params = this.feedInfo;
      console.log(this.dataBaseValue)
      this.saveLoadding = true;
      console.log(params)
      saveFeed(params).then(data => {
        console.log(data)
        if (data.success == false) {
          this.$message.error('保存流程失败');
          this.saveLoadding = false;
        } else {
          this.saveLoadding = false;
          this.$router.push({ path: '/flowManage/feedsList' });
          this.$message.success('保存流程成功');
        }

      }).catch(err => {
        this.saveLoadding = false;
        console.log(err.data)
        this.$message.error('保存流程失败');
      });
    },
    //验证规则 getFeedValidation getFeedStandardization
    openRule (val) {
      this.dialogRule = true;
      this.ruleFileds = val;
      if (this.ruleFileds.validation) {
        let arr = [];
        this.ruleFileds.validation.forEach(el => {
          el.type = 'validation'
          arr.push(el)
        })
        this.ruleFileds.standardization.forEach(el => {
          el.type = 'standardization'
          arr.push(el)
        })
        this.policyRules = arr
      }
      else {
        this.policyRules = []
      }
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
            console.log(currentFeedProperties)
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

      var optionsArr = [];
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
        if (_this.feedInfo != null) {
          currentFeedValue = _this.currentFeedValue(this.feedInfo);
          currentFeedValue = currentFeedValue.toLowerCase();
        }
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
        this.ruleTypesAvailable();
        // $scope.loadingPolicies = false;
      }).catch(err => { })
    },
    //standardization
    getStandardizationOptions () {
      getFeedStandardization().then(data => {
        let currentFeedValue = null;
        let _this = this;
        if (_this.feedInfo != null) {
          console.log(_this.feedInfo)
          console.log("this.feedInfo")
          currentFeedValue = _this.currentFeedValue(this.feedInfo);
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
        // this.setupPoliciesForFeed();
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

    addPolicy ($event) {
      if (this.policyRules == null) {
        this.policyRules = [];
      }
      // buildDisplayString();
      console.log(this.ruleType)
      //  this.editRule["ruleType"] = this.ruleType;
      const rule = JSON.parse(JSON.stringify(this.editRule))
      this.policyRules.push(rule);
      this.pendingEdits = true;
      this.ifEditRules = true;
      // this._cancelEdit();
    },
    doneRule ($event) {
      let validators = [];
      let standardizers = [];
      let _this = this;
      console.log(_this.policyRules)
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
      console.log(_this.feedInfo.table)
    },

    onPropertyChanged (val) {
      console.log(val)
    },


    //接收数据转换的值
    getTransformInfo () {
      this.saveLoadding = false;
      this.transformFeedInfo = this.$route.query.feedInfo;
      let fdStart = this.transformFeedInfo.templateName.indexOf("Data Transformation");
      let fdStartlower = this.transformFeedInfo.templateName.indexOf("data-transform");
      if (fdStart == 0 || fdStartlower == 0) {
        this.isTransformBool = true;
      } else if (fdStart == -1 || fdStartlower == -1) {
        this.isTransformBool = false;
      }
      /*this.transformFeedInfo.templateName == "Data Transformation"*/
      if (this.transformFeedInfo !== 'undefined' && this.isTransformBool) {
        this.feedInfo.templateTableOption = "DATA_TRANSFORMATION";
        this.feedInfo.category = this.transformFeedInfo.category;
        this.feedInfo.categoryId = this.transformFeedInfo.categoryId;
        this.feedInfo.createDate = this.transformFeedInfo.createDate;
        this.feedInfo.feedId = this.transformFeedInfo.feedId;
        this.feedInfo.feedName = this.transformFeedInfo.feedName;
        this.feedInfo.id = this.transformFeedInfo.id;
        this.feedInfo.templateId = this.transformFeedInfo.templateId;
        this.feedInfo.templateName = this.transformFeedInfo.templateName;
        if (this.transformFeedInfo.dataTransformation.chartViewModel.nodes !== null) {
          this.containers = this.transformFeedInfo.dataTransformation.chartViewModel.nodes;
          this.connections = this.transformFeedInfo.dataTransformation.chartViewModel.connections;
          console.log(this.containers)
          console.log(this.connections)
          var that = this;
          var exampleGreyEndpointOptions = {
            endpoint: "Dot",
            paintStyle: { width: 20, height: 20, fill: '#666', radius: 5 },
            isSource: true,
            anchor: ['Top', 'Left', 'Bottom', 'Right'],
            connectorStyle: { stroke: "#666" },
            isTarget: true
          };
          this.$nextTick(function () {
            this.jsPlumb.draggable($('.draggle-div'), {
              containment: true
            })
            this.containers.forEach((one, index, arr) => {
              this.jsPlumb.addEndpoint(one.id, {
              }, exampleGreyEndpointOptions);
            })
            this.connections.forEach((one, index, arr) => {
              this.jsPlumb.connect({
                source: one.source.id,
                target: one.target.id,
              }, that.common)
            })

          })
        }
        this.isStep1 = true;
        this.isStepFirst = false;
        this.active = 2;
      }
    },
    // 规则模板只允许hive数据源
    handleType (arrs) {
      if (!this.isRuleTemplate) return;
      let hiveArr = []
      for (const item of arrs) {
        if (item.type.toLowerCase() === 'hive') {
          hiveArr.push(item)
        }
      }
      this.dataBaseArr = [...DEFAULT_DATASOURCE, ...hiveArr];
    },
    // 过滤hive数据源
    filterDatasourceHive (arrs) {
      console.log('过滤hive数据源')
      console.log(arrs)
      console.log(this.isIngestBool)
      if (!this.isIngestBool) return
      let result = []
      for (const item of arrs) {
        if (item.id !== 'Hive' && item.type.toLowerCase() !== 'hive') {
          result.push(item)
        }
      }
      console.log('-------------过滤hive后的数据')
      this.dataBaseArr = [...result];
      console.log(this.dataBaseArr)
    },
    // 把任务的值赋给流程
    setfeedInfo () {
      // 分类赋值
      this.feedInfo.category.name = this.taskInfo.name
      this.feedInfo.category.id = this.taskInfo.id
      this.feedInfo.category.systemName = this.taskInfo.referId
      // 数据源的值
      this.dataBaseArr = this.taskInfo.ds_list
      // 数据源赋值
      // this.Type = [...DEFAULT_DATASOURCE, ...this.taskInfo.dsList]
      this.Type = [...DEFAULT_DATASOURCE]
      console.log('=========================通过任务继承的值')
      console.log(this.feedInfo)
      console.log(this.Type)
      console.log(this.taskInfo)
      // 根据是否为规则模板 设置数据源
      this.handleType([...this.dataBaseArr])
      // 采集流程过滤hive数据源
    },
    // 检测表名
    fileExistCheck () {
      const obj = { fullFileName: `/${this.ruleName}/${this.ruleInfo.targetTableName}.vl.xml` }
      checkName(obj).then(res => {
        console.log(res)
        console.log(res.valid)
        return res.valid
      })
    },
    // 创建变量库
    createLibrary () {
      if (this.ruleInfo.targetTableName) {
        // path=/111/Jmsok2.vl.xml&type=vl.xml
        const obj = { path: `/${this.ruleName}/${this.ruleInfo.targetTableName}.vl.xml`, type: 'vl.xml' }
        setLibrary(obj).then(res => {
          this.isSetLibraryState = false;
          if (res.code && res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '创建失败')
            return;
          }
          this.$message.success('创建成功')
          /* if (res instanceof Object) {
            this.$message.success('创建成功')
            this.isCreateLibraryState = false;
          } else {
            this.$message.error('创建失败')
            this.isSetLibraryState = false;
          } */
        })
      } else {
        this.$message.warning('请输入数据表名')
      }
    }
  },
  mounted () {
    this.feedInfo.systemFeedName = this.getUUid()
    this.getSchemasList()
    if (this.$route.query.feedInfo) this.getTransformInfo();
    if (this.$route.query.template) this.getTemplateInfo();
    this.getRuleName()
    // 获取router传来的参数
    this.taskInfo = this.$route.params.taskInfo ? this.$route.params.taskInfo : { rulist: [] }
    console.log('============================-----')
    console.log(this.taskInfo)
    console.log(this.$route.query)
    // this.taskInfo.standard_list = [{
    //   id: "97aa7bd5e6f349c5a5b42b334db62b60",
    //   name: "陈敏的标准0227_2",
    //   parent_id: "de8693f3d0e641a98698c2270bcefc85",
    //   type: 0,
    //   columns: [{
    //     bsgs: "",
    //     creat_time: 1551254569000,
    //     datatype: "varchar",
    //     default_value: "",
    //     description: "",
    //     id: "04edf1c4b9ab4e5e90494f6a50d51426",
    //     ispk: 0,
    //     name_cn: "空字段1",
    //     name_en: "nu1",
    //     nullable: 0,
    //     parent_id: "97aa7bd5e6f349c5a5b42b334db62b60",
    //     standard_base_column_namecn: "",
    //     standard_base_id: "",
    //     standardization: null,
    //     update_time: 1551254569000,
    //     validation: null,
    //   }]
    // }]
    if (this.isTransformBool) {
      this.dsListArr = this.taskInfo.ds_list
      this.dataBaseArr = this.taskInfo.ds_list
    }
    else {
      this.dataBaseArr = this.dsListArr = [{ id: 'Hive', name: 'Hive' }]
    }

    // 接受流程的值
    console.log('============================-----query')
    console.log(this.$route)
    this.setfeedInfo()
    // this.getCategoryData(); // 分类从任务继承
    // this.getType(); // 数据源从任务继承

  },
  filters: {
    toCN (str) {
      const toCNJson = { 'Database': '数据库', 'Filesystem': '文件系统', 'FULL_LOAD': '全量同步', 'INCREMENTAL': '增量同步', 'AVRO': '', 'DELIMITED': '' }
      return toCNJson[str]
    },
    translate (val) {
      if (translateJsonData[val] == "" || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
    filterFieldDates (field) {
      if (field == 'date' || field == 'timestamp') {
        return field
      } else {
        return field = "";
      }
    },
    filterFormula: function (formulas, partition) {
      let columnDef = (partition && partition.sourceField) ? this.getColumnDefinitionByName(partition.sourceField) : null;
      if (columnDef == null) {
        return formulas;
      }
      // Filter formulas based on column type
      if (columnDef.derivedDataType !== "date" && columnDef.derivedDataType !== "timestamp") {
        return _.without(formulas, "to_date", "year", "month", "day", "hour", "minute");
      } else {
        return formulas;
      }
    },
  }
}
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
<style scoped="">
.fn-history {
  text-align: center;
}
.fn-history h3 {
  border-bottom: 1px solid #ebeef5;
  line-height: 35px;
}

.fn-result {
  padding: 20px 0;
}
.table-border {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
}
.definedFeedmain {
  min-height: 400px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.crolUl {
  list-style: none;
  width: 200px;
}
.crolUl li {
  /* padding: 0 35%;*/
  border: 1px solid #ddd;
}
.box-card:hover {
  border: 1px solid #409eff;
}
.text {
  font-size: 14px;
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
