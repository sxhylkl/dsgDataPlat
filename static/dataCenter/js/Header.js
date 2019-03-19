//Shaw
$(function () {
	$(".NavSub").hide();
	$(".Nav").mouseenter(function(){
	   $(this).children(".NavSub").stop(true,true).slideDown(100);
	}).mouseleave(function(){
	   $(".NavSub").stop(true,true).slideUp(100);
	})
	
	$(".NavSub div").mouseenter(function(){
	   $(this).children(this).css("color","#00c2a0");
	}).mouseleave(function(){
	   $(".NavSub div a").css("color","#b3b3b3");
	})
});




