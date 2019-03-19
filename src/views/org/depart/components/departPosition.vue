<template>
  <div>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="岗位名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="positionManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary"
        icon="edit">添加</el-button>
      <el-button class="filter-item" v-if="positionManager_btn_user" style="margin-left: 10px;" @click="openUserDialog" type="success"
        icon="edit">关联用户</el-button>
      <el-button class="filter-item" v-if="positionManager_btn_group" style="margin-left: 10px;" @click="openGroupDialog" type="success"
        icon="edit">关联角色</el-button>
      <el-button class="filter-item" v-if="positionManager_btn_depart" style="margin-left: 10px;" @click="openDepartDialog" type="success"
        icon="edit">数据授权</el-button>
    </div>
    <el-table :key='tableKey' :data="list" border fit highlight-current-row style="width: 100%" @row-click="handlerRowClick">
      <el-table-column width="200px" align="center" label="职位">
        <template  slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="编码">
        <template  slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="类型">
        <template  slot-scope="scope">
          <span>{{scope.row.type}}</span>
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
      <el-table-column fixed="right" align="center" label="操作" min-width="200px">
        <template  slot-scope="scope">
          <el-button v-if="positionManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="positionManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="职位" prop="name">
          <el-input v-model="form.name" placeholder="请输入职位"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"></el-input>
        </el-form-item>
      <el-form-item label="类型">
         <el-select class="filter-item" v-model="form.type" placeholder="请选择">
            <el-option v-for="item in  positionOptions" :key="item.id" :label="item.labelDefault" :value="item.value"> </el-option>
          </el-select>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="positionManager_btn_user" :visible.sync="dialogUserVisible">
      <position-user :positionId="positionId" @closeUserDialog="closeUserDialog" ref="positionUser" ></position-user>
    </el-dialog>
    <el-dialog v-if="positionManager_btn_group" :visible.sync="dialogGroupVisible">
      <position-group :positionId="positionId" @closeGroupDialog="closeGroupDialog" ref="positionGroup" ></position-group>
    </el-dialog>
     <el-dialog v-if="positionManager_btn_depart" :visible.sync="dialogDepartVisible">
      <position-depart :positionId="positionId" @closeDepartDialog="closeDepartDialog" ref="positionDepart" ></position-depart>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  addPositionObj,
  getPositionObj,
  delPositionObj,
  putPositionObj,
  getUsers
} from '@/api/org/position/index';
import { mapGetters } from 'vuex';
import { getTypeValue } from '@/api/dict/dictValue/index';
export default {
  name: 'depart-position',
  components: {
    'position-user': () => import('./positionUser'),
    'position-group': () => import('./positionGroup'),
    'position-depart': () => import('./positionDepart')
  },
  props: {
    departId: undefined
  },
  data() {
    return {
      form: {
        name: undefined,
        code: undefined,
        departId: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入职位',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ], code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        departId: undefined
      },
      positionOptions: [],
      positionId: undefined,
      dialogFormVisible: false,
      dialogUserVisible: false,
      dialogGroupVisible: false,
      dialogDepartVisible: false,
      dialogStatus: '',
      positionManager_btn_edit: false,
      positionManager_btn_del: false,
      positionManager_btn_add: false,
      positionManager_btn_user: false,
      positionManager_btn_group: false,
      positionManager_btn_depart: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.positionManager_btn_edit = this.elements['positionManager:btn_edit'];
    this.positionManager_btn_del = this.elements['positionManager:btn_del'];
    this.positionManager_btn_add = this.elements['positionManager:btn_add'];
    this.positionManager_btn_user = this.elements['positionManager:btn_user'];
    this.positionManager_btn_group = this.elements['positionManager:btn_group'];
    this.positionManager_btn_depart = this.elements['positionManager:btn_depart'];
    getTypeValue('org_position').then(response => {
      this.positionOptions = response.data.rows;
    });
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList(departId) {
      this.listLoading = true;
      if (departId === undefined) {
        this.listQuery.departId = this.departId
      } else {
        this.listQuery.departId = departId
      }
      if (this.listQuery.departId !== undefined) {
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      }
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handlerRowClick(row) {
      this.positionId = row.id
    },
    handleCreate() {
      if (this.departId === undefined) {
        this.$notify({
          title: '失败',
          message: '创建失败，请先选择部门！',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getPositionObj(row.id)
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handleDelete(row) {
      getUsers(this.positionId).then(response => {
        if (response.data.length > 0) {
          this.$notify({
            title: '失败',
            message: '删除失败，该岗位已关联了相关用户或角色！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delPositionObj(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.form.departId = this.departId
          addPositionObj(this.form)
            .then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putPositionObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    openGroupDialog() {
      if (this.positionId === undefined) {
        this.$notify({
          title: '提示',
          message: '请先相关选择岗位！',
          type: 'warning',
          duration: 2000
        });
      } else {
        if (this.$refs.positionGroup !== undefined) {
          this.$refs.positionGroup.positionId = this.positionId;
          this.$refs.positionGroup.initGroups();
        }
        this.dialogGroupVisible = true
      }
    },
    closeGroupDialog() {
      this.dialogGroupVisible = false
    },
    openDepartDialog() {
      if (this.positionId === undefined) {
        this.$notify({
          title: '提示',
          message: '请先相关选择岗位！',
          type: 'warning',
          duration: 2000
        });
      } else {
        if (this.$refs.positionDepart !== undefined) {
          this.$refs.positionDepart.positionId = this.positionId;
          this.$refs.positionDepart.initDeparts();
        }
        this.dialogDepartVisible = true
      }
    },
    closeDepartDialog() {
      this.dialogDepartVisible = false
    },
    openUserDialog() {
      if (this.positionId === undefined) {
        this.$notify({
          title: '提示',
          message: '请先相关选择岗位！',
          type: 'warning',
          duration: 2000
        });
      } else {
        if (this.$refs.positionUser !== undefined) {
          this.$refs.positionUser.positionId = this.positionId;
          this.$refs.positionUser.initUsers();
        }
        this.dialogUserVisible = true
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false
    },
    resetTemp() {
      this.form = {
        code: undefined,
        name: undefined,
        departId: this.departId
      };
    }
  }
}
</script>
