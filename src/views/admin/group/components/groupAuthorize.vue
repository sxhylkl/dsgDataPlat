<template>
  <el-row>
    <el-col :span="24">
      <el-button type="primary" v-if="groupManager_authorize_menu" @click="update">保存</el-button>
    </el-col>
    <el-col :span="9" style='margin-top:15px;margin-right:10px'>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree class="filter-tree" :render-content="renderContent" check-strictly :data="treeData" show-checkbox node-key="id" :expand-on-click-node="false" highlight-current
        :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all>
      </el-tree>
    </el-col>
    <el-col :span="14" style='margin-top:15px;'>
      <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" @select-all="handleSelectionAll"
        style="width: 100%">
        <el-table-column v-if="groupManager_authorize_element" type="selection" width="55"> </el-table-column>
        <el-table-column width="200px" align="center" label="资源类型">
          <template slot-scope="scope">
            <span>
              {{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="资源名称">
          <template slot-scope="scope">
            <span>
              {{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="资源地址">
          <template slot-scope="scope">
            <span>
              {{scope.row.uri}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="资源请求类型">
          <template slot-scope="scope">
            <span>
              {{scope.row.method}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import {
  removeElementAuthorize,
  addElementAuthorize,
  getElementAuthorize,
  modifyMenuAuthorize,
  getMenuAuthorize,
  fetchAuthorizeTree,
  pageAuthorize
} from '@/api/admin/group/index';
import {
  getAllChildrenIds
} from '@/utils/tree';
import { mapGetters } from 'vuex';
export default {
  // name: 'menu',
  props: {
    groupId: {
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
        label: 'title'
      },
      groupManager_menu: false,
      groupManager_element: false
      //   currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    this.getList();
    this.groupManager_authorize_menu = this.elements['groupManager:authorize_menu'];
    this.groupManager_authorize_element = this.elements['groupManager:authorize_element'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchAuthorizeTree().then(data => {
        this.treeData = data;
        this.initAuthoritys();
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
      const nodes = this.$refs.menuTree.getCheckedNodes();
      const ids = [];
      ids.push(data.id)
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
      }
      getAllChildrenIds(ids, data);
      this.$refs.menuTree.setCheckedKeys(ids);
    },
    unSelectChildren(data) {
      const ids = [];
      ids.push(data.id)
      getAllChildrenIds(ids, data);
      for (let i = 0; i < ids.length; i++) {
        this.$refs.menuTree.setChecked(ids[i], false);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      this.listQuery.menuId = data.id;
      pageAuthorize(this.listQuery).then(response => {
        this.list = response.data.rows;
        getElementAuthorize(this.groupId).then(data => {
          const obj = {};
          for (let i = 0; i < this.list.length; i++) {
            obj[this.list[i].id] = this.list[i];
          }
          const toggle = {};
          for (let i = 0; i < data.data.length; i++) {
            const id = data.data[i]
            if (obj[id] !== undefined && toggle[id] === undefined) {
              this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
              toggle[id] = true;
            }
          }
        });
      });
      this.currentId = data.id;
      this.showElement = true;
    },
    getTreeNodeKey(node) {
      return node.id;
    },
    handleSelectionChange(val, row) {
      let flag = true;
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === row.id) {
          addElementAuthorize(this.groupId, {
            menuId: this.currentId,
            elementId: row.id
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '资源权限添加成功',
              type: 'success',
              duration: 2000
            });
          });
          flag = false;
          break;
        }
      }
      if (flag) {
        removeElementAuthorize(this.groupId, {
          menuId: this.currentId,
          elementId: row.id
        }).then(() => {
          this.$notify({
            title: '成功',
            message: '资源权限移除成功',
            type: 'success',
            duration: 2000
          });
        });
      }
    },
    handleSelectionAll(val) {
      if (val.length === 0 && this.list !== null) {
        for (let i = 0; i < this.list.length; i++) {
          removeElementAuthorize(this.groupId, {
            menuId: this.currentId,
            elementId: this.list[i].id
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '资源权限移除成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      } else {
        for (let i = 0; i < val.length; i++) {
          addElementAuthorize(this.groupId, {
            menuId: this.currentId,
            elementId: val[i].id
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '资源权限添加成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      }
    },
    update() {
      this.$emit('closeAuthorizeDialog');
      const nodes = this.$refs.menuTree.getCheckedNodes();
      const ids = [];
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
      }
      modifyMenuAuthorize(this.groupId, {
        menuTrees: ids.join()
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '菜单权限保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initAuthoritys() {
      getMenuAuthorize(this.groupId).then(data => {
        const result = [];
        for (let i = 0; i < data.data.length; i++) {
          result.push(data.data[i].id);
        }
        this.$refs.menuTree.setCheckedKeys(result);
      });
    }
  }
}
</script>
