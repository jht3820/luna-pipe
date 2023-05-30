
$(function(){
	
	

	var jQueryAjaxSettingsCache = jQuery.ajaxSettings.cache;

	
	jQuery.ajaxSettings.cache = true;

	$("head").append("<script src='/js/jquery/jquery-ui.js'></script>");
	
	$("head").append("<script src='/js/jquery/jquery.scrolltable.js'></script>");
	$("head").append("<script src='/js/common/layerPopup.js'></script>");	
	$("head").append("<script src='/js/common/comOslops.js'></script>");		
	$("head").append("<script src='/js/axisj/dist/AXJ.min.js'></script>"); 		
	$("head").append("<script src='/js/axisj/lib/AXSearch.js'></script>");
	
	$("head").append("<script src='/js/axisj/lib/AXSelect.js'></script>");
	$("head").append("<script src='/js/axisj/lib/AXInput.js'></script>");
	$("head").append("<script src='/js/common/EgovMultiFile.js'></script>"); 	
	$("head").append("<script src='/js/jquery/jquery.alerts.js'></script>");		
	$("head").append("<script src='/js/jquery/jquery.timepicker.min.js'></script>");		
	$("head").append("<script src='/js/jquery/jquery.base64.js'></script>");
	$("head").append("<script src='/vendors/moment/min/moment.min.js'></script>");
	$("head").append("<script src='/vendors/bootstrap-daterangepicker/daterangepicker.js'></script>");
	$("head").append("<script src='/js/jquery/jquery.curvedarrow.js'></script>");
	$("head").append("<script src='/js/common/oslGuideContents.js'></script>");
	$("head").append("<script src='/js/common/printThis.js'></script>");
	$("head").append("<script src='/vendors/select2/js/select2.full.min.js'></script>");
	$("head").append("<script src='/vendors/select2/js/i18n/ko.js'></script>");
	
	
	jQuery.ajaxSettings.cache = jQueryAjaxSettingsCache;

	
	
	$('.main_contents').css('min-height',$(window).innerHeight()-160);
	
	
	$("body").prepend('<div class="top_fixed" style="display:none;"><div class="top_bg"><div class="top_str"></div><img class="fixed_loading" src="/images/loading.gif"/></div></div>');

   $('.user_img').each(function(n){
       $(this).error(function(){
         $(this).attr('src', '/images/contents/sample.png');
       });
    });
   
   
	gfnGuideKeyAction();
});



$(document).keyup(function(event){
	
  	if(event.keyCode == 27){
  		
  		if($(".layer_popup_box").length > 0){
  			jConfirm("현재 화면을 닫으시겠습니까?","경고",function(result){
  				if(result){
  					gfnLayerPopupClose();	
  				}
  				
  			});
  		}
  	}
});

$(document).ready(function() {	
	 $('.select_table tbody tr').not('.selectNotTr').click(function(){
		$('.table_active').removeClass('table_active');
		$(this).addClass('table_active'); 
	});
});


function setTitle(text){
	$("head title").text(text + " - Open Soft Lab");
}