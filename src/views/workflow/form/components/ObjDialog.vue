<template>
    <el-dialog :title="title" :visible.sync="dialogObjVisible" :show-close='false' width="75%">
        <div class="dialog-cont">
            <el-form :model="data" :rules="rules" ref="form">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="分类" :label-width="labelWidth" prop="groupName">
                            <el-autocomplete
                                class="inline-input"
                                v-model="data.groupName"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                @select="handleSelect">
                                <template slot-scope="{item}">
                                    <div class="name">{{ item.name }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="持久化方式" :label-width="labelWidth" prop="persistenceType">
                            <el-select v-model="data.persistenceType" placeholder="请选择">
                                <el-option
                                    v-for="item in BusinessObjectPersistenceType"
                                    :key="item.key"
                                    :label="item.desc"
                                    :value="item.key">
                                    <span>{{ item.desc }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="名字" :label-width="labelWidth" prop="name">
                            <el-input v-model="data.name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="对象名" :label-width="labelWidth" prop="key">
                            <el-input v-model="data.key" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="描述" :label-width="labelWidth">
                            <el-input v-model="data.desc" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-form-item label="主业务表" :label-width="labelWidth">
                            <el-tag v-if="data.relation.tableComment||data.relation.tableKey">
                                {{data.relation.tableComment}}({{data.relation.tableKey}})
                            </el-tag>
                            <el-button type="primary" @click="selectMainTable"><i class="fa fa-search"></i>选择
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <sub-table ref="subTable"
                                   :relation="data.relation"
                                   @changeTableMap="changeTableMap"
                                   @changeChildFormState="changeChildFormState"
                                   :BusTableRelFkType="BusTableRelFkType"
                                   :BusTableRelType="BusTableRelType"
                                   :tableMap="tableMap">
                        </sub-table>
                    </el-col>
                </el-row>
            </el-form>
            <table-dialog v-if="tableDialog"
                          :tableDialog="tableDialog"
                          :mainTable=true
                          :objRelation=data.relation
                          @cancelTableDialog="cancelTableDialog"
                          @saveTableDialog="saveTableDialog"></table-dialog>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import TableDialog from './TableDialog'
    import SubTable from './SubTable'
    import { handleParams } from '@/utils/workflow/common.js'
    import { getEnum, getObjectInfo } from '@/api/workflow/businessApproval/form/table.js'

    export default {
        name: 'ObjDialog',
        components: {
            TableDialog,
            SubTable,
        },
        props: ['data', 'treeData', 'title', 'dialogObjVisible'],
        data () {
            let varirule = (rule, value, callback) => {
                if (!/^[a-zA-Z]\w*$/.test(value)) {
                    return callback(new Error('只能为字母开头,允许字母、数字和下划线'))
                }
                callback()
            }
            return {
                labelWidth: '120px',
                BusTableRelType: null,
                BusTableRelFkType: null,
                BusinessObjectPersistenceType: null,
                tableDialog: false,
                tableMap: {},
                childFormState: false,
                rules: {
                    groupName: [{required: true, message: '必填', trigger: 'change'}],
                    persistenceType: [{required: true, message: '必填', trigger: 'change'}],
                    name: [{required: true, message: '必填', trigger: 'blur'}],
                    key: [{required: true, message: '必填', trigger: 'blur'}, {validator: varirule, trigger: 'blur'}]
                }

            }
        },
        created () {
            this.getEnumData({path: 'com.dstz.bus.api.constant.BusTableRelType', listMode: false}, 'BusTableRelType')
            this.getEnumData({
                path: 'com.dstz.bus.api.constant.BusTableRelFkType',
                listMode: false
            }, 'BusTableRelFkType')
            this.getEnumData({
                path: 'com.dstz.bus.api.constant.BusinessObjectPersistenceType',
                listMode: false
            }, 'BusinessObjectPersistenceType')
            this.handleChildren()
        },
        methods: {
            //获取数据
            getEnumData (obj, key) {
                let params = handleParams(obj)
                getEnum(params).then(data => {
                    this[key] = data
                })
            },
            getObjectInfo (key, obj) {
                //获取主业务表的信息
                console.log('获取主表信息')
                getObjectInfo(obj).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    if (!this.tableMap.hasOwnProperty(key)) {
                        this.$set(this.tableMap, key, res.data)
                    }
                    console.log('tableMap')
                    console.log(this.tableMap)
                })
            },
            save () {
                console.log('第二层的结果')
                console.log(this.data)
                this.$refs.subTable.$emit('validateForm')
                this.$refs['form'].validate((valid) => {
                    if (valid && this.childFormState) {
                        this.$emit('save')
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            cancel () {
                this.$emit('cancel')
            },
            //input事件
            querySearch (queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.treeData)
            },
            handleSelect (item) {
                this.data.groupName = item.name
                this.data.groupId = item.id
            },
            // 事件操作
            selectMainTable () {
                //主业务表选择
                this.tableDialog = true
            },
            // 子组件事件
            cancelTableDialog (data) {
                this.tableDialog = data
            },
            saveTableDialog (data) {
                this.tableDialog = false
                if (data.tableKey && data.tableComment) {
                    this.data.relation.tableKey = data.tableKey
                    this.data.relation.tableComment = data.tableComment
                    this.data.relation.type = 'main'
                    this.getObjectInfo(data.tableKey, {key: data.tableKey, fill: true})
                }
            },
            changeTableMap (data) {
                this.getObjectInfo(data.tableKey, {key: data.tableKey, fill: true})
            },
            changeChildFormState (data) {
                // 子组件表单验证的状态
                this.childFormState = data
            },
            // 数据处理
            handleChildren () {
                let self=this
                function cycle (data) {
                    console.log('h000000000000000000')
                    console.log(data)
                    for (let index in data) {
                        console.log(index)
                        self.getObjectInfo(data[index].tableKey, {key: data[index].tableKey, fill: true})
                        if (data[index].children) {
                            cycle(data[index].children)
                        }
                    }
                }

                if (self.data.relation.children) {
                    self.getObjectInfo(self.data.relation.tableKey, {key: self.data.relation.tableKey, fill: true})
                    cycle(this.data.relation.children)
                }
            }
        }

    }
</script>

<style scoped>

</style>
