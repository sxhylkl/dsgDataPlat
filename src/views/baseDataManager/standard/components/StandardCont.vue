<template>
  <div>
    <el-row :gutter="20">
      <my-tree ref="tree" :params="tree.params" @nodeClick="nodeClick" :btnState="btnState"></my-tree>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{standard.config.title}}详情</span>
            <span
              style="float:right;cursor:pointer"
              class="fa fa-refresh"
              title="最新数据"
              @click="getTopList()"
            ></span>
          </div>
          <div>
            <div>
              <!--工具条-->
              <el-button
                type="primary"
                @click="createStandard"
                v-if="!btnState && tree.data && tree.data.id"
              >添加{{standard.config.title}}</el-button>
              <el-table
                ref="multipleTable"
                :data="standard.list"
                row-key="id"
                :expand-row-keys="standard.expandRowKeys"
                v-loading="loading.list"
                border
                style="width: 100%;margin-top:15px;"
                @expand-change="expandChange"
                @selection-change="handleSelectionChange"
                @cell-click="cellClick"
              >
                <el-table-column type="expand" v-if="!btnState">
                  <template slot-scope="props">
                    <el-table
                      :data="fields.list"
                      style="width: 100%;margin-top:15px;"
                      v-loading="loading.expand"
                    >
                      <el-table-column prop="name_cn" label="中文名称" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="name_en" label="英文名称" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="datatype" label="字段类型"></el-table-column>
                      <el-table-column prop="datatype" label="规则数">
                        <template slot-scope="scope">
                          <span>{{scope.row | ruleCount}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="datatype" label="行业标准" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span>{{scope.row.standard_base_id?scope.row.standard_base_id+'/'+scope.row.standard_base_column_namecn:'暂无'}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" min-width="150px">
                        <template scope="scope">
                          <el-button
                            size="mini"
                            title="编辑"
                            type="primary"
                            plain
                            @click="handleFieldEdit(scope.row)"
                          >
                            <i class="fa fa-edit"></i>
                          </el-button>
                          <el-button
                            size="mini"
                            title="查看"
                            type="primary"
                            plain
                            @click="handleFieldDetail(scope.row)"
                          >
                            <i class="fa fa-list-alt"></i>
                          </el-button>
                          <el-button
                            size="mini"
                            title="删除"
                            type="danger"
                            plain
                            @click="handleFieldDel(scope.row)"
                          >
                            <i class="fa fa-trash"></i>
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                  type="selection"
                  width="55"
                  v-if="btnState"
                  :selectable="isdisable"
                ></el-table-column>
                <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="type" label="类型"></el-table-column> -->
                <el-table-column prop="creat_time" label="创建时间" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span>{{scope.row.creat_time | formatLongTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="update_time" label="更新时间" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span>{{scope.row.update_time | formatLongTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="部门数" label-class-name="depart">
                  <template scope="scope">
                    <span>{{scope.row.depart.length}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="任务数" label-class-name="task">
                  <template scope="scope">
                    <span>{{scope.row.task.length}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="流程数" label-class-name="flows">
                  <template scope="scope">
                    <span>{{scope.row.flows.length}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="320px" v-if="!btnState">
                  <template scope="scope">
                    <el-button
                      type="success"
                      size="mini"
                      plain
                      @click="addField(scope.row)"
                      title="添加字段"
                    >
                      <i class="fa fa-plus"></i>
                    </el-button>
                    <el-button
                      size="mini"
                      title="编辑"
                      type="primary"
                      plain
                      @click="handleEdit(scope.row)"
                    >
                      <i class="fa fa-edit"></i>
                    </el-button>
                    <el-tooltip class="item" effect="dark" content="关联" placement="bottom-end">
                      <el-button
                        type="success"
                        plain
                        size="mini"
                        @click.stop="handleLink(scope.row)"
                      >
                        <i class="fa fa-link"></i>
                      </el-button>
                    </el-tooltip>
                    <excel-import-export :type="scope.row" isOther="ture" @uploaded="uploaded"></excel-import-export>
                    <el-button
                      size="mini"
                      title="删除"
                      type="danger"
                      plain
                      @click="handleDel(scope.row)"
                    >
                      <i class="fa fa-trash"></i>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--创建标准表-->
      <el-dialog
        :title="standard.config.title"
        :visible.sync="dialog.standard"
        :close-on-click-modal="false"
      >
        <el-form
          :model="standard.form"
          :rules="standard.rules"
          ref="standardForm"
          @submit.native.prevent
        >
          <el-form-item label="名称" prop="name" label-width="120px">
            <el-input v-model.trim="standard.form.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialog.standard = false">取消</el-button>
          <el-button type="primary" @click.native="saveStandard">提交</el-button>
        </div>
      </el-dialog>
    </el-row>
    <!-- 添加字段 -->
    <el-dialog title="字段" :visible.sync="dialog.field" width="55%">
      <div>
        <add-field
          ref="field"
          :fieldForm="fields.form"
          :btnState="fields.isEdit"
          :config="standard.config"
        ></add-field>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.field = false">取 消</el-button>
        <el-button type="primary" @click="saveField" v-show="!fields.isEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addStandard, getStandard, getTop, updateStandard, delStandard, getStandarFields, saveFields, updateFields, delFields } from '@/api/stander/index.js'
import myTree from '@/components/Tree/index'
import AddField from './addField.vue'
import ExcelImportExport from '@/components/ExcelImportExport'
export default {
  name: 'myStandard',
  props: ['modelTreee', 'modelConfig', 'nodeId', 'btnState', 'selectedData'],
  components: {
    myTree,
    AddField,
    ExcelImportExport
  },
  data () {
    return {
      standard: {
        list: [],
        form: {
          name: ''
        },
        expandRowKeys: [],
        curr: null,
        config: {
          title: '标准',
          isStandard: true,
          isModel: false,
          type: 'standard',
          linkType: 'STANDARD',
          tableType: 0
        },
        rules: {
          name: [
            { required: true, message: '必填', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        }
      },
      fields: {
        list: [],
        ruleList: [],
        isEdit: false,
        form: {
          name_cn: '',
          name_en: '',
          description: '',
          datatype: 'string',
          ispk: false,
          nullable: false,
          default_value: '',
          standard_base_id: '',
          standard_base_column_namecn: '',
          validation: [],
          standardization: []
        }
      },
      dialog: {
        standard: false,
        field: false,
        title: '关系列表',
        realationVisible: false,
        config: {
          data: [],
          fromCol: 'to_name',
          fromName: '',
          toCol: 'from_name',
          toType: 'from_type',
          toName: ''
        },
        linkConfig: {
          selected: {
            depart: [],
            task: [],
            subject: [],
            business: [],
            standard: [],
            model: [],
            rule: [],
            datasource: []
          },
          type: 'STANDARD',
          typeArr: ['subject', 'business', 'rule', 'standard', 'model']
        }
      },
      tree: {
        data: null,
        params: {
          type: 'STANDARD',
          name: '标准'
        }
      },
      loading: {
        list: false,
        expand: false
      },
      multipleSelection: [] // 多选框所选集合
    }
  },
  watch: {

  },
  filters: {
    ruleCount (row) {
      let standard = 0
      let valid = 0;
      if (row.standardization) {
        standard = row.standardization.length
      }
      if (row.validation) {
        valid = row.validation.length
      }
      return standard + valid
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
    // 选择框数组填充
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.$emit('postData', val)
    },
    nodeClick (data) {
      if (data === 1) return
      this.tree.data = data
      this.getList()
    },
    // 添加字段
    addField (row) {
      this.fields.isEdit = false
      this.standard.curr = row;
      this.fields.form = {
        name_cn: '',
        name_en: '',
        description: '',
        datatype: 'string',
        ispk: false,
        nullable: false,
        default_value: '',
        standard_base_id: '',
        standard_base_column_namecn: '',
        validation: [],
        standardization: []
      }
      this.dialog.field = true;
    },
    // 单元格被点击
    cellClick (row, column) {
      if (!column.labelClassName) return;
      this.$emit('linkDetail', { row, column })
    },
    // 主题关联
    handleLink (row) {
      const obj = Object.assign({}, row)
      obj.type === 0 ? obj.type = 'STANDARD' : obj.type = 'MODEL'
      this.$emit('addLink', { row: obj })
    },
    // 保存关联
    saveLink () {
      this.getList()
    },
    // 保存字段
    saveField () {
      this.$refs.field.$refs.fieldForm.validate((valid) => {
        if (valid) {
          this.handleField()
          if (this.fields.form.id) { // 更新
            updateFields(this.fields.form).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.msg ? res.msg : '保存失败')
                return;
              }
              this.dialog.field = false
              this.$message.success('保存成功')
              this.standard.curr.id && this.getFieldList(this.standard.curr.id)
            })
          } else { // 新增
            this.fields.form.parent_id = this.standard.curr.id
            saveFields(this.fields.form).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.msg ? res.msg : '保存失败')
                return;
              }
              this.dialog.field = false
              this.$message.success('保存成功')
              this.standard.curr.id && this.getFieldList(this.standard.curr.id)
            })
          }
        } else {
          return false;
        }
      });
    },
    // 处理字段
    handleField () {
      /* this.fields.form.validation = this.$refs.field.validation
      this.fields.form.standardization = this.$refs.field.standardization */
      if (this.fields.form.ispk) {
        this.fields.form.ispk = 1
      } else {
        this.fields.form.ispk = 0
      }
      if (this.fields.form.nullable) {
        this.fields.form.nullable = 1
      } else {
        this.fields.form.nullable = 0
      }
    },
    // 展开表行
    expandChange (row, expandedRows) {
      this.standard.curr = row
      if (expandedRows.length > 0) {
        this.standard.expandRowKeys = [row.id]
        this.getFieldList(row.id)
      }
    },
    // 获取标准的详情
    getFieldList (id) {
      this.loading.expand = true
      getStandarFields(id).then(res => {
        this.loading.expand = false
        this.fields.list = res.data
        this.fields.list.sort(function (a, b) {
          return a.creat_time - b.creat_time; // 时间正序
        })
      }).catch(() => {
        this.loading.expand = false
      })
    },
    handleEdit (row) {
      this.standard.form = Object.assign({}, row);
      this.dialog.standard = true
    },
    // 创建标准
    createStandard () {
      this.standard.form = { name: '' }
      if (this.tree.data && this.tree.data.id) {
        this.dialog.standard = true;
        return
      }
      this.$message.warning('请选择目录')
    },
    // 获取列表
    getList () {
      if (this.tree.data && this.tree.data.id) {
        this.getStandardList(this.tree.data.id)
      } else {
        this.getTopList()
      }
    },
    // 获取最近10条
    getTopList () {
      if (this.tree.data) {
        this.tree.data = null
      }
      this.$refs.tree.cancelCheck()
      this.loading.list = true
      getTop(this.standard.config.type).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取最新10条失败')
          return;
        }
        this.standard.list = res.data;
      }).catch(() => {
        this.loading.list = false
      })
    },
    // 获取标准列表
    getStandardList (id) {
      this.loading.list = true
      getStandard(id).then(res => {
        this.loading.list = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '获取数据失败')
          return;
        }
        this.standard.list = res.data
      }).catch(() => {
        this.loading.list = false
      })
    },
    // 保存标准
    saveStandard () {
      this.$refs.standardForm.validate(valid => {
        if (valid) {
          if (this.standard.form.id) { // 更新
            updateStandard(this.standard.form).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.msg ? res.msg : '保存失败')
                return
              }
              this.dialog.standard = false;
              this.getList()
            })
          } else { // 新增
            this.standard.form.parent_id = this.tree.data.id
            this.standard.form.type = this.standard.config.tableType
            addStandard(this.standard.form).then(res => {
              if (res.code !== 0) {
                this.$message.error(res.msg ? res.msg : '保存失败')
                return
              }
              this.dialog.standard = false;
              this.getList()
            })
          }
        } else {
          return;
        }
      })
    },
    handleFieldEdit (row) {
      this.fields.isEdit = false
      this.fields.form = Object.assign({}, row)
      if (this.fields.form.ispk) {
        this.fields.form.ispk = true
      } else {
        this.fields.form.ispk = false
      }
      if (this.fields.form.nullable) {
        this.fields.form.nullable = true
      } else {
        this.fields.form.nullable = false
      }
      if (!this.fields.form.validation) this.fields.form.validation = []
      if (!this.fields.form.standardization) this.fields.form.standardization = []
      this.dialog.field = true
    },
    handleFieldDetail (row) {
      this.fields.isEdit = true
      this.fields.form = Object.assign({}, row)
      if (this.fields.form.ispk) {
        this.fields.form.ispk = true
      } else {
        this.fields.form.ispk = false
      }
      if (this.fields.form.nullable) {
        this.fields.form.nullable = true
      } else {
        this.fields.form.nullable = false
      }
      if (!this.fields.form.standardization) this.fields.form.standardization = []
      if (!this.fields.form.validation) this.fields.form.validation = []
      this.dialog.field = true;
    },
    // 删除字段
    handleFieldDel (row) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFields(row.id).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '删除失败')
            return;
          }
          this.$message.success('删除成功')
          this.getFieldList(this.standard.curr.id)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 删除标准表
    handleDel (row) {
      if (row.depart.length > 0 || row.task.length > 0) {
        this.$message.warning('该数据有关联信息,无法删除')
        return;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStandard(row.id).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg ? res.msg : '删除失败')
            return;
          }
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    uploaded (data, state) {
      if (state && this.standard.curr && this.standard.curr.id) {
        this.getFieldList(this.standard.curr.id)
      }
    }
  },
  created () {
    if (this.modelTreee) {
      this.tree.params = this.modelTreee.params
    }
    if (this.modelConfig && this.modelConfig.isModel) {
      this.standard.config = this.modelConfig
      this.dialog.linkConfig.type = this.modelConfig.linkType
    }
  },
  mounted () {
    // const nodeId = this.$route.query.nodeId
    const nodeId = this.nodeId
    if (nodeId) {
      this.getStandardList(nodeId)
    } else {
      this.getTopList();
    }
  }
}
</script>
<style scope>
</style>
