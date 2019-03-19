<template>
    <div>
        <el-dialog
            title="业务对象选择"
            :visible.sync="objDialogVisible"
            :show-close='false'
            width="65%"
            append-to-body>
            <!--选择表-->
            <div class="table">
                <div class="container">
                    <div class="handle-box">
                        <el-row>
                            <el-col :span="24">
                                <el-input v-model="key" placeholder="别名" class="handle-input mr10"></el-input>
                                <el-input v-model="name" placeholder="名字" class="handle-input mr10"></el-input>
                                <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-table :data="list"
                              v-loading="listLoading"
                              border fit highlight-current-row
                              style="width: 100%">
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <el-radio :label="scope.row.key_" v-model="objInfo.key"
                                          @change.native="getTableRow(scope.row)">&nbsp
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="别名">
                            <template slot-scope="scope">
                                <span>{{scope.row.key_}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="名字">
                            <template slot-scope="scope">
                                <span>{{scope.row.name_}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="描述">
                            <template slot-scope="scope">
                                <span>{{scope.row.desc_}}</span>
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
                <el-button type="primary" @click="save">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { handleParams } from '@/utils/workflow/common.js'
    import { getObjectList } from '@/api/workflow/businessApproval/form/def.js'

    export default {
        name: 'TableDialog',
        props: ['objDialogVisible',],
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
                objInfo: {key: '', name: ''}
            }
        },
        created () {
            console.log('所有表')
            this.getList(this.query)
        },
        methods: {
            //获取数据
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getObjectList(params).then(res => {
                    this.list = res.rows
                    this.page.total = res.total
                    this.page.page = res.page
                    this.page.pageSize = res.pageSize
                    this.listLoading = false
                })
            },
            //btn事件
            cancel () {
                this.$emit('objDialog', {})
            },

            save () {
                this.$emit('objDialog', this.objInfo)

            },
            search () {
                //全局搜索
                const obj = {
                    limit: this.query.limit,
                    offset: this.query.offset,
                    order: this.query.order,
                    'key_^VLK': this.key,
                    'name_^VLK': this.name
                }
                this.getList(obj)
            },
            getTableRow (row) {
                this.objInfo.name = row.name_

            },
            handleSizeChange (val) {
                // pageSize
                this.query.limit = val
                this.getList(this.query)
            },
            handleCurrentChange (val) {
                // 翻页
                this.query.offset = this.query.limit * (val - 1)
                this.page.currPage = val
                this.getList(this.query)
            },
        }
    }
</script>

<style scoped>

</style>
