<template>
  <div class="ueditor-box">
    <!--下面通过传递进来的id完成初始化-->
    <div :id="randomId" type="text/plain" style="width: 100%;"></div>
  </div>
</template>


<script>
  import 'static/plugin/ueditor/ueditor.config'
  import 'static/plugin/ueditor/ueditor.all'
  import 'static/plugin/ueditor/lang/zh-cn/zh-cn.js'

  export default {
    name: 'Ueditor',
    props: {
      // 配置可以传递进来
      ueditorConfig: {}
    },
    data() {
      return {
        // 每个编辑器生成不同的id,以防止冲突
        randomId: 'editor_' + (Math.random() * 100000000000000000),
        // 编辑器实例
        instance: null
      }
    },
    // 此时--el挂载到实例上去了,可以初始化对应的编辑器了
    mounted() {
      this.initEditor()
    },

    beforeDestroy() {
      // 组件销毁的时候，要销毁 UEditor 实例
      if (this.instance !== null && this.instance.destroy) {
        this.instance.destroy()
      }
    },
    methods: {
      initEditor() {
        // dom元素已经挂载上去了
        this.$nextTick(() => {
          this.instance = UE.getEditor(this.randomId, {
            BaseUrl: '',
            UEDITOR_HOME_URL: 'static/plugin/ueditor/',
            toolbars: [
              [
                'fullscreen',
                'source',
                'undo',
                'redo',
                'bold',
                'italic',
                'removeformat',
                'formatmatch',
                'autotypeset',
                'blockquote',
                'pasteplain',
                '|',
                'forecolor',
                'backcolor',
                'insertorderedlist',
                'insertunorderedlist',
                '|',
                'selectTemplate']],
            initialFrameHeight: window.innerHeight - 450 > 200 ? window.innerHeight - 450 : 200,
            initialFrameWeight: 400,
            enableAutoSave: false,
            autoHeightEnabled: false,
            allHtmlEnabled: true,
            focus: true,
            zIndex: 10052,
            iframeCssUrl: 'static/plugin/ueditor/themes/pcframe.css'
          })
          // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
          this.instance.addListener('ready', () => {
            // UE.getEditor(this.randomId).setHeight(300)
            this.$emit('ready', this.instance)
          })
        })
      }
    }
  }
</script>

<style>
  #edui1_iframeholder {
    width: 100% !important;
  }
</style>
