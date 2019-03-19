<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="keyWords" placeholder="标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search"><i class="fa fa-search"></i>搜索</el-button>
            </div>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column width="320" align="center" label="标题">
                    <template slot-scope="scope">
                        <span>{{scope.row.subject}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="流程">
                    <template slot-scope="scope">
                        <span>{{scope.row.defName}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="节点">
                    <template slot-scope="scope">
                        <span>{{scope.row.nodeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="流程状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status ==='running'" type="success">
                            <span>运行中</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status ==='Sdraft'" type="primary">
                            <span>草稿</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status ==='end'" type="info">
                            <span>终止</span>
                        </el-tag>
                        <el-tag v-else type="danger">
                            <span v-if="scope.row.status ==='manualend'">人工终止</span>
                            <span v-else-if="scope.row.status ==='back'">驳回</span>
                            <span v-else>撤销</span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="发起人">
                    <template slot-scope="scope">
                        <span>{{scope.row.creator}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="办理时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.approveTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="处理用时">
                    <template slot-scope="scope">
                        <span>{{scope.row.durMs}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="处理结果">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.approveStatus ==='agree'" type="success">
                            <span>同意</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.approveStatus ==='oppose'" type="warning">
                            <span>反对</span>
                        </el-tag>
                        <el-tag v-else type="danger">
                            <span v-if="scope.row.approveStatus ==='reject'">驳回</span>
                            <span v-else>撤销</span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="200">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="详情" placement="bottom-end">
                            <el-button type="primary" @click="handleManage(scope.row)"><i class="fa fa-list-alt"></i>
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
        <!-- 处理弹出框-同意和驳回 -->
        <el-dialog title="处理" :visible.sync="dialogVisible" width="65%">
            <div class="dialog-cont">
                <div class="btn-list dialog-btn">
                    <el-button type="primary" @click="handleApproval"><i class="fa fa-navicon"></i>审批历史</el-button>
                    <el-button type="primary" @click="handleFlowImage"><i class="fa fa-image"></i>流程图</el-button>
                    <el-button type="primary" @click="handlePrint"><i class="fa fa-print"></i>打印</el-button>
                </div>
                <div id="formData" v-if="formData" v-html="formData.form.formHtml"></div>
            </div>
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
    </div>
</template>

<script>
    import { handleParams } from '@/utils/workflow/common.js'
    import { getApprovalHistory, getApprove, getApproveDetail, getFlowImage } from '@/api/workflow/personOffice/event/flow.js'

    export default {
        name: 'handleEvent',
        data () {
            return {
                listLoading: false,
                list: null,
                keyWords: '',
                page: {
                    total:0,
                    page:2,
                    currPage:1,
                    pageSize:10
                },
                query: {
                    limit:10,
                    offset: 0,
                    order: 'asc'
                },
                dialogVisible: false,
                dialogTableVisible: false,
                dialogImageVisible: false,
                formData: null,
                approvalHistory: null,
                flowImage: ''
            }
        },
        created () {
            this.getList(this.query)
        },
        methods: {
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getApprove(params).then(res => {
                    this.list = res.rows
                    this.page.total = res.total
                    this.page.page = res.page
                    this.page.pageSize = res.pageSize
                    this.listLoading = false
                })
            },
            search () {
                const obj = {
                    limit: this.query.limit,
                    offset: this.query.offset,
                    order: this.query.order,
                    'subject_^VLK': this.keyWords
                }
                this.getList(obj)
            },
            error (msg) {
                this.$message({
                    message: msg,
                    type: 'error'
                })
            },
            handleManage (row) {
                const query = {defId: row.defId, instanceId: row.id, readonly: true}
                getApproveDetail(query).then(res => {
                    if(res.code!=='200'){
                        this.error(res.msg)
                        return false
                    }
                    this.formData = res.data
                    this.dialogVisible = true
                    console.log(this.formData)

                })
            },
            handleApproval () {
                const obj = {instId: this.formData.instance.id}
                getApprovalHistory(obj).then(res => {
                    if(res.code!=='200'){
                        this.error(res.msg)
                        return false
                    }
                    this.approvalHistory = res.data
                    this.dialogTableVisible = true
                })
            },
            handleFlowImage () {
                this.dialogImageVisible = true
                let imgUrl = getFlowImage()
                this.flowImage = `${imgUrl}?instId=${this.formData.instance.id}&defId=${this.formData.defId}`
            },
            handlePrint (e) {
                let subOutputRankPrint = document.getElementById('formData')
                console.log(subOutputRankPrint.innerHTML)
                let newContent = subOutputRankPrint.innerHTML
                let oldContent = document.body.innerHTML
                document.body.innerHTML = newContent
                window.print()
                window.location.reload()
                document.body.innerHTML = oldContent
                return false
            },
            handleSizeChange(val) {
                this.query.limit=val
                this.getList(this.query)
            },
            handleCurrentChange(val) {
                this.query.offset=this.query.limit*(val-1)
                this.page.currPage=val
                this.getList(this.query)
            }
        }
    }
</script>
<style scoped>

</style>
