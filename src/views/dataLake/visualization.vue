<template>
  <section>
    <el-form>
      <el-row :gutter="20" v-show="step1" id="sec">
        <el-col :span="6">
          <el-button @click="beforeShowCli" v-show="beforeShow">上一步</el-button>
          <el-select v-model="cDataSource" style="float:right">
            <el-option v-for="one in Type" :label="one.name" :value="one.id" :key="one.id"></el-option>
          </el-select>
        </el-col>

        <el-col :span="10">
          <el-autocomplete
            style="width: 100%;"
            class="inline-input t-query"
            v-model="tableChoosed"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="inputSelect"
          ></el-autocomplete>
        </el-col>

        <el-col :span="8">
          <el-button type="success" @click="addTable">添加表</el-button>
          <!-- <el-button type="info" @click="editSQL" :disabled="editSQLDis">编辑SQL</el-button>-->
          <el-button type="primary" @click="goStep2" :disabled="goStep2Dis">继续步骤</el-button>
          <el-button type="warning" @click="cleanTab" title="清空表">
            <i class="fa fa-refresh"></i>
          </el-button>
        </el-col>
        <el-col
          :span="24"
          id="cantainer"
          style="margin-top:30px;height: 2000px;position: relative;margin-right: 10px;margin-left: 10px"
        >
          <div
            class="box-card draggle-div"
            v-for="(container,index) in containers"
            :id="container.name+'|'+index"
            :key="'a'+index"
            :style="{width: '30%',position: 'absolute',left:index*31+'%'}"
          >
            <div class="el-card__header">
              <div class="clearfix">
                <span>{{container.schemaName+'.'+container.name}}</span>
                <i
                  class="el-icon-close"
                  style="cursor: pointer;color:white;float:right;margin-top: 2px;"
                  @click="removeContainer(index,true)"
                ></i>
              </div>
            </div>
            <div class="el-card__body">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="container.checkAll"
                @change="handleCheckAllChange(index,$event)"
              >全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group
                v-model="container.checked"
                @change="handleCheckedCitiesChange(index,$event)"
              >
                <div
                  v-for="(o,index2) in container.fields"
                  :key="'y'+index2"
                  class="text item smartCard"
                >
                  <el-checkbox :label="o.name" :key="o.name"></el-checkbox>
                  <font style="font-style: italic;color: rgb(149, 142, 142);">-{{o.derivedDataType}}</font>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-show="!step1" v-loading="loadding">
        <el-col :span="hisSpan" class="fn-history table-border" v-show="historyVisible">
          <h3>函数历史</h3>
          <el-table
            :data="historySQL"
            style="width: 100%"
            @row-click="historyJump"
            :highlight-current-row="true"
          >
            <el-table-column prop="filterSQL" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column width="50px">
              <template slot-scope="scope">
                <el-button type='text' size='mini' title='删除' @click='removeHistory(scope.row,scope.$index)'><i class='fa fa-trash'></i></el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <!-- <ul>
            <li
              v-for="(one,index) in historySQL"
              :key="index"
              @click="historyJump(one.newJSON,index,one.filterSQL,one.tableData,one.tableColums)"
            >{{one.filterSQL}}</li>
          </ul>-->
        </el-col>
        <el-col :span="24-hisSpan" class="fn-result table-border">
          <el-row>
            <el-col :span="2" :offset="3">
              <el-button type="warning" @click="historyClick">历史({{historySQL.length}})</el-button>
            </el-col>
            <el-col :span="1">
              <el-dropdown
                trigger="click"
                style="margin-top: 5px;float: right;"
                placement="bottom-start"
              >
                <span class="el-dropdown-link" style="color: #1296db;vertical-align: center">
                  <i class="fa fa-list fa-2x"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="filterShow(0)">聚合函数</el-dropdown-item>
                  <el-dropdown-item @click.native="filterShow(1)">条件函数</el-dropdown-item>
                  <el-dropdown-item @click.native="filterShow(2)">透视聚合函数</el-dropdown-item>
                  <el-dropdown-item @click.native="filterShow(3)">窗口函数</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="10">
              <!--:fetch-suggestions="querySearch"    autocomplete-->
              <el-input
                style="width: 100%;"
                v-model="filterSQL"
                class="inline-input t-query"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                :disabled="sqlDisabled"
              ></el-input>
            </el-col>

            <el-col :span="8">
              <el-button type="success" @click="filterType=0" v-if="filterType===1">进入简单模式</el-button>
              <el-button type="success" @click="filterType=1" v-if="filterType===0">进入高级模式</el-button>
              <el-button type="warning" @click="toFilter">转换</el-button>
              <el-button type="info" @click="step1=true">上一步</el-button>
              <el-button type="primary" @click="goToFather" v-if="nextShow">下一步</el-button>
            </el-col>

            <el-col
              :span="24"
              id="cantainer"
              style="margin-top:10px;height: 600px;position: relative;margin-right: 10px;margin-left: 10px;"
            >
              <el-table :data="tableData" height="600px">
                <el-table-column
                  v-for="one in columnsData"
                  :label="one"
                  :prop="one"
                  :key="one"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog :append-to-body="true" :title="title" :visible.sync="linkModal">
      <el-form>
        <el-form-item label="连接名称">
          <el-input placeholder="输入一个名称"></el-input>
        </el-form-item>
        <el-row>
          <el-col :sapn="8">
            <el-form-item label="加入类型">
              <el-select v-model="addType" style="width: 100%;">
                <el-option v-for="list in list1" :label="list" :value="list" :key="list"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="源键">
              <el-select v-model="sourceKey">
                <el-option
                  v-for="list in chooseSourceKey.fields"
                  :label="list.name"
                  :value="list.name"
                  :key="list.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标键">
              <el-select v-model="targetKey">
                <el-option
                  v-for="list in chooseTargetKey.fields"
                  :label="list.name"
                  :value="list.name"
                  :key="list.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!--聚合函数-->
    <el-dialog :title="filterPz[0].name" :visible.sync="filterPz[0].visible" :append-to-body="true">
      <el-form ref="dialog0" :model="filterPz[0].form">
        <!--设置分组的列-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置分组的列(groupBy)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[0].form.columnsArr.push({value:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[0].form.columnsArr">
          <el-row :gutter="20" :key="'b'+index">
            <el-col :span="22">
              <el-form-item :prop="`columnsArr.${index}.value`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.value" style="width:100%;">
                  <el-option
                    v-for="two in resultColums"
                    :label="two.key"
                    :value="two.value"
                    :key="two.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[0].form.columnsArr.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!--设置聚合的函数-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置聚合的函数</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[0].form.aggArr.push({addType:'count',columns:'',otherName:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[0].form.aggArr">
          <el-row :gutter="20" :key="'c'+index">
            <el-col :span="7">
              <el-form-item :prop="`aggArr.${index}.addType`" :rules="rules.required">
                <el-select v-model="one.addType" style="width:100%;">
                  <el-option v-for="two in aggArr" :label="two" :value="two" :key="two"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :prop="`aggArr.${index}.columns`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.columns" style="width:100%;">
                  <el-option
                    v-for="two in resultColums"
                    :label="two.key"
                    :value="two.value"
                    :key="two.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :prop="`aggArr.${index}.otherName`" :rules="rules.otherName">
                <el-input
                  v-model="one.otherName"
                  placeholder="请输入别名(不能输入中文和特殊符号)"
                  style="width:100%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[0].form.aggArr.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[0].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click.native="filterPz[0].visible = false">取 消</el-button> -->
        <el-button type="primary" @click.native="filterPzSubmit(0)">确 定</el-button>
      </span>
    </el-dialog>

    <!--条件函数-->
    <el-dialog :append-to-body="true" :title="filterPz[1].name" :visible.sync="filterPz[1].visible">
      <el-form ref="dialog1" :model="filterPz[1].form">
        <!--设置when条件-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置什么条件，取什么值(when)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[1].form.when.push({key:'',value:'',row:'',sign:'>',num:5})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>
        <template v-for="(one,index) in filterPz[1].form.when">
          <el-row :gutter="20" :key="'d'+index">
            <el-col :span="11">
              <el-col :span="8">
                <el-form-item :prop="`when.${index}.row`" :rules="rules.required">
                  <el-select placeholder="选择列" style="width: 100%" v-model="one.row">
                    <el-option
                      v-for="one in resultColums"
                      :label="one.key"
                      :value="one.value"
                      :key="one.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :prop="`when.${index}.sign`" :rules="rules.required">
                  <el-select placeholder="选择符号" style="width: 100%" v-model="one.sign">
                    <el-option v-for="one in signArr" :label="one" :value="one" :key="one"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :prop="`when.${index}.num`" :rules="rules.required">
                  <el-input placeholder="输入值" style="width: 100%" type="number" v-model="one.num"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="`when.${index}.value`" :rules="rules.required">
                <el-input placeholder="请输入值" v-model="one.value" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[1].form.when.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!--设置默认条件的取值(otherwise)-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="设置默认条件的取值(otherwise)" prop="otherwise" :rules="rules.required">
              <el-input placeholder="请输入值" v-model="filterPz[1].form.otherwise"></el-input>
            </el-form-item>
          </el-col>
          <!--设置新加列的别名-->
          <el-col :span="24">
            <el-form-item label="设置新加列的别名(as)" prop="as" :rules="rules.otherName">
              <el-input placeholder="请输入值(不允许中文)" v-model="filterPz[1].form.as"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[1].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="filterPzSubmit(1)">确 定</el-button>
      </span>
    </el-dialog>

    <!--透视聚合函数-->
    <el-dialog :append-to-body="true" :title="filterPz[2].name" :visible.sync="filterPz[2].visible">
      <el-form ref="dialog2" :model="filterPz[2].form">
        <!--设置分组的列(groupBy)-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置分组的列(groupBy)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[2].form.groupBy.push({value:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[2].form.groupBy">
          <el-row :gutter="20" :key="'e'+index">
            <el-col :span="22">
              <el-form-item :prop="`groupBy.${index}.value`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.value" style="width:100%;">
                  <el-option
                    v-for="two in resultColums"
                    :label="two.key"
                    :value="two.value"
                    :key="two.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[2].form.groupBy.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!--设置要应用行转列的字段(pivot)-->
        <el-row :gutter="20">
          <el-col :span="24">
            <h3>设置要应用行转列的字段(pivot)</h3>
          </el-col>
          <el-col :span="22">
            <el-form-item prop="pivot" :rules="rules.required">
              <el-select placeholder="请选择列" v-model="filterPz[2].form.pivot" style="width: 100%;">
                <el-option
                  v-for="one in resultColums"
                  :label="one.key"
                  :value="one.value"
                  :key="one.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--设置行转列后列取值使用的聚合函数(agg)-->
        <el-row :gutter="20">
          <el-col :span="22">
            <h3>设置行转列后列取值使用的聚合函数(agg)</h3>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="filterPz[2].form.aggArr.push({addType:'count',columns:''})"
              size="mini"
            >
              <i class="fa fa-plus"></i>
            </el-button>
          </el-col>
        </el-row>

        <template v-for="(one,index) in filterPz[2].form.aggArr">
          <el-row :gutter="20" :key="'f'+index">
            <el-col :span="11">
              <el-form-item :prop="`aggArr.${index}.addType`" :rules="rules.required">
                <el-select placeholder="请选择类型" v-model="one.addType" style="width:100%;">
                  <el-option v-for="two in aggArr" :label="two" :value="two" :key="two"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="`aggArr.${index}.columns`" :rules="rules.required">
                <el-select placeholder="请选择列" v-model="one.columns" style="width:100%;">
                  <el-option
                    v-for="two in resultColums"
                    :label="two.key"
                    :value="two.value"
                    :key="two.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item>
                <el-button
                  type="danger"
                  plain
                  @click="filterPz[2].form.aggArr.splice(index,1)"
                  size="mini"
                  v-if="index>0"
                  class="dangerBtn"
                >
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[2].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="filterPz[2].visible = false">取 消</el-button>
        <el-button type="primary" @click.native="filterPzSubmit(2)">确 定</el-button>
      </span>
    </el-dialog>

    <!--窗口函数-->
    <el-dialog :append-to-body="true" :title="filterPz[3].name" :visible.sync="filterPz[3].visible">
      <el-form ref="dialog3" :model="filterPz[3].form">
        <!--设置新加列的取值(sum)-->
        <el-row :gutter="20">
          <h3>设置新加列的取值({{filterPz[3].form.sum.key}})</h3>
          <el-col :span="11">
            <el-form-item prop="sum.key" :rules="rules.required">
              <el-select v-model="filterPz[3].form.sum.key" style="width: 100%">
                <el-option v-for="one in aggArr" :label="one" :value="one" :key="one"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="sum.value" :rules="rules.required">
              <el-select v-model="filterPz[3].form.sum.value" style="width: 100%">
                <el-option
                  v-for="one in resultColums"
                  :label="one.key"
                  :value="one.value"
                  :key="one.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--设置新加列窗口条件(over)-->
        <el-row :gutter="20">
          <h3>设置新加列的窗口条件(over)</h3>
          <el-col :span="11">
            <el-form-item prop="over.key" :rules="rules.required">
              <el-select v-model="filterPz[3].form.over.key" style="width: 100%">
                <el-option label="orderBy" value="orderBy"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="over.value" :rules="rules.required">
              <el-select v-model="filterPz[3].form.over.value" style="width: 100%">
                <el-option
                  v-for="one in resultColums"
                  :label="one.key"
                  :value="one.value"
                  :key="one.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--设置新加列的别名(as)-->
        <el-row :gutter="20">
          <h3>设置新加列的别名(as)</h3>
          <el-col :span="24">
            <el-form-item prop="as" :rules="rules.otherName">
              <el-input v-model="filterPz[3].form.as" placeholder="请输入别名(不能输入中文和特殊符号)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <p style="color:#F08C38">函数实例:</p>
        <h3>{{filterPz[3].defaultSql}}</h3>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="filterPz[3].visible = false">取 消</el-button>
        <el-button type="primary" @click.native="filterPzSubmit(3)">确 定</el-button>
      </span>
    </el-dialog>

    <!--历史-->
    <!-- <el-dialog  :append-to-body = "true" title="函数历史" :visible.sync="historyVisible">
      <h3
        v-for="(one,index) in historySQL"
        @click="historyJump(one.newJSON,index,one.filterSQL,one.tableData,one.tableColums)"
      >{{one.filterSQL}}</h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyVisible=false">取 消</el-button>
        <el-button type="primary" @click="historyVisible=false">确 定</el-button>
      </span>
    </el-dialog>-->
  </section>
</template>
<style>
.box-card {
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  border-radius: 4px;
  overflow: hidden;
}
#sec .el-dialog__headerbtn .el-dialog__close {
  color: white;
}
#sec .el-dialog__title {
  color: white;
}
#sec .el-dialog__header {
  background: #409eff;
}
#cantainer .el-card__body {
  max-height: 450px;
  overflow-y: auto;
}
#cantainer .el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #409eff;
  color: white;
}
</style>

<style scoped>
.box-card:hover {
  border: 1px solid #409eff;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

/*.box-card {
        width: 580px;
    }*/
/* .smartCard{
         padding: 5px;
     }*/
.el-dialog__body {
  max-height: 500px !important;
}
.el-table .el-button {
  padding: 1px 12px !important;
}
.fn-history {
  text-align: center;
}
.fn-history h3 {
  border-bottom: 1px solid #ebeef5;
  line-height: 35px;
}

.fn-result {
  padding: 20px 0;
}
.table-border {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
}
</style>

<script>
import { transform, getUserDatasource, getUserDatasourceTable, getHiveTables, baseInfo, transform2, datasource, datasourceTable, getDataSource, getDataSourceById, getScripts } from '../../api/dataLake/api'
import { toTreeData } from '@/utils/workflow/tree.js'
import jsplumb from 'jsplumb'
export default {
  name: 'myVisualization',
  props: ['nextShow', 'beforeShow', 'dataBaseArr'],
  data () {
    const validOtherName = (rule, value, callback) => {
      const reg = /[a-zA-Z]\w*/
      if (!(reg.test(value) || value === '')) {
        callback(new Error('不能输入中文和特殊符号且不能为数字开头'));
      } else {
        callback()
      }
    };
    return {
      scriptInfo: {},
      hisSpan: 0,
      transformData: {},
      resultColumsRel: [],
      loadding: false,
      columnsData: {},
      tableData: [],
      step1: true,
      pzArr: [],
      // 构建查询'
      SQLStr: '',
      sqlJSON: [],
      connections: [],
      conn: {},
      isIndeterminate: false,
      checkAll: true,
      goStep2Dis: true,
      editSQLDis: true,
      title: '',
      isShowSure: false,
      linkModal: false,
      isRule1: false,
      isIdType: false,
      isSex: false,
      isDate: false,
      Type: ['Hive'],
      otherTable: [],
      HiveTable: [],
      cDataSource: 'Hive',
      tableChoosed: '',
      restaurants: [
      ],
      containers: [],
      jsPlumb: '',
      jsPlumbPz: {
        //Connector: ['Flowchart', { curviness: 50 }], // 连线类型，有直线，折线等，我这只用直线
        DragOptions: { cursor: 'pointer', zIndex: 2000 }, // 拖动的时候
        PaintStyle: { strokeStyle: '#E8C870', lineWidth: 2 },
        EndpointStyle: { radius: 5, fillStyle: '#E8C870' },
        HoverPaintStyle: { strokeStyle: '#7073EB' },
        EndpointHoverStyle: { fillStyle: '#7073EB' },
        ConnectionOverlays: [
          ['Label', { label: '关联', cssClass: 'csslabel' }]], // 这个是鼠标拉出来的线的属性
        overlays: [['Arrow', { width: 12, length: 12, location: 0.5 }]], // 连线箭头设置

      },
      exampleGreyEndpointOptions: {
        endpoint: 'Dot',
        paintStyle: { width: 20, height: 20, fill: '#666', radius: 5 },
        isSource: true,
        connectorStyle: { stroke: '#666' },
        isTarget: true,
        maxConnections: 1,
      },
      list1: ['Inner Join', 'Left Join', 'Right Join'],
      chooseSourceKey: [],
      chooseTargetKey: [],
      sourceKey: '',
      targetKey: '',
      addType: 'Inner Join',
      ttt1: [{ name: 'Baseinfo', details: [{ 'name': 'HEALTH_RECORD_NO', 'type': 'varchar(255)' }, { 'name': 'NAME', 'type': 'varchar(10)' }, { 'name': 'SEX_CODE', 'type': 'smallint(6)' }, { 'name': 'BIRTH_DATE', 'type': 'datetime' }, { 'name': 'ID_TYPE_CODE', 'type': 'varchar(2)' }, { 'name': 'ID_NO', 'type': 'varchar(255)' }, { 'name': 'EMPLOYER_NAME', 'type': 'char(0)' }, { 'name': 'TEL_NO', 'type': 'varchar(255)' }, { 'name': 'CONTACT_NAME', 'type': 'char(0)' }, { 'name': 'CONTACT_TEL_NO', 'type': 'char(0)' }, { 'name': 'RESIDENCE_MARK', 'type': 'varchar(1)' }, { 'name': 'NATIONALITY_CODE', 'type': 'smallint(6)' }, { 'name': 'ABO_CODE', 'type': 'smallint(6)' }, { 'name': 'RH_CODE', 'type': 'char(0)' }, { 'name': 'EDUCATION_CODE', 'type': 'smallint(6)' }, { 'name': 'OCCUPATION_CODE', 'type': 'smallint(6)' }, { 'name': 'MARRIAGE_CODE', 'type': 'smallint(6)' }, { 'name': 'DRUG_ALLERGY_SOURCE', 'type': 'varchar(20)' }, { 'name': 'PAST_SICKNESS_TYPE_CODE', 'type': 'varchar(65)' }, { 'name': 'PAST_SICKNESS_CONFIRM_DATE', 'type': 'char(0)' }, { 'name': 'OPERATION_HISTORY', 'type': 'varchar(255)' }, { 'name': 'OPERATION_DTIME', 'type': 'char(0)' }, { 'name': 'TRAUMA_HISTORY_MARK', 'type': 'char(0)' }, { 'name': 'TRAUMA_NAME', 'type': 'char(0)' }, { 'name': 'TRAUMA_OCCUR_DTIME', 'type': 'char(0)' }, { 'name': 'BLOOD_TRANSF_MARK', 'type': 'char(0)' }, { 'name': 'BLOOD_TRANSF_CAUSE', 'type': 'char(0)' }, { 'name': 'BLOOD_TRANSF_DTIME', 'type': 'char(0)' }, { 'name': 'FAMILY_DISEASE_CODE', 'type': 'char(0)' }, { 'name': 'CONTACT_RELATIONSHIP', 'type': 'smallint(6)' }, { 'name': 'GENETIC_DISEASE_HISTORY', 'type': 'varchar(60)' }, { 'name': 'DISABILITY_MARK', 'type': 'char(0)' }, { 'name': 'EXHAUST_FACILITY_MARK', 'type': 'char(0)' }, { 'name': 'EXHAUST_FACILITY_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'FUEL_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'WATER_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'TOILET_TYPE_CODE', 'type': 'char(0)' }, { 'name': 'LIVESTOCK_PEN_TYPE_CODE', 'type': 'char(0)' }] }, { name: 'Baseinfo_payway', details: [{ 'name': 'HEALTH_RECORD_NO', 'type': 'varchar(255)' }, { 'name': 'PAY_WAY_CODE', 'type': 'smallint(6)' }] }],
      booleanConnect: true,



      historyVisible: false,
      filterType: 1,
      filterPz: [
        {
          name: '聚合函数',
          visible: false,
          defaultSql: 'groupBy(COLUMN).agg(count("COLUMN")).as("VALUE")',
          form: {
            columnsArr: [{ value: '' }],
            aggArr: [
              {
                addType: 'count',
                columns: '',
                otherName: '',
              }
            ],
          },
        },
        {
          name: '条件函数',
          visible: false,

          defaultSql: `when(CONDITION,'VALUE').otherwise('VALUE').as('VALUE')`,
          form: {
            when: [{ key: '', value: '', row: '', sign: '>', num: 5 }],
            otherwise: '',
            as: ''
          }
        },
        {
          name: '透视聚合函数',
          visible: false,
          defaultSql: 'groupBy(COLUMN).pivot("COLUMN").agg(count("COLUMN"))',
          form: {
            groupBy: [{ value: '' }],
            pivot: [{ value: '' }],
            aggArr: [
              {
                addType: 'count',
                columns: '',
              }
            ],
          },
        },
        {
          name: '窗口函数',
          visible: false,
          defaultSql: 'sum(COLUMN).over(orderBy(COLUMN)).as("COLUMN")',
          form: {
            sum: { key: 'sum', value: '' },
            over: { key: 'orderBy', value: '' },
            as: ''
          },
        }
      ],
      filterSQL: '',
      aggArr: ['count', 'sum', 'avg', 'min', 'max'],
      historySQL: [],
      resultColums: [],
      transformDetails: {},
      resultTableID: '',
      scriptStart: '',
      scriptArr: [],
      sqlDisabled: true,
      signArr: ['>', '>=', '==', '<=', '<'],
      rules: {
        required: [
          { required: true, message: '该项为必填' }
        ],
        otherName: [
          { validator: validOtherName }
        ]
      }
    }
  },
  watch: {
    //控制历史的显示与隐藏的col长度
    historyVisible (val) {
      val ? this.hisSpan = 6 : this.hisSpan = 0
    },
    //由props传值过来的数据源列表赋值
    dataBaseArr (val) {
      if (val) {
        this.Type = [...val]
      }
    },
    //控制继续步骤2的disabled
    containers (val) {
      // val.length === 0 ? this.editSQLDis = true : this.editSQLDis = false
      let sign = 0
      val.map((one, index) => {
        if (one.dataSourceId !== 'Hive') {
          sign = 1
          return false
        }
      })
      if (val.length === 0) this.goStep2Dis = true
      else if (val.length === 1) this.goStep2Dis = false
      sign === 1 && val.length > 1 && this.connections.length === 0 ? this.goStep2Dis = true : this.goStep2Dis = false

    },
    //控制继续步骤2的disabled
    connections (val2) {
      let val = this.containers
      val.length === 0 ? this.goStep2Dis = true : this.goStep2Dis = false
      let sign = 0
      val.map((one, index) => {
        if (one.dataSourceId !== 'Hive') {
          sign = 1
          return false
        }
      })
      if (val.length === 0) this.goStep2Dis = true
      else if (val.length === 1) this.goStep2Dis = false
      sign === 1 && val.length > 1 && val2.length === 0 ? this.goStep2Dis = true : this.goStep2Dis = false
    },
    //根据数据源的选择来获取表数据
    cDataSource (val) {
      if (val !== 'Hive' && val !== '') {
        let params = { id: val, name: '' };
        datasource(params).then(res => {
          if (!res.status) {
            let arr = []
            res.map(one => {
              let json = { value: one }
              arr.push(json)
            })
            this.restaurants = arr
          }
          else {
            this.$message.error('后台出错')
            this.restaurants = []
          }

        })
      }
      else {
        this.restaurants = [...this.HiveTable]
      }
      this.tableChoosed = ''
    },
    //转换模式选择
    filterType (val) {
      if (val) {
        this.$message({ type: 'success', message: '已进入高级模式' })
        this.sqlDisabled = true
      } else {
        this.$message({ type: 'success', message: '已进入简单模式' })
        this.sqlDisabled = false
      }
    }
  },
  methods: {
    //删除函数历史
    removeHistory(){

    },
    //清空所有TAB与连接关系
    cleanTab () {
      for (let i = this.containers.length - 1; i >= 0; i--) {
        this.removeContainer(i, false)
      }
      this.$message.success('已清空所有表')
      // this.containers = [];
      // this.connections = [];
      // this.pzArr = [];

    },
    //去往父组件(注册于组件)
    goToFather () {
      let data = { contaners: this.filterCon(this.containers), connections: this.connections, resultColumsRel: this.resultColumsRel, resultColums: this.resultColums, SQLStr: this.SQLStr, transformData: this.getScript(this.transformData), cDataSource: this.cDataSource }
      this.$emit('getVirData', data)
      console.log(this.getScript(this.transformData))
    },
    //有parent情况拼接script
    getScript (obj) {
      if (obj.parent !== undefined) {
        let str
        str = this.scriptStart.substring(0, this.scriptStart.indexOf('df = df.limit(1000)', 'df = df.limit(1000)'.length - 1)) + `${this.scriptArr.join('\n')}` + `\ndf`
        obj.script = str
        return obj
      }
      else {
        return obj
      }
    },
    //返回于子组件
    beforeShowCli () {
      this.$emit('beforeClick')
    },
    // 刷新所有表名
    inputSelect (val) {
      const { isRefresh } = val
      if (isRefresh) {
        const cDataSource = this.cDataSource
        if (cDataSource === 'Hive') {
          this.getHiveTable()
        } else {
          this.cDataSource = ''
          setTimeout(() => {
            this.cDataSource = cDataSource
          }, 100)
          console.log(cDataSource)
        }
        this.tableChoosed = ''
        this.$message.success('操作成功！')
      }
    },
    editSQL () {
      console.log('编辑sql')
    },
    //继续步骤
    goStep2 () {
      this.getAllConnection()
      setTimeout(this.step2DataMes, 1000)
    },
    //继续步骤的数据处理
    step2DataMes () {
      getScripts(this.scriptInfo).then(res => {
        this.SQLStr = res.data
        let params = null
        const arrPP = []
        this.historyVisible = false
        this.containers.forEach((one, index) => {
          console.log(this.Type)
          this.Type.forEach((two) => {
            if (one.dataSourceId === two.id && one.dataSourceId !== 'Hive') {
              arrPP.push(two)
            }
          })
        })
        //        let testStr = `import org.apache.spark.sql._
        // val tbl10 = sqlContext.table("db_test.tab_people1").alias("tbl10")
        // val tbl11 = datasourceProvider.getTableFromDatasource("demo001.tab_test001", "4951557f-ef85-4ff8-98af-42b21f84154c", sqlContext).alias("tbl11")
        // var df = tbl10.join(tbl11, tbl11.col("name").equalTo(tbl10.col("name")), "inner").select(tbl10.col("name").as("tab_people1_name"), tbl10.col("age"), tbl11.col("id").as("id", new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build()), tbl11.col("name").as("tab_test001_name", new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build()), tbl11.col("day").as("day", new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build()), tbl11.col("city").as("city", new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build()))
        // df = df.limit(1000)
        // df
        // `
        params = { datasources: arrPP, policies: [], script: this.SQLStr }
        console.log(this.SQLStr)

        this.transformDetails = params

        this.scriptArr = []
        this.scriptStart = this.SQLStr

        this.step1 = false
        this.loadding = true
        transform(params).then(res => {
          if (res.status && res.status === 'ERROR') {
            this.$message({
              type: 'error',
              message: '后端错误，请进行排查'
            })
            this.loadding = false
          }
          else {
            this.resultColums = res.results.columns.map(one => {
              return { key: one.hiveColumnLabel, value: one.hiveColumnLabel }
            })
            this.resultColumsRel = res.results.columns
            this.resultTableID = res.table
            this.transformDetails = params
            this.transformData = params
            if (res.results.rows) {
              let columns = [...res.results.columns]
              const rows = [...res.results.rows]
              columns = columns.map(one => {
                return one.hiveColumnLabel
              })
              this.columnsData = [...columns]
              const arrN = []
              rows.forEach(one => {
                const json = {}
                for (let i = 0; i < columns.length; i++) {
                  json[columns[i]] = one[i]
                }
                arrN.push(json)
              })
              this.tableData = arrN
              this.loadding = false
              this.historySQL = [{ filterSQL:'回到原始状态', tableData: arrN, tableColums: this.columnsData }]
              this.scriptArr = []
              this.filterSQL = ''
            }

            else {
              this.getDable(res.table)
            }
          }
        })
      })
    },
    //transform递归 获取表
    getDable (params) {
      this.loadding = true
      transform2(params).then(res => {
        if (res.progress || res.progress === 0) {
          const that = this
          setTimeout(that.getDable(params), 3000)
        }
        else {
          let columns = [...res.results.columns]
          const rows = [...res.results.rows]
          columns = columns.map(one => {
            return one.hiveColumnLabel
          })
          this.columnsData = [...columns]
          const arrN = []
          rows.forEach(one => {
            const json = {}
            for (let i = 0; i < columns.length; i++) {
              json[columns[i]] = one[i]
            }
            arrN.push(json)
          })
          this.tableData = arrN
          this.loadding = false
          console.log(arrN)
          console.log(this.columnsData)
        }
      })
    },
    //全选字段
    handleCheckAllChange (index, val) {
      const arr = this.containers[index].fields.map(one => { return one.name })
      console.log(arr)
      console.log(this.containers[index])
      console.log(val)
      this.containers[index].checked = val ? this.containers[index].checked = arr : this.containers[index].checked = [];
      this.isIndeterminate = false
    },
    //单个字段选择
    handleCheckedCitiesChange (index, value) {
      console.log(this.containers[index])
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.containers[index].fields.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.containers[index].fields.length;
    },
    //获取所有数据源
    getType () {
      console.log(this.dataBaseArr)
      if (this.dataBaseArr) {
        // getDataSource().then(res => {
        //   res.map(one => {
        //     const filterArr = ["Oracle", "DB2", "SqlServer", "PostgreSQL", "MySQL", "HIVE"];
        //     filterArr.map(filterOne => {
        //       if (one.type === filterOne) {
        //         getDataSourceById(one.id).then(data => {
        //           const arr = [{ name: 'Hive', id: 'Hive' }]
        //            data.map(one => {
        //             arr.push(one)
        //           })
        //           this.Type = arr
        //           console.log('----------get')

        //           console.log(this.Type)
        //         })
        //       }
        //     })

        //   })
        // })
        this.Type = this.dataBaseArr
      }


      // if (!this.dataBaseArr) {
      //   getUserDatasource().then(res => {
      //     const arr = [{ name: 'Hive', id: 'Hive' }]
      //     res.map(one => {
      //       arr.push(one)
      //     })
      //     this.Type = arr
      //     console.log('----------get')
      //     console.log(this.Type)
      //   }).catch()
      // }


    },
    //获取HIVE类型表名
    getHiveTable () {
      getHiveTables().then(res => {
        const arr = []
        res.map(one => {
          const json = { value: one }
          arr.push(json)
        })
        this.HiveTable = arr
      })
    },
    // 表搜索(HIVE和非HIVE用不同的返回数据)
    querySearch (queryString, cb) {
      let restaurants;
      if (this.cDataSource === 'Hive') {
        restaurants = [...this.HiveTable]
      } else {
        restaurants = [...this.restaurants]
      }

      console.log(restaurants)
      let results;
      if (queryString) {
        const arr = [];
        restaurants.forEach(one => {
          if (one.value.indexOf(queryString) > -1) {
            arr.push(one)
          }
        })
        results = arr
        console.log(results)
      } else {
        results = restaurants
      }
      results.length === 0 && (results = [{ value: '暂无数据，请点击刷新', isRefresh: true }]) // 用户没有数据表，点击刷新
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //初始化jsplumb
    setJsplumb () {
      const that = this;
      this.jsPlumb = jsPlumb.getInstance(
        that.jsPlumbPz
      ); // jsPlumb默认是注册在浏览器的窗口（window）的，为整个页面提供静态实例。你也可以单独实例化，使用getInstance 模块
      let allConn = this.jsPlumb.getAllConnections()
      this.$nextTick(function () {
        this.jsPlumb.bind('beforeDrop', function (conn) {
          console.log(conn)
          console.log(allConn)
          let sign = 0
          allConn.forEach(el => {
            if ((el.sourceId === conn.sourceId && el.targetId === conn.targetId) || (el.sourceId === conn.targetId && el.targetId === conn.sourceId) || (el.targetId === conn.sourceId && el.sourceId === conn.targetId)) {
              console.log(111)
              sign = 1
              return false
            }
          })
          if (sign === 1) {
            that.$message.error('不能多次关联')
            return false
          }

          that.linkModal = true;
          that.conn = conn;
          let targetIndex = conn['targetId'].split('|')[1]
          let sourceIndex = conn['sourceId'].split('|')[1]
          that.chooseTargetKey = that.containers[targetIndex]
          that.chooseTargetKey.sName = conn['targetId']
          that.chooseSourceKey = that.containers[sourceIndex]
          that.chooseSourceKey.sName = conn['sourceId']
          that.targetKey = that.chooseTargetKey.fields[0].name
          that.sourceKey = that.chooseSourceKey.fields[0].name

          //  that.title = `连接详情从 ${that.chooseTargetKey.schemaName + '.' + that.chooseTargetKey.name} 到 ${that.chooseSourceKey.schemaName + '.' + that.chooseSourceKey.name}`
          that.title = `连接详情从 ${that.chooseSourceKey.schemaName + '.' + that.chooseSourceKey.name}到 ${that.chooseTargetKey.schemaName + '.' + that.chooseTargetKey.name} `
          return true
        })
        this.jsPlumb.bind("connectionDetached", function (conn, originalEvent) {
          that.$message({
            type: 'success',
            message: '已删除连接'
          })
          that.pzArr.forEach((el, index) => {
            el.sourceName === conn.sourceId ? that.pzArr.splice(index, 1) : ''
          })
          that.getAllConnection();
          that.jsPlumb.detach(conn);
        });
      })
    },
    //添加一张表
    addTable () {
      if (this.cDataSource === 'Hive') {
        const params = { one: this.tableChoosed.split('.')[0], two: this.tableChoosed.split('.')[1] }
        baseInfo(params).then(res => {
          if (res === null) {
            this.$message({
              type: 'error',
              message: '该表不存在'
            })
          }
          else {
            let data = res
            data['checked'] = res.fields.map(one => one.name)
            data['checkAll'] = true
            data['dataSourceId'] = this.cDataSource
            if (this.cDataSource === 'Hive') {
              data['dataSourceType'] = 'Hive'
            }
            else {
              this.Type.forEach(el => {
                if (el.id === this.cDataSource) {
                  data['dataSourceType'] = el.type
                }
              })
            }

            this.containers.push(data)
            var that = this;
            this.$nextTick(function () {
              this.jsPlumb.draggable($('.draggle-div'), {
                containment: true
              })
              this.jsPlumb.addEndpoint(res.name + "|" + (that.containers.length - 1), {
                anchor: ['Top', 'Bottom']
              }, that.exampleGreyEndpointOptions);
              this.jsPlumb.addEndpoint(res.name + "|" + (that.containers.length - 1), {
                anchor: ['Right', 'Left']
              }, that.exampleGreyEndpointOptions);
              // this.jsPlumb.addEndpoint(res.name + "|" + (that.containers.length - 1), {
              //   anchor: ['Top', 'Right', 'Bottom', 'Left']
              // }, that.exampleGreyEndpointOptions);
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '该表不存在'
          })
        })
      } else {
        const params = { id: this.cDataSource, tableName: this.tableChoosed.split('.')[1], schema: this.tableChoosed.split('.')[0] }
        datasourceTable(params).then(res => {
          if (res === null) {
            this.$message({
              type: 'error',
              message: '该表不存在'
            })
          }
          else {
            let data = res
            data['checked'] = res.fields.map(one => one.name)
            data['checkAll'] = true
            data['dataSourceId'] = this.cDataSource
            if (this.cDataSource === 'Hive') {
              data['dataSourceType'] = 'Hive'
            }
            else {
              this.Type.forEach(el => {
                if (el.id === this.cDataSource) {
                  data['dataSourceType'] = el.type
                }
              })
            }
            this.containers.push(data)
            var that = this;
            this.$nextTick(function () {
              this.jsPlumb.draggable($('.draggle-div'), {
                containment: true
              })
              this.jsPlumb.addEndpoint(res.name + "|" + (that.containers.length - 1), {
                anchor: ['Top', 'Bottom']
              }, that.exampleGreyEndpointOptions);
              this.jsPlumb.addEndpoint(res.name + "|" + (that.containers.length - 1), {
                anchor: ['Right', 'Left']
              }, that.exampleGreyEndpointOptions);
              // this.jsPlumb.addEndpoint(res.name + "|" + (that.containers.length - 1), {
              //   anchor: ['Top', 'Right', 'Bottom', 'Left']
              // }, that.exampleGreyEndpointOptions);
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '该表不存在'
          })
        })
      }
      /*      let json =[...this.ttt1]
            for(let value of json){
                if(value.name===this.tableChoosed){
                    this.containers.push(value)
                }
            }*/
      console.log(this.containers)
      this.tableChoosed = ''

    },
    //删除一张表
    removeContainer (index, boolean) {
      this.jsPlumb.deleteConnectionsForElement(this.containers[index].name + "|" + index)
      this.jsPlumb.removeAllEndpoints(this.containers[index].name + "|" + index);
      this.jsPlumb.remove(this.containers[index].name + "|" + index)
      this.pzArr.forEach((el, index) => {
        this.containers[index].id === el.sourceId || this.containers[index].id === el.targetId ? this.pzArr.splice(index, 1) : ''
      })
      boolean ? this.containers[index].status = 1 : this.containers.splice(index, 1)
    },
    filterCon (params) {
      let arr = []
      params.forEach(one => {
        if (!one.status) {
          arr.push(one)
        }
      })
      return arr
    },
    //获取script
    getAllConnection () {
      let arr1 = this.jsPlumb.getAllConnections()
      console.log(arr1)
      const result = this.handleTable()
      console.log('-----------------------------------处理以后完成以后的------result')
      console.log(result);
      let arr2 = this.containers
      let arr3 = [];
      let obj = {};
      let arr4 = [];
      arr1.forEach((one, index) => {
        let json = { source: arr2[parseInt(one.sourceId.split('|')[1])], target: arr2[parseInt(one.targetId.split('|')[1])] }
        arr3.push(json)
      })
      arr2.map((el, index1) => {
        arr1.forEach((one, index2) => {
          if (index1 === parseInt(one.targetId.split('|')[1])) {
            el.sourceId = arr2[parseInt(one.sourceId.split('|')[1])].id
          }
          if (index1 === parseInt(one.sourceId.split('|')[1])) {
            el.targetId = arr2[parseInt(one.targetId.split('|')[1])].id
          }
        })
        return el
      })
      // let Arr = []
      // let TransArr2 = [...arr2]

      arr2.forEach(el0 => {
        let colsArr = []
        el0.checked.forEach(el => {
          el0.fields.map(el2 => {
            if (el === el2.name) {
              colsArr.push(el2)
            }
          })
        })
        el0.cols = colsArr
      })

      // Arr = toTreeData(TransArr2, {
      //   id: 'id',
      //   parentId: 'sourceId',
      //   name: 'name',
      //   rootId: undefined
      // })
      console.log('***********************************************************')
      console.log(arr2)
      console.log(this.pzArr)
      let pzArr = [...this.pzArr]
      pzArr = pzArr.map(el => {
        if (el.addType === 'Inner Join') {
          el.addType = 'inner'
        }
        else if (el.addType === 'Left Join') {
          el.addType = 'left'
        }
        else if (el.addType === 'Right Join') {
          el.addType = 'right'
        }
        return el
      })
      let script = {
        tableInfo: this.filterCon(arr2),
        tableRelations: pzArr
      }
      this.scriptInfo = script
      console.log(arr3)
      this.connections = arr3
      console.log(this.scriptInfo)
      // 有连线str拼接
      // if (arr1.length !== 0) {

      //   this.containers.forEach(one => {
      //     if (one.dataSourceId !== 'Hive') {
      //       sign = 1  //sign等于1时执行脚本查询
      //       return false
      //     }
      //     else {
      //       sign = 0 //sign等于0时执行普通sql查询
      //     }
      //   })
      //   // 普通sql查询
      //   if (sign === 0) {
      //     let str = 'SELECT '
      //     let arr_1 = []
      //     let arr_2 = []
      //     let str_1 = '';
      //     // 获取sqlStr
      //     const sqlStr = this.handleSqlStr(result, arr3, true)
      //     /*  for (let i = 0; i < arr3.length; i++) {
      //       let tab1 = 'tab1' + i + '.'
      //       let arr = arr3[i].source.checked.map(one => {
      //         return tab1 + '`' + `${one}` + '`' + ` AS \`${arr3[i].source.name}_${one}\``
      //       })
      //       arr_1.push(arr)
      //       let tab2 = 'tab2' + i + '.'
      //       let arr2 = arr3[i].target.checked.map(one => {
      //         return tab2 + '`' + `${one}` + '`' + ` AS \`${arr3[i].target.name}_${one}\``
      //       })
      //       arr_2.push(arr2)
      //       str_1 += " " + this.addType + ' ' + '`' + `${arr3[i].target.schemaName}` + '`' + '.' + '`' + `${arr3[i].target.name}` + '`' + 'tab2' + i + ' ON ' + 'tab2' + i + '.' + '`' + `${this.targetKey}` + '`' + '=' + 'tab1' + i + '.' + '`' + `${this.sourceKey}` + '`'
      //     } */
      //     console.log('--------------------拼接的sql的str')
      //     console.log(sqlStr);
      //     // str += sqlStr + " FROM " + '`' + `${arr3[0].source.schemaName}` + '`' + '.' + '`' + `${arr3[0].source.name}` + '`' + 'tab1' + +' ' + str_1
      //     const strN = `import org.apache.spark.sql._\nvar df = sqlContext.sql("${sqlStr}")\ndf = df.limit(1000)\ndf`
      //     console.log('--------------------拼接的sql的str---------完整版')
      //     console.log(strN);
      //     this.SQLStr = strN
      //   } else if (sign === 1) {
      //     // 脚本查询
      //     // let arrL = [...this.containers]
      //     // let str_1T = []
      //     // let str_2T = [];
      //     // arrL.forEach((one, index) => {
      //     //   let str_1;
      //     //   if (one.dataSourceId === 'Hive') {
      //     //     str_1 = `var tbl0${index} = sqlContext.table("${one.schemaName}.${one.name}").alias("tbl0${index}") `
      //     //   }
      //     //   else {
      //     //     str_1 = `var tbl0${index} = datasourceProvider.getTableFromDatasource("${one.schemaName}.${one.name}", "${one.dataSourceId}", sqlContext).alias("tbl0${index}")`
      //     //   }
      //     //   str_1T.push(str_1)

      //     // })
      //     // this.connections.forEach((one, index) => {
      //     //   let str_2;
      //     //   let str_3 = [];
      //     //   let str_4 = [];
      //     //   console.log(this.connections)
      //     //   console.log(this.pzArr)
      //     //   let type = this.pzArr[index].addType
      //     //   if (type === 'Inner Join') {
      //     //     type = 'inner'
      //     //   }
      //     //   else if (type === 'Left Join') {
      //     //     type = 'left_outer'
      //     //   }
      //     //   else if (type === 'Right Join') {
      //     //     type = 'right outer'
      //     //   }
      //     //   one.source.checked.forEach(one_ => {
      //     //     let str
      //     //     if (one.source.dataSourceId === 'Hive') {
      //     //       str = `tbl${index}0.col("${one_}").as("${one_}")`
      //     //     }
      //     //     else {
      //     //       str = `tbl${index}0.col("${one_}").as("${one_}",new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build())`
      //     //     }
      //     //     str_3.push(str)
      //     //   })
      //     //   one.target.checked.forEach(one_ => {
      //     //     let str
      //     //     let name = one_
      //     //     one.source.checked.forEach(nnn => {
      //     //       if (one_ === nnn) name = `${one.target.name}_${one_}`
      //     //     })
      //     //     if (one.target.dataSourceId === 'Hive') {
      //     //       str = `tbl${index}1.col("${one_}").as("${name}")`
      //     //     }
      //     //     else {
      //     //       str = `tbl${index}1.col("${one_}").as("${name}",new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build())`

      //     //     }
      //     //     str_4.push(str)
      //     //   })
      //     //   str_2 = `tbl${index}0.join(tbl${index}1,tbl${index}1.col("${this.targetKey}").equalTo(tbl${index}0.col("${this.sourceKey}")), "${type}").select(${str_3.join()},${str_4.join()})`
      //     //   str_2T.push(str_2)
      //     // })
      //     // let str = `import org.apache.spark.sql._\n${str_1T.join('\n')}\nvar df = ${str_2T.join(' ')}\ndf = df.limit(1000)\ndf\n`

      //   }
      // } else {
      //   // 无连线str拼接
      //   let arr2 = [...this.containers]
      //   let sign;
      //   arr2.forEach(one => {
      //     if (one.dataSourceId !== 'Hive') {
      //       sign = 1  // sign等于1时执行脚本查询
      //       return false
      //     }
      //     else {
      //       sign = 0 // sign等于2时执行普通sql查询
      //     }
      //   })
      //   //普通sql查询
      //   if (sign === 0) {
      //     let arr3 = [];
      //     let arr4 = [];
      //     let str;
      //     const sqlStr = this.handleSqlStr(result, arr2, false)
      //     /* arr2.forEach((one, index) => {
      //       let schemaName = one.schemaName
      //       let tableName = one.name
      //       one.checked.forEach(two => {
      //         arr3.push(` tb11${index}.\`${two}\` AS \`${tableName}_${two}\` `)
      //       })
      //       arr4.push(` \`${schemaName}\`.\`${tableName}\` tb11${index} `)
      //     });
      //     str = `SELECT ${arr3.join()} FROM ${arr4.join()}` */
      //     console.log('---------------------无限连接拼接的sql')
      //     console.log(sqlStr)
      //     let strN = `import org.apache.spark.sql._\nvar df = sqlContext.sql("${sqlStr}")\ndf = df.limit(1000)\ndf`
      //     this.SQLStr = strN
      //     console.log(strN)
      //   }
      //   // 脚本查询
      //   else if (sign === 1) {
      //     let arrL = [...this.containers]
      //     let str_1T = []
      //     let str_2T = [];
      //     let joinStr = 'tbl00';
      //     arrL.forEach((one, index) => {
      //       if (index > 0) {
      //         joinStr += `.join(tbl0${index})`
      //       }
      //       let str_1;
      //       if (one.dataSourceId === 'Hive') {
      //         str_1 = `var tbl0${index} = sqlContext.table("${one.schemaName}.${one.name}").alias("tbl0${index}") `
      //       } else {
      //         str_1 = `var tbl0${index} = datasourceProvider.getTableFromDatasource("${one.schemaName}.${one.name}", "${one.dataSourceId}", sqlContext).alias("tbl0${index}")`
      //       }
      //       str_1T.push(str_1)

      //       one.checked.forEach(one_ => {
      //         let str
      //         if (one.dataSourceId === 'Hive') {
      //           str = `tbl0${index}.col("${one_}").as("${one_}")`//${one.name}_
      //         }
      //         else {
      //           str = `tbl0${index}.col("${one_}").as("${one_}",new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build())`
      //         }
      //         str_2T.push(str)
      //       })
      //     })
      //     let strN = `import org.apache.spark.sql._\n${str_1T.join('\n')}\nvar df = ${joinStr}.select(${str_2T.join(',')})\ndf = df.limit(1000)\ndf\n`
      //     this.SQLStr = strN
      //   }
      // }

    },
    getAllConnection2 () {
      let arr1 = this.jsPlumb.getAllConnections()
      console.log(arr1)
      const result = this.handleTable()
      console.log('-----------------------------------处理以后完成以后的------result')
      console.log(result);
      // 有连线str拼接
      if (arr1.length !== 0) {
        let arr2 = this.containers
        let arr3 = [];
        arr1.forEach(one => {
          let json = { source: arr2[parseInt(one.sourceId.split('|')[1])], target: arr2[parseInt(one.targetId.split('|')[1])] }
          arr3.push(json)
        })
        console.log(arr3)
        this.connections = arr3
        console.log(this.connections)
        let sign;
        this.containers.forEach(one => {
          if (one.dataSourceId !== 'Hive') {
            sign = 1  //sign等于1时执行脚本查询
            return false
          }
          else {
            sign = 0 //sign等于0时执行普通sql查询
          }
        })
        // 普通sql查询
        if (sign === 0) {
          let str = 'SELECT '
          let arr_1 = []
          let arr_2 = []
          let str_1 = '';
          // 获取sqlStr
          const sqlStr = this.handleSqlStr(result, arr3, true)
          /*  for (let i = 0; i < arr3.length; i++) {
            let tab1 = 'tab1' + i + '.'
            let arr = arr3[i].source.checked.map(one => {
              return tab1 + '`' + `${one}` + '`' + ` AS \`${arr3[i].source.name}_${one}\``
            })
            arr_1.push(arr)
            let tab2 = 'tab2' + i + '.'
            let arr2 = arr3[i].target.checked.map(one => {
              return tab2 + '`' + `${one}` + '`' + ` AS \`${arr3[i].target.name}_${one}\``
            })
            arr_2.push(arr2)
            str_1 += " " + this.addType + ' ' + '`' + `${arr3[i].target.schemaName}` + '`' + '.' + '`' + `${arr3[i].target.name}` + '`' + 'tab2' + i + ' ON ' + 'tab2' + i + '.' + '`' + `${this.targetKey}` + '`' + '=' + 'tab1' + i + '.' + '`' + `${this.sourceKey}` + '`'
          } */
          console.log('--------------------拼接的sql的str')
          console.log(sqlStr);
          // str += sqlStr + " FROM " + '`' + `${arr3[0].source.schemaName}` + '`' + '.' + '`' + `${arr3[0].source.name}` + '`' + 'tab1' + +' ' + str_1
          const strN = `import org.apache.spark.sql._\nvar df = sqlContext.sql("${sqlStr}")\ndf = df.limit(1000)\ndf`
          console.log('--------------------拼接的sql的str---------完整版')
          console.log(strN);
          this.SQLStr = strN
        } else if (sign === 1) {
          // 脚本查询
          let arrL = [...this.containers]
          let str_1T = []
          let str_2T = [];
          arrL.forEach((one, index) => {
            let str_1;
            if (one.dataSourceId === 'Hive') {
              str_1 = `var tbl0${index} = sqlContext.table("${one.schemaName}.${one.name}").alias("tbl0${index}") `
            }
            else {
              str_1 = `var tbl0${index} = datasourceProvider.getTableFromDatasource("${one.schemaName}.${one.name}", "${one.dataSourceId}", sqlContext).alias("tbl0${index}")`
            }
            str_1T.push(str_1)

          })
          this.connections.forEach((one, index) => {
            let str_2;
            let str_3 = [];
            let str_4 = [];
            console.log(this.connections)
            console.log(this.pzArr)
            let type = this.addType
            if (type === 'Inner Join') {
              type = 'inner'
            }
            else if (type === 'Left Join') {
              type = 'left_outer'
            }
            else if (type === 'Right Join') {
              type = 'right outer'
            }
            one.source.checked.forEach(one_ => {
              let str
              if (one.source.dataSourceId === 'Hive') {
                str = `tbl${index}0.col("${one_}").as("${one_}")`
              }
              else {
                str = `tbl${index}0.col("${one_}").as("${one_}",new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build())`
              }
              str_3.push(str)
            })
            one.target.checked.forEach(one_ => {
              let str
              let name = one_
              one.source.checked.forEach(nnn => {
                if (one_ === nnn) name = `${one.target.name}_${one_}`
              })
              if (one.target.dataSourceId === 'Hive') {
                str = `tbl${index}1.col("${one_}").as("${name}")`
              }
              else {
                str = `tbl${index}1.col("${one_}").as("${name}",new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build())`

              }
              str_4.push(str)
            })
            str_2 = `tbl${index}0.join(tbl${index}1,tbl${index}1.col("${this.targetKey}").equalTo(tbl${index}0.col("${this.sourceKey}")), "${type}").select(${str_3.join()},${str_4.join()})`
            str_2T.push(str_2)
          })
          let str = `import org.apache.spark.sql._\n${str_1T.join('\n')}\nvar df = ${str_2T.join(' ')}\ndf = df.limit(1000)\ndf\n`
          this.SQLStr = str
        }
      } else {
        // 无连线str拼接
        let arr2 = [...this.containers]
        let sign;
        arr2.forEach(one => {
          if (one.dataSourceId !== 'Hive') {
            sign = 1  // sign等于1时执行脚本查询
            return false
          }
          else {
            sign = 0 // sign等于2时执行普通sql查询
          }
        })
        //普通sql查询
        if (sign === 0) {
          let arr3 = [];
          let arr4 = [];
          let str;
          const sqlStr = this.handleSqlStr(result, arr2, false)
          /* arr2.forEach((one, index) => {
            let schemaName = one.schemaName
            let tableName = one.name
            one.checked.forEach(two => {
              arr3.push(` tb11${index}.\`${two}\` AS \`${tableName}_${two}\` `)
            })
            arr4.push(` \`${schemaName}\`.\`${tableName}\` tb11${index} `)
          });
          str = `SELECT ${arr3.join()} FROM ${arr4.join()}` */
          console.log('---------------------无限连接拼接的sql')
          console.log(sqlStr)
          let strN = `import org.apache.spark.sql._\nvar df = sqlContext.sql("${sqlStr}")\ndf = df.limit(1000)\ndf`
          this.SQLStr = strN
          console.log(strN)
        }
        // 脚本查询
        else if (sign === 1) {
          let arrL = [...this.containers]
          let str_1T = []
          let str_2T = [];
          let joinStr = 'tbl00';
          arrL.forEach((one, index) => {
            if (index > 0) {
              joinStr += `.join(tbl0${index})`
            }
            let str_1;
            if (one.dataSourceId === 'Hive') {
              str_1 = `var tbl0${index} = sqlContext.table("${one.schemaName}.${one.name}").alias("tbl0${index}") `
            } else {
              str_1 = `var tbl0${index} = datasourceProvider.getTableFromDatasource("${one.schemaName}.${one.name}", "${one.dataSourceId}", sqlContext).alias("tbl0${index}")`
            }
            str_1T.push(str_1)

            one.checked.forEach(one_ => {
              let str
              if (one.dataSourceId === 'Hive') {
                str = `tbl0${index}.col("${one_}").as("${one_}")`//${one.name}_
              }
              else {
                str = `tbl0${index}.col("${one_}").as("${one_}",new org.apache.spark.sql.types.MetadataBuilder().putString("comment", "").build())`
              }
              str_2T.push(str)
            })
          })
          let strN = `import org.apache.spark.sql._\n${str_1T.join('\n')}\nvar df = ${joinStr}.select(${str_2T.join(',')})\ndf = df.limit(1000)\ndf\n`
          this.SQLStr = strN
        }
      }
    },
    // 处理选择的表字段信息
    handleTable () {
      console.log('------------------------处理表信息')
      console.log(this.containers)
      const tableInfo = [...this.containers]
      const tableFields = []; // tName:[filed]
      let result = {}
      let index = 10;
      if (tableFields.length === 1) {
        for (const table of tableInfo) {
          result[`${table.schemaName}.${table.name}`] = []
          for (const field of table.checked) {
            result[`${table.schemaName}.${table.name}`].push(`\`${field}\``)
          }
        }
      } else {
        for (const table of tableInfo) {
          tableFields.push({ tName: table.name, fields: table.checked, alis: `tb${index++}` })
        }
        console.log('--------------处理后的结果')
        console.log(tableFields);
        result = this.handleTableFieldPrefix([...tableFields])
      }
      return result;
    },
    // 给表中相同的字段添加前缀和查询的表名
    handleTableFieldPrefix (tableFields) {
      const originalTable = [...tableFields]; // 原始的表信息
      const result = {}
      console.log('----------------------------------handleTableFieldPrefix')
      for (const table of tableFields) {
        result[table.tName] = []
        const otherTableFields = this.getTableOther(originalTable, table.tName)
        console.log('==============================otherTableFields')
        console.log(otherTableFields)
        for (const field of table.fields) {
          if (otherTableFields.includes(field)) {
            result[table.tName].push(`\`${table.alis}\`.\`${field}\` AS \`${table.alis}_${table.tName}_${field}\``)
          } else {
            result[table.tName].push(`\`${field}\``)
          }
        }
      }
      console.log('----------------------------加了别名的字段')
      console.log(result)
      return result;
    },
    // 获取当前循环以外的表
    getTableOther (tableFields, name) {
      const result = [];
      for (const table of tableFields) {
        if (table.tName !== name) {
          const fields = table.fields
          result.push(...fields)
        }
      }
      return result;
    },
    // 处理需要查询的字符串
    handleSqlStr (obj, table, state) {
      console.log('----------------------0000000000000000')
      console.log(table)
      console.log(obj)
      let sKey = ''
      let tKey = ''
      const tableArr = Object.keys(table[0])
      console.log(tableArr)
      // 判断是有关联
      if (tableArr.length > 1 && state) {
        sKey = this.sourceKey
        tKey = this.targetKey
        console.log(this.targetKey)
        console.log(this.sourceKey)
        // 判断关联的表是否取别名
        if (table[0].target.checked.includes(this.sourceKey)) {
          sKey = `${this.sourceKey}`
        }
        if (table[0].source.checked.includes(this.targetKey)) {
          tKey = `${this.targetKey}`
        }
      }
      let sqlStr = 'SELECT '
      let fieldArr = []
      for (const key in obj) {
        fieldArr = [...fieldArr, ...obj[key]]
      }
      sqlStr += fieldArr.join(',')
      if (tableArr.length > 1 && state) {
        sqlStr += ` FROM \`${table[0].source.schemaName}\`.\`${table[0].source.name}\` tb10 ${this.addType} \`${table[0].target.schemaName}\`.\`${table[0].target.name}\` tb11 on tb10.\`${sKey}\` =  tb11.\`${tKey}\``
      } else {
        const tbInfo = []
        for (const tb of table) {
          tbInfo.push(`\`${tb.schemaName}\`. \`${tb.name}\``)
        }
        sqlStr += ' FROM ' + tbInfo.join(',')
      }
      return sqlStr;
    },
    // 确定关联
    submit () {
      console.log("***********************************")
      console.log(this.chooseSourceKey)
      console.log(this.chooseTargetKey)
      this.pzArr.push({ addType: this.addType, sourceKey: this.sourceKey, targetKey: this.targetKey, sourceId: this.chooseSourceKey.id, targetId: this.chooseTargetKey.id, sourceName: this.chooseSourceKey.sName, targetName: this.chooseTargetKey.sName })
      this.linkModal = false;
      this.booleanConnect = true;
      this.isShowSure = true;
      this.$message({
        type: 'success',
        message: '关联成功'
      })
      this.getAllConnection()
      console.log(this.jsPlumb.getAllConnections())
      console.log(this.containers)
    },
    // 取消关联
    close () {
      this.pzArr.splice(this.pzArr.length - 1, 1)
      this.linkModal = false;
      this.booleanConnect = false;
      this.$message({
        type: 'info',
        message: '已取消关联'
      })
      this.jsPlumb.deleteConnectionsForElement(this.conn.sourceId, this.conn.targetId)
      this.getAllConnection()
    },
    // 转换条件的显示
    filterShow (num) {
      this.filterType === 1 ? this.filterPz[num].visible = true : this.filterSQL = this.filterPz[num].defaultSql
    },
    // 转换配置模态框
    filterPzSubmit (num) {
      console.log(num)
      this.$refs[`dialog${num}`].validate((valid) => {
        if (valid) {
          switch (num) {
            case 0:
              let groupByArr = [];
              this.filterPz[0].form.columnsArr.map(one => { groupByArr.push(one.value) })
              let aggStrArr = [];
              this.filterPz[0].form.aggArr.forEach((one, index) => {
                let str = `${one.addType}("${one.columns}").as("${one.otherName}")`
                aggStrArr.push(str)
              })
              this.filterSQL = `groupBy(${groupByArr.join()}).agg(${aggStrArr.join()})`
              break;
            case 1:
              let whenArr = []

              this.filterPz[1].form.when.forEach(one => {
                let key = one.row + one.sign + one.num
                whenArr.push(`when(${key},'${one.value}')`)
              })
              this.filterSQL = `${whenArr.join('.')}.otherwise('${this.filterPz[1].form.otherwise}').as('${this.filterPz[1].form.as}')`
              break;
            case 2:
              let groupByArr2 = [];
              this.filterPz[2].form.groupBy.map(one => { groupByArr2.push(one.value) })
              let pivot = this.filterPz[2].form.pivot;
              let aggStrArr2 = [];
              this.filterPz[2].form.aggArr.forEach((one, index) => {
                let str = `${one.addType}("${one.columns}")`
                aggStrArr2.push(str)
              })
              this.filterSQL = `groupBy(${groupByArr2.join()}).pivot("${pivot}").agg(${aggStrArr2.join()})`
              break;
            case 3:
              this.filterSQL = `${this.filterPz[3].form.sum.key}(${this.filterPz[3].form.sum.value}).over(${this.filterPz[3].form.over.key}(${this.filterPz[3].form.over.value})).as("${this.filterPz[3].form.as}")`
              break;
          }
          this.filterPz[num].visible = false
        } else {
          console.log(valid)
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 转换操作
    toFilter () {
      let newJSON = Object.assign({}, this.transformDetails)
      // params = { datasources: arrPP, policies: [], script: this.SQLStr }
      if (this.scriptArr.length === 0) {
        newJSON.parent = { table: this.resultTableID, script: this.scriptStart }
      } else {
        let str
        str = this.scriptStart.substring(0, this.scriptStart.indexOf('df = df.limit(1000)', 'df = df.limit(1000)'.length - 1)) + `df = df.limit(1000)\n` + `${this.scriptArr.join('\n')}` + `\ndf`
        newJSON.parent = { table: this.resultTableID, script: str }
      }
      newJSON.script = `import org.apache.spark.sql._
                        var df = parent
                        df = ${ this.StrToScript(this.filterSQL)}
                        df     
                        `;
      this.transformN(newJSON)
    },
    //转换方法
    transformN (newJSON) {
      this.loadding = true
      transform(newJSON).then(res => {
        if (res.status && res.status === 'ERROR') {
          this.$message({
            type: 'error',
            message: 'SQL执行错误，请编写正确的SQL'
          })
          this.loadding = false
        }
        else {
          this.resultColums = res.results.columns.map(one => {
            return { key: one.hiveColumnLabel, value: one.hiveColumnLabel }
          })
          this.transformData = newJSON
          this.transformDetails = newJSON
          this.scriptArr.push(`df = ${this.StrToScript(this.filterSQL)}`)
          console.log(this.transformData)
          this.resultColumsRel = res.results.columns
          this.resultTableID = res.table
          if (res.results.rows) {
            let columns = [...res.results.columns]
            let rows = [...res.results.rows]
            columns = columns.map(one => {
              return one.hiveColumnLabel
            })
            this.columnsData = [...columns]
            let arrN = []
            rows.forEach(one => {
              let json = {}
              for (let i = 0; i < columns.length; i++) {
                json[columns[i]] = one[i]
              }
              arrN.push(json)
            })
            this.tableData = arrN
            this.loadding = false
            this.historySQL.push({ filterSQL: this.filterSQL, newJSON: newJSON, tableData: arrN, tableColums: this.columnsData })
            this.filterSQL = ''
            this.filterPz = [
              {
                name: '聚合函数',
                visible: false,
                defaultSql: 'groupBy(COLUMN).agg(count("COLUMN")).as("VALUE")',
                form: {
                  columnsArr: [{ value: '' }],
                  aggArr: [
                    {
                      addType: 'count',
                      columns: '',
                      otherName: ''
                    }
                  ]
                }
              },
              {
                name: '条件函数',
                visible: false,

                defaultSql: `when(CONDITION,'VALUE').otherwise('VALUE').as('VALUE')`,
                form: {
                  when: [{ key: '', value: '', row: '', sign: '>', num: 5 }],
                  otherwise: '',
                  as: ''
                }
              },
              {
                name: '透视聚合函数',
                visible: false,
                defaultSql: 'groupBy(COLUMN).pivot("COLUMN").agg(count("COLUMN"))',
                form: {
                  groupBy: [{ value: '' }],
                  pivot: [{ value: '' }],
                  aggArr: [
                    {
                      addType: 'count',
                      columns: ''
                    }
                  ]
                }
              },
              {
                name: '窗口函数',
                visible: false,
                defaultSql: 'sum(COLUMN).over(orderBy(COLUMN)).as("COLUMN")',
                form: {
                  sum: { key: 'sum', value: '' },
                  over: { key: 'orderBy', value: '' },
                  as: ''
                }
              }
            ]
          } else {
            this.getDable(res.table)
          }
        }
      })
    },
    //字符串转script
    StrToScript (str) {
      let name = str.split('(')[0]
      // 聚合函数
      if (name === 'groupBy' && str.indexOf('.pivot') === -1) {
        let groupArr = str.split(')')[0].split('(')[1].split(',')
        let aggArr = str.substring(str.indexOf('.agg') + 5, str.length - 1).split(',')
        console.log(aggArr)
        let groupStr = []
        groupArr.forEach((one, index) => {
          groupStr.push(`df("${one}")`)
        })
        let aggStr = [];
        aggArr.forEach(one => {
          aggStr.push(`functions.${one}`)
        })
        let returnStr = `df.groupBy(${groupStr.join()}).agg(${aggStr.join()})`
        return returnStr
      } else if (name === 'when') {
        // 条件函数
        let whenArr = str.substring(0, str.indexOf('.otherwise')).split('.')
        let test = str.substring(str.indexOf('.otherwise') + 12, str.indexOf('.as') - 2)
        let as = str.substring(str.indexOf('.as') + 5, str.length - 2)
        let detailsArr = []
        whenArr.forEach(one => {
          let str1 = one.substring(5, one.length - 1)
          let luoj = str1.split(',')[0]
          let value = str1.split(',')[1]
          let json = { luoj: luoj, value: value }
          detailsArr.push(json)
        })
        console.log(detailsArr)
        console.log('whenArr:' + whenArr)
        let detailsArrStr = []
        detailsArr.forEach(one => {
          let strN
          if (one.luoj.indexOf('<=') > -1) {
            strN = `when(df("${one.luoj.split('<=')[0]}").leq(functions.lit(${one.luoj.split('<=')[1]})),functions.lit("${one.value.substring(1, one.value.length - 1)}"))`
          }
          else if (one.luoj.indexOf('==') > -1) {
            strN = `when(df("${one.luoj.split('==')[0]}").equalTo(functions.lit(${one.luoj.split('==')[1]})),functions.lit("${one.value.substring(1, one.value.length - 1)}"))`
          }
          else if (one.luoj.indexOf('>=') > -1) {
            strN = `when(df("${one.luoj.split('>=')[0]}").geq(functions.lit(${one.luoj.split('>=')[1]})),functions.lit("${one.value.substring(1, one.value.length - 1)}"))`
          }
          else if (one.luoj.indexOf('>') > -1) {
            strN = `when(df("${one.luoj.split('>')[0]}").gt(functions.lit(${one.luoj.split('>')[1]})),functions.lit("${one.value.substring(1, one.value.length - 1)}"))`
          }
          else if (one.luoj.indexOf('<') > -1) {
            strN = `when(df("${one.luoj.split('<')[0]}").lt(functions.lit(${one.luoj.split('<')[1]})),functions.lit("${one.value.substring(1, one.value.length - 1)}"))`
          }
          detailsArrStr.push(strN)
        })
        const returnStr = `df.select(df("*"),functions.${detailsArrStr.join('.')}.otherwise(functions.lit("${test}")).as("${as}"))`
        return returnStr
      } else if (name === 'groupBy' && str.indexOf('.pivot') > -1) {
        // 透视聚合函数
        const groupArr = str.split(')')[0].split('(')[1].split(',')
        const aggArr = str.substring(str.indexOf('.agg') + 5, str.length - 1).split(',')
        const pStr = str.substring(str.indexOf('.pivot') + 7, str.indexOf(').agg'))
        const groupStr = []
        groupArr.forEach((one, index) => {
          groupStr.push(`df("${one}")`)
        })
        const aggStr = [];
        const aggArr_ = [];
        console.log(aggArr)
        aggArr.forEach(one => {
          const key = one.split('(')[0]
          const value = one.split('(')[1].split(')')[0]
          aggArr_.push(`${key}(df(${value}))`)
        })
        aggArr_.forEach(one => {
          aggStr.push(`functions.${one}`)
        })
        const returnStr = `df.groupBy(${groupStr.join()}).pivot(${pStr}).agg(${aggStr.join()})`
        return returnStr
      } else if (str.indexOf('.over') > -1) {
        // 窗口函数
        const sum = str.split('(')[0]
        const sumValue = str.split(')')[0].split('(')[1]
        const orderByValue = str.substring(str.indexOf('orderBy') + 8, str.indexOf(')).as'))
        const key = str.substring(str.indexOf('.as'), str.length)
        console.log(key)
        const returnStr = `df.select(df("*"), functions.${sum}(df("${sumValue}")).over(org.apache.spark.sql.expressions.Window.orderBy(df("${orderByValue}")))${key})`
        return returnStr
      }
    },
    //历史跳转
    historyJump (row) {
      // newJSON, index, filterSQL, tableData, columnsData
      // one.newJSON,index,one.filterSQL,one.tableData,one.tableColums
      const { filterSQL, tableColums, tableData } = row
      filterSQL === '回到原始状态' ? '' : this.filterSQL = filterSQL
      this.columnsData = tableColums
      this.tableData = tableData
    },
    // 历史点击事件
    historyClick () {
      console.log(this.historySQL)
      this.historyVisible = !this.historyVisible
    },
  },
  mounted () {
    this.getType();
    this.setJsplumb();
    this.getHiveTable();
    //console.log(this.$el)
  }
}
</script>