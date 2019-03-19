/**
 * Created by Kevin.
 */

var dataState = {
	pageNo: 1,
	pageSize: 10,
	order: 0,
	topicId: null,
	orgId: null,
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

function getDataset(dataObj) {
	$.each(dataObj, function(i, o) {
		if(typeof(dataState[i] != "undefined")) dataState[i] = decodeURI(o);
	});
	$.ajax({
		url: DataOpen.apiHostName + '/dataopen/api/dataset',
		method: 'GET',
		dataType: 'jsonp',
		async: false,
		data: dataState
	}).done(function(data, res, status) {
		if(data.code == "success") {

			$(".list h2 span").text(data.data.totalCount);

			// Get and Parse the template
			var tpl = $.trim(document.getElementById("item-tmpl").innerHTML);
			Mustache.parse(tpl);

			// Get root node of this list from page
			var root = $(".list dl").empty();
			var itemObject;
			$.each(data.data.datasetlist, function(index, el) {
				//DataOpen.printConsole(el);
				itemObject = {
					sId: el.id,
					type: DataOpen.getDatatypeWithId(el.dataType),
					topic: el.topicName.replace('贵州省','').replace('贵州',''),
					organize: el.orgName.replace('贵州省','').replace('贵州',''),
					title: el.name.replace('贵州省','').replace('贵州',''),
					description: el.description.replace('贵州省','').replace('贵州',''),
					updateTime: el.updTime,
					list: el.list,

					score0: function() {
						return el.score == null;
					},
					score1: function() {
						return el.score == 1;
					},
					score2: function() {
						return el.score == 2;
					},
					score3: function() {
						return el.score == 3;
					},
					score4: function() {
						return el.score == 4;
					},
					score5: function() {
						return el.score == 5;
					},
					score6: function() {
						return el.score == 0;
					},

					calls: el.calls,
					views: el.views,

					calls0: function() {
						return el.calls == null;
					},
					calls1: function() {
						return el.calls != null;
					},

					views0: function() {
						return el.views == null;
					},
					views1: function() {
						return el.views != null;
					},

					isFile: function() {
						return el.dataType == 0;
					},
					isAPI: function() {
						return el.dataType == 1;
					},
					isLink: function() {
						return el.dataType == 3;
					}
				};

				$(root).append(Mustache.render(tpl, itemObject));
//				var myDate = new Date();//获取系统当前时间
//				var start = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
				$(".list .folder").each(function() {
					var format= $(this)[0].innerText;
					if(format == "csv") {
						$(this).css({
							"background-color": "#00c2a0"
						});
					} else if(format == "xls" || format == "xlsx") {
						$(this).css({
							"background-color": "#4bd275"
						});
					} else if(format == "docx" || format == "doc") {
						$(this).css({
							"background-color": "#fc504d"
						});
					}else if(format == "zip" || format == "rar"){
						$(this).css({
							"background-color": "#fead20"
						});
					}else{
						$(this).css({
							"background-color": "#cbd1de"
						});
					}
				});
//				var myDate = new Date();//获取系统当前时间
//				console.log(myDate.getMilliseconds()- start); //获取当前毫秒数(0-999)

			});
			if(itemObject == null) {
				$(".ListNull").show();
			} else {
				$(".ListNull").hide();
			};
			DataOpen.setPagination(data.data.pageNo, data.data.pageSize, data.data.totalCount);
			bindPagination();
		}
	})
}

function renderDataTheme() {
	var root = $("#data-topic");
	var tpl = '<div class="ListLeftHref"><a href="javascript:void(0)" id="{{ id }}">{{ name }}&nbsp;&nbsp;&nbsp;<span class="ListCount">{{ count }}</span></a></div>'
	Mustache.parse(tpl);
	$.ajax({
		url: DataOpen.apiHostName + '/dataopen/api/topic/general',
		method: 'GET',
		dataType: 'jsonp'
	}).done(function(data, res, status) {
		if(data.code == "success") {
			$.each(data.data, function(index, el) {
				//DataOpen.printConsole(data.data);
				$(root).append(Mustache.render(tpl, {
					id: el.id,
					name: el.name,
					count: el.count
				}));
			});
			$("#data-topic .ListLeftHref a").on("click", function(e) {
				$(".ListLeftHref a").removeClass("ListLeftHref02");
				$(this).addClass("ListLeftHref02");
				if($(this).attr("id") != undefined && $(this).attr("id") != null) {
					dataState.pageNo = 1;
					dataState.orgId = null;
					dataState.dataType = null;
					dataState.scoreLow = null;
					dataState.scoreHigh = null;
					getDataset({
						topicId: $(this).attr("id")
					});
				}

			});

			if(data.data.length > 10) {
				new IScroll('#data-topic-wrapper', {
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

function renderDataProvidor() {
	var root = $("#data-providor");
	var tpl = '<div class="ListLeftHref"><a href="javascript:void(0)" id="{{ id }}">{{ name }}&nbsp;&nbsp;&nbsp;<span class="ListCount">{{ count }}</span></a></div>'
	Mustache.parse(tpl);
	$.ajax({
		url: DataOpen.apiHostName + "/dataopen/organization",
		method: 'GET',
		dataType: 'jsonp'
	}).done(function(data, res, status) {
		if(data.code == "success") {
			$.each(data.data, function(index, el) {
				//DataOpen.printConsole(data.data);
				var _name = "";
				if(el.name.length > 10) {
					_name = el.name.substring(0, 10) + "...";
				} else {
					_name = el.name
				}
				$(root).append(Mustache.render(tpl, {
					id: el.id,
					name: _name.replace('贵州省', '').replace('贵州',''),
					tl: el.name.replace('贵州省', '').replace('贵州',''),
					count: el.count
				}));
			});
			$("#data-providor .ListLeftHref a").on("click", function(e) {
				$(".ListLeftHref a").removeClass("ListLeftHref02");
				$(this).addClass("ListLeftHref02");
				if($(this).attr("id") != undefined) {
					dataState.pageNo = 1;
					dataState.topicId = null;
					dataState.dataType = null;
					dataState.scoreLow = null;
					dataState.scoreHigh = null;
					getDataset({
						orgId: $(this).attr("id")
					});
				}

			});
			if(data.data.length > 10) {
				new IScroll('#data-providor-wrapper', {
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
		if(key == "dataType")
			$("input#" + key + "-" + value).iCheck("check");

	});
	getDataset(urlPara);

	// render data topic in the left navigation
	renderDataTheme();

	// render data organization in the left navigation
	renderDataProvidor();

	// render option style of the data type in the left navigation
	$("#data-type .ListLeftHref a").on("click", function(e) {
		dataState.pageNo = 1;
		dataState.topicId = null;
		dataState.orgId = null;
		dataState.scoreLow = null;
		dataState.scoreHigh = null;
		$(".ListLeftHref a").removeClass("ListLeftHref02");
		$(this).addClass("ListLeftHref02");

		if($(this).attr("value") != undefined) {
			getDataset({
				dataType: $(this).attr("value")
			});
		}
	});

	$("#order-selector").change(function() {
		getDataset({
			order: $(this).val()
		})
	})

	//评分option
	$("#data-score .ListLeftHref a").on("click", function(e) {
		$(".ListLeftHref a").removeClass("ListLeftHref02");
		$(this).addClass("ListLeftHref02");
		dataState.pageNo = 1;
		dataState.topicId = null;
		dataState.orgId = null;
		dataState.dataType = null;

		if($(this).attr("value") != undefined) {
			getDataset({
				scoreLow: $(this).attr("value"),
				scoreHigh: $(this).attr("value")
			});
		}
	});

	$("#order-selector").change(function() {
		getDataset({
			order: $(this).val()
		})
	});

	$(".list").delegate(".external", "click", function(e) {
		e.preventDefault();
		var shortUrl = $(this).attr("href");
		getRealURL(shortUrl);
	});

	$(".list").delegate(".folder", "click", function(e) {
		e.preventDefault();
		var fileId = $(this).attr("data-file-id");
		var format = $(this).attr("format");
		if(format == "csv") {
			$('#btn-preview').show();
		} else {
			$('#btn-preview').hide();
		}
		$.ajax({
			url: DataOpen.apiHostName + '/dataopen/api/filedata/' + fileId,
			dataType: 'jsonp'
		}).done(function(data, res, status) {
			if(data.code == "success") {
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
			} else if(data.code == "datafile.not.found") {
				alert(data.error);
			}
		});
	});
	$("#btn-dw").on("click", function() {
		var shortUrl = $(this).attr("data-file-url");
		getRealURL(shortUrl);
	});

	$("#btn-preview").on("click", function() {
		var shortUrl = $(this).attr("data-file-url");
		window.open("preview.html?" + shortUrl)
	});

	$(".breadcrumb .active").text(function() {
		var type, tid;
		if(typeof urlPara["dataType"] != "undefined") {
			tid = urlPara["dataType"];
		} else {
			tid = -1
		}
		type = DataOpen.getDatatypeWithId(parseInt(tid));
		if(type == "接口") {}
		return type;
	});

	$(".pagination").delegate(".num", "click", function(e) {
		e.preventDefault();
		var _pn = $(this).attr("data-pn");
		if(_pn == dataState.pageNo) return;
		getDataset({
			pageNo: _pn
		});
	});
	$(".pagination").delegate(".prev", "click", function(e) {
		e.preventDefault();
		var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
		getDataset({
			pageNo: --curPageNo
		});
	});
	$(".pagination").delegate(".num01", "click", function(e) {
		e.preventDefault();
		var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
		getDataset({
			pageNo: 1
		});
	});

	$(".pagination").delegate(".num02", "click", function(e) {

		var totalCount = parseInt($(".list h2 span").text());
		var _num = Math.ceil(totalCount / dataState.pageSize);

		getDataset({
			pageNo: _num
		});
	});

	$(".pagination").delegate(".next", "click", function(e) {
		e.preventDefault();
		var curPageNo = parseInt($(".pagination .num.active").attr("data-pn"));
		getDataset({
			pageNo: ++curPageNo
		});
	});
	$(".pagination").delegate("select.form-control", "change", function() {
		getDataset({
			pageNo: parseInt($(this).val())
		});
	});

});