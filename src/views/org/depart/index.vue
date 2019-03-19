<template>
  <div class="app-container calendar-list-container">
    <el-row :gutter="20">
      <el-col :span="6" @keyup.native.enter="saveInputNode">
        <div class="grid-content bg-purple" :class="{addTree:booleanInput}">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>组织架构</span>
              <div style="float: right">
                <el-button
                  style="padding:0;margin-right:10px;border:none"
                  title="添加组织架构"
                  v-if="departManager_btn_add"
                  @click="append"
                >
                  <i class="fa fa-plus"></i>
                </el-button>
                <!-- <excel-import-export style="float:right" type="model" @uploaded="uploaded"></excel-import-export> -->
              </div>
            </div>

            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
              <el-tree
                class="filter-tree leftTree"
                node-key="id"
                :data="mainTreeData"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="mainTree"
                @node-click="getTreeNodeData"
                highlight-current
                :render-content="renderContent"
                v-loading="loadingTree"
              ></el-tree>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18" style="height:100%">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card" v-if="!editTreeFormFlag" style="height:100%">
            <div slot="header" class="clearfix">
              <span>组织相关</span>
            </div>
            <div>
              <el-tabs value="first">
                <el-tab-pane label="用户管理" name="first">
                  <div class="filter-container">
                    <el-input
                      @keyup.enter.native="handlerTableRowFilter"
                      style="width: 200px;"
                      class="filter-item"
                      placeholder="姓名"
                      v-model="listTableQuery.name"
                    ></el-input>
                    <el-button
                      class="filter-item"
                      type="primary"
                      icon="search"
                      @click="handlerTableRowFilter"
                    >搜索</el-button>
                    <el-button
                      class="filter-item"
                      style="margin-left: 10px;"
                      @click="handleTableRowCreate"
                      v-if="departManager_btn_user_add"
                      type="primary"
                    >添加用户</el-button>
                  </div>
                  <el-table :data="childTableData" border highlight-current-row style="width: 100%">
                    <el-table-column width="200" align="center" label="姓名">
                      <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="110" align="center" label="账户">
                      <template slot-scope="scope">
                        <span>{{scope.row.username}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="110" align="center" label="性别">
                      <template slot-scope="scope">
                        <span>{{scope.row.sex}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="300" align="center" label="备注">
                      <template slot-scope="scope">
                        <span>{{scope.row.description}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" min-width="150px">
                      <template slot-scope="scope">
                        <!-- <el-button size="small" type="text" @click="handleTableRowDelete(scope.row)" style="color: red" v-if="departManager_btn_user_del">
                        <i class="el-icon-delete"></i>
                        </el-button>-->
                        <el-button
                          size="small"
                          type="danger"
                          @click="handleTableRowDelete(scope.row)"
                          v-if="departManager_btn_user_del"
                        >
                          <!--<i class="el-icon-delete" />-->
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="岗位管理" name="second">
                  <depart-position :departId="currentTreeNodeId" ref="positionManager"/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
          <el-card class="box-card" v-if="editTreeFormFlag">
            <div slot="header" class="clearfix">
              <span>部门编辑</span>
            </div>
            <div>
              <!-- 表单提交 -->
              <el-form
                :model="mainTreeForm"
                status-icon
                :rules="mainTreeFormRules"
                ref="mainTreeForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="编码" prop="code">
                  <el-input v-model="mainTreeForm.code" placeholder="请输入编码"></el-input>
                </el-form-item>
                <el-form-item label="部门名" prop="name">
                  <el-input v-model="mainTreeForm.name" placeholder="请输入部门名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="部门类型">
                  <el-select class="filter-item" v-model="mainTreeForm.type" placeholder="请选择部门类型">
                    <el-option
                      v-for="item in  departTypeOptions"
                      :key="item.id"
                      :label="item.labelDefault"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="handlerMainTreeForm('mainTreeForm')"
                    v-if="departManager_btn_edit"
                  >提交</el-button>
                  <el-button @click="declear">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-if="departManager_btn_add" title="添加用户" :visible.sync="dialogUserVisible">
      <depart-user @closeUserDialog="closeUserDialog" ref="departUser"></depart-user>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTree,
  addDepartObj,
  getDepartObj,
  delDepartObj,
  putDepartObj,
  addUserObj,
  delUserObj,
  getUsers
} from '@/api/org/depart2/index';
import { mapGetters } from 'vuex';
import { getTypeValue } from '@/api/dict/dictValue/index';
import ExcelImportExport from '@/components/ExcelImportExport';
export default {
  name: 'department',
  components: {
    ExcelImportExport,
    'depart-user': () => import('./components/departUser'),
    'depart-position': () => import('./components/departPosition')
  },
  watch: {
    booleanInput(val) {
      if (val) this.editTreeFormFlag = val

    },
    filterText(val) {
      this.$refs.mainTree.filter(val);
    }
  },
  methods: {
    saveInputNode() {
      let data = Object.assign({}, this.chooseData)
      if (this.booleanInput) {
        this.handlerMainTreeForm('mainTreeForm')
      }
    },
    //导入事件
    uploaded(data) {
      if (data.code === '-1') {
        this.$message.error('导入失败');
        return;
      }
      this.initmainTreeData();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleTableRowCreate() {
      if (this.currentTreeNodeId === undefined) {
        this.$notify({
          title: '提示',
          message: '请先选择部门节点！',
          type: 'warning',
          duration: 2000
        });
      } else {
        this.dialogUserVisible = true
      }
    },
    handleTableRowDelete(row) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserObj({ departId: this.currentTreeNodeId, userId: row.id }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.childTableData.indexOf(row);
          this.childTableData.splice(index, 1);
        });
      });
    },
    handlerTableRowFilter() {
      this.listTableQuery.departId = this.currentTreeNodeId
      const query = {
        departId: this.currentTreeNodeId,
        name: this.listTableQuery.name
      };
      getUsers(query).then(response => {
        this.childTableData = response.data.rows;
      });
    },
    handlerMainTreeForm(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          putDepartObj(this.mainTreeForm.id, this.mainTreeForm).then(() => {
            this.editTreeFormFlag = false
            this.initmainTreeData();
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    append(node, data) {
      if (this.booleanInput) return false
      let entity = {};
      if (data === undefined) {
        data = {}
        data.code = new Date().getTime();
        data.id = '-1';
        addDepartObj({ name: '根节点需修改', code: data.code, parentId: data.id }).then((response) => {
          this.booleanInput = true
          this.chooseData = Object.assign(response.data, { parentId: -1 })
          const newChild = { id: response.data.id, name: response.data.name, children: [], input: true, code: response.data.code, };
          this.mainTreeData.push(newChild)
          this.mainTreeForm = response.data
          this.$nextTick(() => {
            this.$refs.mainTree.setCurrentKey(response.data.id);
            this.setFocus();
          })
        });
      } else {
        addDepartObj({ name: '子节点', code: new Date().getTime() + '_tmp', parentId: data.id }).then(response => {
          entity = response.data;
          const newChild = { id: entity.id, label: entity.name, children: [], code: entity.code, input: true };
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild);
          this.booleanInput = true
          this.chooseData = Object.assign(entity)
          this.mainTreeForm = response.data
          this.$nextTick(() => {
            this.$refs.mainTree.setCurrentKey(response.data.id);
            this.setFocus();
          });
        })
      }
    },

    declear() {
      this.editTreeFormFlag = false;
      if (this.chooseData) {
        this.initmainTreeData()
        this.booleanInput = false
      }
    },
    Iputchange(e) {
      this.mainTreeForm.name = e.target.value
    },
    // input框自动获取焦点
    setFocus() {
      /* const input = document.getElementById('tree-input');
      console.log(input)
      if (!input) {
        return;
      }
      const len = input.value.length;
      this.setSelectionRange(input, len, len) */
      this.$nextTick(() => {
        const input = document.getElementById('tree-input');
        const len = input ? input.value.length : 0;
        this.setSelectionRange(input, len, len)
      })
    },
    // 设置光标在末尾
    setSelectionRange(input, selectionStart, selectionEnd) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      } else if (input.createTextRange) {
        const range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
      }
    },
    //保存input节点
    remove(node, data) {
      if (this.booleanInput) return false
      if (data.children.length > 0) {
        this.$notify({
          title: '失败',
          message: '删除失败，该部门有其他子部门！',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      const query = {
        departId: this.currentTreeNodeId
      };
      getUsers(query).then(response => {
        this.childTableData = response.data.rows;
        if (this.childTableData.length > 0) {
          this.$notify({
            title: '失败',
            message: '删除失败，部门存在用户！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        delDepartObj(data.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
        });
        this.$refs.mainTree.setCurrentKey(data.id);
      });
    },
    edit(node, data) {
      if (this.booleanInput) return false
      console.log(data)
      this.editTreeFormFlag = true;
      getDepartObj(data.id).then(response => {
        this.mainTreeForm = response.data;
      });
      this.$refs.mainTree.setCurrentKey(data.id);
    },
    resetMainTreeForm() {
      this.mainTreeForm = {
        code: '',
        name: ''
      };
    },
    renderContent(h, { node, data }) {
      if (data.input == undefined || data.input === false) {
        return (
          <span class='span-node' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
            <span>
              <el-badge value={data.childrenCount > 0 ? data.childrenCount : ''} class="tree-node-item">
                <span>{node.label}</span>
              </el-badge>
            </span>
            <span>
              {this.departManager_btn_edit ?
                <el-button
                  style="font-size: 12px;"
                  type="text"
                  on-click={() => this.edit(node, data)}
                >
                  <i class="el-icon-edit" />
                </el-button> : <span></span>
              }
              {this.departManager_btn_add ?
                <el-button
                  style="font-size: 12px;"
                  type="text"
                  on-click={() => this.append(node, data)}
                >
                  <i class="el-icon-circle-plus-outline" />
                </el-button>
                : <span></span>
              }
              {this.departManager_btn_del ?
                <el-button
                  style="font-size: 12px;"
                  type="text"
                  on-click={() => this.remove(node, data)}
                >
                  <i class="el-icon-delete" />
                </el-button>
                : <span></span>
              }
            </span>
          </span>
        )
      }
      else {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span><input value={data.name} id='tree-input' on-blur={() => { this.saveInputNode() }} on-input={(e) => { e.stopPropagation(); this.Iputchange(e) }}></input></span>
            </span>
          </span>
        )
      }
    },
    initmainTreeData() {
      this.loadingTree = true
      getTree().then(data => {
        this.loadingTree = false
        this.mainTreeData = data
        this.booleanInput = false
      });
    },
    getTreeNodeData(data) {
      this.currentTreeNodeId = data.id
      this.currentTreeNode = data
      const query = {
        departId: this.currentTreeNodeId
      };
      getUsers(query).then(response => {
        this.childTableData = response.data.rows
      });
      this.$refs.positionManager.getList(data.id)
    },
    closeUserDialog(selects) {
      this.dialogUserVisible = false
      const uIds = []
      let flag = false
      for (let i = 0; i < selects.length; i++) {
        flag = true
        for (let j = 0; j < this.childTableData.length; j++) {
          if (this.childTableData[j].id === selects[i].id) {
            flag = false
          }
        }
        if (flag) {
          this.childTableData.push(selects[i])
          uIds.push(selects[i].id)
        }
      }
      this.$refs.departUser.clear()
      addUserObj({ departId: this.currentTreeNodeId, userIds: uIds.join() }).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    }
  },
  created() {
    this.initmainTreeData()
    // 加载树
    this.departManager_btn_edit = this.elements['departManager:btn_edit'];
    this.departManager_btn_del = this.elements['departManager:btn_del'];
    this.departManager_btn_add = this.elements['departManager:btn_add'];
    this.departManager_btn_user_add = this.elements['departManager:btn_user_add'];
    this.departManager_btn_user_del = this.elements['departManager:btn_user_del'];
    getTypeValue('org_depart').then(response => {
      this.departTypeOptions = response.data.rows;
    });
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data() {
    return {
      booleanInput: false,
      chooseData: false,

      loadingTree: false,
      dialogUserVisible: false,
      departTypeOptions: [],
      departManager_btn_edit: false,
      departManager_btn_del: false,
      departManager_btn_add: false,
      departManager_btn_user_add: false,
      departManager_btn_user_del: false,
      filterText: '',
      editTreeFormFlag: false,
      currentTreeNodeId: undefined,
      currentTreeNode: {},
      mainTreeForm: {
        code: '',
        name: ''
      },
      listTableQuery: {
        name: undefined,
        departId: undefined
      },
      mainTreeFormRules: {
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入目录名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      mainTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      childTableData: []
    };
  }
};
</script>
