<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="部门治理" name="DEPARTMENT">
        <department ref="depart"></department>
      </el-tab-pane>
      <el-tab-pane label="主题治理" name="SUBJECT">
        <subject ref="subject"></subject>
      </el-tab-pane>
      <el-tab-pane label="业务治理" name="BUSINESS">
        <dataRun ref="business"></dataRun>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dataRun from './object/dataRun'
import department from './object/depart/index'
import subject from './object/subject'
export default {
  name: 'object',
  components: {
    dataRun,
    department,
    subject
  },
  inject: ['reload'],
  data() {
    return {
      activeName: 'DEPARTMENT'
    }
  },
  created() {
    const type = this.$route.query.type
    if (type) {
      this.activeName = type
    } else {
      this.activeName = 'DEPARTMENT'
    }
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
    tabClick(tab) {
      this.clearQuery()
      switch (tab.name) {
        case 'SUBJECT':
          this.$refs.subject.getList()
          break;
        case 'BUSINESS':
          this.$refs.business.getList()
          break;
        case 'DEPARTMENT':
          this.$refs.depart.getList()
          break;
        default:
      }
    }
  }
}
</script>

<style scoped>
</style>
