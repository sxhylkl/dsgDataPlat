
$(function ($) {
	$(".IndexSearchInput").click(function(){
		$(".SearchBox").addClass("SearchPosition");
		$(".IndexSearchClose").fadeIn(300);
		$(".SearchTagBox").fadeOut(150);
		$(".SearchTopicBg").fadeIn(300);
	});
	$(".IndexSearchClose").click(function(){
		$(".SearchBox").removeClass("SearchPosition");
		$(".IndexSearchClose").fadeOut(150);
		$(".SearchTagBox").fadeIn(300);
		$(".SearchTopicBg").fadeOut(150);
		$(".search-txt").val(null);
		$("#SearchTopic a").removeClass("SearchTopicNow");
	});

	$(".input3").click(function(){
		$(this).addClass("input4");
	});
	$(".input3").blur(function(){
		$(this).removeClass("input4");
		$(this).addClass(".input3");
	});
});



var dataState = {
		topicId: null,
		orgId: null,
		name: ''
}


function getDataset(dataObj) {
	$.each(dataObj, function (i, o) {
		if (typeof(dataState[i] != "undefined")) dataState[i] = decodeURI(o);
	});

}

function SearchDataTheme() {
    var root = $("#SearchTopic");
    var tpl = '<a class="SearchTopicOne01" href="javascript:void(0)" id="{{ id }}">{{ name }}</a>'
    Mustache.parse(tpl);
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/topic/general',
        method: 'GET',
        dataType: 'jsonp'
    }).done(function(data, res, status) {
        if (data.code == "success") {
            $.each(data.data, function (index, el) {
                //DataOpen.printConsole(data.data);
                $(root).append(Mustache.render(tpl, {
                	id: el.id, 
                	name: el.name,
                	count:el.count
                }));
            });
            $("#SearchTopic a").on("click", function(e) {
            	$("#SearchTopic a").removeClass("SearchTopicNow");
            	$(this).addClass("SearchTopicNow");
                if ($(this).attr("id") != undefined && $(this).attr("id") != null){
                	dataState.pageNo = 1;
                	dataState.orgId = null;
                	dataState.dataType = null;
                	dataState.scoreLow = null;
                	dataState.scoreHigh = null;
                    getDataset({topicId: $(this).attr("id")});
                }
                	
            });

            $(".btn-search").on("click", function() {
				var searchString = $(".search-txt").val();
				if ($(".SearchTopicNow").attr("id") != undefined && (searchString != "" || searchString != null)) {
					window.location.href = "list.html?topicId=" + $(".SearchTopicNow").attr("id") + "&name=" + searchString;
				} 
				else if($(".SearchTopicNow").attr("id") != undefined && (searchString == "" || searchString == null)){
					window.location.href = "list.html?topicId=" +$(".SearchTopicNow").attr("id");}
				else if($(".SearchTopicNow").attr("id") == undefined && (searchString != "" && searchString != null) ){
					window.location.href = "list.html?name=" + searchString;
				}
				else{
					window.location.href = "list.html";
				}
			});

     	    
     	  
           
        }
    });
}

$(function () {
	 var SearchUrl = window.location.search.split("?"); 
	 if (SearchUrl.length > 1) {
		 var SearchUrlId = SearchUrl[1].split("=");
		 if(SearchUrlId[0]=="name"){
			 $(".ListSearch").val(decodeURI(SearchUrlId[1]));
		 } else {};
	 } 
	 
	 
})

var urlPara;
$(function() {

	// get Data with URL
	urlPara = DataOpen.getURLParametreObj();
	$.each(urlPara, function(key, value) {
		if (key == "dataType")
			$("input#"+key+"-"+value).iCheck("check");

	});
	getDataset(urlPara);

	// render data topic in the left navigation
	SearchDataTheme();


	$("input[name=dataType]").click(function() {
		//console.log($("input[name=dataType]").val());
	});




});
