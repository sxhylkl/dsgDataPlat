<template>
    <div>
        <div class="sub-table-dialog">
            <el-dialog :title="`${currChild.tableComment}(${currChild.tableKey})子表配置`"
                       v-for="(val,index) in dialogArr"
                       :key="'dialog'+index"
                       :visible.sync="val"
                       width="75%"
                       append-to-body>
                <div class="sub-table">
                    <div class="table">
                        <div class="container">
                            <div class="handle-box">
                                <el-row class="mt-20">
                                    <el-col :span="24">
                                        <el-button type="primary" @click="addSubTable()"><i class="fa fa-plus"></i>
                                            添加子业务实体
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-table :data="currChild.children" border fit highlight-current-row
                                      style="width: 100%">
                                <el-table-column width="220" align="center" label="类型">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.type" placeholder="请选择">
                                            <el-option
                                                v-for="(item) in BusTableRelType"
                                                :key="item.key"
                                                :label="item.desc"
                                                :value="item.key">
                                                <span style="float: left">{{ item.desc }}</span>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column width="160" align="center" label="名称">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.tableComment}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column width="160" align="center" label="实体名">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.tableKey}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column width="300" label="外键">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="添加外键" placement="bottom-end">
                                            <el-button type="primary" @click="addFk(scope.row.fks)"><i
                                                class="fa fa-plus"></i>
                                            </el-button>
                                        </el-tooltip>
                                        <el-row v-for="fk in scope.row.fks" :key="fk.type" v-if="Boolean(tableMap[scope.row.tableKey])">
                                            <el-col :span="7">
                                                <el-select v-model="fk.from" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in tableMap[scope.row.tableKey]['columns']"
                                                        :key="item.key"
                                                        :label="item.comment"
                                                        :value="item.key">
                                                        <span style="float: left">{{ item.comment }}</span>
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="7">
                                                <el-select v-model="fk.type" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in BusTableRelFkType"
                                                        :key="item.key"
                                                        :label="item.desc"
                                                        :value="item.key">
                                                        <span style="float: left">{{ item.desc }}</span>
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="7">
                                                <el-input v-model="fk.value" v-if="fk.type=='fixedValue'"
                                                          placeholder="请输入内容"></el-input>
                                                <el-select v-model="fk.value" v-if="fk.type=='parentField'||fk.type=='childField'"
                                                           placeholder="请选择">
                                                    <el-option
                                                        v-for="item in tableMap[relation.tableKey].columns"
                                                        :key="item.key"
                                                        :label="item.comment"
                                                        :value="item.key">
                                                        <span style="float: left">{{ item.comment }}</span>
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="3">
                                                <el-button type="info" v-show="scope.row.fks.length>1"
                                                           @click="delFk(scope.$index,scope.row.fks)"><i class="fa fa-trash"></i></el-button>
                                            </el-col>
                                        </el-row>

                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" fixed="right" min-width="360">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
                                            <el-button type="primary" @click="handleDel(scope.$index,scope.row)"><i
                                                class="fa fa-trash"></i>
                                            </el-button>
                                        </el-tooltip>
                                        <el-button type="primary" @click="handleEditChildren(scope.row)"><i
                                            class="fa fa-edit"></i>配置子表
                                        </el-button>
                                        <el-button type="primary" @click="handleConfig()"><i
                                            class="fa fa-edit"></i>配置控件与布局
                                        </el-button>

                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelSubtable(index)">取 消</el-button>
                    <el-button type="primary" @click="saveSubTable(index)">确定</el-button>
                </div>
            </el-dialog>
            <table-dialog v-if="tableDialogSub"
                          :tableDialog="tableDialogSub"
                          :objRelation='relation'
                          @cancelTableDialog="cancelTableDialog"
                          @saveTableDialog="saveTableDialog">
            </table-dialog>
        </div>
    </div>

</template>

<script>

    import TableDialog from './TableDialog'
    import { handleParams } from '@/utils/workflow/common.js'
    export default {
        name: 'SubTableDialog',
        props: ['subTableData','relation', 'BusTableRelFkType', 'BusTableRelType', 'tableMap'],
        components: {
            TableDialog,
        },
        data () {
            return {
                title: '',
                tableDialogSub:false,
                configSubTableVisible:false,
                currChild:{},
                dialogArr:[]
            }
        },
        created(){
            this.currChild=this.subTableData
            this.dialogArr.push(true)
            console.log('无限循环弹窗')
            console.log(this.currChild)
            console.log( this.dialogArr)
        },
        methods: {
            addSubTable () {
                // 添加子业务实体
                this.tableDialogSub = true
            },
            handleDel (index,row) {
                // 删除
                this.children.splice(index,1)
            },
            handleConfig () {
                // 配置控件与布局
                this.$message.info('复制表的字段控件，控件可配置顺序，控件列表可插入换行符')
            },
            handleEditChildren (row) {
                // 配置子表
                this.dialogArr.push(true)
                this.currChild=row
                console.log('配置子表')

            },
            addFk (row) {
                // 添加外键
                console.log(row)
                row.push({
                    type: this.BusTableRelFkType.PARENT_FIELD.key
                })

            },
            delFk (index,row) {
                // 删除外键
                console.log(row)
                row.splice(index,1)
            },
            saveSubTable(index){
                console.log('保存')
                console.log(index)
                this.dialogArr.splice(index,1)
                console.log(  this.dialogArr)
                if(index===0){
                    console.log(this.subTableData)
                }

            },
            cancelSubtable(index){
                this.currChild.children=[]
                this.dialogArr.splice(index,1)
            },
            //子组件
            cancelTableDialog (data) {
                this.tableDialogSub = data
            },
            saveTableDialog (data) {
                this.tableDialogSub = false
                if (data.tableKey && data.tableComment) {
                    let obj = {
                        children: [],
                        fks: [{
                            from: '',
                            type: 'parentField',
                            value: ''
                        }],
                        tableComment: data.tableComment,
                        tableKey: data.tableKey,
                        type: 'oneToOne'
                    }
                    this.currChild.children.push(obj)
                    if(!this.tableMap.hasOwnProperty(data.tableKey)){
                        this.$emit('saveTableDialog', data)
                    }
                    console.log('subTable')
                    console.log( this.subTableData)
                }

            }
        }
    }
</script>

<style scoped>

</style>
