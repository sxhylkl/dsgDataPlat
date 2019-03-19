<template>
  <el-card
    class="box-card"
    v-if="dsgProperties.standard || dsgProperties.model || dsgProperties.rule.targetDbName"
  >
    <div slot="header" class="clearfix">
      <span v-if="dsgProperties.standard">标准子段({{dsgProperties.standard.name}})</span>
      <span v-else-if="dsgProperties.model">模型字段({{dsgProperties.model.name}})</span>
      <span v-else-if="dsgProperties.rule.targetDbName">规则详情</span>
    </div>
    <div v-if="dsgProperties.standard || dsgProperties.model">
      <el-table :data="tableData.columns">
        <el-table-column label="中文名称" prop="name_cn" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="英文名称" prop="name_en" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="字段类型" prop="datatype" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="转换&验证" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <transform :tableRow='scope.row'></transform>
          </template>
        </el-table-column>
        <el-table-column label="说明" prop="description" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </div>
    <div class="text item" v-if="dsgProperties.rule.targetDbName">
      <el-row class="editRowStyle">
        <el-col :span="6">数据库名:</el-col>
        <el-col :span="12">{{dsgProperties.rule.targetDbName}}</el-col>
      </el-row>
      <el-row class="editRowStyle">
        <el-col :span="6">数据表名:</el-col>
        <el-col :span="12">{{dsgProperties.rule.targetTableName}}</el-col>
      </el-row>
      <el-row class="editRowStyle">
        <el-col :span="6">知识包:</el-col>
        <el-col :span="12">{{dsgProperties.rule.knowPackage}}</el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
import { formatLongTime } from '@/filters/index'
import transform from './transformShow'
export default {
  name: 'other',
  components: {
    transform
  },
  props: {
    dsgProperties: {
      type: Object,
      default: {},
    }
  },
  data () {
    return {
      active: 0,
    }
  },
  computed: {
    tableData () {
      if (this.dsgProperties.standard) return this.dsgProperties.standard
      if (this.dsgProperties.model) return this.dsgProperties.model
    },
  },
  methods: {
  }
}
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.editRowStyle {
  padding: 10px 0;
}
</style>


