<template>
  <section>
    <!--过滤栏-->
    <el-form>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item label="流程名字" :label-width="formLabelWidth">
            <el-input v-model="query['name_^VLK']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="流程KEY" :label-width="formLabelWidth">
            <el-input v-model="query['key_^VLK']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" size="mini" plain @click="search"><i class="fa fa-search" style="margin-right: 3px"></i>查询</el-button>
            <el-button type="warning" size="mini" plain @click="query={key:'',name:''}"><i class="fa fa-refresh" style="margin-right: 3px"></i>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--工具栏-->
    <el-row style="margin-bottom: 10px">
      <el-button type="success" size="mini" plain title="新增" @click="New"><i class="fa fa-plus" style="margin-right: 3px"></i>新增</el-button>
      <el-button type="success" size="mini" plain title="清除系统缓存"><i class="fa fa-times-circle" style="margin-right: 3px"></i>清除系统缓存</el-button>
    </el-row>
    <!--table-->
    <el-table :data="listJson" style="width: 100%" v-loading="loadding">
      <el-table-column prop="name" label="名称" sortable :show-overflow-tooltip='true'></el-table-column>
      <el-table-column label="流程定义KEY" sortable :show-overflow-tooltip='true' prop="key"></el-table-column>
      <el-table-column label="ActDefId" prop="actDefId" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="状态" prop="status" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="版本" prop="version" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="移动端" prop="supportMobile" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="描述" prop="desc"   :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"   :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column label="管理" width="250">
        <template slot-scope="scope">
          <el-button-group class="btnG">
            <el-button type="danger" size="mini" title="删除" plain @click="removeFlow(scope.row.id)"> <i class="fa fa-trash"></i></el-button>
            <el-button type="primary" size="mini" title="授权" plain @click="empower(scope.row.id)"> <i class="fa fa-id-card"></i></el-button>
            <el-button type="primary" size="mini" title="流程全局配置预览" plain @click="toPzAll(scope.row.actModelId)"> <i class="fa fa-eye"></i></el-button>
            <el-button type="primary" size="mini" title="流程设计" plain @click="toFlowDesign(scope.row.actModelId)"> <i class="fa fa-edit"></i></el-button>
            <el-button type="success" size="mini" title="启动" plain @click="run(scope.row.id)"> <i class="fa fa-play-circle-o"></i></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="block" style="float:right;margin-top: 12px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="创建流程定义" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="流程分类" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择流程分类">
            <el-option  v-for="one in Nodes" :label="one.name" :value="one.name" :key="one.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="流程KEY" :label-width="formLabelWidth">
          <el-input v-model="form.key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input v-model="form.desc" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="流程授权" :visible.sync="dialogFormVisible2">
      <el-form >
        <el-form-item label="所有人" :label-width="formLabelWidth">
          <el-switch
            v-model="allPeople"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>

        </el-form-item>
        <div v-show="show1">
          <el-form-item label="用户" :label-width="formLabelWidth">
            <el-select
              v-model="form2.user.value"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签">
              <el-option
                v-for="item in data1"
                :key="item.id_"
                :label="item.fullname_"
                :value="item.fullname_+'/'+item.id_">
                <span style="float: left">{{ item.fullname_ }}({{item.account_}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select
              v-model="form2.role.value"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择">
              <el-option
                v-for="item in data2"
                :key="item.id_"
                :label="item.name_"
                :value="item.name_+'/'+item.id_">
                <span style="float: left">{{ item.name_ }}({{item.alias_}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" :label-width="formLabelWidth">
            <el-select
              v-model="form2.post.value"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择">
              <el-option
                v-for="item in data3"
                :key="item.rel_code_"
                :label="item.rel_name_"
                :value="item.rel_name_+'/'+item.id_">
                <span style="float: left">{{ item.rel_name_ }}({{item.rel_def_name_}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织" :label-width="formLabelWidth">
            <select-tree  @changeOrg="changeOrg" :selectedNode="form2.org.value"
                          :type="form2.type" :options="data4" :props="defaultProps"/>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
      </div>
    </el-dialog>
    <test-flow :id="id" ref="Flow"></test-flow>
    <el-dialog title="流程全局配置预览" :visible.sync="dialogFormVisible3" :fullscreen="true">

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible3= false">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<style>
  #table2 .el-table__row{
    cursor: pointer;
  }
</style>
<script>
  import {getListJson,getNodes,remove,getObject,getInstanceData,getOverallView} from '../../../api/workflow/businessApproval/flow/list'
  import SelectTree from '@/components/select-tree/SelectTree.vue'
  import FlowEditor from '@/components/flowEditor/index.vue'
  /*    import '@riophae/vue-treeselect/dist/vue-treeselect.css'*/
  import { handleParams } from '@/utils/workflow/common.js'
  import { toTreeData } from '@/utils/workflow/tree.js'
  export default {
    name: 'list',
    props: ['rights', 'RightsTypeList', 'dialogConfigVisible'],
    components: {
      SelectTree,
      "test-flow":FlowEditor
    },
    data(){
      return{
        allViewData:{},
        dialogFormVisible3:false,
        defaultProps: {
          parent: 'parentId',   // 父级唯一标识
          value: 'id',          // 唯一标识
          label: 'label',       // 标签显示
          children: 'children', // 子级
        },
        Visible:false,
        data1:[],
        data2:[],
        data3:[],
        data4:[],
        form2: {
          type: 'b',
          desc: '',
          delivery: false,
          org: {id: [], type: 'org', desc: [], value: []},
          post: {id: [], type: 'post', desc: [], value: []},
          role: {id: [], type: 'role', desc: [], value: []},
          user: {id: [], type: 'user', desc: [], value: []},
          script: {id: '', type: 'script', desc: ''},
        },
        form:{
          type:'',
          name:'',
          key:'',
          desc:''
        },
        treeDom:{},

        allPeople:false,
        show1:true,

        dialogFormVisible2:false,
        query:{
          'name_^VLK':'',
          'key_^VLK':'',
        },
        formLabelWidth:'80px',
        dialogFormVisible:false,
        Nodes:[],
        id:'',
        loadding:false,
        listJson:[],
        currentPage:1,
        pageSize:10,
        total:0,
        order:'asc'

      }
    },
    watch:{
      allPeople(val){
        val?this.show1=false:this.show1=true
      }
    },
    filters:{
    },
    methods:{
      toPzAll(id){

      },
      // 接收SelectTree的值
      changeOrg (data) {
        console.log('树形组件传来的值')
        this.form2.org.value = []
        for (let val of data) {
          this.form2.org.value.push(val.label + '/' + val.id)
        }

      },
      rowClick(row){
        this.$refs.table2.toggleRowSelection(row)
      },
      empower(id){this.dialogFormVisible2=true},
      search(){
        let params = Object.assign(this.query,{order:this.order,offset:this.pageSize*(this.currentPage-1),limit:this.pageSize})
        this.loadding = true
        getListJson(params).then(data=>{
          this.total = data.total
          this.listJson = data.rows
        })
        this.loadding = false
      },
      removeFlow(id){
        let that = this
        this.$confirm('是否删除该流程?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'}).then(() => {
          let param = {id:id}
          remove(param).then(res=>{
            if(res.isOk){
              that.getTable();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
            else{
              this.$message({
                type: 'error',
                message: res.msg
              });
            }

          }).catch(err=>{
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val){
        this.pageSize = val
        this.getTable();
      },
      handleSizeChange2(val){
        this.pageSize2 = val
        this.getTable();
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.getTable2();
      },
      handleCurrentChange2(val){
        this.currentPage2 = val
        this.getTable2();
      },
      transform(json){
        for(let key in json){
          json[key]=''
        }
        return json
      },
      New(){
        let that = this
        this.dialogFormVisible = true
        this.form = this.transform(Object.assign({},that.form))
      },
      getTable(){
        let params = {order:this.order,offset:this.pageSize*(this.currentPage-1),limit:this.pageSize}
        this.loadding = true
        getListJson(params).then(data=>{
          this.total = data.total
          this.listJson = data.rows
        })
        this.loadding = false
      },
      getTable2(){
        let params1 = {data:{order:'asc',offset:0},type:'listData_userSelector'}
        let params2 = {data:{order:'asc',offset:0},type:'listData_roleSelector'}
        let params3 = {data:{order:'asc',offset:0},type:'listData_postSelector'}
        let params4 = {data:{order:'asc',offset:0},type:'treeData_orgSelector'}
        getObject(params1).then(data=>{this.data1 = data.rows})
        getObject(params2).then(data=>{this.data2 = data.rows})
        getObject(params3).then(data=>{this.data3 = data.rows})
        getObject(params4).then(data=>{
          console.log('获取树形菜单')
          this.data4 = toTreeData(data, {
            id: 'id_',
            parentId: 'parent_id_',
            name: 'name_',
            rootId: '0'
          })
        })
      },
      getNodes(){
        getNodes().then(data=>{
          this.Nodes = data
        })
      },
      run(id){
        getInstanceData({defId:id,readonly: 'undefined',instanceId: ''}).then(data=>{
          data.isOk?this.$message({type:'success',message:data.msg}):this.$message({type:'error',message:data.msg})
        })
      },
      toFlowDesign(id){
        this.id = id
        this.$refs.Flow.dialogVisible=true
      },
      toPzAll(id){
        getOverallView({defId:id}).then(data=>{
          this.allViewData = data
          this.dialogFormVisible3 = true
        })
      },
    },
    mounted(){
      this.getTable()
      this.getNodes()
      this.getTable2()
    }
  }
</script>

<style scoped>

</style>
