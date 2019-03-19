<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" width="200" label="接口名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" width="200" label="访问url">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" width="120" label="接口状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '可用' ? 'success' : 'info'"
            close-transition>
            <span >{{scope.row.status}}</span>
          </el-tag>
          <!--<span>{{scope.row.status}}</span>-->
        </template>
      </el-table-column>
      <el-table-column  align="center" width="120" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.approvalstatus}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="接口类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="接入类型">
        <template slot-scope="scope">
          <span>{{scope.row.sourceType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="接口含义">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="访问参数">
        <template slot-scope="scope">
          <span>{{scope.row.params}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="返回数据格式">
        <template slot-scope="scope">
          <span>{{scope.row.resultType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="来源/维护类型">
        <template slot-scope="scope">
          <span>{{scope.row.maintainertype}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="服务名称">
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createdate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.updatedate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="存活状态">
        <template slot-scope="scope">
          <span>{{scope.row.survivalState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="访问测试时间">
        <template slot-scope="scope">
          <span>{{scope.row.accesstesttime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="是否生成">
        <template slot-scope="scope">
          <span>{{scope.row.whethertogenerate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="用户密码">
        <template slot-scope="scope">
          <span>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="400"  align="center" label="属性">
        <template slot-scope="scope">
          <span>{{scope.row.properties}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="列表信息">
        <template slot-scope="scope">
          <span>{{scope.row.columns}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  fixed="right" min-width="250">
        <template slot-scope="scope">
          <el-button  size="small" type="primary" @click="handleVerifyUrl(scope.row)">
            <!--<i class="el-icon-edit" />-->
            验证
          </el-button>
          <el-button size="small" type="success" @click="handleGetInfo(scope.row)">
            <!--<i class="el-icon-edit" />-->
            获取
          </el-button>
          <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
            <!--<i class="el-icon-edit" />-->
            维护
          </el-button>
         <!-- <el-button  size="small" type="danger" @click="handleDelete(scope.row)">
            &lt;!&ndash;<i class="el-icon-delete" />&ndash;&gt;
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
   <!-- <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.offset"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form"  ref="form" label-width="100px">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="访问url">
          <el-input  type="text" v-model="form.url" ></el-input>
        </el-form-item>
        <el-form-item label="访问的参数">
          <el-input type="text"  placeholder="请输入" v-model="form.params"> </el-input>
        </el-form-item>
        <el-form-item label="接口类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="接入类型" prop="sourcetype">
          <el-input v-model="form.sourcetype" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item  label="接口含义" placeholder="请输入" prop="description">
          <el-input type="text" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="返回数据格式" placeholder="请输入" prop="resultType">
          <el-input type="text" v-model="form.resulttype" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item  label="来源/维护类型" placeholder="请输入" prop="maintainerType">
          <el-input type="text" v-model="form.maintainertype"></el-input>
        </el-form-item>
        <el-form-item  label="服务名称" placeholder="请输入" prop="serviceName">
          <el-input type="text" v-model="form.servicename"></el-input>
        </el-form-item>
        <el-form-item  label="属性" placeholder="请输入" prop="properties">
          <el-input type="textarea" v-model="form.properties"></el-input>
        </el-form-item>
        <el-form-item  label="列表信息" placeholder="请输入" prop="columns">
          <el-input type="text" v-model="form.columns"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button  type="primary" @click="update()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  verifyObj,
  getObj,
  putObj
} from '@/api/auth/api/index';
export default {
  name: 'user',
  data() {
    return {
      form: {
        name: undefined,
        maintainertype: undefined,
        type: undefined,
        sourcetype: undefined,
        description: undefined,
        resulttype: undefined,
        url: undefined,
        params: undefined,
        servicename: undefined,
        properties: undefined,
        columns: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      idArr: ['f732bcc0-2b02-4340-a634-e4c2914dde58', '33f49471-6553-46b0-bd56-73de28204dd7', '1258aeb1-7c94-42ff-b106-85902b75d549'],
      listQuery: {
        parentId: 'f732bcc0-2b02-4340-a634-e4c2914dde58',
        limit: 25,
        offset: 0
      },
      dialogFormVisible: false,
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let data = []
      this.listLoading = true;
      this.idArr.forEach((value, index) => {
        this.listQuery.parentId = value
        page(this.listQuery)
          .then(response => {
            if (response.rows) {
              data = data.concat(response.rows)
            }
            if (index >= 2) {
              this.list = data
              this.listLoading = false;
            }
          })
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val - 1;
      this.getList();
    },
    handleVerifyUrl(row) {
      if (!row.url) {
        this.$notify({
          title: '失败',
          message: 'url不能为空',
          type: 'error',
          duration: 2000
        });
        return
      }
      const data = { id: row.id, url: row.url }
      verifyObj(data).then(() => {
        // this.getList()
        row.status = '可用'
        this.$notify({
          title: '成功',
          message: '验证通过',
          type: 'success',
          duration: 2000
        });
      })
    },
    handleGetInfo(row) {
      console.log(row)
      if (row.status === '可用') {
        this.$notify({
          title: '成功',
          message: '获取成功',
          type: 'success',
          duration: 2000
        });
      } else {
        this.$notify({
          title: '失败',
          message: '获取失败',
          type: 'error',
          duration: 2000
        });
      }
      if (row) {
        return
      }
      getObj(row).then(res => {
        console.log(res)
      })
    },
    handleUpdate(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true;
      this.dialogStatus = 'update';
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update() {
      console.log(this.form)
      // const data = JSON.stringify(this.form)
      putObj(this.form).then(() => {
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
    resetTemp() {
      this.form = {
        name: undefined,
        maintainertype: undefined,
        type: undefined,
        sourcetype: undefined,
        description: undefined,
        resulttype: undefined,
        url: undefined,
        params: undefined,
        servicename: undefined,
        properties: undefined,
        columns: undefined
      };
    }
  }
}
</script>
