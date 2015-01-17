$(document).ready(function(){
	$("#home-background").photoResize();

	$("#signupButton").on("click",function(){
		$("#loginBox").css("display","none");
		$("#signupBox").css("display","block");
	});

	$("#backLoginButton").on("click",function(){
		$("#signupBox").css("display","none");
		$("#loginBox").css("display","block");
	});
});