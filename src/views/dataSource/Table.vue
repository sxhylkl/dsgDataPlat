<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="filters">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

        <el-col :span="15" >
          <el-col :span="12">
            <el-form-item label="类型"  v-if="!advanced" >
              <el-select v-model="filters.type" placeholder="选择类型" class="input" clearable filterable >
                <el-option v-for="type in typeList" :label="type.name" :value="type.name"></el-option>
              </el-select>
              <!--<el-tooltip content="类型属性过滤器" v-if="!advanced">
                  <el-button type="primary" icon="setting" size="small" class="pz" @click="typeFilter1"
                             v-bind:disabled="disOne"></el-button>
              </el-tooltip>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="术语" v-if="!advanced">
              <el-select v-model="filters.term" placeholder="选择术语" class="input" clearable filterable>
                <el-option v-for="term in termList" :label="term.name" :value="term.value"></el-option>
              </el-select>
              <!--<el-option label="术语一" value="term1" ></el-option>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签" v-if="!advanced">
              <el-select v-model="filters.tag" placeholder="选择标签" class="input" clearable filterable>
                <el-option v-for="tag in tagList" :label="tag.name" :value="tag.name" ></el-option>
              </el-select>
              <!-- <el-tooltip content="标签属性过滤器" v-if="!advanced">
                   <el-button type="primary" icon="setting" size="small" class="pz" @click="typeFilter2" v-bind:disabled="disTwo"></el-button>
               </el-tooltip>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文本" v-if="!advanced">
              <el-input v-model="filters.query" placeholder="输入文本" class="input"></el-input>
            </el-form-item>
          </el-col>
          <el-form-item label="全文检索" v-if="advanced">
            <el-input v-model="filters.text" placeholder='全文检索' style="width: 600px;"></el-input>
          </el-form-item>

        </el-col>


        <el-col :span="9" align="bottom">
          <el-col :span="12">
            <el-button type="primary" @click="searchTable">搜索</el-button>
            <el-button type="primary" @click="handleAdd">清空</el-button>
            <el-tooltip content="刷新">
              <el-button type="primary" @click="refresh_"><i class="fa fa-refresh"></i></el-button>
            </el-tooltip>

          </el-col>
          <el-col :span="12">
            <el-form-item>
              <font style="margin-left: 10px" class="searchTip">基础搜索</font>
              <el-switch v-model="typeSwitch" on-text="" off-text="">

              </el-switch>
              <font class="searchTip">高级搜索</font>
            </el-form-item>
          </el-col>
        </el-col>


      </el-col>
    </el-form>

    <!--类型过滤界面-->
    <el-dialog title="类型过滤" :visible.sync="typeFilterFormVisible" :close-on-click-modal="false">
    </el-dialog>

    <!--标签过滤界面-->
    <el-dialog title="标签过滤" :visible.sync="tagFilterFormVisible" :close-on-click-modal="false">
    </el-dialog>


    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <span class="pageShow">显示<u> {{startPageCount}}条数据 </u> 从 <font> {{startPage}} </font>-<font> {{endPage}} </font></span>
      <div style="float: right;">
        <el-checkbox label="排除子类型"  v-model="tableFilter1" ></el-checkbox>

        <el-checkbox label="排除子标签" v-model="tableFilter2"></el-checkbox>

        <el-checkbox label="显示历史实体" v-model="tableFilter3" ></el-checkbox>
      </div>
    </el-col>

    <!--列表-->
    <el-table :data="allUser" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;" >
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="index" label="#" width="60" sortable>
      </el-table-column>
      <el-table-column prop="name" label="名称" sortable :show-overflow-tooltip="true">
        <template scope="scope">
          <router-link :to="{ path: '/dataSource/detailPage', query: { guid: scope.row.guid ,name:scope.row.name}}">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="owner" label="拥有者" sortable>
      </el-table-column>
      <el-table-column prop="description" label="描述" sortable>
      </el-table-column>
      <el-table-column prop="type" label="类型" sortable>
        <template scope="scope">
          <router-link :to="{ path: '/dataSource/table', query: { type: scope.row.type }}">{{scope.row.type}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="标签" width="300" sortable>
        <template scope="scope">
          <el-tag v-for="(details,index) in scope.row.tag" v-if="index===0" :closable="true" class="tagbtn" type="primary" @close="deleteTag(scope.$index,scope.row,index)">{{details}}</el-tag>
          <el-tooltip content="添加" placement="right">
            <el-button size="small"  type="primary" class="addbtn"
                       @click="showTagModal(scope.$index)"><i class="fa fa-plus"></i></el-button>
          </el-tooltip>
          <el-popover v-if="scope.row.tag.length>1"
                      placement="bottom"
                      width="180"
                      trigger="click">
            <el-tag v-for="(details,index) in scope.row.tag" :closable="true"  class="tagbtn" type="primary" @close="deleteTag(scope.$index,scope.row,index)">{{details}}</el-tag>
            <el-button slot="reference" type="primary" size="small"><i class="fa fa-ellipsis-h"></i></el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="term" label="术语" width="300" sortable>
        <template scope="scope">
          <el-tag v-for="(details,index) in scope.row.term" v-if="index===0" :closable="true" class="tagbtn" type="primary" @close="deleteTerm(scope.$index,scope.row,index)">{{details}}</el-tag>
          <el-tooltip content="添加" placement="right">
            <el-button size="small" type="primary" class="addbtn" @click="showTermModal(scope.$index)"><i class="fa fa-plus"></i></el-button>
          </el-tooltip>
          <el-popover v-if="scope.row.term.length>1"
                      placement="bottom"
                      width="180"
                      trigger="click">
            <el-tag v-for="(details,index) in scope.row.term":closable="true" class="tagbtn" type="primary" @close="deleteTerm(scope.$index,scope.row,index)">{{details}}</el-tag>
            <el-button slot="reference" type="primary" size="small"><i class="fa fa-ellipsis-h"></i></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="sizes,prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="startPageCount" :page-sizes="[10, 20, 50, 100]" style="float:right;" :total="total" >
      </el-pagination>
    </el-col>

    <!--添加标签界面-->
    <el-dialog title="添加标签" :visible.sync="addTagFormVisible" :close-on-click-modal="false">
      <el-form :model="addTagForm.classification" :rules="addTagFormRules" ref="addTagForm">
        <div>
          <el-form-item prop="typeName">
            <el-select v-model="addTagForm.classification.typeName" auto-complete="off" @change="tagChange" filterable  placeholder="---从下拉列表中选择一个标签---" style="width: 60%;">
              <el-option :label="tagOne.name" v-for="(tagOne,index) in tagList2" :value="index" :key="index">

              </el-option>
            </el-select>
            <el-col style="float: right;width: 30%">
              <el-checkbox label="传播" v-model="addTagForm.classification.propagate"></el-checkbox>
              <el-checkbox label="应用有效期" style="margin-left: 52px;"
                           v-model="tagFilterTwo"></el-checkbox>
            </el-col>
          </el-form-item>
        </div>
        <br>
        <hr>
        <el-button type="info" style="float: right;margin-bottom: 20px; " size="small" @click="addTimeOne"
                   v-if="addTimeBtn"><i class="fa fa-plus"></i>添加有效期
        </el-button>
        <el-col class="box" :span="24" v-if="addTimeBtn">
          <el-col class="box2" :span="24" v-for="(timeOne,index) in addTagForm.classification.validityPeriods" :key="index">
            <el-col :span="7">
              <el-form-item :prop="'validityPeriods.'+index+'.startTime'" :rules="addTagFormRules.startTime">
                <el-date-picker v-model="timeOne.startTime" type="datetime" @change="getTime1(index,$event)"  placeholder="开始时间"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item :prop="'validityPeriods.'+index+'.endTime'" :rules="addTagFormRules.endTime">
                <el-date-picker v-model="timeOne.endTime" type="datetime" @change="getTime2(index,$event)" placeholder="结束时间" style="margin-left: 10px; ;"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item :prop="'validityPeriods.'+index+'.timeZone'" :rules="addTagFormRules.timeZone">
                <el-select v-model="timeOne.timeZone" placeholder="选择时区" filterable style="margin-left: 10px; ;">
                  <el-option :value="timeZoneOne" v-for="timeZoneOne in timeZoneList">{{timeZoneOne}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-button icon="el-icon-delete" type="danger" title="删除" @click="deleteTimeOne(index)"
                       style="margin-left: 20px; ;"></el-button>
          </el-col>
        </el-col>
        <el-col :span="24" v-if="this.attributeDefsList.length>0">
          <p>标签属性（可选）</p>

          <p>添加此标签的属性值</p>
          <el-form-item v-for="(attributeDefs,index) in attributeDefsList" :label="attributeDefs.name+`(${attributeDefs.typeName})`" prop="attr" :key="index">
            <el-input v-model="attributesArr[index]"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addTagFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--添加术语界面-->
    <el-dialog title="将术语分配给实体" :visible.sync="addTermFormVisible" :close-on-click-modal="false">
      <el-input placeholder="搜索字词" v-model="addTermForm.searchWord" style="margin-bottom: 10px"></el-input>
      <el-tree
        class="filter-tree"
        :data="addTermForm.data2"
        :props="addTermForm.defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="true"
        :highlight-current="true"
        node-key="id"
        check-strictly
        @check-change="handleClick"
        :show-checkbox="true"
        ref="tree2">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addTermFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="giveSubmit" :loading="addLoading">分配</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<style scoped="">
  .el-popover>.el-tag{
    margin-top: 3px;
  }
  .input{
    width: 285px;
  }
  .box {
    border: 1px solid #eaeefb;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .box2 {
    padding: 10px 15px 0px 15px;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .pz {
    margin-top: 4px;
    margin-right: 11px;
    margin-left: 8px !important;
  }

  .addbtn {
    margin-left: 2px !important;
  }

  .tagbtn {
    margin-left: 1px !important;
    cursor: pointer;

  }

  a {
    text-decoration: none;
    cursor: pointer;
    color: #38bb9b
  }

  a:hover {
    color: #337ab7;
    text-decoration: underline
  }
</style>
<script>
  import util from '../../utils/util'
  //import NProgress from 'nprogress'
  import {seachUsingBasic,typedefs,deleteTag,addTag,getTerm,deleteTerm,addTerm,spliceTerm} from '../../api/dataSource/api';
  export default {
    data() {
      return {
        startPageCount:10,
        termList:[],
        advanced:false,
        typeSwitch:false,
        i:0,
        filters: {
          type:'',
          term:'',
          tag:'',
          query: '',
          text:''
        },
        attributeDefsList:[],
        typeList:[],
        disOne: true,
        disTwo: true,
        tagFilterFormVisible: false,
        typeFilterFormVisible: false,
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },

        //添加标签页面
        addTagForm: {
          classification:{
            typeName: '',
            attributes:{},
            propagate: true,
            validityPeriods: [],
          },
          entityGuids:[],
        },
        attributesArr:[],
        tagFilterTwo: false,
        addTimeBtn: false,
        addTagFormRules:{
          typeName:[{required:true,message:'请选择标签'}],
          startTime:[{required:true,message:'请输入开始时间'}],
          endTime:[{required:true,message:'请输入结束时间'}],
          timeZone:[{required:true,message:'请选择时区'}],
        },
        tagList: [],
        tagList2:[],//添加标签tagList
        timeZoneList: ["Africa/Abidjan","Africa/Accra","Africa/Algiers","Africa/Bissau","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/El_Aaiun","Africa/Johannesburg","Africa/Juba","Africa/Khartoum","Africa/Lagos","Africa/Maputo","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Asuncion","America/Atikokan","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Cayenne","America/Chicago","America/Chihuahua","America/Costa_Rica","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fort_Wayne","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Inuvik","America/Iqaluit","America/Jamaica","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/La_Paz","America/Lima","America/Los_Angeles","America/Maceio","America/Managua","America/Manaus","America/Martinique","America/Matamoros","America/Mazatlan","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Johns","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kathmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vladivostok","Asia/Yakutsk","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney","CET","CST6CDT","EET","EST","EST5EDT","Etc/GMT+0","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT+8","Etc/GMT+9","Etc/GMT-1","Etc/GMT-13","Etc/GMT-14","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-8","Etc/UCT","Etc/UTC","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Helsinki","Europe/Istanbul","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Lisbon","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/Saratov","Europe/Simferopol","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zaporozhye","Europe/Zurich","HST","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Reunion","MET","MST","MST7MDT","PST8PDT","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","WET"],
        //添加术语页面
        addTermForm:{
          searchWord:'',
          data2: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
        },
        users: [],
        allUser: [],
        showUser: [],
        total: 0,
        tableFilter1:false,
        tableFilter2:false,
        tableFilter3:false,
        startPage: 0,
        endPage: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列
        addTagFormVisible: false,//添加标签模态框是否显示
        addTermFormVisible:false,//添加术语模态框是否显示
        addLoading: false,
        addTermGuid:''
        //

      }
    },
    watch: {
      '$route'(to,from){
        let obj = Object.assign({},this.$route)
        this.filters.type = this.$route.query.type
        this.filters.term = this.$route.query.term
        this.filters.tag = this.$route.query.tag
        this.filters.query = this.$route.query.query
        this.getUsers();
      },
      /* allUser:function () {
         this.total = parseInt(this.allUser.length)+1
       },*/
      'tableFilter1':function () {
        this.getUsers()
      },
      'tableFilter2':function () {
        this.getUsers()
      },
      'tableFilter3':function () {
        this.getUsers()
      },
      //搜索方式改变
      typeSwitch:function (val) {
        this.advanced = val
      },
      //监测添加标签模态框应用有效期是否选中
      'tagFilterTwo': function () {
        if (this.tagFilterTwo) {
          this.addTagForm.classification.validityPeriods = [{'startTime': '', 'endTime': '', 'timeZone': ''}];
          this.addTimeBtn = true
        }
        else {
          this.addTagForm.classification.validityPeriods = [];
          this.addTimeBtn = false
        }
      },
      //监测添加标签模态框中应用有效期数组长度
      'addTagForm.classification.validityPeriods':function () {
        if(this.addTagForm.classification.validityPeriods.length===0){
          this.addTimeBtn = false;
          this.tagFilterTwo = false
        }
      },
      //检测术语过滤输入框
      'addTermForm.searchWord'(val) {
        this.$refs.tree2.filter(val)
      },
    },
    methods: {
      tagChange(val){
        if(typeof(val)==='number'){
          this.attributeDefsList = this.tagList2[val].attributeDefs
          this.attributesArr = [];
        }
        else{
          this.attributeDefsList = []
        }
      },
      getTime1(index,val){
        this.addTagForm.classification.validityPeriods[index].startTime = val
      },
      getTime2(index,val){
        this.addTagForm.classification.validityPeriods[index].endTime = val
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: row.id};
          removeUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //清空所有搜索条件
      handleAdd: function () {
        this.filters = {
          name: '',
          tag: '',
          term: '',
          text: ''
        }
      },
      //新增
      addSubmit: function () {
        var this_ = this
        this.$refs['addTagForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let params = this_.addTagForm;
              params.classification.typeName = this_.tagList2[this_.addTagForm.classification.typeName].name
              for(let key in this_.attributeDefsList){
                this_.addTagForm.classification.attributes[this_.attributeDefsList[key].name] =  this_.attributesArr[key]
              }
              addTag(params).then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '添加标签成功',
                  type: 'success'
                });
                this.addTagFormVisible = false;
                this.getUsers();
              }).catch(err=>{
                this.$notify.error({
                  title:'错误',
                  message:'接口报错',
                })
                this.addTagFormVisible = false;
                this.addLoading = false;
              });
            });
          }
          else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {ids: ids};
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          });
        }).catch(() => {

        });
      },
      //类型过滤模态框
      typeFilter1: function () {
        this.typeFilterFormVisible = true
      },
      //标签过滤模态框
      typeFilter2: function () {
        this.tagFilterFormVisible = true
      },
      //删除标签
      deleteTag:function (index,row,index2) {
        let that = this
        this.$confirm('是否删除该标签?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'}).then(() => {
          this.listLoading = true;
          let param = {guid:that.allUser[index].guid,tagName:that.allUser[index].tag[index2]};
          deleteTag(param).then(res=>{
            this.listLoading = false;
            console.log(res)
            that.allUser[index].tag.splice(index2,1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err=>{
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //删除术语
      deleteTerm:function (index,row,index2) {
        let that = this
        this.$confirm('是否删除该术语?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'}).then(() => {

          this.listLoading = true;
          let params = {guid:[{guid:that.allUser[index].guid,relationshipGuid:that.allUser[index].meanings[index2].relationGuid}],termid:that.allUser[index].meanings[index2].termGuid};
          console.log(params)
          deleteTerm(params).then(res=>{
            this.listLoading = false;
            console.log(res)
            that.allUser[index].term.splice(index2,1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err=>{
            this.listLoading = false;
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //刷新表格
      refresh_: function () {

      },



      //页码转换
      handleCurrentChange(val) {
        this.page = val;
        console.log(val)
        this.getUsers()
        console.log(this.total)
      },
      handleSizeChange(val){
        this.startPageCount = val
        this.getUsers();

      },
      //数据获取
      setAllUser() {
        var this_ = this
        let params = {
          attrubutes: [],
          entityFilters: null,
          excludeDeletedEntities: this.tableFilter3,
          includeClassificationAttributes: true,
          includeSubClassifications: this.tableFilter2,
          includeSubTypes: this.tableFilter1,
          limit: this.startPageCount,
          offset: (this.page-1)*this.startPageCount,
          tagFilters: null,
          classification: this.filters.tag,//标签
          query: this.filters.query,
          termName: this.filters.term,
          typeName: this.filters.type,
        };
        let params2 = {
          attrubutes: [],
          classification: this.filters.tag,//标签
          entityFilters: null,
          excludeDeletedEntities: this.tableFilter3,
          includeClassificationAttributes: true,
          includeSubClassifications: this.tableFilter2,
          includeSubTypes: this.tableFilter1,
          limit: '',
          offset: 0,
          query: this.filters.query,
          tagFilters: null,
          termName: this.filters.term,
          typeName: this.filters.type,
        };
        seachUsingBasic(params).then(function (response) {
          let entities = response.entities;
          let arr = [];
          if(entities){
            for (let key = 0; key < entities.length; key++) {
              let json = {
                name: entities[key].attributes.name,
                owner: entities[key].attributes.owner,
                description: entities[key].attributes.description,
                type: entities[key].typeName,
                tag: entities[key].classificationNames,
                term: entities[key].meaningNames,
                meanings:entities[key].meanings,
                guid:entities[key].guid,
              };
              arr.push(json)
            }
          }

          //this_.total = parseInt(this_.allUser.length/10)+1
          this_.allUser=arr
          this_.startPage = (this_.page-1)*this_.startPageCount+1;
          this_.endPage = (this_.page-1)*this_.startPageCount+this_.allUser.length
        })
          .catch(function (error) {
            this_.allUser = [];
            this_.startPage = 0;
            this_.endPage = 0
            this_.total = 1;
          });
        //获取最大页数
        seachUsingBasic(params2).then(function (response) {
          let entities = response.entities;
          if(entities){
            this_.total = entities.length
          }
          else{
            this_.total =0
          }
        })
        /*   console.log(arr)
           this.total = parseInt(arr.length/10)+1
           this.allUser = arr;*/
      },
      //获取用户列表
      getUsers() {
        this.setAllUser();
        this.listLoading = true;
        setTimeout(() => {
          this.listLoading = false
        }, 1000);

      },
      //显示添加标签模态框
      showTagModal: function (index) {
        this.addTagFormVisible = true;
        this.addTagForm.classification.validityPeriods = [];
        this.addTagForm.classification.propagate=true;
        this.addTimeBtn = false;
        this.tagFilterTwo=false;
        this.addTagForm.classification.typeName='';
        this.addTagForm.entityGuids = [this.allUser[index].guid]
        var tag2_ = this.allUser.slice(0)
        var tag2 = tag2_[index].tag
        var tag1 =  this.tagList.slice(0)
        var newArr = []
        console.log(tag1)
        console.log(tag2_)
        console.log(tag2)
        for(let key1=0;key1<tag1.length;key1++){
          for(let key2=0;key2<tag2.length;key2++){
            console.log(tag1[key1].name)
            if(tag1[key1].name===tag2[key2]){
              newArr.push(tag2[key2])
            }
          }
        }
        for(let value of newArr){
          tag1.splice(tag1.findIndex(item=>item.name===value),1)
        }
        this.tagList2 = tag1
      },
      //显示添加术语页面
      showTermModal:function (index) {
        this.addTermFormVisible = true;
        this.addTermGuid = [this.allUser[index].guid]
      },
      //
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //添加一个有效期
      addTimeOne: function () {
        this.addTagForm.classification.validityPeriods.push({'startTime': '', 'endTime': '', 'timeZone': ''})
      },
      //删除一个有效期
      deleteTimeOne: function (index) {
        this.addTagForm.classification.validityPeriods.splice(index,1)
      },
      //搜索
      searchTable:function () {
        this.page=1
        this.$router.push({path:'/dataSource/table',query:{tag:this.filters.tag,type:this.filters.type,query:this.filters.query,term:this.filters.term}})

      },
      //标签获取
      getTag:function () {
        var this_ = this;
        typedefs({type:'classification'}).then((res)=>{
          let data = res;
          let classificationDefs = data.classificationDefs;
          this_.tagList= classificationDefs
          this_.tagList2= classificationDefs
        })
      },
      //类型获取
      getType:function () {
        var this_ = this;
        typedefs({type:'entity'}).then((res)=>{
          let data = res;
          let entityDefs = data.entityDefs;
          this_.typeList= entityDefs
        })
      },
      //术语获取
      getTerm:function () {
        var this_ = this;
        getTerm().then((res)=>{
          let data = spliceTerm(res);
          console.log(data)
          let arr=[]
          //数据处理
          let arr3 = [];
          for(let value of data){
            let json = {};
            let guid = value.guid;
            let name = value.name;
            let name2 = value.qualifiedName;
            json['id'] = guid;
            json['label'] = name;
            json['disabled'] = true

            let arr2 = [];
            for(let key in value.terms){
              let json2 = {};

              let displayText = value.terms[key].displayText;
              let termGuid = value.terms[key].termGuid;
              json2['id'] = termGuid;
              json2['label']= displayText;
              let json3 = {name:displayText,value:displayText+'@'+name2};
              arr3.push(json3)
              arr2.push(json2)
            }
            json['children'] = arr2
            arr.push(json)
          }
          this.termList = arr3
          this_.addTermForm.data2 = arr
          console.log(arr)
        })
      },
      handleClick(data,checked, node) {
        this.i++;
        if(this.i%2==0){
          if(checked){
            this.$refs.tree2.setCheckedNodes([]);
            this.$refs.tree2.setCheckedNodes([data]);
            //交叉点击节点
          }else{
            this.$refs.tree2.setCheckedNodes([]);
            //点击已经选中的节点，置空
          }
        }
      },
      //分配术语
      giveSubmit:function () {
        let guidList = this.$refs.tree2.getCheckedKeys();
        let arr = [];
        let params = {
          pguid :guidList[0],
          guid:[{guid:this.addTermGuid[0]}]
        }
        this.addTermFormVisible = false
        addTerm(params).then((res)=>{
          this.$message({
            type:'success',
            message:'分配成功'
          })
          this.getUsers();
        }).catch(err=>{
          this.$message({
            type:'error',
            message:'分配失败'
          })
        })
      },


    },
    mounted() {
      if(this.$route.query.tag||this.$route.query.term||this.$route.query.type||this.$route.query.query){
        this.filters.tag = this.$route.query.tag
        this.filters.type = this.$route.query.type
        this.filters.term = this.$route.query.term
        this.filters.query = this.$route.query.query
        this.getUsers();
      }
      this.getTag();
      this.getType();
      this.getTerm()
    },

  }

</script>
