<template>
  <div
    v-if="(tableRow.standardization != null && tableRow.standardization.length >0 || tableRow.validation != null && tableRow.validation.length >0)"
  >
    <el-tooltip
      placement="bottom"
      effect="light"
      v-if="tableRow.standardization != null && tableRow.standardization.length >0"
    >
      <div slot="content">
        <p
          v-for="valid in tableRow.standardization"
          :key="valid.name"
        >{{valid.displayName | translate}}</p>
      </div>
      <el-button size="mini">{{tableRow.standardization.length}} 标准</el-button>
    </el-tooltip>

    <el-tooltip
      placement="bottom"
      effect="light"
      v-if="tableRow.validation != null && tableRow.validation.length >0"
    >
      <div slot="content">
        <p v-for="valid in tableRow.validation" :key="valid.name">{{valid.displayName | translate}}</p>
      </div>
      <el-button size="mini">{{tableRow.validation.length}} 验证</el-button>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    tableRow: {
      type: Object,
      default: {}
    }
  }
}
</script>

