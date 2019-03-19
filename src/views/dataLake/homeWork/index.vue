<template>
  <el-tabs >
    <el-tab-pane label="作业监控管理">
      <homeWork>

      </homeWork>
    </el-tab-pane>

    <el-tab-pane label="告警监控管理">
      <warning>

      </warning>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import homeWork from './components/homeWork'
  import warning from './components/warning'
  export default {
    components: {
      homeWork,
      warning
    },
    data(){
      return{

      }
    },
    watch:{

    },
    filters:{

    },
    methods:{

    },
  }
</script>

<style scoped>

</style>
