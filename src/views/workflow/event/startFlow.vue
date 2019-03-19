<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="keyWords" placeholder="名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search"><i class="fa fa-search"></i>搜索</el-button>
            </div>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column width="320" align="center" label="名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="KEY">
                    <template slot-scope="scope">
                        <span>{{scope.row.key}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status ==='deploy'" type="success">
                            <span>已发布</span>
                        </el-tag>
                        <el-tag v-else-if="scope.row.status ==='forbidden'" type="warning">
                            <span>禁用</span>
                        </el-tag>
                        <el-tag v-else type="info">
                           <span>草稿</span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="版本">
                    <template slot-scope="scope">
                        <span>{{scope.row.version}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="260" align="center" label="描述">
                    <template slot-scope="scope">
                        <span>{{scope.row.desc}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="200">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="启动" placement="bottom-end">
                            <el-button type="primary" @click="handleManage(scope.row)"><i class="fa fa-send"></i>
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
                    <el-button type="primary" @click="handleStart"><i class="fa fa-send"></i>启动</el-button>
                    <el-button type="primary" @click="handleSaveDraft"><i class="fa fa-clipboard"></i>保存草稿</el-button>
                    <el-button type="primary" @click="handleFlowImage"><i class="fa fa-image"></i>流程图</el-button>
                    <el-button type="primary" @click="handlePrint"><i class="fa fa-print"></i>打印</el-button>
                </div>
                <div id="formData" v-if="data" v-html="data.form.formHtml"></div>
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
    import {validForm,initValid,emptyHint} from '@/utils/workflow/formValid.js'
    import {handleParams} from '@/utils/workflow/common.js'
    import {getApproveDetail, getFlowImage } from '@/api/workflow/personOffice/event/flow.js'
    import { getDefinition, doAction } from '@/api/workflow/personOffice/event/index'

    export default {
        name: 'startFlow',
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
                data: null,
                approvalHistory: null,
                flowImage: '',
                innerForm: {
                    title: '同意',
                    cont: '',
                    useful: ['同意', '请注意，情况复杂！', '情况紧急，请尽快处理！', '驳回']
                },
            }
        },
        created () {
            this.getList(this.query)
            this.$nextTick(function () {
                validForm()
            })
        },
        methods: {
            getList (obj) {
                this.listLoading = true
                let params=handleParams(obj)
                getDefinition(params).then(res => {
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
            handleStart () {
                this.innerForm.title = '启动'
                this.innerForm.action = 'start'
                this.doAction()
            },
            handleSaveDraft () {
                this.innerForm.title = '保存草稿'
                this.innerForm.action = 'draft'
                this.doAction()
            },
            handleManage (row) {
                this.emptyInput()
                const query = {defId: row.id, instanceId: '', readonly: false}
                getApproveDetail(query).then(res => {
                    if(res.code!=='200'){
                        this.error(res.msg)
                        return false
                    }
                    this.data = res.data
                    this.dialogVisible = true
                    console.log(this.data)
                })
                this.$nextTick(function () {
                    emptyHint();
                    initValid()
                })
            },
            handleFlowImage () {
                this.dialogImageVisible = true
                let imgUrl = getFlowImage()
                this.flowImage = `${imgUrl}?instId=&defId=${this.data.defId}`
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
            doAction () {
                if(!this.handleInputValid()){
                    this.$message.error('表单验证不通过,请检查')
                    return
                }
                let value=this.getInputValue() //输入框的值
                let obj = {
                    action: this.innerForm.action,
                    data:value,
                    formType: this.data.form.type,
                    instanceId: '',
                    defId: this.data.defId
                }
                doAction(obj).then(res => {
                    if(res.code!=='200'){
                        this.error(res.msg)
                        return false
                    }
                    this.$message({
                        message: `执行${this.innerForm.title}操作成功`,
                        type: 'success'
                    })
                    this.dialogVisible = false
                    this.getList(this.query)
                })
            },
            handleSizeChange(val) {
                this.query.limit=val
                this.getList(this.query)
            },
            handleCurrentChange(val) {
                this.query.offset=this.query.limit*(val-1)
                this.page.currPage=val
                this.getList(this.query)
            },
            // 判断是否通过验证
            handleInputValid(){
                let errInput=$('input.ng-invalid')
                if(errInput.length>0) return false
                return true
            },
            //清空input的值
            emptyInput(){
                let inputs = $('input.form-control')
                inputs.each(function (i) {
                    $(this).val('')
                })
            },
            // 获取input的值并赋值给rowData
            getInputValue () {
                let key=''
                for(let key1 in this.data.data){
                    key=key1
                }
                let obj={}//存数据的对象
                let data={}
                let len=0
                let ch=[]
                let inputs = $('input.form-control')
                inputs.each(function (i) {
                    ch = $(this).attr('ng-model').split('.')//获取数据所在的位置
                    len = ch.length-1 //获取最后一个属性
                    obj[ch[len]] = $(this).val()
                })
                data[key]=obj
                return  data
            }

        }
    }
</script>
<style scoped>

</style>
