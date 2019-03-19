<template>
  <div class="search-tree">
    <el-row>
      <el-col :span="17" v-if="false">
        <el-input placeholder v-model="keyword"></el-input>
        <el-button @click="search" type="primary">搜索</el-button>
      </el-col>
      <el-col :span="24">
        <el-tree
          :data="data"
          node-key="id"
          show-checkbox
          :check-strictly="true"
          :props="data"
          ref="tree"
          @check-change="handleCheckChange"
        ></el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SearchTree',
  props: ['data'],
  data() {
    return {
      keyword: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  watch:{
  },
  methods: {
    handleCheckChange(data, checked) {
         //this.$refs.tree.setCheckedNodes([data])
        let treeArr = this.$refs.tree.getCheckedNodes()
        this.$emit('selectNode', treeArr)
      // if (this.$refs.tree.getCheckedNodes().length === 0) {
      //   this.$emit('selectNode', { label: '', id: null })
      // }
    },
    search() {
      console.log(this.keyword)
    }
  }
}
</script>

<style scoped>
.search-tree {
  position: relative;
  margin: 10px;
  padding: 20px;
  height: 350px;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  z-index: 9999;
  overflow-y: scroll;
  overflow-x: hidden;
}
.search-tree .el-input {
  width: 60%;
}
</style>
