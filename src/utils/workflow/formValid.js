import { rules } from '@/utils/workflow/customValid.js'

export function validForm () {
    $(function () {
        /*$('body').on('change ', '.form-control', function (ev) {
         console.log(ev)
         let valideObj=JSON.parse($(this).attr('ab-validate'))
         console.log(valideObj)

         })*/
        //取消绑定的所有事件，避免重复绑定
        $('body').off()
        // input 框绑定失去焦点事件
        $('body').delegate('.form-control', 'change', function () {
            $(this).one('blur', function () {
                handValid($(this),false)
            })
        })
    })
}

//验证操作type:判断是blur,submit事件
function handValid (elem,type) {
    // 获取绑定的验证
    let validObj = JSON.parse(elem.attr('ab-validate'))
    // 判断验证是否为空
    if (!validObj) return false
    // 获取表单的值
    let val=elem.val()
    // 遍历所有的验证
    for (let key in validObj) {
        if(type&&key!=='required'){
            return false
        }
        if (validObj[key]) {
            let ruleInfo=handleRule(key)
            if(!ruleInfo.rule(val)){
                addHint(elem,ruleInfo.msg)
                return false
            }else {
                removeHint(elem)
            }
        }
    }
}

// 判断是否通过验证
function handleRule (key) {
    let ruleObj = rules[key]
    return ruleObj
   /* if(!ruleObj.rule(val)){
        addHint(elem,ruleObj.msg)
    }else {
        removeHint(elem)
    }*/
}

// 添加提示信息'<span class="help-block">Help block with error</span>'
function addHint (elem,msg) {
    let label=`<span class="err-msg">${msg}</span>`
    removeHint(elem)
    elem.addClass('ng-invalid')
    elem.after(label)
}

// 移除提示信息
function removeHint (elem) {
    elem.removeClass('ng-invalid')
    elem.next().remove();
}

// 清空所有提示信息
export function emptyHint () {
    let inputs = $('input.form-control')
    inputs.each(function (i) {
        $(this).removeClass('ng-invalid')
        $(this).next().remove();
    })
}

// 初始化的时候验证(提示用必填项)
export function initValid () {
    let inputs = $('input.form-control')
    inputs.each(function (i) {
        handValid($(this),true)
    })
}


