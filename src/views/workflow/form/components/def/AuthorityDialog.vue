<template>
    <div>
        <el-dialog
            title="业务权限"
            width="75%"
            :visible.sync="dialogState"
            :show-close="false">
            <div class="dialog-cont">
                <el-form label-width="120px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="权限对象类型">
                                <el-input v-model="authorityData.objType" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="权限对象值">
                                <el-input v-model="authorityData.objVal" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="24">
                        <el-card v-if="!data.busObjMap" class="box-card">
                            <div style="margin: 50px 0">
                                <span class="el-table__empty-text">暂无数据</span>
                            </div>
                        </el-card>
                        <el-card v-if="data.busObjMap" class="box-card" v-for="bo in data.busObjMap">
                            <div slot="header" class="clearfix">
                                <span>{{bo.name}}({{bo.key}})</span>
                                <el-button style="float: right; padding: 3px 0" type="text">重置</el-button>
                            </div>
                            <div class="card-cont el-table el-table--fit el-table--border
                            el-table--scrollable-x el-table--enable-row-transition el-table--small">
                                <table class="self-table">
                                    <tr>
                                        <th>类型</th>
                                        <th>名称</th>
                                        <th>别名</th>
                                        <th>操作</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag type="success">业务对象</el-tag>
                                        </td>
                                        <td> {{bo.name}}</td>
                                        <td> {{bo.key}}</td>
                                        <td>
                                            <el-button type="primary" title="权限配置" @click="handleConfig(bo)"><i
                                                class="fa fa-edit"></i></el-button>
                                        </td>
                                    </tr>
                                </table>
                                <table v-for="tm in bo.tableMap" class="self-table">
                                    <tr>
                                        <td>
                                            <!--<el-tag type="primary">{{BusTableRelTypeKeyMap[relation.type].desc}}</el-tag>-->
                                            <el-tag type="primary">表</el-tag>
                                        </td>
                                        <td> {{tm.comment}}</td>
                                        <td> {{tm.key}}</td>
                                        <td>
                                            <el-button type="primary" title="权限配置" @click="handleConfig(tm)"><i
                                                class="fa fa-edit"></i></el-button>
                                        </td>
                                    </tr>
                                    <tr v-for="column in tm.columnMap">
                                        <td>
                                            <el-tag type="info">字段</el-tag>
                                        </td>
                                        <td>{{column.comment}}</td>
                                        <td>{{column.key}}</td>
                                        <td>
                                            <el-button type="primary" title="权限配置" @click="handleConfig(column)"><i
                                                class="fa fa-edit"></i></el-button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
        <authority-config-dialog v-if="dialogConfigVisible"
                                 :rights="currData.rights"
                                 :RightsTypeList="RightsTypeList"
                                 :dialogConfigVisible="dialogConfigVisible"
                                 @saveConfigDialog="saveConfigDialog">

        </authority-config-dialog>
    </div>
</template>

<script>
    import AuthorityConfigDialog from './AuthorityConfigDialog'
    import { handleParams } from '@/utils/workflow/common.js'
    import { getEnum } from '@/api/workflow/businessApproval/form/table.js'
    import { getBo, getObjectInfo } from '@/api/workflow/businessApproval/form/def.js'

    export default {
        name: 'AuthorityDialog',
        components: {
            AuthorityConfigDialog
        },
        props: ['authorityData', 'dialogState'],
        data () {
            let self = this
            return {
                BusinessPermissionObjType: undefined,
                BusTableRelType: undefined,
                BusTableRelTypeKeyMap: {},
                RightsTypeList: undefined,
                boMap: null, //字段表信息
                objName: '',
                data: {},//获取的权限配置信息
                currData: {},
                dialogConfigVisible: false
            }
        },
        created () {
            self = this
            this.getEnumData({
                path: 'com.dstz.bus.api.constant.BusinessPermissionObjType',
                listMode: false
            }, function (res) {
                self.BusinessPermissionObjType = res
            })
            this.getEnumData({path: 'com.dstz.bus.api.constant.BusTableRelType', listMode: false}, function (res) {
                self.BusTableRelType = res
                for (let key in res) {
                    self.BusTableRelTypeKeyMap[res[key].key] = res[key]
                }
                console.log('----BusTableRelTypeKeyMap')
                console.log(self.BusTableRelTypeKeyMap)
            })
            this.getEnumData({path: 'com.dstz.bus.api.constant.RightsType', listMode: false}, function (res) {
                self.RightsTypeList = res
            })
            this.data = {}
            this.data.objType = this.authorityData.objType
            this.data.objVal = this.authorityData.objVal
            this.getObjectInfoData({objType: this.authorityData.objType, objVal: this.authorityData.objVal})
            console.log('父组件传来的值')
            console.log(this.authorityData)
        },
        methods: {
            // 获取基础数据信息
            getEnumData (obj, fn) {//赋值的key
                const params = handleParams(obj)
                getEnum(params).then(res => {
                    fn(res)
                })
            },
            // 获取业务对象信息
            getObjectInfoData (obj) {
                getObjectInfo(obj).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    if (!res.data) {
                        // this.$message(res.msg||'暂无数据')
                        this.getBoData({boKeys: this.authorityData.boKeys})//（如果获取不到数据就调用此接口）
                        return false
                    }
                    this.data = res.data
                })
            },
            // 获取业务对象原始信息(如果getObjectInfoData获取不到数据就从这儿获取数据)-该方法还没使用（是否会出现某个没数据）
            getBoData (obj) {
                let params = handleParams(obj)
                getBo(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    console.log(res)
                    this.boMap = res.data
                   this.data=this.handleDataObj(res.data)
                    //  把数据处理为 getObjectInfo返回数据的格式存入data
                })
            },
            handleConfig (data) {//类型 ,键,字段
                console.log(data)
                this.currData = data
                this.dialogConfigVisible = true
            },
            cancel () {
                this.$emit('cancelPermissionDialog')
            },
            save () {
                this.$emit('savePermissionDialog', this.data)
            },
            // 子组件
            saveConfigDialog (data) {
                this.dialogConfigVisible = false
                console.log('子组件')
                console.log(this.currData)
                if (data) {
                    console.log('为真')
                    this.currData.rights = data
                    this.handelCurrData()
                }
            },
            //  处理数据
            handelCurrData () {
                if (!(this.data && this.data.busObjMap)) {
                    return
                }
                for (let bo in this.data.busObjMap) {
                    let boData = this.data.busObjMap[bo]
                    if (bo === this.currData.key) {
                        boData = this.currData
                        break
                    }
                    for (let tm  in boData.tableMap) {
                        let tmData = boData.tableMap[tm]
                        if (tm === this.currData.key) {
                            tmData = this.currData
                            break
                        }
                        for (let col in tmData.columnMap) {
                            let column = tmData.columnMap
                            if (col === this.currData.key) {
                                column = this.currData
                            }
                        }

                    }
                }
                console.log('处理完成之后')
                console.log(this.data)
            },
            // 把数据处理为getObjectInfo返回数据的格式存入data
            handleDataObj (data) {
                let busObjMap = {}
                let obj = {
                    objType: 'form',
                    objVal: '',
                    busObjMap:busObjMap
                }
                for (let key in data) {
                    let relation = data[key].relation
                    obj.objVal = data[key].key
                    busObjMap[key]={
                        key:data[key].key,
                        name:data[key].name,
                        rights:{},
                        tableMap:{}
                    }
                    busObjMap[key].tableMap[relation.tableKey]={
                        key:relation.tableKey,
                        comment:relation.tableComment,
                        rights:{},
                        columnMap:{}
                    };
                    let columnMap=busObjMap[key].tableMap[relation.tableKey].columnMap
                    let columns=relation.table.columns
                    for(let col of columns){
                        if(col.comment=='主键'){
                            continue
                        }
                        columnMap[col.key]={
                            comment:col.comment,
                            key:col.key,
                            rights:{}
                        }
                    }
                    //  处理children(暂时没有child的数据)
                    if(relation.children){

                    }
                }
                console.log('数据处理完成')
                console.log(obj)
                return obj
            }

        }
    }
</script>

<style scoped>
    .self-table {
        width: 100%;
    }

    th, td {
        text-align: center;
    }

    td {
        width: 300px;
    }
</style>
