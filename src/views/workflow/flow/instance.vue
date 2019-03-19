<template>
    <!--流程实例-->
    <div>
        <!-- 列表-->
        <div class="table">
            <div class="container">
                <div class="handle-box">
                    <el-row>
                        <el-col :span="24">
                            <el-input v-model="name" placeholder="名字" class="handle-input mr10"></el-input>
                            <el-input v-model="subject" placeholder="标题" class="handle-input mr10"></el-input>
                            <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-table :data="list"
                          v-loading="listLoading"
                          border fit highlight-current-row
                          style="width: 100%">
                    <el-table-column align="center" width="320px" label="标题">
                        <template slot-scope="scope">
                            <span>{{scope.row.subject}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.defName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="流程KEY">
                        <template slot-scope="scope">
                            <span>{{scope.row.defKey}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否禁止">
                        <template slot-scope="scope">
                            <span>
                                <el-tag v-if="scope.row.isForbidden===0">正常</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.isForbidden===1">禁止</el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <span>
                                <el-tag type="success" v-if="scope.row.status==='running'">运行中</el-tag>
                                <el-tag type="info" v-else-if="scope.row.status==='draft'">草稿</el-tag>
                                <el-tag v-else-if="scope.row.status==='end'">终止</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.status==='manualend'">人工终止</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.status==='back'">驳回</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.status==='revoke'">撤销</el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="创建时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="创建人">
                        <template slot-scope="scope">
                            <span>{{scope.row.creator}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="完成时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.endTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="持续时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.duration}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="220px" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="详情" placement="bottom-end">
                                <el-button type="primary" @click="handleDetail(scope.row)">
                                    <i class="fa fa-detail"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.isForbidden===0"
                                        class="item"
                                        effect="dark"
                                        content="挂起"
                                        placement="bottom-end">
                                <el-button type="primary" @click="pending(scope.row)">
                                    <i class="fa fa-ban"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.isForbidden===1"
                                        class="item"
                                        effect="dark"
                                        content="取消挂起"
                                        placement="bottom-end">
                                <el-button type="primary" @click="cancelPending(scope.row)">
                                    <i class="fa fa-undo"></i>
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

        <!--查看详情-->
        <flow-manage-dialog ref="flowDialog"
                            :data="taskInfo"
                            :idObj="idObj"
                            @update="getList(query)"
                            inputReadOnly="true">
        </flow-manage-dialog>
    </div>
</template>

<script>
    import FlowManageDialog from '@/components/flowManageDialog/index.vue'
    import { handleParams } from '@/utils/workflow/common'
    import { getInstanceDetail, getInstanceList, pending } from '@/api/workflow/businessApproval/flow/instance.js'

    export default {
        name: 'instance',
        components: {
            FlowManageDialog
        },
        data () {
            return {
                name: '',
                subject: '',
                listLoading: false,
                list: [],
                taskInfo: null,
                currRow: null,
                idObj: {
                    instId: '',
                    defId: ''
                },
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
            }
        },
        created () {
            this.getList(this.query)
        },
        methods: {
            // 获取列表数据
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getInstanceList(params).then(res => {
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
            // 查看详情
            handleDetail (row) {
                this.currRow = row
                this.idObj.instId = row.id
                this.idObj.defId = row.defId
                let obj = {
                    defId: row.defId,
                    instanceId: row.id,
                    readonly: true
                }
                getInstanceDetail(obj).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return
                    }
                    this.taskInfo = res.data
                    this.$refs.flowDialog.dialogVisible = true
                })
            },
            // 挂起
            pending (row) {
                let obj = {
                    id: row.id,
                    forbidden: true
                }
                this.$confirm('确认挂起吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pending(obj).then(res => {
                        if (res.code !== '200'){
                            this.$message.error(res.msg)
                            return
                        }
                        this.$message.success(res.msg)
                        this.getList(this.query)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            // 取消挂起
            cancelPending (row) {
                let obj = {
                    id: row.id,
                    forbidden: false
                }
                this.$confirm('确认取消挂起吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pending(obj).then(res => {
                        if (res.code !== '200'){
                            this.$message.error(res.msg)
                            return
                        }
                        this.$message.success(res.msg)
                        this.getList(this.query)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            // 全局搜索
            search () {
                const obj = {
                    limit: this.query.limit,
                    offset: this.query.offset,
                    order: this.query.order,
                    'name_^VLK': this.name,
                    'subject_^VLK': this.subject
                }
                this.getList(obj)
            },
            // pageSize变化
            handleSizeChange (val) {
                // pageSize
                this.query.limit = val
                this.getList(this.query)
            },
            // 翻页
            handleCurrentChange (val) {
                this.query.offset = this.query.limit * (val - 1)
                this.page.currPage = val
                this.getList(this.query)
            },
        }
    }
</script>

<style scoped>

</style>
