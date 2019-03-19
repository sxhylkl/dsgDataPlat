<!-- '添加字段form’ -->
<template>
  <div class="add-field">
    <el-form
      :model="fieldForm"
      :rules="rules"
      ref="fieldForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="中文名称" prop="name_cn">
        <el-input v-model="fieldForm.name_cn" :disabled="btnState"></el-input>
      </el-form-item>
      <el-form-item label="英文名称" prop="name_en">
        <el-input v-model="fieldForm.name_en" :disabled="btnState"></el-input>
      </el-form-item>
      <el-form-item label="默认值" prop="default_value">
        <el-input v-model="fieldForm.default_value" :disabled="btnState"></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="datatype">
        <el-select
          v-model="fieldForm.datatype"
          placeholder="请选择"
          style="width:100%"
          :disabled="btnState"
        >
          <el-option :label="val" :value="val" v-for="val in typeList" :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" v-model="fieldForm.description" :disabled="btnState"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="是否是主键" prop="ispk">
            <el-checkbox v-model="fieldForm.ispk" :disabled="btnState"></el-checkbox>
          </el-form-item>
          <el-form-item label="是否为空" prop="nullable">
            <el-checkbox v-model="fieldForm.nullable" :disabled="btnState"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="18" :offset="1" v-if="config.isStandard">
          <el-form-item style="margin-bottom:-5px;">
            <a @click="addRule" :disabled="btnState" v-show="!btnState">添加验证&转换</a>
            <span v-show="fieldForm.validation.length>0">
              <b>验证:</b>
              <span
                style="margin-right: 10px;"
                v-for="(valid,index) in fieldForm.validation"
                :key="valid.name"
              >{{index+1}}.{{valid.displayName | translate}}</span>
            </span>
            <br>
            <span :class="{'left94': !btnState}" v-show="fieldForm.standardization.length>0">
              <b>标准:</b>
              <span
                style="margin-right: 10px;"
                v-for="(standard,index) in fieldForm.standardization"
                :key="standard.name"
              >{{index+1}}.{{standard.displayName | translate}}</span>
            </span>
            <!--  <span  style="margin-right:10px;">
            </span>-->
            <!--  <el-tooltip placement="bottom" effect="light" v-show="fieldForm.validation.length>0">
                 <div slot="content">
                   <p v-for="valid in fieldForm.validation" :key="valid.name">{{valid.displayName | translate}}</p>
                 </div>
                <el-button size="mini"> {{fieldForm.validation.length}} 验证</el-button>
              </el-tooltip>
               <el-tooltip placement="bottom" effect="light" v-show="fieldForm.standardization.length>0">
                 <div slot="content">
                   <p v-for="standard in fieldForm.standardization" :key="standard.name">{{standard.displayName | translate}}</p>
                 </div>
                <el-button size="mini"> {{fieldForm.standardization.length}} 标准</el-button>
            </el-tooltip>-->
            <!-- <span v-if="fieldForm.standardization.length>0">{{fieldForm.standardization.length}}标准</span> -->
          </el-form-item>
          <el-form-item>
            <a @click="addStandar" v-show="!btnState">添加行业标准</a>
            <span v-if="fieldForm.standard_base_id">
              <b>行业标准:</b>
              {{ this.fieldForm.standard_base_id}}/{{fieldForm.standard_base_column_namecn}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 添加验证规则 -->
    <el-dialog title="添加验证规则" :visible.sync="ruleDialog" width="55%" append-to-body>
      <div>
        <valid :policyRules="ruleList" ref="rule" v-if="ruleDialog"></valid>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ruleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加验行业标准 -->
    <el-dialog title="行业标准" :visible.sync="standerDialog" width="75%" append-to-body>
      <div>
        <in-standard :btnState="true" ref="standar"></in-standard>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="standerDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveStandar">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// const FIELDS_TYPE = ['string', 'int', 'tinyint', 'bigint', 'boolean', 'float', 'double', 'binary', 'timestamp', 'deimal', 'date'];

// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Valid from './Valid.vue'
import inStandard from '@/views/baseDataManager/standard/inStandard.vue'
import { translateJsonData } from '@/utils/translate'
import { getFieldType } from '@/api/stander/index.js'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    Valid,
    inStandard
  },
  props: ['fieldForm', 'btnState', 'config'],
  data () {
    // 这里存放数据
    return {
      typeList: [],
      ruleList: [],
      ruleDialog: false,
      standerDialog: false,
      validation: [],
      standardization: [],
      standar: [],
      standarRow: [],
      rules: {
        name_cn: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        name_en: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    };
  },
  filters: {
    translate (val) {
      if (translateJsonData[val] === '' || translateJsonData[val] == undefined) {
        return val;
      } else {
        return translateJsonData[val];
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 添加验证规则
    addRule () {
      this.handleRule()
      this.ruleDialog = true;
    },
    // 处理验证规则
    handleRule () {
      let result = []
      if (this.fieldForm.validation) {
        // this.ruleList = [...this.ruleList, ...this.fieldForm.validation]
        result = [...this.fieldForm.validation]
      }
      if (this.fieldForm.standardization) {
        // this.ruleList = [...this.ruleList, ...this.fieldForm.standardization]
        result = [...result, ...this.fieldForm.standardization]
      }
      this.ruleList = result
    },
    saveRule () {
      console.log(this.$refs.rule.policyRules)
      this.standardization = []
      this.validation = []
      for (const item of this.$refs.rule.policyRules) {
        if (item.type === 'standardization') {
          this.standardization.push(item)
        } else {
          this.validation.push(item)
        }
      }
      this.fieldForm.standardization = this.standardization;
      this.fieldForm.validation = this.validation;
      this.ruleDialog = false
    },
    saveStandar () {
      if (this.$refs.standar.seleted.length > 1) {
        this.$message.warning('该数据只能单选')
        return;
      }
      this.standar = this.$refs.standar.seleted
      this.standarRow = this.$refs.standar.seletedRow
      console.log('-----------')
      console.log(this.standar)
      console.log(this.standarRow)
      console.log(this.$refs.standar)
      if (this.standar.length > 0) {
        console.log('-------')
        this.fieldForm.standard_base_column_namecn = this.standar[0].namecn
        this.fieldForm.standard_base_id = this.standarRow.name
      } else {
        this.fieldForm.standard_base_id = ''
        this.fieldForm.standard_base_column_namecn = ''
      }
      this.standerDialog = false
    },
    addStandar () {
      this.standerDialog = true
    },
    // 获取字段类型
    getFieldType () {
      getFieldType().then(res => {
        if (res.code === 0) {
          this.typeList = res.data
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getFieldType()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  }
}
</script>
<style scoped>
.left94 {
  margin-left: 94px;
}
</style>

