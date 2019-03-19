export const rules = {
    required: {
        rule: function (r, v, cb) {
            if (v == '' || v.length == 0) {
                cb(new Error('必填'))
            } else {
                cb()
            }
        },
        value: 'required',
        label: '必填',
        trigger: 'blur',
        msg: '必填'

    },
    number: {
        rule: function (r, v, cb) {
            if (!/^-?((\d{1,3}(,\d{3})+?|\d+)(\.\d{1,5})?)$/.test(v.trim())) {
                cb(new Error('只能输入数字'))
            } else {
                cb()
            }
        },
        value: 'number',
        label: '数字',
        trigger: 'blur',
        msg: '只能输入数字'

    },
    variable: {
        rule: function (r, v, cb) {
            if (!/^[A-Za-z_]*$/gi.test(v.trim())) {
                cb(new Error('只能是字母和下划线'))
            } else {
                cb()
            }
        },
        value: 'variable',
        label: '字母或下划线',
        trigger: 'blur',
        msg: '只能是字母和下划线'

    },
    email: {
        rule: function (r, v, cb) {
            if (!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
                .test(v.trim())) {
                cb(new Error('请输入一合法的邮箱地址'))
            }
        },
        value: 'email',
        label: 'email',
        trigger: 'blur',
        msg: '请输入一合法的邮箱地址'
    },
    url: {
        rule: function (r, v, cb) {
            if (!/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
                .test(v.trim())) {
                cb(new Error('请输入一合法的邮箱地址'))
            }
        },
        value: 'url',
        label: 'url',
        trigger: 'blur',
        msg: '请输入一合法的网址'
    },
    date: {
        rule: function (r, v, cb) {
            if (!/^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/g
                .test(v.trim())) {
                cb(new Error('请输入一合法的邮箱地址'))
            }
        },
        value: 'date',
        label: '日期',
        trigger: 'blur',
        msg: '请输入日期格式'
    },
    time: {
        rule: function (r, v, cb) {
            if (!/^(?:[01]?\d|2[0-3])(?::[0-5]?\d){2}$/g.test(v.trim())) {
                cb(new Error('请输入一合法的邮箱地址'))
            }
        },
        value: 'time',
        label: '时间',
        trigger: 'blur',
        msg: '请输入一合法的时间'
    },
    chinese: {
        rule: function (r, v, cb) {
            if (!/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(v.trim())) {
                cb(new Error('请输中文字符'))
            }
        },
        value: 'chinese',
        label: '汉字',
        trigger: 'blur',
        msg: '请输中文字符'
    },
    QQ: {
        rule: function (r, v, cb) {
            if (!/^[1-9]*[1-9][0-9]*$/i.test(v.trim())) {
                cb(new Error('请输入正确的QQ号码'))
            }
        },
        value: 'QQ',
        label: 'QQ号',
        trigger: 'blur',
        msg: '请输入正确的QQ号码'
    },
    phonenumber: {
        rule: function (r, v, cb) {
            if (v.length > 11) {
                cb()
            }
            if (!/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/i.test(v.trim())) {
                cb(new Error('请输入正确的手机号码'))
            }
        },
        value: 'phonenumber',
        label: '手机号',
        trigger: 'blur',
        msg: '请输入正确的手机号码'
    },
    digits: {
        rule: function (r, v, cb) {
            if (!/^\d+$/.test(v.trim())) {
                cb(new Error('请输入整数'))
            }
        },
        value: 'digits',
        label: '整数',
        trigger: 'blur',
        msg: '请输入整数'
    },
    nodigitsstart: {
        rule: function (r, v, cb) {
            if (/^(\d+)(.*)$/.test(v.trim())) {
                cb(new Error('不能以数字开头'))
            }
        },
        value: '不以数字开头',
        label: '',
        trigger: 'blur',
        msg: '不能以数字开头'
    },
    varirule: {
        rule: function (r, v, cb) {
            if (!/^[a-zA-Z]\w*$/.test(v.trim())) {
                cb(new Error('只能为字母开头,允许字母、数字和下划线'))
            }
        },
        value: '以字母开头',
        label: '',
        trigger: 'blur',
        msg: '只能为字母开头,允许字母、数字和下划线'
    }
}

export function getRulesArr () {
    let ruleList = []
    for (let key in rules) {
        ruleList.push(rules[key])
    }
    return ruleList
}
