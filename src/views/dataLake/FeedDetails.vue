<template>
  <div v-loading="isGetDataLoading">
    <!--importFeedLoadding-->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="从文件中导入流程" name="first">
        <el-table
          :data="fileTypeDesciption"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
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
          <div slot="tip" class="el-upload-list__item-name marginFirst">{{fileName}}</div>

          <!--   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>

        <div class="marginFirst">
          <span style="font-size: 14px;color: #606266;">选择类别：</span>
          <el-select
            v-model="selectCatorgery"
            filterable
            placeholder="请选择"
            @change="getCatorgrayName"
          >
            <el-option
              v-for="item in restaurants"
              :key="item.id"
              :label="item.name"
              :value="item.systemName"
            ></el-option>
          </el-select>
          <!--:key="item.name"-->
        </div>

        <div class="importTextStyle" style="margin-top:4%">
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-checkbox v-model="newFeedDataImportOption.overwrite">覆盖流程</el-checkbox>
                <p class="fontSizeStyle">如果流程已经存在，请选中此选项。</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-checkbox v-model="disableFeedUponImport">导入时禁用流程</el-checkbox>
                <p class="fontSizeStyle">检查导入后禁用此流程。</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-checkbox v-model="newTemplateDataImportOption.overwrite">替换流程模板</el-checkbox>
                <!--overFeedTemplate-->
                <p class="fontSizeStyle">如果流程模板已经存在，请替换并重新注册。</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-checkbox v-model="newReusableTemplateImportOption.overwrite">替换可重复使用的模板</el-checkbox>
                <!--overFeedTemplateOverwrite-->
                <p class="fontSizeStyle">如果使用，替换并重新初始化可重用模板。</p>
              </div>
            </el-col>
          </el-row>
          <div class="marginSecond">
            <el-row :gutter="20">
              <el-col :span="6" :offset="20">
                <el-button type="primary" @click.native="submitUploadFeed()">导入流程</el-button>
                <!-- :disabled="isSecondImpoert"-->
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="从模板中导入流程" name="second">
        <div style="margin-top: 15px;width:100%;margin-bottom: 2%">
          <el-input placeholder="请搜索模板" v-model="searchTemplate">
            <template slot="prepend">
              <i class="el-icon-search"></i>
            </template>
          </el-input>
        </div>
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="item in templateComputed"
            @click.native="toDefinedFeed(item)"
            style="margin-bottom:10px"
          >
            <el-card class="box-card">
              <div class="text item" style="cursor: pointer">
                <p class="pClass">{{item.templateName2}}</p>
                <span class="spanClass">说明:{{item.description}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getCategories, getRegisteredTemplate, importFeed } from '../../api/dataLake/api'
export default {
  data () {
    return {
      taskInfo: [],
      isGetDataLoading: false,
      activeName: 'second',
      uploadKey: null,
      fileList: [],
      fileName: "",
      autoSelect: [],
      overwrite: false,
      overwriteFeedTemplate: false,
      overFeedTemplate: false,
      overFeedTemplateOverwrite: false,
      fileTypeDesciption: [
        {
          type: '归档文件',
          fileType: '压缩',
          description: '\n' +
            '归档文件包含Nifi和Kylo 流程数据。 \n' +
            '这将导入Nifi并在Kylo注册流程和相应的模板。'
        }
      ],
      restaurants: [],
      selectCatorgery: "",
      registeredTemplateList: [], //模板列表
      registeredTemplateListFilter: [],
      searchTemplate: "",
      categoryName: '',
      disableFeedUponImport: false,
      importComponentOptions: {},
      uploadStatusMessages: [],
      importComponentTypes: {
        NIFI_TEMPLATE: "NIFI_TEMPLATE",
        TEMPLATE_DATA: "TEMPLATE_DATA",
        FEED_DATA: "FEED_DATA",
        REUSABLE_TEMPLATE: "REUSABLE_TEMPLATE",
        /*   USER_DATASOURCES: "USER_DATASOURCES",
           TEMPLATE_CONNECTION_INFORMATION:"TEMPLATE_CONNECTION_INFORMATION"*/

      },
      feedDataImportOption: null,
      userDatasourcesOption: null,
      importFeedLoadding: false,
      newFeedDataImportOption: {
        importComponent: "FEED_DATA",
        overwriteSelectValue: "false",
        overwrite: false,
        userAcknowledged: true,
        shouldImport: true,
        analyzed: false,
        continueIfExists: false,
        properties: []
      },
      newTemplateDataImportOption: {
        importComponent: "TEMPLATE_DATA",
        overwriteSelectValue: "false",
        overwrite: false,
        userAcknowledged: true,
        shouldImport: true,
        analyzed: false,
        continueIfExists: true,
        properties: []
      },
      newNiFiTemplateImportOption: {
        importComponent: "NIFI_TEMPLATE",
        overwriteSelectValue: "false",
        overwrite: false,
        userAcknowledged: true,
        shouldImport: true,
        analyzed: false,
        continueIfExists: true,
        properties: []
      },
      newReusableTemplateImportOption: {
        importComponent: "REUSABLE_TEMPLATE",
        overwriteSelectValue: "false",
        overwrite: false,
        userAcknowledged: true,
        shouldImport: true,
        analyzed: false,
        continueIfExists: true,
        properties: []
      },
    }
  },
  computed: {
    templateComputed () {
      const transJson = { 'Data Transformation': '数据转换模板', 'data-transform-rule': '数据规则模板', 'Data Ingest': '数据采集模板', 'data-transform': '数据转换模板' }
      return this.registeredTemplateListFilter.map(params => {
        for (let key in transJson) {
          if (params.templateName.indexOf(key) > -1) {
            params.templateName2 = params.templateName.replace(key, transJson[key])
            return params
          }
        }
        params.templateName2 = params.templateName
        return params
      })
    }
  },
  watch: {
    searchTemplate (val) {
      let arr = []
      let _this = this;
      _this.registeredTemplateList.map(one => {
        if (one.description === null || one.description === undefined) {
          one.description = ''
        }
        if (one.templateName2.indexOf(val) > -1 || one.description.indexOf(val) > -1) {
          arr.push(one)
        }
        _this.registeredTemplateListFilter = [...arr]
      })
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },
    newUploadKey () {
      return _.uniqueId("upload_") + new Date().getTime() + this.guid();
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
          this.$message.warning('上传模板只能是 压缩格式!')
          return
      }*/
      /*if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 5MB!')
          return
      }*/
      this.fileName = file.name;
      return false // 返回false不会自动上传
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
    getCatorgrayName (val) {
      this.categoryName = val;
      console.log(val)
    },

    newUploadKey: function () {
      return _.uniqueId("upload_") + new Date().getTime() + this.guid();
    },
    /*   onOverwriteSelectOptionChanged (importComponentOption){
         importComponentOption.userAcknowledged = true;
         if(importComponentOption.overwriteSelectValue == "true"){
           importComponentOption.overwrite = true;
         }
         else if(importComponentOption.overwriteSelectValue == "false"){
           importComponentOption.overwrite = false;
           importComponentOption.continueIfExists = true;
         }
         else {
           importComponentOption.userAcknowledged = false;
         }
       },*/

    indexImportOptions () {
      this.feedDataImportOption = this.newFeedDataImportOption;
      this.templateDataImportOption = this.newTemplateDataImportOption;
      this.nifiTemplateImportOption = this.newNiFiTemplateImportOption;

      /**
       * Reusable template options
       */
      this.reusableTemplateImportOption = this.newReusableTemplateImportOption;

      /**
       * User data sources options
       */
      /* this.userDatasourcesOption = this.newUserDatasourcesImportOption();*/
      let arr = [this.feedDataImportOption, this.templateDataImportOption, this.nifiTemplateImportOption, this.reusableTemplateImportOption];
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
          /*  if(item.importComponent==="NIFI_TEMPLATE"){
              item.continueIfExists = false;
            }*/

          //   if(option.userAcknowledged && !option.overwrite){
          //      option.continueIfExists = true;
          //  }
          //reset the errors
          item.errorMessages = [];
        });

        //importComponentOptions.push(option);
        importComponentOptions = option;
        console.log(importComponentOptions)
      });
      return importComponentOptions;
    },
    submitUploadFeed () {
      this.isGetDataLoading = true;
      this.init();
      this.uploadKey = this.newUploadKey();
      let importComponentOptions = this.getImportOptionsForUpload(this.importComponentOptions);
      console.log(importComponentOptions);
      /*  let params = {
            uploadKey : this.uploadKey,
            categorySystemName: this.categoryName,
            disableFeedUponImport:this.disableFeedUponImport,
            importComponents:JSON.stringify(importComponentOptions)
        };*/
      let fileFormData = new FormData();
      fileFormData.append('file', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('uploadKey', this.uploadKey);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('categorySystemName', this.categoryName);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('disableFeedUponImport', this.disableFeedUponImport);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('importComponents', JSON.stringify(importComponentOptions));//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      let newFeedDataImportOption = this.newFeedDataImportOption;
      console.log(newFeedDataImportOption)
      console.log(this.newFeedDataImportOption.overwrite);
      console.log("+++++++++++++++++++")
      importFeed(fileFormData).then(res => {
        this.isGetDataLoading = false;
        console.log(res.data)
        this.$message({
          message: '成功导入流程',
          type: 'success'
        });
        this.$router.push({ path: '/flowManage/feedsList' })

      }).catch(err => {
        this.isGetDataLoading = false;
        console.log(err.data)
        this.$message.error('导入流程失败');
      })

    },
    /* startUploadStatus(){
      //   stopUploadStatus();
         this.uploadStatusMessages =[];
         self.uploadStatusCheck = $interval(function() {
             //poll for status
             $http.get(RestUrlService.ADMIN_UPLOAD_STATUS_CHECK(self.uploadKey)).then(function(response) {
                 if(response && response.data && response.data != null) {
                     self.uploadStatusMessages = response.data.messages;
                     self.uploadProgress = response.data.percentComplete;
                 }
             }, function(err){
                 //  self.uploadStatusMessages = [];
             });
         },500);
     },*/
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },


    loadAll () {
      //获取分类列表
      getCategories().then(data => {
        this.restaurants = data;
        console.log(this.restaurants)

      }).catch(err => {
        console.log(err.data)
      })
    },
    /* querySearchAsync(queryString, cb) {
         var restaurants = this.restaurants;
         var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

         clearTimeout(this.timeout);
         this.timeout = setTimeout(() => {
             cb(results);
         }, 3000 * Math.random());
     },*/
    createStateFilter (queryString) {
      return (state) => {
        console.log(state)
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      console.log(item);
    },
    //获取模板列表
    getRegisteredTem () {
      this.isGetDataLoading = true;
      //getRegisteredTemplate
      getRegisteredTemplate().then(data => {
        if (data !== null) {
          this.registeredTemplateList = data;
          this.registeredTemplateListFilter = data;
          this.isGetDataLoading = false;
        } else {
          this.isGetDataLoading = true;
        }

      }).catch(err => {
        console.log(err.data)
      })
    },
    // 点击模板跳转至定义流程
    toDefinedFeed (postTemplate) {
      // this.$router.push({path: '/order/page1',query:{ id:'2'}})
      // this.$router.push({ name: '定义流程', query: { template: postTemplate }, params: { taskInfo: this.taskInfo } })
      this.$router.push({ name: '定义流程', query: { template: postTemplate }, params: { taskInfo: this.taskInfo } })
    }
  },
  mounted () {
    this.loadAll()
    this.getRegisteredTem();
    // 获取router传来的参数
    this.taskInfo = this.$route.params.taskInfo
  }
}
</script>

<style scoped>
.pClass {
  color: green;
}
.spanClass {
  font-size: 8px;
  color: #999;
  font-style: italic;
}
.fontSizeStyle {
  font-size: 10px;
  color: #a7a6a6;
}
.el-upload--text {
  border: none;
  width: 80px;
  height: 32px;
}
.upload-template {
  margin-top: 20px;
}
.marginFirst {
  margin-top: 1%;
}
.marginSecond {
  margin-top: 5%;
  margin-bottom: 2%;
}
.text {
  font-size: 14px;
}

/* .item {
        padding: 18px 0;
    }*/
ul.templateUl {
  list-style: none;
  min-height: 400px;
}
</style>
