<template>
  <div id="registerBox" v-loading="loading">
    <el-form>
      <el-form-item label="描述">
        <el-input v-model="templateObj.description" style="width: 360px"></el-input>
      </el-form-item>
      <el-card class="box-card">流式处理模板</el-card>
      <el-form-item>
        <el-checkbox v-model="templateObj.isStream">流式处理模板</el-checkbox>
      </el-form-item>
      <!-- 批处理模板 -->
      <div v-if="!templateObj.isStream">
        <el-card class="box-card">批处理模板</el-card>
        <el-form-item label="工作创造流量区间(millis)">
          <el-input v-model="templateObj.timeBetweenStartingBatchJobs" style="width: 360px"></el-input>
          <br>
          <span
            class="properties-des"
          >(如果操作管理器在这个给定的时间间隔内接收到超过1个启动事件，它将会抑制下一个作业的创建。将其设置为-1L或0L，以始终为每个启动流创建一个作业实例。.)</span>
        </el-form-item>
      </div>
      <!-- 可重用模板 -->
      <div v-if="templateObj.reusableTemplate">
        <el-card class="box-card">可重用模板</el-card>
        <el-form-item>
          <span class="properties-des">这个模板被用作一个可重用的组件。 它不能用于创建新的流程，而是可以注册其他流程模板以引用此模板。</span>
        </el-form-item>
      </div>
      <!-- 流程计划选项 -->
      <div v-if="!templateObj.reusableTemplate && templateObj.allowPreconditions">
        <el-card class="box-card">流程计划选项</el-card>
        <el-form-item>
          <span class="properties-des">该模板允许在预先条件下触发流程（即，完成另一个流程）</span>
        </el-form-item>
      </div>
      <!-- 连接选项 -->
      <div v-if="templateObj.needsReusableTemplate || templateObj.reusableTemplateConnections">
        <el-card class="box-card">连接选项</el-card>
        <div v-for="(item,index) in templateObj.reusableTemplateConnections">
          <el-form-item label="连接从">
            <span style="margin-right:20px;">{{item.feedOutputPortName}}</span>
            <el-select v-model="item.inputPortDisplayName">
              <el-option
                v-for="itm in reusableInputOption"
                :key="itm.name"
                :label="itm.name"
                :value="itm.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!-- 显示选项 -->
      <div>
        <el-card class="box-card">显示选项</el-card>
        <el-form-item label="图标" label-width="80px">
          <el-button type="primary">更改图标</el-button>
        </el-form-item>
        <el-form-item label="选择分类" label-width="80px">
          <el-select v-model="templateObj.categoryName" placeholder="请选择">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary">选择分类</el-button>
          <el-button type="danger">取消分类</el-button>
        </el-form-item>
      </div>
      <!-- 更改模板顺序 -->
      <div>
        <el-card class="box-card">模板顺序</el-card>
        <el-form-item label="模板排序">
          <el-select v-model="templateObj.order" style="width: 360px" placeholder="请选择">
            <el-option
              v-for="(item,index) in orderOption"
              :key="index"
              :label="item.templateName"
              :disabled="item.disabled"
              :value="index"
            >
              <span style="float: left">{{item.templateName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">当前排序{{ index }}</span>
            </el-option>
          </el-select>
          <span style="margin:0 20px">设置排序</span>
          <el-input type="number" v-model.number="tempOrder" placeholder="设置当前排序（仅支持数字）" style="width:250px"></el-input>
        </el-form-item>
      </div>
      <!-- 流程血统数据源 -->
      <div>
        <el-card class="box-card">流程血统数据源</el-card>
        <el-form-item v-if="registeredList.length">
          <el-checkbox-group v-model="registeredList">
            <el-checkbox 
              style="display: block; margin-left: 0"
              v-for="(item,index) in templateObj.registeredDatasourceDefinitions" 
              :key="index"
              :label="item.processorId">{{item.processorName}}-{{item.datasourceDefinition.datasourceType}}-{{item.datasourceDefinition.connectionType}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-else>
          暂无流程血统数据源
        </div>
      </div>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="prevStep()" type="primary">上一步</el-button>
      <el-button @click="nextStep()" type="primary">注册</el-button>x
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getReusableInput, getTemplates, templateRegister } from '@/api/dataLake/api'
export default {
  name: "register",
  props: {
    templateObj: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      reusableInputOption: [],
      orderOption: [],
      categoryOptions: [], // 分类
      tempOrder: 0,
      registeredList: [], // 流程血统数据源
      loading: false
    }
  },
  watch: {
    tempOrder: function(val) {
      console.log(val)
      if(val > this.orderOption.length) {
        this.tempOrder = this.templateObj.order
        this.$confirm(`输入的排序不能大于${this.orderOption.length}！请重新输入`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      getReusableInput().then(res => {
        this.reusableInputOption = res
      })
      getTemplates().then(res => {
        this.tempOrder = res.order
        this.orderOption = res.map((item, index) => ({
          templateName: `${item.templateName}(当前排序${index})`,
          disabled: true
        }))
      })
      this.templateObj.registeredDatasourceDefinitions.forEach(item => {
        this.registeredList.push(item.processorId)
      })
    },
    /**
    * @description 上一步
    */
    prevStep () {
      const paramObj = {
        templateObj: this.templateObj,
        activeStep: 3
      }
      this.$emit('param-obj', paramObj)
    },
    /**
     * @description 注册
     */
    nextStep () {
      this.$confirm(`此操作将注册${this.templateObj.templateName} 是否继续?`, '提示',{type: 'success'})
        .then(() => {
          this.loading = true
          this.templateObj.order = this.tempOrder
          const paramObj = {
            templateObj: this.templateObj,
            activeStep: -1
          }
          templateRegister(this.templateObj).then(res => {
            if (res) {
              this.loading = false
              this.$message({
                message: '恭喜你，编辑成功',
                type: 'success'
              })
              this.$emit('param-obj', paramObj)
            } else {
              this.loading = false
              this.$message({
                message: '编辑失败',
                type: 'error'
              })
            }
          })
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.properties-des {
  font-size: 12px;
  color: grey;
  line-height: 16px;
}
.box-card {
  margin-bottom: 20px;
}
.dialog-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>