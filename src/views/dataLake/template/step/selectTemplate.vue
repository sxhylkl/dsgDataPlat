<template>
  <div id="selectTemplateBox" v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="模板" prop="name">
        <el-select
          v-model="ruleForm.name"
          filterable
          placeholder="请选择/输入查询"
          clearable
          @change="selectChangeFn"
          style="width: 360px;"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流程目标表" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <div class="radio-item">
            <el-radio label="NO_TABLE">
              没有表定制
              <span style="color: #999; font-size: 12px">(用户将无法选择自定义目标表)</span>
            </el-radio>
            <el-radio label="DATA_TRANSFORMATION">
              数据转换
              <span style="color: #666; font-size: 12px">（用户选择并选择不同的数据表和列，并应用函数将数据转换为所需的目标表。）</span>
            </el-radio>
          </div>

          <div class="radio-item">
            <el-radio label="DEFINE_TABLE">
              自定义目标表
              <span style="color: #666; font-size: 12px">（允许用户定义和定制目标数据表。）</span>
            </el-radio>
            <el-radio label="TO_JDBC" style="margin-bottom: 10px">
              TO_JDBC
              <span style="color: #666; font-size: 12px">（允许用户自定义目标。）</span>
            </el-radio>
          </div>
          <div class="radio-item">
            <el-radio label="TO_ES">
              TO_ES
              <span style="color: #666; font-size: 12px">（用户自定义目标。）</span>
            </el-radio>
            <el-radio label="DATAXONE" style="margin-bottom: 10px">
              DATAXONE
              <span style="color: #666; font-size: 12px">（用户自定义目标。）</span>
            </el-radio>
          </div>
          <div class="radio-item">
            <el-radio label="DSG_CUSTOMIZED">
              DSG_CUSTOMIZED
              <span style="color: #666; font-size: 12px">（DSG定义目标。）</span>
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="prevStep()" type="primary">取消</el-button>
      <el-button @click="nextStep()" :disabled="isReusable" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getAllTemplates, getRegistered } from '@/api/dataLake/api'
export default {
  name: "selectTemplate",
  props: {
    templateObj: {
      type: Object,
      default: {}
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      isReusable: false,
      options: [],
      ruleForm: {
        name: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '请选择/输入查询', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择流程目标表', trigger: 'change' },
        ]
      }
    }
  },
  watch: {
    templateObj: {
      handler: function (newValue, oldValue) {
        this.ruleForm.name = newValue.templateName
        this.ruleForm.type = newValue.templateTableOption
        this.isReusable = newValue.reusableTemplate
        if (this.isReusable) {
          this.$confirm('这是一个可重复使用的模板，无法注册，因为它以输入端口开始。 您需要创建并注册一个具有连接到此模板的输出端口的模板?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initData()
    console.log('初始化')
  },
  methods: {
    initData() {
      this.ruleForm.name = this.templateObj.templateName
      this.ruleForm.type = this.templateObj.templateTableOption
      getAllTemplates().then(res => {
        console.log(res)
        this.options = res
      })
      if (this.isEdit) {
        const params = {
          id: this.templateObj.id,
          name: this.templateObj.templateName
        }
        getRegistered(params).then(res => {
          console.log(res)
          this.loading = false
          this.templateObj = res
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { type } = this.ruleForm
          this.templateObj.templateTableOption = type
          const paramObj = {
            templateObj: this.templateObj,
            activeStep: 1
          }
          console.log(this.templateObj)
          this.$emit('param-obj', paramObj)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * @description select选择触发，获取已选择模板的信息
     */
    selectChangeFn(val) {
      if (val !== '') {
        this.isReusable = true
        const index = this.options.findIndex(item => item.id === val)
        this.loading = true
        getRegistered(this.options[index]).then(res => {
          if (res === '') {
            this.$message.warning('模板数据错误')
          } else {
            this.isReusable = false
          }
          this.loading = false
          const paramObj = {
            templateObj: res === '' ? {} : res,
            activeStep: 0
          }
          this.$emit('param-obj', paramObj)
        })
      }
    },
    /**
   * @description 上一步
   */
    prevStep() {
      const paramObj = {
        templateObj: this.ruleForm,
        activeStep: -1
      }
      this.$emit('param-obj', paramObj)
    },
    /**
     * @description 下一步
     */
    nextStep() {
      this.submitForm('ruleForm')
    }
  }
}
</script>

<style lang='scss' scoped>
.radio-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 32px;
}
.dialog-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>