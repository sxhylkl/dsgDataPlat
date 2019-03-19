<template>
  <el-col :span="6" id="leftDiv" @keyup.native.enter="saveInputNode" @keyup.native.esc="initTree">
    <div
      class="grid-content bg-purple"
      style="margin-right: 10px"
      :class="{addTree:booleanInput}"
      v-loading="loading"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{params.name}}目录</span>
          <div style="float: right" v-show="!btnState&&!isDataSource">
            <el-button
              style="padding:0;margin-right:10px;border:none"
              :title="params.name"
              @click="append"
            >
              <i class="fa fa-plus"></i>
            </el-button>
            <excel-import-export style="float:right" :type="params.type" @uploaded="uploaded"></excel-import-export>
          </div>
        </div>
        <div>
          <div>
            <el-input
              placeholder="搜索目录,分类"
              v-model="searchWord"
              @click.native.enter="searchEnter"
              style="margin-top: 10px;margin-bottom: 10px"
            ></el-input>
            <el-tree
              id="tree"
              class="filter-tree leftTree"
              :data="treeData"
              node-key="id"
              :props="defaultProps"
              :default-expanded-keys="nodeId"
              highlight-current
              @node-click="nodeClick"
              :expand-on-click-node="false"
              :render-content="renderContent"
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
          </div>
        </div>
      </el-card>
    </div>
  </el-col>
</template>

<script>
import { getTree, createNode, updateNode, deleteNode } from '@/api/tree/index'
import ExcelImportExport from '@/components/ExcelImportExport'
export default {
  name: 'myTree',
  components: {
    ExcelImportExport
  },
  // btnState/ture 按钮不显示
  props: ['params', 'isDataSource', 'btnState'],
  data () {
    return {
      booleanInput: false,
      treeData: [],
      loading: false,
      chooseData: null,
      chooseNode: {},
      searchWord: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeId: []
    }
  },
  methods: {
    searchEnter () {
      this.$refs.tree.filter(this.searchWord)
    },
    // 初始化树
    initTree () {
      this.loading = true
      getTree(this.params.type).then(res => {
        this.loading = false
        this.booleanInput = false
        this.dataResp(res, () => {
          this.treeData = res.data
          const nodeId = this.$route.query.nodeId
          if (nodeId) {
            this.nodeId = []
            this.nodeId.push(nodeId)
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(nodeId)
            })
          }
          if (this.chooseNode.id) {
            this.nodeId = []
            this.nodeId.push(this.chooseNode.id)
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.chooseNode.id)
            })
          }
        })
      })
    },
    //树的点击事件
    nodeClick (data, node, tree) {
      this.chooseNode = data
      console.log(data)
      this.$emit('nodeClick', data, node, tree)
    },
    //树形图自定义
    renderContent (h, { node, data, store }) {
      if (!this.btnState) {
        if (data.input == undefined || data.input === false) {
          if (this.isDataSource) {
            if (node.level === 1) {
              return (
                <span class='span-node' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                  <span>
                    <el-badge value={data.children.length > 0 ? data.children.length : ''} class="tree-node-item">
                      <span title={node.label}>{node.label}</span>
                    </el-badge>
                  </span>
                </span>);
            } else if (node.level === 2) {
              return (
                <span class='span-node' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                  <span>
                    <el-badge value={data.children.length > 0 ? data.children.length : ''} class="tree-node-item">
                      <span title={node.label}>{node.label}</span>
                    </el-badge>
                  </span>
                  <span >
                    <el-button style='font-size:12px' title='创建子目录' type='text' on-click={() => this.append(node, data)}><i class="el-icon-circle-plus-outline"></i></el-button>
                  </span>
                </span>);
            } else {
              return (
                <span class='span-node' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                  <span>
                    <el-badge value={data.children.length > 0 ? data.children.length : ''} class="tree-node-item">
                      <span title={node.label}>{node.label}</span>
                    </el-badge>
                  </span>
                  <span >
                    <el-button style='font-size:12px' title='修改目录' type='text' on-click={() => this.updateNodeModal(node, data)}><i class="el-icon-edit"></i></el-button>
                    <el-button style='font-size:12px' title='创建子目录' type='text' on-click={() => this.append(node, data)}><i class="el-icon-circle-plus-outline"></i></el-button>
                    <el-button style='font-size:12px' title='删除目录' type='text' on-click={() => this.deleteNode(node, data)}><i class="el-icon-delete"></i></el-button>
                  </span>
                </span>);
            }
          } else {
            return (
              <span class='span-node' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                  <el-badge value={data.children.length > 0 ? data.children.length : ''} class="tree-node-item">
                    <span title={node.label}>{node.label}</span>
                  </el-badge>
                </span>
                <span >
                  <el-button style='font-size:12px' title='修改目录' type='text' on-click={() => this.updateNodeModal(node, data)}><i class="el-icon-edit"></i></el-button>
                  <el-button style='font-size:12px' title='创建子目录' type='text' on-click={() => this.append(node, data)}><i class="el-icon-circle-plus-outline"></i></el-button>
                  <el-button style='font-size:12px' title='删除目录' type='text' on-click={() => this.deleteNode(node, data)}><i class="el-icon-delete"></i></el-button>
                </span>
              </span>);
          }
        } else {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span><input value={data.name} id='tree-input' on-blur={() => this.saveInputNode()}></input></span>
              </span>
            </span>
          )
        }
      } else {
        return (
          <span class='span-node' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <el-badge value={data.children.length > 0 ? data.children.length : ''} class="tree-node-item">
                <span>{node.label}</span>
              </el-badge>
            </span>
          </span>);
      }
    },
    // 添加节点操作
    append (node, data) {
      if (this.booleanInput) return false
      this.expandNode(node, data)
      let entity = {};
      let id = new Date().getTime().toString()
      if (data === undefined) {
        this.$emit('nodeClick', 1)
        let resData = { name: '根节点需修改', parent_id: '-1' }
        this.booleanInput = true
        this.chooseData = Object.assign(resData)
        const newChild = { name: '根节点需修改', children: [], input: true };
        this.treeData.push(newChild)
        // 展开当前点击的节点
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(id);
          this.setFocus();
        })
      } else {
        entity = { name: '子节点', parent_id: data.id };
        const newChild = { name: '子节点', children: [], input: true };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        this.chooseData = entity
        this.booleanInput = true
        data.children.push(newChild);
        // 展开当前点击的节点
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(id);
          this.setFocus();
        })
      }
    },
    // 取消选中
    cancelCheck () {
      this.$refs.tree.setCurrentKey(null);
      // this.$emit('nodeClick', null, null, null)
    },
    // 展开某个节点
    expandNode (node, data) {
      if (!data || node.expanded) return;
      this.$refs.tree.store.nodesMap[data.id].expanded = true;
    },
    // 更新节点操作
    updateNodeModal (node, data) {
      console.log(data)
      const name = data.name
      if (this.booleanInput) return false
      this.booleanInput = true
      data.input = true
      data.name = ` ${name}`
      this.chooseData = data
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(data.id);
        this.setFocus();
      })
    },
    // 删除树状节点
    deleteNode (node, data) {
      if (this.booleanInput) return false
      const id = data.id
      if (data.children.length > 0) {
        this.$message.warning('该目录拥有子节点无法删除')
        return;
      }
      this.$confirm('是否删除该目录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNode(id).then(res => {
          this.dataResp(res, () => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.$emit('nodeClick', null)
            this.initTree()
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 导入操作
    uploaded (data) {
      if (data.code === '-1') {
        this.$message.error('导入失败');
        return;
      }
      this.initTree();
    },
    // 过滤树信息
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 设置光标在末尾
    setSelectionRange (input, selectionStart, selectionEnd) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      } else if (input.createTextRange) {
        const range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
      }
    },
    // input框自动获取焦点
    setFocus () {
      this.$nextTick(() => {
        const input = document.getElementById('tree-input');
        const len = input ? input.value.length : 0;
        this.setSelectionRange(input, len, len)
      })
    },
    // 保存input节点
    saveInputNode () {
      const inputVal = $('#tree-input').val()
      if (inputVal === undefined) return;
      if (inputVal.trim() === '') {
        this.$message.warning('目录名称不能为空')
        return;
      }
      const data = Object.assign(this.chooseData, { type: this.params.type, name: inputVal.trim() })
      if (this.booleanInput) {
        if (typeof (data.id) == 'undefined') {
          createNode(data).then(res => {
            this.dataResp(res, () => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.initTree();
            })
          })
        } else {
          updateNode(data).then(res => {
            this.dataResp(res, () => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.initTree();
            })
          })
        }

      }
    },
    dataResp (data, resp) {
      if (data.code === 0) {
        resp()
      }
      else {
        this.$message({
          type: 'error',
          message: data.msg
        })
      }
    }

  },
  watch: {
    // 触发过滤树信息
    searchWord (val) {
      this.$refs.tree.filter(val)
    }
  },
  filters: {
  },
  mounted () {
    this.initTree();
  }
}
</script>
