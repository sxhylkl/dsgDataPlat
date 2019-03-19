<template>
  <div class="rule-link-dialog">
    <!-- <el-steps :active="active" finish-status="success">
      <el-step :title="step.title" v-for="step in stepsConfig" :key="step.title"></el-step>
    </el-steps> -->
    <div class="iframe-cont">
      <el-card class="box-card">
        <iframe
          :src="url"
          width="100%"
          height="780px"
          frameborder="0"
        ></iframe>
         <!-- :name="stepsConfig[active].name" -->
      </el-card>
    </div>
    <div class="rule-link-btn">
      <!-- <el-button style="margin-top: 12px;" @click="back" v-show="active>0">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next" v-show="active<stepsConfig.length-1">下一步</el-button>
      <el-button style="margin-top: 12px;" @click="saveRule" v-show="active===stepsConfig.length-1">保存</el-button> -->
      <el-button style="margin-top: 12px;" @click="saveRule">保存</el-button>
    </div>
  </div>
</template>
<script>
const RULE_URL = severUrl.ruleUrl
// 步骤条配置信息
const STEPS_CONFIG = [
  { title: '关联1', name: 'ruleIframe1', src: RULE_URL + '/urule/variableeditor?file=/111/dsgtest.vl.xml' },
  { title: '关联2', name: 'ruleIframe2', src: RULE_URL + '/urule/variableeditor?file=/111/dsgtest.vl.xml' },
  { title: '关联3', name: 'ruleIframe3', src: RULE_URL + '/urule/variableeditor?file=/111/dsgtest.vl.xml' },
  { title: '关联4', name: 'ruleIframe4', src: RULE_URL + '/urule/variableeditor?file=/111/dsgtest.vl.xml' }]
export default {
  data() {
    return {
      active: 0,
      stepsConfig: STEPS_CONFIG,
      url: RULE_URL
    }
  },
  methods: {
    // 上一步
    back() {
      if (--this.active <= 0) this.active = 0;
    },
    // 下一步
    next() {
      const len = this.stepsConfig.length
      if (++this.active >= len - 1) this.active = len - 1;
    },
    // 触发父级保存事件
    saveRule(data) {
      this.$emit('saveRule', data)
    }
  }
}
</script>
<style scoped>
.rule-link-btn{
  margin-top: 75px;
  text-align: right
}
</style>


