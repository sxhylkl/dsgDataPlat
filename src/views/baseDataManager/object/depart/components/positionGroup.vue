<template>
<el-row>
  <el-col :span="24">
    <el-button type="primary" v-if="positionManager_btn_group" @click="update">保存</el-button>
  </el-col>
  <el-col :span="24" style='margin-top:15px;margin-right:10px'>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree class="filter-tree" :render-content="renderContent"  check-strictly node-key="id" :data="treeData" show-checkbox :expand-on-click-node="false" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all>
    </el-tree>
  </el-col>
    </el-row>

</template>
<script>
import {
  fetchTree
} from '@/api/admin/group/index';
import {
  modifyGroups,
  getGroups
} from '@/api/org/position/index';
import {
  getAllChildrenIds
} from '@/utils/tree';
import { mapGetters } from 'vuex';
export default {
  // name: 'menu',
  props: {
    positionId: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      positionManager_btn_group: false,
      groupManager_element: false
      //   currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    }
  },
  created() {
    this.getList();
    this.positionManager_btn_group = this.elements['positionManager:btn_group'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listQuery.groupType = 'org'
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
        this.initGroups();
      });
    },
    renderContent(h, { node, data }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
          <span>{node.label}</span>
          <span>
            <el-tooltip class="item" effect="dark" content="选中当前节点和所有下级节点" placement="top-start">
              <el-button size="mini" type="text" on-click={() => this.selectChildren(data)}><i class="el-icon-circle-check"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消选中当前节点和所有下级节点" placement="top-start">
              <el-button size="mini" type="text" on-click={() => this.unSelectChildren(data)}><i class="el-icon-circle-close"></i></el-button>
            </el-tooltip>
          </span>
        </span>);
    },
    selectChildren(data) {
      const nodes = this.$refs.groupTree.getCheckedNodes();
      const ids = [];
      ids.push(data.id)
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
      }
      getAllChildrenIds(ids, data);
      this.$refs.groupTree.setCheckedKeys(ids);
    },
    unSelectChildren(data) {
      const ids = [];
      ids.push(data.id)
      getAllChildrenIds(ids, data);
      for (let i = 0; i < ids.length; i++) {
        this.$refs.groupTree.setChecked(ids[i], false);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      this.listQuery.menuId = data.id;
      this.currentId = data.id;
      this.showElement = true;
    },
    getTreeNodeKey(node) {
      return node.id;
    },
    update() {
      const nodes = this.$refs.groupTree.getCheckedNodes();
      const ids = [];
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
      }
      modifyGroups(this.positionId, {
        groups: ids.join()
      }).then(() => {
        this.$refs.groupTree.setCheckedKeys([]);
        this.$emit('closeGroupDialog');
        this.$notify({
          title: '成功',
          message: '关联角色成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initGroups() {
      getGroups(this.positionId).then(reponse => {
        const result = [];
        for (let i = 0; i < reponse.data.length; i++) {
          result.push(reponse.data[i].id);
        }
        this.$refs.groupTree.setCheckedKeys(result);
      });
    }
  }
}
</script>