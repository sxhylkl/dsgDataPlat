<template>
  <div class="lunarFullCalendar">
    <div class="full-calendar">
      <lunar-full-calendar :event-sources="eventSources"
                           ref="calendar"
                           @event-selected="eventSelected"
                           :config="config"
                           @day-click="dayClick">

      </lunar-full-calendar>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <div class="btn-list dialog-btn">
        <el-button v-show="lookState" type="primary" @click="handleEdit"><i class="fa fa-edit"></i>编辑
        </el-button>
        <el-button v-show="editState" @click="handleEditQuit" type="primary"><i class="fa fa-times-circle"></i>取消编辑
        </el-button>
        <el-button v-show="lookState" type="primary" @click="handleComplete" :disabled="form.rateProgress>=100">
          <i
            class="fa  fa-check-square-o"></i>完成
        </el-button>
        <el-button v-show="completeState" type="primary" @click="handleCompleteQuit"><i
          class="fa  fa-times-circle"></i>取消完成
        </el-button>
        <el-button v-show="lookState||editState" type="primary" @click="handleDel"><i class="fa fa-trash"></i>删除
        </el-button>
      </div>
      <el-form :model="form" label-width="100px" ref="form" :rules="rules" v-if="!lookState">
        <el-form-item label="标题" prop="title">
          <el-input class="self-input" v-model="form.title" :disabled="completeState"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型" :disabled="completeState">
            <el-option label="个人待办" value="single"></el-option>
            <el-option label="共同完成任务待办" value="share"></el-option>
            <el-option label="每个人均需要完成的待办任务" value="ilka"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type!=='single'" label="参与者" v-show="!completeState">
          <el-input
            class="self-input"
            placeholder="请选择参与者"
            v-model="form.participantNames">
          </el-input>
          <el-tooltip class="item" effect="dark" content="查询用户" placement="right-end">
            <el-button type="primary" icon="el-icon-search"
                       @click="queryUser"></el-button>
          </el-tooltip>

        </el-form-item>
        <el-form-item label="开始日期" v-show="!completeState" prop="startTime" :disabled="!completeState">
          <el-date-picker
            class="self-input"
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="!completeState" label="结束日期" prop="endTime" :disabled="!completeState">
          <el-date-picker
            class="self-input"
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="editState" label="实际开始日期" prop="actualStartTime">
          <el-date-picker
            class="self-input"
            v-model="form.actualStartTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="editState||completeState" label="完成时间" prop="completeTime">
          <el-date-picker
            class="self-input"
            v-model="form.completeTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="timestamp"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="锁定" v-show="editState&&!completeState">
          <el-switch
            v-model="form.isLock"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item v-show="editState||completeState" label="进度" prop="endTime">
          <div class="block">
            <el-slider v-model="form.rateProgress"></el-slider>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="detail" v-if="lookState">
        <el-row>
          <el-col :span="14"><span>标题:</span>{{ form.title }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span>任务类型:</span>{{ form.type }}</el-col>
          <el-col :span="12"><span>提交人:</span>{{ form.createBy }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span>所属人:</span>{{ form.ownerName}}</el-col>
          <el-col :span="12"><span>预计开始时间:</span>{{ form.startTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span>预计完成时间:</span>{{ form.endTime }}</el-col>
          <el-col :span="12"><span>进度</span>{{ form.rateProgress}}</el-col>
        </el-row>
        <el-row v-show="this.form.type!=='single'">
          <el-col :span="24"><span>日程参与者:</span>{{ form.participantNames}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24"><span>备注:</span>{{ form.remark}}</el-col>
        </el-row>
        <el-row v-show="this.form.type!=='single'">
          <h4>日程参与者详细信息</h4>
          <el-table :data="this.form.scheduleParticipantList">
            <el-table-column property="participantorName" label="参与者姓名" width="150"></el-table-column>
            <el-table-column property="rateProgress" label="完成比例" width="150"></el-table-column>
            <el-table-column property="address" label="提交注解"></el-table-column>
            <el-table-column property="actualStartTime" label="实际开始时间"></el-table-column>
            <el-table-column property="actualEndTime" label="实际完成时间"></el-table-column>
          </el-table>
        </el-row>
      </div>
      <el-dialog
        width="50%"
        title="用户查询"
        :visible.sync="dialogTableVisible"
        append-to-body>
        <div class="table">
          <div class="container">
            <div class="handle-box">
              <el-input v-model="keyWords" :loading="listLoading" placeholder="姓名"
                        class="handle-input mr10"></el-input>
              <el-button type="primary" icon="search" @click="search"><i class="fa fa-search"></i>搜索</el-button>
            </div>
            <el-table :data="userList" ref="multipleTable" tooltip-effect="dark" style="width: 100%"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="姓名" width="120">
                <template slot-scope="scope">{{ scope.row.fullname_ }}</template>
              </el-table-column>
              <el-table-column prop="account_" label="账号"></el-table-column>
              <el-table-column prop="mobile_" label="手机号" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination" v-if="page.total">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="query.limit"
                layout="total, sizes, prev, pager, next"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSelectUser">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-show="!lookState" type="primary" @click="handleAgenda">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  /* eslint-disable */
  import { handleParams } from '@/utils/workflow/common.js'
  import { LunarFullCalendar } from 'vue-lunar-full-calendar'
  import {
    completeTask,
    delAgenda,
    editAgenda,
    getEventInfo,
    getEvents,
    getParticipantEvents,
    getUserList,
    handleAgenda,
  } from '@/api/workflow/personOffice/event/agenda.js'

  export default {
    inject: ['reload'],
    name: 'agenda',
    data () {
      let self = this
      let validateTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('日期时间不能为空'))
        } else {
          if (this.form.endTime - this.form.startTime < 0) {
            callback(new Error('结束日期不能小于开始日期'))
          }
          callback()
        }
      }
      return {
        title: '添加日程',
        dialogFormVisible: false,
        dialogTableVisible: false,
        multipleSelection: [],//临时选中的用户
        listLoading: false,
        userList: null,
        lookState: false, //观看模式
        editState: false, //编辑模式
        completeState: false,//完成模式
        keyWords: '',
        page: {
          total: 0,
          page: 2,
          currPage: 1,
          pageSize: 10,
        },
        query: {
          limit: 10,
          offset: 0,
          order: 'asc',
        },
        form: {
          title: undefined,
          type: 'single',
          startTime: undefined,
          endTime: '2018-12-31 18:00:00',
          remark: undefined,
          ownerName: undefined,
          participantNames: undefined,
          actualStartTime: undefined,
          completeTime: undefined,
          rateProgress: 0,
          isLock: false,
        },
        rules: {
          title: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
          startTime: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
          endTime: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: validateTime, trigger: 'blur'},
          ],
        },
        eventSources: [
          {
            events (start, end, timezone, callback) {
              const obj = {start: Date.parse(start._d), end: Date.parse(end._d)}
              getEvents(obj).then(data => {
                let i = 0
                let events = []
                console.log(data)
                while (data && data[i] != null) {
                  events.push({
                    isMine: true,
                    title: data[i].title + '(' + (data[i].rateProgress == null ? 0 : data[i].rateProgress) + '%)',
                    start: new Date(data[i].startTime), // will be parsed
                    end: new Date(data[i].endTime),
                    actualStart: data[i].actualStartTime ? new Date(data[i].actualStartTime) : '',
                    actualEnd: data[i].completeTime ? new Date(data[i].completeTime) : '',
                    id: data[i].id,
                    className: 'height:200',
                    rateProgress: data[i].rateProgress,
                    owner: ((data[i].ownerName == null || data[i].ownerName == '') ? data[i].owner : data[i].ownerName),
                    color: data[i].rateProgress >= 100 ? '#9AFF9A' : ((new Date()).getTime() > data[i].endTime
                      ? '#FF6A6A'
                      : '#63B8FF'),
                    committer: (data[i].submitNamer != null ? data[i].submitNamer : data[i].submitter),
                    taskUrl: data[i].taskUrl,
                    openType: data[i].openType,
                    type: data[i].type,
                    remark: data[i].remark,
                  })
                  i++
                  getParticipantEvents(obj).then(data => {
                    i = 0
                    while (data && data[i] != null) {
                      events.push({
                        isMine: false,
                        title: data[i].title + '(' + (data[i].rate_progress == null ? 0 : data[i].rate_progress) + '%)',
                        start: new Date(data[i].start_time), // will be parsed
                        end: new Date(data[i].end_time),
                        actualStart: data[i].actual_start_time ? new Date(data[i].actual_start_time) : '',
                        actualEnd: data[i].complete_time ? new Date(data[i].complete_time) : '',
                        id: data[i].id_,
                        mainId: data[i].schedule_id,
                        className: 'height:200',
                        rateProgress: data[i].rate_progress,
                        owner: (data[i].owner_name != null ? data[i].owner_name : data[i].owner),
                        color: data[i].rate_progress >= 100 ? '#9AFF9A' : ((new Date()).getTime() > data[i].end_time
                          ? '#FF6A6A'
                          : '#FFEC8B'),
                        committer: (data[i].submitNamer != null ? data[i].submitNamer : data[i].submitter),
                        taskUrl: data[i].task_url,
                        openType: data[i].open_type,
                        type: data[i].type,
                        remark: data[i].remark,
                      })
                      i++
                    }
                  })
                }
                callback(events)
              })
            },
          },
        ],
        config: {
          //lunarCalendar
          //Control whether the Chinese calendar shows true, unrealistic flase, default true.（lunarCalendar控制是否显示中国农历、显示的为true，隐藏为flase，默认为true）
          lunarCalendar: true,
          locale: 'zh-cn',
          header: {
            left: 'prev,next, today',
            center: 'title',
            right: 'hide, custom, month,agendaWeek,agendaDay',
          },
          buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日',
          },
          // eventOrder:'index',   // 这个是控制事件排序的功能，意思是 按照字段 事件数据中index来排序
          firstDay: 0, // 控制周一周日那个在前面
          defaultView: 'month',
          //agenda视图下是否显示all-day
          allDaySlot: true,
          //agenda视图下all-day的显示文本
          allDayText: '全天',
          eventLimitText: '更多',
          height: window.innerHeight - 230,
          eventLimit: true, //一天中显示多少条事件，多了隐藏
          // eventLimitClick: 'day', //点击今天日列表图
          timezone: 'local',  // 时区默认本地的
          slotLabelFormat: 'HH:mm',  // 周视图和日视同的左侧时间显示
          viewRender (view, element) {
            self.viewRender(view, element)
          },
        },
      }
    },
    created(){
      console.log()
    },
    components: {
      LunarFullCalendar,
    },
    methods: {
      // 注释的是功能是可以修改对应的功能值属性，比如设置  eventLimit为 false
      //  this.$refs.calendar.fireMethod('option',{
      //      eventLimit :false
      //  })
      dayClick (date, jsEvent, view) {   // 点击当天的事件
        this.$confirm('是否创建一个新日程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.initForm()
          this.lookState = false
          this.editState = false
          this.form.startTime = date._d
          this.form.endTime = (date._d).getTime() + 10 * 60 * 60 * 1000
          console.log(this.form)
          this.dialogFormVisible = true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消创建',
          })
        })
      },
      eventSelected (event, jsEvent, view) {  // 选中事件
        this.getEventsData(event.id)

      },
      viewRender (view, element) { //其它按钮的点击
        console.log('3')
      },
      /*setHeight () {
       let calendarBox = document.getElementsByClassName('fc-day-grid-container')[0]
       calendarBox.style.height = 500 + 'px'
       },*/
      handleAgenda () { //日程的添加、编辑、完成
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.completeState) {
              completeTask(this.form).then(res => {
                if (res.code !== '200') {
                  this.hitMsg(res.msg, 'error')
                  return false
                }
                this.dialogFormVisible = false
                this.reload()
                this.hitMsg(res.msg, 'success')
              })
              return false
            }
            let obj = this.form
            if (!this.editState) {
              obj = {
                title: this.form.title,
                type: this.form.type,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                remark: this.form.remark,
              }
              if (this.form.type !== 'single') {
                obj.participantNames = this.form.participantNames
              }
            }
            handleAgenda(obj).then(res => {
              if (res.code !== '200') {
                this.hitMsg(res.msg, 'error')
                return false
              }
              this.dialogFormVisible = false
              this.reload()
              this.hitMsg(res.msg, 'success')
            })
          }
        })
      },
      handleEdit () {
        this.title = '编辑日程'
        this.lookState = false
        this.editState = true
        this.completeState = false
      },
      handleEditQuit () {
        this.title = '查看详情'
        this.lookState = true
        this.editState = false
        this.completeState = false
      },
      handleDel () {
        this.$confirm('此操作将永久删除该日程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          delAgenda({id: this.form.id}).then(res => {
            if (res.code !== '200') {
              this.hitMsg(res.mdg, 'error')
              return false
            }
            this.dialogFormVisible = false
            this.reload()
            this.hitMsg(res.msg, 'success')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      },
      handleCompleteQuit () {
        this.title = '查看详情'
        this.lookState = true
        this.editState = false
        this.completeState = false
      },
      handleComplete () { //完成日程
        this.title = '完成日程'
        this.lookState = false
        this.editState = false
        this.completeState = true
      },
      queryUser () { //查询用户
        this.dialogTableVisible = true
        this.listLoading = true
        this.getUserList(this.query)

      },
      getUserList (obj) { //获取用户列表
        this.listLoading = true
        let params = handleParams(obj)
        getUserList(params).then(res => {
          if (res.code !== '200') {
            this.hitMsg(res.msg, 'error')
            return false
          }
          this.userList = res.rows
          this.page.total = res.total
          this.page.page = res.page
          this.page.pageSize = res.pageSize
          this.listLoading = false
          this.toggleSelection()
        })
      },
      search () { //用户搜索
        const obj = {
          limit: this.query.limit,
          offset: this.query.offset,
          order: this.query.order,
          'fullname_^VLK': this.keyWords,
        }
        this.getUserList(obj)
      },
      handleSelectionChange (val) { //用户选择
        this.multipleSelection = val
      },
      handleSelectUser () { //确定选择用户
        let user = []
        this.multipleSelection.forEach((row, index) => {
          user.push(row.fullname_)
        })
        this.form.participantNames = user.join(',')
        this.dialogTableVisible = false
      },
      toggleSelection () { //恢复选中的用户
        this.$nextTick(function () {
          if (this.form.participantNames) {
            let user = this.form.participantNames.split(',')
            user.forEach(name => {
              this.userList.forEach((row, index) => {
                if (row.fullname_ === name) {
                  this.$refs.multipleTable.toggleRowSelection(this.userList[index])
                }
              })

            })
          }

        })
      },
      initForm () {
        this.form = {
          title: undefined,
          type: 'single',
          startTime: undefined,
          endTime: undefined,
          remark: undefined,
          participantNames: undefined,
          actualStartTime: undefined,
          completeTime: undefined,
          rateProgress: 0,
          isLock: false,
        }
      },
      cancel () {
        this.dialogFormVisible = false
        this.dialogTableVisible = false
        this.lookState = false
        this.editState = false
        this.constructor = false
      },
      hitMsg (msg, type) { //错误提示
        this.$message({
          message: msg,
          type: type,
        })
      },
      getEventsData (id) {
        getEventInfo({id: id}).then(res => {
          if (res.code !== '200') {
            this.hitMsg(res.msg, 'error')
            return false
          }
          this.form = {
            actualStartTime: new Date(res.data.actualStartTime),
            createBy: res.data.createBy,
            createTime: new Date(res.data.actualStartTime),
            endTime: new Date(res.data.endTime),
            id: res.data.id,
            owner: res.data.owner,
            ownerName: res.data.ownerName,
            participantNames: res.data.participantNames,
            rateProgress: res.data.rateProgress,
            remark: res.data.remark,
            scheduleParticipantList: res.data.scheduleParticipantList,
            startTime: new Date(res.data.startTime),
            title: res.data.title,
            type: res.data.type,
            updateBy: res.data.updateBy,
            updateTime: new Date(res.data.updateTime),
          }
          // this.form = res.data
          this.title = '查看详情'
          this.lookState = true
          this.editState = false
          this.completeState = false
          this.dialogFormVisible = true
          console.log(this.form)
        })
      },
      handleSizeChange (val) {
        this.query.limit = val
        this.getUserList(this.query)
      },
      handleCurrentChange (val) {
        this.query.offset = this.query.limit * (val - 1)
        this.page.currPage = val
        this.getUserList(this.query)
      },
    },
  }
</script>
<style scoped lang="scss">
  $color: #00a4ff;
  .fc-day-grid-container {
    height: 500px;
  }

  .lunarFullCalendar {
    min-width: 900px;;
    height: 100%;
    background: #fff;
    .top {
      height: 100px;
      h2 {
        text-align: center;
        font-size: 15px;
      }
      div {
        font-size: 13px;
      }
    }
    .full-calendar {
      padding: 20px;
      height: calc(100% - 30px);
      /deep/ {
        .fc-unthemed th, .fc-unthemed td, .fc-unthemed thead, .fc-unthemed tbody, .fc-unthemed .fc-divider, .fc-unthemed .fc-row, .fc-unthemed .fc-content, .fc-unthemed .fc-popover, .fc-unthemed .fc-list-view, .fc-unthemed .fc-list-heading td {
          border-color: #eaecf1;
        }
        .fc-header-toolbar {
          height: 28px;
          margin-bottom: 0;
          line-height: 28px;
          h2 {
            font-size: 24px;
            color: #424656;
            letter-spacing: 0;
          }
        }
        .fc-button {
          height: 28px;
          background: #fff;
          border-color: #fff;
          box-shadow: none;
          padding: 0;
        }
        .fc-show-button,
        .fc-hide-button {
          position: relative;
          width: 80px;
          border: 1px solid #bbbfcd;
          border-radius: 20px;
          font-size: 14px;
          color: #424656;
        }
        .fc-today-button {
          font-size: 14px;
          color: $color;
        }
        .fc-next-button,
        .fc-prev-button {
          color: #7d8292;
        }
        .fc-button-group {
          margin-left: 20px;
          font-size: 14px;
          button {
            width: 80px;
            color: #424656;
            border: 1px solid #bbbfcd;
            &:first-child {
              border-top-left-radius: 20px;
              border-bottom-left-radius: 20px;
            }
            &:last-child {
              border-top-right-radius: 20px;
              border-bottom-right-radius: 20px;
            }
          }
          .fc-state-active {
            background: $color;
            color: #fff;
            text-shadow: none;
          }
        }

        .fc-month-view,
        .fc-agendaDay-view,
        .fc-agendaWeek-view {
          .fc-widget-content {
            .fc-sun,
            .fc-sat {
              background: rgba(245, 246, 248, 0.5);
            }
            .fc-day-number {
              font-size: 14px;
              letter-spacing: 0;
              line-height: 13px;
              float: left;
            }
            .fc-day-top {
              padding: 15px 12px 0 12px;
            }
            .fc-day-cnTerm,
            .fc-day-cnDate {
              font-size: 12px;
              color: #7d8292;
              float: right;
            }
            .fc-more {
              font-size: 12px;
              color: #7d8292;
            }
            .fc-event {
              cursor: pointer;
              font-size: 12px;
              /* color: #424656;
               background-color: rgba($color: $color, $alpha: 0.1) !important;
               border: 1px solid rgba($color: $color, $alpha: 0.1) !important;
               border-left: 2px solid rgba($color: $color, $alpha: 0.1) !important;
               border-radius: 0;*/
            }
            .fc-day-grid-event {
              padding: 1px 0 1px 5px;
            }
          }
        }
        .fc-agendaDay-view,
        .fc-agendaWeek-view {
          .fc-axis {
            font-size: 14px;
          }
          .fc-title {
            font-size: 14px;
            color: $color;
          }
        }
        .fc-month-view {
          .fc-event {
            &.fc-not-start {
              border-left: 1px solid rgba($color: $color, $alpha: 0.1) !important;
            }
          }
        }
        .fc-agendaDay-view {
          .fc-head {
            table {
              margin: 15px 0;
            }
            .fc-day-header {
              display: none;
            }
          }
        }
        .fc-head {
          .fc-day-header,
          .fc-widget-header,
          .fc-head-container {
            border-top-color: #fff;
            border-left-color: #fff;
            border-right-color: #fff;
          }
          table {
            margin: 50px 0 15px 0;
            font-size: 14px;
            color: #424656;
          }
        }
      }
    }
  }

  .tip {
    color: $color;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
  }

  .box-card {
    position: fixed;
    min-width: 300px;
    max-width: 500px;
    z-index: 10000;
  }

  .detail {
    margin-top: 20px;
    line-height: 35px;
    .el-row {
      border-bottom: 1px solid #eee;
    }
    span {
      font-weight: bolder;
      margin-right: 10px;
    }
  }
</style>
