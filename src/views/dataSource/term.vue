<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="6" id="leftDiv">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>业务目录</span>
                    </div>
                    <div >
                        <el-form>
                            <el-form-item style="margin-bottom: 0px;">
                                <div style="float:left;vertical-align: middle">
                                    <font class="searchTip">术语</font>
                                    <el-switch v-model="typeSwitch" on-text="" off-text="">

                                    </el-switch>
                                    <font class="searchTip">目录</font>
                                </div>
                                <div style="float: right;margin-top: 2px;">
                                    <el-button type="primary" size="small" title="创建术语表" @click="creatGlossaryModal()"><i class="fa fa-plus"></i>
                                    </el-button>
                                    <el-button type="primary" size="small" title="刷新" @click="refresh"><i class="fa fa-refresh"></i></el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                        <div v-show="!typeSwitch">
                            <el-input placeholder="搜索术语表,术语" v-model="searchWord"
                                      style="margin-top: 10px;margin-bottom: 10px"></el-input>
                            <el-tree
                                class="filter-tree"
                                :data="data1"
                                :props="defaultProps"
                                highlight-current
                                @node-click="nodeClick"
                                :render-content="renderContent"
                                v-loading="loadingTree"
                                :filter-node-method="filterNode"
                                ref="tree1">
                            </el-tree>
                        </div>
                        <div v-show="typeSwitch">
                            <el-input placeholder="搜索词汇表,分类" v-model="searchWord2"
                                      style="margin-top: 10px;margin-bottom: 10px"></el-input>
                            <el-tree
                                id="tree3"
                                class="filter-tree"
                                :data="data3"
                                :props="defaultProps2"
                                highlight-current
                                lazy
                                v-loading="loadingTree"
                                :load="loadNode2"
                                @node-click="nodeClick3"
                                :render-content="renderContent2"
                                :filter-node-method="filterNode2"
                                ref="tree3">
                                <!--@node-click="nodeClick3"-->
                            </el-tree>
                        </div>
                    </div>
                </el-card>

            </el-col>

            <el-col :span="18">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>业务详情</span>
                    </div>
                    <div >
                        <!--工具条-->
                        <div v-if="chooseTerm&&!typeSwitch">
                            <span class="title2">{{chooseTerm.name}}</span>
                            <el-button type="primary"icon="el-icon-edit" title='编辑业务' size="small" style="float: right;"
                                       @click="editTagModal"></el-button>
                            <div  style="margin-bottom:12px">
                                <span>短描述:</span>
                                <span style="color:#20a0ff">{{chooseTerm.shortDescription}}</span></div>
                            <div style="margin-bottom:12px">
                                <span>长描述:</span>
                                <span style="color:#20a0ff">{{chooseTerm.longDescription}}</span></div>
                            <div v-if="chooseTerm.position!=='parent'">
                                <div  style="margin-bottom:12px">
                                    <span>标签:</span>
                                    <el-tag v-for="(details,index) in chooseTerm.classifications"  :closable="true" @close="deleteTag2(details.typeName)"  class="tagbtn" type="primary">{{details.typeName}}</el-tag>
                                    <el-button type="primary" size="mini" @click="showTagModal('type2')" title="添加标签"  ><i class="fa fa-plus"></i></el-button>
                                </div>
                                <span>术语分类:</span>
                                <el-tag v-for="(details,index) in chooseTerm.categories"  class="tagbtn" :closable="true" @close="deleteTerm2(index)" type="primary">{{details.displayText}}</el-tag>
                                <el-button type="primary" size="mini" @click="addPropertyModal" title="添加术语分类"><i class="fa fa-plus"></i></el-button>
                            </div>
                        </div>
                        <div v-if="chooseTerm.position!=='parent'&&typeSwitch===false&&chooseTerm!==''">
                            <el-col :span="24" class="toolbar">
                                <span class="pageShow">显示<u> {{startPageCount}}条数据 </u> 从 <font> {{startPage}} </font>-<font> {{endPage}} </font></span>
                                <!-- <div style="float: right;">
                                     <el-checkbox label="排除子类型"  v-model="tableFilter1" ></el-checkbox>

                                     <el-checkbox label="排除子标签" v-model="tableFilter2"></el-checkbox>

                                     <el-checkbox label="显示历史实体" v-model="tableFilter3" ></el-checkbox>
                                 </div>-->
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
                                <!--  <el-table-column prop="term" label="术语" width="250" sortable>
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
                                  </el-table-column>-->
                            </el-table>

                            <!--工具条-->
                            <el-col :span="24" class="toolbar">
                                <el-pagination layout="sizes,prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="startPageCount" :page-sizes="[10, 20, 50, 100]" style="float:right;" :total="total" >
                                </el-pagination>
                            </el-col>

                        </div>
                        <div v-if="chooseTerm2&&typeSwitch">
                            <span class="title2">{{chooseTerm2.name}}</span>
                            <el-button type="primary" icon="el-icon-delete" title='修改类别' size="small" style="float: right;" @click="editTagModal2"></el-button>
                            <div  style="margin-bottom:12px">
                                <span>短描述:</span>
                                <span style="color:#20a0ff">{{chooseTerm2.shortDescription}}</span></div>
                            <div style="margin-bottom:12px">
                                <span>长描述:</span>
                                <span style="color:#20a0ff">{{chooseTerm2.longDescription}}</span></div>
                            <div v-if="chooseTerm2.position!=='parent'">
                                <span>术语:</span>
                                <el-tag v-for="(details,index) in chooseTerm2.terms"  class="tagbtn" :closable="true" @close="deleteTerm2(index)" type="primary">{{details.displayText}}</el-tag>
                                <el-button type="primary" size="mini" @click="addTermToCagModel" title="添加术语"><i class="fa fa-plus"></i></el-button>
                            </div>
                        </div>
                        <!--demo-->
                        <div v-if="typeSwitch===true">
                            <el-row :gutter="10" style="max-height: 756px;overflow: auto ">
                                <el-col :span="12"  v-for="(one,index) in demoData" style="margin-top: 10px;">
                                    <el-card class="box-card draggle-div" >
                                        <div slot="header" class="clearfix">
                                            <span>{{one.termName}}</span>
                                        </div>
                                        <div v-if="one.ClassificationNames.length!==0">
                                            <span>标签:</span>
                                            <el-tag v-for="o in one.ClassificationNames" type="primary" style="margin-left: 5px;margin-bottom: 10px">
                                                {{o}}
                                            </el-tag>
                                        </div>
                                        <div v-for="(o,key,index) in one.entity"  class="text item smartCard" >
                                            <font style="font-weight: 500;color:black;font-size: 15px">{{key}} - </font>
                                            <font style="font-style: italic;color: rgb(149, 142, 142);">{{o}}</font>
                                        </div>
                                    </el-card>
                                </el-col>

                            </el-row>


                        </div>
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
        <el-dialog title="将类别指定为术语" :visible.sync="addPropertyFormVisible" :close-on-click-modal="false">
            <el-input placeholder="搜索类别" v-model="addTermForm.searchWord" style="margin-bottom: 10px"></el-input>
            <el-tree
                class="filter-tree"
                :data="data2"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :highlight-current="true"
                lazy
                :load="loadNode"
                @node-click="nodeClick2"
                node-key="id"
                check-strictly
                ref="tree2">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addPropertyFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="giveSubmit2" :loading="addLoading">分配</el-button>
            </div>
        </el-dialog>

        <!--添加术语界面2-->
        <el-dialog title="将术语分配给类别" :visible.sync="addTermToCagFormVisible" :close-on-click-modal="false">
            <el-input placeholder="搜索术语" v-model="searchWordCag" style="margin-bottom: 10px"></el-input>
            <el-tree
                class="filter-tree"
                :data="data4"
                :props="props4"
                :filter-node-method="filterNode3"
                :highlight-current="true"
                @node-click="nodeClick4"
                node-key="termGuid"
                check-strictly
                ref="tree4">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addTermToCagFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addTermToCag" :loading="addLoading">分配</el-button>
            </div>
        </el-dialog>

        <!--编辑标签界面-->
        <el-dialog :title="title" :visible.sync="editTagFormVisible" :close-on-click-modal="false">
            <el-form :inline="false" :model="editTagForm" label-width="80px" ref="editTagForm" :rules="editTagFormRules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editTagForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="短描述" prop="description">
                    <el-input v-model="editTagForm.description"></el-input>
                </el-form-item>
                <el-form-item label="长描述" prop="longDes">
                    <el-input v-model="editTagForm.longDes"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editTagFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editTag" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--创建术语表-->
        <el-dialog title="创建术语表" :visible.sync="createGlossaryFormVisible" :close-on-click-modal="false">
            <el-form  label-width="70px"  :model="createGlossaryForm" :rules="createGlossaryFormRules" ref="createGlossaryForm">
                <el-form-item label="名称"  prop="name">
                    <el-input v-model="createGlossaryForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="短描述" prop="shortDescription">
                    <el-input v-model="createGlossaryForm.shortDescription"></el-input>
                </el-form-item>
                <el-form-item label="长描述" prop="longDescription">
                    <el-input v-model="createGlossaryForm.longDescription"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="createGlossaryFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="createGlossary" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--为术语表添加项目-->
        <el-dialog title="创建项目" :visible.sync="createProjectFormVisible" :close-on-click-modal="false">
            <el-form  label-width="70px"  :model="createProjectForm" :rules="createProjectFormRules" ref="createProjectForm">
                <el-form-item label="名称"  prop="name">
                    <el-input v-model="createProjectForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="短描述" prop="shortDescription">
                    <el-input v-model="createProjectForm.shortDescription"></el-input>
                </el-form-item>
                <el-form-item label="长描述" prop="longDescription">
                    <el-input v-model="createProjectForm.longDescription"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="createProjectFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="createProject_" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--创建类别-->
        <el-dialog title="创建类别" :visible.sync="createCagFormVisible" :close-on-click-modal="false">
            <el-form  label-width="70px"  :model="createCagForm" :rules="createCagFormRules" ref="createCagForm">
                <el-form-item label="名称"  prop="name">
                    <el-input v-model="createCagForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="短描述" prop="shortDescription">
                    <el-input v-model="createCagForm.shortDescription"></el-input>
                </el-form-item>
                <el-form-item label="长描述" prop="longDescription">
                    <el-input v-model="createCagForm.longDescription"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="createCagFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="createCag_" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {deleteCategory,getCategory,typedefs,seachUsingBasic,deleteTag,deleteTerm,addTag,getTerm,addTerm,addAttributes,createTag,DeleteTag,getTermDetails,putTerm,getRelation,putCategory,putGlossary,createGlossary,deleteGlossary,postTerm,deleteTerm_,creatCategory,demo,spliceTerm} from '../../api/dataSource/api'
    export default {
        data() {
            return {
                loadingTree:false,
                startPageCount:10,
                createCagType:'',
                chooseTermToCagData:'',
                addTermToCagFormVisible:false,
                data4:[],
                searchWordCag:'',
                demoData:[],
                chooseTerm2:'',
                data3:[],
                defaultProps2: {
                    children: 'children',
                    label: 'name'
                },
                //创建术语表
                createGlossaryFormVisible:false,
                createGlossaryForm:{
                    name:'',
                    shortDescription:'',
                    longDescription:''
                },
                createGlossaryFormRules:{
                    name:{required:true,message:'请输入术语表名称'}
                },
                //创建术语表
                //为术语表添加项目
                createProjectFormVisible:false,
                createProjectForm:{
                    name:'',
                    shortDescription:'',
                    longDescription:''
                },
                createProjectFormRules:{
                    name:{required:true,message:'请输入术语表名称'}
                },
                //为术语表添加项目
                //创建类别
                createCagFormVisible:false,
                createCagForm:{
                name:'',
                    shortDescription:'',
                    longDescription:''
            },
                createCagFormRules:{
                name:{required:true,message:'请输入术语表名称'}
            },
            //创建类别
                title:'修改项目',
                ChooseCate:'',
                props2: {
                    label: 'label',
                    children: 'children'
                },
                props4: {
                    label: 'displayText',
                    children: 'children'
                },
                data2:[],
                glossary:[],
                ChooseNode:'',
                typeSwitch:false,
                addPropertyRules:{
                    name:{required:true,message:'请输入属性名称'}
                },
                attributeDefsList:[],
                chooseTerm:'',
                searchWord: '',
                searchWord2:'',
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
                    description: '',
                    longDes:'',
                },
                editTagFormRules:{
                    name:{required:true,message:'请输入项目名称'},
                   /* description:{required:true,message:'请输入短描述'},
                    longDes:{required:true,message:'请输入长描述'}*/
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
            typeSwitch(){
            },
            'chooseTerm2.position'(val){
                if(this.typeSwitch===true) {
                    if (val === 'parent') {
                        this.title = '修改词汇表'
                    }
                    else {
                        this.title = '修改类别'
                    }
                }
            },
            'chooseTerm.position'(val){
                if(this.typeSwitch===false){
                    if(val==='parent'){
                        this.title='修改术语表'
                    }
                    else {
                        this.title='修改项目'
                    }
                }


            },
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
                this.$refs.tree1.filter(val)
            },
            searchWord2(val) {
                this.$refs.tree3.filter(val)
            },
            searchWordCag(val) {
                this.$refs.tree4.filter(val)
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
            getData3(){
                let arr = [...this.glossary]
                let data3 = [];
                for(let value of arr){
                    let json = {position:'parent',show:false};
                    if(value.categories){
                        let arr2 = [];
                         for(let value2 of value.categories){

                             if(!value2.parentCategoryGuid){
                                    let json2 = Object.assign({'name':value2.displayText,position:'children',show:false},value2)
                                    arr2.push(json2)
                             }
                         }
                        json['children'] = arr2
                        json = Object.assign(json,value)
                    }
                    else{
                        json = Object.assign(json,value)
                    }

                    data3.push(json)
                }
                this.data3 = data3
                console.log(data3)

            },
            loadNode2(node, resolve) {
                let this_ = this;
                if(node.level ===1){
                    console.log(this_.data3)
                    for(let value of this_.data3){
                        if(value.name === node.data.name){
                            if(value.children){
                                return resolve(value.children.map(one=>Object.assign({position:'children',show:false},one)))
                            }
                        else{
                                return resolve([])
                            }
                        }
                    }
                }

                if (node.level >1) {
                    getRelation(node.data.categoryGuid).then(res=>{
                        let data  = []
                        if(res.children){
                            for(let value of res.children){
                                let json={};
                                json['categoryGuid'] = value.categoryGuid
                                json['name'] = value.displayText
                                json['relationGuid'] = value.relationGuid
                                json['show'] = false
                                json['position'] = 'children'
                                data.push(json)
                            }
                        }
                        else{
                            data=[];
                        }
                        setTimeout(()=>{
                            resolve(data)},300
                        )
                    }).catch(res=>{
                        console.log('error!')
                    })
                }


            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve(this.data2);
                }
                if(node.level > 0){
                    getRelation(node.data.id).then(res=>{
                        let data  = []
                        if(res.children){
                            for(let value of res.children){
                                let json={};
                                json['id'] = value.categoryGuid
                                json['label'] = value.displayText
                                json['relation'] = value.relationGuid
                                data.push(json)
                            }
                        }
                        else{
                            data=[];
                        }
                        setTimeout(()=>{
                            resolve(data)},300
                        )

                    }).catch(res=>{
                        console.log('error!')
                    })
                }

            },
            refresh(){
                this.getTermDetails_();
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
            filterNode2(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            filterNode3(value, data) {
                if (!value) return true;
                return data.displayText.indexOf(value) !== -1;
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
            //删除术语标签
            deleteTag2:function (tagName) {
                let that = this
                this.$confirm('是否删除该标签?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    this.listLoading = true;
                    let param = {guid:this.chooseTerm.guid,tagName:tagName};
                    deleteTag(param).then(res=>{
                        this.listLoading = false;

                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTermDetails_();
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
                    deleteTerm(params).then(res=>{
                        this.listLoading = false;
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
            //删除术语分类
            deleteTerm2:function (index) {
                let that = this
                this.$confirm('是否删除该术语?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    this.listLoading = true;
                    if(this.typeSwitch===false){
                        let params = Object.assign({},this.chooseTerm)
                        params.categories.splice(index,1)
                        putTerm(params).then(res=>{
                            this.listLoading = false;
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getTermDetails_();
                        }).catch(err=>{
                            this.listLoading = false;
                            this.$message({
                                type: 'error',
                                message: '删除失败'
                            });
                        })
                    }
                    else{
                        let params = Object.assign({},this.chooseTerm2)
                        params.terms.splice(index,1)
                        putCategory(params).then(res=>{
                            this.listLoading = false;
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.chooseTerm2=res
                            demo(res.guid).then(res=>{
                                this.demoData = res
                            })
                        }).catch(err=>{
                            this.listLoading = false;
                            this.$message({
                                type: 'error',
                                message: '删除失败'
                            });
                        })
                    }

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
                this.getUsers()
            },
            //数据获取
            setAllUser() {
                var this_ = this
                let params = {
                    classification: null,//标签
                    excludeDeletedEntities: true,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    includeSubTypes: true,
                    limit: this.startPageCount,
                    offset: (this.page-1)*this.startPageCount,
                    termName: this.chooseTerm.qualifiedName,
                    typeName: null,
                };
                let params2 = {
                    classification: null,//标签
                    excludeDeletedEntities: true,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    includeSubTypes:true,
                    limit: '',
                    offset: 0,
                    termName: this.chooseTerm.qualifiedName,
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
                if(index==='type2'){
                    this.addTagForm.entityGuids = [this.chooseTerm.guid]
                    let tag2_ = this.allUser.slice(0)
                    let tag2 = this.chooseTerm.classifications.map(one=>one.typeName)
                    let tag1 =  this.tagList.slice(0)
                    let newArr = []
                    for(let key1=0;key1<tag1.length;key1++){
                        for(let key2=0;key2<tag2.length;key2++){
                            if(tag1[key1].name===tag2[key2]){
                                newArr.push(tag2[key2])
                            }
                        }
                    }
                    for(let value of newArr){
                        tag1.splice(tag1.findIndex(item=>item.name===value),1)
                    }
                    this.tagList2 = tag1
                }
                else{
                    this.addTagForm.entityGuids = [this.allUser[index].guid]
                    let tag2_ = this.allUser.slice(0)
                    let tag2 = tag2_[index].tag
                    let tag1 =  this.tagList.slice(0)
                    let newArr = []
                    for(let key1=0;key1<tag1.length;key1++){
                        for(let key2=0;key2<tag2.length;key2++){
                            if(tag1[key1].name===tag2[key2]){
                                newArr.push(tag2[key2])
                            }
                        }
                    }
                    for(let value of newArr){
                        tag1.splice(tag1.findIndex(item=>item.name===value),1)
                    }
                    this.tagList2 = tag1
                }

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
                                this.getTermDetails_();
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
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //添加属性模态框展现
            addPropertyModal: function () {
                this.ChooseCate = ''
                this.addPropertyFormVisible = true;
                this.addPropertyForm.data = [{name: '', typeName: 'string'}]
                let chooseParentId = this.chooseTerm.anchor.glossaryGuid
                let categories = []
                for(let value of this.glossary){
                    if(value.guid===chooseParentId){
                        categories = value.categories
                    }
                }
                let arr = [];

              if(categories){
                  for(let value of categories){
                      if(value['parentCategoryGuid']===undefined){
                          let json = {};
                          json['label'] = value.displayText
                          json['id'] = value.categoryGuid
                          if(value.relationGuid){
                              json['relation'] = value.relationGuid
                          }

                          if(value.relationGuid){
                              json['children'] = [];
                              for(let value2 of categories){
                                  if(value2['parentCategoryGuid']===value.categoryGuid){
                                      let json2 = {};
                                      json2['label'] = value2.displayText
                                      json2['id'] = value2.categoryGuid
                                      if(value2.relationGuid){
                                          json2['relation'] = value2.relationGuid
                                      }

                                      json['children'].push(json2)

                                  }
                              }
                          }

                          arr.push(json)
                      }

                  }
                  this.data2 = arr
              }
              else{
                  this.data2 = []
              }



            },
            addTermToCagModel(){
                  this.addTermToCagFormVisible = true
                console.log(this.data4)
            },
            sss(nn){
            },
            //添加新属性
            addNewProperty: function () {
                this.addPropertyForm.data.push({name: '', typeName: 'string'})
            },
            //删除属性
            deleteProperty: function (index) {
                this.addPropertyForm.data.splice(index, 1)
            },
            //添加属性
            addAttributes: function () {
                var this_ = this
                this.$refs['addProperty'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let params = Object.assign({},this.chooseTerm)
                            let arr2 = [...this.addPropertyForm.data]
                            for(let value of arr2){
                                let json = Object.assign({cardinality: "SINGLE",isIndexable: false,isOptional: true, isUnique: false,valuesMaxCount: 1,valuesMinCount: 0},value)
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
                this.editTagForm.name = this.chooseTerm.name;
                this.editTagForm.description = this.chooseTerm.shortDescription
                this.editTagForm.longDes = this.chooseTerm.longDescription
            },
            editTagModal2: function () {
                this.editTagFormVisible = true;
                this.editTagForm.name = this.chooseTerm2.name;
                this.editTagForm.description = this.chooseTerm2.shortDescription
                this.editTagForm.longDes = this.chooseTerm2.longDescription
            },
            //修改项目
            editTag: function () {
                var this_ = this
                this.$refs['editTagForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            if(this.typeSwitch===false){
                                let params = Object.assign({},this.chooseTerm)
                                params.shortDescription = this.editTagForm.description
                                params.longDescription = this.editTagForm.longDes
                                params.name = this.editTagForm.name
                                if(this.chooseTerm.position==='parent'){
                                    putGlossary(params).then((res) => {
                                        this.addLoading = false;
                                        this.$message({
                                            message: '修改项目成功',
                                            type: 'success'
                                        });
                                        this.editTagFormVisible = false;
                                        this.chooseTerm  = Object.assign(this.chooseTerm,res)
                                        this.getTerm();
                                    }).catch(err=>{
                                        this.$message({
                                            message: '修改项目失败',
                                            type: 'error'
                                        });
                                        this.editTagFormVisible = false;
                                        this.addLoading = false;
                                    });
                                }
                               else{
                                    putTerm(params).then((res) => {
                                        this.addLoading = false;
                                        this.$message({
                                            message: '修改项目成功',
                                            type: 'success'
                                        });
                                        this.editTagFormVisible = false;
                                        this.getTermDetails_();
                                    }).catch(err=>{
                                        this.$message({
                                            message: '修改项目失败',
                                            type: 'error'
                                        });
                                        this.editTagFormVisible = false;
                                        this.addLoading = false;
                                    });
                                }
                            }
                           else{
                                if(this.typeSwitch===true){
                                    let params = Object.assign({},this.chooseTerm2)
                                    params.shortDescription = this.editTagForm.description
                                    params.longDescription = this.editTagForm.longDes
                                    params.name = this.editTagForm.name
                                    if(this.chooseTerm2.position==='parent'){
                                        putGlossary(params).then((res) => {
                                            this.addLoading = false;
                                            this.$message({
                                                message: '修改词汇表成功',
                                                type: 'success'
                                            });
                                            this.editTagFormVisible = false;
                                            this.chooseTerm2  = Object.assign(this.chooseTerm2,res)
                                        }).catch(err=>{
                                            this.$message({
                                                message: '修改词汇表失败',
                                                type: 'error'
                                            });
                                            this.editTagFormVisible = false;
                                            this.addLoading = false;
                                        });
                                    }
                                    else{
                                        putCategory(params).then((res) => {
                                            this.addLoading = false;
                                            this.$message({
                                                message: '修改类别成功',
                                                type: 'success'
                                            });
                                            this.editTagFormVisible = false;
                                            this.chooseTerm2=Object.assign(this.chooseTerm2,res);
                                        }).catch(err=>{
                                            this.$message({
                                                message: '修改类别失败',
                                                type: 'error'
                                            });
                                            this.editTagFormVisible = false;
                                            this.addLoading = false;
                                        });
                                    }
                            }


                            }

                        });
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //创建术语表
            createGlossary: function () {
                var this_ = this
                this.$refs['createGlossaryForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let params = Object.assign({},this.createGlossaryForm)
                            createGlossary(params).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '创建术语表成功',
                                    type: 'success'
                                });
                                this.createGlossaryFormVisible = false;
                                this.getTerm();
                                this.$refs.tree1.setChecked(this.chooseTerm.guid,true);
                            }).catch(err=>{
                                this.$message({
                                    message: '创建术语表失败',
                                    type: 'error'
                                });
                                this.createGlossaryFormVisible = false;
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
            //创建术语表项目
            createProject_: function () {
                var this_ = this
                this.$refs['createProjectForm'].validate((valid) => {
                    if (valid) {
                            this.addLoading = true;
                            let params = Object.assign({anchor:{displayText:this.chooseTerm.name,glossaryGuid:this.chooseTerm.guid}},this.createProjectForm)
                            postTerm(params).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '创建项目成功',
                                    type: 'success'
                                });
                                this.createProjectFormVisible = false;
                                this.getTerm();
                                this.$refs.tree1.setChecked(this.chooseTerm.guid,true);
                            }).catch(err=>{
                                this.$message({
                                    message: '创建项目失败',
                                    type: 'error'
                                });
                                this.createProjectFormVisible = false;
                                this.addLoading = false;
                            });
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //创建类别
            createCag_: function () {
                var this_ = this
                this.$refs['createCagForm'].validate((valid) => {
                    if (valid) {
                            this.addLoading = true;
                            let params;
                            if(this.createCagType==='parent'){
                                 params = Object.assign({anchor:{displayText:this.chooseTerm2.name,glossaryGuid:this.chooseTerm2.guid}},this.createCagForm)
                            }
                            else if(this.createCagType==='children'){
                                let name = this.chooseTerm2.qualifiedName
                                params = Object.assign({anchor:{glossaryGuid:this.chooseTerm2.anchor.glossaryGuid,displayText:name.substring(name.indexOf('@')+1,name.length)},parentCategory:{categoryGuid:this.chooseTerm2.guid}},this.createCagForm)
                            }

                            creatCategory(params).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '创建类别成功',
                                    type: 'success'
                                });
                                this.createCagFormVisible = false;
                                this.getTerm();
                            }).catch(err=>{
                                this.$message({
                                    message: '创建类别失败',
                                    type: 'error'
                                });
                                this.createCagFormVisible = false;
                                this.addLoading = false;
                            });
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //创建术语表模态框显示
            creatGlossaryModal: function () {
                this.createGlossaryFormVisible = true;
                this.createGlossaryForm = {name:'', shortDescription:'', longDescription:''}
            },
            //创建术语表项目模态框显示
            createProject: function () {
                this.createProjectFormVisible = true;
                this.createProjectForm = {name:'', shortDescription:'', longDescription:''}
    },
            //创建类别显示
            createCag(params){
                this.createCagType = params
                this.createCagFormVisible = true;
                this.createCagForm = {name:'', shortDescription:'', longDescription:''}
            },
            //删除术语表
            deleteGlossary_:function (id) {
                this.$confirm('是否删除该术语表?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    deleteGlossary(id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTerm();
                        this.chooseTerm2='';
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
            //删除术语表项目
            deleteProject_:function (id) {
                this.$confirm('是否删除该项目?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    deleteTerm_(id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTerm();
                        this.chooseTerm = ''
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
            deleteCag_:function (id) {
                this.$confirm('是否删除该类别?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'}).then(() => {
                    deleteCategory(id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTerm();
                        this.chooseTerm2 = ''
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
            //搜索标签
            goBasic:function(tag){
                this.$router.push({path:"table",query:{tag:tag}})
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
                })
            },
            //术语获取
            getTerm:function () {
                var this_ = this;
                this.loadingTree = true
                getTerm().then((res)=>{
                    let data = spliceTerm(res);
                    let arr=[]
                    //数据处理
                    for(let value of data){
                        let json = {};
                        let guid = value.guid;
                        let name = value.name;
                        json['id'] = guid;
                        json['label'] = name;
                        json['disabled'] = true
						json['position'] = 'parent'
						json['show'] = false
                        json['shortDescription'] = value.shortDescription
                        json['longDescription'] = value.longDescription
                        json['qualifiedName'] = value.qualifiedName
                        json['categories'] = value.categories
                        json['terms'] = value.terms
                        let arr2 = [];
                        for(let key in value.terms){
                            let json2 = {};
                            let displayText = value.terms[key].displayText;
                            let termGuid = value.terms[key].termGuid;
                            json2['id'] = termGuid;
                            json2['label']= displayText;
						    json2['position'] = 'children'
							json2['value'] = displayText+'@'+name
							json2['show'] = false
							json2['relationGuid'] = value.terms[key].relationGuid
                            arr2.push(json2)
                        }
                        json['children'] = arr2
                        arr.push(json)
                    }
                    this_.addTermForm.data2 = arr
                    this_.data1 = arr
                    this_.glossary  = res
                    this_.getData3();
                    this.loadingTree = false

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
                    this.getTermDetails_();
                }).catch(err=>{
                    this.$message({
                        type:'error',
                        message:'分配失败'
                    })
                })
            },
            //将类别指定于术语
            giveSubmit2:function () {
                let params = Object.assign({},this.chooseTerm);
                if(params['categories']){
                    params['categories'].push(this.ChooseCate)
                }
               else{
                    params['categories']=[]
                    params['categories'].push(this.ChooseCate)
                }
                this.addLoading = true
                putTerm(params).then((res)=>{
                    this.$message({
                        type:'success',
                        message:'分配成功'
                    })
                    this.addPropertyFormVisible = false
                    this.addLoading = false
                    this.getTermDetails_();
                }).catch(err=>{
                    this.$message({
                        type:'error',
                        message:'分配失败'
                    })
                    this.addPropertyFormVisible = false
                    this.addLoading = false
                })
            },
            //将术语分配给类别
            addTermToCag(){
                let params = Object.assign({},this.chooseTerm2);
                if(params['terms']){
                    params['terms'].push({termGuid:this.chooseTermToCagData.termGuid})
                }
                else{
                    params['terms']=[]
                    params['terms'].push(this.chooseTermToCagData)
                }
                this.addLoading = true
                putCategory(params).then((res)=>{
                    this.$message({
                        type:'success',
                        message:'分配成功'
                    })
                    this.addTermToCagFormVisible = false
                    this.addLoading = false
                    this.chooseTerm2 = res
                    demo(res.guid).then(res=>{
                        this.demoData = res
                    })
                }).catch(err=>{
                    this.$message({
                        type:'error',
                        message:'分配失败'
                    })
                    this.addTermToCagFormVisible = false
                    this.addLoading = false
                })
            },
			   //获取该术语详情
            getTermDetails_(){
                getTermDetails(this.ChooseNode).then(res=>{
                    this.chooseTerm = res
                    console.log(this.chooseTerm)
                    this.getUsers()
                }).catch(res=>{

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
                <div v-show={data.position==='parent'} class='popoverDiv' style='font-size: 14px !important;color: #666 !important;cursor:pointer'  on-click={ ()=>this.createProject()}><i class="fa fa-plus fa-fw" style="margin-left:20px;margin-right:10px"></i>创建项目</div>
                <div class='popoverDiv' v-show={data.position==='parent'} style='font-size: 14px !important;color: #666 !important;cursor:pointer' on-click={()=>this.deleteGlossary_(data.id)}><i class="fa fa-trash fa-fw" style="margin-left:20px;margin-right:10px"></i>删除术语表</div>
                <div class='popoverDiv' v-show={data.position==='children'} style='font-size: 14px !important;color: #666 !important;cursor:pointer' on-click={()=>this.deleteProject_(data.id)}><i class="fa fa-trash fa-fw" style="margin-left:20px;margin-right:10px"></i>删除项目</div>
                <i class='fa fa-ellipsis-h' slot="reference" ></i>
                    </el-popover>

                    </span>
                    </span>);
            },
            //树形图自定义
            renderContent2(h, { node, data, store }) {
                return (
                    <span>
                    <span>
                    <span>{node.label}</span>
                </span>
                <span style="float: right; margin-right: 20px;display:none"  class="menuM">
            <el-popover
                placement="bottom"
                width="150"
                trigger="hover">
                    <div v-show={data.position==='parent'} class='popoverDiv' style='font-size: 14px !important;color: #666 !important;cursor:pointer'  on-click={ ()=>this.createCag(data.position)}><i class="fa fa-plus fa-fw" style="margin-left:20px;margin-right:10px"></i>创建类别</div>
                <div class='popoverDiv' v-show={data.position==='parent'} style='font-size: 14px !important;color: #666 !important;cursor:pointer' on-click={()=>this.deleteGlossary_(data.guid)}><i class="fa fa-trash fa-fw" style="margin-left:20px;margin-right:10px"></i>删除术语表</div>
                <div v-show={data.position==='children'} class='popoverDiv' style='font-size: 14px !important;color: #666 !important;cursor:pointer'  on-click={ ()=>this.createCag(data.position)}><i class="fa fa-plus fa-fw" style="margin-left:20px;margin-right:10px"></i>创建子类别</div>
                <div class='popoverDiv' v-show={data.position==='children'} style='font-size: 14px !important;color: #666 !important;cursor:pointer' on-click={()=>this.deleteCag_(data.categoryGuid)}><i class="fa fa-trash fa-fw" style="margin-left:20px;margin-right:10px"></i>删除类别</div>
                <i class='fa fa-ellipsis-h' slot="reference" ></i>
                    </el-popover>

                    </span>
                    </span>);
            },
            //点击节点触发事件
            nodeClick(data,node){
                let arr = this.data1
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
                this.ChooseNode = data.id
			if(data.position==='children'){

				this.getTermDetails_()
			}
			else if(data.position==='parent'){
			    this.chooseTerm = {
			        name:data.label,
                    shortDescription:data.shortDescription,
                    longDescription:data.longDescription,
                    qualifiedName:data.qualifiedName,
                    guid:data.id,
                    categories:data.categories,
                    terms:data.terms,
                    position:data.position
                }
                this.allUser = [];
			    console.log(this.chooseTerm)
            }
            },
            nodeClick2(data,node){
                this.ChooseCate = {categoryGuid:data.id,displayText:data.label,relationGuid:data.relation}

                },
            nodeClick3(data,node,tree){
                let arr = this.data3
                console.log(data)
                if(data.position==='parent'){
                    this.demoData =''
                }

              if(data.categoryGuid){
                  demo(data.categoryGuid).then(res=>{
                      this.demoData = res
                  })
                  getCategory(data.categoryGuid).then(res=>{
                      this.chooseTerm2 = res
                      console.log(this.chooseTerm2)
                      for(let value of this.glossary){
                          let qName = this.chooseTerm2.qualifiedName
                          if(value.qualifiedName===qName.substring(qName.indexOf('@')+1,qName.length)){
                                 this.data4 =value.terms
                              return false
                          }
                      }
                  })
              }
              else{
                  this.chooseTerm2 = data
              }

            },
            nodeClick4(data,node,tree){
              this.chooseTermToCagData = data

            },
            test(){
                $('.el-tree-node').on('click',function () {
                    $('.menuM').css('display','none')
                    $(this).children('.el-tree-node__content').find('.menuM').css('display','block')
                })
            },
        },
        mounted() {
            this.getTag();
            this.getTerm();
        },
        updated:function () {
            this.test()
        }
    }
</script>
<style>
    .box-card .el-card__header{
        background-color: #00a7d0 !important;
        color: #fff !important;
    }

    .item {
        margin-bottom: 18px;
    }
   /* .el-card__body{
        height: 270px;
        overflow: auto;
    }*/
</style>

<style scoped="">

    .el-card__body{
        height: 270px;
        overflow: auto;
    }
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
