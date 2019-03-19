<template>
  <textarea ref="mycode" class="codesql" v-model="cont" :disabled="disable"
            style="width: 100%; height: 300px"></textarea>
</template>

<script>
  import 'codemirror/theme/ambiance.css'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/hint/show-hint.css'

  const CodeMirror = require('codemirror/lib/codemirror')
  require('codemirror/addon/edit/matchbrackets')
  require('codemirror/addon/selection/active-line')
  require('codemirror/mode/sql/sql')
  require('codemirror/addon/hint/show-hint')
  require('codemirror/addon/hint/sql-hint')
  export default {
    name: 'CodeMirror',
    data() {
      return {}
    },
    props: ['cont', 'disable'],
    /* watch:{
     cont:function (n,o) {
     console.log('新值')
     console.log(n)
     console.log('旧值')
     console.log(o)
     if(!n){
     this.editor.replaceSelection('')
     return
     }
     this.editor.replaceSelection(n)
     }
     },*/
    // 实时监听数据的变化
    mounted() {
      console.log('初始化')
      const mime = 'text/x-mariadb'
      // let theme = 'ambiance'//设置主题，不设置的会使用默认主题
      const editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // autofocus:true,
        // theme: theme,
        // autofocus: true,
        extraKeys: { Ctrl: 'autocomplete' } // 自定义快捷键
        /* hintOptions: {//自定义提示选项
         tables: {
         users: ['name', 'score', 'birthDate'],
         countries: ['name', 'population', 'size']
         }
         }*/
      })
      // 设置容器的宽高
      editor.setSize('auto', '320px')
      // 返回代码编译器的实例
      this.$emit('changeCodeMirror', editor)
      // 变化的时候
      /* editor.on("change",function(){
       console.log('----')
       console.log(self.cont)
       });*/
      /* //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
       editor.on('cursorActivity', function () {
       editor.showHint()
       })*/
    }
  }
</script>

<style>
  .codesql {
    font-size: 14px;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
</style>
