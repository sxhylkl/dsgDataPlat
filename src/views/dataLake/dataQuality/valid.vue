<template>
  <div id="validContainer">
    <el-form label-width="80px" :model="formObj" :rules="rules" ref="form_obj">
      <el-form-item label="查看条数" prop="limit">
        <el-input
          type="input"
          v-model="formObj.limit"
          style="width: 200px;"
          @blur="submitForm('form_obj')"
          placeholder="请输入查看条数"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableList"
      :default-sort="{prop: 'date', order: 'descending'}"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item,index) in tableCloumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="true"
      ></el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10,50,100,500,1000]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>-->
  </div>
</template>

<script type="text/ecmascript-6">
import { getDataQualityValid } from '@/api/dataLake/api'
export default {
  name: "valid",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      loading: false,
      tableList: [],
      tableCloumn: [],
      formObj: {
        limit: 100
      },
      rules: {
        limit: [
          { required: true, message: '请输入条数', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只支持数字' }
        ]
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      const params = { ...this.params, ...{ limit: this.formObj.limit } }
      getDataQualityValid(params).then(res => {
        this.tableCloumn = []
        for (let key in res[0]) {
          const tempObj = {}
          tempObj['label'] = key
          tempObj['prop'] = key
          this.tableCloumn.push(tempObj)
        }
        this.tableList = res
        this.loading = false
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.initData()
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
#validContainer {
}
</style>