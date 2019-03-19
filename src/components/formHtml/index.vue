<template>
    <!--动态html表单-->
    <div id="formData" v-if="html" v-html="html"></div>
</template>

<script>
    import { emptyHint, initValid, validForm } from '@/utils/workflow/formValid.js'

    export default {
        name: 'index',
        props: ['html', 'data','inputReadOnly'],
        created () {
            // 给表单添加验证
            this.$nextTick(function () {
                validForm()
                this.clearHint()
                this.initValid()
                this.inputValue()
            })
        },
        methods: {
            // 清空表单验证信息
            clearHint () {
                emptyHint()
            },
            // 初始化验证信息
            initValid () {
                initValid()
            },
            //  给表单赋值
            inputValue () {
                this.$nextTick(function () {
                    let self=this
                    let arr = []
                    let data={}
                    let inputs = $('input.form-control')
                    if(!inputs) return
                    inputs.each(function (i) {
                        if(self.inputReadOnly){
                            $(this).attr("readOnly","true")
                        }
                        data={}
                        data.data=self.data;
                        arr = $(this).attr('ng-model').split('.')//获取数据所在位置
                        for(let v of arr){
                          data=data[v]
                        }
                        // data ? $(this).val(data) : $(this).val('')
                        inputs[i].setAttribute("value",data);
                    })
                })
            },
            // 获取input的值
            getInputValue () {
                let self=this
                let obj = {}
                let arr = []
                let key = ''
                let inputs = $('input.form-control')
                inputs.each(function (i) {
                    inputs.each(function (i) {
                        arr = $(this).attr('ng-model').split('.')//获取数据所在位置
                        key = arr[arr.length - 1]
                        obj[key] = $(this).val()
                    })
                })
                return obj
            },
            // 判断是否通过验证
            handleInputValid () {
                let errInput = $('input.ng-invalid')
                if (errInput.length > 0) return false
                return true
            },

        }
    }
</script>

<style scoped>

</style>
