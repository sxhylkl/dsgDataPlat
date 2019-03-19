<template>
    <div class="config-cont">
        <el-dialog title="权限配置" :inline="true" :visible.sync="dialogConfigVisible" :show-close="false" width="35%">
            <el-form :model="form">
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="form.type" placeholder="请选择" @change="changeType">
                        <el-option
                            v-for="item in RightsTypeList"
                            v-if="item.dbReadable"
                            :key="item.key"
                            :label="item.desc"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所有人" :label-width="formLabelWidth">
                    <el-switch v-model="form.delivery" @change="every"></el-switch>
                </el-form-item>
                <el-form-item v-show="!form.delivery" label="组织" :label-width="formLabelWidth">
                    <!-- <el-input v-model="form.org.desc" placeholder="请选择"></el-input>
                     <el-button type="primary">选择</el-button>-->
                    <select-tree v-if="treeState" @changeOrg="changeOrg" :selectedNode="form.org.value"
                                 :type="form.type" :options="orgList" :props="defaultProps"/>
                </el-form-item>
                <el-form-item v-show="!form.delivery" label="岗位" :label-width="formLabelWidth">
                    <!-- <el-input v-model="form.post.desc" placeholder="请选择"></el-input>
                     <el-button type="primary">选择</el-button>-->
                    <el-select
                        v-model="form.post.value"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        @change="selectChange('post')"
                        placeholder="请选择">
                        <el-option
                            v-for="item in postList"
                            :key="item.rel_code_"
                            :label="item.rel_name_"
                            :value="item.rel_name_+'/'+item.id_">
                            <span style="float: left">{{ item.rel_name_ }}({{item.rel_def_name_}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="!form.delivery" label="角色" :label-width="formLabelWidth">
                    <!-- <el-input v-model="form.role.desc" placeholder="请选择"></el-input>
                     <el-button type="primary">选择</el-button>-->
                    <el-select
                        v-model="form.role.value"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        @change="selectChange('role')"
                        placeholder="请选择">
                        <el-option
                            v-for="item in roleList"
                            :key="item.id_"
                            :label="item.name_"
                            :value="item.name_+'/'+item.id_">
                            <span style="float: left">{{ item.name_ }}({{item.alias_}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="!form.delivery" label="用户" :label-width="formLabelWidth">
                    <el-select
                        v-model="form.user.value"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        @change="selectChange('user')"
                        placeholder="请选择文章标签">
                        <el-option
                            v-for="item in userList"
                            :key="item.id_"
                            :label="item.fullname_"
                            :value="item.fullname_+'/'+item.id_">
                            <span style="float: left">{{ item.fullname_ }}({{item.account_}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="!form.delivery" label="脚本" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.script.desc" placeholder="请输入"
                              @change="scriptChange"></el-input>
                </el-form-item>
                <!-- <el-form-item label="编辑" :label-width="formLabelWidth">
                     <el-select
                         v-model="value10"
                         multiple
                         filterable
                         allow-create
                         default-first-option
                         placeholder="请选择文章标签">
                         <el-option label="区域一" value="shanghai">所有人</el-option>
                         <el-option
                             v-for="item in options5"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                         </el-option>
                     </el-select>
                 </el-form-item>
                 <el-form-item label="只读" :label-width="formLabelWidth">
                     <el-select
                         v-model="value10"
                         multiple
                         filterable
                         allow-create
                         default-first-option
                         placeholder="请选择文章标签">
                         <el-option label="区域一" value="shanghai">所有人</el-option>
                         <el-option
                             v-for="item in options5"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                         </el-option>
                     </el-select>
                 </el-form-item>
                 <el-form-item label="脚本">
                     <el-input type="textarea" v-model="form.desc"></el-input>
                 </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import SelectTree from '@/components/select-tree/index.vue'
    // import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { handleParams } from '@/utils/workflow/common.js'
    import { toTreeData } from '@/utils/workflow/tree.js'
    import { getOrg, getPost, getRole, getUser } from '@/api/workflow/businessApproval/form/def.js'

    export default {
        name: 'AuthorityConfigDialog',
        props: ['rights', 'RightsTypeList', 'dialogConfigVisible'],
        components: {
            SelectTree
        },
        data () {
            return {
                // 默认选中值
                selected: '1',
                // 数据默认字段
                defaultProps: {
                    parent: 'parentId',   // 父级唯一标识
                    value: 'id',          // 唯一标识
                    label: 'label',       // 标签显示
                    children: 'children', // 子级
                },
                // 数据列表
                options: [
                    {
                        parentId: '0',
                        id: 'A',
                        label: 'label-A',
                        children: [
                            {
                                parentId: 'A',
                                id: 'A-1',
                                label: 'label-A-1',
                            },
                        ],
                    },
                    {
                        parentId: '0',
                        value: 'B',
                        label: 'label-B',
                        children: [],
                    },
                ],
                query: {
                    order: 'asc',
                    offset: '0',
                    limit: 9999
                },
                userList: [],
                roleList: [],
                postList: [],
                orgList: [],
                formLabelWidth: '80px',
                rightsData: undefined,
                treeState: false,
                form: {
                    type: 'b',
                    desc: '',
                    delivery: false,
                    org: {id: [], type: 'org', desc: [], value: []},
                    post: {id: [], type: 'post', desc: [], value: []},
                    role: {id: [], type: 'role', desc: [], value: []},
                    user: {id: [], type: 'user', desc: [], value: []},
                    script: {id: '', type: 'script', desc: ''},
                },

            }
        },
        created () {
            this.rightsData = JSON.parse(JSON.stringify(this.rights))
            this.getOrgListData()
            this.getUserListData()
            this.getRoleListData()
            this.getPostListData()
            this.handleType(this.form.type)
        }
        ,
        methods: {
            //获取数据
            getOrgListData () {
                let params = handleParams(this.query)
                getOrg(params).then(res => {
                    console.log('获取树形菜单')
                    console.log(res)
                    this.orgList = toTreeData(res, {
                        id: 'id_',
                        parentId: 'parent_id_',
                        name: 'name_',
                        rootId: '0'
                    })
                    this.treeState = true
                })
            },
            getUserListData () {
                let params = handleParams(this.query)
                getUser(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.userList = res.rows
                })
            },
            getRoleListData () {
                let params = handleParams(this.query)
                getRole(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.roleList = res.rows
                })
            },
            getPostListData () {
                let params = handleParams(this.query)
                getPost(params).then(res => {
                    if (res.code !== '200') {
                        this.$message.error(res.msg)
                        return false
                    }
                    this.postList = res.rows
                })
            },
            every (data) { //所有人可操作
                if (data) {
                    this.rightsData[this.form.type] = [{
                        'type': 'everyone',
                        'desc': '所有人'
                    }]
                } else {
                    this.rightsData[this.form.type] = [{
                        'type': 'none',
                        'desc': '无'
                    }]
                }
            },
            changeType (key) {
                this.initForm()
                if (Array.isArray(this.rightsData[key])) {
                    let data = this.rightsData[key]
                    for (var ri of data) {
                        let val = ri
                        console.log(val)
                        if (val.type === 'everyone') {
                            this.form.delivery = true
                        } else {
                            this.form.delivery = false
                        }
                        if (val.type !== 'everyone' && val.type !== 'none') {
                            this.form[val.type].id = val.id
                            this.form[val.type].type = val.type
                            this.form[val.type].desc = val.desc
                            this.form[val.type].value = []
                            for (let index in val.id) {
                                this.form[val.type].value.push(val.desc[index] + '/' + val.id[index])
                            }
                        }
                        console.log(this.form)

                    }
                }

            },
            /*
             * 当前select的值改变
             * */
            selectChange (type) {
                this.handleRights(type)
                this.handleForm(type)
            },
            // 接收SelectTree的值
            changeOrg (data) {
                console.log('树形组件传来的值')
                this.form.org.value = []
                for (let val of data) {
                    this.form.org.value.push(val.label + '/' + val.id)
                }
                this.selectChange('org')
            },
            scriptChange () {
                this.handleRights('script')
                this.rightsData[this.form.type].push(this.form.script)
            },

            /*
             * 当前select的值改变时把值写入rightsData
             * */
            handleForm (type) {
                let id = [], desc = []
                console.log(this.form[type].value)
                for (let val of  this.form[type].value) {
                    let arr = val.split('/')
                    desc.push(arr[0])
                    id.push(arr[1])
                }
                this.rightsData[this.form.type].push({id: id, type: type, desc: desc})
            },

            /*
             * 当前select的值改变时清除rightsData
             * type:配置类型(org,role,user,script....)
             * */
            handleRights (type) {
                if (!this.rightsData.hasOwnProperty(this.form.type)) {
                    this.rightsData[this.form.type] = []
                    return
                }
                for (let index in this.rightsData[this.form.type]) {
                    let data = this.rightsData[this.form.type][index]
                    if (data.type === 'none') {
                        this.rightsData[this.form.type] = []
                        return false
                    }
                    if (data.type === type) {
                        this.rightsData[this.form.type].splice(index, 1)
                        return false
                    }
                }

            },
            cancel () {
                this.$emit('saveConfigDialog')
            },
            save () {
                this.$emit('saveConfigDialog', this.rightsData)
                console.log('确定按钮')
                console.log(this.rightsData)
            },
            // 处理数据
            handleType (type) {
                let data = this.rightsData[type]
                for (let key in data) {
                    if (data[key].type === 'everyone') {
                        this.form.delivery = true
                    } else {
                        this.form.delivery = false
                        this.form[data[key].type] = data[key]
                    }
                    if (data[key].type !== 'everyone' && data[key].type !== 'none') {
                        this.form[data[key].type] = data[key]
                    }
                }
                this.changeType(this.form.type)
                /*this.$nextTick(() => {
                 this.form.type='b'
                 })*/

            },
            initForm () {
                this.form.org = {id: '', type: 'org', desc: ''}
                this.form.post = {id: [], type: 'post', desc: [], value: []}
                this.form.role = {id: [], type: 'role', desc: [], value: []}
                this.form.user = {id: [], type: 'user', desc: [], value: []}
                this.form.script = {id: '', type: 'script', desc: ''}
            }
        }
        ,
    }
</script>

<style scoped>
    .el-input {
        width: 230px;
    }
</style>
