<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.clientId">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="oauthClientDetailsManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
        type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="client_id" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.clientId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="client_secret">
        <template slot-scope="scope">
          <span>{{scope.row.clientSecret}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="说明">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="作用域">
        <template slot-scope="scope">
          <span>{{scope.row.scope}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="重定向地址">
        <template slot-scope="scope">
          <span>{{scope.row.webServerRedirectUri}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="token失效时长">
        <template slot-scope="scope">
          <span>{{scope.row.accessTokenValidity}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="token刷新时长">
        <template slot-scope="scope">
          <span>{{scope.row.refreshTokenValidity}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="自动授权">
        <template slot-scope="scope">
          <span>{{scope.row.autoapprove}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="oauthClientDetailsManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="oauthClientDetailsManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
      <!--<el-form :model="form" ref="form" label-width="100px">-->
        <!-- <el-form-item label="访问资源ID" prop="resourceIds">
      <el-input v-model="form.resourceIds" placeholder="请输入可访问OAuth资源"></el-input>
    </el-form-item> -->
        <el-form-item label="ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入可访问OAuth的客户端ID"></el-input>
        </el-form-item>
        <el-form-item label="Secret" prop="clientSecret">
          <el-input v-model="form.clientSecret" placeholder="请输入客户端密钥"></el-input>
        </el-form-item>
        <el-form-item label="Scope" prop="scope">
          <el-input v-model="form.scope" value="read" placeholder="请输入客户端访问作用域，一般为read"></el-input>
        </el-form-item>
        <el-form-item label="授权方式" prop="authorizedGrantTypes">
          <el-input v-model="form.authorizedGrantTypes" placeholder="请输入客户端获取token的授权方式"></el-input>
        </el-form-item>
        <el-form-item label="重定向地址" prop="webServerRedirectUri">
          <el-input v-model="form.webServerRedirectUri" placeholder="请输入登录成功后重定向地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="" prop="authorities">
      <el-input v-model="form.authorities" placeholder="请输入客户端权限组"></el-input>
    </el-form-item> -->
        <el-form-item label="访问时长" prop="accessTokenValidity">
          <el-input-number v-model="form.accessTokenValidity" value="14400" placeholder="请输入访问token的有效时长"></el-input-number>
        </el-form-item>
        <el-form-item label="刷新时长" prop="refreshTokenValidity">
          <el-input-number v-model="form.refreshTokenValidity" value="2592000" placeholder="请输入刷新token的有效时长"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="" prop="additionalInformation">
      <el-input v-model="form.additionalInformation" placeholder="请输入"></el-input>
    </el-form-item> -->
        <el-form-item label="登录自动授权" prop="autoapprove">
          <el-switch v-model="form.autoapprove" active-text="是" active-value="true" inactive-value="false" inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" value="1" placeholder="请输入描述"></el-input>
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
} from '@/api/auth/oauthClientDetails/index';
import { mapGetters } from 'vuex';
export default {
  name: 'oauthClientDetails',
  data() {
    return {
      form: {
        clientId: undefined,
        clientSecret: undefined,
        scope: 'read',
        webServerRedirectUri: undefined,
        accessTokenValidity: undefined,
        refreshTokenValidity: undefined,
        additionalInformation: '{}',
        autoapprove: undefined
      },
      rules: {
        clientId: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], clientSecret: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], scope: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ], authorizedGrantTypes: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 3,
            message: '长度 > 3  个字符',
            trigger: 'blur'
          }
        ], webServerRedirectUri: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 3,
            message: '长度 > 3  个字符',
            trigger: 'blur'
          }
        ], accessTokenValidity: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ], refreshTokenValidity: [
          {
            required: true,
            message: '请输入',
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
        clientId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      oauthClientDetailsManager_btn_edit: false,
      oauthClientDetailsManager_btn_del: false,
      oauthClientDetailsManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.oauthClientDetailsManager_btn_edit = this.elements['oauthClientDetailsManager:btn_edit'];
    this.oauthClientDetailsManager_btn_del = this.elements['oauthClientDetailsManager:btn_del'];
    this.oauthClientDetailsManager_btn_add = this.elements['oauthClientDetailsManager:btn_add'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.list = [];
      this.total = 0;
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
      getObj(row.clientId)
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.clientId)
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
          putObj(this.form.clientId, this.form).then(() => {
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
      };
    }
  }
}
</script>
