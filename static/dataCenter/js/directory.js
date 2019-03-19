/**
 * Created by Kevin.
 */


var dataState = {
    pageNo: 1,
    pageSize: 5,
    order: 0,
    dreId: null,
    name: ''
}

function bindPagination() {
    var root = $(".pagination"),
        prevBtn = $(root).find(".prev"),
        nextBtn = $(root).find(".next"),
        numBtn = $(root).find(".num");

    $(prevBtn).on("click", function(e) {

    });
    $(nextBtn).on("click", function(e) {

    });
    $(numBtn).on("click", function(e) {

    });
}

function getDirectory(dataObj) {
    $.each(dataObj, function (i, o) {
        if (typeof(dataState[i] != "undefined")) dataState[i] = decodeURI(o);
    });
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/directory/list',
        method: 'GET',
        dataType: 'jsonp',
        async: false,
        data: dataState
    }).done(function(data, res, status) {
        if (data.code == "success") {

            $(".list h2 span").text(data.count);

            // Get and Parse the template
            var tpl = $.trim(document.getElementById("item-tmpl").innerHTML);
            Mustache.parse(tpl);

            // Get root node of this list from page
            var root = $(".list dl").empty();
            var itemObject;
            $.each(data.data, function(index, el) {
                //DataOpen.printConsole(el);
                itemObject = {
                	id: el.id,
                    name: el.name.replace('贵州省','').replace('贵州',''),
                    organize:el.orgName.replace('贵州省','').replace('贵州',''),
                    list:el.metaDirectoryList
                  };
                
                $(root).append(Mustache.render(tpl, itemObject));
                
            });
            if(itemObject==null){
            	$(".ListNull").show();
            }else{$(".ListNull").hide();};
            DataOpen.setPagination(data.pageNo, data.pageSize, data.count);
            bindPagination();
        }
    })
}

function renderDataDirectory() {
    var root = $("#data-directory");
    var tpl = '<li title="{{ tl }}"><input id="dreId-{{ id }}" type="radio" name="dataDirectory" value="{{ id }}" />  {{ name }}&nbsp;&nbsp;&nbsp;<span class="ListCount">{{ count }}</span></li>'
    Mustache.parse(tpl);
    $.ajax({
        url: DataOpen.apiHostName + "/dataopen/api/directory/organization",
        method: 'GET',
        dataType: 'jsonp'
    }).done(function(data, res, status) {
        console.log(data)
        if (data.code == "success") {
            $.each(data.data, function (index, el) {
                //DataOpen.printConsole(data.data);
            	var _name = "" ;
            	if(el.name.length>8){
            		_name = el.name.substring(0,8)+"..." ;
            	}else{
            		_name = el.name;
            	}
                $(root).append(Mustache.render(tpl, {id: el.id, name: _name.replace('贵州省','').replace('贵州',''), tl:el.name.replace('贵州省','').replace('贵州',''),count:el.count}));
            });
            $("input[name=dataDirectory]").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
                increaseArea: '20%'
            }).on("ifChanged", function(e) {
                if ($("input[name=dataDirectory]:checked").val() != undefined) {
                	dataState.pageNo = 1;
                	getDirectory({orgId: $("input[name=dataDirectory]:checked").val()});
                }  	
            });
            $.each(urlPara, function(key, value) {
                if (key == "dreId" && urlPara[key])
                    $("input#"+key+"-"+value).iCheck("check");
            });
            if (data.data.length > 10) {
                new IScroll('#data-directory-wrapper', {
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale',
                    fadeScrollbars: false
                });
            }
        }
    });
}

var urlPara;
$(function() {

    // get Data with URL
    urlPara = DataOpen.getURLParametreObj();
    $.each(urlPara, function(key, value) {
        if (key == "dataType")
            $("input#"+key+"-"+value).iCheck("check");

    });
    getDirectory(urlPara);

    // render data organization in the left navigation
    renderDataDirectory();
    
 
    // render option style of the data type in the left navigation
    $("input[name=dataType]").iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '20%'
    }).on("ifChanged", function(e) {
        if ($("input[name=dataType]:checked").val() != undefined)
        	getDirectory({dataType: $("input[name=dataType]:checked").val()});
    });

    $("#order-selector").change(function() {
    	getDirectory({order: $(this).val()})
    })
    
    $("input[name=dataType]").click(function() {
        //console.log($("input[name=dataType]").val());
    });

    $(".list").delegate(".external", "click", function(e) {
        e.preventDefault();
        var shortUrl = $(this).attr("href");
        getRealURL(shortUrl);
    });

    $(".list").delegate(".folder", "click", function(e) {
        e.preventDefault();
        var fileId = $(this).attr("data-file-id");
        $.ajax({
            url: DataOpen.apiHostName + '/dataopen/api/filedata/' + fileId,
            dataType: 'jsonp'
        }).done(function(data, res, status) {
           if (data.code == "success") {
               var dwModal = $("#downloadModal"),
                   dataName = dwModal.find("#dataName"),
                   dataDesc = dwModal.find("#dataDesc"),
                   dwButton = dwModal.find("#btn-dw");
               $(dataName).text(data.data.name);
               $(dataDesc).html(data.data.description);
               $(dwButton).attr("data-file-url", data.data.shortUrl);

               dwModal.modal();
           } else if (data.code == "datafile.not.found") {
               alert(data.error);
           }
        });
    });
    $("#btn-dw").on("click", function() {
        var shortUrl = $(this).attr("data-file-url");
        getRealURL(shortUrl);
    });

    $(".breadcrumb .active").text(function() {
        var type, tid;
        if (typeof urlPara["dataType"] != "undefined"){
            tid = urlPara["dataType"];
        } else {
            tid = -1
        }
        type = DataOpen.getDatatypeWithId(parseInt(tid));
        return type;
    });
  
    $(".pagination").delegate(".num", "click", function (e) {
        e.preventDefault();
        var _pn = $(this).attr("data-pn");
        if (_pn == dataState.pageNo) return;
        getDirectory({pageNo: _pn});
    });
    $(".pagination").delegate(".prev", "click", function (e) {
        e.preventDefault();
        var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
        getDirectory({pageNo: --curPageNo});
    });
    $(".pagination").delegate(".num01", "click", function (e) {
        e.preventDefault();
        var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
        getDirectory({pageNo: 1});
    });
    
    $(".pagination").delegate(".num02", "click", function (e) {
    	
        var totalCount = parseInt($(".list h2 span").text());
        var _num = Math.ceil(totalCount/dataState.pageSize); 

        getDirectory({pageNo: _num});
    });
    
    $(".pagination").delegate(".next", "click", function (e) {
        e.preventDefault();
        var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
        getDirectory({pageNo: ++curPageNo});
    });
    $(".pagination").delegate("select.form-control", "change", function() {
        getDirectory({pageNo: parseInt($(this).val())});
    });

});