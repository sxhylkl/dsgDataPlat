<template>
  <!--<el-dropdown trigger="click">
    <span class="el-dropdown-link userinfo-inner">内部跳转<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i></span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item ><a target="_blank"  href="http://192.168.24.246:7070/#/home">DSG数据管理</a></el-dropdown-item>
      <el-dropdown-item ><a  target="_blank"  href="http://192.168.23.125:8400">DSG数据处理</a></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>-->
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: this.$t('lang.switch'),
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  .userinfo-inner{
    cursor: pointer;
  }
</style>


