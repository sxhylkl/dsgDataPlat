<template>
  <div>
    <el-row>
      <el-button
        :disabled="loading"
        size="small"
        type="warning"
        v-if="editFeedInfo.state==='ENABLED'"
        @click="disabledFeedPost()"
      >禁用流程</el-button>
      <el-button
        :disabled="loading"
         size="small"
        type="success"
        v-if="editFeedInfo.state!=='ENABLED'"
        @click="enableFeedPost()"
      >启动流程</el-button>
      <el-button
        :disabled="loading"
         size="small"
        type="danger"
        v-if="editFeedInfo.state!=='ENABLED'"
        @click="delDetailFeed()"
      >删除流程</el-button>
      <!--<el-button type="primary">克隆流程</el-button>-->
      <!--<el-button type="warning">导出流程</el-button>-->
      <span v-show="loading" :disabled="loading" class="feedDetailStyle">导出流程</span>
      <a
        v-show="!loading"
        :href="'/datalake-feed_/v1/feedmgr/admin/export-feed/'+editFeedInfo.id"
        class="feedDetailStyle"
      >导出流程</a>
      <el-button
      style="margin-left:5px;"
        :disabled="loading"
         size="small"
        type="primary"
        v-if="editFeedInfo.state!=='ENABLED'"
        @click="startOneceFeed()"
      >一次性启动流程</el-button>
      <el-button style="float: right; padding: 10px 0" type="text" @click="back">返回</el-button>
    </el-row>
    <el-tabs v-model="activeName" style="margin-top:20px;" v-loading="loading">
      <el-tab-pane label="流程基本定义" name="feedDefinition">
        <!--流程基本定义-->
        <div v-if="isShowDetail">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>流程基本定义</span>
              <el-button
                style="float: right; padding: 5px 10px"
                type="primary"
                @click="editBtn()"
              >编辑</el-button>
            </div>
            <div class="text item">
              <el-row class="editRowStyle">
                <el-col :span="6">流程名称：</el-col>
                <el-col :span="12">{{editFeedInfo.feedName}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">系统名称：</el-col>
                <el-col :span="12">{{editFeedInfo.systemFeedName}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">流程状态：</el-col>
                <el-col :span="12">{{editFeedInfo.state | translate}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">表：</el-col>
                <el-col :span="12">{{editFeedInfo.table.tableSchema.name}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">类别：</el-col>
                <el-col :span="12">{{editFeedInfo.category.name}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">描述：</el-col>
                <el-col :span="12">{{editFeedInfo.description}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">流程方式：</el-col>
                <el-col :span="12">{{editFeedInfo.templateName}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">流程处理：</el-col>
                <el-col :span="12" v-if="editFeedInfo.isStream">流处理</el-col>
                <el-col :span="12" v-if="!editFeedInfo.isStream">批量处理</el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <!--流程基本定义-->
        <div v-if="isEditDetail">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>编辑流程基本定义</span>
              <el-button
                style="float: right; padding: 5px 10px"
                type="primary"
                @click="editBtn()"
                v-if="isShowDetail"
              >编辑</el-button>
            </div>
            <div class="text item">
              <el-form :inline="true" :model="getEditFeedInfo" class="demo-form-inline">
                <el-form-item label="流程名称">
                  <el-input v-model="getEditFeedInfo.feedName"></el-input>
                </el-form-item>
                <el-form-item label="流程系统名称">
                  <el-input v-model="getEditFeedInfo.systemFeedName" disabled></el-input>
                </el-form-item>
              </el-form>
              <el-form :model="getEditFeedInfo">
                <el-form-item label="描述">
                  <el-input type="textarea" v-model="getEditFeedInfo.description"></el-input>
                </el-form-item>
                <el-form-item label="流程方式">
                  <el-input v-model="getEditFeedInfo.templateName" disabled></el-input>
                </el-form-item>
              </el-form>
              <el-row>
                <el-button @click="cancelDefinedSave()">取消</el-button>
                <el-button type="success" @click="saveDefinedFeed()">保存</el-button>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="流程详情" name="feedDetaiil">
        <!--流程详情-->
        <div v-if="isShowDetailDeltail">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>流程详情</span>
              <el-button
                style="float: right; padding: 5px 10px"
                type="primary"
                @click="editDetailBtn()"
              >编辑</el-button>
            </div>
            <div class="text item">
              <div v-if="editFeedInfo.inputProcessorName === 'Database'">
                <!--editFeedInfo.inputProcessorName === 'Database'-->
                <el-row class="editRowStyle">
                  <el-col :span="6">来源：</el-col>
                  <el-col :span="12">{{editFeedInfo.inputProcessorName}}</el-col>
                </el-row>
                <el-row class="editRowStyle">
                  <el-col :span="6">源数据库连接：</el-col>
                  <el-col :span="12">{{nonAndInptProperty.name}}</el-col>
                </el-row>
                <el-row class="editRowStyle">
                  <el-col :span="6">加载策略：</el-col>
                  <el-col :span="12">{{detailNon['Load Strategy']}}</el-col>
                </el-row>
                <el-row class="editRowStyle">
                  <el-col :span="6">输出类型：</el-col>
                  <el-col :span="12">{{detailNon['Output Type']}}</el-col>
                </el-row>
              </div>
              <div
                v-if="editFeedInfo.inputProcessorType === 'org.apache.nifi.processors.standard.GetFile'"
              >
                <el-row class="editRowStyle">
                  <el-col :span="6">来源：</el-col>
                  <el-col :span="12">{{fileOrigin}}</el-col>
                </el-row>
                <div
                  v-for="inputProcessor in editFeedInfo.properties"
                  v-if="inputProcessor.name !=='Database'"
                >
                  <el-row class="editRowStyle">
                    <el-col :span="6">{{inputProcessor.key | translate}}：</el-col>
                    <el-col :span="12">{{inputProcessor.value}}</el-col>
                  </el-row>
                </div>
              </div>
              <div
                v-if="editFeedInfo.inputProcessorType !== 'org.apache.nifi.processors.standard.GetFile'&& editFeedInfo.inputProcessorName !== 'Database'"
              >
                <el-row class="editRowStyle">
                  <el-col :span="6">来源：</el-col>
                  <el-col :span="12">{{editFeedInfo.inputProcessorName}}</el-col>
                </el-row>
                <div
                  v-for="property in editFeedInfo.properties"
                  v-if="editFeedInfo.properties !== undefined"
                >
                  <el-row class="editRowStyle">
                    <el-col :span="6">{{property.key | translate}}：</el-col>
                    <el-col :span="12">{{property.value}}</el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div v-if="isTransformBool" class="text item">
              <!--editFeedInfo.templateName==='Data Transformation'-->
              <div style="margin-bottom: 20px;">
                <el-row>
                  <el-col :span="6">
                    <el-button plain disabled>查询</el-button>
                  </el-col>
                  <el-col :span="18">
                    <span>{{editFeedInfo.dataTransformation.sql}}</span>
                  </el-col>
                </el-row>
              </div>
              <el-button plain disabled>数据转换</el-button>
            </div>
          </el-card>
        </div>
        <div v-if="isEditDetailDetail">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>编辑流程基本定义</span>
            </div>
            <div class="text item">
              <div
                v-if="editFeedInfo.inputProcessorType === 'org.apache.nifi.processors.standard.GetFile'"
              >
                <el-row class="editRowStyle">
                  <el-col :span="6">来源：</el-col>
                  <el-col :span="12">{{fileOrigin}}</el-col>
                </el-row>
                <div
                  v-for="inputProcessor in getEditFeedInfo.properties"
                  v-if="inputProcessor.name !=='Database'"
                >
                  <el-form>
                    <el-form-item :label="inputProcessor.key | translate">
                      <el-input v-model="inputProcessor.value"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div
                v-if="editFeedInfo.inputProcessorType !== 'org.apache.nifi.processors.standard.GetFile'&& editFeedInfo.inputProcessorName !== 'Database'"
              >
                <el-row class="editRowStyle">
                  <el-col :span="6">来源：</el-col>
                  <el-col :span="12">{{this.editFeedInfo.inputProcessorName}}</el-col>
                </el-row>
                <div
                  v-for="property in getEditFeedInfo.properties"
                  v-if="getEditFeedInfo.properties !== undefined"
                >
                  <el-form>
                    <el-form-item :label="property.key | translate">
                      <el-input v-model="property.value"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div v-if="editFeedInfo.inputProcessorName === 'Database'">
                <div v-if="false">
                  <el-form
                    v-for="property in editFeedInfo.registeredTemplate.properties"
                    v-if="property.key!='CSV Header Definition' && property.key != 'index-columns' && !(property.processorName=='ConvertJSONToSQL' && property.key=='JDBC Connection Pool') && property.processorType =='com.thinkbiganalytics.nifi.v2.ingest.GetTableData'"
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
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
                <div>
                  <el-form>
                    <el-form-item label="选择数据源：">
                      <!--<el-radio v-model="radio" v-for="one in feedInfo.inputProcessors" :label="one" >{{one.name | translate}}</el-radio>-->
                      <el-radio v-model="selectDatasource" label="1" disabled>数据库</el-radio>
                      <el-radio v-model="selectDatasource" label="2" disabled>文件系统</el-radio>
                    </el-form-item>
                  </el-form>
                  <el-form>
                    <el-form-item label="源数据库连接">
                      <el-input v-model="nonAndInptProperty.name" disabled></el-input>
                    </el-form-item>
                  </el-form>
                  <el-form>
                    <el-form-item label="类型表">
                      <el-input v-model="detailNon['Source Table']" disabled></el-input>
                    </el-form-item>
                  </el-form>
                  <el-form>
                    <el-form-item label="加载策略">
                      <el-radio-group v-model="strategyRadio">
                        <!-- @change="changeStratege"-->
                        <el-radio
                          v-for="strategy in loadStrategyOptions"
                          :label="strategy.name"
                        >{{strategy.name}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="strategyRadio !== 'FULL_LOAD'" label="高阀值日期字段">
                      <el-select v-model="inTop" filterable>
                        <!-- @change="filterDateOption"-->
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
                  <el-form>
                    <el-form-item label="输出类型">
                      <el-select v-model="outPutStr" placeholder="请选择" @change="outPutChange">
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
              </div>
              <el-row v-if="!isTransformBool">
                <!--editFeedInfo.templateName!=='Data Transformation'-->
                <el-button @click="cancelDetailSave()">取消</el-button>
                <el-button type="success" @click="saveDetailFeed()">保存</el-button>
              </el-row>
            </div>
            <div v-if="isTransformBool" class="text item">
              <!--editFeedInfo.templateName==='Data Transformation'-->
              <div style="margin-bottom: 20px;">
                <el-button type="primary" @click="goToTransformationOne()">查询</el-button>
              </div>
              <el-button type="primary" @click="goToTransformationOne()">数据转换</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="表架构 & 数据策略" name="tableFramework">
        <!--表架构 & 数据策略-->
        <div v-if="isShowDetailTable">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>表架构 & 数据策略</span>
              <el-button
                style="float: right; padding: 5px 10px"
                type="primary"
                @click="editTablelBtn()"
              >编辑</el-button>
            </div>
            <div class="text item">
              <el-row class="editRowStyle">
                <el-col :span="6">源流程记录格式：</el-col>
                <el-col :span="12">{{editFeedInfo.table.feedFormat}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">定义表名：</el-col>
                <el-col
                  :span="12"
                  v-if="editFeedInfo.dsgProperties.interface===undefined"
                >{{editFeedInfo.category.systemName}}.{{editFeedInfo.systemFeedName}}</el-col>
                <el-col
                  :span="12"
                  v-if="editFeedInfo.dsgProperties.interface!==undefined"
                >{{tabName}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-table :data="editFeedInfo.table.fieldPolicies" stripe style="width: 100%">
                  <el-table-column label="字段名" prop="fieldName" width="180"></el-table-column>
                  <el-table-column label="主键">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.primaryKey" disabled></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createdTracker" label="创建日期">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.createdTracker" disabled></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="updatedTracker" label="更新日期">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.updatedTracker" disabled></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="index" label="索引">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.index" disabled></el-checkbox>
                    </template>
                  </el-table-column>

                  <el-table-column prop="profile" label="配置文件">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.profile" disabled></el-checkbox>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">合并去重：</el-col>
                <el-col :span="12">{{editFeedInfo.table.targetMergeStrategy | translate}}</el-col>
                <!--mergeStrategyDisplayName-->
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">目标格式：</el-col>
                <el-col :span="12">{{editFeedInfo.table.targetFormat}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">压缩选项：</el-col>
                <el-col :span="12">{{editFeedInfo.table.options.compressionFormat}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">选项：</el-col>
                <el-col :span="12">
                  <!--options.skipHeader-->
                  <el-checkbox v-model="editFeedInfo.options.skipHeader" disabled></el-checkbox>
                  <span>跳过标题行</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>

        <!--表架构编辑-->
        <div v-if="isEditDetailTable" >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>表架构 & 数据策略</span>
            </div>
            <div class="text item">
              <el-row class="editRowStyle">
                <el-col :span="6">源流程记录格式：</el-col>
                <el-col :span="12">{{getEditFeedInfo.table.feedFormat}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">定义表名：</el-col>
                <el-col :span="12">{{tabName}}</el-col>
                <!-- {{getEditFeedInfo.category.systemName}}.{{getEditFeedInfo.table.tableSchema.name}} -->
              </el-row>
              <el-row class="editRowStyle">
                <el-table
                  :data="getEditFeedInfo.table.fieldPolicies"
                  stripe
                  key="editTable"
                  style="width: 100%"
                >
                  <el-table-column label="字段名" width="180">
                    <template slot-scope="scope">{{scope.row.fieldName}}</template>
                  </el-table-column>
                  <el-table-column label="主键">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.primaryKey"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="创建日期">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.createdTracker" disabled></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="更新日期">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.updatedTracker" disabled></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="索引">
                    <template slot-scope="scope" slot="header">
                      <el-checkbox v-model="checkAllIndex" @change="handleCheckAllChangeIndex"></el-checkbox>
                      <!-- @change="handleCheckAllChangeIndex"-->
                      <span>索引</span>
                    </template>
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.index" @change="handleCheckItemChange"></el-checkbox>
                      <!-- @change="handleCheckItemChange"-->
                    </template>
                  </el-table-column>

                  <el-table-column label="配置文件">
                    <template slot-scope="scope" slot="header">
                      <el-checkbox v-model="checkAllProfile" @change="handleCheckAllChangeProfile"></el-checkbox>
                      <!-- @change="handleCheckAllChangeProfile"-->
                      <span>配置文件</span>
                    </template>
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.profile"
                        @change="handleCheckItemChangeProfile"
                      ></el-checkbox>
                      <!-- @change="handleCheckItemChangeProfile"-->
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row class="editRowStyle">
                <el-radio-group v-model="getEditFeedInfo.table.targetMergeStrategy">
                  <el-radio
                    v-for="strategy in mergeStrategies"
                    :value="strategy.type"
                    :label="strategy.name"
                    :disabled="strategy.disabled"
                  >{{strategy.name | translate}}</el-radio>
                </el-radio-group>
              </el-row>
              <el-row class="editRowStyle">
                <el-form label-width="80px">
                  <el-form-item label="目标格式">
                    <el-select
                      v-model="getEditFeedInfo.table.targetFormat"
                      filterable
                      placeholder="请选择"
                      disabled
                    >
                      <!-- @change="onTableFormatChange()-->
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
                      v-model="getEditFeedInfo.table.options.compressionFormat"
                      filterable
                      placeholder="请选择"
                      disabled
                    >
                      <el-option
                        v-for="item in compressionOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">选项：</el-col>
                <el-col :span="12">
                  <!--options.skipHeader-->
                  <el-checkbox v-model="getEditFeedInfo.options.skipHeader"></el-checkbox>
                  <span>跳过标题行</span>
                </el-col>
              </el-row>
              <el-row>
                <el-button @click="cancelTablelSave()">取消</el-button>
                <el-button type="success" @click="savetablelFeed()">保存</el-button>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="属性" name="feedAttribute">
        <!--属性-->
        <div v-if="isShowProperty">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>属性</span>
              <el-button
                style="float: right; padding: 5px 10px"
                type="primary"
                @click="editPropertyBtn()"
              >编辑</el-button>
            </div>
            <div class="text item">
              <el-row class="editRowStyle">
                <el-col :span="6">数据所有者：</el-col>
                <el-col :span="12">{{editFeedInfo.dataOwner}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">标签：</el-col>
                <el-col :span="12">
                  <span v-if="editFeedInfo.tags !== undefined">{{editFeedInfo.tags[0].name}}</span>
                </el-col>
              </el-row>
              <el-table
                :data="editFeedInfo.userProperties"
                key="propertyShowTable"
                style="width: 100%"
              >
                <el-table-column prop="systemName" label="属性" width="180"></el-table-column>
                <el-table-column prop="value" label="值"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>

        <!--属性编辑-->
        <div v-if="isEditProperty">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>属性</span>
            </div>
            <div class="text item">
              <el-row class="editRowStyle">
                <el-col :span="6">数据所有者：</el-col>
                <el-col :span="12">
                  <el-input v-model="getEditFeedInfo.dataOwner"></el-input>
                </el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">标签：</el-col>
                <el-col :span="12">
                  <el-input v-model="tag" placeholder="请输入内容"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-button @click="cancelPropertySave()">取消</el-button>
                <el-button type="success" @click="savePropertylFeed()">保存</el-button>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="计划" name="feedPlan">
        <!--计划-->
        <div v-if="isShowTimer">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>计划</span>
              <el-button
                style="float: right; padding: 5px 10px"
                type="primary"
                @click="editTimerBtn()"
              >编辑</el-button>
            </div>
            <div class="text item">
              <el-row class="editRowStyle">
                <el-col :span="6">策略：</el-col>
                <el-col :span="12">{{editFeedInfo.schedule.schedulingStrategy}}</el-col>
              </el-row>
              <el-row class="editRowStyle">
                <el-col :span="6">周期：</el-col>
                <el-col :span="12">{{editFeedInfo.schedule.schedulingPeriod}}</el-col>
              </el-row>
            </div>
            <!-- <div class="text item" v-if="editFeedInfo.schedule.schedulingStrategy !=='CRON_DRIVEN'">

            </div>-->
          </el-card>
        </div>

        <div v-if="isEditTimer">
          <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="策略">
                <el-select
                  v-model="getEditFeedInfo.schedule.schedulingStrategy"
                  placeholder="请选择"
                  @change="onScheduleStrategyChangeEdit(getEditFeedInfo.schedule.schedulingStrategy)"
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
              <el-form-item
                label="运行计划"
                v-if="getEditFeedInfo.schedule.schedulingStrategy ==='TIMER_DRIVEN'"
              >
                <el-input-number
                  v-model="timerAmount"
                  controls-position="right"
                  @change="handleTimerChangeEdit"
                  :min="1"
                  :max="10"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label="运行单位"
                v-if="getEditFeedInfo.schedule.schedulingStrategy ==='TIMER_DRIVEN'"
              >
                <el-select v-model="timerUnits" placeholder="请选择" @change="handleNumChangeEdit">
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
              <el-form-item
                label="cron表达式"
                v-if="getEditFeedInfo.schedule.schedulingStrategy !=='TIMER_DRIVEN'"
              >
                <el-input v-model="getEditFeedInfo.schedule.schedulingPeriod"></el-input>
              </el-form-item>
              <el-form-item
                label="cron预览"
                v-if="getEditFeedInfo.schedule.schedulingStrategy !=='TIMER_DRIVEN'"
              >
                <ul class="crolUl">
                  <li v-for="item in cronExpression">{{item}}</li>
                </ul>
              </el-form-item>
            </el-form>
            <el-row>
              <el-button @click="cancelTimerSave()">取消</el-button>
              <el-button type="success" @click="saveTimerFeed()">保存</el-button>
            </el-row>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="其他"
        name="other"
        v-if=" feedData.dsgProperties.standard || feedData.dsgProperties.model || feedData.dsgProperties.rule.targetDbName"
      >
        <other :dsgProperties="feedData.dsgProperties"></other>
      </el-tab-pane>
    </el-tabs>
    <!--显示-->
  </div>
</template>
<script>
import { disabledFeed, enableFeed, delFeed, saveFeed, getFeedDetail, getFeedController, getFeedDetailMergeTempalte, getCronExpression, getFeedValidation, getFeedStandardization, startOneceFeed } from '../../api/dataLake/api'
import { translateJsonData } from '../../utils/translate'
import other from './components/editFeedOther'

export default {
  components: {
    other
  },
  data () {
    return {
      dsgProperties: {},
      activeName: 'feedDefinition',
      //判断是否是数据转换
      isTransformBool: false,
      getEditFeedInfo: {},
      getEditFeedInfoStr: "",
      editFeedInfo: {
        table: {
          tableSchema: {

          }
        }
      },
      //流程基本定义
      isShowDetail: true,
      isEditDetail: false,
      loading: false,
      //流程详情
      isShowDetailDeltail: true,
      isEditDetailDetail: false,
      fileOrigin: "",
      tableFields: null,
      //第二步
      dataBaseValue: "",
      typeTableName: '',
      outPut: [{ name: 'DELIMITED', value: 'DELIMITED' }, { name: 'AVRO', value: 'AVRO' }],
      outPutStr: "",
      dataBaseArr: [],
      selectDatasource: "1",
      strategyRadio: 'FULL_LOAD',
      loadStrategyOptions: [{ name: 'FULL_LOAD', type: 'SNAPSHOT', strategy: 'FULL_LOAD', hint: 'Replace entire table' }, {
        name: 'INCREMENTAL', type: 'DELTA', strategy: 'INCREMENTAL', hint: 'Incremental load'
          + ' based on a '
          + ' high watermark', incremental: true, restrictDates: true
      }],
      dataBaseType: "", //第二步
      inTop: '',
      dataBaseArr: [],
      tableName: [],
      optionsTbaleName: [],

      //表架构
      isShowDetailTable: true,
      isEditDetailTable: false,
      checkAllIndex: false, //索引的全选
      checkAllProfile: true, //配置全选


      mergeStrategies: [
        { name: 'Sync', type: 'SYNC', hint: 'Replace table content', disabled: false },
        { name: 'Rolling sync', type: 'ROLLING_SYNC', hint: 'Replace content in matching partitions' },
        { name: 'Merge', type: 'MERGE', hint: 'Insert all rows', disabled: false },
        { name: 'Dedupe and merge', type: 'DEDUPE_AND_MERGE', hint: 'Insert rows ignoring duplicates', disabled: false },
        { name: 'Merge using primary key', type: 'PK_MERGE', hint: 'Upsert using primary key' }
      ],
      compressionMethods: { "STORED AS ORC": ['NONE', 'SNAPPY', 'ZLIB'], "STORED AS PARQUET": ['NONE', 'SNAPPY'], "AVRO": ['NONE'] },
      compressionOptions: ["NONE"],
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
      //属性
      isShowProperty: true,
      isEditProperty: false,
      tag: "",
      propertyList: [], //属性列表

      //计划
      isShowTimer: true,
      isEditTimer: false,
      allScheduleStrategies: [
        { label: "Timer", value: "TIMER_DRIVEN" }, { label: "Cron", value: "CRON_DRIVEN" }],
      DEFAULT_CRON: "0 0 12 1/1 * ? *",
      isTimerEdit: false,
      isCronEdit: true,
      scheduleStrategies: [],
      timerAmount: 5,
      schemaTime: [{ value: 'hrs', label: '小时' }, { value: 'days', label: '天' }, { value: 'min', label: '分钟' }, { value: 'sec', label: '秒' }],
      timerUnits: 'min',
      cronExpression: [],
      getIdObj: {},
      postControllerId: "",
      nonAndInptProperty: {},
      detailNon: {},
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
      isEditData: false,//是否在编辑规则
      dialogRule: false, // 规则模态框隐藏
      selectedOptionType: 'standardization',
      optionTypes: [{ type: 'standardization', name: 'Standardization' }, { type: 'validation', name: 'Validation' }],//规则验证
      standerForm: { type: '' },
      verifyForm: { type: '' },
      standerData: [],//标准化数据
      verifyData: [],//验证数据
      dialogVisible: false,
      verifyText: '',//验证的文字
      currIndex: '',//当前正在编辑的规则序号
      fieldIndex: '',//字段的索引
      fieldName: '',//当前选中的字段名


    }
  },
  filters: {
    translate (val) {
      if (translateJsonData[val] == "" || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
  },
  computed: {
    tabName () {
      if (this.editFeedInfo.dsgProperties.interface.targetDbName === this.editFeedInfo.dsgProperties.interface.targetTableName.split('.')[0]) return this.editFeedInfo.dsgProperties.interface.targetTableName
      else {
        return this.editFeedInfo.dsgProperties.interface.targetDbName + '.' + this.editFeedInfo.dsgProperties.interface.targetTableName
      }

    }
  },
  methods: {
    // 一次性启动流程
    startOneceFeed () {
      this.loading = true;
      const paramsFeedId = this.editFeedInfo.id;
      startOneceFeed(paramsFeedId).then(res => {
        console.log(res)
        this.loading = false;
        this.$message.success('成功')
      }).catch(() => {
        this.loading = false;
        this.$message.error('失败')
      })
    },
    isTransForm () {
      let fdStart = this.editFeedInfo.templateName.indexOf("Data Transformation");
      let fdStartlower = this.editFeedInfo.templateName.indexOf("data-transform");
      if (fdStart == 0 || fdStartlower == 0) {
        this.isTransformBool = true;
      } else if (fdStart == -1 || fdStartlower == -1) {
        this.isTransformBool = false;
      }
    },
    getFeedDetailData () {
      //this.editFeedInfo = this.$route.query.feedDetail; // 获取流程详情
      this.getIdObj = this.$route.query.feedDetail; // 获取流程详情
      /* console.log(this.getIdObj);
       console.log("跳过来了跳过来了跳过来了跳过来了跳过来了跳过来了")*/
      let getFeedId = "";
      let detailJsonObj = {};
      if (this.getIdObj.id === undefined) {
        let detailJson = window.localStorage.getItem("data");
        detailJsonObj = JSON.parse(detailJson);
        getFeedId = detailJsonObj.id
      } else {
        getFeedId = this.getIdObj.id;
      }


      let self = this;
      //    let json = {id:self.getIdObj.id,content:self.getIdObj}; //getFeedDetailMergeTempalte

      getFeedDetail(getFeedId).then(data => {
        this.feedData = data
        self.editFeedInfo = data;
        console.log(self.editFeedInfo)
        //调用判断是否是数据转换
        self.isTransForm();
        if (self.editFeedInfo.inputProcessorName === "Database") {
          let propertiesLen = self.editFeedInfo.properties.length;
          for (let i = 0; i < propertiesLen; i++) {
            if (self.editFeedInfo.properties[i].key === "Source Database Connection") {
              self.postControllerId = self.editFeedInfo.properties[i].value;
            }
          };
          getFeedController(self.postControllerId).then(data => {
            self.nonAndInptProperty = data;
            let detailLength = self.nonAndInptProperty.referencingComponents.length;
            for (let j = 0; j < detailLength; j++) {
              if (self.nonAndInptProperty.referencingComponents[j].component.groupId === self.editFeedInfo.nifiProcessGroupId) {
                console.log(self.nonAndInptProperty.referencingComponents[j].component.properties)
                self.detailNon = self.nonAndInptProperty.referencingComponents[j].component.properties;
              }
            };
            console.log(JSON.stringify(data))
            console.log(self.detailNon)
            if (self.detailNon['Output Type'] === "DELIMITED") {
              self.outPutStr = "DELIMITED"
            } else {
              self.outPutStr = "AVRO"
            }
            if (self.detailNon['Load Strategy'] === "FULL_LOAD") {
              self.strategyRadio = "FULL_LOAD"
            } else {
              self.strategyRadio = "INCREMENTAL"
            }
          }).catch(err => {
          })
        }
        else {
          self.editFeedInfo.registeredTemplate.inputProcessors.forEach((item, index) => {
            self.fileOrigin = self.editFeedInfo.registeredTemplate.inputProcessors[index].name;
          })
          // self.fileOrigin =
        }
        self.editFeedInfo.table.tableSchema.fields.forEach((one, index) => {
          self.editFeedInfo.table.fieldPolicies[index].primaryKey = self.editFeedInfo.table.tableSchema.fields[index].primaryKey
        })
      }).catch(err => {
        alert(err);
      })

      /* getFeedDetailMergeTempalte().then(data=>{

       }).catch(err=>{

       })*/
    },

    //禁用流程 POST /v1/feedmgr/feeds/disable/{feedId}
    disabledFeedPost () {
      let feedId = this.editFeedInfo.feedId;
      disabledFeed(feedId).then(data => {
        console.log(data)
        this.editFeedInfo.state = data.state;
        this.$message.success('禁用流程成功');
      }).catch(err => {
        this.$message.error('禁用流程失败');
      })
    },
    //启用流程 POST /v1/feedmgr/feeds/enable/{feedId}
    enableFeedPost () {
      let feedId = this.editFeedInfo.feedId;
      enableFeed(feedId).then(data => {
        this.editFeedInfo.state = data.state;
        this.$message.success('启用流程成功');

      }).catch(err => {
        this.$message.error('启用流程失败');

      })
    },
    //删除流程
    delDetailFeed () {
      this.loading = true;
      this.$confirm(`此操作将永久删除${this.editFeedInfo.feedName}流程, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let paramsFeedId = this.editFeedInfo.id;
        delFeed(paramsFeedId).then(data => {
          this.loading = false;
          if (data.status == "error") {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          //跳回列表
          this.$router.push({ path: 'feedsList' })
        }).catch(err => {
          console.log(err)
          this.loading = false;
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        })
      }).catch(() => {
        this.loadingFeed = false;
        this.loading = false;
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //点击保存
    saveCommonFeed () {
      this.loading = true;
      //调保存流程的接口
      this.getEditFeedInfo.table.fieldPolicies.forEach((one, index) => {
        this.getEditFeedInfo.table.tableSchema.fields[index].primaryKey = this.getEditFeedInfo.table.fieldPolicies[index].primaryKey;
      });
      let params = this.getEditFeedInfo;
      saveFeed(params).then(data => {
        console.log(data);
        this.editFeedInfo = data.feedMetadata;
        this.editFeedInfo.table.tableSchema.fields.forEach((one, index) => {
          this.editFeedInfo.table.fieldPolicies[index].primaryKey = this.editFeedInfo.table.tableSchema.fields[index].primaryKey;
        });
        this.$message.success('保存流程成功');
        this.loading = false;
        this.isShowDetail = true;
        this.isEditDetail = false;
        this.isShowDetailDeltail = true;
        this.isEditDetailDetail = false;
        this.isShowDetailTable = true;
        this.isEditDetailTable = false;
        this.isShowProperty = true;
        this.isEditProperty = false;
        this.isShowTimer = true;
        this.isEditTimer = false;
      }).catch(err => {
        this.$message.error('保存流程失败');
        this.loading = false;
      });
      //把修改后的值赋给显示用的值

    },
    //点击编辑
    editBtn () {
      this.isShowDetail = false;
      this.isEditDetail = true;
      /*  this.getEditFeedInfoStr = JSON.stringify(this.editFeedInfo);
        console.log(this.getEditFeedInfoStr)
        this.getEditFeedInfo = JSON.parse(this.getEditFeedInfoStr);*/
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },

    //取消流程定义保存
    cancelDefinedSave () {
      this.isShowDetail = true;
      this.isEditDetail = false;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },
    //保存流程定义
    saveDefinedFeed () {
      this.saveCommonFeed();
    },

    //流程详情
    //编辑
    editDetailBtn () {
      this.isShowDetailDeltail = false;
      this.isEditDetailDetail = true;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },
    //取消
    cancelDetailSave () {
      this.isShowDetailDeltail = true;
      this.isEditDetailDetail = false;

      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },

    //数据转换跳转
    goToTransformationOne () {
      let feedInfo = this.editFeedInfo;
      this.$router.push({ path: '/definedFeed', query: { feedInfo: feedInfo } });
    },
    changeStratege (val) {

      /*if(val === "FULL_LOAD"){
          this.feedInfo.nonInputProcessors.forEach((item,index)=>{
              let _this = this;
              _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild,i)=>{
                  let that = this;
                  if(that.feedInfo.nonInputProcessors[index].properties[i].key == "Load Strategy"){
                      that.feedInfo.nonInputProcessors[index].properties[i].value = val;
                  }
              })

          })
      }else if(val === "INCREMENTAL"){
          this.feedInfo.nonInputProcessors.forEach((item,index)=>{
              let _this = this;
              _this.feedInfo.nonInputProcessors[index].properties.forEach((itemChild,i)=>{
                  let that = this;
                  if(that.feedInfo.nonInputProcessors[index].properties[i].key == "Load Strategy"){
                      that.feedInfo.nonInputProcessors[index].properties[i].value = val;
                  }
              })

          })
      }*/
    },
    //outPutStr
    outPutChange (val) {
      console.log(val);
      this.getEditFeedInfo.properties.forEach(proItem => {
        if (proItem.key === "Output Type") {
          proItem.value = val;
        }
      })
    },

    //保存
    saveDetailFeed () {
      this.saveCommonFeed();
    },

    //表架构
    //编辑
    editTablelBtn () {
      this.isShowDetailTable = false;
      this.isEditDetailTable = true;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
      console.log(this.getEditFeedInfo)
      //遍历table中的所有index，如果index全为true，checkAllIndex为true
      let feedInfoTableIndex = this.getEditFeedInfo.table.fieldPolicies.length;
      let ifTrue = 0;
      let ifProfie = feedInfoTableIndex;
      for (let i = 0; i < feedInfoTableIndex; i++) {
        if (this.getEditFeedInfo.table.fieldPolicies[i].index === true) {
          ifTrue++;
          if (ifTrue === feedInfoTableIndex) {
            this.checkAllIndex = true;
          }
        }
        if (this.getEditFeedInfo.table.fieldPolicies[i].profile === false) {
          ifProfie--;
          if (ifTrue < feedInfoTableIndex) {
            this.checkAllProfile = false;
          }
        }
      }

    },
    //全选index 索引
    handleCheckAllChangeIndex (val) {
      this.getEditFeedInfo.table.fieldPolicies.map((item) => {
        this.$set(item, 'index', val)
      })
    },
    //全选配置
    handleCheckAllChangeProfile (val) {
      this.getEditFeedInfo.table.fieldPolicies.map((item) => {
        this.$set(item, 'profile', val)
      })
    },
    //index单选
    handleCheckItemChange (val) {
      for (let i = 0, l = this.getEditFeedInfo.table.fieldPolicies.length; i < l; i++) {
        if (this.getEditFeedInfo.table.fieldPolicies[i].index !== val) {
          this.checkAllIndex = false;
          return;
        }
      }
      this.checkAllIndex = val;
      console.log(this.getEditFeedInfo)
    },
    //配置单选
    handleCheckItemChangeProfile (val) {
      for (let i = 0, l = this.getEditFeedInfo.table.fieldPolicies.length; i < l; i++) {
        if (this.getEditFeedInfo.table.fieldPolicies[i].profile !== val) {
          this.checkAllProfile = false;
          return;
        }
      }
      this.checkAllProfile = val;
      console.log(this.getEditFeedInfo)
    },
    cancelTablelSave () {
      this.isShowDetailTable = true;
      this.isEditDetailTable = false;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },
    savetablelFeed () {
      console.log(this.getEditFeedInfo.table);
      this.saveCommonFeed();
    },
    mergeStrategyDisplayName () {
      let _this = this;
      let mergeStrategyObject = _.find(_this.mergeStrategies, function (strategy) {
        return strategy.type == _this.editFeedInfo.table.targetMergeStrategy;
      });
      return mergeStrategyObject != null ? mergeStrategyObject.name : _this.editFeedInfo.table.targetMergeStrategy
    },

    //属性
    //编辑
    editPropertyBtn () {
      this.isShowProperty = false;
      this.isEditProperty = true;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },
    cancelPropertySave () {
      this.isShowProperty = true;
      this.isEditProperty = false;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },
    savePropertylFeed () {
      this.getEditFeedInfo.tags = [];
      this.getEditFeedInfo.tags.push(this.tag);
      this.saveCommonFeed();
    },
    //添加属性
    addProperty () {
      this.propertyList.push({ description: null, displayName: null, locked: false, order: this.propertyList.length, required: true, systemName: "", value: "", $error: {} });
    },
    removePropertyFeed (index) {
      this.propertyList.splice(index, 1);
    },

    //计划
    //编辑
    editTimerBtn () {
      this.isShowTimer = false;
      this.isEditTimer = true;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
      //从后台获取时间计划cron表达式 getCronExpression
      let toCronExpression = this.getEditFeedInfo.schedule.schedulingPeriod;
      /* getCronExpression(toCronExpression).then(data=>{
           this.cronExpression = data;
           console.log(this.cronExpression)

       }).catch(err=>{
           console.log(err.data)
       })*/

    },
    onScheduleStrategyChangeEdit (val) {
      console.log(val)
      if (val === "CRON_DRIVEN") {
        this.getEditFeedInfo.schedule.schedulingPeriod = "0 0 12 1/1 * ? *"
      }
    },
    handleTimerChangeEdit (val) {
      if (this.timerAmount != null && (this.timerAmount == 0 || (this.timerAmount < 3 && this.timerUnits == 'sec'))) {
        this.$message.error('警告! 你有这个流程计划一个非常快的计时器。 请确保您希望在继续之前快速安排此流程');
      }
      this.getEditFeedInfo.schedule.schedulingPeriod = this.timerAmount + " " + this.timerUnits;
      console.log(this.getEditFeedInfo.schedule)

    },
    handleNumChangeEdit (val) {
      if (this.timerAmount != null && (this.timerAmount == 0 || (this.timerAmount < 3 && this.timerUnits == 'sec'))) {
        this.$message.error('警告! 你有这个流程计划一个非常快的计时器。 请确保您希望在继续之前快速安排此流程');
      }
      this.getEditFeedInfo.schedule.schedulingPeriod = this.timerAmount + " " + this.timerUnits;
      console.log(this.getEditFeedInfo.schedule)
    },
    cancelTimerSave () {
      this.isShowTimer = true;
      this.isEditTimer = false;
      this.getEditFeedInfo = JSON.parse(JSON.stringify(this.editFeedInfo));
    },
    saveTimerFeed () {
      this.saveCommonFeed();
    },

    //          验证
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
        if (_this.getEditFeedInfo != null) {
          currentFeedValue = _this.currentFeedValue(this.getEditFeedInfo);
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
        if (_this.getEditFeedInfo != null) {
          currentFeedValue = _this.currentFeedValue(this.getEditFeedInfo);
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

    addPolicy ($event) {
      if (this.policyRules == null) {
        this.policyRules = [];
      }
      // buildDisplayString();
      console.log(this.ruleType)
      //  this.editRule["ruleType"] = this.ruleType;
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
      console.log(_this.getEditFeedInfo.table)
    },
    onPropertyChanged (val) {
      console.log(val)
    },
    back() {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.getFeedDetailData();

  }
}
</script>

<style scoped>
.feedDetailStyle {
  color: #f08c38;
  padding: 6px 15px;
  border: 1px solid #d1d2d5;
  border-radius: 5px;
  display: inline-block;
  margin-left: 9px;
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

.box-card {
  width: 90%;
}
.editRowStyle {
  padding: 10px 0;
}
</style>

