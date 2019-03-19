<template>
   <div class="app-container calendar-list-container">
    <el-row>
  <el-col :span="8"><div class="grid-content bg-purple" style="margin-right: 10px">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>组织架构</span>
  </div>
  <div>
    <el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<el-tree
  class="filter-tree"
  node-key="id"
  :data="mainTreeData"
  :props="defaultProps"
  default-expand-all
  :expand-on-click-node="false"
  :filter-node-method="filterNode"
  ref="mainTree"
  @node-click="getTreeNodeData"
  highlight-current
  :render-content="renderContent">
</el-tree>
  </div>
    </el-card>
</div></el-col>
  <el-col :span="16" style="height:100%"><div class="grid-content bg-purple-light">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户列表" name="first">用户列表</el-tab-pane>
      <el-tab-pane label="职位列表" name="second">职位列表</el-tab-pane>
    </el-tabs>
     <!-- <el-card class="box-card" v-if="!editTreeFormFlag">
  <div slot="header" class="clearfix">
    <span>岗位</span>
  </div>
  <div>
     <div class="filter-container">
      <el-input @keyup.enter.native="handlerTableRowFilter" style="width: 200px;" class="filter-item" placeholder="标签或code" v-model="listTableQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handlerTableRowFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleTableRowCreate" type="primary" v-if="this.dictValueManager_btn_add">添加</el-button>
    </div>
   <el-table :data="childTableData" border  highlight-current-row style="width: 100%">
        <el-table-column width="200px" align="center" label="编码">
      <template  slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px" align="center" label="岗位">
      <template  slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建人">
      <template  slot-scope="scope">
        <span>{{scope.row.crtUserName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建人ID">
      <template  slot-scope="scope">
        <span>{{scope.row.crtUserId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="创建时间">
      <template  slot-scope="scope">
        <span>{{scope.row.crtTime}}</span>
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
      label="操作"
      width="150px">
      <template  slot-scope="scope">
        <el-button size="small" type="text" @click="handleTableRowDelete(scope.row)" style="color: red" v-if="dictValueManager_btn_edit"><i class="el-icon-delete"></i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div></el-card> -->
  <el-card class="box-card" v-if="editTreeFormFlag">
  <div slot="header" class="clearfix">
    <span>部门编辑</span>
  </div>
  <div>
     <!-- 表单提交 -->
     <el-form :model="mainTreeForm" status-icon :rules="mainTreeFormRules" ref="mainTreeForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="编码" prop="code">
        <el-input v-model="mainTreeForm.code" placeholder="请输入编码">
        </el-input>
      </el-form-item>
      <el-form-item label="部门名" prop="name">
        <el-input v-model="mainTreeForm.name" placeholder="请输入部门名"></el-input>
      </el-form-item>
      <!-- <el-form-item label="部门类型" >
         <el-select class="filter-item" v-model="mainTreeForm.type" placeholder="请选择部门类型">
          <el-option v-for="item in  departTypeOptions" :key="item.id" :label="item.labelDefault" :value="item.value"> </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="handlerMainTreeForm('mainTreeForm')" v-if="this.departManager_btn_edit">提交</el-button>
        <el-button @click="editTreeFormFlag = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div></el-card>
    </div></el-col>
</el-row>

  </div>
</template>

<script>
import {
  getTree,
  addDepartObj,
  getDepartObj,
  delDepartObj,
  putDepartObj
} from '@/api/org/depart2/index';
import {
  page
} from '@/api/org/position/index';
import { mapGetters } from 'vuex';
import { getTypeValue } from '@/api/dict/dictValue/index';
export default {
  watch: {
    filterText(val) {
      this.$refs.mainTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleTableRowCreate() {
      // if (this.currentTreeNodeId === undefined) {
      //   this.$notify({
      //     title: '失败',
      //     message: '请先选择字典目录',
      //     type: 'warning',
      //     duration: 2000
      //   });
      // } else {
      //   this.dictValueDialogVisible = true
      // }
    },
    handleTableRowDelete() {
      // this.$confirm('此操作将永久删除岗位, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   delPositionObj(row.id).then(() => {
      //     this.$notify({
      //       title: '成功',
      //       message: '删除成功',
      //       type: 'success',
      //       duration: 2000
      //     });
      //     const index = this.childTableData.indexOf(row);
      //     this.childTableData.splice(index, 1);
      //   });
      // });
    },
    handlerTableRowFilter() {
      // this.listTableQuery.departId = this.currentTreeNodeId
      // page(this.listTableQuery).then(response => {
      //   this.childTableData = response.data.rows;
      // });
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
      let entity = {};
      addDepartObj({ name: '子节点', code: data.code + '_tmp', parentId: data.id }).then(response => {
        entity = response.data;
        const newChild = { id: entity.id, label: entity.name, children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      });
      this.$refs.mainTree.setCurrentKey(data.id);
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
        departId: this.currentTreeNodeId
      };
      page(query).then(response => {
        this.childTableData = response.data.rows;
        if (this.childTableData.length > 0) {
          this.$notify({
            title: '失败',
            message: '删除失败，该项有字典值！',
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
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
          <span>
            <span>{node.label}</span>
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
      );
    },
    initmainTreeData() {
      getTree().then(data => {
        this.mainTreeData = data
      });
    },
    getTreeNodeData(data) {
      this.currentTreeNodeId = data.id
      this.currentTreeNode = data
      // const query = {
      //   departId: this.currentTreeNodeId
      // };
      // page(query).then(response => {
      //   this.childTableData = response.data.rows
      // });
    }
  },
  created() {
    this.initmainTreeData()
    // 加载树
    this.departManager_btn_edit = this.elements['departManager:btn_edit'];
    this.departManager_btn_del = this.elements['departManager:btn_del'];
    this.departManager_btn_add = this.elements['departManager:btn_add'];
    getTypeValue('org_depart').then(response => {
      this.departTypeOptions = response.data.rows;
    });
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data() {
    return {
      departTypeOptions: [],
      departManager_btn_edit: true,
      departManager_btn_del: true,
      departManager_btn_add: true,
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
      }
    };
  }
};
</script>
