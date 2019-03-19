<template>
  <div class="app-container calendar-list-container">
    <el-row :gutter="20">
      <my-tree ref="tree" :params="tree.params" @nodeClick="treeNodeClick" :btnState="btnState"></my-tree>
      <el-col :span="18" style="height:100%">
        <div class="grid-content bg-purple-light">
          <el-card v-show="!form.visible" class="box-card" style="height:100%">
            <div slot="header" class="clearfix">
              <span>部门列表</span>
              <span
                style="float:right;cursor:pointer"
                class="fa fa-refresh"
                title="最新数据"
                @click="getTopClick"
              ></span>
            </div>
            <el-row>
              <el-col :span="12" style="height:20px">
                <el-button
                  type="primary"
                  @click="handleAdd"
                  v-show="!btnState && tree.data && tree.data.id"
                >创建部门</el-button>
              </el-col>
              <el-col :span="10" :offset="2" style="text-align: right">
                <el-input
                  v-model="keyWords"
                  placeholder="名称"
                  class="handle-input mr10"
                  suffix-icon="el-icon-search"
                ></el-input>
              </el-col>
            </el-row>
            <el-table
              ref="multipleTable"
              :data="depart.list"
              v-loading="loading.list"
              border
              highlight-current-row
              style="width: 100%;margin-top:15px;"
              @selection-change="handleSelectionChange"
              @cell-click="cellClick"
            >
              <el-table-column type="selection" width="55" v-if="btnState" :selectable="isdisable"></el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                align="center"
                width="120"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="描述"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="creat_time"
                label="创建时间"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{scope.row.creat_time | formatLongTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="update_time"
                label="更新时间"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{scope.row.update_time | formatLongTime}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="主题数" label-class-name="subject">
                <template slot-scope="scope">
                  <span>{{scope.row.subject.length}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="业务数" label-class-name="business">
                <template slot-scope="scope">
                  <span>{{scope.row.business.length}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="标准数" label-class-name="standard">
                <template slot-scope="scope">
                  <span>{{scope.row.standard.length}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="规则数" label-class-name="rule">
                <template slot-scope="scope">
                  <span>{{scope.row.rule.length}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="模型数" label-class-name="model">
                <template slot-scope="scope">
                  <span>{{scope.row.model.length}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250" v-if="!btnState">
                <template slot-scope="scope">
                  <el-tooltip content="关联" placement="buttom">
                    <el-button @click.stop="handleLink(scope.row)" type="success" size="mini" plain>
                      <i class="fa fa-link"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="buttom">
                    <el-button @click.stop="handleEdit(scope.row)" type="primary" size="mini" plain>
                      <i class="fa fa-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="buttom">
                    <el-button @click.stop="handleDel(scope.row)" type="danger" size="mini" plain>
                      <i class="fa fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card v-show="form.visible" class="box-card" style="height:100%">
            <div slot="header" class="clearfix">
              <span>{{form.title}}</span>
            </div>
            <el-form
              ref="form"
              :model="form.data"
              :rules="depart.rules"
              label-width="100px"
              class="demo-ruleForm"
              @submit.native.prevent
            >
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.data.name"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="form.data.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getDepartInfo,
  getDepartTop,
  add,
  update,
  del
} from '@/api/org/depart/index';
import myTree from '@/components/Tree/index'
export default {
  name: 'depart',
  components: {
    myTree
  },
  props: ['btnState', 'selectedData'],
  watch: {
    keyWords () {
      this.page.currPage = 1;
      this.handletableData()
    }
  },
  mounted () {
    const nodeId = this.$route.query.nodeId
    const type = this.$route.query.type
    if (nodeId && type === 'DEPARTMENT') {
      this.getDepartList(nodeId)
    } else {
      this.getDepartTopList()
    }
  },
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
    treeNodeClick (data) {
      this.form.visible = false
      if (data === 1) return;
      this.last = false
      this.tree.data = data
      this.getList()
    },
    // 选择框数组填充
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.$emit('postData', val)
    },
    // 获取最新10条
    getDepartTopList () {
      this.loading.list = true
      getDepartTop(10).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取数据失败')
          return;
        }
        const data = res.data;
        this.page.total = data.length;
        this.depart.all = res.data;
        this.depart.list = this.depart.all.slice(0, this.page.pageSize);
      })
    },
    // 最新10条
    getTopClick () {
      this.last = true
      this.keyWords = ''
      if (this.tree.data) {
        this.tree.data = null
      }
      this.$refs.tree.cancelCheck()
      this.getDepartTopList()
    },
    // 新增部门
    handleAdd () {
      if (!this.tree.data || !this.tree.data.id) {
        this.$message.warning('请选择部门目录')
        return;
      }
      this.initForm()
      this.form.title = '新增部门'
      this.form.visible = true
    },
    // 编辑部门
    handleEdit (row) {
      this.form.data = row
      this.form.title = '编辑部门'
      this.form.visible = true
    },
    // 删除部门
    handleDel (row) {
      if (row.business.length > 0 || row.model.length > 0 || row.standard.length > 0 || row.subject.length > 0) {
        this.$message.warning('该部门有关联信息,无法删除')
        return;
      }
      this.openConfirm('此操作将永久删除该数据, 是否继续?', () => {
        del(row.id).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '失败')
            return
          }
          this.$message.success('成功')
          this.getList()
        })
      })
    },
    // 获取详情
    getDepartList (id) {
      this.loading.list = true
      getDepartInfo(id).then(res => {
        this.loading.list = false
        const data = res.data;
        this.page.total = data.length;
        this.depart.all = res.data;
        this.depart.list = this.depart.all.slice(0, this.page.pageSize);
      });
    },
    getList () {
      if (!this.tree.data || !this.tree.data.id) {
        this.getDepartTopList()
      } else {
        this.getDepartList(this.tree.data.id)
      }
    },
    // 单元格被点击
    cellClick (row, column) {
      if (!column.labelClassName) return;
      this.$emit('linkDetail', { row, column })
    },
    // 取消
    cancel () {
      this.form.visible = false
    },
    // 保存
    save () {
      if (this.form.title === '新增部门') {
        const obj = Object.assign({}, this.form.data)
        obj.parent_id = this.tree.data.id
        add(obj).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '失败')
            return;
          }
          this.$message.success('成功')
          this.form.visible = false
          this.getList()
        })
      } else {
        const obj = Object.assign({}, this.form.data)
        update(obj).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '失败')
            return;
          }
          this.$message.success('成功')
          this.form.visible = false
          this.getList()
        })
      }
    },
    // 添加关联
    handleLink (row) {
      this.$emit('addLink', { row })
    },
    // 处理分页数据
    handletableData () {
      const { pageSize, currPage } = this.page;
      const startIndex = (currPage - 1) * pageSize;
      const endIndex = currPage * pageSize;
      let tempList = [];
      for (const item of this.depart.all) {
        if (item.name.includes(this.keyWords)) {
          tempList.push(item);
        }
      }
      this.page.total = tempList.length;
      tempList = tempList.slice(startIndex, endIndex);
      this.depart.list = tempList;
      this.loading = false;
    },
    // 初始化数据
    initForm () {
      this.form.data = {
        name: '',
        description: ''
      }
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
  data () {
    return {
      last: true,
      keyWords: '',
      multipleSelection: [],
      tree: {
        params: {
          type: 'DEPARTMENT',
          name: '部门'
        },
        data: null
      },
      form: {
        title: '新增',
        visible: false,
        data: {
          name: '',
          description: ''
        }
      },
      loading: {
        list: false,
        dialog: false
      },
      page: {
        total: 0,
        page: 1,
        currPage: 1,
        pageSize: 10
      },
      depart: {
        all: [],
        list: [],
        rules: {
          name: { required: true, message: '必填', trigger: 'blur' }
        }
      }
    };
  }
}
</script>
