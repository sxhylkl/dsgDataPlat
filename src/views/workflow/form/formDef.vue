<template>
  <div>
    <div>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="20">
          <div class="table">
            <div class="container">
              <div class="handle-box">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model="keyWords" placeholder="别名"
                              class="handle-input mr10"></el-input>
                    <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索
                    </el-button>
                  </el-col>
                </el-row>
                <el-row class="mt-20">
                  <el-col :span="24">
                    <el-button type="primary" @click="handleAdd"><i class="fa fa-plus"></i>
                      新增
                    </el-button>
                  </el-col>
                </el-row>

              </div>
              <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
                        style="width: 100%">
                <el-table-column width="220" align="center" label="别名">
                  <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="220" align="center" label="名称">
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="分组">
                  <template slot-scope="scope">
                    <span>{{scope.row.groupName}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="业务对象别名">
                  <template slot-scope="scope">
                    <span>{{scope.row.boKey}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="业务对象名称">
                  <template slot-scope="scope">
                    <span>{{scope.row.boName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="320">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                      <el-button type="primary" @click="handleEdit(scope.row)"><i
                        class="fa fa-edit"></i></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="权限" placement="bottom-end">
                      <el-button type="primary" @click="handleAuthority(scope.row)"><i
                        class="fa fa-user-times"></i></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="业务对象列表" placement="bottom-end">
                      <el-button type="primary" @click="handleTableObj(scope.row)"><i
                        class="fa fa-list"></i></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
                      <el-button type="primary" @click="handleDel(scope.row)"><i
                        class="fa fa-trash"></i>
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination" v-if="page.total">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page.currPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="query.limit"
                  layout="total, sizes, prev, pager, next"
                  :total="page.total">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增、编辑-->
    <el-dialog :title="title" :visible.sync="dialogDefVisible" width="85%" :show-close="false">
      <div class="dialog-cont">
        <edit-dialog ref="formEdit" v-if="dialogDefVisible" :treeData="treeData" :data="form"></edit-dialog>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDefVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!--权限配置-->
    <authority-dialog v-if="AuthorityDialogVisible"
                      :dialogState="AuthorityDialogVisible"
                      :authorityData="authorityData"
                      @savePermissionDialog="savePermissionDialog"
                      @cancelPermissionDialog="cancelPermissionDialog">

    </authority-dialog>
    <!--业务对象-->
    <table-obj-dialog v-if="tableObjDialogVisible" :row="currRow" :dialogVisible="tableObjDialogVisible"
                      @onTableObj="onTableObj"></table-obj-dialog>
  </div>
</template>

<script>
  import { validForm } from '@/utils/workflow/formValid.js'
  import EditDialog from './components/def/EditDialog.vue'
  import AuthorityDialog from './components/def/AuthorityDialog'
  import TableObjDialog from './components/def/TableObjDialog'
  import { handleParams } from '@/utils/workflow/common.js'
  import {
    delFormDef,
    getDefInfo,
    getDefList,
    getTree,
    saveFromDef,
    savePermission,
  } from '@/api/workflow/businessApproval/form/def.js'

  export default {
    name: 'formDef',
    components: {
      EditDialog,
      AuthorityDialog,
      TableObjDialog,
    },
    data () {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        keyWords: '',
        listLoading: false,
        list: [],
        page: {
          total: 0,
          page: 2,
          currPage: 1,
          pageSize: 10,
        },
        query: {
          limit: 10,
          offset: 0,
          order: 'asc',
        },
        title: '新增',
        dialogDefVisible: false,
        authorityData: undefined,
        AuthorityDialogVisible: false,
        tableObjDialogVisible: false,
        form: {
          key: '',
          name: '',
          groupName: '',
          boKey: '',
          boName: '',
          desc: '',
          groupId: '',
          html: '',
          isDeveloper: false,
          type: 'pc',
        },
        currRow: undefined,

      }
    },
    created () {
      this.getList(this.query)
      this.getTreeData({treeKey: 'bdfl'})
      this.$nextTick(function () {
        validForm()
      })
    },
    methods: {
      //获取数据
      getList (obj) {
        // 获取列表
        this.listLoading = true
        let params = handleParams(obj)
        getDefList(params).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.list = res.rows
          this.page.total = res.total
          this.page.page = res.page
          this.page.pageSize = res.pageSize
          this.listLoading = false
        })
      },
      getDefData (obj) {
        getDefInfo(obj).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }

          this.form = res.data
          // this.form.html=JSON.parse(this.form.html)
          this.dialogDefVisible = true
        })
      },
      // 获取树形菜单
      getTreeData (obj) {
        let params = handleParams(obj)
        getTree(params).then(res => {
          this.treeData = res
        })
      },
      //btn页事件
      // 全局搜索
      search () {
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'key_^VLK': this.keyWords,
        }
        this.getList(obj)
      },
      // 新增
      handleAdd () {
        this.initForm()
        this.title = '新增'
        this.dialogDefVisible = true

      },
      // 编辑
      handleEdit (row) {
        this.getDefData({id: row.id})
        this.title = '编辑'

      },
      // 业务对象列表
      handleTableObj (row) {
        console.log(row)
        this.currRow = row
        this.tableObjDialogVisible = true
      },

      // 配置权限
      handleAuthority (row) {
        this.authorityData = {objType: 'form', objVal: row.key, boKeys: row.boKey}
        this.AuthorityDialogVisible = true
      },
      // 删除
      handleDel(row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFormDef({ id: row.id }).then(res => {
            if (res.code !== '200') {
              this.$message.error(res.msg)
              return false
            }
            this.$message.success(res.msg)
            this.getList(this.query)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 保存
      save() {
        // 验证编辑、新增的form表单
        console.log(this.$refs.formEdit.formState)
        this.$refs.formEdit.validForm()
        if (!this.$refs.formEdit.formState) return
        saveFromDef(this.form).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.$message.success(res.msg)
          this.dialogDefVisible = false
          this.getList(this.query)
        })

      },
      // 子组件
      savePermissionDialog (data) {
        delete  data.busObjMapJson
        savePermission(data).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.getList(this.query)
          this.$message.success(res.msg)
          this.AuthorityDialogVisible = false
        })
      },
      cancelPermissionDialog () {
        this.AuthorityDialogVisible = false
      },
      // 其它事件
      // 树形菜单点击事件
      handleNodeClick (data) {
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'group_id_^VEQ': data.id,
        }
        this.getList(obj)
      },
      handleSizeChange (val) {
        this.query.limit = val
        this.getList(this.query)
      },
      handleCurrentChange (val) {
        this.query.offset = this.query.limit * (val - 1)
        this.page.currPage = val
        this.getList(this.query)
      },
      //业务对象列表的事件（取消）
      onTableObj () {
        this.tableObjDialogVisible = false
      },
      initForm () {
        this.form = {
          key: '',
          name: '',
          groupName: '',
          boKey: '',
          boName: '',
          desc: '',
          groupId: '',
          html: '',
          isDeveloper: false,
          type: 'pc',
        }
      },
    },

  }
</script>
<!--引入生成表单的样式-->
<style scoped>
  .dialog-cont {
    border: 1px solid #ddd;
    border-radius: 3px;
    transition: .2s;
  }
</style>
