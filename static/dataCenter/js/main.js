var DataOpen = {

	debug: false, // set this value to false in the production env.

	// API Host Name
	apiHostName: "http://www.gzdata.gov.cn",

	userId: null,

	// Get query string from Current URL, then transform to an Object and return
	getURLParametreObj: function() {
		var url = location.search;
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				var keyValue = strs[i].split("=");
				theRequest[keyValue[0]] = (decodeURI(keyValue[1]));
			}
		}
		return theRequest;
	},

	getCurrentPageName: function() {
		var pathname = location.pathname;
		return pathname.substring(pathname.lastIndexOf("/") + 1, pathname.indexOf("."));
	},

	// print out the testing information to Console during to debug
	printConsole: function(o) {
		if(this.debug) {
			console.log(o);
		}
	},

	setPagination: function(n, s, t) {
		var pageNo = n,
			pageSize = s,
			totalCount = t,
			paginationNode = $(".pagination").empty();
		pagesArr = [];
		pagesOption = [];
		if(totalCount == 0) return;
		var ps = totalCount % pageSize
		var _num = 0;
		if(ps == 0) {
			_num = totalCount / pageSize;
		} else {
			_num = Math.ceil(totalCount / pageSize);
		}

		for(var i = 1; i <= _num; i++) {
			var page = {
				id: i,
				cur: false
			}
			if(i == pageNo) page.cur = true;
			pagesOption.push(page);
		}
		var lastPage;
		if(_num <= n + 10) {
			lastPage = _num;
		} else {
			lastPage = n + 10;
		}
		for(var i = n; i <= lastPage; i++) {
			var page = {
				id: i,
				cur: false
			}
			if(i == pageNo) page.cur = true;
			pagesArr.push(page);
		}

		var tpl = '<li>' +
			'   <a class="num01" href="javascript:void(0)">' +
			'       <span>首页</span>' +
			'   </a>' +
			'</li>' +

			'<li>' +
			'   <a class="prev" href="javascript:void(0)" aria-label="Previous">' +
			'       <span aria-hidden="true">&laquo;</span>' +
			'   </a>' +
			'</li>' +
			'{{ #pages }}' +
			'<li><a class="num{{ #cur }} active{{ /cur }}" data-pn="{{ id }}" href="javascript:void(0)">{{ id }}</a></li>' +
			'{{ /pages }}' +
			'<li>' +
			'   <a class="next" href="javascript:void(0)" aria-label="Next">' +
			'       <span aria-hidden="true">&raquo;</span>' +
			'   </a>' +
			'</li>' +

			'<li>' +
			'   <a class="num02" href="javascript:void(0)">' +
			'       <span>末页</span>' +
			'   </a>' +
			'</li>' +

			'<li>跳至 <select class="form-control">' +
			'{{ #pagesOption }}' +
			'   <option {{ #cur }}selected{{ /cur }}>{{ id }}</option>' +
			'{{ /pagesOption }}' +
			'</select> 页</li>';
		Mustache.parse($.trim(tpl));
		$(paginationNode).append(Mustache.render(tpl, {
			pages: pagesArr,
			pagesOption: pagesOption
		}));
		if(pageNo == 1) {
			$(paginationNode).find(".prev").css("display", "none");
		} else {
			$(paginationNode).find(".prev").css("display", "block");
		}

		if(pageNo == 1) {
			$(paginationNode).find(".num01").css("display", "none");
		} else {
			$(paginationNode).find(".num01").css("display", "block");
		}

		if(pageNo == _num) {
			$(paginationNode).find(".num02").css("display", "none");
		} else {
			$(paginationNode).find(".num02").css("display", "block");
		}

		if(pageNo == _num) {
			$(paginationNode).find(".next").css("display", "none");
		} else {
			$(paginationNode).find(".next").css("display", "block");
		}
	},

	// Get Data type with ID
	getDatatypeWithId: function(id) {
		//this.printConsole(id);
		var dataType;
		switch(id) {
			case 0:
				dataType = "文件";
				break;
			case 1:
				dataType = "接口";
				break;
			case 2:
				dataType = "外部链接";
				break;
			case 3:
				dataType = "应用";
				break;
			default:
				dataType = "全部";
		}
		return dataType;
	},

	// Get Topic name with topicId
	getTopicWithId: function(id) {
		/**/
		return id;
	},

	attachPromoEvent: function(obj, text) {
		$(obj).focus(function() {
			if(this.value == text)
				$(this).val('');
		});
		$(obj).blur(function() {
			if(this.value == "")
				$(this).val(text);
		});
	},

	gotoLogin: function() {
		$.removeCookie("dataopen");
		var callback = window.location.pathname + window.location.search;
		window.location.href = "login.html?callback=" + encodeURIComponent(callback);
	},

	// Get Organization Name with orgID
	getOrganizeWithId: function(id) {
		/*$.ajax({
		    url: apiHostName + '/dataopen/api/organization/' + id,
		    method: 'GET',
		    dataType: 'jsonp',
		    async: false,
		    data: {}
		}).done(function (data, res, status) {
		    if (data.code == "success") {
		        return data.data.name;
		    }
		}).fail(function () {
		    console.log('fail');
		}).always(function () {
		    console.log('complete');
		})*/
	}

}
var activeMainNavigation = function(index) {
	var _navi = $(".navbar-main a");
	$(_navi).removeClass("active");
	if(index != -1)
		$(_navi[index]).addClass("active");
};
var goNavigation = function() {
	var current = DataOpen.getCurrentPageName();
	switch(current) {
		case "":
		case "index":
			activeMainNavigation(0)
			break;
		case "list":
			var urlpara = DataOpen.getURLParametreObj()
			if(urlpara.dataType == "0") {
				activeMainNavigation(1);
			} else if(urlpara.dataType == "1") {
				activeMainNavigation(2);
			} else if(urlpara.dataType == "3") {
				activeMainNavigation(3);
			} else {
				activeMainNavigation(0);
			}
			break;
		case "directory":
			activeMainNavigation(4);
			break;
		case "requirement":
			activeMainNavigation(5);
			break;
		case "Applicationshow":
			activeMainNavigation(6);
			break;
		case "developmenttools":
			activeMainNavigation(6);
			break;
		case "advice":
			activeMainNavigation(11);
			break;
		case "board":
			activeMainNavigation(12);
			break;
		case "userguide":
			activeMainNavigation(13);
			break;
		default:
			activeMainNavigation(-1);
			break;
	}
};

var checkLogin = function() {
	$.ajax({
		url: DataOpen.apiHostName + "/dataopen/api/token",
		dataType: "jsonp"
	}).done(function(data, res, status) {
		if(data.code == "success") {
			// show  login css
			$('.LogonBox').css('display', 'block');

			var usr = eval("(" + data.data + ")");
			$.ajax({
				url: DataOpen.apiHostName + '/dataopen/api/unreadMessage',
				method: 'GET',
				dataType: 'jsonp',
				data: {
					ownerId: usr.user
				}
			}).done(function(data, res, code) {
				//console.log(JSON.stringify(data));
				$("#unreadNum").text(data.data);
				if($(".message-unread-count").length > 0) $(".message-unread-count").text(data.data);
			});
		} else {
			$('.NoLogonBox').css('display', 'block');
		}
	});
};

/*
var code ; //在全局 定义验证码
var createCode = function () {
    code = new Array();
    var codeLength = 4;//验证码的长度
    var checkCode = document.getElementById("checkCode");
    checkCode.value = "";

    var selectChar = new Array(2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');

    for(var i=0;i<codeLength;i++) {
        var charIndex = Math.floor(Math.random()*32);
        code +=selectChar[charIndex];
    }
    if(code.length != codeLength){
        createCode();
    }
    checkCode.value = code;
};*/

var getRealURL = function(shortUrl) {
	$.ajax({
		url: DataOpen.apiHostName + "/dataopen/api/url/" + shortUrl,
		dataType: "jsonp"
	}).done(function(data, res, status) {
		if(data.code == "success") {
			var newWindow = window.open(data.data.realUrl, '_blank');
			//            var newWindow = window.open('about:blank', '_blank');
			//            newWindow.blur();
			//            newWindow.opener.focus();
			//            newWindow.location = data.data.realURL;
		} else if(data.code == "user.not.login") {
			alert(data.error, function() {
				DataOpen.gotoLogin();
			});
			//window.location.href = "login.html";
		}
	});
};

window.alert = function(msg, callback) {
	$("#warning .message").text(msg);
	$("#warning").on("hidden.bs.modal", function(e) {
		if(typeof callback == "function") {
			callback();
		}
	}).modal("show");
}

window.confirm = function(msg, callback) {
	$("#confirm").modal("show");
	$("#confirm .message").text(msg);
	$("#confirm").on("click", ".btn-primary", function() {
		callback();
		location.reload();
        $("#confirm").modal("hide");
	})
	/*
	    $("#confirm").on("hidden.bs.modal", function(e) {
	        if (typeof callback == "function") {
	            callback();
	        }
	    }).modal("show");*/
}

$(function() {

	checkLogin();

	// the section status switch in homepage.
	$(".home-industry-items .item").hover(function() {
		$(this).addClass("hover");
		var icon = $(this).find("dt img");
		icon.attr("src", icon.attr("data-src-hover"));
	}, function() {
		$(this).removeClass("hover");
		var icon = $(this).find("dt img");
		icon.attr("src", icon.attr("data-src-origin"));
	});

	$(".logout").on("click", function() {
		$.ajax({
			url: DataOpen.apiHostName + "/dataopen/api/loginOut",
			dataType: "jsonp"
		}).done(function(data, res, status) {
			if(data.code != "success") {
				console.log('fail');
			}
		});

		$.removeCookie("dataopen");
		window.location.href = 'login.html';
	});

	goNavigation();

	DataOpen.attachPromoEvent($(".search-txt"), "");

	$(".search-txt").bind('keyup', function(event) {
		if(event.keyCode == "13") {
			$(".btn-search").click();
			$(".btn-search").focus();
		}
	});

});

function refresh(obj) {
	//obj.src = "${ctx}/login/getImage.html?"+Math.random();url:ctx + "/validateCode/prorondomkeydoce.html?"+Math.random(),
	$.ajax({
		url: DataOpen.apiHostName + "/dataopen/api/prorondomkeydoce?" + Math.random(),
		async: false,
		success: function(data) {
			var entity = data.entity;
			$("#vcodekey").val(entity);
			$('#u49_input').val('');
			obj.src = DataOpen.apiHostName + "/dataopen/api/provacode/" + entity + "/code";
		}
	});
}

function logininit() {

	$.ajax({
		url: DataOpen.apiHostName + "/dataopen/api/tologin",
	}).done(function(data, res, status) {
		document.getElementById("vcodekeylogin").value = data;
		document.getElementById("vcodekey").value = data;
		document.getElementById("imageId").src = DataOpen.apiHostName + "/dataopen/api/provacode/" + data + "/code";

	});
}