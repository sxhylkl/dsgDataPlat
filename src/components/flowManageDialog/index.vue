<template>
    <!--流程处理的弹窗-->
    <div>
        <el-dialog title="处理" :visible.sync="dialogVisible" width="65%">
            <div class="dialog-cont" v-if="data">
                <div class="btn-list dialog-btn">
                    <el-button v-for="btn in data.buttonList"
                               :type="btn.alias=='agree'?'success':btn.alias=='reject'?'danger':'primary'"
                               @click="onClick(btn)">
                        <i class="fa fa-check-square-o"></i>
                        {{btn.name}}
                    </el-button>
                    <!-- <el-button type="danger" @click="handleReject"><i class="fa fa-lastfm"></i>驳回</el-button>
                     <el-button type="danger" @click="handleSave"><i class="fa fa-clipboard"></i>保存</el-button>
                     <el-button type="primary" @click="handleApproval"><i class="fa fa-navicon"></i>审批历史</el-button>
                     <el-button type="primary" @click="handleFlowImage"><i class="fa fa-image"></i>流程图</el-button>
                     <el-button type="primary" @click="handlePrint"><i class="fa fa-print"></i>打印</el-button>-->
                </div>
                <!--<div id="formData" v-if="data" v-html="data.form.formHtml"></div>-->
                <form-html ref="formHtml" :html="data.form.formHtml" :data="data.data" :inputReadOnly="inputReadOnly">
                </form-html>
            </div>
            <!--同意、驳回-->
            <el-dialog width="50%" :title="title" :visible.sync="dialogHandleVisible" append-to-body>
                <el-form>
                    <el-form-item label="备注意见" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="opinion" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="常用语" :label-width="formLabelWidth">
                        <div class="useful">
                            <span v-for="item in useful" :key="item" @click="setOption(item)">{{item}}</span>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogHandleVisible = false">取消</el-button>
                    <el-button @click="saveHandle">确定</el-button>
                </div>
            </el-dialog>
            <!--审批历史-->
            <el-dialog width="65%" title="审批历史" :visible.sync="dialogApprovalVisible" append-to-body>
                <el-table :data="approvalHistory"  border>
                    <el-table-column property="taskName" label="任务名称" align="center"></el-table-column>
                    <el-table-column property="createTime" label="任务创建时间" align="center"></el-table-column>
                    <el-table-column property="approveTime" label="处理时间" align="center"></el-table-column>
                    <el-table-column property="assignInfo" label="待执行人" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.assignInfo | assignInfo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="approverName" label="执行人" align="center"></el-table-column>
                    <el-table-column property="status" label="处理状态" align="center"></el-table-column>
                    <el-table-column property="opinion" label="备注/意见" align="center"></el-table-column>
                </el-table>
            </el-dialog>
            <!--流程图-->
            <el-dialog width="50%" title="流程图" :visible.sync="dialogImageVisible" append-to-body>
                <img :src="flowImageSrc" alt="流程图" style="text-align: center;margin-bottom: 40px">
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import FormHtml from '@/components/formHtml/index.vue'
    import { handleParams } from '@/utils/workflow/common'
    import { doAction, getApprovalHistory, getFlowImage } from '@/api/workflow/common.js'

    export default {
        name: 'FlowManageDialog',
        props: ['data','inputReadOnly','idObj'],
        components: {
            FormHtml
        },
        data () {
            return {
                dialogVisible: false,
                dialogApprovalVisible: false,
                dialogHandleVisible: false,
                dialogImageVisible: false,
                approvalHistory: [],
                flowImageSrc: '',
                formLabelWidth: '120px',
                title: '同意',
                opinion: '',//处理意见
                useful: ['同意', '请注意，情况复杂！', '情况紧急，请尽快处理！', '驳回']
            }
        },
        filters:{
            // 过滤待执行人
            assignInfo:function (value) {
                if (!value) return ''
                 let arr=value.split('-')
                return arr[1]
            }
        },
        methods: {
            // 按钮点击事件,做事件分发
            onClick: function (btn) {
                switch (btn.alias) {
                    case 'agree':
                        this.agree()
                        break
                    case 'save':
                        this.save()
                        break
                    case 'reject':
                        this.reject()
                        break
                    case 'taskOpinion':
                        this.taskOpinion()
                        break
                    case 'flowImage':
                        this.flowImage()
                        break
                    case 'print':
                        this.print()
                        break
                }
            },
            // 同意
            agree: function () {
                this.title = '同意'
                this.dialogHandleVisible = true
            },
            // 保存
            save: function () {
                // 判断表单是否通过验证
                if (!this.$refs.formHtml.handleInputValid()) {
                    this.$message.error('表单验证不通过,请检查')
                    return
                }
                let obj=this.handleInputValue()
                obj.action='save'
                this.doAction(obj)
                this.dialogVisible = false

            },
            // 驳回
            reject: function () {
                this.title = '驳回'
                this.dialogHandleVisible = true
            },
            // 审批历史
            taskOpinion: function () {
                let params = handleParams({instId: this.idObj.instId})
                console.log(this.idObj.instId)
                getApprovalHistory(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return
                    }
                    this.approvalHistory = res.data
                    this.dialogApprovalVisible = true
                })
            },
            // 流程图
            flowImage: function () {
                this.flowImageSrc = getFlowImage() + '?instId=' + this.idObj.instId + '&defId=' + this.idObj.defId
                console.log(this.flowImageSrc)
                this.dialogImageVisible = true
            },
            // 打印
            print: function () {
                let subOutputRankPrint = document.getElementById('formData')
                let newContent = subOutputRankPrint.innerHTML
                let oldContent = document.body.innerHTML
                document.body.innerHTML = newContent
                console.log(newContent)
                window.print()
                // window.location.reload()
                document.body.innerHTML = oldContent
            },
            // 打印时给input框复制
            setInputValue(html){
                let nInputs=html.find('input')
                let oInputs=$('#formData input')
                console.log(nInputs)
                console.log(oInputs)
            },
            // 保存表单的数据
            handleInputValue(){
                let obj = {
                    action: 'save',
                    formType: 'INNER',
                    instanceId: this.idObj.instId,
                    taskId: this.data.task.taskId,
                    data: {}
                }
                let inputObj = this.$refs.formHtml.getInputValue()//input框的html
                for (let key in this.data.data) {
                    let data = this.data.data[key]
                    obj.data[key] = data
                    for (let k in data) {
                        data[k] = inputObj[k] ? inputObj[k] : data[k]
                    }

                }
                return obj;
            },
            // 保存（保存、同意、驳回）
            doAction(obj){
                doAction(obj).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.$message.success(res.msg)
                    this.dialogHandleVisible=false
                    this.dialogVisible = false
                    this.$emit('update')
                })
            },
            // 设置备注意见
            setOption (text) {
                this.opinion = text
            },
            // 保存处理意见
            saveHandle () {
                let obj=this.handleInputValue()
                if(this.title==='同意'){
                    obj.action='agree'
                }else {
                    obj.action='reject'
                }
                obj.opinion=this.opinion
                this.doAction(obj)
            }
        }
    }
</script>

<style scoped>
    .dialog-btn .el-button {
        margin: 20px 5px 20px 0;
    }

    #formData {
        margin-bottom: 20px;
    }
</style>
