<!-- 新增任务 -->
<template>
  <div class="task-form">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="12">
            <span>{{title}}</span>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button v-show="isDetail" @click="changeState">编辑</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="22">
          <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="100px" @submit.native.prevent>
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="taskForm.name" :disabled="isDetail"></el-input>
            </el-form-item>
            <el-form-item label="数据源连接" v-if="false">
              <el-select
                v-model="taskForm.ds_list"
                multiple
                filterable
                value-key="id"
                allow-create
                default-first-option
                placeholder="请选择"
                :disabled="isDetail"
                style="width: 100%; margin-right:10px;"
              >
                <el-option
                  v-for="item in dataSourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标准" v-if="false">
              <div class="select-flex">
                <el-select
                  v-model="taskForm.standard_list"
                  multiple
                  placeholder="请选择"
                  value-key="id"
                  :disabled="isDetail"
                  style="width: 100%; margin-right:10px;"
                >
                  <el-option
                    v-for="item in taskForm.standard_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-button type="primary" :disabled="isDetail" @click="showDialog('standard')">选择标准</el-button>
              </div>
            </el-form-item>
            <el-form-item label="模型" v-if="false">
              <div class="select-flex">
                <el-select
                  v-model="taskForm.model_list"
                  multiple
                  placeholder="请选择"
                  value-key="id"
                  :disabled="isDetail"
                  style="width: 100%; margin-right:10px;"
                >
                  <el-option
                    v-for="item in taskForm.model_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-button type="primary" :disabled="isDetail" @click="showDialog('model')">选择模型</el-button>
              </div>
            </el-form-item>
            <el-form-item label="所属业务" v-if="false">
              <div class="select-flex">
                <el-select
                  v-model="taskForm.business_list"
                  multiple
                  value-key="id"
                  placeholder="请选择"
                  :disabled="isDetail"
                  style="width: 100%; margin-right:10px;"
                >
                  <el-option
                    v-for="item in taskForm.business_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-button type="primary" :disabled="isDetail" @click="showDialog('business')">选择业务</el-button>
              </div>
            </el-form-item>
            <el-form-item label="所属主题" v-if="false">
              <div class="select-flex">
                <el-select
                  v-model="taskForm.subject_list"
                  value-key="id"
                  multiple
                  placeholder="请选择"
                  :disabled="isDetail"
                  style="width: 100%; margin-right:10px;"
                >
                  <el-option
                    v-for="item in taskForm.subject_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-button type="primary" :disabled="isDetail" @click="showDialog('subject')">选择主题</el-button>
              </div>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea" v-model="taskForm.description" :disabled="isDetail"></el-input>
            </el-form-item>
            <el-form-item v-show="!isDetail">
              <el-button type="primary" @click="saveTask('taskForm')" :loading="saveLoading">保存</el-button>
              <el-button @click="cancelForm('taskForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 新建任务弹窗 -->
    <el-dialog :title="chooseType | typeCN" :fullscreen="true" :visible.sync="diaShow">
      <my-standard v-if="chooseType === 'standard'" ref="standard"></my-standard>
      <my-model v-if="chooseType === 'model'" ref="model"></my-model>
      <my-subject v-if="chooseType === 'subject'" ref="subject"></my-subject>
      <my-business v-if="chooseType === 'business'" ref="business"></my-business>
      <span slot="footer" class="dialog-footer">
        <el-button @click="diaShow = false">取 消</el-button>
        <el-button type="primary" @click="getRefArr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// 方法
import { addTask, getDataSourceList, updateTask } from '@/api/curd/feed/index.js'
// import { getDataSource } from '@/api/dataLake/api'
import { getStandarFields } from '@/api/stander/index.js'
import myBusiness from '@/views/baseDataManager/object/dataRun'
import mySubject from '@/views/baseDataManager/object/subject'
import myStandard from '@/views/baseDataManager/standard/standard'
import myModel from '@/views/baseDataManager/standard/model'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    myBusiness,
    mySubject,
    myStandard,
    myModel
  },
  props: ['nodeId', 'taskCont', 'isDetail', 'title'],
  data() {
    // 这里存放数据
    return {
      chooseType: '',
      diaShow: false,

      dataSourceList: [],
      saveLoading: false,
      /*  taskForm: {
         business_list: [],
         description: '',
         ds_list: [],
         model_list: [],
         name: '',
         referId: '',
         parent_id: '',
         rule_list: [],
         standard_list: [],
         subject_list: []
       }, */
      taskForm: {
        description: '',
        name: '',
        referId: '',
        parent_id: ''
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  filters: {
    typeCN(val) {
      const translate = { standard: '标准', model: '模型', business: '业务', subject: '主题' }
      return `选择${translate[val]}`
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    taskCont(val) {
      if (val) this.taskForm = val;
    }
  },
  // 方法集合
  methods: {
    // 通过模型和标准id的集合获取数据
    getColumns(arr) {
      arr = arr.map(one => {
        getStandarFields(one.id).then(res => {
          one.columns = res.data
        })
        return one
      })
      return arr
    },
    /**
    *  @获取组件传过来的Arr
    */
    getRefArr() {
      console.log([... this.$refs[this.chooseType].multipleSelection])
      if (this.chooseType === 'standard' || this.chooseType === 'model') {
        this.taskForm[`${this.chooseType}_list`] = [... this.getColumns(this.$refs[this.chooseType].multipleSelection)]
      }
      else {
        this.taskForm[`${this.chooseType}_list`] = [... this.$refs[this.chooseType].multipleSelection]
      }
      this.diaShow = false
    },
    /**
     * 点击选择按钮
     */
    showDialog(str) {
      this.diaShow = true
      this.chooseType = str
    },
    /**
    * @description 获取所有数据源链接
    */
    getAllDataSource() {
      getDataSourceList().then(res => {
        this.dataSourceList = res.data
      })
    },
    saveTask() {
      this.saveLoading = true
      if (this.taskForm.id) {
        this.updteTask()
      } else {
        this.addTask()
      }
    },
    addTask() {
      this.taskForm.referId = this.getReferId()
      this.taskForm.parent_id = this.nodeId;
      addTask(this.taskForm).then(res => {
        this.saveLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          return;
        }
        this.$message.success('成功')
        this.changeState();
        this.$emit('saveTask', true)
      }).catch(() => {
        this.saveLoading = false
      })
    },
    updteTask() {
      updateTask(this.taskForm).then(res => {
        this.saveLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          return;
        }
        this.$message.success('成功')
        this.changeState();
        this.$emit('saveTask', true)
      }).catch(() => {
        this.saveLoading = false
      })
    },
    cancelForm(formName) {
      this.changeState()
      // this.$refs[formName].resetFields();
      console.log(this.taskForm)
      /* if (!this.taskForm.id) {
        this.$emit('saveTask', false)
      } */
      this.$emit('saveTask', false)
    },
    // 生成refer_id
    getReferId() {
      const nowTime = new Date()
      const yy = nowTime.getFullYear()
      const mm = `${nowTime.getMonth() + 1}`.padStart(2, '0')
      const dd = `${nowTime.getDate()}`.padStart(2, '0')
      const hh = `${nowTime.getHours()}`.padStart(2, '0')
      const min = `${nowTime.getMinutes()}`.padStart(2, '0')
      const ss = `${nowTime.getSeconds()}`.padStart(2, '0')
      const str = `task_${yy}${mm}${dd}_${hh}${min}${ss}`
      return str;
    },
    // 改变可编辑的状态
    changeState() {
      this.isDetail = !this.isDetail;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getAllDataSource();
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.select-flex {
  display: flex;
  justify-content: space-between;
}
.select-flex .el-input {
  margin-left: 10px;
}
</style>
