/*
var datasetTotalCounts = {"0": 0, "1": 0, "2": 0, "3": 0};
var datasetDataTypeNames = {"0": "数据", "1": "接口", "2": "共享库", "3": "应用"};

var loadHotTopic = function (callback) {
	$.ajax({
		url: DataOpen.apiHostName + '/dataopen/api/topic/hot',
		method: 'GET',
		dataType: 'jsonp'
	}).done(function (data, res, code) {
		var hotTopic = [];
		if (data.code == "success") {
			hotTopic = data.data;
		}
		callback(hotTopic);
	});
};

//全部主题

var showHotTopic = function (topics) {
	if (!topics || topics.size <= 0) {
		return;
	}
	var $container = $("#hot-topic-container");
	$container.empty();
	topics.sort(function (t1, t2) {
		return t1.order - t2.order;
	});
	// console.log(JSON.stringify(topics));
	$.each(topics, function (index, topic) {
		var html = renderTopicItemTemplate(topic.id, topic.name, topic.description, topic.imgAddr, topic.iconAddr);
		$container.append(html);
	});
	$container.delegate("section", "click", function () {
		window.location.href = "list.html?topicId=" + $(this).attr("data-topic-id");
	});
	$(".item").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
};

var renderTopicItemTemplate = function (id, name, describe, img, icon) {
	var $topicItem = $('#hot-topic-item-template').clone();
	$topicItem.find('section').attr("data-topic-id", id);
	$topicItem.find('.hot-topic-image').attr("src", img);
	$topicItem.find('.hot-topic-icon').attr("src", icon);
	$topicItem.find('.hot-topic-icon').attr("data-src-origin", icon);
	$topicItem.find('.hot-topic-icon').attr("data-src-hover", icon);
	$topicItem.find('.hot-topic-name').html(name);
	$topicItem.find('.hot-topic-describe').html(describe);
	return $topicItem.html();
};

var loadDataset = function (callback, type, isSelected) {
	$.ajax({
		url: DataOpen.apiHostName + '/dataopen/api/dataset',
		method: 'GET',
		dataType: 'jsonp',
		data: {"dataType": type, "pageNo": 1, "pageSize": 1}
	}).done(function (data, res, code) {
		var dataset = [];
		if (data.code == "success") {
			dataset = data.data;
		}
		callback(dataset, type, isSelected);
	});
};


var loadHotDataset = function (callback, $container, type) {
	$.ajax({
		url: DataOpen.apiHostName + '/dataopen/api/dataset/hot',
		method: 'GET',
		dataType: 'jsonp',
		data: {"dataType": type, "pageNo": 1, "pageSize": 8}
	}).done(function (data, res, code) {
		var hotDataset = [];
		if (data.code == "success") {
			hotDataset = data.data;
		}
		callback($container, hotDataset);
	});
};

var createDatasetItem = function (name, id, time) {
	return '<div><span class="IndexNewsTime">' + time +'</span><span class="IndexNewsLine">|</span><a class="hvr-wobble-horizontal" href="' + id + '">' + name + '</a></div>';
//	return '<tr><td style="float:left;font-size:16px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:180px"><a href="' + id + '" target="_blank">' + name + '</a></td><td style="float:right;font-size:14pxtext-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:85px">' + time +'</td></tr>';
};

var restDatasetCount = function (type, count) {
	if (!count) {
		count = 0;
	}
	datasetTotalCounts[type] = count;
	var totalCount = 0;
	for (var key in datasetTotalCounts) {
		totalCount += datasetTotalCounts[key];
	}
	$('.dataset-total').html(totalCount);
};

var showDatasetCount =function (dataset, type, isSelected) {
	if (!dataset) {
		return;
	}
	// console.log(JSON.stringify(dataset));
	restDatasetCount(type, dataset.totalCount);
	if(isSelected){
		updateDatasetTypeCount(type);
	}
};

var showHotDataset = function ($container, hotDataset) {
	console.log(hotDataset)
	if (!hotDataset) {
		return;
	}
	var $datasetItemContainer = $container.find('.dataset-item-container');
	$datasetItemContainer.empty();
	var datasetes = hotDataset.hotdatasetlist;
	if (!datasetes || datasetes.length <= 0) {
		return;
	}
	datasetes.sort(function (t1, t2) {
		return t1.order - t2.order;
	});
	datasetes.reverse();
	$.each(datasetes, function (index, item) {
		if(item.name.search("贵州") != -1){
			item.name='xx'+item.name.substring(2)
		}
		var html = createDatasetItem(item.name, item.url, item.description);
		$datasetItemContainer.append(html);
	});
};

var updateDatasetTypeCount = function (type) {
	$('.dataset-data-type-name').html(datasetDataTypeNames[type]);
	$('.dataset-data-type-total').html(datasetTotalCounts[type]);
};*/
/*
$(function () {
	loadHotTopic(showHotTopic);
	loadHotDataset(showHotDataset, $('#data-container'), "0");
	loadHotDataset(showHotDataset, $('#interface-container'), "1");
	loadHotDataset(showHotDataset, $('#app-container'), "3");
	loadDataset(showDatasetCount, "0", true);
	loadDataset(showDatasetCount, "1");
	loadDataset(showDatasetCount, "3");

	$('label[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var $tab =  $(e.target);
		updateDatasetTypeCount($tab.data("data-type"));
		$("label.tab-link").removeClass("active");
		$($tab).addClass("active");
	});
});
*/


window.onload = function getDataset() {
	//开放数据集总浏览数
  $("#dataset-total").text(1626);
  /*$.ajax({
		url:  DataOpen.apiHostName + '/dataopen/statistics/general/totalDataset',
		method: 'GET',
		dataType: 'json',
		async: false
	}).done(function(data, res, status) {
		if (data.code == "success") {
			$("#dataset-total").text(data.data.count);
		}
	});*/

//	开放数据部门总数
  $("#dataset-data-type-total").text(62);
	/*$.ajax({
		url:  DataOpen.apiHostName + '/dataopen/statistics/general/totalOrg',
		method: 'GET',
		dataType: 'json',
		async: false
	}).done(function(data, res, status) {
		if (data.code == "success") {
			$("#dataset-data-type-total").text(data.data.count);
		}
	});*/

//	开放数据总数
  $("#dataset-data-total").text(1332);
	/*$.ajax({
		url:  DataOpen.apiHostName + '/dataopen/statistics/data/totalFile',
		method: 'GET',
		dataType: 'json',
		async: false
	}).done(function(data, res, status) {
		if (data.code == "success") {
			$("#dataset-data-total").text(data.data.count);
		}
	});*/



}

$(function () {
	//banner切换
	$(".IndexBanner").hide()
	$(".IndexBanner").eq(0).show()
	$(".BannerButton").eq(0).addClass("BannerButtonNow")
	var n=0;
	setInterval(function(){
		if(n<2){
			n=n+1;
		}
		else{
			n=0;	
		}
		$(".IndexBanner").hide();
		$(".IndexBanner").eq(n).fadeIn(400);
		$(".BannerButton").eq(n).addClass("BannerButtonNow").siblings().removeClass("BannerButtonNow");
	},4000)
	$(".BannerButton").mouseenter(function(){
		n=$(this).index();
		$(this).addClass("BannerButtonNow").siblings().removeClass("BannerButtonNow");
		$(".IndexBanner").hide();
		$(".IndexBanner").eq(n).stop(true,true).fadeIn(400);
	})



	//微信二维码
	$('.WechatBtn').mouseenter(function(){
		$('.WechatQRBox').stop(true,true).fadeIn(200);
	});
	$('.WechatBtn').mouseleave(function(){
		$('.WechatQRBox').stop(true,true).fadeOut(700);
	});
//	回到顶部
	$(document).scroll(function(){
		if($(document).scrollTop()<=400){
			$(".TopBack").fadeOut();
		}
		else{
			$(".TopBack").fadeIn();
		}
	})
	$(".TopBack").click(function(){
		$(document).scrollTop(0);	
	})
});






