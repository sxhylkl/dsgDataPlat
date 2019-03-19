<template>
    <div>
        <div class="table">
            <div class="container">
                <div class="handle-box">
                    <el-row>
                        <el-col :span="24">
                            <el-input v-model="key" placeholder="别名" class="handle-input mr10"></el-input>
                            <el-input v-model="name" placeholder="名称" class="handle-input mr10"></el-input>
                            <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="mt-20">
                        <el-col :span="24">
                            <el-button type="primary" @click="handleAdd"><i class="fa fa-plus"></i>
                                新增
                            </el-button>
                            <el-button type="primary" @click="initTemplate"><i class="fa fa-rotate-left"></i>
                                初始化模板
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-table :data="list"
                          v-loading="listLoading"
                          border fit highlight-current-row
                          style="width: 100%">
                    <el-table-column align="center" label="别名">
                        <template slot-scope="scope">
                            <span>{{scope.row.key}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="表单类型">
                        <template slot-scope="scope">
                            <span>{{scope.row.formType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="模板类型">
                        <template slot-scope="scope">
                            <span>
                                <el-tag v-if="scope.row.type==='main'">
                                    主表
                                </el-tag>
                                <el-tag type="info" v-else-if="scope.row.type==='subTable'">
                                    子表
                                </el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                                <el-button type="primary" @click="handleEdit(scope.row)"><i
                                    class="fa fa-edit"></i></el-button>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.editable" class="item" effect="dark" content="删除"
                                        placement="bottom-end">
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
        <!--新增、编辑的弹窗-->
        <el-dialog :title="title"
                   width="65%"
                   :visible.sync="dialogVisible">
            <div class="dialog-cont">
                <el-form :model="data" :rules="rules" ref="templateForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="名字" :label-width="formLabelWidth" prop="name">
                                <el-input v-model="data.name" :disabled="!data.editable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="别名" :label-width="formLabelWidth" prop="key">
                                <el-input v-model="data.key" :disabled="!data.editable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型" :label-width="formLabelWidth">
                                <el-select v-model="data.type" :disabled="!data.editable" style="width: 100%">
                                    <el-option v-for="item in FormTemplateType"
                                               :key="item.key"
                                               :label="item.desc"
                                               :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="描述" :label-width="formLabelWidth">
                                <el-input type="textarea"
                                          :rows="2"
                                          v-model="data.desc"
                                          :disabled="!data.editable">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="内容" :label-width="formLabelWidth">
                                <code-mirror :cont="data.html" :disable="!data.editable"
                                             @changeCodeMirror="changeCodeMirror"></code-mirror>

                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="data.editable" type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { handleParams } from '@/utils/workflow/common'
    import CodeMirror from '@/components/codemirror/index.vue'
    import {
        getTemplateInfo,
        getTemplateList,
        getTemplateType,
        initTemplate,
        saveTemplate,
        delTemplate
    } from '@/api/workflow/businessApproval/form/template.js'

    export default {
        name: 'formTemplate',
        components: {
            CodeMirror
        },
        data () {
            return {
                key: '',
                name: '',
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
                dialogVisible: false,
                title: '新增',
                formLabelWidth: '120px',
                FormTemplateType: null,
                editor: null,
                data: {
                    name: '',
                    key: '',
                    type: '',
                    desc: '',
                    html: '',
                    editable: true
                },
                rules: {
                    key: [
                        {required: true, message: '必填', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '必填', trigger: 'blur'},
                    ]
                }
            }
        },

        created () {
            this.getList(this.query)
            this.getTemplateType({path: 'com.dstz.form.api.constant.FormTemplateType', listMode: false})
        },
        mounted () {

        },
        methods: {
            // 获取列表数据
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getTemplateList(params).then(res => {
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
            // 获取模板的分类
            getTemplateType (obj) {
                let params = handleParams(obj)
                getTemplateType(params).then(data => {
                    this.FormTemplateType = data
                })
            },
            // 获取模板的详细信息
            getTemplateInfo (id) {
                getTemplateInfo({id: id}).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.data = res.data
                    /* this.data = {
                     id: res.data.id,
                     name: res.data.name,
                     key: res.data.name.key,
                     type: res.data.type,
                     desc: res.data.desc,
                     html: res.data.html ? res.data.html : '',
                     editable: res.data.editable
                     }*/
                    !this.data.html ? this.data.html = '' : ''
                    this.editor.setValue(this.data.html)
                })
            },
            // 全局搜索
            search () {
                const obj = {
                    limit: this.query.limit,
                    offset: this.query.offset,
                    order: this.query.order,
                    'key_^VLK': this.key,
                    'name_^VLK': this.name
                }
                this.getList(obj)
            },
            // 新增
            handleAdd () {
                this.title = '新增'
                this.initData()
                this.dialogVisible = true
                this.$nextTick(function () {
                    if( this.editor){
                        this.editor.setValue(this.data.html)
                    }
                })


            },
            // 编辑
            handleEdit (row) {
                this.title = '新增'
                this.getTemplateInfo(row.id)
                this.dialogVisible = true
            },
            // 删除
            handleDel (row) {
                this.$confirm('确认删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delTemplate({id:row.id}).then(res=>{
                        if(res.code!=='200'){
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
                    });
                });
            },
            // 保存(新增、编辑)
            save () {
                this.$refs['templateForm'].validate((valid) => {
                    if (valid) {
                        // 获取代码编译器的值
                        this.data.html = this.editor.getValue()
                        this.saveTemplate()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            //保存(调接口)
            saveTemplate () {
                saveTemplate(this.data).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.$message.success(res.msg)
                    this.dialogVisible = false
                })
            },
            // 保存html
            saveHtml (data) {
                console.log('收到变化')
                this.data.html = data
            },
            // 初始化模板
            initTemplate () {
                this.$confirm('您确定要重新初始化系统中的模板数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    initTemplate().then(res => {
                        if (res.code !== '200') {
                            this.$message.error(res.msg)
                            return false
                        }
                        this.$message.success(res.msg)
                    })
                }).catch(() => {
                    this.$message.info('已取消初始化模板')
                })
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
            // 获取代码编译器的实例
            changeCodeMirror (data) {
                this.editor = data
            },
            //  初始化data
            initData () {
                this.data = {
                    name: '',
                    key: '',
                    type: '',
                    desc: '',
                    html: '',
                    editable: true
                }

            }
        }
    }
</script>

<style>
    .codesql {
        font-size: 14px;
        font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    }
</style>
