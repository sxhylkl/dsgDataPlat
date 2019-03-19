<template>
    <div class="flow-editor">
        <el-dialog
            title="流程设计"
            :fullscreen="true"
            :visible.sync="dialogVisible">
            <div>
                <iframe name="iframeId" id="iframeId" :src="nSrc" frameborder="0" v-bind:style="{ width: '100%', height: height }"></iframe>
            </div>
        </el-dialog>
    </div>

</template>
<!--404726366885117953-->
<script>
    export default {
        name: 'index',
        props: ['id'],
        data () {
            return {
                src: '/static/flow-editor/modeler.html',
                dialogVisible: false,
                height:'500px'
            }
        },
        computed:{
            nSrc:function () {
                return `${this.src}?modelId=${this.id}`
            },
        },
        created(){
            this.$nextTick(function () {
                this.height=window.innerHeight+'px'
                console.log('-------'+this.height)
            })
        }
    }
</script>

<style scoped>

</style>
