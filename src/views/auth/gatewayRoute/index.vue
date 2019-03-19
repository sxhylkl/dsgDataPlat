<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="映射服务" v-model="listQuery.serviceId">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="gatewayRouteManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary"
        icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="映射路劲">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="映射服务">
        <template slot-scope="scope">
          <span>{{scope.row.serviceId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="映射外连接">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="允许重试">
         <template slot-scope="scope">
          <el-tag :type="scope.row.retryable ? 'primary' : 'warning'" close-transition>
            <span v-if="scope.row.retryable">是</span>
            <span v-else>否</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="启用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled ? 'primary' : 'warning'" close-transition>
            <span v-if="scope.row.enabled">是</span>
            <span v-else>否</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="忽略前缀">
        <template slot-scope="scope">
          <el-tag :type="scope.row.stripPrefix ? 'primary' : 'warning'" close-transition>
            <span v-if="scope.row.stripPrefix">是</span>
            <span v-else>否</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.crtUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人ID">
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
      <el-table-column width="200px" align="center" label="最后更新人ID">
        <template slot-scope="scope">
          <span>{{scope.row.updUserId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="gatewayRouteManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="gatewayRouteManager_btn_del&&scope.row.enabled" size="small" type="danger" @click="handleDelete(scope.row)">禁用
          </el-button>
          <el-button v-if="!scope.row.enabled"  size="small" type="primary" @click="handleStart(scope.row)">启用</el-button>
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
         <el-form-item label="ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入路由ID" :disabled="editState"></el-input>
        </el-form-item>
        <el-form-item label="映射路劲" prop="path">
          <el-input v-model="form.path" placeholder="请输入映射路劲"></el-input>
        </el-form-item>
        <el-form-item label="映射服务" prop="serviceId">
          <el-input v-model="form.serviceId" placeholder="请输入映射服务"></el-input>
        </el-form-item>
        <el-form-item label="映射外连接">
          <el-input v-model="form.url" placeholder="请输入映射外连接"></el-input>
        </el-form-item>
        <el-form-item label="允许重试" prop="retryable">
          <el-switch v-model="form.retryable" active-text="是" inactive-text="否" >
          </el-switch>
        </el-form-item>
        <el-form-item label="启用" prop="enabled">
          <el-switch v-model="form.enabled" active-text="是" inactive-text="否" >
          </el-switch>
        </el-form-item>
        <el-form-item label="忽略前缀" prop="stripPrefix">
          <el-switch v-model="form.stripPrefix" active-text="是" inactive-text="否" >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
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
  putObj
} from '@/api/auth/gatewayRoute/index';
import { mapGetters } from 'vuex';
export default {
  name: 'gatewayRoute',
  data() {
    return {
      editState: false,
      form: {
        path: undefined,
        serviceId: undefined,
        url: undefined,
        retryable: false,
        enabled: true,
        stripPrefix: true
      },
      rules: {
        id: [
          {
            required: true,
            message: '请输入映射路劲',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], path: [
          {
            required: true,
            message: '请输入映射路劲',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], serviceId: [
          {
            required: true,
            message: '请输入映射服务',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], url: [
          {
            required: true,
            message: '请输入映射外连接',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], retryable: [
          {
            required: true,
            message: '请输入是否重试',
            trigger: 'blur'
          }
        ], enabled: [
          {
            required: true,
            message: '请输入是否启用',
            trigger: 'blur'
          }
        ], stripPrefix: [
          {
            required: true,
            message: '请输入是否忽略前缀',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        serviceId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      gatewayRouteManager_btn_edit: false,
      gatewayRouteManager_btn_del: false,
      gatewayRouteManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.gatewayRouteManager_btn_edit = this.elements['gatewayRouteManager:btn_edit'];
    this.gatewayRouteManager_btn_del = this.elements['gatewayRouteManager:btn_del'];
    this.gatewayRouteManager_btn_add = this.elements['gatewayRouteManager:btn_add'];
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
      this.editState = false
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
          this.editState = true
        });
    },
    handleDelete(row) {
      this.$confirm('此操作将导致路由无法映射, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '禁用成功',
                type: 'success',
                duration: 2000
              });
              // const index = this.list.indexOf(row);
              // this.list.splice(index, 1);
              this.getList();
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
    /*
    * 启用
    * 复用编辑更新的接口,改变启用的参数
    */
    handleStart(row) {
      row.enabled = true
      putObj(row.id, row).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '启用成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    resetTemp() {
      this.form = {
        path: undefined,
        serviceId: undefined,
        url: undefined,
        retryable: false,
        enabled: true,
        stripPrefix: true
      };
    }
  }
}
</script>
