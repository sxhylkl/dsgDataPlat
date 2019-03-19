<!--  -->
<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>数据采集平台</span>
      </div>
      <div style="margin-bottom:15px">
        <el-button type="primary" size="small" @click="addTopic">新增Topic</el-button>
      </div>
      <el-table :data="tData" border style="width: 100%" v-loading="tLoading">
        <!--  @cell-click="cellClick" -->
        <el-table-column prop="topicName" label="Topic名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="kafkaName" label="Kafka名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatLongTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | formatLongTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.isEdit">
              <el-input
                autosize
                autofocus
                v-model="editData.description"
                @keyup.enter.native.prevent="saveEdit(scope.row)"
                @keyup.esc.native.prevent.stop="cancelEdit(scope.row)"
              ></el-input>
            </span>
            <span v-else>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="运行状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag
              :type="Number(scope.row.state) ?'success':'info'"
            >{{Number(scope.row.state) ?'运行中':'停止'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <span v-if="scope.row.isEdit">
              <el-tooltip effect="dark" content="取消" placement="bottom">
                <el-button size="mini" type="info" plain @click.stop="cancelEdit(scope.row)">
                  <i class="fa fa-close" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="保存" placement="bottom">
                <el-button size="mini" type="primary" plain @click.stop="saveEdit(scope.row)">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span v-else>
              <el-tooltip effect="dark" content="编辑" placement="bottom">
                <el-button size="mini" type="primary" plain @click.stop="handleEdit(scope.row)">
                  <i class="fa fa-edit" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                :content="Number(scope.row.state) ? '停止':'启动'"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click.stop="handleOperation(scope.row)"
                >
                  <i v-show="!Number(scope.row.state)" class="fa fa-play" aria-hidden="true"></i>
                  <i v-show="Number(scope.row.state)" class="fa fa-pause" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="详情" placement="bottom">
                <el-button size="mini" type="success" plain @click.stop="handleDetail(scope.row)">
                  <i class="fa fa-list-alt" aria-hidden="true"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="bottom">
                <el-button size="mini" type="danger" plain @click.stop="handleDel(scope.row)">
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="page.total >0 ">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page.page"
          :page-sizes="page.sizes"
          :page-size="page.size"
          layout="sizes, prev, pager, next"
          :total="page.total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 新增topic -->
    <el-dialog title="新增Topic" :visible.sync="dialogVisible" width="45%">
      <el-form :model="addData" label-width="120px" ref="topicForm">
        <el-form-item label="Kafka连接名称">
          <el-select
            v-model="addData.kafka"
            placeholder="请选择"
            @change="kafkaChange"
            style="width:90%"
            value-key="id"
          >
            <el-option v-for="item in kafkaList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc" style="width:92%">
          <el-input type="textarea" v-model="addData.desc"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-transfer
          style="text-align: left"
          :titles="['备选topic', '已选topic']"
          v-model="addData.selectedTopic"
          :data="topicList"
        ></el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddBefor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入文件
import { handleParams } from '@/utils/workflow/common'
import { getObjList, getKafkaList, getTopicList, addObj, updateObj, delObj, startObj, stopObj } from '@/api/dataExchange/index.js'
export default {
  components: {},
  data () {
    return {
      // 基础数据
      tLoading: false,
      tData: [],
      // 编辑
      editData: {
        description: ''
      },
      // 页码
      page: {
        page: 1,
        total: 0,
        size: 10,
        sizes: [10, 20, 30]
      },
      // 新增
      dialogVisible: false,
      topicList: [],
      kafkaList: [],
      defaultProp: {
        key: 'id',
        label: 'name'
      },
      addData: {
        kName: '',
        kafka: null,
        desc: '',
        selectedTopic: []
      }
      /* rules: {
        kName: [
          { required: true, message: '不能为空', trigger: 'change' },
        ]
      } */
    }
  },
  computed: {
  },
  watch: {},
  methods: {
    // 获取table列表
    getList () {
      this.tLoading = true
      getObjList({ page: this.page.page - 1, size: this.page.size }).then(res => {
        this.tLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取列表数据失败')
          return;
        }
        this.page.total = res.data.totalPage
        this.tData = this.readTableData(res.data.content)
      }).catch(() => {
        this.tLoading = false
        this.$message.error('获取列表数据失败')
      })
    },
    // 获取topicList
    getTopicList (val) {
      const query = { kafkaBroker: val.uri, kafkaName: val.name }
      getTopicList(query).then(res => {
        if (res.code === 0) {
          this.setTopicData(res.data)
        }
      })
    },
    // 处理topiclist
    setTopicData (data) {
      const result = []
      for (const [index, val] of data.entries()) {
        result.push({ key: val })
      }
      this.topicList = result
    },
    // 获取kafka列表
    getKafkaList () {
      const id = 'bee12232fa3044889fb03b3d8b874810'
      getKafkaList(id).then(res => {
        if (res.code === 0) {
          this.kafkaList = res.data
        }
      })
    },
    // 读取表格数据
    readTableData (data) {
      // 根据实际情况，自己改下啊
      data.map(item => {
        item.isEdit = false; // 给后台返回数据添加`isSet`标识
        return item;
      });
      return data
    },

    // 操作(启动/停止)
    handleOperation (row) {
      if (Number(row.state)) {
        this.stop(row)
      } else {
        this.start(row)
      }
    },
    // 新增
    addTopic () {
      // 初始化数据
      this.addData.kafka = null
      this.topicList = []
      this.addData.selectedTopic = []
      this.dialogVisible = true;
    },
    // 启动
    start (row) {
      const obj = handleParams({
        topicUUID: row.id,
        kafkaid: row.kafkaId
        /*   brokerList: row.brokerList,
          groupId: row.groupId */
      })
      startObj(obj).then(res => {
        if (res.code !== 0 || res.data !== 1) {
          this.$message.error(res.msg ? res.msg : '启动失败')
          return;
        }
        this.$message.success('启动成功')
        this.getList()
      })
    },
    // 暂停
    stop (row) {
      const obj = handleParams({ topicUUID: row.id })
      stopObj(obj).then(res => {
        if (res.code !== 0 || res.data !== 0) {
          this.$message.error(res.msg ? res.msg : '停止失败')
          return;
        }
        this.$message.success('停止成功')
        this.getList()
      })
    },
    // 详情
    handleDetail (row) {
      this.$router.push({
        name: 'dataCollectionDetail',
        query: {
          id: row.id
        }
      })
    },
    // 删除
    handleDel (row) {
      this.confirm(() => {
        this.tLoading = true
        delObj(row.id).then(res => {
          this.tLoading = false
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '删除失败')
            return;
          }
          this.$message.success('删除成功')
          this.getList()
        }).catch(() => {
          this.tLoading = false
          this.$message.error('删除失败')
        })
      })
    },
    // 编辑的保存
    saveEdit () {
      const obj = [this.editData]
      updateObj(obj).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '保存失败')
          return;
        }
        this.$message.success('保存成功')
        this.getList()
      })
    },
    // 新增的保存之前
    saveAddBefor () {
      this.$refs.topicForm.validate(valid => {
        if (valid) {
          if (this.addData.selectedTopic.length === 0) {
            this.$message.warning('请选择topic')
            return;
          }
          const data = this.setAddData()
          this.saveAdd(data)
        } else {
          return false;
        }
      })
    },
    // 处理新增的数据
    setAddData () {
      const result = []
      console.log(this.addData.selectedTopic)
      for (const val of this.addData.selectedTopic) {
        const obj = {
          kafkaId: this.addData.kafka.id,
          kafkaName: this.addData.kafka.name,
          topicName: val,
          type: 'DATA',
          description: this.addData.desc
        }
        result.push(obj)
      }
      console.log(result)
      return result
    },
    // 新增的保存
    saveAdd (data) {
      this.tLoading = true
      addObj(data).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '保存失败')
          return;
        }
        this.$message.success('保存成功')
        this.dialogVisible = false;
        this.getList()
      })
    },
    // 编辑的取消
    cancelEdit (row) {
      row.isEdit = false;
      this.editData = { description: '' }
      this.$message.info('取消编辑')
    },
    // 编辑
    handleEdit (row) {
      if (!this.isEditSave(row)) {
        this.$message.warning('请先保存当前编辑项');
        return;
      }
      this.editData = Object.assign({}, row)
      row.isEdit = true
      console.log(row)
    },
    /* // 单元格点击
    cellClick (row, column) {
      if (!this.isEditSave(row)) {
        this.$message.warning('请先保存当前编辑项');
        return;
      }
      this.editData = Object.assign({}, row)
      row.isEdit = true
      console.log(row)
    }, */
    // kafka的值变化时
    kafkaChange (val) {
      // this.addData.kafak = val
      console.log(this.addData)
      this.addData.selectedTopic = []
      this.getTopicList(val)
    },
    // 条数变化
    handleSizeChange (val) {
      this.page.size = val
      this.getList()
    },
    // 翻页
    handleCurrentChange (val) {
      this.page.page = val
      this.getList()
    },
    // 判断编辑是否被保存
    isEditSave (row) {
      for (const item of this.tData) {
        if (item.isEdit && item.id !== row.id) {
          return false;
        }
      }
      return true
    },
    // 确认框
    confirm (callback) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created () {
    this.getList()
    this.getKafkaList()
  },
  mounted () {
    // this.readTableData()
  }
}
</script>
<style>
.el-transfer-panel {
  width: 40%;
}
</style>
