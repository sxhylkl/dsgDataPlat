<template>
    <!--控件配置-->
    <div>
        <el-button type="primary" @click="handleConfig"><i class="fa fa-edit"></i>设置</el-button>
        <el-dialog :title="title" :visible.sync="dialogBtnVisible" :show-close='false' width="30%" append-to-body>
            <div v-if="postRow.ctrl.type==='multitext'">
                <el-row>
                    <el-col :span="10">
                        宽
                        <el-input v-model="configText.ewidth" autocomplete="off"></el-input>
                    </el-col>
                    <el-col :span="10" :offset="2">
                        高
                        <el-input v-model="configText.eheight" autocomplete="off"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div v-else-if="postRow.ctrl.type==='dic'">
                <el-autocomplete
                    popper-class="my-autocomplete"
                    v-model="dicConfig.key"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                </el-autocomplete>
            </div>
            <div v-else-if="postRow.ctrl.type==='date'">
                格式化
                <el-input v-model="date.format" autocomplete="off"></el-input>
            </div>
            <div v-else>
                <el-button type="primary" @click="handleAddConfig"><i class="fa fa-plus"></i>添加</el-button>
                <el-table :data="configArr">
                    <el-table-column label="描述">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.txt"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
                                <el-button type="primary" @click="handleConfigsDel(scope.$index)"><i
                                    class="fa fa-trash"></i>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogBtnVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<!--多行文本multitext{"eheight":"500","ewidth":"150","isEditor":"0"}-流水号(接口调用)-数据字典-->
<script>
    import { getDic } from '@/api/workflow/businessApproval/form/table.js'

    export default {
        name: 'ControlConfig',
        props: ['postRow', 'postIndex'],
        data () {
            return {
                dialogBtnVisible: false,
                title: '字段控件配置',
                configText: {
                    eheight: '',
                    ewidth: '',
                    isEditor: 0
                },
                configArr: [{txt: '', key: ''}],
                date: {format: '', greater: '', less: ''},
                dicConfig: {key: ''},
                dicArr: []
            }
        },
        methods: {
            handleConfig () {
                console.log('++++++++')
                console.log(this.postRow)
                if (this.postRow.ctrl.type === 'dic') {
                    getDic().then(res => {
                        this.dicArr = res.data
                    })
                }
                if (this.postRow.ctrl.type === 'multitext') {
                    this.postRow.ctrl.config.options&&JSON.stringify(this.postRow.ctrl.config.options) !== '{}' ? this.configText = this.postRow.ctrl.config.options : this.configText = {eheight: '', ewidth: '', isEditor: 0}

                } else if (this.postRow.ctrl.type === 'dic') {
                    this.postRow.ctrl.config.options&&JSON.stringify(this.postRow.ctrl.config.options) !== '{}' ? this.dicConfig = this.postRow.ctrl.config.options : this.dicConfig ={key:''}
                } else if (this.postRow.ctrl.type === 'date') {
                    this.date = this.postRow.ctrl.config.options
                } else {
                    this.postRow.ctrl.config.options&&JSON.stringify(this.postRow.ctrl.config.options) !== '{}' ? this.configArr = this.postRow.ctrl.config.options : this.configArr = [{
                        txt: '',
                        key: ''
                    }]
                }
                console.log(this.configArr)
                this.title = `字段[${this.postRow.comment || undefined}]控件配置`
                this.dialogBtnVisible = true
            },
            handleAddConfig () {
                this.configArr.push({txt: '', key: ''})
            },
            handleConfigsDel (index) {
                this.configArr.splice(index, 1)
            },
            save () {
                let data = this.configArr
                if (this.postRow.ctrl.type === 'multitext') {
                    data = this.configText
                } else if (this.postRow.ctrl.type === 'dic') {
                    data = this.dicConfig
                }
                this.$emit('setConfig', {index: this.postIndex, data: data})
                this.dialogBtnVisible = false
            },
            querySearch (queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.dicArr)
            },
            handleSelect (item) {
                this.dicConfig.key = item.name
            },
        }
    }
</script>

<style scoped lang="scss">
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>
