<template>
  <el-tabs v-model="activeName" @tab-click="tabClick">
    <el-tab-pane label="标准治理" name="STANDARD">
      <standard ref="standard" :nodeId="standardId"></standard>
    </el-tab-pane>
    <el-tab-pane label="模型治理" name="MODEL">
      <model :nodeId="modelId" v-if="modelState"></model>
    </el-tab-pane>
    <el-tab-pane label="行业标准">
      <in-standard></in-standard>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import standard from './standard/standard'
import model from './standard/model'
import inStandard from './standard/inStandard'
export default {
  name: 'object',
  components: {
    standard,
    model,
    inStandard
  },
  data () {
    return {
      activeName: 'STANDARD',
      standardId: '',
      modelId: '',
      modelState: true
    }
  },
  created () {
    const type = this.$route.query.type
    const nodeId = this.$route.query.nodeId
    if (type) {
      this.activeName = type
    } else {
      this.activeName = 'STANDARD'
    }
    if (type === 'STANDARD') {
      this.standardId = nodeId
    } else {
      this.modelId = nodeId
    }
  },
  watch: {

  },
  filters: {

  },
  methods: {
    clearQuery () {
      if (this.$route.query.type) {
        this.$router.replace({})
        this.standardId = '';
        this.modelId = '';
      }
    },
    tabClick (tab) {
      this.clearQuery()
      switch (tab.name) {
        case 'STANDARD':
          this.$refs.standard.getList()
          this.modelState = false
          break;
        case 'MODEL':
          this.modelState = true
          break;
        default:
      }
    }
  }
}
</script>

<style scoped>
</style>
