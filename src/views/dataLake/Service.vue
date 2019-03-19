<template>
    <section>
        <el-row :gutter="20">
            <el-row>
                <el-col :span="18">
                    <el-form >
                        <el-form-item label="服务健康情况" label-width="200px">
                            <el-input placeholder="请输入名称进行查询" v-model="query"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>

            </el-row>

            <el-col :span="24">
                    <el-table
                        :data="ServiceData"
                        style="width: 100%"
                        v-loadding="loadding"
                        :default-sort = "{prop: 'date', order: 'descending'}"
                    >
                        <el-table-column
                            prop="serviceName"
                            label="名称"
                            sortable
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            sortable
                            width="180">
                            <template slot-scope="scope">
                                <div v-if="scope.row.healthyComponents[0].healthy" style="color: #28b758;font-weight:bold;"><img src="../../../static/dataCenter/images/smile.png" style=" float: left;margin-top: 3px;margin-right: 5px;" alt=""><div style="float: left;">健康</div></div>
                                <div v-if="!scope.row.healthyComponents[0].healthy" style="color: #d81e06;font-weight:bold;"><img src="../../../static/dataCenter/images/cry.png" style=" float: left;margin-top: 3px;margin-right: 5px;" alt=""><div style="float: left;">不健康</div></div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="组件"
                           >
                            <template slot-scope="scope">
                                <span>{{scope.row.components.length}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="告警">
                            <template slot-scope="scope">
                                <span v-if="scope.row.alerts">{{scope.row.alerts}}</span>
                                <span v-if="scope.row.alerts===null">0</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="上次检查日期"
                        >
                            <template slot-scope="scope">
                                <span>{{(new Date(scope.row.latestAlertTimestamp)).toLocaleString()}}</span>
                            </template>
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
    </section>
</template>


<style scoped>

</style>

<script>
    import {serviceMonitor} from '../../api/dataLake/api'
    export default {
        data() {
            return {
                loadding:false,
                query:'',
                currentPage:1,
                ServiceData:[],
                tableData1:[],
                ServiceAllData:[],
                total:20,
                pageSize:10,
            }
        },
        watch: {
            query(){
                this.serviceDataChange()
            }
        },
        methods: {
            getTable(){
                this.loadding = true
                serviceMonitor().then(res=>{
                  let data = res.entity
                    this.ServiceData = data
                    this.ServiceAllData = data
                    this.total = data.length
                    this.loadding = false
                })
            },
            serviceDataChange(){
                let ServiceAllData = [...this.ServiceAllData]
                let newArr = [] ;
                 ServiceAllData.forEach(one=>{
                    if(one.serviceName.indexOf(this.query)>-1){
                        newArr.push(one)
                    }
                })
                this.total = newArr.length
                this.ServiceData = newArr.slice((this.currentPage - 1) * this.pageSize, this.pageSize * this.currentPage)

            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.serviceDataChange()

            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val
                this.serviceDataChange()
            }
        },
        mounted() {
           this.getTable()
        }
    }
</script>
