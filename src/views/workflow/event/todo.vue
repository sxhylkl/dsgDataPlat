<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="keyWords" placeholder="任务标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search"><i class="fa fa-search"></i>搜索</el-button>
            </div>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column width="320" align="center" label="任务标题">
                    <template slot-scope="scope">
                        <span>{{scope.row.subject}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="任务名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==='NORMAL'" type="primary">
                            <span>普通</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='SIGN'" type="info">
                            <span>会签</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='SIGN_SOURCE'" type="info">
                            <span>会签_父</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='TRANSFORMING'" type="warning">
                            <span>事项</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='DELIVERTO'" type="warning">
                            <span>z转办</span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==='NORMAL'" type="primary">
                            <span>普通</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='SUSPEND'" type="info">
                            <span>挂起</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='LOCK'" type="warning">
                            <span>锁定</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='BACK'" type="warning">
                            <span>驳回</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status==='DESIGNATE'" type="info">
                            <span>指派</span>
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
                        <el-tooltip class="item" effect="dark" content="办理" placement="bottom-end">
                            <el-button type="primary" @click="handleManage(scope.row)"><i
                                class="fa fa-check-square-o"></i></el-button>
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
        <!-- 处理弹出框-同意和驳回 -->
        <el-dialog title="处理" :visible.sync="dialogVisible" width="65%">
            <div class="dialog-cont">
                <div class="btn-list dialog-btn">
                    <el-button type="primary" @click="handleAgree"><i class="fa fa-check-square-o"></i>同意</el-button>
                    <el-button type="primary" @click="handleSave"><i class="fa fa-save"></i>保存</el-button>
                    <el-button type="danger" @click="handleReject"><i class="fa fa-lastfm"></i>驳回</el-button>
                    <el-button type="primary" @click="handleApproval"><i class="fa fa-navicon"></i>审批历史</el-button>
                    <el-button type="primary" @click="handleFlowImage"><i class="fa fa-image"></i>流程图</el-button>
                    <el-button type="primary" @click="handlePrint"><i class="fa fa-print"></i>打印</el-button>
                </div>
                <div id="formData" v-if="formData" v-html="formData.form.formHtml"></div>
            </div>
            <el-dialog width="50%" :title="innerForm.title" :visible.sync="innerVisible" append-to-body>
                <el-form :model="innerForm">
                    <el-form-item label="备注意见" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="innerForm.cont"></el-input>
                    </el-form-item>
                    <el-form-item label="常用语" :label-width="formLabelWidth">
                        <div class="useful">
                            <span v-for="item in innerForm.useful" :key="item" @click="getUseful(item)">{{item}}</span>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click='doAction'>确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog width="50%" title="审批历史" :visible.sync="dialogTableVisible" append-to-body>
                <el-table :data="approvalHistory">
                    <el-table-column property="taskName" label="任务名称" width="150"></el-table-column>
                    <el-table-column property="createTime" label="任务创建时间" width="200"></el-table-column>
                    <el-table-column property="approveTime" label="处理时间"></el-table-column>
                    <el-table-column property="assignInfo" label="待执行人"></el-table-column>
                    <el-table-column property="approverName" label="执行人"></el-table-column>
                    <el-table-column property="status" label="处理状态"></el-table-column>
                    <el-table-column property="opinion" label="备注/意见"></el-table-column>
                </el-table>
            </el-dialog>
            <el-dialog width="50%" title="流程图" :visible.sync="dialogImageVisible" append-to-body>
                <img :src="flowImage" alt="流程图">
            </el-dialog>
        </el-dialog>
        <!--处理弹出框-审批历史-->
    </div>
</template>

<script>
    import { handleParams } from '@/utils/workflow/common.js'
    import {
      doAction,
      getApprovalHistory,
      getFlowImage,
      getTaskDetail,
      getTodoTask
    } from '@/api/workflow/personOffice/event/flow.js'

    export default {
      name: 'todo',
      data() {
        return {
          listLoading: false,
          list: null,
          keyWords: '',
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
          formLabelWidth: '80px',
          dialogVisible: false,
          dialogTableVisible: false,
          dialogImageVisible: false,
          innerVisible: false,
          formData: null,
          approvalHistory: null,
          innerForm: {
            title: '同意',
            cont: '',
            useful: ['同意', '请注意，情况复杂！', '情况紧急，请尽快处理！', '驳回']
          },
          flowImage: ''
        }
      },
      created() {
        this.getList(this.query)
      },
      methods: {
        getList(obj) {
          this.listLoading = true
          const params = handleParams(obj)
          getTodoTask(params).then(res => {
            this.list = res.rows
            this.page.total = res.total
            this.page.page = res.page
            this.page.pageSize = res.pageSize
            this.listLoading = false
          })
        },
        search() {
          const obj = {
            limit: this.query.limit,
            offset: this.query.offset,
            order: this.query.order,
            'subject_^VLK': this.keyWords
          }
          this.getList(obj)
        },
        error(msg) {
          this.$message({
            message: msg,
            type: 'error'
          })
        },
        handleManage(row) {
          getTaskDetail({ taskId: row.id }).then(res => {
            if (res.code !== '200') {
              this.error(res.msg)
              return false
            }
            this.formData = res.data
            this.dialogVisible = true
            console.log(this.formData)
          })
        },
        handleAgree() {
          this.innerForm.title = '同意'
          this.innerForm.action = 'agree'
          this.innerVisible = true
        },
        handleSave() {
          this.innerForm.title = '保存'
          this.innerForm.action = 'save'
          this.doAction()
        },
        handleReject() {
          this.innerForm.title = '驳回'
          this.innerForm.action = 'reject'
          this.innerVisible = true
        },
        handleApproval() {
          const obj = { instId: this.formData.task.instId }
          getApprovalHistory(obj).then(res => {
            if (res.code !== '200') {
              this.error(res.msg)
              return false
            }
            this.approvalHistory = res.data
            this.dialogTableVisible = true
          })
        },
        handleFlowImage() {
          this.dialogImageVisible = true
          const imgUrl = getFlowImage()
          this.flowImage = `${imgUrl}?instId=${this.formData.task.instId}&defId=${this.formData.defId}`
        },
        handlePrint(e) {
          const subOutputRankPrint = document.getElementById('formData')
          console.log(subOutputRankPrint.innerHTML)
          const newContent = subOutputRankPrint.innerHTML
          const oldContent = document.body.innerHTML
          document.body.innerHTML = newContent
          window.print()
          window.location.reload()
          document.body.innerHTML = oldContent
          return false
        },
        doAction() {
          const obj = {
            action: this.innerForm.action,
            data: this.formData.data,
            formType: this.formData.form.type,
            instanceId: this.formData.task.instId,
            taskId: this.formData.task.id
          }
          if (this.innerForm.action !== 'save') {
            obj.opinion = this.innerForm.cont
          }
          console.log(this.innerForm.action !== 'save')
          doAction(obj).then(res => {
            if (res.code !== '200') {
              this.error(res.msg)
              return false
            }
            this.$message({
              message: `执行操${this.innerForm.title}作成功`,
              type: 'success'
            })
            this.dialogVisible = false
            this.innerVisible = false
            this.getList(this.query)
          })
        },
        getUseful(useful) {
          console.log(useful)
          this.innerForm.cont = useful
        },
        handleSizeChange(val) {
          this.query.limit = val
          this.getList(this.query)
        },
        handleCurrentChange(val) {
          this.query.offset = this.page.pageSize * (val - 1)
          this.page.currPage = val
          this.getList(this.query)
        }
      }
    }
</script>
<style scoped>
</style>
