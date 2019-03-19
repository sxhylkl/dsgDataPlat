<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="20">
        <div class="table">
          <div class="container">
            <div class="handle-box">
              <el-row>
                <el-col :span="24">
                  <el-input v-model="keyWords" placeholder="实体名" class="handle-input mr10"></el-input>
                  <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
                </el-col>
              </el-row>
              <el-row class="mt-20">
                <el-col :span="24">
                  <el-button type="primary" @click="handleAdd"><i class="fa fa-plus"></i>
                    新增
                  </el-button>
                  <el-button type="primary" @click="handleAddOuterTable"><i class="fa fa-plus"></i>
                    新增外部表
                  </el-button>
                </el-col>
              </el-row>

            </div>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
                      style="width: 100%">
              <el-table-column width="220" align="center" label="实体名">
                <template slot-scope="scope">
                  <span>{{scope.row.key}}</span>
                </template>
              </el-table-column>
              <el-table-column width="220" align="center" label="表名">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column width="200" align="center" label="描述">
                <template slot-scope="scope">
                  <span>{{scope.row.comment}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" align="center" label="类型">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.external?'warning':'primary'">
                    <span v-if="scope.row.external">外部表</span>
                    <span v-else>内部表</span>
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column width="120" align="center" label="分组">
                <template slot-scope="scope">
                  <span>{{scope.row.groupName}}</span>
                </template>
              </el-table-column>
              <el-table-column width="220" align="center" label="数据源">
                <template slot-scope="scope">
                  <span>{{scope.row.dsName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                    <el-button type="primary" @click="handleEdit(scope.row)"><i
                      class="fa fa-edit"></i></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
                    <el-button type="primary" @click="handleDel(scope.row)"><i
                      class="fa fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination" v-if="page.total">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="query.limit"
                layout="total, sizes, prev, pager, next"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="title" width="75%" :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类" prop="groupName" label-width="120px">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="form.groupName"
                aria-readonly="true"
                :fetch-suggestions="querySearch"
                placeholder="点击选择分类"
                @select="handleSelect">
                <template slot-scope="{item}">
                  <div class="name">{{ item.name }}</div>
                  <!--<span class="id">{{ item.id }}</span>-->
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据源" prop="dsName" label-width="120px">
              <el-select v-model="form.dsName" style="width: 100%" @change="handleDs">
                <el-option
                  v-for="item in sysDataSources"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="描述" prop="comment" label-width="120px">
              <el-input v-model="form.comment"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="实体名" prop="key" label-width="120px">
              <el-input v-model="form.key"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="!form.external" label="数据库表名" prop="name" label-width="120px">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item v-if="form.external" label="数据库表名" prop="name" label-width="120px">
              <el-select placeholder="请选择" v-model="form.name" v-if="JSON.stringify(tableList)!=='{}'"
                         @change="handleTableFields()">
                <el-option
                  v-for="(val, key, index) in tableList"
                  :key="index"
                  :label="key"
                  :value="key">
                  <span style="float: left">{{ key }}({{val}})</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="!form.external" label="是否已生成表" label-width="120px">
              <span v-if="form.createdTable" style="margin-right: 5px">是</span>
              <span v-if="!form.createdTable">否<el-button v-if="form.id" type="primary"
                                                          @click="createTable">生成表</el-button></span>
            </el-form-item>
            <el-form-item v-if="form.external&&title==='新增外部表'" label="查询" label-width="120px">
              <el-input v-model="selectTableWords" class="handle-input mr10"
                        style="width: 65%"></el-input>
              <el-button type="primary" @click="searchTable"><i class="fa fa-search"></i>查询</el-button>
            </el-form-item>
            <el-form-item v-if="form.external&&title==='编辑'" label="操作" label-width="120px">
              <el-button type="primary" @click="handleTableFields(true)">同步外部表</el-button>
              <span style="font-size: 12px;color:#666;">同步后需要保存才生效</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="table">
          <div class="container">
            <div class="handle-box" v-if="!form.external">
              <el-row class="mt-20">
                <el-col :span="24">
                  <el-button type="primary" @click="handleAddField"><i class="fa fa-plus"></i>新增字段
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-table :data="form.columns" v-loading="dialogTableLoading" height="300" border fit
                      highlight-current-row
                      style="width: 100%">
              <el-table-column width="200" align="center" label="注释">
                <template slot-scope="scope">
                  <el-form-item :prop="'columns.' + scope.$index + '.comment'" :rules="rules.comment">
                    <el-input v-model="scope.row.comment"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="160px" align="center" label="属性名">
                <template slot-scope="scope">
                  <el-form-item :prop="'columns.' + scope.$index + '.key'" :rules="rules.fieldsKey">
                    <el-input v-model="scope.row.key"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="160px" align="center" label="数据库字段名">
                <template slot-scope="scope">
                  <el-form-item :prop="'columns.' + scope.$index + '.name'" :rules="rules.fieldsName">
                    <el-input v-model="scope.row.name" :disabled="form.external"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" label="必填">
                <template slot-scope="scope">
                  <el-button @click="handleRequires(scope.$index)"
                             :type="scope.row.required?'primary':'info'"
                             :disabled=Boolean((form.createdTable&&scope.row.id)||form.external)>
                    <span v-if="scope.row.required">是</span>
                    <span v-else>否</span>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="数据类型">
                <template slot-scope="scope">
                  <el-select placeholder="请选择" v-model="scope.row.type"
                             :disabled="scope.row.primary||form.external">
                    <el-option
                      v-for="item in columnTypeArr"
                      :key="item.key"
                      :label="item.desc"
                      :value="item.key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="160" align="center" label="属性长度">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="11">
                      <el-input v-if="scope.row.type=='varchar'  || scope.row.type=='number'"
                                v-model="scope.row.length" :disabled="form.external"></el-input>
                    </el-col>
                    <el-col :span="2"><span v-if="scope.row.type=='number'">.</span></el-col>
                    <el-col :span="11">
                      <el-input v-if="scope.row.type=='number'" v-model="scope.row.decimal"
                                :disabled="form.external"></el-input>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" label="默认值">
                <template slot-scope="scope">
                  <el-input v-if="!scope.row.primary&&scope.row.type!=='clob'"
                            v-model="scope.row.defaultValue"></el-input>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="字段控件">
                <template slot-scope="scope">
                  <el-select placeholder="请选择" v-if="!scope.row.primary"
                             v-model="scope.row.ctrl.type">
                    <el-option
                      v-for="item in  getCtrlTypeList(scope.row)"
                      :key="item.key"
                      :label="item.desc"
                      :value="item.key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="120" align="center" label="控件配置">
                <template slot-scope="scope">
                  <control-config @setConfig="handleSetConfig"
                                  v-if="!scope.row.primary&&scope.row.ctrl.type&&scope.row.ctrl.type!=='hidden'&&scope.row.ctrl.type!=='onetext'&&scope.row.ctrl.type!=='file'"
                                  :post-row="scope.row" :post-index="scope.$index"></control-config>
                </template>
              </el-table-column>
              <el-table-column width="200px" align="center" label="字段校验">
                <template slot-scope="scope">
                  <el-select
                    v-if="!scope.row.primary"
                    v-model="scope.row.ctrl.validRule"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择">
                    <el-option
                      v-for="item in validArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right" min-width="100">
                <template slot-scope="scope" v-if="!form.external">
                  <el-tooltip v-if="!scope.row.primary" class="item" effect="dark" content="删除"
                              placement="bottom-end">
                    <el-button type="primary" @click="handleFieldsDel(scope.$index)"><i
                      class="fa fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                  <span v-else style="color: red">主键字段</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ControlConfig from './components/ControlConfig'
  import { handleParams } from '@/utils/workflow/common.js'
  import { getRulesArr } from '@/utils/workflow/customValid.js' //valid
  import {
    createTable,
    getDataSource,
    getEnum,
    getObjectInfo,
    getObjTable,
    getObjTableInfo,
    getTableList,
    getTree,
    saveTable,
    tableDel,
  } from '@/api/workflow/businessApproval/form/table.js'

  export default {
    name: 'businessTable',
    components: {
      ControlConfig,
    },
    data () {
      let varirule = (rule, value, callback) => {
        if (!/^[a-zA-Z]\w*$/.test(value)) {
          return callback(new Error('只能为字母开头,允许字母、数字和下划线'))
        }
        callback()
      }
      let validKey = (rule, value, callback) => {
        let i = 0
        this.form.columns.forEach((item) => {
          if (item.key.toLowerCase() === value.toLowerCase()) {
            i++
            if (i > 1) {
              return callback(new Error('该名字已被使用'))
            }
          }
        })
        callback()
      }
      let validName = (rule, value, callback) => {
        let i = 0
        this.form.columns.forEach((item) => {
          if (item.name.toLowerCase() === value.toLowerCase()) {
            i++
            if (i > 1) {
              return callback(new Error('该名字已被使用'))
            }
          }
        })
        callback()
      }
      return {
        rules: {
          groupName: [{required: true, message: '必填', trigger: 'blur'}],
          dsName: [{required: true, message: '必填', trigger: 'blur'}],
          comment: [{required: true, message: '必填', trigger: 'blur'}],
          key: [{required: true, message: '必填', trigger: 'blur'}, {validator: varirule, trigger: 'blur'}],
          name: [{required: true, message: '必填', trigger: 'blur'}, {validator: varirule, trigger: 'blur'}],
          fieldsKey: [
            {required: true, message: '必填', trigger: 'blur'},
            {validator: varirule, trigger: 'blur'},
            {validator: validKey, trigger: 'blur'}],
          fieldsName: [
            {required: true, message: '必填', trigger: 'blur'},
            {validator: varirule, trigger: 'blur'},
            {validator: validName, trigger: 'blur'}],
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        keyWords: '',
        list: [],
        listLoading: false,
        page: {
          total: 0,
          page: 2,
          currPage: 1,
          pageSize: 10,
        },
        query: {
          limit: 10,
          offset: 0,
          order: 'asc',
        },
        title: '新增',
        dialogVisible: false,
        sysDataSources: [],
        initCtrl: {
          columnId: '',
          config: {},
          createTime: '',
          delete: false,
          id: '',
          type: '',
          updateTime: '',
          validRule: [],
          version: 0,
        },
        initColumns: {
          comment: '',
          createTime: '',
          decimal: '',
          id: '',
          key: '',
          length: 50,
          name: '',
          primary: false,
          required: false,
          tableId: '',
          type: 'varchar',
          updateTime: '',
          ctrl: {
            columnId: '',
            config: {},
            createTime: '',
            delete: false,
            id: '',
            type: '',//onetext
            updateTime: '',
            validRule: [],
            version: 0,
          },
        },
        form: {
          columns: [],
          createdTable: false,
          dsKey: undefined,
          dsName: undefined,
          external: false,
          groupId: undefined,
          groupName: undefined,
          id: undefined,
          key: undefined,
          name: undefined,
          pkKey: undefined,
          pkName: undefined,
        },
        columnCtrlType: null,
        columnType: null,
        columnCtrlTypeArr: [],
        columnTypeArr: [],
        validArr: [],
        dialogTableLoading: false,
        selectTableWords: '',
        tableList: {},

      }
    },
    created () {
      this.validArr = getRulesArr()
      this.getTreeData({treeKey: 'ywbfl'})
      this.getList(this.query)
      this.getEnum({path: 'com.dstz.bus.api.constant.BusColumnCtrlType', listMode: false}, false)
      this.getEnum({path: 'com.dstz.base.api.constant.ColumnType', listMode: false}, true)
    },
    methods: {
      getTreeData (obj) {
        //获取树形菜单
        let params = handleParams(obj)
        getTree(params).then(res => {
          this.treeData = res
        })
      },
      getList (obj) {
        //获取列表
        this.listLoading = true
        let params = handleParams(obj)
        getTableList(params).then(res => {
          this.list = res.rows
          this.page.total = res.total
          this.page.page = res.page
          this.page.pageSize = res.pageSize
          this.listLoading = false
        })
      },
      getEnum (obj, bo) {
        //获取数据类型和控件类型
        let params = handleParams(obj)
        getEnum(params).then(res => {
          if (bo) {
            this.columnType = res
            for (let val in res) {
              this.columnTypeArr.push(res[val])
            }
            console.log('数据类型')
            console.log(this.columnTypeArr)
          } else {
            this.columnCtrlType = res
            for (let val in res) {
              this.columnCtrlTypeArr.push(res[val])
            }
            console.log('控件类型')
            console.log(this.columnCtrlTypeArr)
          }

        })
      },
      getSourceData () {
        //获取数据源
        let params = handleParams({page: 1, rows: 99})
        getDataSource(params).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          console.log('数据源')
          console.log(res.rows)
          this.sysDataSources = res.rows
        })
      },
      getObjectInfo (obj) {
        //获取当前数据
        getObjectInfo(obj).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.handleForm(res.data)
        })
      },
      handleAdd () {
        //新增
        this.title = '新增'
        this.getSourceData()
        this.form.columns = []
        this.dialogVisible = true
        this.form.columns.push({
          type: this.columnType.VARCHAR.key,
          length: 50,
          decimal: 0,
          required: true,
          primary: true,
          name: 'id',
          comment: '主键',
          key: '',
        })

      },
      handleRequires (index) {
        //是否必填
        this.form.columns[index].required = !this.form.columns[index].required
      },
      handleAddField () {
        // 新增字段
        this.form.columns.push({
          comment: '',
          decimal: 0,
          key: '',
          length: 50,
          name: '',
          primary: false,
          required: false,
          type: 'varchar',
          ctrl: {
            config: {},
            type: 'onetext',
            validRule: []
          }
        })
      },
      handleEdit(row) {
        // 编辑
        this.title = '编辑'
        this.dialogTableLoading = true
        this.getObjectInfo({ id: row.id, fill: 1 })
        this.dialogVisible = true
        this.getSourceData()
      },
      handleDel(row) {
        // 删除
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          tableDel({id: row.id}).then(res => {
            if (res.code !== '200') {
              this.$message.error(res.msg)
              return false
            }
            this.$message.success(res.msg)
            this.getList(this.query)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSave() {
        // 保存
        this.$refs['form'].validate(valid => {
          if (valid) {
            console.log('最终的值')
            console.log(this.form)
            saveTable(this.form).then(res => {
              if (res.code !== '200') {
                this.$message.error(res.msg)
                return false
              }
              this.$message.success(res.msg)
              this.getList(this.query)
              this.initForm()
              this.dialogVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleSetConfig(data) {
        // 控件配置
        this.form.columns[data.index].ctrl.config.options = data.data
        console.log(this.form)
      },
      handleDs(name) {
        // 数据源改变时绑定key
        for (const index in this.sysDataSources) {
          if (this.sysDataSources[index].name === name) {
            this.form.dsKey = this.sysDataSources[index].key
          }
          console.log(this.form)
        }
      },
      createTable() {
        // 生成表
        const params = handleParams({ id: this.form.id })
        createTable(params).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          this.form.createdTable = true
        })
      },
      handleNodeClick(data) {
        // 树形菜单点击事件
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'group_id_^VEQ': data.id
        }
        this.getList(obj)
      },
      handleSelect(item) {
        // 分类选择时绑定id
        this.form.groupName = item.name
        this.form.groupId = item.id
      },
      querySearch(queryString, cb) {
        // 绑定input的下拉列表
        // 调用 callback 返回建议列表的数据
        cb(this.treeData)
      },
      search() {
        // 全局搜索
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'key_^VLK': this.keyWords
        }
        this.getList(obj)
      },
      handleSizeChange(val) {
        // pageSize
        this.query.limit = val
        this.getList(this.query)
      },
      handleCurrentChange(val) {
        // 翻页
        this.query.offset = this.query.limit * (val - 1)
        this.page.currPage = val
        this.getList(this.query)
      },
      handleForm(data) {
        // 把数组写入form
        for (const key in data) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key] = data[key]
          } else {
            this.$set(this.form, key, data[key])
          }
        }
        this.dialogTableLoading = false
        this.handleColumns()
      },
      handleColumns() {
        // 处理字段信息(把部分是jsonString 变为json)
        for (const index in this.form.columns) {
          if (!this.form.columns[index].ctrl) {
            this.form.columns[index].ctrl = this.initCtrl
          } else {
            if (this.form.columns[index].ctrl.validRule) {
              this.form.columns[index].ctrl.validRule = JSON.parse(this.form.columns[index].ctrl.validRule)
            }
            if (this.form.columns[index].ctrl.config) {
              this.form.columns[index].ctrl.config = JSON.parse(this.form.columns[index].ctrl.config)
            }
          }
        }
        // console.log(JSON.stringify(this.form))
        console.log(this.form)
      },
      getCtrlTypeList(row) {
        // 获取支持的控件
        const list = []
        const data = this.columnCtrlType
        for (const key in data) {
          if (data[key].supports.indexOf(row.type) !== -1) {
            list.push(data[key])
          }
        }
        return list
      },
      handleFieldsDel(index) {
        // 删除字段
        this.form.columns.splice(index, 1)
      },
      cancel() {
        // 取消
        this.dialogVisible = false
        this.initForm()
      },
      initForm() {
        // 初始化form
        this.form = {
          columns: [],
          createdTable: false,
          dsKey: undefined,
          dsName: undefined,
          external: false,
          groupId: undefined,
          groupName: undefined,
          id: undefined,
          key: undefined,
          name: undefined,
          pkKey: undefined,
          pkName: undefined
        }
      },
      handleAddOuterTable() {
        // 新增外部表
        this.title = '新增外部表'
        this.getSourceData()
        this.form.columns = []
        this.form.external = true
        this.dialogVisible = true
      },
      searchTable() {
        // 查询数据库表名
        if (!this.form.dsKey) {
          this.$message.error('请选择数据源')
          return false
        }
        const obj = { dsKey: this.form.dsKey, objType: 'table', objName: this.selectTableWords }
        getObjTable(obj).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.tableList = res.data
          this.$message.success(res.msg)
        })
      },
      getColumn(name) {
        let c = null
        this.form.columns.forEach(column => {
          if (column.name === name) {
            c = column
          }
        })
        return c
      },
      initCtrlConfig(ctrl) {
        /**
         * 根据控件类型初始化默认的控件配置
         */
        if (ctrl.type === 'onetext' || ctrl.type === 'customdialog') { // 单行文本框
          // 或
          // 自定义对话框
          ctrl.config = { options: {} } // 无特殊属性
        } else if (ctrl.type === 'multitext') { // 多行文本
          ctrl.config = {
            options: {
              isEditor: '0', // 是否富文本
              ewidth: '150', // 富文本的宽
              eheight: '500' // 富文本的高
            }
          }
        } else if (ctrl.type === 'select' || ctrl.type === 'multiselect' || ctrl.type === 'checkbox' || ctrl.type ===
          'radio') { // 下拉框或多选下拉框或复选框或单选按钮
          ctrl.config = {
            options: [
              {
                key: '', // 值
                txt: '' // 展示
              }]
          }
        } else if (ctrl.type === 'date') { // 日期
          ctrl.config = {
            options: {
              greater: '', // 大于
              less: '', // 小于
              format: 'yyyy-MM-dd HH:mm:ss'
            }
          }
        } else if (ctrl.type === 'dic' || ctrl.type === 'identity') { // 数据字典
          // 或
          // 流水号
          ctrl.config.options = {
            key: '' // 字典别名 或 流水号别名
          }
        }
      },
      handleTableFields(val) {
        // 获取表的字段信息
        const obj = { dsKey: this.form.dsKey, objType: 'table', objName: this.form.name }
        getObjTableInfo(obj).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          console.log(res.data.columns)
          this.$set(this.form, 'columns', res.data.columns)
          this.form.columns.forEach(item => {
            let column = this.getColumn(item.name)
            if (!column) {
              column = item
            }
            if (!column.comment) {
              column.comment = column.name
            }
            if (!column.key) {
              column.key = column.name
            }
            // 字段控件已存在
            if (column.ctrl || column.primary) {
              return
            }
            this.$set(column, 'ctrl', {
              columnId: '',
              config: {},
              createTime: '',
              delete: false,
              id: '',
              type: '',
              updateTime: '',
              validRule: [],
              version: 0,
            })
            if (column.type === this.columnType.DATE.key) {
              column.ctrl = {
                type: this.columnCtrlType.DATE.key,
                validRule: []
              }
            } else {
              column.ctrl = {
                type: this.columnCtrlType.ONETEXT.key,
                validRule: []
              }
            }
            this.initCtrlConfig(column.ctrl)
          })
          if (!this.form.key) {
            this.form.key = res.data.name
          }
          if (val) {
            this.$message.success('同步成功，【保存】后生效')
          }
          console.log(this.form)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
