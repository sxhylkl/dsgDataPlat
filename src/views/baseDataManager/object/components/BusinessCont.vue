
<template>
  <div class="task-box">
    <el-row>
      <my-tree ref="tree" :params="treeParams" @nodeClick="treeNodeClick"></my-tree>
      <el-col :span="18">
        <el-card class="box-card" v-show="!isCreate">
          <div slot="header" class="clearfix">
            <span>业务列表</span>
            <span
              style="float:right;cursor:pointer"
              class="fa fa-refresh"
              title="最新数据"
              @click="getTopList()"
            ></span>
          </div>
          <div>
            <el-button
              type="primary"
              @click="createTask"
              v-show="!btnState && tree.data && tree.data.id"
            >创建业务</el-button>
            <el-table
              :data="task.list"
              border
              v-loading="loading.list"
              style="margin-top:10px"
              @expand-change="expandChange"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @cell-click="cellClick"
            >
              <el-table-column type="selection" width="55" v-if="btnState" :selectable="isdisable"></el-table-column>
              <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="description" label="描述" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="update_time" label="更新时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.update_time | formatLongTime}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="creat_time" label="创建时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.creat_time | formatLongTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="部门数" label-class-name="depart">
                <template slot-scope="scope">
                  <span>{{scope.row.depart.length}}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据源数" label-class-name="datasource">
                <template slot-scope="scope">
                  <span>{{scope.row.datasource.length}}</span>
                </template>
              </el-table-column>
              <el-table-column label="规则数" label-class-name="rule">
                <template slot-scope="scope">
                  <span>{{scope.row.rule.length}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" v-if="!btnState">
                <template slot-scope="scope">
                  <el-tooltip content="关联" placement="buttom">
                    <el-button
                      @click.stop="handleLink(scope.row)"
                      type="success"
                      size="small"
                      plain
                    >
                      <i class="fa fa-link"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="buttom">
                    <el-button @click="handleEdit(scope.row)" type="primary" size="small" plain>
                      <i class="fa fa-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="buttom">
                    <el-button @click="handleDel(scope.row)" type="danger" size="small" plain>
                      <i class="fa fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="box-card" v-show="isCreate">
          <div slot="header" class="clearfix">
            <span>{{task.form.id?'编辑':'创建'}}业务</span>
          </div>
          <div>
            <el-form
              :model="task.form"
              :rules="task.rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              @submit.native.prevent
            >
              <el-form-item label="名称" prop="name">
                <el-input v-model="task.form.name"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="task.form.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="isCreate=false">取消</el-button>
                <el-button @click="saveTask" type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getTop, getTaskList, addTask, updateTask, delTask, getRelationList } from '@/api/dataSource/busniess.js'
import myTree from '@/components/Tree/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    myTree
  },
  props: ['btnState', 'selectedData'],
  data () {
    // 这里存放数据
    return {
      treeParams: {
        type: 'BUSINESS',
        name: '业务'
      },
      activeName: 'first',
      tree: {
        data: null
      },
      isCreate: false,
      task: {
        list: [],
        info: [],
        link: [],
        form: {
          name: '',
          description: ''
        },
        curr: {},
        rules: {
          name: { required: true, message: '必填', trigger: 'blur' }
        }
      },
      loading: {
        detail: false,
        list: false,
        dialog: false
      },
      link: {
        list: [],
        selected: [],
        detail: [],
        types: ['数据源', '部门'],
        selectType: '数据源'
      },
      multipleSelection: [] // 多选框所选集合
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 过滤掉选中的数据
    isdisable (row) {
      for (const o of this.selectedData) {
        if (row.id === o.parent_id || row.id === o.to_id) {
          return false
        }
      }
      return true
    },
    // 选择框数组填充
    handleSelectionChange (val) {
      this.multipleSelection = val;
      console.log(val)
      this.$emit('postData', val)
    },
    treeNodeClick (data) {
      this.isCreate = false
      if (data === 1) return;
      this.tree.data = data;
      this.getList()
    },
    // 获取最近业务
    getTopList () {
      if (this.tree.data) {
        this.tree.data = null
      }
      this.$refs.tree.cancelCheck()
      this.loading.list = true
      getTop(10).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取最近主题目录失败')
          return;
        }
        this.task.list = res.data;
      })
    },
    getTaskList (id) {
      this.loading.list = true
      getTaskList(id).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取数据失败')
          return;
        }
        this.task.list = res.data
      })
    },
    // 创建业务
    createTask () {
      console.log(this.tree.data)
      if (!this.tree.data || !this.tree.data.id) {
        this.$message.warning('请选择主题目录')
        return
      }
      this.task.form = {
        name: '',
        description: ''
      }
      this.isCreate = true
    },
    // 编辑主题
    handleEdit (row) {
      this.task.form = row;
      this.isCreate = true
    },
    // 添加关联
    handleLink (row) {
      console.log(row)
      this.task.curr = row;
      this.$emit('addLink', { row })
      /*  this.dialog.linkConfig.selected = row
       this.$refs.linkDialog.dialog.visible = true */
      /*  this.$nextTick(() => {
         this.$refs.linkDataSource.$refs.dataSourceTable.clearSelection();
       }) */
    },
    // 保存关联
    saveLink () {
      console.log('刷新数据')
      this.dialog.saveLink = false
      this.getList()
    },
    // 选中的数据源
    handledataSourceChange (val) {
      this.link.selected = val
    },
    //
    // 删除主题
    handleDel (row) {
      if (row.depart.length > 0 || row.rule.length > 0 || row.datasource.length > 0) {
        this.$message.warning('该业务有关联信息,无法删除')
        return
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTask(row.id).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '删除失败')
            return
          }
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 单元格被点击
    cellClick (row, column) {
      if (!column.labelClassName) return;
      this.$emit('linkDetail', { row, column })
    },
    // 行点击事件
    expandChange (row, expandedRows) {
      console.log(row)
      this.task.curr = row;
      if (expandedRows.length === 0) return;
      this.getRelationList(row.id)
    },
    // 获取关联的流程
    getRelationList (id) {
      this.loading.detail = true
      getRelationList(id).then(res => {
        this.loading.detail = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取数据失败')
          return;
        }
        this.link.detail = res.data;
      })
    },
    // 获取列表
    getList () {
      console.log(this.tree.data)
      if (!this.tree.data || !this.tree.data.id) {
        this.getTopList()
      } else {
        this.getTaskList(this.tree.data.id)
      }
    },
    // 获取主题关联的表
    getFeedTableList () {
      getFeedTable().then(res => {
        if (res.code === 0) {
          this.link.list = res.data
        }
      })
    },
    // 保存业务
    saveTask () {
      if (this.task.form.id) { // 更新
        updateTask(this.task.form).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '保存失败')
            return
          }
          this.isCreate = false
          this.$message.success('保存成功')
          this.getList()
        })
      } else { // 保存
        const params = Object.assign({}, this.task.form);
        if (!this.tree.data || !this.tree.data.id) {
          this.isCreate = false
          this.getTopList()
          this.$message.warning('创建出错,请重新创建或刷新页面')
          return;
        }
        params.parent_id = this.tree.data.id
        addTask(params).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '保存失败')
            return
          }
          this.isCreate = false
          this.$message.success('保存成功')
          this.getList()
        })
      }
    },
    // 关联的表格变化
    handleSelectLinkChange (val) {
      console.log(val)
      this.link.selected = val
    },
    // 确认框
    openConfirm (msg, callback) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    const nodeId = this.$route.query.nodeId
    const type = this.$route.query.type
    console.log(nodeId)
    if (nodeId && type === 'BUSINESS') {
      this.getTaskList(nodeId)
    } else {
      this.getTopList()
    }
  }
}
</script>
