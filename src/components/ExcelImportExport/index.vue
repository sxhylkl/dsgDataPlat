<template>
  <!--
  使用说明
    <excel-import-export @uploaded="uploaded"></excel-import-export>
    uploaded:用于接收导入的结果
  -->
  <div class="excel-box" v-bind:class="{ others: isOther||isInstandard }">
    <el-popover placement="right" width="110" trigger="click" v-show="!isOther&&!isInstandard">
      <div>
        <el-upload
          ref="uploadExcel"
          list-type="button"
          action
          accept=".xls, .xlsx"
          :limit="1"
          :show-file-list="false"
          :before-upload="uploadBefor"
        >
          <div class="excel-item">
            <i v-show="!importLoading" class="el-icon-upload2"></i>
            <i v-show="importLoading" class="el-icon-loading"></i>
            导入分类
          </div>
        </el-upload>
        <div class="excel-item" @click="closePopover">
          <a :href="url" download title="导出( 请使用office2013以上版本,或WPS打开 )">
            <i class="el-icon-download"></i>
            导出分类
          </a>
        </div>
      </div>
      <el-button slot="reference" style="border:none">
        <i class="el-icon-more"></i>
      </el-button>
    </el-popover>
    <span v-show="isOther|| isInstandard" class="excel-other">
      <el-upload
        ref="uploadExcel"
        list-type="button"
        action
        accept=".xls, .xlsx"
        :limit="1"
        :show-file-list="false"
        :before-upload="uploadBefor"
        style="display: inline-block;"
      >
        <el-button type="primary" plain size="mini" title="导入">
          <i v-show="!importLoading" class="el-icon-upload2"></i>
          <i v-show="importLoading" class="el-icon-loading"></i>
        </el-button>
      </el-upload>
      <el-button
        type="primary"
        class="excle-down"
        size="mini"
        plain
        title="导出( 请使用office2013以上版本,或WPS打开 )"
      >
        <a :href="url" download>
          <i class="el-icon-download"></i>
        </a>
      </el-button>
    </span>
  </div>
</template>
<script>
import request from '@/utils/request'
// 导入
function importExcelFn (obj, url) {
  return request({
    url,
    method: 'post',
    data: obj
  });
}
export default {
  props: ['type', 'isOther', 'isInstandard'],
  data () {
    return {
      importLoading: false,
      exportLoading: false,
      url: '/curd_/excel/exportExcel'
    }
  },
  created () {
    if (this.isOther) {
      this.url = `/curd_/excel/exportStandard?tableName=${this.type.name}&parentId=${this.type.parent_id}`
    } else if (this.isInstandard) {
      const type = Object.assign({}, this.type)
      type.format = JSON.parse(type.format)
      this.url = `/curd_/excel/exportExcel?type=${type.format.name}&parentId=${type.id}`
    } else {
      this.url = `/curd_/excel/exportExcel?type=${this.type}&parentId=''`
    }
  },
  watch: {
    type: {
      deep: true,
      handler: function () {
        if (this.isOther) {
          this.url = `/curd_/excel/exportStandard?tableName=${this.type.name}&parentId=${this.type.parent_id}`
        } else if (this.isInstandard) {
          const type = Object.assign({}, this.type)
          type.format = JSON.parse(type.format)
          this.url = `/curd_/excel/exportExcel?type=${type.format.name}&parentId=${type.id}`
        } else {
          this.url = `/curd_/excel/exportExcel?type=${this.type}&parentId=''`
        }
      }
    }
  },
  methods: {
    uploadBefor (file) {
      this.importLoading = true
      console.log(file)
      const fd = new FormData()
      fd.append('file', file)
      // fd.append('type', this.type)
      let url = '/curd_/excel/importExcel'
      if (this.isOther) {
        console.log('-------import')
        console.log(this.type)
        url = `/curd_/excel/importStandard?type=${this.type.type}&parentId=${this.type.parent_id}&tableName=${this.type.name}`
      } else if (this.isInstandard) {
        const type = Object.assign({}, this.type)
        type.format = JSON.parse(type.format)
        url = `/curd_/excel/importExcel?type=${type.format.name}&parentId=${type.id}`
      } else {
        url = `/curd_/excel/importExcel?type=${this.type}&parentId=''`
      }
      importExcelFn(fd, url).then(res => {
        this.$emit('uploaded', res, true)
        this.importLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg ? res.msg : '导入失败')
          return;
        }
        this.$message.success('导入成功')
        this.closePopover()
      }).catch(() => {
        this.importLoading = false;
        this.$message.error(res.msg ? res.msg : '导入失败')
        // this.$emit('uploaded', err, false)
        this.closePopover()
      })
      return false;
    },
    // 关闭popover
    closePopover () {
      document.querySelector('#app').click()
    }
  }
}
</script>
<style scoped>
.excel-box {
  text-align: right;
}
.el-upload {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
}
.excel-item a {
  display: block;
  color: #606266;
}
.excel-item {
  font-size: 14px;
  width: 100%;
  line-height: 30px;
}
.excel-item:hover,
.excel-item:hover a {
  color: #409eff;
}
.excel-box .el-popover {
  min-width: 50px !important;
}
.excel-box .el-button {
  padding: 0;
}
.el-button:focus,
.el-button:hover {
  background: none !important;
}
.others {
  display: inline-block;
}
.excel-other .el-button {
  padding: 7px 15px !important;
}
.excel-other .excle-down {
  padding: 0 !important;
}
.excel-other .excle-down a {
  display: block;
  padding: 7px 15px !important;
}
.excel-other .el-button:hover {
  background: #fff;
  border-color: #409eff;
  color: #409eff;
}
</style>

