<template>
      <el-table :data="showFeedsList" v-loading="loadingFeed" style="width: 100%">
                <el-table-column prop="feedName" label="流程名"></el-table-column>
                <el-table-column label="状态" prop="state" sortable>
                  <template slot-scope="scope">
                    <span>{{scope.row.state | translate}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="所属分类" prop="categoryName"></el-table-column>
                <el-table-column label="类型" prop="templateName"></el-table-column>
                <el-table-column label="更新时间">
                  <template slot-scope="scope">
                    <span>{{(new Date(scope.row.updateDate)).toLocaleString()}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="100">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="导出流程" placement="bottom">
                      <a
                        :href="'/datalake-feed_/v1/feedmgr/admin/export-feed/'+showFeedsList[scope.$index].id"
                        class="aStyle"
                      >
                        <i class="el-icon-upload2"></i>
                      </a>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="编辑流程" placement="bottom">
                      <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        plain
                        @click="editFeed(scope.$index, scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除流程" placement="bottom">
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        plain
                        @click="deleteFeed(scope.$index, scope.row)"
                        :disabled="scope.row.state==='ENABLED'"
                      ></el-button>
                    </el-tooltip>
                    <!-- 查看质量目录 -->
                    <el-tooltip class="item" effect="dark" content="查看流程质量列表" placement="bottom">
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-zoom-in"
                        plain
                        @click="lookQuality(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <!--:disabled="scope.row.feedsCount==0 ? isCanDel=false : isCanDel=true"-->
                  </template>
                </el-table-column>
              </el-table>
</template>

<script>
import { getTaskRelationDetails } from '@/api/dataLake/api.js'
export default {
  props:['id'],
  data(){
    return{
      showFeedsList: [],
      loadingFeed: false,
    }
  },
  watch:{
     id(id){
        getTaskRelationDetails(id).then(res => {
        console.log(res)
      })
    }
  },
  methods:{

  }
}
</script>
