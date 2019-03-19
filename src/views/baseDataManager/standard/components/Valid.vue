<!-- 验证规则 -->
<template>
  <div class="vliad-box">
    <div class="ruleBox">
      <el-row v-for="(item,index) in policyRules" :key="index">
        <el-col :span="19">
          <span class="cont">1-{{index+1}}. {{item.type}}</span>
          <span>{{item.type | translate}}</span>
          <span>({{item.displayName | translate}})</span>
        </el-col>
        <el-col :span="5" style="text-align: right;color: grey; font-size: 16px;">
          <!--<el-button type="text" icon="el-icon-edit" @click="editData('1',index)"></el-button>-->
          <el-button type="text" icon="el-icon-delete" @click="deletePolicyByIndex(index)"></el-button>
        </el-col>
      </el-row>
    </div>
    <!--</div>-->
    <!--验证已添加的规则-->
    <h3>添加一项新的配置</h3>
    <div class="t-radio">
      <el-radio-group v-model="selectedOptionType" @change="onChangedOptionType">
        <!--(optionType.type)-->
        <el-radio
          v-for="optionType in optionTypes"
          :value="optionType.type"
          :label="optionType.name"
          :key="optionType.name"
        >{{optionType.name | translate}}</el-radio>
      </el-radio-group>
    </div>
    <!--验证-->
    <div>
      <!-- v-if="radiotest=='2'"-->
      <el-form ref="form" :model="verifyForm" label-position="top" size="medium">
        <el-form-item label="选择规则类型">
          <el-select
            v-model="ruleType"
            placeholder="请选择"
            value-key="name"
            @change="onRuleTypeChange"
          >
            <!-- @change="onRuleTypeChange"-->
            <el-option
              v-for="item in options"
              :key="item.name+'d'"
              :label="item.displayName | translate"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="ifEditRules">
          <div v-for="(group,index) in editRule.groups" :key="index+'a'">
            <div
              v-for="(property,index) in group.properties"
              v-if="property.hidden == false"
              :key="index+'b'"
            >
              <div
                v-if="property.type == 'number' || property.type =='string' || property.type == 'regex' || property.type == 'select' || property.type == 'feedSelect' || property.type == 'email' || property.type == 'emails' || property.type == 'currentFeed'  || property.type =='velocityTemplate' "
              >
                <p>{{property.displayName | translate}}</p>
                <el-input v-model="property.value" type="number" v-show="property.type == 'number'"></el-input>
                <el-input v-model="property.value" v-show="property.type == 'email'"></el-input>
                <el-input v-model="property.value" v-show="property.type == 'emails'"></el-input>
                <el-input
                  v-model="property.value"
                  v-show="property.type == 'string' || property.type =='regex'"
                ></el-input>
                <p
                  style="margin-top:6px;"
                  v-if="property.displayName == 'Regex expression'"
                >正则表达式匹配示例:
                  <br>^abc$ : 只匹配字符串"abc"
                  <br>abc : 如果一个模式不包括^和$，那么它与任何包含该模式(包含abc)的字符串匹配
                </p>
                <el-select
                  v-model="property.value"
                  v-show="(property.type == 'select' || property.type == 'feedSelect' || property.type == 'currentFeed' || property.type =='velocityTemplate' )"
                >
                  <el-option
                    v-for="value in property.selectableValues"
                    :key="value.value"
                    :label="value.label | translate"
                    :value="value.value"
                  ></el-option>
                </el-select>

                <div
                  v-show="property.errorMessage"
                  class="hint"
                >{{property.errorMessage | translate}}</div>
                <div v-show="property.hint" class="hint">{{property.hint | translate}}</div>
              </div>
              <div v-show="property.type == 'cron'">
                <label>{{property.displayName | translate}}</label>
                <el-input v-model="property.value"></el-input>
                <div v-show="property.hint" class="hint">{{property.hint | translate}}</div>
              </div>
              <div v-show="property.type == 'regex'">
                <span>
                  <!--Test your Regex Pattern-->
                  测试你的正则表达式
                </span>
                <div>
                  <label>
                    <!--Sample String-->
                    示例字符串
                  </label>
                  <el-input v-model="property.regexSampleString" placeholder="请输入内容"></el-input>
                </div>
                <div>{{property.regexValid | translate}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div>
      <!--  <el-button type="text" @click="cancelStanderRule" class="cancel">取消添加</el-button>-->
      <el-button v-if="!isEditData" type="text" @click="addPolicy()" class="add">添加规则</el-button>
      <!-- <el-button v-if="isEditData" type="text" style="float: right" @click="saveEditData" class="add">保存编辑</el-button>-->
    </div>
  </div>
</template>

<script>
// 例如：import 《组件名称》 from '《组件路径》';
import { getFeedStandardization, getFeedValidation } from '@/api/dataLake/api'
import { translateJsonData } from '@/utils/translate'
export default {
  name: 'Valid',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: ['policyRules'],
  data () {
    // 这里存放数据
    return {
      // policyRules: null,
      selectedOptionType: 'standardization',
      optionTypes: [{ type: 'standardization', name: 'Standardization' }, { type: 'validation', name: 'Validation' }], // 规则验证
      verifyForm: { type: '' },
      ruleType: null,
      ifEditRules: false,
      editRule: null,
      options: [],
      liyue: null,
      isEditData: false // 是否在编辑规则
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
    onChangedOptionType (type) {
      if (type === 'standardization' || type === 'Standardization') {
        this.getStandardizationOptions();
        this.options = this.standardizers;
      } else {
        this.getValidationOptions();
        this.options = this.validators;
      }
      // this.options = type == 'standardization' ? this.standardizers : this.validators;
      this.selectedOptionType = type;
    },
    onPropertyChanged (val) {
      console.log(val)
    },
    getValidationOptions () {
      getFeedValidation().then(data => {
        let currentFeedValue = null;
        const _this = this;
        if (_this.feedInfo != null) {
          currentFeedValue = _this.currentFeedValue(this.feedInfo);
          currentFeedValue = currentFeedValue.toLowerCase();
        }
        let validationResults = [];
        validationResults = _.sortBy(data, function (r) {
          return r.name
        });
        _.each(validationResults, function (result) {
          result.type = 'validation';
        })
        _this.validators = _this.groupPolicyOptions(validationResults, currentFeedValue);
        //  _this.validatorsAndStandardizers = _.union(_this.validators,_this.standardizers);
        // set the correct options in the drop down
        _this.changedOptionType(_this.selectedOptionType);
        this.ruleTypesAvailable();
        // $scope.loadingPolicies = false;
      }).catch(err => {
        console.log(err)
      })
    },
    // standardization
    getStandardizationOptions () {
      getFeedStandardization().then(data => {
        let currentFeedValue = null;
        const _this = this;
        if (_this.feedInfo != null) {
          currentFeedValue = _this.currentFeedValue(this.feedInfo);
          currentFeedValue = currentFeedValue.toLowerCase();
        }
        let standardizationResults = [];
        standardizationResults = _.sortBy(data, function (r) {
          return r.name;
        });
        _.each(standardizationResults, function (result) {
          result.type = 'standardization';
        })
        _this.standardizers = _this.groupPolicyOptions(standardizationResults, currentFeedValue);
        //  _this.validatorsAndStandardizers = _.union(_this.validators,_this.standardizers);
        // set the correct options in the drop down
        _this.changedOptionType(_this.selectedOptionType);
        _this.ruleTypesAvailable();
        // $scope.loadingPolicies = false;
      }).catch(err => {
        console.log(err)
      })
    },
    findRuleType (ruleName, type) {
      return _.find(this.validatorsAndStandardizers, function (opt) {
        return opt.name == ruleName && opt.type == type;
      });
    },
    ruleTypesAvailable () {
      if (this.editRule != null) {
        this.ruleType = this.findRuleType(this.editRule.name, this.editRule.type);
        console.log(this.ruleType)
        if (this.ruleType && this.ruleType.type !== this.selectedOptionType) {
          this.changedOptionType(this.ruleType.type);
        }
      }
    },
    changedOptionType (type) {
      if (type === 'standardization' || type === 'Standardization') {
        this.options = this.standardizers;
      } else {
        this.options = this.validators;
      }
      //  this.options = type == 'standardization' ? this.standardizers : this.validators;
      this.selectedOptionType = type;
    },
    currentFeedValue (feed) {
      return feed.category.systemName + '.' + feed.systemFeedName;
    },
    attachCurrentFeedValueToProperty (prop, feedName) {
      if (prop.value === undefined || prop.value === null || prop.value === this.CURRENT_FEED_DEFAULT_VALUE) {
        prop.value = feedName;
      }
    },
    attachCurrentFeedValues (data, feedName) {
      // set the currentFeed property value to be this.feed if it is not null
      const currentFeedProperties = [];
      const _this = this;
      _.each(data, function (rules) {
        _.each(rules.properties, function (prop) {
          if (prop.type == 'currentFeed' || prop.value == _this.CURRENT_FEED_DEFAULT_VALUE) {
            currentFeedProperties.push(prop);
          }
        });
      });
      _.each(currentFeedProperties, function (prop) {
        _this.attachCurrentFeedValueToProperty(prop, feedName);
      });
    },
    groupPolicyOptions (options, currentFeedName) {
      if (currentFeedName != null && currentFeedName !== undefined) {
        this.attachCurrentFeedValues(options, currentFeedName);
      }
      const optionsArr = [];
      options.forEach(opt => {
        opt.groups = this.groupProperties(opt);
        optionsArr.push(opt);
      })
      return optionsArr;
    },
    deletePolicyByIndex (index) {
      if (this.policyRules != null) {
        this.policyRules.splice(index, 1);
      }
      this.pendingEdits = true;
      // _cancelEdit();
    },
    onRuleTypeChange (val) {
      console.log(val)
      if (this.ruleType != null) {
        const rule = this.ruleType;
        rule.groups = this.groupProperties(rule);
        /* this.updatePropertyIndex(rule);
        const groups = this.updatePropertyIndex(rule)
        this.$set(rule.groups, groups) */
        // make all rules editable
        rule.editable = true;
        this.editRule = rule;
        this.ifEditRules = true;
        console.log('---------------------23232424234')
        console.log(rule)
        // this.setupPoliciesForFeed();
      } else {
        this.editRule = null;
      }
    },
    updatePropertyIndex (rule) {
      this.updatePropertyIndex(rule);
    },
    updatePropertyIndex (rule) {
      let _this = this;
      _.each(rule.properties, function (property) {
        property.formKey = 'property_' + _this.formKeyNumber++;
      });
    },
    groupProperties (metric) {
      const group = _.groupBy(metric.properties, 'group');
      const groupedProperties = [];
      _.each(group, function (props, groupName) {
        let sortedProps = _.sortBy(props, 'groupOrder');
        let newGroup = { group: groupName, layout: groupName != '' ? 'row' : 'column', properties: sortedProps, value: '' }
        groupedProperties.push(newGroup);
      });
      const allProps = [];
      _.each(groupedProperties, function (group) {
        _.each(group.properties, function (property) {
          //make the RegExp if it is supplied as a string
          if (property.pattern != null && property.pattern != undefined && property.pattern != "") {
            try {
              property.patternRegExp = new RegExp(property.pattern);
            } catch (err) {
            }
          }
          allProps.push(property);
        });
      });
      metric.properties = allProps;
      return groupedProperties;
    },
    addPolicy () {
      if (this.policyRules == null) {
        this.policyRules = [];
      }
      // buildDisplayString();
      //  this.editRule["ruleType"] = this.ruleType;
      // const rule = Object.assign({}, this.editRule)
      const rule = JSON.parse(JSON.stringify(this.editRule))
      this.policyRules.push(rule);
      this.pendingEdits = true;
      this.ifEditRules = true;
      // this._cancelEdit();
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  mounted () {

  }
}
// 生命周期 - 挂载完成（可以访问DOM元素）

</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
