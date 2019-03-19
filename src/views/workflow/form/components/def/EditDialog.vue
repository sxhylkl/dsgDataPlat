<template>
    <!--新增、编辑的弹窗-->
    <div>
        <div class="components-container">
            <split-pane split="vertical" :min-percent='5' :default-percent='20'>
                <template slot="paneL">
                    <div class="left-container">
                        <h6>业务对象列表</h6>
                        <el-tree :data="fieldsData" default-expand-all></el-tree>
                    </div>
                </template>
                <template slot="paneR">
                    <div class="right-container">
                        <el-row v-show="data.boName" style="margin: 20px 10px;">
                            <el-col :span="22">
                                <el-button type="primary" @click="selectTemplate"><i class="fa fa-cubes"></i>
                                    生成表单
                                </el-button>
                                <el-button type="primary" v-show="data.html" @click="preview"><i class="fa fa-eye"></i>
                                    预览
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form :model="data" ref="form" :rules="rules">
                                    <el-row>
                                        <el-col :span="7">
                                            <el-form-item label="分类" :label-width="labelWidth" prop="groupName">
                                                <el-autocomplete
                                                    class="inline-input"
                                                    v-model="data.groupName"
                                                    :fetch-suggestions="querySearch"
                                                    placeholder="点击选择"
                                                    @select="handleSelect">
                                                    <template slot-scope="{item}">
                                                        <div class="name">{{ item.name }}</div>
                                                    </template>
                                                </el-autocomplete>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7" :offset="1">
                                            <el-form-item label="名字" :label-width="labelWidth" prop="name">
                                                <el-input v-model="data.name"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7" :offset="1">
                                            <el-form-item label="别名" :label-width="labelWidth" prop="key">
                                                <el-input v-model="data.key"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="7">
                                            <el-form-item label="业务对象别名" :label-width="labelWidth" prop="boKey">
                                                <el-input v-model="data.boKey" style="width: 60%"></el-input>
                                                <el-button type="primary" @click="busObjectSelect"><i
                                                    class="fa fa-search"></i>选择
                                                </el-button>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7" :offset="1">
                                            <el-form-item label="业务对象名称" :label-width="labelWidth">
                                                <el-input v-model="data.boName" disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7" :offset="1">
                                            <el-form-item label="描述" :label-width="labelWidth">
                                                <el-input type="textarea" v-model="data.desc"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </el-col>
                        </el-row>
                        <el-row style="height: 345px">
                            <el-col :span="24">
                                <!--<mark-down @saveHtml="saveHtml" :html="data.html"></mark-down>-->
                                <Ueditor @ready="editorReady"
                                         style="width: 98%; height: 320px;margin: 0 auto"></Ueditor>
                            </el-col>
                        </el-row>
                    </div>
                </template>
            </split-pane>
        </div>
        <!--选择业务对象-->
        <table-dialog v-if="objDialogVisible" @objDialog="objDialog"
                      :objDialogVisible="objDialogVisible"></table-dialog>

        <!--生成表单 弹窗-->
        <el-dialog
            title="选择模板"
            :visible.sync="templateDialogVisible"
            width="55%"
            :show-close="false"
            append-to-body="">
            <template-content :data="templateList"></template-content>
            <span slot="footer" class="dialog-footer">
                <el-button @click="templateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createHtml">确 定</el-button>
            </span>
        </el-dialog>

        <!--预览 弹窗-->
        <el-dialog
            title="预览"
            :visible.sync="previewDialogVisible"
            width="55%"
            :show-close="false"
            append-to-body="">
            <preview-content :html="data.html"></preview-content>
            <span slot="footer" class="dialog-footer">
                <el-button @click="previewDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import splitPane from 'vue-splitpane'
    // import MarkDown from './Markdown'
    import TemplateContent from './TemplateContent'
    import PreviewContent from './PreviewContent'
    import Ueditor from '@/components/ueditor/index.vue'
    import TableDialog from './TableDialog'
    import { toTreeData } from '@/utils/workflow/tree.js'
    import { handleParams } from '@/utils/workflow/common'
    import { getBoTree, templateData,createHtml } from '@/api/workflow/businessApproval/form/def'

    export default {
        name: 'EditDialog',
        props: ['treeData', 'data'],
        components: {
            splitPane,
            // MarkDown,
            Ueditor,
            TableDialog,
            TemplateContent,
            PreviewContent
        },
        data () {
            return {
                labelWidth: '120px',
                fieldsData: [],
                objDialogVisible: false,
                templateDialogVisible: false,
                previewDialogVisible:false,
                formState:false,
                templateList: null,
                ue:'',//保存Ueditor的实例对象
                rules:{
                    groupName:[{required: true, message: '必填', trigger: 'blur' }],
                    name:[{required: true, message: '必填', trigger: 'blur' }],
                    key:[{required: true, message: '必填', trigger: 'blur' }],
                    boKey:[{required: true, message: '必填', trigger: 'blur' }],
                }
            }
        },
        created () {
            this.fieldsData = []
            if (!this.data.boKey) {
                return
            }
            this.getBoTreeData(this.data.boKey)
        },
        methods: {
            // 获取数据
            getBoTreeData (boKey) {
                getBoTree({boKey: boKey}).then(res => {
                    this.fieldsData = this.handleTreeData(res)
                })
            },
            // 获取模板的数据
            getTemplateData () {
                let params = {boKey: this.data.boKey, type: 'pc'}
                templateData(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.templateList = res.data
                })
            },
            // 树形菜单的回调
            querySearch (queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.treeData)
            },

            // 分类的选择
            handleSelect (item) {
                this.data.groupName = item.name
                this.data.groupId = item.id
            },

            // 选择对象别名
            busObjectSelect () {
                // 业务对象别名选择
                this.objDialogVisible = true
            },
            // 生产表单btn
            selectTemplate () {
                this.getTemplateData()
                this.templateDialogVisible = true
            },
            // 预览btn
            preview () {
                this.previewDialogVisible=true
            },
            // 生成html
            createHtml () {
                console.log(this.templateList)
                createHtml(this.data.boKey,this.templateList).then(res=>{
                    if(res.code!=='200'){
                        this.$message.error(res.msg)
                        return false
                    }
                    this.ue.execCommand('cleardoc')
                    this.data.html=''
                    this.data.html=res.data
                    this.ue.execCommand('insertHtml', res.data, false)
                    this.templateDialogVisible = false
                })
            },
            // 表单验证
            validForm(){
                let self=this
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                       self.formState=true
                    } else {
                        self.formState=false
                        console.log('error submit!!');
                        return 0;
                    }
                });
            },
            // 子组件
            objDialog (data) {
                this.objDialogVisible = false
                if (data && data.key) {
                    this.data.boKey = data.key ? data.key : ''
                    this.data.boName = data.name ? data.name : ''
                    this.getBoTreeData(data.key)
                }
            },
            /*saveHtml (data) {
             this.data.html = data ? data : ''
             },*/
            editorReady (instance) {
                if(!this.ue){
                    this.ue=instance;
                }
                // instance.setContent(this.data.html)
                instance.execCommand('insertHtml', this.data.html, false)
                instance.addListener('contentChange', () => {
                    this.data.html = instance.getContent()
                })
            },
            //处理数据
            handleTreeData (res) {
                if (!res) return
                let attributes = {
                    id: 'id',
                    parentId: 'parentId',
                    name: 'name',
                    rootId: '0'
                }
                let treeData = toTreeData(res, attributes)
                return treeData
            }
        }
    }
</script>
<style scoped>
    .components-container {
        position: relative;
        height: 70vh;
        overflow: hidden;
    }

    .left-container {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .left-container h6{
        line-height: 30px;
        margin: 5px 5px 5px 15px;
    }

    .right-container {
        margin-top: 20px;
        height: 100%;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }
</style>
