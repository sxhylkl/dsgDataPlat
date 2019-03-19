<template>
    <section id="timeToString">
        <el-row :gutter="20" v-show="!details" style='margin:0'>
            <el-row>
                <el-col :span="18">
                    <el-form >
                        <el-form-item label="告警监控管理" label-width="200px">
                            <el-input placeholder="请输入查询条件" v-model="query"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>

            </el-row>

            <el-col :span="24" style="padding: 0">
                <el-tabs v-model="activeName" style="margin-bottom: 15px;">
                    <el-tab-pane label="所有" name=""></el-tab-pane>
                    <el-tab-pane label="信息" name="INFO"></el-tab-pane>
                    <el-tab-pane label="警告" name="WARNING"></el-tab-pane>
                    <el-tab-pane label="次要" name="MINOR"></el-tab-pane>
                    <el-tab-pane label="主要" name="MAJOR"></el-tab-pane>
                    <el-tab-pane label="危险" name="CRITICAL"></el-tab-pane>
                    <el-tab-pane label="致命" name="FATAL"></el-tab-pane>
                </el-tabs>
                <el-table
                    :data="showServiceData"
                    row-key="instanceId"
                    style="width: 100%"
                    v-loading="loadding"
                    @row-click="rowClick"
                >
                    <el-table-column
                        label="级别"
                        sortable
                       >
                        <template slot-scope="scope">
                            <span>{{scope.row.level|filter2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        sortable
                        >
                        <template slot-scope="scope">
                            <div  v-if="scope.row.state==='UNHANDLED'" style="color: #d81e06;font-weight:bold;"><img src="@/static/dataCenter/images/fail.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">未处理</span></div>
                            <div  v-if="scope.row.state==='HANDLED'" style="color: #28b758;font-weight:bold;"><img src="@/static/dataCenter/images/succes.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">已处理</span></div>
                            <div  v-if="scope.row.state==='IN_PROGRESS'" style="color: #ff9901;font-weight:bold;"><img src="@/static/dataCenter/images/clock.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">进行中</span></div>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="类型"

                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.subtype}}</span>

                        </template>
                    </el-table-column>
                    <el-table-column
                        label="创建时间"
                    prop="createdTime">

                    </el-table-column>


                </el-table>

                <div class="block" style="float:right;margin-top: 12px;">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <el-row v-show="details" :gutter="20">
            <el-col :span="17" style="padding: 0">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>告警详情</span>
                        <el-button style="float: right; padding: 2px 7px" type="success" @click="details = false">返回列表</el-button>
                    </div>
                    <div >
                        <el-row style="display: flex">
                            <div class="flex">

                                <!-- <span  class='help-block'><img src="@/static/dataCenter/images/running.png" >已启动</span>-->
                                <span>{{detailsData.level|filter2}}</span>
                                <span class="help-block">等级</span>
                            </div>
                            <div class="flex">
                                <span>{{detailsData.type}}</span>
                                <span class="help-block">方式</span>
                            </div>

                            <div class="flex">
                                <span>{{(new Date(detailsData.createdTime)).toLocaleString()}}</span>
                                <span class="help-block">开始时间</span>
                            </div>
                        </el-row>
                        <el-row style="display: flex;padding-top: 20px;padding-bottom: 20px">
                            <div class="flex">
                                <span>描述</span>
                                <span class="help-block">{{detailsData.description}}</span>
                            </div>
                        </el-row>

                                <el-table  :data="detailsData.events">
                                    <el-table-column label="状态" >
                                        <template slot-scope="scope">
                                            <div  v-if="scope.row.state==='UNHANDLED'" style="color: #d81e06;font-weight:bold;"><img src="@/static/dataCenter/images/fail.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">未处理</span></div>
                                            <div  v-if="scope.row.state==='HANDLED'" style="color: #28b758;font-weight:bold;"><img src="@/static/dataCenter/images/succes.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">已处理</span></div>
                                            <div  v-if="scope.row.state==='IN_PROGRESS'" style="color: #ff9901;font-weight:bold;"><img src="@/static/dataCenter/images/clock.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">进行中</span></div>

                                        </template>
                                    </el-table-column>
                                    <el-table-column label="用户" prop="user">
                                    </el-table-column>
                                    <el-table-column label="备注" prop="description">
                                    </el-table-column>
                                    <el-table-column label="创建时间">
                                       <template slot-scope="scope">
                                           <span>{{(new Date(scope.row.createdTime)).toLocaleString()}}</span>
                                       </template>
                                    </el-table-column>
                                </el-table>


                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>告警简介</span>
                    </div>
                    <el-button size="large" type="primary" @click="toUpdate(detailsData.id)">更新</el-button>
                    <el-button size="large" type="warning" v-if="detailsData.cleared===false" @click="toFade(detailsData.id)">隐藏</el-button>
                    <el-button size="large" type="success" v-if="detailsData.cleared===true" @click="toShow(detailsData.id)">显示</el-button>
                    <el-row>
                        <div class="flex maxw100 boderB" style="padding-top: 20px">
                            <div  v-if="detailsData.state==='UNHANDLED'" style="color: #d81e06;font-weight:bold;"><img src="@/static/dataCenter/images/fail.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">未处理</span></div>
                            <div  v-if="detailsData.state==='HANDLED'" style="color: #28b758;font-weight:bold;"><img src="@/static/dataCenter/images/succes.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">已处理</span></div>
                            <div  v-if="detailsData.state==='IN_PROGRESS'" style="color: #ff9901;font-weight:bold;"><img src="@/static/dataCenter/images/clock.png" style=" float: left;margin-right: 5px;margin-top: 3.2px;" alt=""><span style="float: left;">进行中</span></div>
                            <span class="help-block">状态</span>
                        </div>
                    </el-row>
                    <div class="flex maxw100 boderB">
                        <span>{{(new Date(detailsData.createdTime)).toLocaleString()}}</span>
                        <span class='help-block'>创建时间</span>
                    </div>

                </el-card>
            </el-col>




        </el-row>
         <!--更新模态框-->
        <el-dialog title="更新告警详情" :visible.sync="dialogFormVisible">
            <el-form >
                <el-form-item label="状态" label-width="50px">
                    <el-select v-model="updateForm.state">
                        <el-option label="进行中" value="IN_PROGRESS"></el-option>
                        <el-option label="未处理" value="UNHANDLED"></el-option>
                        <el-option label="已处理" value="HANDLED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" label-width="50px">
                    <el-input v-model="updateForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style>
    #timeToString .el-tabs__header{
        margin:0;
    }
    #timeToString  .el-table tr {
        cursor: pointer;
    }
    .boderB{
        padding: 10px;
        border-bottom: 1px #eee solid;
    }
    .flex{
        font-weight:500;
        -webkit-box-flex: 1;
        -webkit-flex: 1 1 100%;
        flex: 1 1 100%;
        box-sizing: border-box;
        max-width: 40%;
        max-height: 100%;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;
        flex-direction: column
    }
    .maxw100{
        max-width:100% !important;
    }
    .help-block{
        color: #868686;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-top: 10px;
        vertical-align: bottom;
        display: table-cell;
        min-height: 20px;

    }
    .btnGroup1{
        float:right;
        padding: 10px
    }
</style>

<script>
    import {jobs,fail,abandon,includeSteps,alerts,alertsDe,alertsPo} from '@/api/dataLake/api'
    import {timeToString} from '@/utils/timeToString'
    export default {
        name:'warning',
        data() {
            return {
                updateForm:{
                    clear:false,
                    state:'',
                    description:''
                },
                dialogFormVisible:false,
                showServiceData:[],
                chooseId:'',
                detailsData:{},
                details:false,
                loadding:false,
                activeName:'',
                query:'',
                currentPage:1,
                ServiceData:[],
                total:20,
                pageSize:10,
                postParam:{},
            }
        },
        filters:{
            filter1(val){
                return timeToString(parseInt((val)/1000))
            },
            filter2(val){
                let levelTrs={
                        'INFO':'信息',
                        'WARNING':'警告',
                        'MINOR':'次要',
                        'MAJOR':'主要',
                        'CRITICAL':'危险',
                        'FATAL':'致命'
                    };
                return levelTrs[val]
            },
        },
        watch: {
            query(){
                this.getTable()
            },
            activeName(val){
                this. pageSize=10
                this. currentPage=1
                this.getTable()
            }
        },
        methods: {
            updateSubmit(){
            this.postParam = Object.assign({id:this.detailsData.id},{data:this.updateForm})
                this.postWay()
                this.dialogFormVisible = false
            },
            postWay(){
                alertsPo(this.postParam).then(data=>{
                    alertsDe(this.chooseId).then(data=>{
                        this.detailsData = data
                    })
                })
            },
            toUpdate(id){
            this.dialogFormVisible = true
                this.updateForm.state = this.detailsData.state
            },
            toFade(id){
                this.postParam = {
                    id:id,
                    data:{
                        clear: true,
                        state: this.detailsData.state,
                    }
                }
                this.postWay();
            },
            toShow(id){
              this.postParam = {
                  id:id,
                  data:{
                      clear: false,
                      state: this.detailsData.state,
                      unclear: true,
                  }
              }
              this.postWay();

            },
            rowClick(row,event,column){
                this.details = true
                this.chooseId =  row.id
                alertsDe(this.chooseId).then(data=>{
                    this.detailsData = data
                })
            },
            getParams(){
                let params
                let type
                this.activeName==0?type='':type=this.activeName
                    params = {state:'UNHANDLED',level:type,filter:this.query,cleared:false}
                return params
            },
            getTable(){
                this.loadding = true
                console.log(this.getParams())
                alerts(this.getParams()).then(data=>{
                    if(data.alerts){
                        this.ServiceData = data.alerts
                        this.total = data.size
                        this.loadding = false
                        this.getShowData()
                    }
                    else{
                        this.ServiceData = []
                        this.total = 0
                        this.loadding = false
                        this.getShowData()
                    }

                })
            },
            getShowData(){
                this.showServiceData = this.ServiceData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getShowData()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val
                this.getShowData()
            }
        },
        mounted() {
            this.getTable()
        }
    }
</script>
