<template>
  <div id="indexContainer">
    <div class="query-box">
      <el-tooltip class="add-btn" effect="dark" content="新建分类管理" placement="bottom">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="addCategory()"></el-button>
      </el-tooltip>
      <el-input placeholder="请输入名称查询" prefix-icon="el-icon-search" v-model="query" style="width:50%"></el-input>
    </div>
    <el-table
      v-loading="loading"
      :data="tableList"
      :default-sort="{prop: 'updateDate', order: 'descending'}"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item,index) in tableCloumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.prop === 'name' || item.prop === 'updateDate'"
      ></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="bottom">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-zoom-in"
              plain
              @click="editCategory(scope.row, 'detail')"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑分类" placement="bottom">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              plain
              @click="editCategory(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除分类" placement="bottom">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              plain
              @click="delCategory(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10,20,50,100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
    <el-dialog :title="dialogObj.title" :fullscreen="false" :visible.sync="dialogObj.isShow">
      <el-form :model="categoryObj" ref="category_Form" :rules="categoryRules" label-width="80px" v-loading="dialogObj.loading">
        <el-form-item label="名称" prop="name">
          <div>
            <el-input
              v-model="categoryObj.name"
              :disabled="dialogObj.isDisabled"
              @blur="getSystemName(categoryObj.name)"
              style="width: 90%"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="categoryObj.description"
            :disabled="dialogObj.isDisabled"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="系统名" prop="systemName">
          <div style="display:flex; width: 90%;">
            <el-input
              v-model="categoryObj.systemName"
              :disabled="!isEdit || dialogObj.isDisabled || !isEditSystemName"
              style="width: 90%; margin-right:10px;"
            ></el-input>
            <el-button type="primary" @click="editSystemName()" :disabled="dialogObj.isDisabled" size="small">
              <span v-if="!isEditSystemName">改变系统名</span>
              <span v-else>使用默认</span>
            </el-button>
          </div>
          <span style="color:#999;font-size: 12px">(名称自动转化为系统名，但中文不会自动转换)</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogObj.isShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('category_Form')"
          :disabled="dialogObj.isDisabled"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getCategoryList, getCategoryDetail, delCategory, editCategory, getCategorySystemName } from '@/api/dataLake/api';
export default {
  name: 'index',
  data () {
    return {
      isFirst: true, // 初始化请求数据
      loading: false,
      isEdit: false,
      isEditSystemName: false, // 是否编辑系统名
      query: '', // 查询条件
      dialogObj: {
        title: '分类详情',
        isDisabled: false,
        isShow: false,
        loading: false
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      tempCategoryObj: [], // 存放新建时，默认的其余参数
      categoryObj: {
        name: '',
        description: '',
        systemName: ''
      },
      categoryRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入分类描述', trigger: 'blur' }],
        systemName: [
          { required: true, message: '请输入系统名', trigger: 'blur' },
          { pattern: /^[a-z0-9_]+$/, message: '只支持数字/小写字母/下划线' }
        ]
      },
      tableList: [],
      allList: [], // 存放所有数据
      tableCloumn: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: 'id',
          prop: 'id'
        },
        {
          label: '系统名',
          prop: 'systemName'
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '更新时间',
          prop: 'updateDate'
        }
      ]
    }
  },
  watch: {
    'page': {
      handler: function (newVal, oldVal) {
        this.handletableData()
      },
      deep: true
    },
    query: function (val) {
      this.handletableData()
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      getCategoryList().then(res => {
        const { pageSize } = this.page
        this.page.total = res.length
        this.allList = res
        this.tempCategoryObj = res[0]
        this.tableList = this.allList.slice(0, pageSize)
        this.loading = false
        if(!this.isFirst) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    /**
     * @description 自动获取系统名
     * @param name { string } 新建名称
     */
    getSystemName (name) {
      getCategorySystemName(name).then(res => {
        this.categoryObj.systemName = res
      })
    },
    /**
     * @description 自定义系统名
     */
    editSystemName () {
      this.isEditSystemName = !this.isEditSystemName
      if(!this.isEditSystemName) {
        this.getSystemName(this.categoryObj.name)
      }
    },
    /**
     * @description 处理分页数据
     */
    handletableData () {
      const { pageSize, currentPage } = this.page
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = currentPage * pageSize
      let tempList = []
      this.allList.forEach(el => {
        el.name.indexOf(this.query) > -1 && tempList.push(el)
      })
      this.page.total = tempList.length
      tempList = tempList.slice(startIndex, endIndex)
      this.tableList = tempList
      this.loading = false
    },
    /**
     * @description 编辑分类
     * @param type { string } edit-编辑 detail-详情
     * @param row { object } 当前行
     */
    editCategory (row, type = 'edit') {
      let tempObj = {}
      type === 'edit'
        ? tempObj = { title: '编辑分类', isShow: true, isDisabled: false }
        : tempObj = { title: '分类详情', isShow: true, isDisabled: true }
      this.dialogObj = { ...this.dialogObj, ...tempObj }
      this.categoryObj = row
    },
    /**
     * @description 删除分类
     * @param row { object } 当前行
     */
    delCategory (row) {
      const { id } = row
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.loading = true
        delCategory(id).then(res => {
          this.isFirst = false
          this.initData()
        })
      })
    },
    /**
     * @description 弹窗表单验证
     * @param name { string } 表单名
     */
    submitForm (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.isFirst = false
          this.dialogObj.loading = true
          editCategory(this.categoryObj).then(res => {
            this.dialogObj.isShow = false
            this.dialogObj.loading = false
            this.initData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * @description 新建分类，只能改变name systemName description,其余数据默认选取列表第一条
     */
    addCategory () {
      this.isFirst = false
      this.isEdit = true
      this.dialogObj.loading = false
      const tempDialogOObj = {
        title: '新建分类',
        isShow: true,
        isDisabled: false
      }
      const tempObj = {
        allowedActions: null,
        createDate: null,
        customProperties: null,
        description: null,
        feedRoleMemberships: [],
        id: null,
        name: null,
        owner: null,
        parentId: null,
        relatedFeeds: null,
        roleMemberships: [],
        securityGroups: [],
        systemName: '',
        updateDate: null,
        userFields: [],
        userProperties: [],
        type: 'SYSTEM',
        status: null
        // topicId: null,
        // rules: null,
      }
      this.categoryObj = { ...tempObj }
      this.dialogObj = { ...this.dialogObj, ...tempDialogOObj }
    },
    /**
     * @description pageSize改变
     */
    handleSizeChange (val) {
      this.page.pageSize = val
    },
    /**
     * @description 页数改变
     */
    handleCurrentChange (val) {
      this.page.currentPage = val
    }
  }
}
</script>

<style lang='scss' scoped>
#indexContainer {
  .query-box {
    position: relative;
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
    .add-btn {
      position: absolute;
      left: 10px;
    }
  }
}
</style>