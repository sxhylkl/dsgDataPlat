
$(function () {
	
/******************************  meta.html 中的  ****************************************************************/
	
		$("#metatitle").text("XX省政府数据开放平台");
		$("meta[name='keywords']").attr("content","XX省政府数据开放平台, XX, 政府, 数据, 大数据, 开放, 创新, 服务, 增值");
		$("meta[name='description']").attr("content","XX省政府数据开放平台（http://www.gzdata.gov.cn/）是XX省经济和信息化委员会牵头，迪思杰（北京）数码技术有限公司作为承办单位与技术支撑单位：迪思杰（北京）数码技术有限公司 共同建设的政府数据服务门户。其目标是促进政府数据资源的开发利用，鼓励企业、社会组织和个人利用数据资源开展商业模式创新，满足公众和企业对政府数据的“知情权”和“使用权”，向社会提供政府数据资源的浏览、查询、下载等基本服务，并逐步完善平台服务功能，提供类似汇聚发布基于政府数据资源开发的应用程序，开放指数分析等增值服务。");
	
	
/******************************  注册服务协议  ****************************************************************/
		
		$(".agreement").text("XX省");
		$(".agreementUrl").text("http://www.gzdata.gov.cn/");
	
	
/******************************  logo 的url  ****************************************************************/
	
		/******** XX  铜仁 遵义 用***********/
		// 登录 和 友情链接 、服务条款、 隐私政策 、版权声明 、关于我们、 的logo
		//$("#loginLogo").css({"background":"url('../images/guizhou/logo.png') no-repeat" ,"height":"97px"});
	
	
		/******** 黔西南州用******/
		//首页logo 
		//$(".navbar-brand").css({"background":"url('../images/qianxinan/logo.png') no-repeat" ,"width":"529px" ,"height":"110px" ,"text-indent":"-999em" ,"background-size":"100%","margin-left":"-13px"});
		// 登录 和 友情链接 、服务条款、 隐私政策 、版权声明 、关于我们、 的logo
		//$("#loginLogo").css({"background":"url('../images/qianxinan/logo.png') no-repeat" ,"height":"97px","margin-left":"93px"});
	
		/******** 黔东南州用*******/
		//首页logo 
		//$(".navbar-brand").css({"background":"url('../images/qiandongnan/logo.png') no-repeat" ,"width":"529px" ,"height":"110px" ,"text-indent":"-999em" ,"background-size":"100%","margin-left":"-48px"});
		// 登录 和 友情链接 、服务条款、 隐私政策 、版权声明 、关于我们、 的logo
		//$("#loginLogo").css({"background":"url('../images/qiandongnan/logo.png') no-repeat" ,"height":"97px","margin-left":"48px"});
/******** XX省用*******/
		//首页logo 
		var locale = DataOpen.locale;
		$(".navbar-brand").css({"background":"url('../images/'+ locale +'/logo.png') no-repeat" ,"width":"300px" ,"height":"110px" ,"text-indent":"-999em" ,"background-size":"100%","margin-left":"-48px","margin-top":"10px"});
		// 登录 和 友情链接 、服务条款、 隐私政策 、版权声明 、关于我们、 的logo
		$("#loginLogo").css({"background":"url('../images/'+ locale +'/logo.png') no-repeat" ,"height":"97px","margin-left":"48px"});
	
/******************************  首页搜索框下的 组织名称 和链接  ****************************************************************/
            

	
	
/******************************  页尾的 友情链接 、服务条款、 隐私政策 、版权声明 、关于我们  页面中的  省市名称 和 链接  ****************************************************************/
		$(".orgname").text("XX省");
		$(".orgNameUrl").text("http://www.gzdata.gov.cn/");
		// 页尾的事业单点图片 隐藏
		$("#_ideConac").hide();
		// 页尾的事业单点图片 显示
		$("#_ideConac").show();
	
/******************************  页尾  ****************************************************************/
		// 主办单位：xxxxxxxxxxxxxx
		$("#zbdwa").text(" ").attr("href","http://www.gzdsj.gov.cn/");
		// 承办单位
		$("#cbdw").text("承办单位： 迪思杰（北京）数码技术有限公司");
		// 技术支持单位
		$("#jszc").text(" ").attr("href","https://zrys.gzdata.com.cn/");
		// 联系电话
		$("#lxdh").text("联系电话：   010-82051581");
		// 电子邮箱
		$("#dzyx").text("xxxxxxxxxxxxx").attr("href","mailto:xxxxxxxxxxxxx");
		// 备案号
		$("#bah").text("备案号：xxxxxxxxxxxxx");
	
	
	
	
/******************************  XX省  ****************************************************************/
		/*********  关于我们  ***********/
		$("#aboutusOrgname").text(" ");
		/*********  版权声明  ***********/
		$("#copyRightUrl").text("www.gzdata.gov.cn");
		
/******************************  铜仁  ****************************************************************/
		/*********  友情链接  ***********/
		//$("#link1").text("贵阳市政府数据开放平台").attr("href","http://www.gyopendata.gov.cn");
		//$("#link2").text("广州市政府数据统一开放平台").attr("href","http://www.datagz.gov.cn");
		//$("#link3").text("深圳市政府数据开放平台").attr("href","http://www.opendata.sz.gov.cn");
		/*********  关于我们  ***********/
		//$("#aboutusOrgname").text("铜仁市工业和信息化委员会（铜仁市大数据发展领导小组办公室）");
		/*********  版权声明  ***********/
		//$("#copyRightUrl").text("www.gztrdata.gov.cn");
	
/******************************  遵义  ****************************************************************/
		/*********  友情链接  ********/
		$("#link1").text("贵阳市政府数据开放平台").attr("href","http://www.gyopendata.gov.cn");
//		$("#link2").text("广州市政府数据统一开放平台").attr("href","http://www.datagz.gov.cn");
		$("#link3").text("深圳市政府数据开放平台").attr("href","http://opendata.sz.gov.cn/");
		/*********  关于我们  ***********/
		//$("#aboutusOrgname").text("遵义市大数据发展领导小组办公室");
		/*********  版权声明  ***********/
		//$("#copyRightUrl").text("www.zyopendata.gov.cn");
});


/******************************  数据可视化标题****************************************************************/

$("#index_black_title").text("XX省数据开放平台数据可视化");

