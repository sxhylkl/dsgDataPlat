<template>
  <section>
    <!--过滤栏-->
    <el-form>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="任务名" :label-width="formLabelWidth">
            <el-input v-model="query['name_^VLK']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务分组" :label-width="formLabelWidth">
            <el-input v-model="query['group_^VLK']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运行状态" :label-width="formLabelWidth">
            <el-select v-model="query['running_state_^VEQ']">
              <el-option label="禁用" value="DISABLE"></el-option>
              <el-option label="启用" value="ENABLE"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="padding-left: 65px;">
          <el-form-item>
            <el-button type="primary" size="mini" plain @click="search">
              <i class="fa fa-search" style="margin-right: 3px"></i>查询
            </el-button>
            <el-button type="warning" size="mini" plain @click="query={key:'',name:''}">
              <i class="fa fa-refresh" style="margin-right: 3px"></i>重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--工具栏-->
    <el-row style="margin-bottom: 10px">
      <el-button type="success" size="mini" plain title="新增" @click="New">
        <i class="fa fa-plus" style="margin-right: 3px"></i>新增
      </el-button>
    </el-row>
    <!--table-->
    <el-table :data="listJson" style="width: 100%" v-loading="loadding">
      <el-table-column prop="name" label="任务名称" sortable :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="任务分组" sortable :show-overflow-tooltip="true" prop="group"></el-table-column>
      <el-table-column label="执行目标" prop="invokeTarget" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="运行表达式" prop="cronExpression" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="方法参数" prop="methodParam" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="任务描述" prop="description" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="运行状态" prop="runningState" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="管理" width="250">
        <template slot-scope="scope">
          <el-button-group class="btnG">
            <el-button type="primary" size="mini" title="立即运行" plain @click="run(scope.row.id)">
              <i class="fa fa-play-circle-o"></i>
            </el-button>
            <el-button type="primary" size="mini" title="编辑" plain @click="empower(scope.row)">
              <i class="fa fa-edit"></i>
            </el-button>
            <el-button
              type="primary"
              size="mini"
              title="运行记录"
              plain
              @click="historyModel(scope.row.id)"
            >
              <i class="fa fa-history"></i>
            </el-button>
            <el-button
              type="primary"
              size="mini"
              title="删除"
              plain
              @click="removeFlow(scope.row.id)"
            >
              <i class="fa fa-trash"></i>
            </el-button>
            <el-button
              v-if="scope.row.runningState==='ENABLE'"
              type="primary"
              size="mini"
              title="禁用"
              plain
              @click="flobOrStart(scope.row.id,false)"
            >
              <i class="fa fa-pause"></i>
            </el-button>
            <el-button
              v-if="scope.row.runningState==='DISABLE'"
              type="primary"
              size="mini"
              title="启用"
              plain
              @click="flobOrStart(scope.row.id,true)"
            >
              <i class="fa fa-play-circle"></i>
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="block" style="float:right;margin-top: 12px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="新增计划" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="jobForm">
        <el-form-item label="任务分组" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-select v-model="form.group" placeholder="请选择流程分类">
            <el-option
              v-for="(one,index) in Nodes"
              :label="one.label"
              :value="one.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划名称" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="调用目标" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-input v-model="form.invokeTarget" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运行表达式" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-input v-model="form.cronExpression" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="方法参数" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-input v-model="form.methodParam" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否并发执行" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-radio :label="true" v-model="form.concurrent" name="是">是</el-radio>
          <el-radio :label="false" v-model="form.concurrent" name="否">否</el-radio>
        </el-form-item>
        <el-form-item label="运行状态" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-select v-model="form.runningState" auto-complete="off">
            <el-option label="禁用" value="DISABLE"></el-option>
            <el-option label="启用" value="ENABLE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务计划说明" :label-width="formLabelWidth" :rules="ruleR.re">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="edit2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="历史记录" :visible.sync="dialogFormVisible2">
      <el-table :data="historyData" style="width: 100%" v-loading="loadding2">
        <el-table-column label="执行状态" sortable :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.runState==='SUC'">成功</el-tag>
            <el-tag v-if="scope.row.runState!=='SUC'" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行耗时(ms)" sortable :show-overflow-tooltip="true" prop="runMs"></el-table-column>
        <el-table-column label="执行启动时间" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="执行结束时间" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              title="查看日志"
              plain
              v-if="scope.row.runState!=='SUC'"
              @click="getHistoryDetails(scope.row.id)"
            >
              <i class="fa fa-history"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <div style="float:right;margin-top: 12px;">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="错误日志详情" :visible.sync="dialogFormVisible3">
      <p>{{logDetails}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<style>
#table2 .el-table__row {
  cursor: pointer;
}
</style>
<script>
import { list, edit, logList, run, remove, enable, logDetails } from '../../../api/workflow/businessApproval/config/jobs'
export default {
  name: 'list',
  data () {
    return {
      logDetails: '',
      currentPage2: 1,
      total2: 0,
      pageSize2: 10,
      loadding2: false,
      historyData: [],
      allViewData: {},
      defaultProps: {
        parent: 'parentId',   // 父级唯一标识
        value: 'id',          // 唯一标识
        label: 'label',       // 标签显示
        children: 'children', // 子级
      },
      Visible: false,
      form: {
        methodParam: ''
      },
      ruleR: {
        re: [{ required: true, message: '该项不能为空' }],
      },
      query: {
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,

      Nodes: [],
      id: '',
      loadding: false,
      listJson: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      order: 'asc'

    }
  },
  watch: {
  },
  filters: {
  },
  methods: {
    getHistoryDetails (id) {
      logDetails(id).then(res => {
        this.logDetails = res.data.data.content
        this.dialogFormVisible3 = true
      })
    },
    flobOrStart (id, status) {
      let params = { id: id, status: status }
      enable(params).then(data => {
        if (data.isOk) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        }
        else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
        this.getTable()
      })
    },
    edit2 () {
      let self = this
      this.$refs['jobForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            edit(self.form).then(data => {
              if (data.code === "200") {
                self.$message({
                  type: 'success',
                  message: '创建定时计划成功'
                })
                self.getTable()
              }
              else {
                self.$message({
                  type: 'error',
                  message: data.msg
                })
              }


            })
            self.dialogFormVisible = false
          });
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    getTable2 () {
      let params = { id: this.chooseHisId, content: { order: this.order, offset: this.pageSize2 * (this.currentPage2 - 1), limit: this.pageSize2 } }
      logList(params).then(res => {
        let data = res.data
        this.total2 = data.total
        this.historyData = data.rows
      })
    },
    historyModel (id) {
      this.currentPage2 = 1
      this.total2 = 0
      this.pageSize2 = 10
      this.chooseHisId = id
      this.dialogFormVisible2 = true
      this.getTable2()

    },
    empower (row) {
      this.dialogFormVisible = true
      this.form = Object.assign({ methodParam: '' }, row)
    },
    search () {
      let params = Object.assign(this.query, { order: this.order, offset: this.pageSize * (this.currentPage - 1), limit: this.pageSize })
      this.loadding = true
      list(params).then(res => {
        let data = res.data
        this.total = data.total
        this.listJson = data.rows
      })
      this.loadding = false
    },
    removeFlow (id) {
      let that = this
      this.$confirm('是否删除该计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'      }).then(() => {
        let param = { id: id }
        remove(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          that.getTable();
        }).catch(err => {
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getTable();
    },
    handleSizeChange2 (val) {
      this.pageSize2 = val
      this.getTable();
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTable2();
    },
    handleCurrentChange2 (val) {
      this.currentPage2 = val
      this.getTable2();
    },
    transform (json) {
      for (let key in json) {
        json[key] = ''
      }
      return json
    },
    New () {
      let that = this
      this.dialogFormVisible = true
      this.form = this.transform(Object.assign({ methodParam: '' }, that.form))
    },
    getTable () {
      let params = { order: this.order, offset: this.pageSize * (this.currentPage - 1), limit: this.pageSize }
      this.loadding = true
      list(params).then(res => {
        let data = res.data
        this.total = data.total
        this.listJson = data.rows
        this.loadding = false
      })
      /*   let data={"page":1,"pageResult":{"endRow":2,"firstPage":true,"hasNextPage":false,"hasPrePage":false,"lastPage":true,"limit":10,"nextPage":1,"offset":0,"page":1,"prePage":1,"slider":[1],"startRow":1,"totalCount":2,"totalPages":1},"pageSize":10,"rows":[{"concurrent":false,"createTime":"2018-12-12 11:56:27","cronExpression":"0/30 * * * * ? *","deleteFlag":false,"description":"demo2","group":"key2","id":"404904211142934529","invokeTarget":"com.dstz.sys.scheduler.JobInvokeUtil.listJson()","name":"demo2","runningState":"ENABLE","updateTime":"2018-12-12 11:56:27"},{"concurrent":false,"createTime":"2018-12-11 17:21:32","cronExpression":"0 0/3 * * * ?","deleteFlag":false,"description":"demo","group":"key1","id":"404886675122814985","invokeTarget":"JobInvokeUtil.listJson()","name":"demo","runningState":"DISABLE","updateTime":"2018-12-11 17:21:32"}],"total":2}
         this.total = data.total
         this.listJson = data.rows*/

    },
    getNodes () {
      /*getNodes().then(data=>{
          this.Nodes = data
      })*/
      this.Nodes = [{ label: '分组一', value: 'key1' }, { label: '分组二', value: 'key2' }, { label: '分组三', value: 'key3' }]
    },
    run (id) {
      run({ id: id }).then(data => {
        if (data.isOk) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        }
        else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
        this.getTable()
      })
    },
  },
  mounted () {
    this.getTable()
    this.getNodes()
  }
}
</script>

<style scoped>
</style>
