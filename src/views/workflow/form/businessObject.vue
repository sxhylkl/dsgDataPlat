<template>
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
                  <el-input v-model="keyWords" placeholder="别名" class="handle-input mr10"></el-input>
                  <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
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
              <el-table-column width="220" align="center" label="名字">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column width="200" align="center" label="描述">
                <template slot-scope="scope">
                  <span>{{scope.row.desc}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                    <el-button type="primary" @click="handleEdit(scope.row)"><i
                      class="fa fa-edit"></i></el-button>
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
    <obj-dialog v-if="dialogObjVisible" :data="form" :treeData="treeData" :title="title"
                :dialogObjVisible="dialogObjVisible" @save="save" @cancel="cancel"></obj-dialog>
  </div>
</template>

<script>
  import ObjDialog from './components/ObjDialog'
  import { handleParams } from '@/utils/workflow/common.js'
  import { getTree } from '@/api/workflow/businessApproval/form/table.js'
  import { delObj, getObjectInfo, getObjectList, saveObj } from '@/api/workflow/businessApproval/form/object.js'

  export default {
    name: 'businessObject',
    components: {
      ObjDialog
    },
    data() {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        keyWords: '',
        listLoading: false,
        list: [],
        page: {
          total: 0,
          page: 2,
          currPage: 1,
          pageSize: 10
        },
        query: {
          limit: 10,
          offset: 0,
          order: 'asc'
        },
        title: '新增',
        dialogObjVisible: false,
        form: {
          desc: '',
          groupId: '',
          groupName: '',
          key: '',
          name: '',
          persistenceType: '',
          relation: {
            children: [],
            tableComment: '',
            tableKey: '',
            type: 'main'
          }
        }
      }
    },
    created() {
      this.getList(this.query)
      this.getTreeData({ treeKey: 'ywdxfl' })
    },
    methods: {
      // 获取数据
      getList(obj) {
        // 获取列表
        this.listLoading = true
        const params = handleParams(obj)
        getObjectList(params).then(res => {
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
      getTreeData(obj) {
        // 获取树形菜单
        const params = handleParams(obj)
        getTree(params).then(res => {
          this.treeData = res
        })
      },
      // btn页事件
      search() {
        // 全局搜索
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'key_^VLK': this.keyWords
        }
        this.getList(obj)
      },
      handleAdd() {
        // 新增
        this.title = '新增'
        this.dialogObjVisible = true
      },
      handleEdit(row) {
        // 编辑
        getObjectInfo({ id: row.id }).then(res => {
          console.log(res)
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.form = res.data
          this.title = '编辑'
          this.dialogObjVisible = true
        })
      },
      handleDel(row) {
        // 删除
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj({ id: row.id }).then(res => {
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
          })
        })
      },
      save() {
        console.log('最终的结果')
        console.log(this.form)
        if (this.form.hasOwnProperty('relationJson')) {
          delete this.form.relationJson
        }
        saveObj(this.form).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.getList(this.query)
          this.dialogObjVisible = false
          this.initForm()
          this.$message.success(res.msg)
        })
      },
      cancel() {
        this.dialogObjVisible = false
        this.initForm()
      },
      // 其它事件
      handleNodeClick(data) {
        // 树形菜单点击事件
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'group_id_^VEQ': data.id
        }
        this.getList(obj)
      },
      handleSizeChange(val) {
        this.query.limit = val
        this.getList(this.query)
      },
      handleCurrentChange(val) {
        this.query.offset = this.query.limit * (val - 1)
        this.page.currPage = val
        this.getList(this.query)
      },
      initForm() {
        this.form = {
          desc: '',
          groupId: '',
          groupName: '',
          key: '',
          name: '',
          persistenceType: '',
          relation: {
            children: [],
            tableComment: '',
            tableKey: '',
            type: ''
          }
        }
      }
    }

  }
</script>

<style scoped>

</style>
