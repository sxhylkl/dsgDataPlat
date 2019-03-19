<template>
    <!--指派候选人-->
    <div>
        <el-dialog title="用户查询" :visible.sync="dialogTableVisible" width="65%">
            <div class="table">
                <div class="container">
                    <div class="handle-box">
                        <el-row>
                            <el-col :span="24">
                                <el-input v-model="fullname" placeholder="姓名" class="handle-input mr10"></el-input>
                                <el-input v-model="account" placeholder="账号" class="handle-input mr10"></el-input>
                                <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-table :data="list"
                              v-if="fields"
                              v-loading="listLoading"
                              border fit highlight-current-row
                              style="width: 100%">
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <el-radio v-model="radio" :label="scope.row">&nbsp;</el-radio>
                                <span>{{scope.row.subject}}</span>
                            </template>
                            <template>

                            </template>
                        </el-table-column>
                        <el-table-column
                            v-for="field in fields.displayFields"
                            :prop="field.columnName"
                            :label="field.showName"
                            align="center">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { handleParams } from '@/utils/workflow/common'
    import { getFields, getList } from '@/api/workflow/common.js'

    export default {
        name: 'TableDialog',
        props: ['param', 'dialogState',],
        data () {
            return {
                fullname: '',
                account: '',
                fields: null,
                list: [],
                radio:'',
                dialogTableVisible: false,
                listLoading: false,
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
            this.getFieldsList()
            this.getList(this.query)
        },
        methods: {
            // 获取列表数据
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getList(this.param, params).then(res => {
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
            // 获取列名
            getFieldsList () {
                if (this.fields) return
                getFields({key: this.param}).then(res => {
                    this.fields = res.data
                })
            },
            // 保存
            save () {
                this.dialogTableVisible = false
                this.$emit('save',this.radio)
            },
            // 取消
            cancel () {
                this.dialogTableVisible = false
            },
            // 全局搜索
            search () {
                const obj = {
                    limit: this.query.limit,
                    offset: this.query.offset,
                    order: this.query.order,
                    'fullname_^VLK': this.fullname,
                    'account_^VLK': this.account
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

