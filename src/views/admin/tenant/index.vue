<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="租户名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="tenantManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary"
        icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column width="200px" align="center" label="编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="租户名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="是否超级租户">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSuperTenant === '0' ? 'primary' : 'warning'" close-transition>
            <span v-if="scope.row.isSuperTenant === '0'">普通租户</span>
            <span v-else-if="scope.row.isSuperTenant === '1'">超级租户</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.crtUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="创建人ID">
        <template slot-scope="scope">
          <span>{{scope.row.crtUserId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="最后更新人ID">
        <template slot-scope="scope">
          <span>{{scope.row.updUserId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="250">
        <template slot-scope="scope">
           <el-button v-if="tenantManager_btn_user" size="small" type="primary" @click="handlerUser(scope.row)">授予
          </el-button>
          <el-button v-if="tenantManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="tenantManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入租户名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="是否超级租户" prop="isSuperTenant">
          <el-switch v-model="form.isSuperTenant" active-text="是" inactive-text="否" active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="授予用户" :visible.sync="dialogUserVisible" center width="350px">
       <el-select v-model="currentUser"     filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUser()">取 消</el-button>
        <el-button type="primary" @click="confirmUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  updateUser,
  getOwner
} from '@/api/admin/tenant/index';
import {
  page as pageUser
} from '@/api/admin/user/index';
import { mapGetters } from 'vuex';
export default {
  name: 'tenant',
  data() {
    return {
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        isSuperTenant: '0'
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], name: [
          {
            required: true,
            message: '请输入租户名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      users: [],
      total: null,
      listLoading: true,
      loading: false,
      currentId: undefined,
      currentUser: undefined,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogUserVisible: false,
      dialogStatus: '',
      tenantManager_btn_edit: false,
      tenantManager_btn_del: false,
      tenantManager_btn_add: false,
      tenantManager_btn_user: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.tenantManager_btn_edit = this.elements['tenantManager:btn_edit'];
    this.tenantManager_btn_del = this.elements['tenantManager:btn_del'];
    this.tenantManager_btn_add = this.elements['tenantManager:btn_add'];
    this.tenantManager_btn_user = this.elements['tenantManager:btn_user'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handlerUser(row) {
      this.dialogUserVisible = true;
      this.currentId = row.id;
      this.users = [];
      getOwner(row.id).then(response => {
        const user = response.data;
        if (response.data) {
          this.users.push(user);
          this.currentUser = row.owner
        }
      });
    },
    cancelUser() {
      this.dialogUserVisible = false;
    },
    confirmUser() {
      updateUser(this.currentId, { userId: this.currentUser }).then(() => {
        this.$notify({
          title: '成功',
          message: '授予成功',
          type: 'success',
          duration: 2000
        });
        this.dialogUserVisible = false;
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        pageUser({ name: query, username: query }).then(response => {
          this.loading = false;
          this.users = response.data.rows
        });
      } else {
        this.users = [];
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
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
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
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
          putObj(this.form.id, this.form).then(() => {
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
    resetTemp() {
      this.form = {
        code: undefined,
        name: undefined,
        description: undefined,
        isSuperTenant: '0'
      };
    }
  }
}
</script>
