<template>
   <div class="app-container calendar-list-container">
    <el-row>
  <el-col :span="8"><div class="grid-content bg-purple" style="margin-right: 10px">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>字典目录</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="addFirst">添加根节点</el-button>
  </div>
  <div>
    <el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<el-tree
  class="filter-tree"
  node-key="id"
  :data="dictTypeData"
  :props="defaultProps"
  default-expand-all
  :expand-on-click-node="false"
  :filter-node-method="filterNode"
  ref="dictTypeTree"
  @node-click="getNodeData"
  highlight-current
  :render-content="renderContent">
</el-tree>
  </div>
    </el-card>
</div></el-col>
  <el-col :span="16" style="height:100%"><div class="grid-content bg-purple-light">
     <el-card class="box-card" v-if="!editDictTypeFlag">
  <div slot="header" class="clearfix">
    <span>字典值</span>
  </div>
  <div>
     <div class="filter-container">
      <el-input @keyup.enter.native="handleDictValueFilter" style="width: 200px;" class="filter-item" placeholder="标签或code" v-model="listDictValueQuery.labelDefault"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleDictValueFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDictValueCreate" type="primary" v-if="this.dictValueManager_btn_add">添加</el-button>
    </div>
   <el-table :data="dictValueTableData" border  highlight-current-row style="width: 100%">
        <el-table-column width="200px" align="center" label="编码">
      <template  slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template>
    </el-table-column>
    <el-table-column width="100px" align="center" label="值">
      <template  slot-scope="scope">
        <span>{{scope.row.value}}</span>
      </template>
    </el-table-column>
        <el-table-column width="100px" align="center" label="默认显示">
      <template  slot-scope="scope">
        <span>{{scope.row.labelDefault}}</span>
      </template>
    </el-table-column>
     <el-table-column width="100px" align="center" label="排序">
      <template  slot-scope="scope">
        <span>{{scope.row.orderNum}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="英文显示">
      <template  slot-scope="scope">
        <span>{{scope.row.labelEnUs}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="中文显示">
      <template  slot-scope="scope">
        <span>{{scope.row.labelZhCh}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="最后更新人">
      <template  slot-scope="scope">
        <span>{{scope.row.updUserName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="最后更新人ID">
      <template  slot-scope="scope">
        <span>{{scope.row.updUserId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="最后更新时间">
      <template  slot-scope="scope">
        <span>{{scope.row.updTime}}</span>
      </template>
    </el-table-column>
     <el-table-column
       fixed="right"
       align="center"
       label="操作"
       min-width="150">
       <template  slot-scope="scope">
         <el-button  size="small" type="success" @click="handleClick(scope.row)" v-if="dictValueManager_btn_edit">
           <i class="el-icon-edit" />
         </el-button>
         <el-button size="small" type="danger"  @click="handleDelete(scope.row)"  v-if="dictValueManager_btn_del">
           <i class="el-icon-delete" />
         </el-button>
       </template>
     </el-table-column>

  </el-table>
  </div></el-card>
  <el-card class="box-card" v-if="editDictTypeFlag">
  <div slot="header" class="clearfix">
    <span>字典目录编辑</span>
  </div>
  <div>
     <!-- 表单提交 -->
     <el-form :model="dictTypeForm" status-icon :rules="dictTypeFormRules" ref="dictTypeForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="编码" prop="code">
        <el-input v-model="dictTypeForm.code" placeholder="请输入编码">

        </el-input>
      </el-form-item>
      <el-form-item label="目录名" prop="name">
        <el-input v-model="dictTypeForm.name" placeholder="请输入目录名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handlerDictTypeForm('dictTypeForm')" v-if="this.dictTypeManager_btn_edit">提交</el-button>
        <el-button @click="editDictTypeFlag = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div></el-card>
    </div></el-col>
</el-row>
  <el-dialog
    title="提示"
    :visible.sync="dictValueDialogVisible"
    width="30%"
    center>
    <!-- 表单提交 -->
    <el-form :model="dictValueForm" :rules="dictValueFormRules" ref="dictValueForm" label-width="100px">
        <el-form-item label="编码值" prop="code">
      <el-input v-model="dictValueForm.code" placeholder="请输入值">
        <template slot="prepend">{{currentDictType.code+'_'}}</template>
      </el-input>
    </el-form-item>
        <el-form-item label="默认显示" prop="labelDefault">
      <el-input v-model="dictValueForm.labelDefault" placeholder="请输入默认显示"></el-input>
    </el-form-item>
        <el-form-item label="英文显示" prop="labelEnUs">
      <el-input v-model="dictValueForm.labelEnUs" placeholder="请输入英文显示"></el-input>
    </el-form-item>
        <el-form-item label="中文显示" prop="labelZhCh">
      <el-input v-model="dictValueForm.labelZhCh" placeholder="请输入中文显示"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="orderNum">
          <el-input v-model="dictValueForm.orderNum" placeholder="请输入排序"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDictValueCancel">取 消</el-button>
      <el-button type="primary" @click="handleDictValueSave('dictValueForm')">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import {
  getTree,
  addTypeObj,
  getTypeObj,
  delTypeObj,
  putTypeObj
} from '@/api/dict/dictType/index';
import {
  page,
  addValueObj,
  delValueObj,
  putValueObj
} from '@/api/dict/dictValue/index';
import { mapGetters } from 'vuex';
export default {
  watch: {
    filterText(val) {
      this.$refs.dictTypeTree.filter(val);
    }
  },

  methods: {
    addFirst(){
      let params = {
        code: new Date().getTime(),
        name: "根节点需修改",
        parentId: "-1",
      }
      addTypeObj(params).then(res=>{
        this.initTreeData()

      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleClick(row) {
      this.dictValueDialogVisible = true;
      const { ...obj } = row
      this.dictValueForm = obj
      if (this.dictValueForm.code.indexOf(this.currentDictType.code) > -1) {
        this.dictValueForm.code = this.dictValueForm.code.substring(this.currentDictType.code.length + 1, this.dictValueForm.code.length)
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除字典值, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delValueObj(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.dictValueTableData.indexOf(row);
          this.dictValueTableData.splice(index, 1);
        });
      });
    },
    handleDictValueFilter() {
      this.listDictValueQuery.typeId = this.currentDictTypeId
      page(this.listDictValueQuery).then(response => {
        this.dictValueTableData = response.data.rows;
      });
    },
    handleDictValueSave(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          if (this.dictValueForm.id !== undefined) {
            this.dictValueForm.value = this.dictValueForm.code
            this.dictValueForm.code = this.currentDictType.code + '_' + this.dictValueForm.code
            putValueObj(this.dictValueForm.id, this.dictValueForm).then(() => {
              this.editDictTypeFlag = false
              this.handleDictValueFilter()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
              this.dictValueDialogVisible = false
            });
          } else {
            this.dictValueForm.value = this.dictValueForm.code
            this.dictValueForm.code = this.currentDictType.code + '_' + this.dictValueForm.code
            this.dictValueForm.typeId = this.currentDictTypeId
            addValueObj(this.dictValueForm).then(() => {
              this.editDictTypeFlag = false
              this.handleDictValueFilter()
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              this.dictValueDialogVisible = false
            });
          }
        } else {
          return false;
        }
      });
    },
    handleDictValueCreate() {
      if (this.currentDictTypeId === undefined) {
        this.$notify({
          title: '失败',
          message: '请先选择字典目录',
          type: 'warning',
          duration: 2000
        });
      } else {
        this.dictValueDialogVisible = true
        this.resetDictValueForm()
      }
    },
    handleDictValueCancel() {
      this.dictValueDialogVisible = false
      this.resetDictValueForm()
    },
    handlerDictTypeForm(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          putTypeObj(this.dictTypeForm.id, this.dictTypeForm).then(() => {
            this.editDictTypeFlag = false
            this.initTreeData();
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
      let entity = {};
      const date = new Date()
      const time = date.getTime()
      addTypeObj({ name: '子节点', code: `${data.code}_tmp_${time}`, parentId: data.id }).then(response => {
        entity = response.data;
        const newChild = { id: entity.id, label: entity.name, children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      });
      this.$refs.dictTypeTree.setCurrentKey(data.id);
    },
    remove(node, data) {
      if (data.children.length > 0) {
        this.$notify({
          title: '失败',
          message: '删除失败，该项有子孙节点！',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      const query = {
        typeId: this.currentDictTypeId
      };
      page(query).then(response => {
        this.dictValueTableData = response.data.rows;
        if (this.dictValueTableData.length > 0) {
          this.$notify({
            title: '失败',
            message: '删除失败，该项有字典值！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        delTypeObj(data.id).then(() => {
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
        this.$refs.dictTypeTree.setCurrentKey(data.id);
      });
    },
    edit(node, data) {
      this.editDictTypeFlag = true;
      this.currentDictTypeId = data.id
      this.currentDictType = data
      getTypeObj(data.id).then(response => {
        this.dictTypeForm = response.data;
      });
      this.$refs.dictTypeTree.setCurrentKey(data.id);
    },
    resetDictTypeForm() {
      this.dictTypeForm = {
        code: '',
        name: ''
      };
    },
    resetDictValueForm() {
      this.dictValueForm = {
        code: undefined,
        labelDefault: undefined,
        labelEnUs: undefined,
        labelZhCh: undefined,
        value: undefined
      };
    },
    renderContent(h, { node, data }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            {this.dictTypeManager_btn_edit ?
              <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.edit(node, data)}
              >
                <i class="el-icon-edit" />
              </el-button> : <span></span>
            }
            {this.dictTypeManager_btn_add ?
              <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.append(node, data)}
              >
                <i class="el-icon-circle-plus-outline" />
              </el-button>
              : <span></span>
            }
            {this.dictTypeManager_btn_del ?
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
      );
    },
    initTreeData() {
      getTree().then(data => {
        this.dictTypeData = data
      });
    },
    getNodeData(data) {
      this.currentDictTypeId = data.id
      this.currentDictType = data
      const query = {
        typeId: this.currentDictTypeId
      };
      page(query).then(response => {
        this.dictValueTableData = response.data.rows
      });
    }
  },
  created() {
    this.initTreeData()
    // 加载树
    this.dictTypeManager_btn_edit = this.elements['dictTypeManager:btn_edit'];
    this.dictTypeManager_btn_del = this.elements['dictTypeManager:btn_del'];
    this.dictTypeManager_btn_add = this.elements['dictTypeManager:btn_add'];
    this.dictValueManager_btn_edit = this.elements['dictValueManager:btn_edit'];
    this.dictValueManager_btn_del = this.elements['dictValueManager:btn_del'];
    this.dictValueManager_btn_add = this.elements['dictValueManager:btn_add'];
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data() {
    return {
      dictValueManager_btn_edit: false,
      dictValueManager_btn_del: false,
      dictValueManager_btn_add: false,
      dictTypeManager_btn_edit: false,
      dictTypeManager_btn_del: false,
      dictTypeManager_btn_add: false,
      filterText: '',
      dictValueDialogVisible: false,
      editDictTypeFlag: false,
      currentDictTypeId: undefined,
      currentDictType: {},
      dictTypeForm: {
        code: '',
        name: ''
      },
      listDictValueQuery: {
        labelDefault: undefined,
        typeId: undefined
      },
      dictValueForm: {
        code: undefined,
        labelDefault: undefined,
        labelEnUs: undefined,
        labelZhCh: undefined,
        value: undefined
      },
      dictValueFormRules: {
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
        labelDefault: [
          {
            required: true,
            message: '请输入默认显示',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        labelEnUs: [
          {
            required: true,
            message: '请输入英文显示',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        labelZhCh: [
          {
            required: true,
            message: '请输入中文显示',
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
      dictTypeFormRules: {
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
      dictTypeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dictValueTableData: []
    };
  }
};
</script>
