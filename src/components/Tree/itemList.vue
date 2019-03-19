<template>
  <el-col :span="18">
    <el-card class="box-card" v-show="!updateNodeTabVisible">
      <div slot="header" class="clearfix">
        <span>行业标准详情</span>
        <span
          style="float:right;cursor:pointer"
          class="fa fa-refresh"
          title="最新数据"
          @click="getTopList()"
        ></span>
      </div>
      <div>
        <!--工具条-->
        <div>
          <el-col :span="24" class="toolbar" style="margin-bottom:15px;">
            <el-button @click="editBtn()" type="primary" v-show="!btnState && (chooseNode && chooseNode.id)">
              <!-- <i class="fa fa-plus"></i> -->
              添加行业标准
            </el-button>
          </el-col>

          <!--列表-->
          <el-table :data="tabDataShow" border v-loading="loading">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="说明" prop="description"></el-table-column>
            <el-table-column label="创建者" prop="creator"></el-table-column>
            <el-table-column label="标准基础名" prop="standard_base_name"></el-table-column>
            <el-table-column label="版本" prop="version"></el-table-column>
            <el-table-column label="创建时间" prop="creat_time" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="修改时间" prop="update_time" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" min-width="220px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="editBtn(scope.row)"
                  title="编辑"
                  v-if="!btnState"
                >
                  <i class="fa fa-edit"></i>
                </el-button>
                <el-button size="mini" type="success" plain @click="link(scope.row)" title="查看">
                  <i class="fa fa-list-alt"></i>
                </el-button>
                <!-- <el-button
                  size="mini"
                  type="success"
                  plain
                  @click="importStander(scope.row)"
                  title="导入"
                  v-if="!btnState"
                >
                  <i class="el-icon-upload2"></i>
                </el-button>-->
                <excel-import-export
                  v-if="scope.row && !btnState"
                  :type="scope.row"
                  isInstandard="ture"
                  @uploaded="uploaded"
                ></excel-import-export>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="remove(scope.row.id)"
                  title="删除"
                  v-if="!btnState"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination
              layout="sizes,prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-size="pageCount"
              :page-sizes="[10, 20, 50, 100]"
              style="float:right;"
              :total="total"
            ></el-pagination>
          </el-col>
        </div>
      </div>
    </el-card>
    <el-card v-show="updateNodeTabVisible">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div>
        <el-form label-width="110px" :model="updateNodeTab" ref="updateNodeTab" :rules="rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="updateNodeTab.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="format">
            <el-select v-model="updateNodeTab.format" placeholder="请选择类型" style="width:100%">
              <el-option :label="item.name" :value="item" v-for="item in typeList" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input v-model="updateNodeTab.description"></el-input>
          </el-form-item>
          <el-form-item label="创建者" prop="creator">
            <el-input v-model="updateNodeTab.creator"></el-input>
          </el-form-item>
          <el-form-item label="标准基础名" prop="standard_base_name">
            <el-input v-model="updateNodeTab.standard_base_name"></el-input>
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-input v-model="updateNodeTab.version"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="updateNodeTabVisible = false">取消</el-button>
            <el-button type="primary" @click.native="updateNode" :loading="addLoading">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import { getTab, getAllTab, createTab, updateTab, deleteTab, getTop, getType } from '@/api/tree/itemList'
import ExcelImportExport from '@/components/ExcelImportExport'
export default {
  name: 'myList',
  components: {
    ExcelImportExport
  },
  props: ['chooseNode', 'btnState'],
  data() {
    return {
      updateNodeTabVisible: false,
      // 表格相关
      tabDataAll: [],
      tabDataShow: [],
      typeList: [],
      pageCount: 10,
      total: 0,
      page: 1,
      loading: false,
      // 表格相关
      addLoading: false,
      updateNodeTab: {},
      title: '新建行业标准',
      rules: {
        name: [{ required: true, message: '名称不能为空' }],
        format: [{ required: true, message: '类型不能为空' }]
        /* description: [{ required: true, message: '说明不能为空' }],
        creator: [{ required: true, message: '创建者不能为空' }],
        standard_base_name: [{ required: true, message: '标准基础名不能为空' }],
        version: [{ required: true, message: '版本不能为空' }] */
      }

    }
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('selectedTable', val)
    },
    // 获取标准的类型
    getTypeList() {
      getType().then(res => {
        if (res.code !== 0) {
          this.$message.error('获取行业标准类型失败')
          return
        }
        this.typeList = res.data
      })
    },
    uploaded(data, state) {
      console.log('-----导入')
      console.log(data)
      console.log(state)
      this.getList()
    },
    getTopList() {
      this.loading = true
      this.$emit('topClick')
      getTop().then(res => {
        this.loading = false
        if (res.code !== 0) {
          this.$message.error('获取最新10失败')
          return;
        }
        this.tabDataShow = res.data
      })
    },
    /**
     * 关联按钮
     */
    link(row) {
      this.$emit('link', row)
    },
    /**
     *  点击btn按钮事件 赋值parent_id
     */
    editBtn(val) {
      if (val === undefined) {
        if (!this.chooseNode || !this.chooseNode.id) {
          this.$message.warning('请选择行业标准目录')
          return
        }
        this.title = '新增行业标准'
        this.updateNodeTab = Object.assign({}, { parent_id: this.chooseNode.id })
      } else {
        const obj = Object.assign({}, val)
        obj.format = JSON.parse(obj.format)
        console.log(val)
        JSON.parse(val.format)
        console.log(val)
        console.log('edit')
        this.title = '编辑行业'
        this.updateNodeTab = obj
      }
      this.updateNodeTabVisible = true
    },
    /**
     * 获取右侧table总数据
     */
    getTab() {
      this.loading = true
      const id = this.chooseNode.id
      getTab(id).then(res => {
        this.loading = false
        this.tabDataAll = res.data
        this.tabDataShow = res.data.slice(0, 10)
        this.total = res.data.length
      })
    },
    // 获取列表
    getList() {
      console.log('------------------chooseNode')
      console.log(this.chooseNode)
      if (this.chooseNode && this.chooseNode.id) {
        this.getTab()
      } else {
        this.getTopList()
      }
    },
    /**
     * 更新以及创建操作
     */
    updateNode() {
      this.$refs.updateNodeTab.validate(valid => {
        if (valid) {
          const obj = Object.assign({}, this.updateNodeTab)
          obj.format = JSON.stringify(obj.format)
          if (typeof (obj.id) == 'undefined') {
            this.addLoading = true
            createTab(obj).then(res => {
              this.getList()
              this.addLoading = false
              this.updateNodeTabVisible = false
            })
          } else {
            updateTab(obj).then(res => {
              this.getList()
              this.addLoading = false
              this.updateNodeTabVisible = false

            })
          }
        }
      })
    },
    /**
     * 删除操作
     */
    remove(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTab(id).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
            return;
          }
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 改变页面操作
     */
    handleCurrentChange(val) {
      this.page = val
    },
    /**
     * 改变页码大小操作
     */
    handleSizeChange(val) {
      this.pageCount = val
    },
    // 导入
    importStander(row) {
      this.$message.info('敬请期待...')
    }
  },
  watch: {
    chooseNode:{
      deep:true,
      handler(node){
         if (node && node.id) {
        this.getTab()
      } else {
        this.getTopList()
      }
      }
    }
  },
  filters: {
  },
  mounted() {
    this.getTopList()
    this.getTypeList()
  }
}
</script>
