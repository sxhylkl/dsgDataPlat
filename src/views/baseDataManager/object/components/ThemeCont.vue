
<template>
  <div class="subject-box">
    <el-row>
      <my-tree ref="tree" :params="treeParams" @nodeClick="treeNodeClick" :nodeId="nodeId"></my-tree>
      <el-col :span="18">
        <el-card class="box-card" v-show="!isCreate">
          <div slot="header" class="clearfix">
            <span>主题列表{{nodeId}}</span>
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
              @click="createSubject"
              v-show="!btnState&& tree.data && tree.data.id"
            >创建主题</el-button>
            <el-table
              :data="subject.list"
              v-loading="loading.list"
              border
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
              <el-table-column label="任务数" label-class-name="task">
                <template slot-scope="scope">
                  <span>{{scope.row.task.length}}</span>
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
            <span>{{subject.form.id?'编辑':'创建'}}主题</span>
          </div>
          <div>
            <el-form
              :model="subject.form"
              :rules="subject.rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              @submit.native.prevent
            >
              <el-form-item label="名称" prop="name">
                <el-input v-model="subject.form.name"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="subject.form.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="isCreate=false">取消</el-button>
                <el-button @click="saveSubject" type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 例如：import 《组件名称》 from '《组件路径》';
import { getSubjectTop, getFeedTable, getSubjecList, updateSubject, addSubject, delSubject, getRelationList } from '@/api/dataSource/subject.js'
import myTree from '@/components/Tree/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'mySubject',
  components: {
    myTree
  },
  props: ['nodeId', 'btnState', 'selectedData'],
  inject: ['reload'],
  data () {
    // 这里存放数据
    return {
      treeParams: {
        type: 'SUBJECT',
        name: '主题'
      },
      activeName: 'first',
      tree: {
        data: null
      },
      isCreate: false,
      subject: {
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
        list: false,
        detail: false,
        dialog: false
      },
      link: {
        list: [],
        selected: [],
        detail: []
      },
      multipleSelection: [] // 多选框所选集合
    };
  },
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
      this.$emit('postData', val)
    },
    treeNodeClick (data) {
      this.isCreate = false
      if (data === 1) return
      this.tree.data = data;
      this.getList()
    },
    // 获取最近主题
    getTopList () {
      if (this.tree.data) {
        this.tree.data = null
      }
      this.$refs.tree.cancelCheck()
      this.loading.list = true
      getSubjectTop(10).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取最近主题目录失败')
          return;
        }
        this.subject.list = res.data;
      })
    },
    // 创建主题
    createSubject () {
      console.log(this.tree.data)
      if (!this.tree.data || !this.tree.data.id) {
        this.$message.warning('请选择主题目录')
        return
      }
      this.subject.form = {
        name: '',
        description: ''
      }
      this.isCreate = true
    },
    // 编辑主题
    handleEdit (row) {
      this.subject.form = row;
      this.isCreate = true
    },
    // 主题关联
    handleLink (row) {
      this.subject.selected = []
      this.subject.curr = row;
      this.$emit('addLink', { row })
      /* this.$nextTick(() => {
        this.$refs.linkTable.clearSelection();
      }) */
    },
    // 保存关联
    saveLink () {
      this.getList()
    },
    // 删除主题
    handleDel (row) {
      if (row.depart.length > 0 || row.task.length > 0) {
        this.$message.warning('该主题有关联信息,无法删除')
        return;
      }
      this.openConfirm('此操作将永久删除改数据, 是否继续?', () => {
        delSubject(row.id).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    // 单元格被点击
    cellClick (row, column) {
      if (!column.labelClassName) return;
      this.$emit('linkDetail', { row, column })
    },
    // 行点击事件
    expandChange (row, expandedRows) {
      console.log(row)
      this.subject.curr = row;
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
      if (!this.tree.data || !this.tree.data.id) {
        this.getTopList()
      } else {
        this.getSubjecList(this.tree.data.id)
      }
    },
    // 获取主题列表
    getSubjecList (id) {
      this.loading.list = true
      getSubjecList(id).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取主题列表失败')
          return
        }
        this.subject.list = res.data;
      })
    },
    // 获取主题关联的表
    getFeedTableList () {
      getFeedTable().then(res => {
        if (res.code === 0) {
          this.link.list = res.data
        }
      })
    },
    // 保存主题
    saveSubject () {
      if (this.subject.form.id) { // 更新
        updateSubject(this.subject.form).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '保存失败')
            return
          }
          this.isCreate = false
          this.$message.success('保存成功')
          this.getList()
        })
      } else { // 保存
        if (!this.tree.data || !this.tree.data.id) {
          this.isCreate = false
          this.getTopList()
          this.$message.warning('创建出错,请重新创建或刷新页面')
          return;
        }
        const params = Object.assign({}, this.subject.form);
        params.parent_id = this.tree.data.id
        addSubject(params).then(res => {
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
    if (nodeId && type === 'SUBJECT') {
      this.getSubjecList(nodeId)
    } else {
      this.getTopList();
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
