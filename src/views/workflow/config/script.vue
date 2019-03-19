<template>
  <!--常用脚本-->
  <div>
    <!-- 列表-->
    <div class="table">
      <div class="container">
        <div class="handle-box">
          <el-row>
            <el-col :span="24">
              <el-input v-model="name" placeholder="名字" class="handle-input mr10"></el-input>
              <el-input v-model="category" placeholder="脚本分类" class="handle-input mr10"></el-input>
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
        <el-table :data="list"
                  v-loading="listLoading"
                  border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="脚本分类">
            <template slot-scope="scope">
              <span>{{scope.row.category}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              <span>{{scope.row.memo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                <el-button type="primary" @click="handleEdit(scope.row)">
                  <i class="fa fa-edit"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item"
                          effect="dark"
                          content="删除"
                          placement="bottom-end">
                <el-button type="primary" @click="handleDel(scope.row)">
                  <i class="fa fa-trash"></i>
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
    <!--新增、编辑弹窗-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="脚本分类" :label-width="formLabelWidth">
          <el-input v-model="form.category"></el-input>
        </el-form-item>
        <el-form-item label="脚本" :label-width="formLabelWidth" prop="script">
          <code-mirror :cont="form.script" :disable="state"
                       @changeCodeMirror="changeCodeMirror"></code-mirror>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="memo">
          <el-input type="textarea" v-model="form.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="preViewScript">脚本测试</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import CodeMirror from '@/components/codemirror/index.vue'
  import { handleParams } from '@/utils/workflow/common'
  import {
    executeScript,
    getScriptDetail,
    getScriptList,
    remove,
    save
  } from '@/api/workflow/businessApproval/config/script.js'

  export default {
    name: 'index',
    components: {
      CodeMirror
    },
    data() {
      return {
        name: '',
        category: '',
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
        editor: null,
        title: '新增',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        state: false,
        form: {
          category: '',
          memo: '',
          name: '',
          script: ''
        },
        rules: {
          name: [{ required: true, message: '必填', trigger: 'blur' }],
          script: [{ required: true, message: '必填', trigger: 'blur' }],
          memo: [{ required: true, message: '必填', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getList(this.query)
    },
    methods: {
      // 获取列表数据
      getList(obj) {
        this.listLoading = true
        const params = handleParams(obj)
        getScriptList(params).then(res => {
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
      // 新增
      handleAdd() {
        this.initForm()
        this.title = '新增'
        this.dialogFormVisible = true
        this.$nextTick(function() {
          if (this.editor) {
            this.editor.setValue(this.form.script)
          }
        })
      },
      // 编辑
      handleEdit(row) {
        getScriptDetail({ id: row.id }).then(res => {
          if (res.code !== '200') {
            this.$message.error(res.msg)
            return false
          }
          this.form = res.data
          this.dialogFormVisible = true
          this.$nextTick(function() {
            if (this.editor) {
              this.editor.setValue(this.form.script)
            }
          })
        })
      },
      // 删除
      handleDel(row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove({ id: row.id }).then(res => {
            if (res.code !== '200') {
              this.$message.error(res.msg)
              return
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
      // 保存
      save() {
        this.form.script = this.editor.getValue()
        this.$refs['form'].validate(valid => {
          if (valid) {
            save(this.form).then(res => {
              if (res.code !== '200') {
                this.$message.error(res.msg)
                return false
              }
              this.$message.success(res.msg)
              this.getList(this.query)
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 脚本测试
      preViewScript() {
        const script = this.editor.getValue()
        if (!script) {
          this.$message.error('脚本不能为空')
          return false
        }
        const params = handleParams({ script: script, key: this.form.name })
        executeScript(params).then(res => {
          if (res.success) {
            this.$message.success('测试通过' + (res.val ? res.val : ''))
            return false
          }
          this.$message.error('测试不通过' + res.val)
        })
      },
      // 获取代码编译器的实例
      changeCodeMirror(data) {
        this.editor = data
      },
      // 全局搜索
      search() {
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'name_^VLK': this.name,
          'CATEGORY_^VLK': this.category
        }
        this.getList(obj)
      },
      // pageSize变化
      handleSizeChange(val) {
        // pageSize
        this.query.limit = val
        this.getList(this.query)
      },
      // 翻页
      handleCurrentChange(val) {
        this.query.offset = this.query.limit * (val - 1)
        this.page.currPage = val
        this.getList(this.query)
      },
      // 初始化form
      initForm() {
        this.form = {
          category: '',
          memo: '',
          name: '',
          script: ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
