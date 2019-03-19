<!-- 树状选择器 -->
<template>
    <el-popover
        ref="popover"
        placement="bottom-start"
        trigger="click"
        @show="onShowPopover"
        @hide="onHidePopover">
        <el-tree
            ref="tree"
            class="select-tree"
            show-checkbox
            highlight-current
            :check-strictly="true"
            :style="`min-width: ${treeWidth}`"
            :data="data"
            node-key="id"
            :props="props"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :default-expand-all="true"
            @check-change="onClickNode">
        </el-tree>
        <div class="tags-cont"
             ref="input"
             slot="reference"
             :class="{ 'rotate': showStatus }">
            <el-tag
                v-for="tag in labelModel"
                :key="tag.id"
                closable
                type="info"
                @close="handleClose(tag)">
                {{tag.label}}
            </el-tag>
        </div>
    </el-popover>
</template>
<script>
    export default {
        name: 'SelectTree',
        props: {
            // 接收绑定参数
            value: String,
            // 输入框宽度
            width: String,
            // 选项数据
            options: {
                type: Array,
                required: true,
            },
            type: String,
            selectedNode: {
                type: Array
            },
            // 输入框占位符
            placeholder: {
                type: String,
                required: false,
                default: '请选择',
            },
            // 树节点配置选项
            props: {
                type: Object,
                required: false,
                default: () => ({
                    parent: 'parentId',
                    value: 'rowGuid',
                    label: 'areaName',
                    children: 'children',
                }),
            },
        },
        // 设置绑定参数
        model: {
            prop: 'value',
            event: 'selected',
        },
        data () {
            return {
                // 树状菜单显示状态
                showStatus: false,
                // 菜单宽度
                treeWidth: 'auto',
                // 输入框显示值
                labelModel: [],
                // (实际请求传值)默认选中的值
                valueModel: [],
            }
        },
        watch: {
            'type' () {
                console.log('检测变化1')
                this.setDefaultValue()
            },
        },
        computed: {
            // 是否为树状结构数据
            dataType () {
                const jsonStr = JSON.stringify(this.options)
                return jsonStr.indexOf(this.props.children) !== -1
            },
            // 若非树状结构，则转化为树状结构数据
            data () {
                return this.dataType ? this.options : this.switchTree()
            },
        },
        created () {
            console.log('树形菜单初始化')
            console.log(this.selectedNode)
            // 检测输入框原有值并显示对应 label
            this.setDefaultValue()
        },
        methods: {
            // 单击节点
            onClickNode (node, state) {
                if (state) {
                    !this.handleNodeRepeat(node)?this.labelModel.push(node):''
                } else {
                    for (let index in this.labelModel) {
                        if (this.labelModel[index] === node) {
                            this.labelModel.splice(index, 1)
                            return
                        }
                    }
                }
                // this.onCloseTree()
            },
            //判断节点是否被重重选中
            handleNodeRepeat(node){
                for(let val of this.labelModel){
                    if(val===node){
                        return true
                    }
                }
                return false
            },
            // 偏平数组转化为树状层级结构
            switchTree () {
                return this.cleanChildren(this.buildTree(this.options, '0'))
            },
            //删除选中的值
            handleClose (tag) {
                this.onClickNode(tag, false)
                this.setCheckedKeys()
            },
            //设置树形菜单的是否选中事件
            setCheckedKeys () {
                this.labelModel=this.valueModel
                this.$refs.tree.setCheckedNodes(this.valueModel)

            },
            //把默认选中的值写入labelModel 和valueModel
            setDefaultValue () {
                this.showStatus = false
                // 获取输入框宽度同步至树状菜单宽度
                this.valueModel = []
                let data = this.selectedNode
                if (data) {
                    let treeArr = []
                    for (let val of data) {
                        let arr = val.split('/')
                        treeArr.push(this.queryTree(this.data, arr[1]))
                    }
                    this.valueModel = treeArr
                }
                this.$nextTick(() => {
                    this.treeWidth = `${(this.width || this.$refs.input.clientWidth) - 24}px`
                    this.setCheckedKeys()
                })
            },
            // 隐藏树状菜单
            onCloseTree () {
                this.$refs.popover.showPopper = true
            },
            // 显示时触发
            onShowPopover () {
                this.showStatus = true
                this.$refs.tree.filter(false)
            },
            // 隐藏时触发
            onHidePopover () {
                this.showStatus = false
                this.$emit('changeOrg', this.labelModel)
            },
            // 树节点过滤方法
            filterNode (query, data) {
                if (!query) return true
                return data[this.props.label].indexOf(query) !== -1
            },
            // 搜索树状数据中的 ID
            queryTree (tree, id) {
                let stark = []
                stark = stark.concat(tree)
                while (stark.length) {
                    const temp = stark.shift()
                    if (temp[this.props.children]) {
                        stark = stark.concat(temp[this.props.children])
                    }
                    if (temp[this.props.value] === id) {
                        return temp
                    }
                }
                return []
            },
            // 将一维的扁平数组转换为多层级对象
            buildTree (data, id = '0') {
                const fa = (parentId) => {
                    const temp = []
                    for (let i = 0; i < data.length; i++) {
                        const n = data[i]
                        if (n[this.props.parent] === parentId) {
                            n.children = fa(n.rowGuid)
                            temp.push(n)
                        }
                    }
                    return temp
                }
                return fa(id)
            },
            // 清除空 children项
            cleanChildren (data) {
                const fa = (list) => {
                    list.map((e) => {
                        if (e.children.length) {
                            fa(e.children)
                        } else {
                            delete e.children
                        }
                        return e
                    })
                    return list
                }
                return fa(data)
            },
        },
    }
</script>

<style>
    .el-input.el-input--suffix {
        cursor: pointer;
        overflow: hidden;
    }

    .el-input.el-input--suffix.rotate .el-input__suffix {
        transform: rotate(180deg);
    }

    .select-tree {
        max-height: 350px;
        overflow-y: scroll;
    }

    /* 菜单滚动条 */
    .select-tree::-webkit-scrollbar {
        z-index: 11;
        width: 6px;
    }

    .select-tree::-webkit-scrollbar-track,
    .select-tree::-webkit-scrollbar-corner {
        background: #fff;
    }

    .select-tree::-webkit-scrollbar-thumb {
        border-radius: 5px;
        width: 6px;
        background: #b4bccc;
    }

    .select-tree::-webkit-scrollbar-track-piece {
        background: #fff;
        width: 6px;
    }

    .tags-cont {
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
    }

    .tags-cont span {
        margin-right: 5px;
    }
</style>
