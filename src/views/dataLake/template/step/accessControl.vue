<template>
  <div id="accessControlBox">
    <el-form>
      <!-- <el-form-item label="所有者" label-width="80px">
        <el-input v-model="templateObj.owner.displayName" disabled style="width:360px"></el-input>
        <span class="properties-des">(定义拥有该实体的用户。)</span>
      </el-form-item> -->
      <div v-if="!isShowTemp">
        <el-form-item v-for="(roleMember,index) in templateObj.roleMemberships" :label="tempLabel[index]" label-width="80px">
          <el-select v-model="tempGroupList[index]" multiple placeholder="请选择" style="width:360px">
            <el-option
              v-for="item in roleGroupList"
              :key="item.systemName"
              :label="item.systemName"
              :value="item.systemName">
            </el-option>
          </el-select>
          <span class="properties-des">{{description[index]}}</span>
        </el-form-item>
      </div>
      <div v-if="isShowTemp">
        <el-form-item v-for="(roleMember,index) in templateObj.roleMemberships" :label="roleMember.role.systemName" label-width="80px">
          <el-select v-model="tempGroupList[index]" multiple placeholder="请选择" style="width:360px">
            <el-option
              v-for="item in roleGroupList"
              :key="item.systemName"
              :label="item.systemName"
              :value="item.systemName">
            </el-option>
          </el-select>
          <span class="properties-des">({{roleMember.role.description}})</span>
        </el-form-item>
      </div>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="prevStep()" type="primary">上一步</el-button>
      <el-button @click="nextStep()" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRoleGroup } from '@/api/dataLake/api'
export default {
  name: "accessControl",
  props: {
    templateObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      roleGroupList: [],
      tempGroupList: [],
      roleMemberships: [
        {
          groups: [],
          role: {
            description: '允许用户编辑，导出模板',
            systemName: '编辑',
            title: 'Editor'
          },
          users: []
        },
        {
          groups: [],
          role: {
            description: '在“编辑”角色中定义的所有功能以及更改权限的能力',
            systemName: '管理',
            title: 'Admin'
          },
          users: []
        },
        {
          groups: [],
          role: {
            description: '允许用户查看模板',
            systemName: '只读',
            title: 'Read-Only'
          },
          users: []
        }
      ],
      description: [
        '(允许用户编辑，导出模板)',
        '(在“编辑”角色中定义的所有功能以及更改权限的能力)',
        '(允许用户查看模板)'
      ],
      tempLabel: ['编辑', '管理', '只读'],
      isShowTemp: false
    }
  },
  mounted() {
    this.initData()
    console.log(this.templateObj.roleMemberships)
  },
  methods: {
    initData () {
      const tempGroups = []
      if (this.templateObj.roleMemberships.length == 0) {
        this.templateObj.roleMemberships = this.roleMemberships
        this.isShowTemp = true
      }
      this.templateObj.roleMemberships.forEach(el => {
        // const tempList = el.groups.map(item => item.systemName)
        tempGroups.push(el.groups)
      })
      this.tempGroupList = tempGroups
      console.log(this.tempGroupList)
      getRoleGroup().then(res => {
        this.roleGroupList = res
      })
    },
    /**
   * @description 上一步
   */
    prevStep () {
      const paramObj = {
        templateObj: this.templateObj,
        activeStep: 2
      }
      this.$emit('param-obj', paramObj)
    },
    /**
     * @description 下一步
     */
    nextStep () {
      console.log(this.tempGroupList)
      this.tempGroupList.forEach((el, index) => { // 遍历已选的多选项替换对应的groups
        // const tempList = el.map(item => {
        //   const temp = []
        //   const index = this.roleGroupList.findIndex(itm => itm.systemName === item)
        //   temp.push(this.roleGroupList[index])
        //   return temp
        // })
        this.templateObj.roleMemberships[index].groups = this.tempGroupList[index]
      })
      console.log(this.templateObj.roleMemberships)
      const paramObj = {
        templateObj: this.templateObj,
        activeStep: 4
      }
      this.$emit('param-obj', paramObj)
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
.dialog-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>