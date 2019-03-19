  <template>
  <div class="app-container calendar-list-container">
    <el-row>
      <my-tree
        :params="treeParams"
        @nodeClick="treeNodeClick"
        isDataSource="true"
        :btnState="btnState"
      ></my-tree>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <el-card>
            <div slot="header" class="clearfix">
              <span>数据源列表</span>
              <span
                style="float:right;cursor:pointer"
                class="fa fa-refresh"
                title="获取最新10条数据"
                @click="getLatestListClick"
              ></span>
            </div>
            <div class="table">
              <div>
                <div>
                  <el-row>
                    <el-col :span="12" style="height:20px">
                      <el-button type="primary" @click="handleAdd" v-show="!btnState">
                        <i class="fa fa-plus"></i>
                        新增
                      </el-button>
                    </el-col>
                    <el-col :span="10" :offset="2" style="text-align: right">
                      <el-input
                        v-model="keyWords"
                        placeholder="名称或类型"
                        class="handle-input mr10"
                        suffix-icon="el-icon-search"
                      ></el-input>
                    </el-col>
                  </el-row>
                </div>
                <el-table
                  :data="listData"
                  ref="multipleTable"
                  v-loading="listLoading"
                  border
                  fit
                  highlight-current-row
                  :default-sort="{prop: 'update_time', order: 'descending'}"
                  @row-click="tableRowClick"
                  @selection-change="handleSelectionChange"
                  style="width: 100%;margin-top:15px;"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    v-if="btnState"
                    :selectable="isdisable"
                  ></el-table-column>
                  <el-table-column
                    width="200"
                    align="center"
                    sortable
                    label="名称"
                    prop="name"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <span>{{scope.row.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="类型" prop="type">
                    <template slot-scope="scope">
                      <span>{{scope.row.type}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="使用状态" prop="status">
                    <template slot-scope="scope">
                      <span>
                        <el-tag :type="scope.row.status === 1?'':'warning'">
                          <span v-if="scope.row.status === 1">可用</span>
                          <span v-else>不可用</span>
                        </el-tag>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    sortable
                    label="创建时间"
                    width="120"
                    :show-overflow-tooltip="true"
                    prop="creat_time"
                  >
                    <template slot-scope="scope">
                      <span>{{scope.row.creat_time | formatLongTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="更新时间"
                    width="120"
                    :show-overflow-tooltip="true"
                    prop="update_time"
                  >
                    <template slot-scope="scope">
                      <span>{{scope.row.update_time| formatLongTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="描述">
                    <template slot-scope="scope">
                      <span>{{scope.row.description}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="业务数" label-class-name="bussiness">
                    <template slot-scope="scope">
                      <span>{{scope.row.bussiness.length}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="任务数" label-class-name="task">
                    <template slot-scope="scope">
                      <span>{{scope.row.task.length}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" min-width="250" v-if="!btnState">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="测试状态" placement="bottom-end">
                        <el-button
                          type="primary"
                          plain
                          size="mini"
                          @click.stop="testState(scope.row)"
                        >
                          <i class="fa fa-exchange"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                        <el-button
                          type="success"
                          plain
                          size="mini"
                          @click.stop="handleEdit(scope.row)"
                        >
                          <i class="fa fa-check-square-o"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="关联" placement="bottom-end">
                        <el-button
                          type="success"
                          plain
                          size="mini"
                          @click.stop="handleLink(scope.row)"
                        >
                          <i class="fa fa-link"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
                        <el-button
                          type="danger"
                          plain
                          size="mini"
                          @click.stop="handleDel(scope.row)"
                        >
                          <i class="fa fa-trash"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination" v-show="page.total">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currPage"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next"
                    :total="page.total"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!--数据源详情-->
    <el-dialog title="数据源详情" :visible.sync="dialogDetailVisible">
      <detail-cont :data="sourceDetail"></detail-cont>
    </el-dialog>
    <!--新增、编辑弹窗-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="数据源类型" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="连接URL" :label-width="formLabelWidth" prop="uri">
          <el-input v-model="form.uri" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label="form.type === 'Kafka'?'分组名':'用户名'"
          :label-width="formLabelWidth"
          prop="username"
          :rules="isRequire?rules.other:[]"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label="form.type === 'Kafka'?'主题列表':'密码'"
          :label-width="formLabelWidth"
          prop="password"
          :rules="isRequire?rules.other:[]"
        >
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saveState">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 关联关系弹窗 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.realationVisible">
      <reladion-dialog :config="dialog.config"></reladion-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTop,
  addObj,
  delObj,
  getListByTree,
  updateObj,
  testConnect
} from '@/api/dataLake/dataSource/index.js';
import DetailCont from './components/DetailCont'
import myTree from '@/components/Tree/index'
import ReladionDialog from '@/components/ReladionDialog/index.vue'
const REQUIRED_TYPE = ['mysql', 'oracle', 'postgresql', 'db2', 'hive', 'kafka']
const DATASOURCE_CONGI = {
  mysql: 'jdbc:mysql://localhost:3306/test',
  hive: 'jdbc:hive2://localhost:10000/default',
  oracle: 'jdbc:oracle:thin:@localhost:1521:databse',
  postgresql: 'jdbc:postgresql://localhost:5432/test',
  db2: 'jdbc:db2://localhost:5000/[database]'
}
export default {
  name: 'index',
  props: ['btnState', 'selectedData'],
  components: {
    DetailCont,
    myTree,
    ReladionDialog
  },
  data() {
    // 验证数据源名称是否重名
    const checkName = (rule, value, callback) => {
      const data = this.validData ? [...this.validData] : '';
      const state = data.find(item => {
        return item.name === value;
      });
      if (state) {
        callback(new Error('该名称已被使用'));
      } else {
        callback();
      }
    };
    // 验证特殊字符
    const checkSpechars = (rule, value, callback) => {
      const patrn = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
      if (patrn.test(value)) { // 如果包含特殊字符提示用户
        callback(new Error('特殊字符允许下划线 _ 和点 .'));
      } else {
        callback();
      }
    };
    return {
      treeParams: {
        type: 'DATASOURCE',
        name: '数据源'
      },
      multipleSelection: [],
      listLoading: false,
      list: [], // 初始化数据(全部数据)
      listData: [], // 最终数据
      keyWords: '',
      isRequire: false, // 数据源新增、编辑判断用户名书否为必填
      page: {
        total: 0,
        page: 1,
        currPage: 1,
        pageSize: 10
      },
      query: {
        type: 'UserDatasource'
      },
      tree: {

      },
      validData: [], // 用于验证重名的数据
      sourceDetail: {
        owner: { displayName: '' }
      }, // 关联流程信息
      title: '新增',
      dialogFormVisible: false,
      dialogDetailVisible: false,
      formLabelWidth: '160px',
      saveState: false,
      accessSaveState: false,
      dataSourceType: '', // 数据的分类,用于判断输入框的状态
      form: { // 数据源新增字段
        description: '',
        name: '',
        parent_id: '',
        password: '',
        type: '',
        uri: '',
        username: ''
      },
      dialog: {
        title: '关系列表',
        realationVisible: false,
        config: {
          data: [],
          fromCol: 'from_name',
          fromName: '',
          toCol: 'to_name',
          toName: ''
        },
        linkConfig: {
          selected: {
            depart: [],
            task: [],
            subject: [],
            business: [],
            standard: [],
            model: [],
            rule: [],
            datasource: []
          },
          type: 'subject',
          typeArr: ['depart', 'task']
        }
      },
      rules: {
        uri: [{ required: true, message: '必填', trigger: 'blur' }],
        other: [{ required: true, message: '必填', trigger: 'blur' }],
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { validator: checkSpechars, trigger: 'blur' }
        ]
        //  { validator: checkName, trigger: 'blur' },
      }
    };
  },
  created() {
    this.getLatestList();
  },
  watch: {
    keyWords() {
      this.page.currPage = 1;
      this.handletableData()
    }
  },
  methods: {
    // 过滤掉选中的数据
    isdisable(row) {
      for (const o of this.selectedData) {
        if (row.id === o.parent_id || row.id === o.to_id) {
          return false
        }
      }
      return true
    },
    treeNodeClick(data, node) {
      this.tree = { data, node }
      this.getListDataByTree(data.id)
    },
    // 表格可选择
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      // this.$emit('handleSelectionChange', val)
    },
    //  获取第二层的名字
    getNodeName(node) {
      if (node.level === 2) {
        this.form.type = node.label
      } else {
        this.getNodeName(node.parent)
      }
    },
    // 循环
    // 获取最新的10条数据
    getLatestList() {
      this.listLoading = true;
      getTop(10).then(res => {
        this.listLoading = false;
        if (res.code !== 0) {
          this.$message.error(res.message)
          return;
        }
        const data = res.data;
        this.page.total = data.length;
        this.list = data;
        this.listData = this.list.slice(0, this.page.pageSize);
      });
    },
    // 点击获取最新的10条数据
    getLatestListClick() {
      this.tree = null;
      this.getLatestList()
    },
    // 根据树获取列表
    getListDataByTree(id) {
      this.listLoading = true;
      console.log(id)
      if (!id) {
        this.getLatestListClick();
        return;
      }
      getListByTree(id).then(res => {
        this.listLoading = false;
        if (res.code !== 0) {
          this.$message.error(res.msg)
          return false
        }
        const data = res.data
        this.page.total = data.length;
        this.list = data;
        this.listData = this.list.slice(0, this.page.pageSize);
      })
    },
    getList() {
      if (this.tree.data && this.tree.data.id) {
        this.getListDataByTree(this.tree.data.id)
      } else {
        this.getLatestList()
      }
    },
    // 新增数据源
    handleAdd() {
      if (!this.tree.data) {
        this.$message.warning('请选择数据源分类')
        return;
      }
      if (this.tree.node.level === 1) {
        this.$message.warning('请选择详细的数据源分类(比如：MySql)');
        return;
      }
      this.getNodeName(this.tree.node)
      // resetFields重置无效
      // this.initForm('form')
      this.saveState = false;
      this.form.parent_id = this.tree.data.id
      this.title = '新增';
      this.dialogFormVisible = true;
      this.isRequireByType()
      this.setDatasourceUrl()
      // this.getDataBaseInfo();
    },
    // 判断是否用户名和密码是否为必填
    isRequireByType() {
      const type = this.form.type;
      REQUIRED_TYPE.includes(type.toLowerCase()) ? this.isRequire = true : this.isRequire = false
    },
    // 行点击事件
    tableRowClick(row) {
      console.log(row)
    },
    // 设置url的默认
    setDatasourceUrl() {
      const type = this.form.type;
      if (DATASOURCE_CONGI[type.toLowerCase()]) {
        this.form.uri = DATASOURCE_CONGI[type.toLowerCase()];
        return;
      }
      this.form.uri = ''
    },
    // 数据源编辑
    handleEdit(row) {
      if (Number(row.connectCount) > 0) {
        this.$message.error('无法编辑,该数据源有关联的数据流程');
        return;
      }
      // resetFields重置无效
      this.initForm('form')
      this.saveState = false;
      // this.validData = this.delEditData(row, [...this.list]);
      this.title = '编辑';
      this.form = Object.assign({}, row);
      this.businessArr = [row.businessId]
      this.dialogFormVisible = true;
    },
    // 删除正在编辑数据 {obj:当前编辑的数据,data：所有数据}
    delEditData(obj, data) {
      const result = [];
      for (const item of data) {
        if (item.id !== obj.id) {
          result.push(item)
        }
      }
      return result;
    },
    // 数据源详情
    handleDetail(row) {
      this.sourceDetail = row
      this.dialogDetailVisible = true;
    },
    // 数据源保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveState = true;
          if (this.title === '新增') {
            addObj(this.form).then(res => {
              this.saveState = false;
              if (res.code !== 0) {
                this.$message.error(res.msg);
                return;
              }
              this.$message.success('保存成功');
              this.dialogFormVisible = false;
              this.resetForm('form');
              this.getList()
              // this.getListDataByTree(this.currTreeData)
            }).catch(err => {
              this.saveState = false;
              console.log(err)
            });
          } else {
            updateObj(this.form).then(res => {
              console.log('更新')
              this.saveState = false;
              if (res.status !== 0) {
                this.$message.error('保存失败');
                return;
              }
              this.$message.success('保存成功');
              this.dialogFormVisible = false;
              this.resetForm('form')
              this.getList()
              /* if (this.currTreeData) {
                this.getListDataByTree(this.currTreeData)
              } else {
                this.getLatestList()
              } */
            }).catch(err => {
              this.saveState = false;
              console.log(err)
            });
          }
        } else {
          return false;
        }
      });
    },
    // 数据源取消
    cancelForm() {
      this.dialogFormVisible = false;
      this.resetForm('form');
    },
    // 数据源删除
    handleDel(row) {
      this.$confirm('确认删除该数据源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (Number(row.connectCount) > 0) {
          this.$message.error('删除失败,该数据源有关联的数据流程');
          return false;
        }
        this.listLoading = true;
        delObj(row.id).then(res => {
          if (!res || res.status !== 200) {
            this.listLoading = false;
            this.$message.error(res ? res.message : '删除失败')
            return;
          }
          this.$message.success('删除成功');
          this.getList()
          // this.getListDataByTree(this.tree.data.id)
        }).catch(err => {
          console.log(err)
          this.listLoading = false;
        });
      })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    // 单元格被点击
    cellClick(row, column) {
      if (!column.labelClassName) return;
      this.dialog.config.fromName = '部门名称'
      this.dialog.config.toName = column.label.slice(0, 2) + '名称'
      this.dialog.realationVisible = true;
      this.dialog.config.data = row[column.labelClassName]
    },
    // 添加关联
    handleLink(row) {
      this.dialog.linkConfig.selected = row
      this.$refs.linkDialog.dialog.visible = true
    },
    // 刷新数据
    // 保存关联
    refreshList() {
      this.getList()
    },
    // 处理分页数据
    handletableData() {
      const { pageSize, currPage } = this.page;
      const startIndex = (currPage - 1) * pageSize;
      const endIndex = currPage * pageSize;
      let tempList = [];
      for (const item of this.list) {
        if (
          item.name.includes(this.keyWords) ||
          item.type.includes(this.keyWords)
        ) {
          tempList.push(item);
        }
      }
      this.page.total = tempList.length;
      tempList = tempList.slice(startIndex, endIndex);
      this.listData = tempList;
      this.loading = false;
    },
    // 测试状态
    testState(row) {
      console.log(row)
      testConnect(row).then(res => {
        if (res.code !== 0) {
          this.$message.error('测试失败')
          return;
        }
        this.$message.success('测试完成')
        console.log(this.tree.data)
        this.getList()
        /* if (this.tree.data) {
          this.getListDataByTree(this.tree.data.id)
        } else {
          this.getListDataByTree()
        } */
      })
    },
    // pageSize变化
    handleSizeChange(val) {
      // pageSize
      this.page.pageSize = val;
      this.handletableData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.currPage = val;
      this.handletableData();
    },
    // 重置表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 初始化数据
    initForm(formName) {
    },
    // 导入导出组件的事件
    uploaded(data) {
      if (data.code !== 0) {
        this.$message.error('导入失败:' + data.msg);
        return;
      }
      this.$message.success('导入成功');
      this.getTreeData();
    }
  }
};
</script>
<style>
</style>
