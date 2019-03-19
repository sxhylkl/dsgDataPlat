;
var areaData = {
    "XX省": ["全部"],
    "贵阳市": ["全部", "南明区", "云岩区", "花溪区", "乌当区", "白云区", "观山湖区", "开阳县", "息烽县", "修文县", "清镇市"],
    "六盘水市": ["全部", "钟山区", "六枝特区", "水城县", "盘县"],
    "遵义市": ["全部", "红花岗区", "汇川区", "播州区", "桐梓县", "绥阳县", "正安县", "道真县", "务川县", "凤冈县", "湄潭县", "余庆县", "习水县", "赤水市", "仁怀市"],
    "安顺市": ["全部", "镇宁县", "西秀区", "平坝区", "普定县", "关岭县", "紫云县"],
    "毕节市": ["全部", "七星关区", "大方县", "黔西县", "金沙县", "织金县", "纳雍县", "威宁县", "赫章县"],
    "铜仁市": ["全部", "碧江区", "万山区", "江口县", "玉屏县", "石阡县", "思南县", "印江县", "德江县", "沿河县", "松桃苗族自治县"],
    "黔西南布依族苗族自治州": ["全部", "兴义市", "兴仁县", "普安县", "晴隆县", "贞丰县", "望谟县", "册亨县", "安龙县"],
    "黔东南苗族侗族自治州": ["全部", "镇远县", "凯里市", "黄平县", "施秉县", "三穗县", "岑巩县", "天柱县", "锦屏县", "剑河县", "台江县", "黎平县", "榕江县", "从江县", "雷山县", "麻江县", "丹寨县"],
    "黔南布依族苗族自治州": ["全部", "都匀市", "福泉市", "荔波县", "贵定县", "瓮安县", "独山县", "平塘县", "罗甸县", "长顺县", "龙里县", "惠水县", "三都水族自治县"]
};
var currentFirstAreaSelectValue;
var onFirstSelectChanged = function (firstAreaSelectValue, forward) {
    $('.first-area-select-value').html(firstAreaSelectValue + '<span class="caret"></span>');
    var secondList = areaData[firstAreaSelectValue];
    var $list = $('.second-area-select-list');
    $list.empty();
    $.each(secondList, function (index, value) {
        $list.append('<li><a href="#">' + value + '</a></li>');
    });
    currentFirstAreaSelectValue = firstAreaSelectValue;
    onSecondSelectChanged(secondList[0]);
};

var onSecondSelectChanged = function (secondAreaSelectValue, forward) {
    $('.second-area-select-value').html(secondAreaSelectValue + '<span class="caret"></span>');
    if(!forward){
        registerEvent();
        return;
    }
    var firstFirst = firstKey(areaData);
    var indexSelection = firstFirst + "==" + areaData[firstFirst][0];
    var currentSelection = currentFirstAreaSelectValue + "==" + secondAreaSelectValue;
    var isIndex = (window.location.href.indexOf("index.html") > 0);
    if (indexSelection == currentSelection && !isIndex) {
        window.location.href = "index.html";
        return;
    }
    if (indexSelection != currentSelection && isIndex) {
        window.location.href = "coming-soon.html?city=" + currentFirstAreaSelectValue + "&area=" + secondAreaSelectValue;
    }
};

var registerEvent = function () {
    $('.first-area-select-list > li > a').on('click', function () {
        onFirstSelectChanged($(this).text(), false);
    });
    $('.second-area-select-list > li > a').on('click', function () {
        onSecondSelectChanged($(this).text(), true);
    });
};

var initFirstSelectList = function () {
    var $list = $('.first-area-select-list');
    $list.empty();
    $.each(areaData, function (key, values) {
        $list.append('<li><a href="#">' + key + '</a></li>');
    });
};

var firstKey = function (data) {
    for (var key in data) {
        return key;
    }
};


$(function () {
    var parameters = DataOpen.getURLParametreObj();
    var firstSelectValue;
    if (parameters.city) {
        firstSelectValue = parameters.city;
    } else {
        firstSelectValue = firstKey(areaData);
    }
    var secondSelectValue;
    if(parameters.area){
        secondSelectValue = parameters.area;
    }else {
        secondSelectValue = areaData[firstSelectValue][0];
    }
    initFirstSelectList();
    onFirstSelectChanged(firstSelectValue, false);
    onSecondSelectChanged(secondSelectValue, false);
    registerEvent();
});
