;
var search = {
    pageNo: 1,
    pageSize: 10,
    name: ''
};

var loadPlans = function (callback) {
    resetSearch();
    $.ajax({
        url: DataOpen.apiHostName + '/dataopen/api/plan',
        method: 'GET',
        dataType: 'jsonp',
        data: search
    }).done(function (data, res, code) {
        if (data.code == "success") {
        	$(".hidden h2 span").text(data.totalCount);
            callback(data);
        }else {
            callback(undefined);
        }
    });
    // /api/topic/hot

};

var resetSearch = function () {
    var urlPara = DataOpen.getURLParametreObj();
    $.each(urlPara, function (i, o) {
        if (typeof(search[i] != "undefined")) search[i] = o;
    });
};

var renderPlans = function(data){
    var planData = data.data;
    if(!planData){
        return;
    }
    var $boardContainer = $('#board-container');
    $boardContainer.empty();
    var plans = planData.planlist;
    if(!plans || plans.length <= 0){
        return;
    }
    $.each(plans, function(index, item) {
        var html = renderBoardItemTemplate(item.id, item.name.replace('贵州省','').replace('贵州',''), item.updTime, item.shortUrl);
        $boardContainer.append(html);
    });
    DataOpen.setPagination(data.pageNo, data.pageSize, data.totalCount);
};


var renderBoardItemTemplate = function (id, title, date, href){
    var $boardItem = $('#board-item-template').clone();
    $boardItem.find('.board-item-title').html(title);
    $boardItem.find('.board-item-date').html(date);
    $boardItem.find('.board-item-download').attr("href", href);
    /*$.utils.getUrl(href, function(url){
        $boardItem.find('.board-item-download').attr("href", url);
    });*/
    return $boardItem.html();
};

$(function () {
    loadPlans(renderPlans);

    $("#board-container").delegate(".board-item-download", "click", function(e) {
        e.preventDefault();
        getRealURL($(this).attr("href"));
    });

    
    $(".pagination").delegate(".num", "click", function (e) {
        e.preventDefault();
        var _pn = $(this).attr("data-pn");
        if (_pn == search.pageNo) return;
        search.pageNo = _pn;
        loadPlans(renderPlans);
    });
    $(".pagination").delegate(".prev", "click", function (e) {
        e.preventDefault();
        var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
        search.pageNo = --curPageNo;
        loadPlans(renderPlans);
    });
    $(".pagination").delegate(".num01", "click", function(e) {
		e.preventDefault();
		var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
		search.pageNo = 1;
		loadPlans(renderPlans);
	});

	$(".pagination").delegate(".num02", "click", function(e) {

		var totalCount = parseInt($(".hidden h2 span").text());
		var _num = Math.ceil(totalCount / search.pageSize);
		search.pageNo = _num;
		loadPlans(renderPlans);
	});
    $(".pagination").delegate(".next", "click", function (e) {
        e.preventDefault();
        var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
        search.pageNo = ++curPageNo;
        loadPlans(renderPlans);
    });
    $(".pagination").delegate("select.form-control", "change", function() {
        search.pageNo = parseInt($(this).val());
        loadPlans(renderPlans);
    });

});




