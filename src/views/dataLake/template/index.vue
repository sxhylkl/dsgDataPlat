<template>
  <div v-loading="listLoading">
    <!-- 1、首先是点击模板是一个模板的列表-->
    <!--<el-select v-model="value" placeholder="请选择导入模板" >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" @click.native="newTemplate(item.value)">
            </el-option>
    </el-select>-->
    <el-row>
      <el-col :span="12">
        <el-tooltip class="item" effect="dark" content="从文件导入模板" placement="bottom">
          <el-button type="primary" @click.native="fileToImportTemplate()" size="mini">
            <i class="el-icon-plus"></i>
          </el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="从dataFlow导入模板" placement="bottom">
          <el-button type="warning" @click.native="dataFlowToImportTemplate()" size="mini">
            <i class="el-icon-download"></i>
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="10" :offset="2" style="text-align: right">
        <el-input
          v-model="keyWords"
          placeholder="模板名称"
          class="handle-input mr10"
          suffix-icon="el-icon-search"
        ></el-input>
      </el-col>
    </el-row>

    <el-table
      :data="showTemplateList"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="templateName" label="模板名" sortable></el-table-column>
      <el-table-column prop="feedsCount" label="关联流程数" width="100"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="导出模板" placement="bottom">
            <a
              :href="'/datalake-agent_/v1/feedmgr/admin/export-template/'+showTemplateList[scope.$index].id"
              class="aStyle"
            >
              <i class="el-icon-upload2"></i>
            </a>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="编辑模板" placement="bottom">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              plain
              @click="editTemplate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除模板" placement="bottom">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              plain
              :disabled="scope.row.feedsCount==0 ? isCanDel=false : isCanDel=true"
              @click="delTemplate(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10,20,50,100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!--从文件导入-->
    <el-dialog class="templateDialog" title="从文件中导入模板" :visible.sync="dialogFormVisible">
      <el-table :data="fileTypeDesciption" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="type" label="类型" width="180"></el-table-column>
        <el-table-column prop="fileType" label="文件类型" width="180"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
      </el-table>
      <el-upload
        class="upload-template"
        ref="upload"
        action="doUpload"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :limit="1"
      >
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>

        <!--   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
      </el-upload>
      <div class="importTextStyle">
        <div>
          <el-checkbox v-model="overAllWrite">重写</el-checkbox>
          <p class="fontSizeStyle">如果在dataFlow中已经存在具有相同名称（如.zip中）的流程模板,它将被替换。</p>
        </div>
        <div style="margin-top:2%">
          <el-checkbox v-model="overAllImport">导入可重用模板</el-checkbox>
          <p class="fontSizeStyle">如果存档包含可重复使用的模板，它将被导入。 如果在dataFlow中已经存在一个同名的可重用模板，它将被替换并重新初始化。</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="submitUpload()" :disabled="isSecondImpoert">导入模板</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      class="templateDialog"
      title="模板编辑"
      :fullscreen="true"
      :visible.sync="isShowTemplate"
    >
      <el-steps :active="activeStep" align-center>
        <el-step title="步骤1" description="选择模板"></el-step>
        <el-step title="步骤2" description="输入属性"></el-step>
        <el-step title="步骤3" description="其他属性"></el-step>
        <el-step title="步骤4" description="访问控制"></el-step>
        <el-step title="步骤5" description="注册"></el-step>
      </el-steps>
      <el-card shadow="never" class="box-card" style="margin-top: 20px;">
        <el-form :inline="true">
          <el-form-item
            label="名称:"
            prop="name"
            style="margin-bottom: 0; margin-right: 20px"
            label-width="80px;"
          >
            <span style="color: #606266">{{templateObj.templateName}}</span>
          </el-form-item>
          <el-form-item
            label="最近更新:"
            prop="name"
            style="margin-bottom: 0; margin-right: 20px"
            label-width="80px;"
          >
            <span style="color: #606266">{{getUpdateDate(templateObj.updateDate)}}</span>
          </el-form-item>
          <el-form-item
            label="流程:"
            prop="feedsCount"
            style="margin-bottom: 0; margin-right: 20px"
            label-width="80px;"
          >
            <span style="color: #606266">{{templateObj.feedsCount}}</span>
          </el-form-item>
          <el-form-item
            label="状态:"
            prop="state"
            style="margin-bottom: 0; margin-right: 20px"
            label-width="80px;"
          >
            <span v-if="templateObj.state === 'ENABLED'" style="color: #009933">启用</span>
            <span v-else style="color: #606266">禁用</span>
            <el-button
              style="margin-left: 20px"
              type="primary"
              @click="stateApi"
            >{{templateObj.state === 'ENABLED' ? '禁用' : '启用' }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="step-box">
        <select-template
          v-if="activeStep === 0"
          :templateObj="templateObj"
          :isEdit="isEdit"
          @param-obj="getChildParamObj"
        ></select-template>
        <input-attribute
          v-if="activeStep === 1"
          :templateObj="templateObj"
          @param-obj="getChildParamObj"
        ></input-attribute>
        <other-attribute
          v-if="activeStep === 2"
          :templateObj="templateObj"
          @param-obj="getChildParamObj"
        ></other-attribute>
        <access-control
          v-if="activeStep === 3"
          :templateObj="templateObj"
          @param-obj="getChildParamObj"
        ></access-control>
        <register v-if="activeStep === 4" :templateObj="templateObj" @param-obj="getChildParamObj"></register>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTemplates, exportTemplate, importTemplate, delTemplate, templateEnable } from '../../../api/dataLake/api'
import selectTemplate from './step/selectTemplate.vue'
import inputAttribute from './step/inputAttribute.vue'
import otherAttribute from './step/otherAttribute.vue'
import accessControl from './step/accessControl.vue'
import register from './step/register.vue'
export default {
  name: 'template',
  components: {
    selectTemplate,
    inputAttribute,
    otherAttribute,
    accessControl,
    register
  },
  data () {
    return {
      isEdit: false, // true: 编辑模板 false: 导入模板
      showTemplateList: [],
      templateList: [],
      currentPage: 1,
      total: 1,
      pageSize: 10,
      activeStep: 0, // 当前激活步骤
      exportUrl: "",
      overAllWrite: false, //导入模板时是否重写
      overAllImport: true, //导入可重用模板
      uploadKey: null,  //v2导入模板需要的参数
      importComponentOptions: {},
      uploadStatusMessages: [],
      importComponentTypes: {        NIFI_TEMPLATE: "NIFI_TEMPLATE",
        TEMPLATE_DATA: "TEMPLATE_DATA",
        FEED_DATA: "FEED_DATA",
        REUSABLE_TEMPLATE: "REUSABLE_TEMPLATE",
        USER_DATASOURCES: "USER_DATASOURCES",
        TEMPLATE_CONNECTION_INFORMATION: "TEMPLATE_CONNECTION_INFORMATION"

      },
      isCanDel: true, //是否可以删除模板
      listLoading: false, //加载中
      isSecondImpoert: false, //防止二次点击
      isShowTemplate: false, // 显示编辑模板弹窗
      isValidator: false, // 步骤子组件是否验证表单
      fileName: "",
      options: [
        {
          value: 'fromNifi',
          label: '从dataFlow导入'
        },
        {
          value: 'fromFile',
          label: '从文件导入'
        }
      ],
      value: "",
      dialogFormVisible: false,
      //导入文件
      fileList: [],
      files: {},
      fileName: "",
      fileTypeDesciption: [
        {
          type: 'NiFi模板',
          fileType: 'XML',
          description: '导入NiFi模板'
        },
        {
          type: '模板捆绑',
          fileType: 'ZIP',
          description: '导入配置和NiFi模板'
        }
      ],
      keyWords: '',
      templateAll: [],
      templateObj: {} // 当前行数据
      /*
                          fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      */

    }
  },
  watch: {
    keyWords () {
      this.currentPage = 1;
      this.handletableData()
    }
  },
  mounted () {
    this.getTemplateData();
  },
  methods: {
    //  获取模板列表 （http://192.168.23.125:8400/proxy/v1/feedmgr/templates）
    getTemplateData () {
      this.listLoading = true
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      /*  if (process.env.NODE_ENV === 'development') {
            this.url = '/ms/table/list';
        };*/
      getTemplates().then(data => {
        this.listLoading = false
        this.templateAll = data;
        this.templateList = data;
        this.total = this.templateList.length;
        this.changeList();

      }).catch(err => {
        console.log(err.data)
      })

    },
    // 处理分页数据
    handletableData () {
      let tempList = [];
      for (const item of this.templateAll) {
        if (item.templateName.includes(this.keyWords)) {
          tempList.push(item);
        }
      }
      this.templateList = tempList;
      this.changeList()
    },
    changeList () {
      this.showTemplateList = this.templateList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      console.log(this.showTemplateList)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.changeList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.changeList()
    },
    formatter (row, column) {
      return row.address;
    },
    /* newTemplate(value){
         if(value==='fromNifi'){
             alert(111)
         }
         else if(value==='fromFile'){
            /!* this.$router.push('/FromFile');*!/
             this.dialogFormVisible=true
         }
     },*/
    //删除模板
    delTemplate (index, row) {
      this.$confirm(`此操作将删除${row.templateName}模板, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        let params = row.id;
        delTemplate(params).then(data => {
          this.listLoading = false;
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getTemplateData();
        }).catch(err => {
          console.log(err.data)
          this.$message({
            type: 'danger',
            message: '删除失败!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    guid () {
      function s4 () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
    newUploadKey () {
      return _.uniqueId("upload_") + new Date().getTime() + this.guid();
    },
    newImportComponentOption (component) {
      console.log(this.overAllWrite)
      console.log(this.overAllImport)
      let option = { importComponent: component, overwriteSelectValue: "false", overwrite: this.overAllWrite, userAcknowledged: true, shouldImport: true, analyzed: false, continueIfExists: this.overAllImport, properties: [] }
      return option;
    },
    newTemplateDataImportOption () {
      return this.newImportComponentOption(this.importComponentTypes.TEMPLATE_DATA);
    },
    newNiFiTemplateImportOption () {
      return this.newImportComponentOption(this.importComponentTypes.NIFI_TEMPLATE);
    },
    newReusableTemplateImportOption () {
      return this.newImportComponentOption(this.importComponentTypes.REUSABLE_TEMPLATE);
    },
    indexImportOptions () {
      this.templateDataImportOption = this.newTemplateDataImportOption();
      this.nifiTemplateImportOption = this.newNiFiTemplateImportOption();

      /**
       * Reusable template options
       */
      this.reusableTemplateImportOption = this.newReusableTemplateImportOption();

      /**
       * User data sources options
       */
      /*this.userDatasourcesOption = this.newUserDatasourcesImportOption();*/
      let arr = [this.templateDataImportOption, this.nifiTemplateImportOption, this.reusableTemplateImportOption];
      console.log(arr);
      //this.importComponentOptions = _.indexBy(arr,'importComponent');
      this.importComponentOptions["importComponent"] = arr;
      //  this.importComponentOptions["importComponent"] = arr;
      /*arr.forEach(item=>{
        this.importComponentOptions["importComponent"] = item
      })*/
      console.log(this.importComponentOptions)
    },
    init () {
      this.indexImportOptions();
      // setDefaultImportOptions();

      // Get the list of data sources
      /* DatasourcesService.findAll()
           .then(function (datasources) {
               self.availableDatasources = datasources;
           });*/
    },
    getImportOptionsForUpload (importOptionsMap) {
      let importComponentOptions = []
      console.log(importOptionsMap)
      _.each(importOptionsMap, function (option, key) {
        //set defaults for options

        option.forEach(item => {
          item.errorMessages = [];

          if (item.overwrite) {
            item.userAcknowledged = true;
            item.shouldImport = true;
            item.continueIfExists = true;
          }

          /* if(!item.overwrite){
             option.continueIfExists = true;
           }*/
          if (item.importComponent === "NIFI_TEMPLATE") {
            item.continueIfExists = false;
          }
        })

        //reset the errors
        //importComponentOptions.push(option);
        importComponentOptions = option;
        console.log(importComponentOptions)
      });
      return importComponentOptions;
    },
    //从文件中导入模板
    fileToImportTemplate () {
      this.dialogFormVisible = true
    },
    //从nifi导入模板
    dataFlowToImportTemplate () {
      this.isShowTemplate = true
      this.isEdit = false
      this.activeStep = 0
      this.templateObj = {
        templateName: '',
        templateTableOption: 'NO_TABLE'
      }
    },
    //上传之前的校验
    beforeUpload (file) {
      console.log(file, '文件');
      console.log(typeof (file));
      this.files = file;
      /*const extension = file.name.split('.')[2] === 'xml';
      const extension2 = file.name.split('.')[2] === 'zip';*/
      //const isLt2M = file.size / 1024 / 1024 < 5
      /*if (!extension && !extension2) {
        this.$message.warning('上传模板只能是 xml、zip格式!')
        return
      }*/
      /*if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 5MB!')
          return
      }*/
      this.fileName = file.name;
      return false // 返回false不会自动上传
    },
    //上传文件
    submitUpload () {
      this.isSecondImpoert = true;
      // this.$refs.upload.submit();
      if (this.fileName === "") {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      this.init();
      this.uploadKey = this.newUploadKey();
      let importComponentOptions = this.getImportOptionsForUpload(this.importComponentOptions);
      let fileFormData = new FormData();
      fileFormData.append('file', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('uploadKey', this.uploadKey);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('importComponents', JSON.stringify(importComponentOptions));//filename是键，file是值，就是要传的文件，test.zip是要传的文件名

      /*fileFormData.append('overwrite', this.overAllWrite);
      fileFormData.append('createReusableFlow', this.overAllImport);*/
      console.log(fileFormData)
      console.log(importComponentOptions)
      //  let params = {file:this.file,overwrite:this.overAllWrite,createReusableFlow:this.overAllImport}
      importTemplate(fileFormData).then(res => {
        data.status !== 'error' ? this.$message.success('成功导入模板') : this.$message.error('导入模板失败')
        console.log(res.data)
        this.getTemplateData();
        this.dialogFormVisible = false;
        this.isSecondImpoert = false;

      }).catch(err => {
        console.log(err.data)
        this.$message.error('导入模板失败');
        this.dialogFormVisible = false;
        this.isSecondImpoert = false;
      })
    },

    /* handleRemove(file, fileList) {
         console.log(file, fileList);
     },
     handlePreview(file) {
         console.log(file);
     },*/
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    exportTempalte (index, row) {
      //exportTemplate
      /* let templateId = row.id;
       exportTemplate(templateId).then(res=>{
           console.log(res.data)
       }).catch(err=>{
           console.log(err.data)
       })*/
      console.log(exportTemplate)
      console.log(index, row);
    },
    /**
     * @description 编辑模板
     * @param row {object} 当前行数据
     */
    editTemplate (row) {
      this.isShowTemplate = true
      this.isEdit = true
      this.templateObj = row
      this.activeStep = 0
    },
    getChildParamObj (data) {
      console.log(data)
      const { activeStep, templateObj } = data
      const { inputProcessors = [], nonInputProcessors = [] } = templateObj
      inputProcessors.forEach(item => {
        item.properties.forEach(el => {
          el.renderOptions == null && (el.renderOptions = {})
        })
      })
      if (nonInputProcessors != null) {
        nonInputProcessors.forEach(item => {
          if (item.properties) {
            item.properties.forEach(el => {
              el.renderOptions == null && (el.renderOptions = {})
            })
          }
        })
      }
      this.activeStep = activeStep
      this.templateObj = templateObj
      if (this.activeStep < 0) {
        this.isShowTemplate = false
      }
    },
    /**
     * @description 启用禁用模板请求
     * @param state { string } enable: 启用 disable: 禁用
     * @param id { string } 模板id
     */
    stateApi () {
      const { id, state } = this.templateObj
      const params = {
        id,
        state: state === 'ENABLED' ? 'disable' : 'enable'
      }
      const text = 'ENABLED' ? '启用' : '禁用'
      this.$confirm(`此操作将${text}模板, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        templateEnable(params).then(res => {
          res && (this.templateObj = res)
          this.getTemplateData()
        })
      })
    },
    /**
     * @description 时间戳变为时间 '2018-12-14'
     * @param date {number} 时间戳
     */
    getUpdateDate (date) {
      const tempDate = new Date(date)
      const year = tempDate.getFullYear()
      const month = `${tempDate.getMonth() + 1}`.padStart(2, '0')
      const day = tempDate.getDate()
      return `${year}-${month}-${day}`
    }

  }

}
</script>
<style scoped>
.el-upload--text {
  border: none;
  width: 80px;
  height: 32px;
}
.upload-template {
  margin-top: 20px;
}
.aStyle {
  color: #f08c38;
  padding: 1px 15px;
  border: 1px solid #d1d2d5;
  border-radius: 5px;
  display: inline-block;
  margin-right: 10%;
}
.aStyle:hover {
  background-color: #c2e0fe;
  color: #409eff;
}
.importTextStyle {
  margin-top: 3%;
  padding-left: 1%;
}
.fontSizeStyle {
  font-size: 10px;
  color: #a7a6a6;
}
.step-box {
  padding: 20px 0px;
  height: calc(100vh - 54px - 77px - 81px - 30px - 22px - 62px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
<style>
.templateDialog .el-dialog__body {
  height: calc(100% - 54px);
  position: relative;
  overflow-y: auto;
}
</style>
