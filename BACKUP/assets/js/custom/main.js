$(document).ready(function(){
	var windowWidth = $(window).width();
	$("#chatDropdown").on("click",function(){
		$("#chatBox").height($(window).height()-45);
		$("#chatBox").slideToggle();
	});
	$(window).on("resize",function(){
		if(windowWidth != $(window).width()){
			$("#chatBox").slideUp();
		} else{
			$("#chatBox").height($(window).height()-45);
		}
	});

	$('#profileTable').DataTable();
});