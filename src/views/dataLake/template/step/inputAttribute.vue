<template>
  <div id="inputAttributeBox">
    <div v-for="(item,index) in templateObj.inputProcessors" :key="index">
      <el-card>属性名：{{item.name}}</el-card>
      <el-form class="properties-form" v-for="(properties,propertiesIdx) in item.properties">
        <el-form-item style="display: flex; margin-bottom: 0">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              name="checkList"
              :label="properties.propertyDescriptor.displayName"
              :key="properties.propertyDescriptor.displayName"
            >
              <span class="properties-title">{{properties.propertyDescriptor.displayName}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <span class="properties-des">{{properties.propertyDescriptor.description}}</span>
        </el-form-item>
        <div v-if="checkList.findIndex(el => (el == properties.propertyDescriptor.displayName)) != '-1'">
          <el-form-item>
            <el-select
              v-if="properties.propertyDescriptor.allowableValues"
              v-model="properties.propertyDescriptor.defaultValue"
              style="width:360px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in properties.propertyDescriptor.allowableValues"
                :key="item.value"
                :label="item.displayName"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-else
              v-model="properties.propertyDescriptor.defaultValue"
              placeholder="Enter a string or ${expression})"
              style="width: 360px;"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="properties.userEditable">允许用户输入吗？</el-checkbox>
            <br v-if="properties.userEditable">
            <div v-if="properties.userEditable" style="display: inline-block">
              <span style="margin-right:10px;">呈现为</span>
              <el-select v-model="properties.renderType" style="width:200px;" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input v-if="properties.renderType === 'checkbox-custom'" v-model="properties.renderOptions.trueValue" style="width:200px;" placeholder="真值"></el-input>
              <el-input v-if="properties.renderType === 'checkbox-custom'" v-model="properties.renderOptions.falseValue" style="width:200px;" placeholder="假值"></el-input>
              <el-input v-if="properties.renderType === 'select'" v-model="properties.selectOptions" style="width:200px;" placeholder="假值"></el-input>
            </div>
            <el-checkbox v-model="properties.sensitive">敏感</el-checkbox>
            <el-checkbox v-if="properties.userEditable" v-model="properties.required">必填</el-checkbox>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer">
      <el-button @click="prevStep()" type="primary">上一步</el-button>
      <el-button @click="nextStep()" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "inputAttribute",
  props: {
    templateObj: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      ruleForm: {

      },
      paramObj: {

      },
      checkList: [],
      options: [
        {
          label: 'Checkbox',
          value: 'checkbox-custom'
        },
        {
          label: 'Groovy',
          value: 'groovy'
        },
        {
          label: 'Hive',
          value: 'hive'
        },
        {
          label: 'MySql',
          value: 'mySql'
        },
        {
          label: 'Number',
          value: 'number'
        },
        {
          label: 'Password',
          value: 'password'
        },
        {
          label: 'Pig',
          value: 'pig'
        },
        {
          label: 'Properties',
          value: 'properties'
        },
        {
          label: 'Python',
          value: 'python'
        },
        {
          label: 'Select',
          value: 'select'
        },
        {
          label: 'Shell',
          value: 'shell'
        },
        {
          label: 'Sql',
          value: 'sql'
        },
        {
          label: 'Text',
          value: 'text'
        },
        {
          label: 'Textarea',
          value: 'textarea'
        },
        {
          label: 'Xml',
          value: 'xml'
        }
      ]
    }
  },
  mounted () {
    //this.initData()
  },
  methods: {
    initData () {
      this.templateObj.inputProcessors.forEach(item => {
        item.properties.forEach(el => {
          el.userEditable && this.checkList.push(el.propertyDescriptor.displayName)
        })
      })
      console.log(this.checkList)
    },
    /**
   * @description 上一步
   */
    prevStep () {
      console.log('上一步')
      const paramObj = {
        templateObj: this.templateObj,
        activeStep: 0
      }
      this.$emit('param-obj', paramObj)
    },
    /**
     * @description 下一步
     */
    nextStep () {
      console.log('下一步')
      const paramObj = {
        templateObj: this.templateObj,
        activeStep: 2
      }
      this.$emit('param-obj', paramObj)
    }
  }
}
</script>

<style lang='scss' scoped>
.properties-form {
  margin: 20px 0;
  border-bottom: 1px solid grey;
}
.properties-title {
  font-size: 16px;
  color: #333;
}
.properties-des {
  font-size: 12px;
  color: grey;
  line-height: 16px;
}
.dialog-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>