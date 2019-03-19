<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" width="160" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.stdname}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" width="300" label="链接">
        <template slot-scope="scope">
          <span>{{scope.row.linkurl}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" width="300" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.stdstatus === '有效' ? 'success' : 'info'"
            close-transition>
            <span >{{scope.row.stdstatus}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column  align="center" width="120" label="权限">
        <template slot-scope="scope">
          <span>{{scope.row.auth}}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column  align="center" width="200" label="备用1">
        <template slot-scope="scope">
          <span>{{scope.row.remarke1}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="备用2">
        <template slot-scope="scope">
          <span>{{scope.row.remarke2}}</span>
        </template>
      </el-table-column>-->
      <el-table-column width="300" align="center" label="当前用户">
        <template slot-scope="scope">
          <span>{{scope.row.curruser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  fixed="right" min-width="250">
        <template slot-scope="scope">
          <el-button  size="small" type="primary" @click="handleState(scope.row)">
            <!--<i class="el-icon-delete" />-->
            状态变更
          </el-button>
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">
            <!--<i class="el-icon-edit" />-->
            编辑
          </el-button>
          <el-button  size="small" type="danger" @click="handleDelete(scope.row)">
            <!--<i class="el-icon-delete" />-->
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.offset"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form"  ref="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.stdname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="连接">
          <el-input  type="text" v-model="form.linkurl" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="状态">
          <el-select v-model="form.stdstatus" placeholder="请选择">
            <el-option label="无效" value="无效"></el-option>
            <el-option label="有效" value="有效"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="权限" prop="auth">
          <el-input v-model="form.auth" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="备用1" prop="remarke1" placeholder="请输入">
          <el-input v-model="form.remarke1" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="备用2" placeholder="请输入" prop="remarke2">
          <el-input type="text" v-model="form.remarke2"></el-input>
        </el-form-item>
        <el-form-item  label="当前用户" placeholder="请输入" prop="curruser">
          <el-input type="text" v-model="form.curruser" placeholder="请输入"></el-input>
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
  standerList,
  getObj,
  standerAdd,
  standerDel,
  standerUp,
  standerState
} from '@/api/auth/api/index';
export default {
  name: 'user',
  data() {
    return {
      form: {
        stdname: undefined,
        linkurl: undefined,
        stdstatus: '无效',
        auth: undefined,
        remarke1: undefined,
        remarke2: undefined,
        curruser: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        parentId: '25f10cd9-0e23-4b2d-9c36-0695ccfaa00e',
        limit: 25,
        offset: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      standerList()
        .then(res => {
          this.list = res;
          this.total = res.length
          this.listLoading = false;
        })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val - 1;
      this.getList();
    },
    handleState(row) {
      console.log(row)
      let state = ''
      if (row.stdstatus === '有效') {
        state = '无效'
      } else {
        state = '有效'
      }
      const data = { id: row.id, status: state }
      console.log(data)
      standerState(data).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '状态更改成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    handleGetInfo(row) {
      console.log(row)
      if (row) {
        return
      }
      getObj(row).then(res => {
        console.log(res)
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        standerDel(row).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          this.getList();
          // const index = this.list.indexOf(row);
          // this.list.splice(index, 1);
        });
      });
    },
    handleUpdate(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true;
      this.dialogStatus = 'update';
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    cancel(formName) {
      console.log(this.list)
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update() {
      console.log(this.form)
      // const data = JSON.stringify(this.form)
      standerUp(this.form).then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    create() {
      console.log(this.form)
      standerAdd(this.form)
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
    },
    resetTemp() {
      this.form = {
        stdname: undefined,
        linkurl: undefined,
        stdstatus: '无效',
        auth: undefined,
        remarke1: undefined,
        remarke2: undefined,
        curruser: undefined
      };
    }
  }
}
</script>
