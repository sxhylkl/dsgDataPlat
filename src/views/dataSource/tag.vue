<template>
    <section>
        <el-row :gutter="20">

            <el-col :span="6" id="leftDiv">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>标签目录</span>
                    </div>
                    <div >
                        <div style="float: right;margin-top: 2px;">
                            <el-button type="primary" size="small" title="创建标签" @click="addTagModal('')"><i class="fa fa-plus"></i>
                            </el-button>
                            <el-button type="primary" size="small" title="刷新" @click="refresh"><i class="fa fa-refresh"></i></el-button>
                        </div>
                        <el-input placeholder="搜索字词" v-model="searchWord"
                                  style="margin-top: 10px;margin-bottom: 10px"></el-input>
                        <el-tree
                            class="filter-tree"
                            :data="data1"
                            :props="defaultProps"
                            default-expand-all
                            highlight-current
                            @node-click="nodeClick"
                            :render-content="renderContent"
                            :filter-node-method="filterNode"
                            ref="tree2">
                        </el-tree>
                    </div>
                </el-card>

            </el-col>

            <el-col :span="18">

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>标签详情</span>
                    </div>
                    <div >
                        <!--工具条-->
                        <div v-if="chooseTag">
                            <span class="title2">{{chooseTag.label}}</span>
                            <el-button type="primary" icon="el-icon-edit" title='编辑标签' size="small" style="float: right;"
                                       @click="editTagModal"></el-button>
                            <p>{{chooseTag.description}}</p>
                            <div v-if="chooseTag.superTypes.length>0" style="margin-bottom:8px">
                                <span>父标签:</span>
                                <el-tag v-for="(details,index) in chooseTag.superTypes"  class="tagbtn" type="primary">{{details}}</el-tag></div>
                            <div v-if="chooseTag.subTypes.length>0"  style="margin-bottom:8px">
                                <span>子标签:</span>
                                <el-tag v-for="(details,index) in chooseTag.subTypes"  class="tagbtn" type="primary">{{details}}</el-tag></div>
                            <span>属性:</span>
                            <el-tag v-for="(details,index) in chooseTag.attributeDefs"  class="tagbtn" type="primary">{{details.name}}</el-tag>
                            <el-button type="primary" size="mini" @click="addPropertyModal" title="添加属性"><i class="fa fa-plus"></i></el-button>
                            <!--工具条-->
                        </div>
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
                            <el-table-column prop="description" label="描述" sortable :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column prop="type" label="类型" sortable>
                                <template scope="scope">
                                    <router-link :to="{ path: '/dataSource/table', query: { type: scope.row.type }}">{{scope.row.type}}</router-link>
                                </template>
                            </el-table-column>
                            <el-table-column prop="tag" label="标签" width="250" sortable>
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
                            <el-table-column prop="term" label="术语" width="250" sortable>
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
                    </div>
                </el-card>



            </el-col>

        </el-row>
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

        <!--添加属性界面-->
        <el-dialog title="添加属性" :visible.sync="addPropertyFormVisible" :close-on-click-modal="false">
            <el-form :inline="false" :model="addPropertyForm"  ref="addProperty">
                <el-form-item>
                    <el-button type="primary" size="small" @click="addNewProperty"><i class="fa fa-plus"></i>添加新属性
                    </el-button>
                </el-form-item>

                <el-row :gutter="10" v-for="(dataOne,index) in addPropertyForm.data">
                    <el-col :span="15">
                        <el-form-item  :prop="'data.'+index+'.name'" :rules="addPropertyRules.name">
                            <el-input placeholder="属性名称" v-model="dataOne.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-select v-model="dataOne.typeName" style="width: 100%">
                            <el-option :value="type" v-for="(type,index) in addPropertyForm.typeArr">{{type}}</el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" icon="el-icon-delete" @click="deleteProperty(index)"></el-button>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addPropertyFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAttributes" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑标签界面-->
        <el-dialog title="编辑标签" :visible.sync="editTagFormVisible" :close-on-click-modal="false">
            <el-form :inline="false" :model="editTagForm" label-width="60px" ref="editTagForm" :rules="editTagFormRules">
                <el-form-item label="名称">
                    <el-input v-model="editTagForm.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editTagForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editTagFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editTag" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--添加标签界面2-->
        <el-dialog title="添加标签" :visible.sync="addTagFormVisible2" :close-on-click-modal="false">
            <el-form   :model="addTagForm2" :rules="addTagFormRules2" ref="addTagForm2">
                <el-form-item label="名称" label-width="50px" prop="name">
                    <el-input v-model="addTagForm2.name" ></el-input>
                </el-form-item>
                <el-form-item label="描述" label-width="50px" prop="description">
                    <el-input v-model="addTagForm2.description"></el-input>
                </el-form-item>
                <label style="font-weight: 700;">选择分类以继承属性（可选）</label>
                <p class="text-gray">属性定义了分类的附加属性</p>
                <el-form-item>
                    <v-select v-model="addTagForm2.iProperty" :options="tagList3" multiple placeholder="搜索标签"></v-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="addNewProperty2"><i class="fa fa-plus"></i>添加新属性
                    </el-button>
                </el-form-item>

                <el-row :gutter="10" v-for="(dataOne,index) in addTagForm2.data">
                    <el-col :span="15">
                        <el-form-item   :prop="'data.'+index+'.name'" :rules="addTagFormRules2.dataName">
                            <el-input placeholder="属性名称" v-model="dataOne.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-select v-model="dataOne.typeName" style="width: 100%">
                            <el-option :value="type" v-for="(type,index) in addTagForm2.typeArr"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" icon="el-icon-delete" @click="deleteProperty2(index)"></el-button>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addTagFormVisible2 = false">取消</el-button>
                <el-button type="primary" @click.native="createTag" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {typedefs,seachUsingBasic,deleteTag,deleteTerm,addTag,getTerm,addTerm,addAttributes,createTag,DeleteTag,spliceTerm} from '../../api/dataSource/api'
    export default {
        data() {
            return {
                startPageCount:10,
                i:0,
                addPropertyRules:{
                    name:{required:true,message:'请输入属性名称'}
                },
                attributeDefsList:[],
                chooseTag:'',
                searchWord: '',
                data1: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                //
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
                tagList3:[],
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
                //添加属性页面
                addPropertyForm: {
                    data: [
                        {name: '', typeName: 'string'}
                    ],
                    typeArr: ['string', 'boolean', 'byte', 'short', 'int', 'float', 'double', 'date', 'AtlasGlossaryTermAssignmentStatus', 'AtlasGlossaryTermRelationshipStatus', 'file_action', 'hive_principal_type']
                },
                //编辑标签页面
                editTagForm: {
                    name: '',
                    description: ''
                },
                editTagFormRules:{
                    description:{required:true,message:'请输入标签描述'}
                },
                //添加标签页面
                addTagForm2: {
                    name: '',
                    description: '',
                    iProperty:[],
                    data: [
                        {name: '', typeName: 'string'}
                    ],
                    typeArr: ['string', 'boolean', 'byte', 'short', 'int', 'float', 'double', 'date', 'AtlasGlossaryTermAssignmentStatus', 'AtlasGlossaryTermRelationshipStatus', 'file_action', 'hive_principal_type']
                },
                addTagFormRules2:{
                     name:{required:true,message:'请输入名称'},
                    description:{required:true,message:'请输入描述'},
                    dataName:{required:true,message:'请输入属性名称'},
                },
                users: [],
                allUser: [],
                showUser: [],
                total: 0,
                tableFilter: [],
                tableFilter1:false,
                tableFilter2:false,
                tableFilter3:false,
                startPage: 0,
                endPage: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                editTagFormVisible: false,
                addTagFormVisible: false,//添加标签模态框是否显示
                addTermFormVisible: false,//添加术语模态框是否显示
                addPropertyFormVisible: false,//添加属性模态框是否显示
                addTagFormVisible2: false,//添加标签模态框是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                }
                //
            }
        },
        watch: {

            'tableFilter1':function () {
                this.getUsers()
            },
            'tableFilter2':function () {
                this.getUsers()
            },
            'tableFilter3':function () {
                this.getUsers()
            },
            //检测术语过滤输入框
            searchWord(val) {
                this.$refs.tree2.filter(val)
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
            handleSizeChange(val){
                this.startPageCount = val
                this.getUsers();

            },
            refresh(){
                this.getUsers();
            },
            tagChange(val){
                if(typeof(val)==='number'){
                    this.attributeDefsList = this.tagList2[val].attributeDefs
                    this.attributesArr = [];
                }
                else{
                    this.attributeDefsList = []
                }
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
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getTime1(index,val){
                this.addTagForm.classification.validityPeriods[index].startTime = val
            },
            getTime2(index,val){
                this.addTagForm.classification.validityPeriods[index].endTime = val
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

                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
						this.getUsers();
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
            //页码转换
            handleCurrentChange(val) {
                this.page = val;
                console.log(val)
                this.getUsers()
                console.log(this.total)
            },
            //数据获取
            setAllUser() {
                var this_ = this
                let params = {
                    attrubutes: [],
                    classification: this.chooseTag.label,//标签
                    entityFilters: null,
                    excludeDeletedEntities: this.tableFilter3,
                    includeClassificationAttributes: true,
                    includeSubClassifications: this.tableFilter2,
                    includeSubTypes: this.tableFilter1,
                    limit: this.startPageCount,
                    offset: (this.page-1)*this.startPageCount,
                    query: null,
                    tagFilters: null,
                    termName: null,
                    typeName: null,
                };
                let params2 = {
                    attrubutes: [],
                    classification: this.chooseTag.label,//标签
                    entityFilters: null,
                    excludeDeletedEntities: this.tableFilter3,
                    includeClassificationAttributes: true,
                    includeSubClassifications: this.tableFilter2,
                    includeSubTypes: this.tableFilter1,
                    limit: '',
                    offset: 0,
                    query: null,
                    tagFilters: null,
                    termName: null,
                    typeName: null,
                };
                seachUsingBasic(params).then(function (response) {
                    let entities = response.data.entities;
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
                        console.log(error);
                    });
                //获取最大页数
                seachUsingBasic(params2).then(function (response) {
                    let entities = response.data.entities;
                    if(entities){
                        this_.total = entities.length
                    }
                  else{
                        this_.total = 1
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
            //创建标签
            createTag: function () {
                var this_ = this
                this.$refs['addTagForm2'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let json ={classificationDefs:[{attributeDefs:[]}],entityDefs:[],enumDefs:[],structDefs:[]};
                            json['classificationDefs'][0].name = this.addTagForm2.name;
                            json['classificationDefs'][0].description = this.addTagForm2.description;
                            json['classificationDefs'][0].superTypes = this.addTagForm2.iProperty;
                            let arr2 = [...this.addTagForm2.data]
                            for(let value of arr2){
                                let json2 = Object.assign({cardinality: "SINGLE",isIndexable: false,isOptional: true, isUnique: false,valuesMaxCount: 1,valuesMinCount: 0},value)
                                json['classificationDefs'][0].attributeDefs.push(json2)
                            }
                            createTag(json).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '创建标签成功',
                                    type: 'success'
                                });
                                this.addTagFormVisible2 = false;
                                this.getTag();
                            }).catch(err=>{
                                this.$notify.error({
                                    title:'错误',
                                    message:'接口报错',
                                })
                                this.addTagFormVisible2 = false;
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
            //添加属性模态框展现
            addPropertyModal: function () {
                this.addPropertyFormVisible = true;
                this.addPropertyForm.data = [{name: '', typeName: 'string'}]
            },
            //添加新属性
            addNewProperty: function () {
                this.addPropertyForm.data.push({name: '', typeName: 'string'})
            },
            addNewProperty2:function () {
                this.addTagForm2.data.push({name:'',typeName:'string'})
            },
            //删除属性
            deleteProperty: function (index) {
                this.addPropertyForm.data.splice(index, 1)
            },
            //删除属性2
            deleteProperty2: function (index) {
                this.addTagForm2.data.splice(index, 1)
            },
            //添加属性
            addAttributes: function () {
                var this_ = this
                this.$refs['addProperty'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let params = Object.assign({},this.chooseTag)
                            let arr2 = [...this.addPropertyForm.data]
                            for(let value of arr2){
                                console.log(value)
                              let json = Object.assign({cardinality: "SINGLE",isIndexable: false,isOptional: true, isUnique: false,valuesMaxCount: 1,valuesMinCount: 0},value)
                              console.log(json)
                               params.attributeDefs.push(json)
                            }
                           addAttributes(params).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '添加属性成功',
                                    type: 'success'
                                });
                                this.addPropertyFormVisible = false;
                                this.getUsers();
                            }).catch(err=>{
                                this.$notify.error({
                                    title:'错误',
                                    message:'接口报错',
                                })
                                this.addPropertyFormVisible = false;
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
            //
            //编辑标签页面展现
            editTagModal: function () {
                this.editTagFormVisible = true;
                this.editTagForm.name = this.chooseTag.name;
                this.editTagForm.description = this.chooseTag.description
            },
            //编辑标签
            editTag: function () {
                var this_ = this
                this.$refs['editTagForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let params = Object.assign({},this.chooseTag)
                            params = Object.assign(params,this.editTagForm)
                            let params_ = {classificationDefs:[params],entityDefs: [], enumDefs:[], structDefs: []}
                            addAttributes(params_).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '编辑标签成功',
                                    type: 'success'
                                });
                                this.editTagFormVisible = false;
                                this.chooseTag.description = res.classificationDefs[0].description
                            }).catch(err=>{
                                this.$message({
                                    message: '接口报错',
                                    type: 'error'
                                });
                                this.editTagFormVisible = false;
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
            //创建标签模态框显示
            addTagModal: function (label) {
                if(label){
                    this.addTagForm2.iProperty = [label]

                }
                else{
                    this.addTagForm2.iProperty = []
                }
               this.addTagFormVisible2 = true;
               this.addTagForm2.data = [{name:'',typeName:'string'}]


            },
            //删除标签(总)
            deleteBasicTag:function (data) {

                this.$confirm('是否删除该标签?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
					let json = {classificationDefs:[data],entityDefs:[],enumDefs:[],structDefs:[]}
                    this.listLoading = true;
                    DeleteTag(json).then(res=>{
                        this.listLoading = false;
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
						this.getTag();
						this.allUser = [];
						 this.listLoading = false;
						 this.chooseTag ='';
                    }).catch(err=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
						 this.listLoading = false;
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
			//搜索标签
			goBasic:function(tag){
			  this.$router.push({path:"/dataSource/table",query:{tag:tag}})
			},
            //标签获取
            getTag:function () {
                var this_ = this;
                typedefs({type:'classification'}).then((res)=>{
                    let data = res;
                    let classificationDefs = data.classificationDefs;
                    this_.tagList= classificationDefs
                    this_.tagList2= classificationDefs
                    this_.tagList3 = classificationDefs.map((one)=>one.name)
                    let arr = [];//树状图data
                    for(let value of classificationDefs){
                    /*     if(value['subTypes'].length>0&&value['superTypes'].length===0){
                            let json = Object.assign({label:value.name,id:value.guid,show:false},value);
                            let childrenArr = [];
                            for(let value2 of value['subTypes']){
                                let childrenJson;
                                for(let value3 of classificationDefs){
                                    if(value2===value3.name&&value3['superTypes'].length>0){
                                        childrenJson = Object.assign({label:value2,show:false},value3);
                                        childrenJson['id'] = value3.guid
                                    }
                                }
                                childrenArr.push(childrenJson)
                            }
                            json['children'] = childrenArr
                            arr.push(json)
                        }
                       else if(value['subTypes'].length>0&&value['superTypes'].length>0){

                        }*/
                        let json2 = Object.assign({label:value.name,id:value.guid,show:false},value)
                        arr.push(json2)
                       /*else if(value['superTypes'].length===0&&value['subTypes'].length===0){

                        }*/
                        this.data1 = arr
                    }
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
                    for(let value of data){
                        let json = {};
                        let guid = value.guid;
                        let name = value.name;
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
                            arr2.push(json2)
                        }
                        json['children'] = arr2
                        arr.push(json)
                    }
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
            //树形图自定义
            renderContent(h, { node, data, store }) {
                return (
                    <span>
                    <span>
                    <span>{node.label}</span>
                </span>
                <span style="float: right; margin-right: 20px" v-show={data.show}>
            <el-popover
                placement="bottom"
                width="150"
                trigger="hover">
                 <div class='popoverDiv' style='font-size: 14px !important;color: #666 !important;cursor:pointer;' on-click={()=>this.goBasic(node.label)}><i class="fa fa-search fa-fw" style="margin-left:20px;margin-right:10px"></i>搜索标签</div>
                <div class='popoverDiv' style='font-size: 14px !important;color: #666 !important;cursor:pointer'  on-click={ ()=>this.addTagModal(node.label)}><i class="fa fa-plus fa-fw" style="margin-left:20px;margin-right:10px"></i>创建子标签</div>
                <div class='popoverDiv' style='font-size: 14px !important;color: #666 !important;cursor:pointer' on-click={()=>this.deleteBasicTag(data)}><i class="fa fa-trash fa-fw" style="margin-left:20px;margin-right:10px"></i>删除标签</div>
                    <i class='fa fa-ellipsis-h' slot="reference" ></i>
                </el-popover>

                </span>
                </span>);
            },
            //点击节点触发事件
            nodeClick(data,node){
                let arr = this.data1
                console.log(data)
                for(let value of arr){
                    if(value.children){
                        value['show'] = false
                        for(let value2 of value.children){
                            value2['show'] = false
                        }
                    }
                    else {
                        value['show'] = false
                    }
                }
                data.show = true
                this.chooseTag = data
                this.getUsers()
            }
        },
        mounted() {
            this.getTag();
            this.getTerm();
        }
    }
</script>


<style scoped="">
    #leftDiv>.el-tree{
        max-height: 623px;
        overflow: auto;
    }
    .popoverDiv:hover{
        background: red;
    }
    .title2 {
        font-size: 30px;
        font-weight: 700;
        color: #475669
    }
    .input{
        width: 250px;
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
