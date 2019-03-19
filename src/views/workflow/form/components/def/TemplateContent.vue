<template>
    <!--生成表单-->
    <div>
        <el-table
            :data="data"
            border
            style="width: 100%">
            <el-table-column
                prop="tableComment"
                align="center"
                label="表名">
            </el-table-column>
            <el-table-column
                prop="typeDesc"
                align="center"
                label="类型">
            </el-table-column>
            <el-table-column  align="center" label="模板">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.templateKey" placeholder="请选择">
                        <el-option
                            v-for="item in scope.row.templates"
                            :key="item.id"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'TemplateContent',
        props: ['data'],
    }
</script>

<style scoped>

</style>
