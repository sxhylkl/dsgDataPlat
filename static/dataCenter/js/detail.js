var format;

var loadDatasetDetail = function (callback) {
    var urlPara = DataOpen.getURLParametreObj();
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/dataset/' + urlPara.id,
        method: 'GET',
        dataType: 'jsonp'
    }).done(function (data, res, code) {
        if (data.code == "success") {
            callback(data.data);      
        } else {
            callback(undefined);
        }
    });
};


var renderDatasetDetail = function (detail) {
    if (!detail) {
        return;
    }
   
    $('.detail-name').html(detail.name.replace('贵州省', '').replace('贵州',''));
    $('.detail-description').html(detail.description.replace('贵州省', '').replace('贵州',''));
    $('.detail-update-frequency').html(detail.updVal+" "+$.utils.getFrequency(detail.updFrequency));
    $.utils.getOrganizationName(detail.orgId, function (orgName) {
        $('.detail-org-name').html(orgName.replace('贵州省', '').replace('贵州',''));
    });
    $('.detail-updated-at').html(detail.updTime);
    $('.detail-topic-name').html(detail.topicName);
    
    if(detail.calls == null){
    	$('.detail-calls-box').hide();
    	}else{
    		$('.detail-calls').html(detail.calls);
    };
    if(detail.views == null){
    	$('.detail-views-box').hide();
    	}else{
    		$('.detail-views').html(detail.views);
    };
  
    if(detail.favorite == true){
    	$('#DetailCollect02').show();
    }else if(detail.favorite == false){
    	$('#DetailCollect01').show();
    };
   
    if(detail.dataType == 0){
        loadFileData(detail.id, renderFileData);
    }else if(detail.dataType == 1){
        loadApiData(detail.id, renderApiData);
    }else if(detail.dataType == 2){
    }else if(detail.dataType == 3){
        loadAppData(detail.id, renderAppData);
    }
};

//分享按钮
$(function () {
	$('#ShareBox').click(function(){
		$('.ShareBox').toggle(100);
	});
});

//纠错按钮   error-btn
$(function () {	
	
	$('#SearchErrorBox').click(function(){
		$.ajax({
	        url: DataOpen.apiHostName + "/dataopen/api/token",
	        dataType: "jsonp"
	    	}).done(function (data, res, status) {
	        if (data.code != "success") {
	            alert(data.error, function () {
	                DataOpen.gotoLogin();
	            });
	        }else{$('#collection_mask,.SearchErrorBox').fadeIn(200);}
	    });
	});
	
	$("#collection-dialog-close,#collection-dialog-cancel").click(function(){
		  $("#collection_mask,.SearchErrorBox").fadeOut(200);
	});
	
	$("#error-btn").click(function(){
	       var CollectUrl = window.location.search;
		   var CollectUrlID = CollectUrl.split("=");
		   var error_content = $.trim($("#error_content").val());
		   var error_title = $.trim($("#error_title").val());
	       
		   if (error_title == "") {
	            alert("标题为空，请填写数据纠错的标题");
	            return;
	        }
		   
	       if (error_content == "") {
	            alert("内容为空，请填写数据纠错的内容");
	            return;
	        }
	       
		   $.ajax({
			        url: DataOpen.apiHostName + '/dataopen/api/datasetCorrection/submit',
			        type: 'POST',
			        crossDomain: true,
		            dataType: 'json',
		            data: {
		            	title : error_title,
		            	content : error_content,
		                dataset_id : CollectUrlID[1],
		            }
			    }).done(function (data, res, code) {
			        if (data.code == "success") {
			        	$("#collection_mask,.SearchErrorBox").hide();
			     	   alert("感谢您的纠正！");
			        } else {
			        	alert(data.error, function () {
			        	$("#collection_mask,.SearchErrorBox").hide();
					    alert("数据提交失败，请稍后再提交！");
			            });
			        }
			    });
	 });   
	
});

//收藏按钮
$(function () {
	   var CollectUrl = window.location.search;
	   var CollectUrlID = CollectUrl.split("=");   
   $('#DetailCollect02 .DetailCollect').click(function(){ 
	     
	   $('#collection_mask,#collection_dialogMove').fadeIn(200);
	   
	   $("#collection-dialog-determine").click(function(){
	   $.ajax({
		        url: DataOpen.apiHostName + '/dataopen/api/favorite/removeFromFavorite',
		        type: 'POST',
		        crossDomain: true,
	            dataType: 'json',
	            data: {
	            	dataset_id : CollectUrlID[1]
	            }
		    }).done(function (data, res, code) {
		        if (data.code == "success") {
		        	$("#collection_mask,#collection_dialogMove").hide();
		     	   alert("成功取消此收藏");
		        } else {
		        	alert(data.error, function () {
		        		alert("收藏取消失败，请稍后再试！");
		            });
		        }
		    });
	   
	   $('#DetailCollect02').fadeOut(0); 
	   $('#DetailCollect01').fadeIn(200); 
	   });    
		 
   });

   $("#collection-dialog-close,#collection-dialog-cancel").click(function(){
	  $("#collection_mask,#collection_dialogMove").hide();
   });
   
   $('#DetailCollect01 .DetailCollect').click(function(){
	   $.ajax({
	        url: DataOpen.apiHostName + "/dataopen/api/token",
	        dataType: "jsonp"
	    	}).done(function (data, res, status) {
	        if (data.code != "success") {
	            alert(data.error, function () {
	                DataOpen.gotoLogin();
	            });
	        }
	    });
		    $.ajax({
		        url: DataOpen.apiHostName + '/dataopen/api/favorite/addToFavorite',
		        type: 'POST',
		        crossDomain: true,
	            dataType: 'json',
	            data: {
	            	dataset_id : CollectUrlID[1]
	            }
		    }).done(function (data, res, code) {
		        if (data.code == "success") {
		        	$('#DetailCollect01').fadeOut(0);  
				    $('#DetailCollect02').fadeIn(200); 
		        	alert("成功添加此收藏");
		        } else {
		        	alert(data.error, function () {
		                DataOpen.gotoLogin();
		            });
		        }
		    });

		    
	        
   });	
	
});


var renderApiData = function (api) {
    if(!api){
        return;
    }
    var $detailDataApi = $('#detail-data-api-template').clone();
    $detailDataApi.find('.detail-api-name').html(api.name);
    $detailDataApi.find('.detail-api-description').html(api.description);
    $detailDataApi.find('.detail-api-host').html(api.ifsAddr);
    $detailDataApi.find('.detail-api-method').html(api.requestMode);
    $detailDataApi.find('.detail-api-request').html(api.argsDesc);
    $detailDataApi.find('.detail-api-response').html(api.returnValDesc);
    $detailDataApi.find('.detail-api-support').html(api.supportFormat);
    $detailDataApi.find('.detail-api-request-example').text(api.requestDemo);
    $detailDataApi.find('.detail-api-response-example').text(api.returnDemo);
    $detailDataApi.find('.detail-api-error-code').html(api.resultCode);
    $detailDataApi.find('.detail-api-error-code-explain').html(api.remark);
    $('.detail-container').append($detailDataApi.html());
};

var loadApiData = function(id, callback){
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/dataset/' + id + '/apidata',
        method: 'GET',
        dataType: 'jsonp'
    }).done(function (data, res, code) {
        var api = undefined;
        if (data.code == "success") {
            api = data.data;
        }
        callback(api);
    });
};


var renderFileData = function (files) {
    var $detailDataFiles = $('#detail-data-files-template').clone();
    var $detailContainer = $('.detail-container');
    if(files && files.length > 0){
    	var DataNumber = 0;
        var $filesContainer = $detailDataFiles.find('.list-inline');
        $.each(files, function (index, item) {
        	DataNumber++;
            var html = '<div><span class="FloatLeft">'+ DataNumber +'</span><a class="folder FloatLeft" title="'+ item.name + ' . ' + item.format +'" href="javascript:void(0)" data-file-id="' + item.id + '" format="'+ item.format +'">' + item.name + ' . ' + item.format + '</a><a class="FloatRight" style="text-decoration: none">'+ item.upd_time +'</a></div>';
            $filesContainer.append(html);
        });
    }
    $detailContainer.append($detailDataFiles.html());
};

var renderAppData = function (apps) {
    if(!apps){
        return;
    }
    var $detailDataApp = $('#detail-data-app-template').clone();
    var $detailContainer = $('.detail-container');
    if(apps && apps.length > 0){
        var $appsContainer = $detailDataApp.find('.list-inline');
        $.each(apps, function (index, item) {
            var html = '<li><a class="app-link" href=""><span class="glyphicon glyphicon-link"></span> 请点击链接</a></li>';
            $appsContainer.append(html);
        });
    }
    $detailContainer.append($detailDataApp.html());
    restAppLinkEvent();
};

var restAppLinkEvent = function () {
    $('.app-link').on('click', function (e) {
        e.preventDefault();
        var shortUrl = $(this).data("link");
        $.ajax({
            url: DataOpen.apiHostName + "/dataopen/api/url/" + shortUrl,
            dataType: "jsonp"
        }).done(function(data, res, status) {
            if (data.code == "success") {
                var newWindow = window.open(data.data.realUrl, '_blank');
            } else {
                alert(data.error, function () {
                    DataOpen.gotoLogin();
                });
            }
        });
    });
};


var loadAppData = function (id, callback) {
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/dataset/' + id + '/linkdata',
        method: 'GET',
        dataType: 'jsonp'
    }).done(function (data, res, code) {
        var apps = [];
        if (data.code == "success") {
            apps = data.data;
        }
        callback(apps);
    });
};

var loadFileData = function (id, callback) {
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/dataset/' + id + '/filedata',
        method: 'GET',
        dataType: 'jsonp'
    }).done(function (data, res, code) {
        var files = [];
        if (data.code == "success") {
            files = data.data;
        }
        callback(files);
    });
};

$(function () {
    loadDatasetDetail(renderDatasetDetail);

    $(".description").delegate(".folder", "click", function(e) {
    	
        e.preventDefault();
        var fileId = $(this).attr("data-file-id");
        var format = $(this).attr("format");
        if(format =="csv"){
        	$('#btn-preview').show();
        } else {
        	$('#btn-preview').hide();
        }
        $.ajax({
            url: DataOpen.apiHostName + '/dataopen/api/filedata/' + fileId,
            dataType: 'jsonp'
        }).done(function(data, res, status) {
            if (data.code == "success") {
                var dwModal = $("#downloadModal"),
                    dataName = dwModal.find("#dataName"),
                    dataDesc = dwModal.find("#dataDesc"),
                    dwButton = dwModal.find("#btn-dw");
                    previewButton = dwModal.find("#btn-preview");
                $(dataName).text(data.data.name);
                $(dataDesc).html(data.data.description);
                $(dwButton).attr("data-file-url", data.data.shortUrl);
                $(previewButton).attr("data-file-url", data.data.shortUrl);
                
                dwModal.modal();
            } else if (data.code == "datafile.not.found") {
                alert(data.error);
            }
        });
        
        
        
    });
   
    
    $(".folder").on("click", function() {
		 
   });	
    
    
    $("#btn-dw").on("click", function() {
        var shortUrl = $(this).attr("data-file-url");
        getRealURL(shortUrl);
    });
    
    $("#btn-preview").on("click", function() {
    	var shortUrl = $(this).attr("data-file-url");
    	window.open("preview.html?" + shortUrl);
    });
    
    

});


        	 


