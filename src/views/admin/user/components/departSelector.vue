<template>
  <div>
    <!-- <el-row>
    <el-col :span="24">-->
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="filter-tree"
      node-key="id"
      :data="mainTreeData"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="mainTree"
      @node-click="getTreeNodeData"
      highlight-current
    ></el-tree>
    <!-- </el-col>
    </el-row>-->
  </div>
</template>

<script>
import {
  getTree
} from '@/api/org/depart2/index.js';
import { mapGetters } from 'vuex';
export default {
  watch: {
    filterText(val) {
      this.$refs.mainTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    initmainTreeData() {
      getTree().then(data => {
        this.mainTreeData = data
      });
    },
    getTreeNodeData(data) {
      this.currentTreeNodeId = data.id
      this.currentTreeNode = data
    },
    onSubmit() {
      this.$emit('closeDepartDialog', this.currentTreeNode)
    }
  },
  created() {
    this.initmainTreeData()
    // 加载树
    // this.departManager_btn_user_del = this.elements['departManager:btn_user_del'];
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data() {
    return {
      filterText: '',
      currentTreeNodeId: undefined,
      currentTreeNode: {},
      mainTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  }
};
</script>
