<template>
  <div v-loading="startIng">
    <el-row>
      <el-col :span="6" class="left-tree">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>任务目录</span>
            <div style="float: right">
              <el-button
                title="创建任务"
                @click="creatTask('')"
                style="padding:0;margin-right:10px;border:none"
              >
                <i class="fa fa-plus"></i>
              </el-button>
            </div>
          </div>
          <div>
            <div>
              <el-input
                placeholder="搜索任务,分类"
                v-model="treeObj.serachWord"
                style="margin-top: 10px;margin-bottom: 10px"
              ></el-input>
              <el-tree
                class="filter-tree"
                v-loading="treeObj.loading"
                node-key="id"
                :data="treeObj.data"
                :props="treeObj.defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="mainTree"
                @node-click="nodeClick"
                highlight-current
                :render-content="renderContent"
              ></el-tree>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" class="right-tabel-box">
        <!-- 显示流程及任务详情和任务关联card -->
        <el-card class="box-card" v-show="!dialogObj.isShow && !Top10Card">
          <!-- tabs -->
          <el-tabs v-model="tabsChoose">
            <el-tab-pane label="流程列表" name="first">
              <el-tabs v-model="tabsChoose2" tab-position="right">
                <el-tab-pane label="无版本" name="tab2_first">
                  <div class="query-box">
                    <div class="btn-box">
                      <el-tooltip class="item" effect="dark" content="新建流程" placement="bottom">
                        <el-button
                          type="success"
                          icon="el-icon-plus"
                          size="mini"
                          @click.native="newFeed()"
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="快速预览" placement="bottom">
                        <el-button type="primary" size="mini" @click.native="govirt()">快速预览</el-button>
                      </el-tooltip>
                      <el-button type="primary" size="mini" @click.native="Top10Card = true">最近修改</el-button>
                    </div>
                  </div>
                  <div style="float:right">
                    <el-input
                      placeholder="请输入内容"
                      prefix-icon="el-icon-search"
                      @keyup.native="filterText($event)"
                      v-model="filter"
                    ></el-input>
                  </div>
                  <el-table :data="showFeedsList" v-loading="loadingFeed" style="width: 100%">
                    <el-table-column prop="feedName" label="流程名"></el-table-column>
                    <el-table-column label="状态" prop="state" sortable>
                      <template slot-scope="scope">
                        <span>{{scope.row.state | translate}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="所属分类" prop="categoryName"></el-table-column>
                    <el-table-column label="类型" prop="templateName"></el-table-column>
                    <el-table-column label="更新时间">
                      <template slot-scope="scope">
                        <span>{{(new Date(scope.row.updateDate)).toLocaleString()}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="100">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="导出流程" placement="bottom">
                          <a
                            :href="'/datalake-feed_/v1/feedmgr/admin/export-feed/'+showFeedsList[scope.$index].id"
                            class="aStyle"
                          >
                            <i class="el-icon-upload2"></i>
                          </a>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑流程" placement="bottom">
                          <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            plain
                            @click="editFeed(scope.$index, scope.row)"
                          ></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除流程" placement="bottom">
                          <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            plain
                            @click="deleteFeed(scope.$index, scope.row)"
                            :disabled="scope.row.state==='ENABLED'"
                          ></el-button>
                        </el-tooltip>
                        <!-- 查看质量目录 -->
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="查看流程质量列表"
                          placement="bottom"
                        >
                          <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-zoom-in"
                            plain
                            @click="lookQuality(scope.row)"
                          ></el-button>
                        </el-tooltip>
                        <!--:disabled="scope.row.feedsCount==0 ? isCanDel=false : isCanDel=true"-->
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="1"
                    :page-sizes="[10,20,50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  ></el-pagination>
                </el-tab-pane>
                <el-tab-pane label="有版本" name="tab2_second">
                  <el-collapse @change="changeVersion" accordion v-show="versionList.length > 0">
                    <el-collapse-item
                      v-for=" (item,index) in versionList "
                      :title="item.name"
                      :name="item.id"
                      :key="item.id"
                    >
                      <el-table
                        :data="versionFeedTab"
                        :show-header="false"
                        v-loading="versionFeedTabLoading"
                      >
                        <el-table-column prop="key"></el-table-column>
                        <el-table-column prop="value"></el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                  <div v-show="versionList.length === 0" class="noDataShow">暂无数据</div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>

            <el-tab-pane label="任务详情" name="second">
              <task-detail :id="chooseNodeId"></task-detail>
            </el-tab-pane>
            <!-- <el-tab-pane label="任务关联" name="third">
              <task-relation :id="chooseNodeId"></task-relation>
            </el-tab-pane>-->
          </el-tabs>
        </el-card>
        <!-- 编辑任务card -->
        <el-card class="box-card" v-show="dialogObj.isShow && !Top10Card">
          <div slot="header" class="clearfix">
            <span>{{dialogObj.title}}</span>
          </div>
          <div>
            <el-form
              :model="taskObj"
              ref="task_form"
              :rules="taskRules"
              label-width="100px"
              v-loading="dialogObj.loading"
            >
              <el-form-item label="任务名称" prop="name">
                <div>
                  <el-input
                    v-model="taskObj.name"
                    :disabled="dialogObj.isDisabled"
                    @blur="getSystemName(taskObj.name)"
                    placeholder="请输入任务名称"
                    style="width: 90%"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="任务描述" prop="description">
                <el-input
                  v-model="taskObj.description"
                  :disabled="dialogObj.isDisabled"
                  placeholder="请输入任务描述"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
              <el-form-item label="源数据连接" prop="dsList">
                <el-select v-model="taskObj.dsList" multiple style="width: 90%" value-key="id">
                  <el-option
                    v-for="(item,index) in dialogObj.dataSourceOptions"
                    value-key="id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-button type="primary" @click="selectTaskType('rule')">选择规则</el-button> -->
              <!-- <el-form-item label="规则" prop="ruleList">
                <div class="select-list-box">
                </div>
                <el-select
                  v-model="taskObj.ruleList"
                  multiple
                  value-key="id"
                  style="width: 90%; margin-right:10px;"
                >
                  <el-option
                    v-for="(item,index) in ruleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item label="标准" prop="standardList">
                <div class="select-list-box">
                  <el-select
                    v-model="taskObj.standardList"
                    multiple
                    value-key="id"
                    style="width: 90%; margin-right:10px;"
                  >
                    <el-option
                      v-for="(item,index) in taskObj.standardList"
                      :key="item.id"
                      :label="item.standardTableName"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="selectTaskType('standard')">选择标准</el-button>
                </div>
              </el-form-item>
              <el-form-item label="模型" prop="modelList">
                <div class="select-list-box">
                  <el-select
                    v-model="taskObj.modelList"
                    multiple
                    value-key="id"
                    style="width: 90%; margin-right:10px;"
                  >
                    <el-option
                      v-for="(item,index) in taskObj.modelList"
                      :key="item.id"
                      :label="item.modelTableName"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="selectTaskType('model')">选择模型</el-button>
                </div>
              </el-form-item>
              <el-form-item label="所属业务" prop="businessList">
                <div class="select-list-box">
                  <el-select
                    v-model="taskObj.businessList"
                    value-key="id"
                    multiple
                    style="width: 90%; margin-right:10px;"
                  >
                    <el-option
                      v-for="(item,index) in taskObj.businessList"
                      :key="item.id"
                      :label="item.governanceTaskName"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="selectTaskType('business')">选择业务</el-button>
                </div>
              </el-form-item>
              <el-form-item label="所属主题" prop="subjectList">
                <div class="select-list-box">
                  <el-select
                    v-model="taskObj.subjectList"
                    multiple
                    value-key="id"
                    style="width: 90%; margin-right:10px;"
                  >
                    <el-option
                      v-for="(item,index) in taskObj.subjectList"
                      :key="item.id"
                      :label="item.label"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <div class="selectTree">
                    <el-button v-show="!treeState" @click="treeState=true" type="primary">选择主题</el-button>
                    <el-button v-show="treeState" @click="treeState=false" type="primary">关闭选择</el-button>
                  </div>
                </div>
                <search-tree :data="treeData" v-show="treeState" @selectNode="selectNode"></search-tree>
              </el-form-item>
              <!-- <el-form-item label="所属主题" prop="subjectList">
                <div class="select-list-box">
                  <el-select
                    v-model="taskObj.subjectList"
                    multiple
                    value-key="id"
                    style="width: 90%; margin-right:10px;"
                  >
                    <el-option
                      v-for="(item,index) in taskObj.subjectList"
                      :key="item.id"
                      :label="item.feedName"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="selectTaskType('subject')">选择主题</el-button>
                </div>
              </el-form-item>-->
              <el-form-item>
                <el-button @click="dialogObj.isShow = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="submitForm('task_form')"
                  :disabled="dialogObj.isDisabled"
                >确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <!-- 最近十条任务和流程card -->
        <el-card class="box-card" v-show="Top10Card">
          <el-tabs v-model="tabsChoose3">
            <el-tab-pane label="最近任务" name="tab3_first">
              <new-top :id="chooseNodeId" @TopClick="TopClick"></new-top>
            </el-tab-pane>
            <el-tab-pane label="最近流程" name="tab3_second">
              <new-topf :id="chooseNodeId" @TopClick="TopClick"></new-topf>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新建任务弹窗 -->
    <el-dialog :title="typeDialogObj.title" :fullscreen="true" :visible.sync="typeDialogObj.isShow">
      <my-standard v-if="typeDialogObj.type === 'standard'" ref="standard"></my-standard>
      <my-model v-if="typeDialogObj.type === 'model'" ref="model"></my-model>
      <my-rule v-if="typeDialogObj.type === 'rule'" ref="rule"></my-rule>
      <my-business v-if="typeDialogObj.type === 'business'" ref="business"></my-business>
      <my-subject v-if="typeDialogObj.type === 'subject'" ref="subject"></my-subject>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeDialogObj.isShow = false">取 消</el-button>
        <el-button type="primary" @click="getRefArr" :disabled="dialogObj.isDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDataSourceById, getFeedsList, delFeed, getFeedDetail, editCategory, getDataSource, getTaskTree, addOrEditTask, removeTask, getFeedsListById, postProdVersionChild, getStandarFeed } from '../../api/dataLake/api'
import { translateJsonData } from '../../utils/translate'
import { tree } from '@/api/dataSource/subject'
import { getKnowledge, getRuleName } from '@/api/ruleSet/index.js'
import searchTree from '@/views/dataLake/dataSource/components/SearchTree'
import { toTreeData } from '@/utils/workflow/tree.js'
import myStandard from '../baseDataManager/standard/standard.vue'
import myRule from '@/components/RuleSet/index'
import myModel from '../baseDataManager/standard/model.vue'
import myBusiness from '../baseDataManager/object/dataRun.vue'
import mySubject from '../baseDataManager/object/subject.vue'
import taskDetail from './feedsListComponents/taskDetail'
import taskRelation from './feedsListComponents/taskRelation'
import newTop from './feedsListComponents/newTop10'
import newTopf from './feedsListComponents/newTop10F'
export default {
  components: {
    myStandard,
    myModel,
    myBusiness,
    mySubject,
    myRule,
    taskDetail,
    taskRelation,
    searchTree,
    newTop,
    newTopf
  },
  data() {
    return {
      Top10Card: true,
      tabsChoose: 'first',
      tabsChoose2: 'tab2_first',
      tabsChoose3: 'tab3_first',
      chooseNodeId: '',
      versionList: [],
      versionFeedTab: [],
      versionFeedTabLoading: false,
      treeState: false,
      treeData: [],

      currNode: [],
      showFeedsList: [],
      FeedsList: [],
      currentPage: 1,
      total: 1,
      pageSize: 10,
      filter: "",
      isCanDel: false,  // 是否可以删除流程
      loadingFeed: false,
      editFeedInfo: {},
      startIng: false,
      treeObj: { // 存放树的对象
        loading: false,
        serachWord: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },
      dialogObj: {
        title: '新建任务',
        isDisabled: false,
        isShow: false,
        loading: false,
        dataSourceOptions: []
      },
      typeDialogObj: {
        title: '选择标准',
        isShow: false,
        type: 'standard'
      },
      taskObj: {
        id: '',
        name: '',
        description: '',
        referId: '',
        dsList: [], // 拥有的数据源列表
        standardList: [], // 拥有的标准列表
        modelList: [], // 拥有的模型列表
        ruleList: [], // 拥有的规则列表
        businessList: [], // 所属业务
        subjectList: [] // 所属主题
      },
      taskRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        description: [{ required: false, message: '请输入分类描述', trigger: 'blur' }],
        dsList: [{ required: false, message: '请选择数据源', trigger: 'change' }],
        standardList: [{ required: false, message: '请选择标准', trigger: 'change' }],
        modelList: [{ required: false, message: '请选择模型', trigger: 'change' }],
        ruleList: [{ required: false, message: '请选择规则', trigger: 'change' }],
        businessList: [{ required: false, message: '请选择所属业务', trigger: 'change' }],
        subjectList: [{ required: false, message: '请选择所属主题', trigger: 'change' }]
      },
      ruleName: '',
      ruleList: []
    }
  },
  watch: {
    'treeObj.serachWord': {
      handler(newVal, oldVal) {
        this.$refs.mainTree.filter(newVal)
      },
      deep: true
    }
  },
  created() {
    this.getRuleName()
  },
  mounted() {
    this.getAllDataSource()
    this.getTaskTreeApi()
    this.getSubjectTree();
    this.getRuleList();
  },
  methods: {
    //点击最近十条任务 选中 树状节点
    TopClick(row) {
      typeof (row.categoryId) != 'undefined' ? row.id = row.categoryId : row = row
      this.$refs.mainTree.setCurrentKey(row.id)
      this.nodeClick(row)
    },
    // 获取知识包数据
    getRuleList() {
      getKnowledge(this.ruleName).then(data => {
        this.ruleList = data ? data : [];
      })
    },
    // 获取ruleName
    getRuleName() {
      getRuleName().then(data => {
        this.ruleName = data ? data : ''
      })
    },
    selectNode(data) {
      this.taskObj.subjectList = data
    },
    getSubjectTree() {
      tree().then(data => {
        this.treeData = data
      })
    },

    changeVersion(versionId) {
      if (versionId) this.getVersionFeed(versionId)
    },

    //json数组与string互转
    transData(data) {
      if (typeof (data) === 'string') {
        if (data.indexOf('|||') > -1) {
          let arr = []
          data.split('|||').map(one => {
            arr.push(JSON.parse(one))
          })
          return arr
        }
        else if (data === '') {
          return []
        }
        else {
          return [JSON.parse(data)]
        }
      }
      else {
        let arr = []
        data.map(one => {
          arr.push(JSON.stringify(one))
        })
        return arr.join('|||')
      }
    },
    /**
     *  @获取版本列表
     */
    getVersionList(id) {
      postProdVersionChild(id).then(data => {
        this.versionList = data
      })
    },
    getVersionFeed(versionId) {
      this.versionFeedTabLoading = true
      postProdVersionChild(versionId).then(data => {
        getStandarFeed(`${data[0].name}.${data[0].name}`).then(data => {
          //将json处理成key value 数组 {feedName:'流程名', state:'状态', categoryName:'所属分类' , templateName:'模板名称' , updateDate:'更新时间' , ctreatDate:'创建时间'}
          this.versionFeedTabLoading = false
          const resData = [
            { key: '流程名', value: data.feedName },
            { key: '所属分类', value: data.categoryName },
            { key: '模板名称', value: data.templateName },
            { key: '创建时间', value: (new Date(data.ctreatDate)).toLocaleString() },
            { key: '更新时间', value: (new Date(data.updateDate)).toLocaleString() },
            { key: '状态', value: this.translate(data.state) },
          ]
          data ? this.versionFeedTab = resData : this.versionFeedTab = []
        })
      })
    },
    /**
     *  @获取组件传过来的Arr
     */
    getRefArr() {
      console.log([... this.$refs[this.typeDialogObj.type].multipleSelection])
      this.taskObj[`${this.typeDialogObj.type}List`] = [... this.$refs[this.typeDialogObj.type].multipleSelection]
      this.typeDialogObj.isShow = false
    },
    /**
     * 跳至数据流程
     */

    /**
     * @description 创建任务
     */
    creatTask(val) {
      this.dialogObj.isShow = true
      this.Top10Card = false
      val !== '' ? this.dialogObj.title = '新建子任务' : this.dialogObj.title = '新建根任务'
      const tempObj = {
        parentId: val,
        name: '',
        description: '',
        id: '',
        referId: '',
        dsList: [], // 拥有的数据源列表
        standardList: [], // 拥有的标准列表
        modelList: [], // 拥有的模型列表
        ruleList: [], // 拥有的规则列表
        businessList: [], // 所属业务
        subjectList: [] // 所属主题
      }
      this.taskObj = { ...tempObj }
    },
    /**
     * @description 删除任务 DELETE /api/dsg-subject/task/{id}
     * @param id { string } 当前任务id
     */
    deleteTask(id) {
      this.$confirm('是否删除该任务?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
          removeTask(id).then(data => {
            this.getTaskTreeApi()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })

        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
    },
    /**
     * @description 编辑任务 PUT /api/dsg-subject/task/{id}
     * @param id { string } 当前任务id
     */
    editTask(node, data) {
      this.dialogObj.isShow = true
      this.dialogObj.title = '编辑任务'
      console.log(data)
      this.taskObj = data
    },
    /**
     * @description 弹窗表单验证
     * @param name { string } 表单名
     */
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.startIng = true
          addOrEditTask(this.taskObj).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.getTaskTreeApi()
              this.startIng = false
            }
            else {
              this.$message({
                type: 'error',
                message: res.msg
              })
              this.startIng = false
            }
          })
          // console.log(tempDs_list)
          // editCategory(this.taskObj).then(res => {
          //   this.dialogObj.isShow = false
          //   this.dialogObj.loading = false
          //   this.getCategoriesList()
          // })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * @description 获取系统名称
     * @param name { string } 任务名称
     */
    getSystemName() {
      var nowTime = new Date()
      const yy = nowTime.getFullYear()
      const mm = `${nowTime.getMonth() + 1}`.padStart(2, '0')
      const dd = `${nowTime.getDate()}`.padStart(2, '0')
      const hh = `${nowTime.getHours()}`.padStart(2, '0')
      const min = `${nowTime.getMinutes()}`.padStart(2, '0')
      const ss = `${nowTime.getSeconds()}`.padStart(2, '0')
      const str = `task_${yy}${mm}${dd}_${hh}${min}${ss}`
      this.taskObj.referId = str
    },
    /**
     * @description 创建任务选择类型
     * @param type { string } standard-标准
     */
    selectTaskType(type) {
      const titleObj = {
        standard: '选择标准',
        model: '选择模型',
        rule: '选择规则',
        business: '选择业务',
        subject: '选择主题'
      }
      const tempObj = { isShow: true, title: titleObj[type], type }
      this.typeDialogObj = { ...this.typeDialogObj, ...tempObj }
    },
    /**
     * @description 获取数据源链接
     */
    getAllDataSource() {
      getDataSource().then(res => {
        this.dialogObj.dataSourceOptions = res
      })
    },
    /**
     * @description 获取任务树api
     */
    getTaskTreeApi() {
      getTaskTree().then(res => {
        if (res.code === 0) {
          this.treeObj.data = res.data
          this.treeObj.loading = false
        }
      })
    },
    /**
     * @description 树节点点击
     */
    nodeClick(data, node, tree) {
      //
      this.chooseNodeId = data.id
      this.currNode = data;
      this.getFeedsListById(data.id)
      this.getVersionList(data.id)
      this.Top10Card = false
    },
    getFeedsList() {
      this.getFeedsListById(this.chooseNodeId)
    },
    getFeedsListById(id) {
      this.startIng = true
      getFeedsListById(id).then(data => {
        this.startIng = false
        this.FeedsList = data
        this.showFeedsList = data
        this.total = data.length;
      }).catch(err => {
        console.log(err)
      })
    },
    importFeed(index, row) {
      console.log(index, row);
    },
    editFeed(index, row) {
      console.log(index, row);
      let getFeedId = row.id;
      getFeedDetail(getFeedId).then(data => {
        this.editFeedInfo = data;
        console.log(this.editFeedInfo)
        this.$router.push({ path: 'editFeed', query: { feedDetail: this.editFeedInfo } })
        window.localStorage.setItem("data", JSON.stringify(this.editFeedInfo));
      }).catch(err => {

      })
    },
    deleteFeed(index, row) {
      this.loadingFeed = true;
      console.log(index, row);
      this.$confirm(`此操作将永久删除${row.feedName}流程, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let paramsFeedId = row.id;
        delFeed(paramsFeedId).then(data => {
          this.loadingFeed = false;
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
          this.getFeedsList();
        }).catch(err => {
          console.log(err)
          this.loadingFeed = false;
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        })
      }).catch(() => {
        this.loadingFeed = false;
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    filterText(ev) {
      this.getFeedsList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getFeedsList()
      // this.changeList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getFeedsList();
      // this.changeList();
    },
    meData(data) {
      const arr = [{ name: 'Hive', id: 'Hive' }]
      data.dsList.map(one => {
        const filterArr = ["Oracle", "DB2", "SqlServer", "PostgreSQL", "MySQL", "HIVE"];
        filterArr.map(filterOne => {
          if (one.type === filterOne) {
            getDataSourceById(one.id).then(data => {
              arr.push(data)
              console.log('----------get')
            })
          }
        })

      })
      return arr
    },
    govirt() {
      this.currNode.dsList = this.meData(this.currNode)
      this.$router.push({ name: '可视化查询', params: { taskParams: this.currNode } })
    },
    //点击新建跳转 到 新建页面this.$router.push({path: '/order/page1',query:{ id:'2'}});
    newFeed() {
      // this.$router.push({ path: 'feedDetails', })
      console.log(this.meData(this.currNode))
      console.log(this.currNode)
      this.currNode.dsList = this.meData(this.currNode)
      this.$router.push({ name: '流程详情', params: { taskInfo: this.currNode } })
    },
    /*跳转至治理流程*/
    gotoVersion(data) {
      data.dsList = this.meData(data)
      console.log(data)
      this.$router.push({ name: '治理流程', query: { id: data.referId }, params: { taskParams: data } });  /*query:{ id:'2'}}*/
    },
    lookQuality(row) {
      const { feedId } = row
      const path = this.$route.path
      this.$router.push({ path: '/dataQuality', query: { feedId, path } })
    },
    /**
     * @description 树形图自定义
     */
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;" >
            <span>{node.label}</span>
          </span>
          <span style="width: 86px;">
            <el-button style='font-size:12px' title='修改任务' type='text' on-click={() => this.editTask(node, data)}><i class="el-icon-edit"></i></el-button>
            <el-button style='font-size:12px' title='创建子任务' type='text' on-click={() => this.creatTask(data.id)}><i class="el-icon-circle-plus-outline"></i></el-button>
            <el-button style='font-size:12px' title='删除任务' type='text' on-click={() => this.deleteTask(data.id)}><i class="el-icon-delete"></i></el-button>
            <el-button style='font-size:12px' title='关联' type='text' on-click={() => this.gotoVersion(data)}><i class="el-icon-sort"></i></el-button>
          </span>
        </span>);
    },
    /**
     * @description 树形菜单过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    translate(val) {
      if (translateJsonData[val] == "" || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
  },
  filters: {
    translate(val) {
      if (translateJsonData[val] == "" || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    },
  }
}
</script>
<style lang='scss' scoped>
.noDataShow {
  text-align: center;
  font-size: 15px;
  vertical-align: middle;
  margin-top: 28px;
  color: #909399;
}
.aStyle {
  color: #f08c38;
  padding: 1px 15px;
  border: 1px solid #d1d2d5;
  border-radius: 5px;
  display: inline-block;
}
.left-tree,
.right-tabel-box {
  padding: 0 10px;
}
.query-box {
  position: relative;
  justify-content: space-around;
  padding: 0 10px;
  .btn-box {
    float: left;
  }
}
.select-list-box {
  width: 90%;
  display: flex;
  justify-content: space-between;
}
</style>
