<!-- 有版本的流程信息 -->
<template>
  <div class="feed-list-version">
    <div v-loading="loading">
      <el-collapse accordion v-show="list && list.length > 0">
        <el-collapse @change="changeVersion" accordion>
          <el-collapse-item
            v-for=" item in list "
            :title="item.name"
            :name="item.id"
            :key="item.id"
          >
            <el-table :data="info" :show-header="false">
              <el-table-column prop="key"></el-table-column>
              <el-table-column prop="value"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-collapse>
      <p v-show="!list || list.length === 0" class="noData">暂无数据</p>
    </div>
  </div>
</template>

<script>
// 例如：import 《组件名称》 from '《组件路径》';
import { getFeedVersion, getVersionDetail } from '@/api/curd/feed/index.js'
import { postProdVersionChild } from '@/api/dataLake/api'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      loading: false,
      list: [],
      info: [],
      versionLoading: false
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    getList(id) {
      this.loading = true;
      getFeedVersion(id).then(res => {
        this.loading = false;
        if (res.status && res.status !== 200) {
          this.$message.error('获取流程版本列表失败')
          return;
        }
        this.list = res;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 获取版本详情
    changeVersion(versionId) {
      if (versionId) this.getVersionInfo(versionId)
    },
    // 获取版本详情
    getVersionInfo(id) {
      this.versionLoading = true
      postProdVersionChild(id).then(data => {
        getVersionDetail(`${data[0].name}.${data[0].name}`).then(res => {
          this.versionLoading = false
          if (res.status) {
            this.$message.error('获取版本信息失败')
            return;
          }
          const resData = [
            { key: '流程名', value: res.feedName },
            { key: '所属分类', value: res.categoryName },
            { key: '模板名称', value: res.templateName },
            { key: '创建时间', value: (new Date(res.ctreatDate)).toLocaleString() },
            { key: '更新时间', value: (new Date(res.updateDate)).toLocaleString() },
            { key: '状态', value: this.translate(res.state) }
          ]
          data ? this.info = resData : this.info = []
        }).catch(() => {
          this.versionLoading = false
        })
      }).catch(() => {
        this.versionLoading = false
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.noData {
  text-align: center;
  border: none;
  line-height: 50px;
}
</style>