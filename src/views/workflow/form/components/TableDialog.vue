<template>
    <div>
        <el-dialog
            title="业务表列表"
            :visible.sync="tableDialog"
            :show-close='false'
            width="65%"
            append-to-body>
            <!--选择表-->
            <div class="table">
                <div class="container">
                    <div class="handle-box">
                        <el-row>
                            <el-col :span="24">
                                <el-input v-model="key" placeholder="业务key" class="handle-input mr10"></el-input>
                                <el-input v-model="name" placeholder="表名" class="handle-input mr10"></el-input>
                                <el-button type="primary" @click="search"><i class="fa fa-search"></i>搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-table v-if="mainTable" :data="list"
                              v-loading="listLoading"
                              border fit highlight-current-row
                              style="width: 100%">
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <el-radio :label="scope.row.key_" v-model="relation.tableKey" @change.native="getTableRow(scope.row)">&nbsp</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="描述">
                            <template slot-scope="scope">
                                <span>{{scope.row.comment_}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="业务key">
                            <template slot-scope="scope">
                                <span>{{scope.row.key_}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="表名">
                            <template slot-scope="scope">
                                <span>{{scope.row.name_}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table v-else :data="list"
                              v-loading="listLoading"
                              border fit highlight-current-row
                              ref="multipleTable"
                              tooltip-effect="dark"
                              style="width: 100%"
                              @selection-change="handleSelectionChange">
                        <el-table-column width="55">
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="描述">
                            <template slot-scope="scope">
                                <span>{{scope.row.comment_}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="业务key">
                            <template slot-scope="scope">
                                <span>{{scope.row.key_}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="表名">
                            <template slot-scope="scope">
                                <span>{{scope.row.name_}}</span>
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
    import { getObjectTable } from '@/api/workflow/businessApproval/form/object.js'

    export default {
        name: 'TableDialog',
        props:['tableDialog','objRelation','mainTable'],
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
                multipleSelection: [],
                relation:{tableKey:'',tableComment:''}
            }
        },
        created () {
            console.log('所有表')
            this.getList(this.query)
            this.relation.tableKey=this.objRelation.tableKey;
            this.relation.tableComment=this.objRelation.tableComment;
        },
        methods: {
            //获取数据
            getList (obj) {
                this.listLoading = true
                let params = handleParams(obj)
                getObjectTable(params).then(res => {
                    this.list = res.rows
                    this.page.total = res.total
                    this.page.page = res.page
                    this.page.pageSize = res.pageSize
                    this.listLoading = false
                })
            },
            //btn事件
            cancel(){
                this.$emit("cancelTableDialog", false)
            },
            toggleSelection() {
               /* if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }*/
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            save(){
                if(this.mainTable){
                    this.$emit("saveTableDialog", this.relation)
                }else {
                    this.$emit("saveTableDialog", this.multipleSelection)
                }

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
            getTableRow(row){
                this.relation.tableComment=row.comment_;

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
