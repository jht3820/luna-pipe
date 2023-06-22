$(function(){
	/* 레이어팝업 css 추가 */
	$("head").append('<link rel="stylesheet" href="/css/common/layerPopup.css">');
	
	/* 레이어 팝업 닫기 버튼 */
	$("body").on("click", ".layer_popup_box .close_btn", function(){
		gfnLayerPopupClose();
	});
	
	$("body").on("click", ".layer_popup_box .popup_close", function(){
		gfnLayerPopupClose();
	});
	
	$("body").on("click", ".layer_popup_box .exit_btn", function(){
		gfnLayerPopupClose();
	});
	
	$("body").on("click", ".pop_close", function(){
		gfnLayerPopupClose();
	});
	
	$(document).on('click','.p_close',function(){
		gfnLayerPopupClose();
	});
	
	$("body").on("click", ".popup_x_btn", function(){
		gfnLayerPopupClose();
	});
	
	/* input type 이 number 일경우 숫자만 입력 하도록.*/
	$("body").on("keyup", "[type='number']", function(){

		var num_check=/^[0-9]*$/;
		var val = this.value;
		var colNm = $(this).attr('title');
		
		if(!num_check.test(val) || val < 0){
			jAlert( colNm + "는 0부터 숫자만 입력 가능합니다.");
			this.value = "";			
		}
	});
});

/**
 * 	function 명 	: layer_popup
 *  function 설명	: 레이어 팝업을 호출한다.
 *  url			: 호출 URL
 *  data		: 1. json 형식 ex> {"key1" : "value1", "key2" : "value2"}
 *  			  2. form serialize 형식 ex> $("#formObj").serialize(); => id=jht&pw=jht
 *  <div class="close_btn white"></div>
 */
var layer_popup = function(url, data,loadingShow){
	var layerIndex = $(".layer_popup_box").length;
	var layerBoxDivId = "lpx"+layerIndex;
	var bgfirstHtml="";
	var bgSecondHtml="";
		
	if(layerIndex==0){
		bgfirstHtml='<div class="bg">';
		bgSecondHtml='<div class="bg">';
	}else{
		bgfirstHtml='<div class="bg" id="lpxBgF_'+layerIndex+'">';
		bgSecondHtml='<div class="bg" id="lpxBgS_'+layerIndex+'" >';
		
	}
	$("body").prepend(bgfirstHtml+'</div><div class="layer_popup_box" id="'+layerBoxDivId+'" layerurl="'+url+'">'+bgSecondHtml+'</div><div class="ajax_box"></div></div>');
	
	//로딩 바
	var loadingShowVal = true;
	if(!gfnIsNull(loadingShow)){
		loadingShowVal = loadingShow;
	}
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":url,async:true,loadingShow: loadingShowVal}
			,data);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data, textStatus, xhr){
		$("#"+layerBoxDivId+" .ajax_box").html(data);
		$("#"+layerBoxDivId).show();
		$("body").addClass("bhpf");
		
		//팝업 가이드 상자 존재하는경우
		if(typeof globals_guideChkFn == "function"){
			gfnGuideStack("add",globals_guideChkFn);
		}else{
			//없는경우 팝업 이전 화면에서 가이드 상자 호출을 막기위해 빈 함수 삽입
			gfnGuideStack("add",$.noop);
		}
		
		xhr.complete(function(){
        	//마우스 드래그로 팝업창 움직일 수 있도록  jQuery UI
        	$('.ajax_box').draggable({ handle: " .popup_title_box, .pop_title, .header_title" });
        });
	});
	
	//AJAX 전송 오류 함수
	ajaxObj.setFnError(function(xhr, status, err){
		if(xhr.status == '404'){
			console.log(err);
    		toast.push('팝업 페이지에서 오류가 발생했습니다.');
    		gfnShowLoadingBar(false);
    		gfnLayerPopupClose();
    		return;
    	}
		if(xhr.status == '401'){
    		toast.push('권한이 부족합니다.');
    		gfnShowLoadingBar(false);
    		gfnLayerPopupClose();
    		return;
    	}
	});
	
	//AJAX 전송
	ajaxObj.send();
	
	return layerBoxDivId;
}
