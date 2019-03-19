<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-row>
          <el-col :span="24">
            <el-input v-model="keyWords" placeholder="标题" class="handle-input mr10"></el-input>
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
      <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column width="320" align="center" label="标题">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==='single'" type="primary">
              <span>个人</span>
            </el-tag>
            <el-tag v-else-if="scope.row.type==='share'" type="success">
              <span>共享</span>
            </el-tag>
            <el-tag v-else-if="scope.row.type==='ilka'" type="success">
              <span>共同</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="所属人">
          <template slot-scope="scope">
            <span>{{scope.row.ownerName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="320" align="center" label="参与者">
          <template slot-scope="scope">
            <span>{{scope.row.participantNames}}</span>
          </template>
        </el-table-column>
        <el-table-column width="320" align="center" label="任务打开方式">
          <template slot-scope="scope">
            <span>{{scope.row.openType}}</span>
          </template>
        </el-table-column>
        <el-table-column width="320" align="center" label="实际开始日期">
          <template slot-scope="scope">
            <span>{{scope.row.actualStartTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="320" align="center" label="完成时间">
          <template slot-scope="scope">
            <span>{{scope.row.completeTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="320" align="center" label="提交人">
          <template slot-scope="scope">
            <span>{{scope.row.submitNamer}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center" label="锁定">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isLock==='1'" type="primary">
              <span>是</span>
            </el-tag>
            <el-tag v-else-if="scope.row.isLock==='0'" type="success">
              <span>否</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="300" align="center" sortable label="任务创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
              <el-button type="primary" @click="handleEdit(scope.row)"><i
                class="fa fa-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
              <el-button type="primary" @click="handleDel(scope.row)"><i class="fa fa-trash"></i>
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px" ref="form" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input class="self-input" v-model="form.title"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="个人待办" value="single"></el-option>
            <el-option label="共同完成任务待办" value="share"></el-option>
            <el-option label="每个人均需要完成的待办任务" value="ilka"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type!=='single'" label="参与者">
          <el-input
            class="self-input"
            placeholder="请选择参与者"
            v-model="form.participantNames">
          </el-input>
          <el-tooltip class="item" effect="dark" content="查询用户" placement="right-end">
            <el-button type="primary" icon="el-icon-search"
                       @click="queryUser"></el-button>
          </el-tooltip>

        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            class="self-input"
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            class="self-input"
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际开始日期" prop="actualStartTime">
          <el-date-picker
            class="self-input"
            v-model="form.actualStartTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间" prop="completeTime">
          <el-date-picker
            class="self-input"
            v-model="form.completeTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="锁定">
          <el-switch
            v-model="form.isLock"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="进度" prop="endTime">
          <div class="block">
            <el-slider v-model="form.rateProgress"></el-slider>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog
        width="50%"
        title="用户查询"
        :visible.sync="dialogTableVisible"
        append-to-body>
        <div class="table">
          <div class="container">
            <div class="handle-box">
              <el-input v-model="user.keyWords" :loading="user.listLoading" placeholder="姓名"
                        class="handle-input mr10"></el-input>
              <el-button type="primary" icon="search" @click="search"><i class="fa fa-search"></i>搜索</el-button>
            </div>
            <el-table :data="userList" ref="multipleTable" tooltip-effect="dark" style="width: 100%"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="姓名" width="120">
                <template slot-scope="scope">{{ scope.row.fullname_ }}</template>
              </el-table-column>
              <el-table-column prop="account_" label="账号"></el-table-column>
              <el-table-column prop="mobile_" label="手机号" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination" v-if="user.page.total">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="user.page.currPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="user.query.limit"
                layout="total, sizes, prev, pager, next"
                :total="user.page.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSelectUser">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAgenda">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { handleParams } from '@/utils/workflow/common.js'
  import { delAgenda, getAgendaList, getUserList, handleAgenda } from '@/api/workflow/personOffice/event/agenda.js'

  export default {
    name: 'agendaManager',
    data () {
      let validateTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('日期时间不能为空'))
        } else {
          if (this.form.endTime - this.form.startTime < 0) {
            callback(new Error('结束日期不能小于开始日期'))
          }
          callback()
        }
      }
      return {
        keyWords: '',
        list: [],
        listLoading: false,
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
        userList: [],
        user: {
          keyWords: '',
          listLoading: false,
          multipleSelection: [],
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
        },
        form: {
          actualStartTime: undefined,
          completeTime: undefined,
          endTime: undefined,
          isLock: undefined,
          rateProgress: undefined,
          remark: undefined,
          startTime: undefined,
          title: undefined,
          type: 'single',
        },
        title: '新增日程',
        dialogFormVisible: false,
        dialogTableVisible: false,
        rules: {
          title: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
          startTime: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
          endTime: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: validateTime, trigger: 'blur'},
          ],
        },

      }
    },
    created () {
      this.getList(this.query)
    },
    methods: {
      getList (obj) {
        this.listLoading = true
        let params = handleParams(obj)
        getAgendaList(params).then(res => {
          this.list = res.rows
          this.page.total = res.total
          this.page.page = res.page
          this.page.pageSize = res.pageSize
          this.listLoading = false
        })
      },
      handleAdd () {
        this.dialogFormVisible = true
      },
      handleEdit (row) {
        this.dialogFormVisible = true
        this.form = {
          actualStartTime: new Date(row.actualStartTime),
          createBy: row.createBy,
          createTime: new Date(row.actualStartTime),
          endTime: new Date(row.endTime),
          id: row.id,
          owner: row.owner,
          ownerName: row.ownerName,
          participantNames: row.participantNames,
          rateProgress: row.rateProgress,
          remark: row.remark,
          scheduleParticipantList: row.scheduleParticipantList,
          startTime: new Date(row.startTime),
          title: row.title,
          type: row.type,
          updateBy: row.updateBy,
          updateTime: new Date(row.updateTime),
        }
      },
      handleDel(row) {
        this.$confirm('此操作将永久删除该日程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAgenda({ id: row.id }).then(res => {
            if (res.code !== '200') {
              this.hitMsg(res.mdg, 'error')
              return false
            }
            this.dialogFormVisible = false
            this.getList(this.query)
            this.$message({
              type: 'success',
              message: res.msg,
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      },
      handleAgenda () { //日程的添加、编辑、完成
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let obj = this.form
            handleAgenda(obj).then(res => {
              if (res.code !== '200') {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
                return false
              }
              this.dialogFormVisible = false
              this.getList(this.query)
              this.$message({
                message: res.msg,
                type: 'success',
              })
            })
          }
        })
      },
      queryUser () {
        this.dialogTableVisible = true
        this.user.listLoading = true
        this.getUserList(this.user.query)
      },
      getUserList (obj) { //获取用户列表
        this.user.listLoading = true
        let params = handleParams(obj)
        getUserList(params).then(res => {
          if (res.code !== '200') {
            this.hitMsg(res.msg, 'error')
            return false
          }
          this.userList = res.rows
          this.user.page.total = res.total
          this.user.page.page = res.page
          this.user.page.pageSize = res.pageSize
          this.user.listLoading = false
          this.toggleSelection()
        })
      },
      handleSelectUser () { //确定选择用户
        let user = []
        this.user.multipleSelection.forEach((row, index) => {
          user.push(row.fullname_)
        })
        this.form.participantNames = user.join(',')
        this.dialogTableVisible = false
      },
      handleSelectionChange (val) {
        this.user.multipleSelection = val
      },
      toggleSelection () { //恢复选中的用户
        this.$nextTick(function () {
          if (this.form.participantNames) {
            let user = this.form.participantNames.split(',')
            user.forEach(name => {
              this.userList.forEach((row, index) => {
                if (row.fullname_ === name) {
                  this.$refs.multipleTable.toggleRowSelection(this.userList[index])
                }
              })

            })
          }

        })
      },
      initForm () {
        this.from = {
          actualStartTime: undefined,
          completeTime: undefined,
          endTime: undefined,
          isLock: undefined,
          rateProgress: undefined,
          remark: undefined,
          startTime: undefined,
          title: undefined,
          type: 'single',
        }
      },
      search () {
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'title^VLK': this.keyWords,
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
    },

  }
</script>

<style scoped>

</style>
