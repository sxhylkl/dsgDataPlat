<template>
    <!--任务列表-->
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
                    <el-table-column align="center" width="320px" label="任务标题">
                        <template slot-scope="scope">
                            <span>{{scope.row.subject}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="任务名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="候选人">
                        <template slot-scope="scope">
                            <span>{{scope.row.assigneeNames}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="类型">
                        <template slot-scope="scope">
                            <span>
                                <el-tag v-if="scope.row.taskType==='NORMAL'">普通</el-tag>
                                <el-tag type="info" v-else-if="scope.row.taskType==='SIGN'">会签</el-tag>
                                <el-tag type="info" v-else-if="scope.row.taskType==='SIGN_SOURCE'">会签_父</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.taskType==='TRANSFORMING'">事项</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.taskType==='DELIVERTO'">转办</el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <span>
                               <el-tag v-if="scope.row.status==='NORMAL'">普通</el-tag>
                                <el-tag type="info" v-else-if="scope.row.status==='SUSPEND'">挂起</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.status==='LOCK'">锁定</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.status==='BACK'">驳回</el-tag>
                                <el-tag type="success" v-else-if="scope.row.status==='DESIGNATE'">指派</el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="220px" label="任务创建时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="220px" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="处理" placement="bottom-end">
                                <el-button type="primary" @click="handleManage(scope.row)">
                                    <i class="fa fa-check-circle"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item"
                                        effect="dark"
                                        content="指派候选人"
                                        placement="bottom-end">
                                <el-button type="primary" @click="assignUser(scope.row)">
                                    <i class="fa fa-user"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.status==='DESIGNATE'" class="item" effect="dark" content="取消指派" placement="bottom-end">
                                <el-button type="primary" @click="cancelAssignUser(scope.row)">
                                    <i class="fa fa-refresh"></i>
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
        <!--指派候选人-->
        <table-dialog ref="tableDialog" param="userSelector" @save="saveAssignTask"></table-dialog>
        <!--处理-->
        <flow-manage-dialog ref="flowDialog"
                            :data="taskInfo"
                            :idObj="idObj"
                            @update="getList(query)">
        </flow-manage-dialog>
    </div>
</template>

<script>
    import TableDialog from '@/components/TableDialog/index'
    import FlowManageDialog from '@/components/flowManageDialog/index.vue'
    import {handleParams} from '@/utils/workflow/common'
    import { getTaskList,unLock,assignTask,getTaskInfo} from '@/api/workflow/businessApproval/flow/task.js'
    export default {
        name: 'task',
        components:{
            TableDialog,
            FlowManageDialog
        },
        data () {
            return {
                name: '',
                subject: '',
                listLoading: false,
                assignUserDialog:false,
                list: [],
                fields:null,
                currRow:null,
                taskInfo:null,
                idObj:{
                    instId:'',
                    defId:''
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
            this.getList(this.query);
        },
        methods: {
            // 获取列表数据
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getTaskList(params).then(res => {
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
            // 处理
            handleManage(row){
                this.idObj.instId=row.instId
                this.idObj.defId=row.defId
                getTaskInfo({taskId:row.id}).then(res=>{
                    if(res.code!=='200'){
                        this.$message.error(res.msg)
                        return
                    }
                    this.taskInfo=res.data
                    this.$refs.flowDialog.dialogVisible=true
                })
            },
            // 指派候选人(弹窗)
            assignUser(row){
                this.$refs.tableDialog.dialogTableVisible=true
                this.currRow=row
            },
            // 指派候选人(保存)
            saveAssignTask(data){
                let obj={
                    userId: data.id_,
                    userName:  data.fullname_,
                    taskId: this.currRow.id
                }
                let params=handleParams(obj)
                assignTask(params).then(res=>{
                    if(res.code!=='200'){
                        this.$message.error(res.msg)
                        return
                    }
                    this.$message.success(res.msg)
                    this.getList(this.query)
                })
            },
            // 取消指派
            cancelAssignUser(row){
                this.$confirm('确认取消指派吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    unLock({taskId:row.id}).then(res=>{
                        if(res.code!=='200'){
                            this.$message.error(res.msg)
                            return false
                        }
                        this.$message.success(res.msg)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

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
