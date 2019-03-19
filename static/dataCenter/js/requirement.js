/**
 * Created by Kevin on 8/31/16.
 */
$(function() {

//  $.ajax({
//      url: DataOpen.apiHostName + "/dataopen/api/token",
//      dataType: "jsonp"
//  }).done(function (data, res, status) {
//      if (data.code != "success") {
//          alert(data.error, function() {
//              DataOpen.gotoLogin();
//          });
//
//      }
//      //window.location.href = "login.html";
//  });

    $.ajax({
        url: DataOpen.apiHostName + "/dataopen/organization",
        type: "GET",
        dataType: "jsonp"
    }).done(function(data, res, status) {
        DataOpen.printConsole(data);
        if (data.code == "success") {
            var orgArr = data.data;
            var root = $("#org");
            $.each(orgArr, function(index, val) {
                $(root).append('<option value="' + val.id + '">' + val.name.replace('贵州省','').replace('贵州','') + '</option>');
            });
        }
    });

    $("button[type=submit]").on("click", function() {
        var _title = $.trim($("#title").val()),
            _content = $.trim($("#content").val()),
            _org = $("#org").val();

        if (_title == "" || _title == "请输入申请数据") {
            alert("请填写申请数据");
            return false;
        } else {
            if (_title.length > 30) {
                alert("申请数据不能超过 30 字符");
                return false;
            }
        }

        if (_content == "" || _content == "请输入申请描述内容" ) {
            alert("请填写申请描述内容");
            return false;
        } else {
            if (_content.length > 2000) {
                alert("申请内容不能超过 2000 字符");
                return false;
            }
        }

        $.ajax({
            url: DataOpen.apiHostName + "/dataopen/api/requirement",
            type: "POST",
            crossDomain: true,
            dataType: 'json',
            data: {
                name: _title,
                content: _content,
                orgId: _org
            }
        }).done(function(data, res, status) {
            if (data.code == "success") {

                $("#success").modal();
            }
        });

        return false;

    });

    $("#success").on("hide.bs.modal", function() {
        window.location.href = "requirement.html";
    });

    DataOpen.attachPromoEvent($("#title"), "");
    DataOpen.attachPromoEvent($("#content"), "");
})