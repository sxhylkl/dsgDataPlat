<template>
    <div class="sub-table">
        <div class="table">
            <div class="container">
                <div class="handle-box">
                    <el-row class="mt-20">
                        <el-col :span="24">
                            <el-button type="primary" @click="addSubTable(relation.children)"><i
                                class="fa fa-plus"></i>
                                添加子业务实体
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-form :model="relation" ref="relation">
                    <el-table :data="relation.children" border fit highlight-current-row
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
                                <el-row v-for="(fk,index) in scope.row.fks" :key="fk.type"
                                        v-if="Boolean(tableMap[scope.row.tableKey])">
                                    <el-col :span="7">
                                        <el-form-item :prop="'children.' + scope.$index + '.fks.'+index+'.from'"
                                                      :rules="{required: true, message: '必填', trigger: 'change'}">
                                            <el-select v-model="fk.from" placeholder="请选择">
                                                <el-option
                                                    v-for="item in tableMap[scope.row.tableKey].columns"
                                                    :key="item.key"
                                                    :label="item.comment"
                                                    :value="item.key">
                                                    <span style="float: left">{{ item.comment }}</span>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
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
                                        <el-form-item :prop="'children.' + scope.$index + '.fks.'+index+'.value'"
                                                      :rules="{required: true, message: '必填', trigger: 'change'}">
                                            <el-select v-model="fk.value"
                                                       v-if="fk.type=='parentField'||fk.type=='childField'"
                                                       placeholder="请选择">
                                                <el-option
                                                    v-for="item in tableMap[relation.tableKey].columns"
                                                    :key="item.key"
                                                    :label="item.comment"
                                                    :value="item.key">
                                                    <span style="float: left">{{ item.comment }}</span>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                    </el-col>
                                    <el-col :span="3">
                                        <el-button type="info" v-show="scope.row.fks.length>1"
                                                   @click="delFk(scope.$index,scope.row.fks)"><i
                                            class="fa fa-trash"></i>
                                        </el-button>
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
                </el-form>

            </div>
        </div>
        <table-dialog v-if="tableDialogSub"
                      :mainTable=false
                      :tableDialog="tableDialogSub"
                      :objRelation='relation'
                      @cancelTableDialog="cancelTableDialog"
                      @saveTableDialog="saveTableDialog">
        </table-dialog>
        <div v-for="(subTable,index) in subTableDialogArr" :key="'subTable'+index">
            <sub-table-dialog v-if="subTable.state"
                              :childData="subTable.data"
                              :BusTableRelFkType="BusTableRelFkType"
                              :BusTableRelType="BusTableRelType"
                              @handleEditChildren="handleEditChildren"
                              @subTableDialogClick="subTableDialogClick"
                              @saveTableDialogMap="saveTableDialogMap"
                              @changeRelationChild="changeRelationChild"
                              :tableMap="tableMap"
            ></sub-table-dialog>
        </div>

    </div>
</template>

<script>

    import SubTableDialog from './SubTableDialog'
    import TableDialog from './TableDialog'
    import { handleParams } from '@/utils/workflow/common.js'

    export default {
        name: 'SubTable',
        props: ['relation', 'BusTableRelFkType', 'BusTableRelType', 'tableMap'],
        components: {
            TableDialog,
            SubTableDialog

        },
        data () {
            return {
                children: [],
                tableDialogSub: false,
                index: -1,
                subTableDialog: false,
                // childData: [],
                subTableDialogArr:[]
            }
        },
        mounted () {
            console.log('-------------------')
            console.log(this.relation.children)
            this.$on('validateForm', (val) => {
                this.validateForm(val)
            })

        },
        methods: {
            addSubTable () {
                // 添加子业务实体
                if (this.relation.tableComment && this.relation.tableKey) {
                    this.tableDialogSub = true
                } else {
                    this.$message.info('请先选择主业务表')
                }

            },
            handleDel (index, row) {
                // 删除
                this.relation.children.splice(index, 1)
            },
            validateForm () {
                this.$refs['relation'].validate((valid) => {
                    if (valid) {
                        this.$emit('changeChildFormState', true)
                    } else {
                        console.log('error submit!!')
                        this.$emit('changeChildFormState', false)
                    }
                })
            },
            handleConfig () {
                // 配置控件与布局
                this.$message.info('复制表的字段控件，控件可配置顺序，控件列表可插入换行符')
            },
            handleEditChildren (row) {
                // 配置子表
                this.subTableDialogArr.push({state:true,data:row})
                // this.subTableDialog = true
                // console.log('配置子表')
                // console.log(this.childData)
            },
            addFk (row) {
                // 添加外键
                row.push({
                    type: this.BusTableRelFkType.PARENT_FIELD.key
                })
            },
            delFk (index, row) {
                // 删除外键
                row.splice(index, 1)
            },
            //子组件
            cancelTableDialog (data) {
                this.tableDialogSub = data
            },
            saveTableDialog (data) {
                this.tableDialogSub = false
                for (let val of data) {
                    if (!this.handleChildren(val.key_, val.comment_)) {
                        this.relation.children.push({
                            fks: [{
                                from: '',
                                type: 'parentField',
                                value: ''
                            }],
                            tableComment: val.comment_,
                            tableKey: val.key_,
                            type: 'oneToOne'
                        })
                    }
                    if (!this.tableMap.hasOwnProperty(val.tableKey)) {
                        this.$emit('changeTableMap', { tableComment: val.comment_, tableKey: val.key_,})
                    }
                }
            },
            saveTableDialogMap (data) {
                this.$emit('changeTableMap', data)
            },
            changeRelationChild (data) {
                this.relation.children.push(data)
            },
            subTableDialogClick () {
                let index=  this.subTableDialogArr.length-1
                this.subTableDialogArr[index].state=false
                this.subTableDialogArr.splice(index,1)
            },
            // 处理数据
            handleChildren (tableKey, tableComment) {
                // 判断一个children里面是否有重复的表
                let data = this.relation.children
                for (let obj of data) {
                    if (obj.tableKey === tableKey && obj.tableComment === tableComment) {
                        return true
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
