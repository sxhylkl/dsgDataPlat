<template>
  <div id="invaliContainer">
    <!-- <el-form label-width="80px">
      <el-form-item label="筛选规则">
        <el-select v-model="filter" placeholder="请选择" style="width:200px">
          <el-option
            v-for="item in options"
            :key="item.objectShortClassType"
            :label="item.name"
            :value="item.objectShortClassType">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>-->
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
        :label="item.label"
        v-if="item.label!=='dlp_reject_reason'"
        :sortable="true"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="typeof(scope.row[item.prop]) !='object'">{{scope.row[item.prop]}}</span>
          <div v-if="typeof(scope.row[item.prop]) =='object'">
            <p style="color:#FF9901">{{scope.row[item.prop].name}}</p>
            <p class='hint'>{{scope.row[item.prop].rule}}</p>
            <p class='hint'>{{scope.row[item.prop].reason}}</p>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="email"
        prop="dlp_reject_reason"
        :sortable="true"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope"></template>
      </el-table-column>-->
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
import { getDataQualityInvalid, getFeedValidation } from '@/api/dataLake/api'
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
      formObj: {
        limit: 100
      },
      rules: {
        limit: [
          { required: true, message: '请输入条数', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只支持数字' }
        ]
      },
      loading: false,
      tableList: [],
      tableCloumn: [],
      filter: 'None',
      options: [
        {
          name: 'None',
          objectShortClassType: 'None'
        }
      ]
    }
  },
  watch: {
    page: {
      handler: function (newVal, oldVal) {
        this.initData()
      },
      deep: true
    },
    filter (val) {
      this.initData()
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    toObj (val) {
      let index = val.indexOf('}') + 1
      console.log(val.substring(1, index))
      return JSON.parse(val.substring(1, index))
    },
    initData () {
      this.loading = true
      const tempObj = {
        limit: this.formObj.limit,
        filter: this.filter === 'None' ? '' : this.filter
      }
      const params = { ...this.params, ...tempObj }
      getDataQualityInvalid(params).then(res => {
        this.tableCloumn = []
        for (let key in res[0]) {
          const tempObj = {}
          tempObj['label'] = key
          tempObj['prop'] = key
          this.tableCloumn.push(tempObj)
        }
        res = res.map(el => {
          el[this.toObj(el.dlp_reject_reason).field] = { name: el[this.toObj(el.dlp_reject_reason).field] }
          el[this.toObj(el.dlp_reject_reason).field] = Object.assign(el[this.toObj(el.dlp_reject_reason).field], this.toObj(el.dlp_reject_reason))
          return el
        })
        this.tableList = res
        console.log(this.tableList)
        this.loading = false
      })
      getFeedValidation().then(res => {
        this.options = [...this.options, ...res]
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
<style scoped>
.hint {
    left: 2px;
    right: auto;
    bottom: 7px;
    font-size: 12px;
    line-height: 14px;
    transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
    color: grey;
}
</style>
