<template>
    <!--业务对象列表-->
    <div>
        <el-dialog
            title="业务对象列表"
            :visible.sync="dialogVisible"
            :show-close='false'
            width="75%"
            append-to-body>
            <!--选择表-->
            <div class="table" v-if="table">
                <div class="container">
                    <div class="handle-box">
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
                        <el-table-column
                            v-if="col.name!=='id'"
                            v-for="col in table.columns"
                            :key="col.id"
                            :prop="col.name"
                            :label="col.comment"
                            align="center"
                            min-width="120">
                        </el-table-column>
                        <el-table-column align="center" label="操作" fixed="right" min-width="280">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                                    <el-button type="primary" @click="handleEdit(scope.row)"><i
                                        class="fa fa-edit"></i></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
            </span>
            <!--新增和编辑-->
            <el-dialog
                v-if="rowData"
                :title="title"
                :visible.sync="dialogFormVisible"
                width="55%"
                :show-close="false"
                append-to-body>
                <div id="form-box" v-html="rowData.html">
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRow">确 定</el-button>
            </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import {initValid,emptyHint} from '@/utils/workflow/formValid.js'
    import { handleParams } from '@/utils/workflow/common'
    import {
        delBusObj,
        getBusObject,
        getData,
        getListObj,
        saveBusObj
    } from '@/api/workflow/businessApproval/form/def.js'

    export default {
        name: 'TableObjDialog',
        props: ['row', 'dialogVisible', 'getBusObject'],
        data () {
            return {
                list: [],
                busObj: null,
                table: null,
                rowData: null,
                page: {
                    total: 0,
                    page: 1,
                    currPage: 1,
                    pageSize: 10
                },
                query: {
                    limit: 10,
                    offset: 0,
                    order: 'asc'
                },
                listLoading: true,
                dialogFormVisible: false,
                title: '新增',
            }
        },
        created () {
            //测试数据
            /*let data = {
             columns: [{id: '1t', 'comment': '名字', name: 'name'}, {id: '2t', 'comment': '总人数', name: 'count'}]
             }
             this.table = data
             this.list = [{id: 1, name: '高二(1)', count: 45},
             {id: 2, name: '高二(2)', count: 35},
             {id: 3, name: '高二(3)', count: 25},
             {id: 4, name: '高二(4)', count: 15},]*/
            // 初始化业务对象数据
            this.getBusObjectData()

            // 初始化列表数据
            this.getList(this.query)

        },
        methods: {
            //获取业务对象列表
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getListObj(this.row.boKey, params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                    }
                    this.list = res.rows
                    this.page.total = res.total
                    this.page.page = res.page
                    this.page.pageSize = res.pageSize
                    this.listLoading = false
                })
            },
            //获取业务对象信息（包含列名）
            getBusObjectData () {
                this.listLoading = true
                let params = {key: this.row.boKey, fill: true}
                getBusObject(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return
                    }
                    this.busObj = res.data
                    this.table = res.data.relation.table
                })
            },
            //获取业务对象数据(新增和编辑)
            getObjData (obj) {
                getData(obj).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return
                    }
                    this.rowData = res.data
                    console.log('获取到的数据')
                    console.log(this.rowData)
                    this.inputValue()
                    this.$nextTick(function () {
                        emptyHint();
                        initValid();
                    })

                })
            },
            // 新增
            handleAdd () {
                this.title = '新增'
                this.dialogFormVisible = true
                this.getObjData({id: '', key: this.row.key})

            },
            // 编辑
            handleEdit (row) {
                console.log('编辑')
                console.log(row)
                this.title = '编辑'
                this.dialogFormVisible = true
                this.getObjData({id: row.id, key: this.row.key})
                this.$nextTick(function () {
                    initValid()
                })
            },
            handleDel (row) {
                console.log('删除')
                console.log(row)
                delBusObj(this.row.key, row.id).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return
                    }
                    this.$message.success(res.msg)
                    this.getList(this.query)
                })
            },
            // 关闭业务对象列表弹窗
            cancel () {
                this.$emit('onTableObj')
            },
            // pageSize改变
            handleSizeChange (val) {
                this.query.limit = val
                this.getList(this.query)
            },
            // 翻页
            handleCurrentChange (val) {
                this.query.offset = this.query.limit * (val - 1)
                this.page.currPage = val
                this.getList(this.query)
            },
            //保存(对数据处理)
            saveRow () {
                if (!this.handleInputValid()) {
                    this.$message.error('表单验证不通过,请检查')
                    return
                }
                this.getInputValue()
                this.saveBusObjData(this.row.key, this.rowData.data)
            },
            // 保存
            saveBusObjData (key, data) {
                saveBusObj(key, data).then(res => {
                    this.dialogFormVisible = false
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return
                    }
                    this.$message.success(res.msg)
                    this.getList(this.query)
                })
            },
            // 给input赋值
            inputValue () {
                let self = this
                this.$nextTick(function () {
                    let inputs = $('input.form-control')
                    inputs.each(function (i) {
                        var ch = $(this).attr('ng-model').split('.')//获取数据所在的位置
                        let data = self.rowData
                        if (this.title === '新增') {
                            $(this).val('')
                        } else {
                            for (let val of ch) {
                                data = data[val]
                            }
                            $(this).val(data)
                        }
                    })
                })
            },
            // 获取input的值并赋值给rowData
            getInputValue () {
                let self = this
                let len = 0
                let ch = []
                let data={}
                let inputs = $('input.form-control')
                inputs.each(function (i) {
                    let data = self.rowData
                    ch = $(this).attr('ng-model').split('.')//获取数据所在的位置
                    len = ch.length
                    for (let val of ch) {
                        len--
                        if (len === 0) {
                            data[val] = $(this).val()
                        } else {
                            data = data[val]
                        }
                    }
                })
            },
            // 判断是否通过验证
            handleInputValid () {
                let errInput = $('input.ng-invalid')
                if (errInput.length > 0) return false
                return true
            },
        }

    }
</script>

<style scoped>

</style>
