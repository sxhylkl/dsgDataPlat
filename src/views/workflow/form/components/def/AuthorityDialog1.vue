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
                        <el-card class="box-card" v-for="(bo,index) in boMap">
                            <div slot="header" class="clearfix">
                                <span>{{bo.name}}({{bo.key}})</span>
                                <el-button style="float: right; padding: 3px 0" type="text">重置</el-button>
                            </div>
                            <div class="card-cont el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition el-table--small">
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
                                        <td><el-button type="primary" title="权限配置" @click="handleConfig('super',bo.key)" ><i class="fa fa-edit"></i></el-button></td>
                                    </tr>
                                </table>
                                <table v-for="relation in bo.allRelations" class="self-table">
                                    <tr >
                                        <td >
                                            <el-tag type="primary">{{BusTableRelTypeKeyMap[relation.type].desc}}</el-tag>
                                        </td>
                                        <td > {{relation.tableComment}}</td>
                                        <td > {{relation.tableKey}}</td>
                                        <td><el-button type="primary" title="权限配置" @click="handleConfig('main',relation.tableKey)"><i class="fa fa-edit"></i></el-button></td>
                                    </tr>
                                    <tr v-for="column in relation.table.columns">
                                        <td v-if="column.key!=='id'" > <el-tag type="info">字段</el-tag></td>
                                        <td v-if="column.key!=='id'" >{{column.comment}}</td>
                                        <td v-if="column.key!=='id'">{{column.key}}</td>
                                        <td v-if="column.key!=='id'"><el-button type="primary" title="权限配置" @click="handleConfig('field',relation.tableKey, column.key)"><i class="fa fa-edit"></i></el-button></td>
                                    </tr>
                                </table>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogState = false">取 消</el-button>
                <el-button type="primary" @click="dialogAuthorityVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { handleParams } from '@/utils/workflow/common.js'
    import { getEnum } from '@/api/workflow/businessApproval/form/table.js'
    import { getBo, getObjectInfo } from '@/api/workflow/businessApproval/form/def.js'

    export default {
        name: 'AuthorityDialog',
        props: ['authorityData', 'dialogState'],
        data () {
            let self = this
            return {
                BusinessPermissionObjType: undefined,
                BusTableRelType: undefined,
                BusTableRelTypeKeyMap: {},
                RightsTypeList: undefined,
                boMap: {}, //字段信息等
                objName: '',
                data: {},//获取的权限配置信息
                currData:{}
            }
        },
        created () {
            self=this
            this.getEnumData({
                path: 'com.dstz.bus.api.constant.BusinessPermissionObjType',
                listMode: false
            }, function (res) {
                self.BusinessPermissionObjType = res
            })
            this.getEnumData({path: 'com.dstz.bus.api.constant.BusTableRelType', listMode: false}, function (res) {
                self.BusTableRelType = res
                for(let key in res){
                    self.BusTableRelTypeKeyMap[res[key].key]=res[key]
                }
                console.log('----BusTableRelTypeKeyMap')
                console.log( self.BusTableRelTypeKeyMap)
            })
            this.getEnumData({path: 'com.dstz.bus.api.constant.RightsType', listMode: false}, function (res) {
                self.RightsTypeList = res
            })
            this.data = {}
            this.data.objType = this.authorityData.objType
            this.data.objVal = this.authorityData.objVal
            this.getObjectInfoData({objType: 'form', objVal: this.authorityData.objVal})
        },
        methods: {
            getEnumData (obj, fn) {//赋值的key
                const params = handleParams(obj)
                getEnum(params).then(res => {
                    fn(res)
                })
            },
            getBoData (obj) {
                let params = handleParams(obj)
                getBo(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.boMap = res.data
                    console.log('boMap')
                    console.log(this.boMap)
                    this.handleBoData()

                })
            },
            getObjectInfoData (obj) {
                getObjectInfo(obj).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.data = res.data
                    console.log('data')
                    console.log(this.data)
                    this.getBoData({boKeys: this.authorityData.boKeys})
                })
            },
            handleConfig(type,key,field){//类型 ,键,字段
                console.log('获取权限的key')
                console.log(key)
                switch(type)
                {
                    case 'super':
                        console.log(key)
                        
                        break;
                    case 'main':
                        console.log(key)
                        break;
                    case 'field':
                        console.log(key,field)
                }
                //    获取key
            },
            //  处理数据
            handleBoData () {
                let data = self.boMap
                if (!data) {
                    return
                }
                for (let key in data) {
                    let allRelations = []
                    traverse(data[key].relation, 'children', function (node) {
                        allRelations.push(node)
                    })
                    data[key].allRelations = allRelations
                }
                console.log('第一次处理完')
                console.log(self.boMap)
                self.handelColData()

                /*if (!self.data.id) {// id为空才重置数据
                    self.resetDataWithBo()
                } else {// 不为空触发一次合并数据
                    self.mergeData()
                }*/

                function traverse (node, nodeAttrName, callback) {
                    if (!node) {
                        return
                    }
                    callback(node)

                    // 递归
                    if (node[nodeAttrName] && node[nodeAttrName].length > 0) {
                        for (var i = 0; i < node[nodeAttrName].length; i++) {
                            traverse(node[nodeAttrName][i], nodeAttrName, callback)
                        }
                    }
                }
            },
            //获取字段信
            handelColData(){
                for(let key in self.boMap){
                    for(let relation of self.boMap[key].allRelations){
                        let colObj=self.boMap[key].relation
                        console.log(key)
                        console.log(colObj)
                        if(relation.table.$ref&&colObj.children.length>0){
                            let str=relation.table.$ref.replace(/[^0-9]/ig,"");
                            for(let i=0;i<str.length;i++){
                                colObj=colObj.children[str.charAt(i)]
                            }
                            console.log('colObj')
                            console.log(colObj)
                            if(colObj){
                                relation.table=colObj.table
                            }else {
                                relation.table={}
                            }
                        }
                    }
                }

                console.log('获取字段次处理完')
                console.log(self.boMap)
            },
            /**
             * 根据bo重置数据
             */
            resetDataWithBo () {
                console.log('进入resetDataWithBo')
                this.$set(self.data, 'busObjMap', {})
                for (let key in self.boMap) {
                    let busObj = {}
                    busObj.key = self.boMap[key].key
                    busObj.name = self.boMap[key].name
                    // 只有bo设置默认数据
                    busObj.rights = {
                        w: [{
                            type: 'everyone',
                            desc: '所有人'
                        }]
                    }
                    busObj.tableMap = {}
                    // 根据bo生成初始化tableMap
                    for (let k in  self.boMap[key].allRelations) {
                        let table = {}
                        table.key = self.boMap[key].allRelations[k].tableKey
                        table.comment = self.boMap[key].allRelations[k].tableComment
                        table.rights = {}

                        // 处理字段
                        table.columnMap = {}
                        if(self.boMap[key].allRelations[k].table.$ref&&self.boMap[key].allRelations[k].children.length>0){
                            console.log('***********************000')
                            console.log(self.boMap[key].allRelations[k].table.$ref)
                            let str=self.boMap[key].allRelations[k].table.$ref.replace(/[^0-9]/ig,"");
                            let colObj=self.boMap[key].allRelations[k]
                            console.log('***********************111')
                            console.log(colObj)
                            for(let i=0;i<str.length;i++){
                                colObj=colObj.children[str.charAt(i)]
                            }
                            console.log(colObj)
                            if(colObj&&colObj.table){
                                let column = {}
                                column.key = colObj.table.key
                                column.comment = colObj.table.comment
                                column.rights = {}
                                table.columnMap[column.key] = column
                                busObj.tableMap[table.key] = table
                            }

                        }


                    }
                    self.data.busObjMap[key] = busObj
                    console.log('resetDataWithBo处理结束')
                    console.log(self.data)
                }
            },
            mergeData () {
                let  dataTemp = JSON.parse(JSON.stringify(self.data))// 备份加载出来的数据
                self.resetDataWithBo()// 根据Bo刷新出新的数据 $scope.data
                // 合并bo
                for(let boKey in self.data.busObjMap) {
                    let bo=self.data.busObjMap[boKey]
                    let boTemp = dataTemp.busObjMap[boKey]
                    if (!boTemp) {
                        return
                    }
                    bo.rights = boTemp.rights

                    // 合并bo中的表
                    for(let tableKey in bo.tableMap){
                        let table= bo.tableMap[tableKey]
                        let tableTemp = dataTemp.busObjMap[boKey].tableMap[tableKey]
                        if (!tableTemp) {
                            return
                        }
                        table.rights = tableTemp.rights

                        // 合并bo中的表的字段
                        for(let columnName in  table.columnMap) {
                            let column=table.columnMap[columnName]
                            let columnTemp = dataTemp.busObjMap[boKey].tableMap[tableKey].columnMap[columnName]
                            if (!columnTemp) {
                                return
                            }
                            column.rights = columnTemp.rights
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .self-table{
        width: 100%;
    }
    th,td{
        text-align: center;
    }
    td{
        width: 300px;
    }
</style>
