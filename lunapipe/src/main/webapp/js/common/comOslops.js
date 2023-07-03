
function gfnCommonSetting(searchObj,cmmCode,showSearchKey,hideSearchKey){
	

	// 팝업 공통코드 select 세팅
	var commonCodeArr = [
		{mstCd: cmmCode, useYn: "Y",targetObj: axdom("#" + searchObj.getItemId(showSearchKey)), comboType:"OS"} // 사용유무
	];
	
	//해당 선택상자 초기화
	axdom("#" + searchObj.getItemId(showSearchKey)).html('');
	
	//공통코드 불러오기
	getMulticommonCodeDataForm(commonCodeArr , false);
	
	axdom("#" + searchObj.getItemId(showSearchKey)).show();
	axdom("#" + searchObj.getItemId(hideSearchKey)).hide();
}


function gfnGetMultiCommonCodeDataForm(commonCodeArr , isAsyncMode){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1000/selectCmm1000MultiCommonCodeList.do"
				,"async":isAsyncMode,"loadingShow":false}
			,{commonCodeArr: JSON.stringify(commonCodeArr)});
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
    	if(data.ERROR_CODE == '-1'){
    		toast.push(data.ERROR_MSG);
			return;
		}
    	
    	//공통코드 데이터
    	var commonCodeList = data.commonCodeList;
    	
    	//파라미터 대상 object loop
    	$.each(commonCodeArr ,function(idx, map){
    		//넘겨받은 jsonData 불러오기
    		var subList = commonCodeList[map.targetObj];
    		
    		//콤보박스 세팅 타입
    		var comboType = map.comboType;
    		
    		//select target object
    		var $targetObject = $(map.targetObj);
    		
    		//target empty
    		$targetObject.empty();
    		
    		//target object empty check
    		if($targetObject == null || gfnIsNull(subList)){
    			return true;
    		}
    		
    		if(comboType == 'A'){
				//옵션키 A 로 세팅한 전 체(검색조건용)
    			$targetObject.append("<option value='A'>전체</option>");
			}
    		else if(comboType == 'N'){
    			//전체 한줄 추가
    			$targetObject.append("<option value=''>전체</option>");
			}
    		else if(comboType == 'S'){
    			//선택 한줄 추가
    			$targetObject.append("<option value=''>선택</option>");
			}
    		else if(comboType == 'E'){
    			//공백 한줄 추가
    			$targetObject.append("<option value=''></option>");
			}
			
    		//서브 코드 목록
    		$.each(subList, function(idx2, subMap){
    			//공통코드 조회 데이터에 서브값 존재한다면 조회해온 서브값과 일치하는 경우에만 옵션 추가
    			//서브값 1 존재하는 경우
    			if(!gfnIsNull(commonCodeArr[0].subCdRef1)){
    				//서브값 2 존재하는 경우
    				if(!gfnIsNull(commonCodeArr[0].subCdRef2)){
    					//서브값 3 존재하는 경우
    					if(!gfnIsNull(commonCodeArr[0].subCdRef3)){
    						//서브값 1,2,3 모두 존재하는 경우 조회된 1,2,3 데이터와 파라미터 서브값 1,2,3 데이터가 모두 일치하는 경우에 옵션추가
    						if(commonCodeArr[0].subCdRef1 == subMap.subCdRef1 && commonCodeArr[0].subCdRef2 == subMap.subCdRef2 && commonCodeArr[0].subCdRef3 == subMap.subCdRef3){
	    						$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
	    					}
    					//서브값 1, 서브값 2만 존재하는 겨웅 조회된 서브값 1,2 데이터와 파라미터 서브값 1,2 데이터가 모두 일치하는 경우에만 옵션 추가
    					}else{
    						if(commonCodeArr[0].subCdRef1 == subMap.subCdRef1 && commonCodeArr[0].subCdRef2 == subMap.subCdRef2){
	    						$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
	    					}
    					}
    				//서브값 1만 존재하는 경우 조회된 서브값 1 데이터와 파라미터 서브값 1 데이터가 일치하는 경우에만 옵션 추가
    				}else{
    					if(commonCodeArr[0].subCdRef1 == subMap.subCdRef1){
    						$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
    					}
    				}
    			//파라미터로 넘어온 서브값 없다면 옵션추가
    			} else {
    				$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
    			}
    		});
    		
    		//comboType이 OS인 경우 selected 지정
			var selVal = $targetObject.data("osl-value");
			//기존 값이 null인경우 선택 안함
			if(!gfnIsNull(selVal)){
				var $seledObj = $targetObject.children('option[value='+selVal+']');
				
				if($seledObj.length > 0){
					$seledObj.attr('selected','selected');
				}
			}
    	});
	});
	
	//AJAX 전송
	return ajaxObj.send();
}


function gfnAjaxRequestAction(property,data){
	//url, data
	this.url = "";
	this.data = "";
	
	// xml, json, script, html
	this.dataType ="json";
	
	//application/x-www-form-urlencoded, multipart/form-data, text/plain
	this.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
	
	//false = 비동기, true = 동기
	this.async = "false";
	
	//GET 방식 전달인 경우 IE 캐싱 문제 때문에 false로 설정해야 한다.
	this.cache = "true";
	
	//기본값인 true일 때 객체로 전달된 데이터를 쿼리 문자열로 변환한다. FormData 등 쿼리 문자열 변환이 불가능한 -비 처리된- 데이터를 전달할 때는 false로 설정한다.
	this.processData = "true";
	
	this.mimeType = "";
	
	//업로드 진행률 바 객체
	this.pgBarObj = null;
	
	//로딩 이미지 표시 유무(기본값 = 표시)
	this.loadingShow = true;
	
	//Success, beforeSend, complete, error에 null값인 경우 빈 Function 삽입
	//$.noop = jQuery에서 제공하는 빈함수 no-op
	this.fnSuccess = $.noop;
	this.fnbeforeSend = $.noop;
	this.fnComplete = $.noop;
	this.fnError = $.noop;

	//함수 setter
	this.setData = function setData(data){
		this.data = data;
	}
	this.setFnSuccess = function setFnSuccess(fnContent){
		this.fnSuccess = fnContent;
	}
	this.setFnbeforeSend = function setFnbeforeSend(fnContent){
		this.fnbeforeSend = fnContent;
	}
	this.setFnComplete = function setFnComplete(fnContent){
		this.fnComplete = fnContent;
	}
	this.setFnError = function setFnError(fnContent){
		this.fnError = fnContent;
	}

	//AJAX 옵션 설정
	this.setProperty = function setProperty(prop){
		if(!gfnIsNull(prop)){
			this.url = gfnIsNull(prop['url'])?this.url:prop['url'];
			this.data = gfnIsNull(prop['data'])?this.data:prop['data'];
			this.dataType = gfnIsNull(prop['dataType'])?this.dataType:prop['dataType'];
			this.contentType = gfnIsNull(prop['contentType'])?this.contentType:prop['contentType'];
			this.async = gfnIsNull(prop['async'])?this.async:prop['async'];
			this.cache = gfnIsNull(prop['cache'])?this.cache:prop['cache'];
			this.processData = gfnIsNull(prop['processData'])?this.processData:prop['processData'];
			this.mimeType = gfnIsNull(prop['mimeType'])?this.mimeType:prop['mimeType'];
			this.pgBarObj = gfnIsNull(prop['pgBarObj'])?this.pgBarObj:prop['pgBarObj'];
			this.loadingShow = gfnIsNull(prop['loadingShow'])?this.loadingShow:prop['loadingShow'];
		}
	}

	//생성자
	if(!gfnIsNull(property)){
		eval(this.setProperty(property));
	}
	if(!gfnIsNull(data)){
		eval(this.setData(data));
	}

	//AJAX 전송
	this.send = function send(){
		//AJAX 객체 변수
		var obj = this;
		
		//로딩 표시 변수
		var loadingShow = this.loadingShow;
		
		//응답 시간 체크
		var startAjaxTime = new Date().getTime();
		
		//AJAX 호출
		$.ajax({
	        type: "POST",
	        url: this.url,
	        data: this.data,
	        contentType: this.contentType,

	        async: this.async,
	        cache: this.cache,
	        processData: this.processData,
	        mimeType: this.mimeType,
	        xhr: function(){
	        	//게이지바 객체가 존재하지 않는 경우 (로딩 이미지 %)
	        	if(gfnIsNull(obj.pgBarObj)){
	        		return gfnLoadProgressStr();
	        	}else{
	        		return gfnLoadProgressBar(obj.pgBarObj);
	        	}
	        },
	        beforeSend: function(){
	        	//게이지바 객체가 존재하지 않는 경우 (로딩 이미지 %)
	        	if(gfnIsNull(obj.pgBarObj) && loadingShow){
		        	//로딩 게이지 바 출력
		    		gfnShowLoadingBar(true);
	        	}
	    		obj.fnbeforeSend();
	        },
	        success: function(data, status, xhr) {
	        	//응답 시간 계산
	        	var responeAjaxTime =  new Date().getTime()-startAjaxTime;
	        	obj.fnSuccess(data, status, xhr, responeAjaxTime);
	        	try{
	        		
	        	}catch(e){
	        		console.log("success error: ");
	        		console.log(e);
	        		return;
	        	}
	        },
	        error: function(xhr, status, err){
        		//그 외에 커스텀 에러 처리
        		obj.fnError(xhr, status, err);
	        	return;
	        },
	        complete: function(){
	        	//게이지바 객체가 존재하지 않는 경우 (로딩 이미지 %)
	        	if(gfnIsNull(obj.pgBarObj) && loadingShow){
	        		gfnShowLoadingBar(false);
	        	}
	        	obj.fnComplete();
	        }
	    });
	}
}



function gfnRequireCheck(formId, checkObjArr, checkObjNmArr){
	var inputCnt = checkObjArr.length;
	if(inputCnt < 1){
		return false;
	}
	
	 
	var value = '';
	for(var i = 0 ; i < inputCnt ; i++){
		value = eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".value");
		text = eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".text");
		inputType = (eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".type")).substring(0,3);
		nm = checkObjNmArr[i];
		// 필수 입력값 공백제거
		if($.trim(value).length < 1 ){
			jAlert(nm + ' 은(는) 필수 입력 사항입니다.\n\n\r ' + nm + ' 항목을 입력하세요.','알림창',function(){
				eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".focus()");
				
				//error 클래스 추가
				eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.add('inputError')");
			});
			
			return true;
		}
		else if(inputType == 'sel'){
			if(text == '선 택'){
				jAlert(nm + ' 은(는) 필수 선택 사항입니다.\n\n\r ' + nm + ' 항목을 입력하세요.','알림창',function(){
					eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".focus()");
					
					//error 클래스 추가
					eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.add('inputError')");
				});
				return true;
			}
		}
		
		//에러 없는경우 error class 확인후 제거
		var classChk = eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.contains('inputError')");
		if(classChk){
			//error class 제거
			eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.remove('inputError')");
		}
	}
	
	//필수 체크 전에 유효하지 않은 값이 있는 경우 오류
	if($(".inputError").length > 0){
		jAlert("유효하지 않은 값이 입력된 항목이 존재합니다.<br>항목을 확인해주세요.","알림");
		$(".inputError")[0].focus();
		return true;
	}
	
	return false ;
}



function gfnSetFormAllObjTabIndex(form){
	var list = document.getElementById(form).elements;
	var listCnt = document.getElementById(form).elements.length;
	var inputType;
	
	for(var i = 0 ; i < listCnt ; i++ ){
		inputType = list[i].type.substring(0,3);
		
		switch (inputType){
			case "sel" :
				$(list[i]).attr("tabindex", i + 1);
				break;
			case "che" :
				$(list[i]).attr("tabindex", i + 1);
				break;
			case "rad" :
				$(list[i]).attr("tabindex", i + 1);
				break;
			default :
				$(list[i]).attr("tabindex", i + 1);
				break;
		}
		
	}
}




function gfnSetData2ParentObj(jsonObj, parentObjId){

	var child = null;
	var strType = null;
	
	//해당하는 키 찾아서 폼안에 존재하는  세팅
	$.each(jsonObj, function(key, val){
		try{
			
			val = gfnReplace(val, null, '');
			
			child = $("#" + parentObjId + " #" + key);
			strType = $("#" + parentObjId + " #" + key).attr("type");	
        	
			//radio의 경우 child가 배열형태가 되므로, child의 타입을 알수 없다.
	        if (typeof strType == "undefined" && child.length > 0) {
	            strType = child[0].type;
	        }
			
	        if(typeof strType == "undefined" && child.length > 0){
	        	
	        	$("#" + parentObjId + " #" + key).text(val);
	        	$("#" + parentObjId + " #" + key).val(val);
	        }
	        else{
	        	//타입별로 값을 설정한다.
		        switch(strType) {
		            case undefined:
		            case "button":
		            case "reset":
		            case "submit":
		                break;
		            case "select-one":
		            	if(!gfnIsNull(val)){
		            		$(child).val(val);
		            	}
		                break;
		            case "radio":
		                
		            case "checkbox":
		                child.checked = (val == 1);
		                break;
		            case "textarea":
		            	
		            	$(child).val(val.replace(/(<\/br>|<br>|<br\/>|<br \/>)/gi, '\r\n'));
		            	break;
		            default :
		                if(!gfnIsNull(val)){
		            		$(child).val(val);
		            	}
		                break;
		        }
	        }
		}
		catch(e){
			//해당사항 없어도 넘김.
		}
	});
}


function gfnShowLoadingBar(isShow, callbackFn){
	if(isShow){
		$(".top_fixed").show(100, callbackFn);
	}
	else{
		$(".top_fixed").hide(100, callbackFn);
		$('.top_str').html('');
	}
}


function gfnLayerPopupOpen(url, data, width, height, overflowY, loadingShow){
	//레이어 팝업이 2개 오픈된 경우, 3개 이상부터 경고창 알림
//	if(!gfnIsNull($('.layer_popup_box')) && $('.layer_popup_box').length >= 1){
//		jAlert("팝업 오픈은 1개까지만 가능합니다.");
//		return false;
//	}
	width = Number(width);
	height = Number(height);
	//입력받은 넓이와 높이값이 숫자가 아니면 강제 리턴
	if(isNaN(width) || isNaN(height)){
		jAlert('입력한 높이와 넓이의 값이 숫자가 아닙니다.','알림창');
		return;
	}
	
	var boxLength=$(".layer_popup_box").length;
	var maxZIndex=0;
	var valid = false;
	$(".layer_popup_box").each(function(idx, item){
		var zIndex= $(item).css("z-index");

		if($(item).attr("layerurl")==url ){
			valid = true;
		}
		
		if(maxZIndex < zIndex ){
			maxZIndex = zIndex;
		}
	});
	
	if(valid){
		return;
	}
			
	var layerBoxDivId= layer_popup(url, data,loadingShow);
	var cssObj = {};
	
	if(maxZIndex==0){
		cssObj = {	
				"width" : width + "px",
				"height" : height + "px"				
			};
	}else{
		cssObj = {	
			"width" : width + "px",
			"height" : height + "px",
			"z-index" : parseInt(maxZIndex)+1
		};
	}	
	$('#'+layerBoxDivId).css(cssObj);
	
	if(overflowY != null){
		//브라우저 height보다 같거나 클 경우 overflowY 적용함
		if($(window).height() <= $('#'+layerBoxDivId).height()){
			$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : overflowY});
			
			//height 증가
			$('#'+layerBoxDivId).width($('#'+layerBoxDivId).width()+15);
		}
		
		//브라우저 크기 조절할 경우 위와 같은 분기
		$(window).resize(function(){
			//윈도우 크기 변경 될 경우 스크롤 고정 오류를 해결하기 위해 스크롤 위치 최상
			$('#'+layerBoxDivId+' .ajax_box').scrollTop(0);
			
			if($(window).height() <= $('.layer_popup_box').height()){
				$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : overflowY});
				//$('#'+layerBoxDivId).width($('#'+layerBoxDivId).width()+15);
			}else{
				$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : "hidden"});
				//스크롤이 toggle될 경우 스크롤 width 공백 현상 수정
				$('.layerpopup.user_pop_wrap').width($('.layer_popup_box .ajax_box').width());
			}
		});
	}else{
		$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : ""});
	}
 
		if($('#'+layerBoxDivId+' .pop_left').length > 0){
			var bodyFont = $('body').css("font-size").replace('px','') % 16;
			var paddingSize = $('#'+layerBoxDivId+' .pop_left').css('padding-top').replace('px','');
		if(bodyFont<10){
			$('#'+layerBoxDivId+' .pop_left').css({'padding-top': paddingSize - bodyFont/2, 'padding-bottom': paddingSize - bodyFont/2});  
		}
	}
}





function gfnLayerPopupClose(){
	//팝업 가이드 상자 존재하는경우
	gfnGuideStack("del");
	globals_guideChkFn = null;
	
	var maxDiv="";
	var maxZIndex = 0;
	$(".layer_popup_box").each(function(idx, item){
		var zIndex= $(item).css("z-index");
		if(maxZIndex < zIndex ){
			maxZIndex = zIndex;
			maxDiv= $(item).attr('id');
		}
	});
		
	$("#"+maxDiv).remove();
	var layerlength=$(".layer_popup_box").length;
	if(layerlength==0){
		$(".bg").remove();
		$("body").removeClass("bhpf");
	}else{
		$("#lpxBgF_"+layerlength).remove();
		$("#lpxBgS_"+layerlength).remove();
	}
	
	
}


function gfnCalRangeSet(fromId, toId, grpFromDt, grpEndDt,timeUseCd){
	
	//Date type
	var format = 'YYYY-MM-DD';
	var subFormat = 'yyyy-MM-dd'
	
	// 날짜 범위 구하기 (현재년도-10년 1월1일 ~ 현재년도+10년 12월 31일)
	var minDate = new Date(new Date().getFullYear()-10, 0, 1).format(subFormat);
	var maxDate = new Date(new Date().getFullYear()+10, 12, 0).format(subFormat);
	
	//timePicker 사용유무
	var timePicker = false;
	if(!gfnIsNull(timeUseCd) && timeUseCd){
		timePicker = true;
		format += " HH:mm";
		subFormat += " HH:mm";
	}
	
	var fromData = $("#" + fromId).val();
	var toData = $("#" + toId).val();
	var fromStartDate = new Date(fromData).format(subFormat);
	var toStartDate = new Date(toData).format(subFormat);
	
	$("#" + fromId).daterangepicker({
		showDropdowns:true,
		singleDatePicker:true,
		timePicker: timePicker,
		timePicker24Hour:true,
		autoUpdateInput:false,
		applyLabel: "적용",
		minDate: minDate,
		maxDate: maxDate,
		buttonClasses:"button_normal2",
		locale: {
		format: format,
			"daysOfWeek": ["일","월","화","수","목","금","토"],
			"monthNames": ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
			"separator": " ~ ",
			"applyLabel": "적용",
			"cancelLabel": "취소",
			"customRangeLabel": "사용자 지정",
		}
	},function( selectedDate,picker ) {
		$("#" + fromId).val(this.startDate.format(this.locale.format));
    	$("#" + toId ).data('daterangepicker').setMinDate(new Date(selectedDate._d).format(subFormat));
    });
	
	$("#" + toId).daterangepicker({
		showDropdowns:true,
		singleDatePicker:true,
		timePicker: timePicker,
		timePicker24Hour:true,
		autoUpdateInput:false,
		applyLabel: "적용",
		minDate: minDate,
		maxDate: maxDate,
		buttonClasses:"button_normal2",
		locale: {
		format: format,
			"daysOfWeek": ["일","월","화","수","목","금","토"],
			"monthNames": ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
			"separator": " ~ ",
			"applyLabel": "적용",
			"cancelLabel": "취소",
			"customRangeLabel": "사용자 지정",
		}
	},function( selectedDate ) {
		$("#" + toId).val(this.startDate.format(this.locale.format));
    	$("#" + fromId ).data('daterangepicker').setMaxDate(new Date(selectedDate._d).format(subFormat));
    });
	
	//값이 있는경우 startDate 삽입
	if(!gfnIsNull(fromData)){
		$("#" + fromId ).data('daterangepicker').setStartDate(fromStartDate);
	}
	if(!gfnIsNull(toData)){
		$("#" + toId ).data('daterangepicker').setStartDate(toStartDate);
	}
	
	inFnGrpDateSet();
	
	//내부 함수
	function inFnGrpDateSet(){
		//그룹 기간이 존재하는 경우 옵션 추가
		if(!gfnIsNull(grpFromDt)){
			$("#" + toId ).data('daterangepicker').setMinDate(grpFromDt);
			$("#" + fromId ).data('daterangepicker').setMinDate(grpFromDt);
		}	
		
		if(!gfnIsNull(grpEndDt)){
			$("#" + toId ).data('daterangepicker').setMaxDate(grpEndDt);
			$("#" + fromId ).data('daterangepicker').setMaxDate(grpEndDt);
		}
	}
	//$.datepicker.setDefaults($.datepicker.regional['ko']);
}


function gfnCalRangeDel(fromId, toId){
	$( "#" + fromId ).data('daterangepicker').remove();
	$( "#" + fromId ).next().remove();
	$( "#" + toId).data('daterangepicker').remove();
	$( "#" + toId ).next().remove();
	
}


function gfnCalSet(formatType){
	
	//년 범위 구하기 (-10 ~ +10)
	var minYear = new Date().getFullYear()-10;
	var maxYear = new Date().getFullYear()+10;
	
	//동적 매개변수 루프
	for(var i=1;i<arguments.length;i++){
		$("#" + arguments[i]).daterangepicker({
			showDropdowns:true,
			singleDatePicker:true,
			timePicker: false,
			timePicker24Hour:true,
			autoUpdateInput:false,
			applyLabel: "적용",
			minYear: minYear,
			maxYear: maxYear,
			buttonClasses:"button_normal2",
			locale: {
			format: formatType,
				"daysOfWeek": ["일","월","화","수","목","금","토"],
				"monthNames": ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
				"separator": " ~ ",
				"applyLabel": "적용",
				"cancelLabel": "취소",
				"customRangeLabel": "사용자 지정",
			}
		},function( selectedDate ) {
			this.element.val(this.startDate.format(this.locale.format));
	    });
	}
	//$.datepicker.setDefaults($.datepicker.regional['ko']);
}


function gfnCalendarSet(formatType,elementIds,options){
	
	//Date type
	var subFormat = 'yyyy-MM-dd'
	
	// 날짜 범위 구하기 (현재년도-10년 1월1일 ~ 현재년도+10년 12월 31일)
	var minDate = new Date(new Date().getFullYear()-10, 0, 1).format(subFormat);
	var maxDate = new Date(new Date().getFullYear()+10, 12, 0).format(subFormat);
	
	//동적 매개변수 루프
	var dateObjects = {};	
	for(var i=0;i<elementIds.length;i++){
		//date type 매개변수 제외하고 datepicker 삽입
		dateObjects = {
			showDropdowns:true,
			singleDatePicker:true,
			timePicker: false,
			timePicker24Hour:true,
			autoUpdateInput:false,
			minDate: minDate,
			maxDate: maxDate,
			applyLabel: "적용",
			buttonClasses:"button_normal2",
			locale: {
			format: formatType,
				"daysOfWeek": ["일","월","화","수","목","금","토"],
				"monthNames": ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
				"separator": " ~ ",
				"applyLabel": "적용",
				"cancelLabel": "취소",
				"customRangeLabel": "사용자 지정",
			}
		};
		
		if(!gfnIsNull(options)){
			$.each(options,function(key, value) {
				dateObjects[key]=value;
			});
		}
		
		$("#" + elementIds[i]).daterangepicker(dateObjects,function( selectedDate ) {
			this.element.val(this.startDate.format(this.locale.format));
	    });
		//$("#" + elementIds[i]).datepicker( dateObjects );
	}	
	//$.datepicker.setDefaults($.datepicker.regional['ko']);
	
}



function gfnIsNull(sValue)
{
	if( typeof sValue == "undefined") {
        return true;
    }
    if( String(sValue).valueOf() == "undefined") {
        return true;
    }
    if( sValue == null ){
        return true;
    }
    if( ("x"+sValue == "xNaN") && ( new String(sValue.length).valueOf() == "undefined" ) ){
        return true;
    }
    if( sValue.length == 0 ){
        return true;
    }
    if( sValue == "NaN"){
        return true;
    }

    return false;
}


function gfnReplace( sOrg, sRepFrom, sRepTo )
{
	var pos, nStart=0, sRet="";

	sOrg = gfnStr(sOrg);

	if( gfnIsNull(sOrg) )			return "";
	if( gfnIsNull(sRepFrom) )		return sOrg;
	
	while(1){
		pos = gfnPos( sOrg, sRepFrom, nStart );
		if( pos < 0 ){
			sRet += sOrg.substr( nStart );
			break;
		}else{
			sRet += sOrg.substr( nStart, pos - nStart);
			sRet += sRepTo;
			nStart = pos+sRepFrom.length;
		}
	}
	return sRet;
}

function gfnStr(sText){
	if(sText == undefined) return "";
	if(sText == null) return "";
	if(sText instanceof String) return sText;

	return ""+sText;
}

String.prototype.format = function (args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";
		} else {
			replace = "";
		}
		return replace;
	});
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");


function gfnLoadProgressStr(){
	var xhr = new window.XMLHttpRequest();
    //Upload progress
    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        var percentComplete = evt.loaded / evt.total;
        //Do something with upload progress
        $('.top_str').html(parseInt(percentComplete*100)+'%');
      }
    }, false);
    return xhr;
}


function gfnLoadProgressBar(pgBarObj){
	var xhr = new window.XMLHttpRequest();
	
	//업로드 객체가 존재하는 경우에만 게이지 바 동작
	if(!gfnIsNull(pgBarObj)){
	    //Upload progress
	    xhr.upload.addEventListener("progress", function(evt){
	      if (evt.lengthComputable) {
	        var percentComplete = evt.loaded / evt.total;
	        //단건인경우
	        if(Object.isArray(pgBarObj)){
	        	var pgBarObj_bottomBar = $(pgBarObj[0]).children('.file_progressBar').children('div');
	        	//게이지바 width 조절
	        	pgBarObj_bottomBar.stop().animate({width:(percentComplete*100)+'%'},1);
	        }
	        else{ //배열인경우
	        	$.each(pgBarObj,function(idx, map){
	        		var pgBarObj_bottomBar = $(map).children('.file_progressBar').children('div');
		        	//게이지바 width 조절
		        	pgBarObj_bottomBar.stop().animate({width:(percentComplete*100)+'%'},1);
	        	});
	        }
	      }
	    }, false);
	}
    return xhr;
}


//getTime to date
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    if(gfnIsNull(f)){
    	f = "yyyy-mm-dd";
    }
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|ms|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "ms": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


function gfnCheckStrLength(str,len) {
	var temp = "";
	
	//str이 빈 값일 경우 str그대로 반환
	if(gfnIsNull(str)){
		return str;
	}
	var strLen = str.length;

	if(len > 0 || len == null){
		if(strLen > len){
			temp = str.substring(0, len) + "...";
		}
		else{
			temp = str;
		}
	}else{
		temp = str;
	}
	
	//< > 제거
	temp = temp.replace(/</g,"&lt;").replace(/>/g,"&gt;");
	
	return temp;
}


function gfnEnterAction2(fnc){
	//동적 매개변수 루프
	for(var i=1;i<arguments.length;i++){
		//실행 함수 제외하고 keypress 이벤트 삽입
		$('#' + arguments[i]).keypress(function(e) {
			var key = e.which;
			if (key == 13) {
				eval(fnc);
			}
		});
	}
	
}


function gfnFormDataAutoValue(formName,fd){
	var fdInput = $('#'+formName+' input');
	var fdSelect = $('#'+formName+' select');
	var fdText = $('#'+formName+' textarea'); 

	$.each(fdInput, function(index, element){
		fd.append(element.id,element.value);
	});
	$.each(fdSelect, function(index, element){
		fd.append(element.id,element.value);
	});
	$.each(fdText, function(index, element){
		// textarea에 <br>들어가는 부분 주석처리
		//fd.append(element.id,element.value.replace(/\n/gi,'<br>'));
		fd.append(element.id,element.value);
	});
}


function gfnFormDataAutoJsonValue(formName,fd){
	//input, select, textarea 객체 구하기
	var fdInput = $('#'+formName+' input');
	var fdSelect = $('#'+formName+' select');
	var fdText = $('#'+formName+' textarea');
	
	//array merge
	var fdEle;
	
	fdEle = $.merge(fdInput,fdSelect);
	fdEle = $.merge(fdEle,fdText);
	
	$.each(fdEle, function(index, element){
		//id값이 없다면 수집하지 않음
		if(gfnIsNull(element.id)){
			return true;
		}
		//항목 작업흐름
		var optFlowId = element.getAttribute("optflowid");
		
		//항목 타겟
		var chgDetailOptTarget = element.getAttribute("opttarget");
		
		//항목 타겟 없는경우 normal
		if(gfnIsNull(chgDetailOptTarget)){
			chgDetailOptTarget = "01";
		}
		
		//항목 타입
		var chgDetailOptType = element.getAttribute("opttype");
		
		//항목 타입 없는경우 normal
		if(gfnIsNull(chgDetailOptType)){
			chgDetailOptType = "01";
		}
		
		//항목 공통코드
		var chgDetailCommonCd = element.getAttribute("cmmcode");
		
		//항목 공통코드 없는경우 공백
		if(gfnIsNull(chgDetailCommonCd)){
			chgDetailCommonCd = "";
		}
		
		//결과값에 포함시키지 않는 경우 제외
		var modifySetCd = element.getAttribute("modifyset");
		
		//수정 이력 저장 구분 값 없는경우 01
		if(gfnIsNull(modifySetCd)){
			modifySetCd = "01";
		}
		
		//타입 hidden도 jsonData 로 포함시킬 것인지
		var hiddenSet = element.getAttribute("hiddenset");
		
		//hidden 포함 구분 값 없는 경우 02
		if(gfnIsNull(hiddenSet)){
			hiddenSet = "02";
		}
		
		
		//개체 항목 명 (title)
		var eleTitle = element.title;
		
		//개체 항목 명 없는경우 id값이 항목 명
		if(gfnIsNull(eleTitle)){
			eleTitle = element.id;
		}
		
		//개체 값(value)
		// 추가항목 textarea </br> 들어가는 부분 주석
		//var eleValue = element.value.replace(/\n/gi,'</br>');
		var eleValue = element.value;
		
		//체크 박스인경우 checked로 값 판별
		if(element.type == "checkbox"){
			eleValue = (element.checked)?"01":"02";
		}
		
		//jsonData
		var rtnVal = JSON.stringify({optNm:eleTitle,optVal:eleValue,chgDetailOptTarget:chgDetailOptTarget, chgDetailOptType:chgDetailOptType, chgDetailCommonCd:chgDetailCommonCd, modifySetCd:modifySetCd, optFlowId: optFlowId});
		
		//hidden인경우 String, 배포계획, 사용자, 공통코드 제외 (hiddenSet == 02인 경우 제외)
		if(chgDetailOptType != "05" && chgDetailOptType != "03" && chgDetailOptType != "02" && hiddenSet == "02" && element.type == "hidden"){
			rtnVal = eleValue;
		}
		fd.append(element.id,rtnVal);
	});
}


function gfnIsNumeric(obj){
	var pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z]/g;
	if($.isNumeric($("#"+obj).val()) == false || pattern.test($("#"+obj).val()) == true){
		if(!gfnIsNull($("#"+obj).val())){
			jAlert("숫자만 입력 가능합니다.", "알림창");
			$("#"+obj).val($("#"+obj).val().replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z]/g, ''));
			$("#"+obj).focus();
			return false;
		}else{
			return true;
		}
		
	}else{
		return true;
	}
}



function gfnIsLength(objName,objDesc,size){
	var fnObj = null;
	
	//객체명 ID값으로 검색
	if(!gfnIsNull($('#'+objName))){
		fnObj = $('#'+objName);
	}else if(!gfnIsNull($('.'+objName))){
		//객체명 Class값으로 검색
		fnObj = $('.'+objName);
	}
	//검색 결과 없는 경우 
	if(fnObj == null){
		alert(objDesc+" 입력 폼에 값이 입력되지 않았습니다.");
		return true;
	}else if(fnObj.val().length > size){
		alert(objDesc+" 입력 폼에 값이 지정된 길이를 초과했습니다.("+size+")");
		return false;
	}
	
}


function gfnInputValChk(arrObj){
    //오브젝트
    var chkObj;
    //조건 정규표현식
    var pattern;
    //치환 정규표현식
    var rpPattern;
    rtn = true;

    $.each(arrObj,function(objNm,objType){
        //오브젝트 구하기
        if(!gfnIsNull($('#'+objNm))){
            chkObj = $('#'+objNm);
        }else if(!gfnIsNull($('input[name='+objNm+']'))){
            //id값 없는경우 name으로 찾음
            chkObj = $('input[name='+objNm+']');
        }else{
        	//찾을 수 없는 오브젝트인 경우 each break;
            return false;
        }
        
        //숫자 인지 확인
        if(objType.type == "number"){
         //input 입력 후 input box 키 입력 시 발생
            rpPattern = /[^0-9]/g;
            
            $(chkObj).keyup(function(e){
                var onKeyVar = parseInt(e.key);
                
                //컨트롤 + v인경우 문자열 찾기 제외
                if(rpPattern.test(onKeyVar) && (!e.ctrlKey && !e.key == "v")){
                    //숫자가 아닌 문자열을 공백으로 치환
                    $(this).val($(this).val().replace(rpPattern, ''));
			        $(this).focus();
			        return true;
                }
                else if(!gfnIsNull($(this).attr('min')) && parseInt($(this).val()) < parseInt($(this).attr('min'))){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    //마지막 입력 값 지우기
                    $(this).val($(this).val().substring(0,$(this).val().length-1));
                    return true;
                }
                else if(!gfnIsNull($(this).attr('max')) && parseInt($(this).val()) > parseInt($(this).attr('max'))){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    
                    //마지막 입력 값 지우기
                    $(this).val($(this).val().substring(0,$(this).val().length-1));
                    return true;
                }
                //max가 없는경우 99999999 기본값
                else if(gfnIsNull($(this).attr('max')) && parseInt($(this).val()) > 99999999){
                	jAlert("숫자 입력은 최대 99999999 까지 입력 가능합니다.","알림");
                	
                	//마지막 입력 값 지우기
                    $(this).val("99999999");
                    return true;
                }
                else{
                	//형식이 정상일 때 inputError Class가 존재한다면 제거
                    if($(this).hasClass("inputError")){
                        $(this).removeClass("inputError");
                    }
                }
                
            });
	     //영문 인지 확인
        }else if(objType.type == "english"){
	        	
	            $(chkObj).keyup(function(e){

					// 영문만 입력
                    if (!(event.keyCode >=37 && event.keyCode<=40)) {
                    	var inputVal = $(this).val();
                        // 옵션에 따라 정규식 변경
                        //  - "engOption":"IncludeNumber" 옵션 있을 경우 영문,숫자입력 체크 
                        //  - engOption 옵션이 없을경우 영문만 입력 체크
                        if(!gfnIsNull(objType.engOption) && objType.engOption == "includeNumber"){
                        	// 영문, 숫자 아닌것은 제거
                            $(this).val(inputVal.replace(/[^a-z0-9]/gi,'')); 
                        }else{
                        	// 영문이 아닌것은 제거
                           $(this).val(inputVal.replace(/[^a-z]/gi,'')); 
                        }
                    }else{
	                	//형식이 정상일 때 inputError Class가 존재한다면 제거
	                    if($(this).hasClass("inputError")){
	                        $(this).removeClass("inputError");
	                    }
	                }
	            });   
        }else if(objType.type == "length"){
        	
         //input 입력 후 input box 키 입력 시 발생
            $(chkObj).keyup(function(e){
            	//문자열 길이 확인
                if(!gfnIsNull($(this).val())){
                	//Byte값 저장 변수
                	var charByte = 0;
                	//실제 길이 변수
                    var len = 0;
                    for (i = 0; i < $(this).val().length; i++) {
                        var oneChar = $(this).val().charAt(i);
                        if (escape(oneChar).length > 4) {
                        	charByte += 2;
                        } else {
                        	charByte++;
                        }
                        if (charByte <= objType.max) {
                        	len = i+1;
                        }
                    }
                    if(charByte > objType.max){
                    	//msg있는 경우 출력
                        if(!gfnIsNull(objType.msg)){
                        	jAlert(objType.msg,"알림");
                        	
                        	//input box Class에 빨간 테두리 넣기
                        	//$(this).addClass("inputError");
                        }
                      //문자열 길이 오버된 경우 최대 문자 갯수 까지 자르기
                        $(this).val($(this).val().substring(0,len));
                    }else{
                    	//형식이 정상일 때 inputError Class가 존재한다면 제거
                        if($(this).hasClass("inputError")){
                            $(this).removeClass("inputError");
                        }
                    }
                }
            });
            
            //최소 길이 제한이 있는 경우 blur 조건
            if(!gfnIsNull(objType.min)){
            	$(chkObj).blur(function(e){
                    if($(this).val().length < objType.min){
                    	//msg있는 경우 출력
                        if(!gfnIsNull(objType.msg)){
                        	jAlert(objType.msg,"알림");
                        }
                        //input box Class에 빨간 테두리 넣기
                        $(this).addClass("inputError");
                    }else{
                    	//이메일 형식이 정상일 때 inputError Class가 존재한다면 제거
                        if($(this).hasClass("inputError")){
                            $(this).removeClass("inputError");
                        }
                    }
                });
            }
          //이메일 체크
        }else if(objType.type == "email"){
            //input 입력 후 input box 포커스를 잃었을 때 발생
            pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            $(chkObj).blur(function(e){
                if(pattern.test($(this).val()) == false){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    //input box Class에 빨간 테두리 넣기
                    $(this).addClass("inputError");
                }else{
                	//이메일 형식이 정상일 때 inputError Class가 존재한다면 제거
                    if($(this).hasClass("inputError")){
                        $(this).removeClass("inputError");
                    }
                }
            });
            //그외에 SubType 모두 지정 분기
        }else if(objType.type == "etc"){
        	//이벤트 모션
        	var eventHandler;
        	if(!gfnIsNull(objType.event)){
        		eventHandler = objType.event;
        	}
        	//정규식 패턴
        	if(!gfnIsNull(objType.pattern)){
        		//지역변수로 선언
        		var pattern = objType.pattern;
        	}
        	//정규식 치환 패턴
        	if(!gfnIsNull(objType.rpPattern)){
        		//지역변수로 선언
        		var rpPattern = objType.rpPattern;
        	}
        	$(chkObj).on(eventHandler,function(e){
        		if(pattern.test($(this).val()) == false){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    
                    //rpPattern이 있는지 확인
                    if(!gfnIsNull(rpPattern)){
	                    $(this).val($(this).val().replace(rpPattern, ''));
				        $(this).focus();
                    }else{
                    	//input box Class에 빨간 테두리 넣기
                        $(this).addClass("inputError");
    			        return false;
                    }
                }else{
                	if(gfnIsNull(rpPattern)){
	                	//형식이 정상일 때 inputError Class가 존재한다면 제거
	                    if($(this).hasClass("inputError")){
	                        $(this).removeClass("inputError");
	                    }
                	}
                }
        	});
        }else if(objType.type == "regExp"){
        	if( objType.required  ||    										//required 속성  'true'  이면 필수값이므로 정규식 검사
         			( objType.required == false && !gfnIsNull($("#"+objNm).val()) ) ) { //required 속성  'false' 이면  필수값이 아니므로 빈값이면 정규식 미검사 , 빈값이 아니면 정규식 검사     
	        	//정규식 패턴
	        	if(!gfnIsNull(objType.pattern)) {
	        		var pattern = objType.pattern;
	        	}
	        	if(new RegExp(pattern).test($("#"+objNm).val()) == false){
	        		
	            	//msg있는 경우 출력
	                if(!gfnIsNull(objType.msg)){
	                	if(objType.msgType != "toast"){
	                		jAlert(objType.msg,"알림");
	                	}
	                	toast.push({body:objType.msg, type:'Warning'});
	                	rtn = false;
	                	$(chkObj).addClass("inputError");
	                }
	            }else{
	            	
	            	//형식이 정상일 때 inputError Class가 존재한다면 제거
	                if($(chkObj).hasClass("inputError")){
	                   $(chkObj).removeClass("inputError");
	                }
	            }
	        //필수 값 아니고 값도 없는데 inputError Class 있다면 제거
        	}else if(objType.required == false && gfnIsNull($("#"+objNm).val())){
        		//형식이 정상일 때 inputError Class가 존재한다면 제거
                if($(chkObj).hasClass("inputError")){
                   $(chkObj).removeClass("inputError");
                }
        	}
        }
      
    });
    return rtn;
}



function gfnSaveInputValChk(arrObj){
    //오브젝트
    var chkObj;
    //조건 정규표현식
    var pattern;
    //치환 정규표현식
    var rpPattern;
    var rtn = true;
  
    $.each(arrObj,function(objNm,objType){  
        //오브젝트 구하기
        if(!gfnIsNull($('#'+objNm))){
            chkObj = $('#'+objNm);
        }else if(!gfnIsNull($('input[name='+objNm+']'))){
            //id값 없는경우 name으로 찾음
            chkObj = $('input[name='+objNm+']'); 
        }else{
        	//찾을 수 없는 오브젝트인 경우 each break;
            return false;
        }
      
        // 숫자인지 확인
        if(objType.type == "number"){
        	pattern = /[^0-9]/g; 

                   if(pattern.test($(chkObj).val())){	
                	   // 문자인 경우
                	   $(chkObj).addClass("inputError");
                	   $(chkObj).focus();
                	   rtn = false;
                	   return false;
                   }
                  else if(!gfnIsNull(objType.min) && parseInt($(chkObj).val()) < parseInt(objType.min)){
                   	//msg있는 경우 출력
                       if(!gfnIsNull(objType.msg)){
                       		jAlert(objType.msg,"알림");
                       }
                       $(chkObj).addClass("inputError");
                	   $(chkObj).focus();
                       rtn = false;
                       return false;
                   }
                   else if(!gfnIsNull(objType.max) && parseInt($(chkObj).val()) > parseInt(objType.max)){
                   		//msg있는 경우 출력
                	   if(!gfnIsNull(objType.msg)){
                		   jAlert(objType.msg,"알림");
                       }
                	   
                       $(chkObj).addClass("inputError");
                	   $(chkObj).focus();
                       rtn = false;
                       //return false;
                   }
                   else{
                   	//형식이 정상일 때 inputError Class가 존재한다면 제거
                       if($(chkObj).hasClass("inputError")){
                    	   $(chkObj).removeClass("inputError");
                       }
                       rtn = true;
                   }
                   

   	     //영문 인지 확인
       }else if(objType.type == "english"){

    	   pattern = /[^a-zA-Z]/gi;
    	   
			// 영문이 아니라면
           if ( pattern.test($(chkObj).val()) ) {
        	   $(chkObj).addClass("inputError");
        	   $(chkObj).focus();
        	   rtn = false;
               return false;
           }else{
           	//형식이 정상일 때 inputError Class가 존재한다면 제거
               if($(chkObj).hasClass("inputError")){
            	   $(chkObj).removeClass("inputError");
               }
               rtn = true;
           }

       }else if(objType.type == "length"){
           //input 입력 후 input box 키 입력 시 발생
              	//문자열 길이 확인
                  if(!gfnIsNull($(chkObj).val())){
                  	//Byte값 저장 변수
                  	var charByte = 0;
                  	//실제 길이 변수
                      var len = 0;
                      for (i = 0; i < $(chkObj).val().length; i++) {
                          var oneChar = $(chkObj).val().charAt(i);
                          if (escape(oneChar).length > 4) {
                          	charByte += 2;
                          } else {
                          	charByte++;
                          }
                          if (charByte <= objType.max) {
                          	len = i+1;
                          }
                      }

                      // max값 보다 입력된 byte값이 크다면
                      if(charByte > objType.max){
                      	//msg있는 경우 출력
                          if(!gfnIsNull(objType.msg)){   
                          	jAlert(objType.msg,"알림");
                          }
                        //input box Class에 빨간 테두리 넣기
                         // $(chkObj).addClass("inputError");
	                   	  $(chkObj).focus();
	                      rtn = false;
	                      return false;
                      }else{
                      	//형식이 정상일 때 inputError Class가 존재한다면 제거
                          if($(chkObj).hasClass("inputError")){
                        	  $(chkObj).removeClass("inputError");
                          }
                          rtn = true;
                      }
                  }

              
              //최소 길이 제한이 있는 경우 blur 조건
              if(!gfnIsNull(objType.min)){

                      if($(chkObj).val().length < objType.min){
                      	//msg있는 경우 출력
                          if(!gfnIsNull(objType.msg)){
                          	jAlert(objType.msg,"알림");
                          }
                          //input box Class에 빨간 테두리 넣기
                          $(chkObj).addClass("inputError");
	                   	  $(chkObj).focus();
                          rtn = false;
                          return false;
                      }else{
                      	//이메일 형식이 정상일 때 inputError Class가 존재한다면 제거
                          if(chkObj.hasClass("inputError")){
                        	  chkObj.removeClass("inputError");
                          }
                      }

              }
            //이메일 체크
          }else if(objType.type == "email"){
              //input 입력 후 input box 포커스를 잃었을 때 발생
              pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
                  if(pattern.test($(chkObj).val()) == false){
                  	//msg있는 경우 출력
                      if(!gfnIsNull(objType.msg)){
                      	jAlert(objType.msg,"알림");
                      }
                      //input box Class에 빨간 테두리 넣기
                      $(chkObj).addClass("inputError");
                   	  $(chkObj).focus();
                   	  rtn = false;
                   	  return false;
                  }else{
                  	//이메일 형식이 정상일 때 inputError Class가 존재한다면 제거
                      if($(chkObj).hasClass("inputError")){
                    	  $(chkObj).removeClass("inputError");
                      }
                  }
              //그외에 SubType 모두 지정 분기
          }else if(objType.type == "etc"){
          	//이벤트 모션
          	var eventHandler;
          	if(!gfnIsNull(objType.event)){
          		eventHandler = objType.event;
          	}
          	//정규식 패턴
          	if(!gfnIsNull(objType.pattern)){
          		//지역변수로 선언
          		var pattern = objType.pattern;
          	}
          	//정규식 치환 패턴
          	if(!gfnIsNull(objType.rpPattern)){
          		//지역변수로 선언
          		var rpPattern = objType.rpPattern;
          	}
          	$($(chkObj)).on(eventHandler,function(e){
          		if(pattern.test($(chkObj).val()) == false){
                  	//msg있는 경우 출력
                      if(!gfnIsNull(objType.msg)){
                      	jAlert(objType.msg,"알림");
                      }
                      
                      //rpPattern이 있는지 확인
                      if(!gfnIsNull(rpPattern)){
                    	  $(chkObj).val($(chkObj).val().replace(rpPattern, ''));
                    	  $(chkObj).focus();
                      }else{
                      	//input box Class에 빨간 테두리 넣기
                          $(chkObj).addClass("inputError");
                       	  $(chkObj).focus();
                       	  rtn = false;
      			        return false;
                      }
                  }else{
                  	if(gfnIsNull(rpPattern)){
  	                	//형식이 정상일 때 inputError Class가 존재한다면 제거
  	                    if($(chkObj).hasClass("inputError")){
  	                    	$(chkObj).removeClass("inputError");
  	                    }
                  	}
                  }
          	});
          	// 정규식 
          }else if(objType.type == "regExp"){
        	if( objType.required  ||    										//required 속성  'true'  이면 필수값이므로 정규식 검사
         			( objType.required == false && !gfnIsNull($("#"+objNm).val()) ) ) { //required 속성  'false' 이면  필수값이 아니므로 빈값이면 정규식 미검사 , 빈값이 아니면 정규식 검사     
	        	//정규식 패턴
	        	if(!gfnIsNull(objType.pattern)) {
	        		var pattern = objType.pattern;
	        	}
	        	if(new RegExp(pattern).test($("#"+objNm).val()) == false){
	        		
	            	//msg있는 경우 출력
	                if(!gfnIsNull(objType.msg)){
	                	if(objType.msgType != "toast"){
	                		jAlert(objType.msg,"알림");
	                	}
	                	// keyUp 이벤트의 유효성 체크의 toast 중복으로 메시지 2번뜨는 현상 발생 으로 주석
	                	//toast.push({body:objType.msg, type:'Warning'});
	                	rtn = false;
	                	$(chkObj).addClass("inputError");
	                	$(chkObj).focus();
	                	return false;
	                }
	            }else{
	            	
	            	//형식이 정상일 때 inputError Class가 존재한다면 제거
	                if($(chkObj).hasClass("inputError")){
	                   $(chkObj).removeClass("inputError");
	                }
	            }
        	//필수 값 아니고 값도 없는데 inputError Class 있다면 제거
        	}else if(objType.required == false && gfnIsNull($("#"+objNm).val())){
        		//형식이 정상일 때 inputError Class가 존재한다면 제거
                if($(chkObj).hasClass("inputError")){
                   $(chkObj).removeClass("inputError");
                }
        	}
        }
    });
    return rtn;
}





function gfnInputValChk2(arrObj){
    //오브젝트
    var chkObj;
    //조건 정규표현식
    var pattern;
    //치환 정규표현식
    var rpPattern;
    $.each(arrObj,function(objNm,objType){
        //오브젝트 구하기
        if(!gfnIsNull($('#'+objNm))){
            chkObj = $('#'+objNm);
        }else if(!gfnIsNull($('input[name='+objNm+']'))){
            //id값 없는경우 name으로 찾음
            chkObj = $('input[name='+objNm+']');
        }else{
        	//찾을 수 없는 오브젝트인 경우 each break;
            return false;
        }
        if(objType.type == "etc"){
        	//이벤트 모션
        	var eventHandler;
        	if(!gfnIsNull(objType.event)){
        		eventHandler = objType.event;
        	}
        	//정규식 패턴
        	if(!gfnIsNull(objType.pattern)){
        		//지역변수로 선언
        		var pattern = objType.pattern;
        	}
        	//정규식 치환 패턴
        	if(!gfnIsNull(objType.rpPattern)){
        		//지역변수로 선언
        		var rpPattern = objType.rpPattern;
        	}
        	$(chkObj).on(eventHandler,function(e){
        		if(pattern.test($(this).val()) == false){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg);
                    }
                    
                    //rpPattern이 있는지 확인
                    if(!gfnIsNull(rpPattern)){
	                    $(this).val($(this).val().replace(rpPattern, ''));
				        $(this).focus();
                    }else{
                    	//input box Class에 빨간 테두리 넣기
                        $(this).addClass("inputError");
    			        return false;
                    }
                }else{
                	if(gfnIsNull(rpPattern)){
	                	//형식이 정상일 때 inputError Class가 존재한다면 제거
	                    if($(this).hasClass("inputError")){
	                        $(this).removeClass("inputError");
	                    }
                	}
                }
        	});
        }else if(objType.type == "regExp"){
        	if( objType.required == true  ||    										//required 속성  'true'  이면 필수값이므로 정규식 검사
         			( objType.required == false && !gfnIsNull($("#"+objNm).val()) ) ) { //required 속성  'false' 이면  필수값이 아니므로 빈값이면 정규식 미검사 , 빈값이 아니면 정규식 검사     
        	//정규식 패턴
        	if(!gfnIsNull(objType.pattern)) {
        		var pattern = objType.pattern;
        	}
        	if(pattern.test($("#"+objNm).val()) == false){
            	//msg있는 경우 출력
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                	return false;
                }
            }
        	//필수 값 아니고 값도 없는데 inputError Class 있다면 제거
        	}else if(objType.required == false && gfnIsNull($("#"+objNm).val())){
        		//형식이 정상일 때 inputError Class가 존재한다면 제거
                if($(chkObj).hasClass("inputError")){
                   $(chkObj).removeClass("inputError");
                }
                return false;
        	}
        }else{
        	//number,length,email events = keyup, blur
        	$(chkObj).on("keyup blur",function(e){
        		//type이 빈 값이 아닐경우
        		if(!gfnIsNull(objType.type)){
        			//type이 2개 이상인 경우에만 루프
        			if(typeof objType.type == "object"){
        				$.each(objType.type,function(idx,map){
        					fnInCheck(e,objType,map);
        				});
        			}else{
        				fnInCheck(e,objType,objType.type);
        			}
        		}
        	});
        	
        }
    });
    //구문 체크 내부 함수
	function fnInCheck(e,objType,type){
		
		var targetObj = e.target
		if(type == "number"){
			var rpPattern = /[^0-9]/g;
			var onKeyVar = parseInt(e.key);
			if($.isNumeric(parseInt(onKeyVar)) == false){
            	//msg있는 경우 출력
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                }
                //숫자가 아닌 문자열을 공백으로 치환
                $(targetObj).val($(targetObj).val().replace(rpPattern, ''));
            }
            if(!gfnIsNull($(targetObj).attr('min')) && $(targetObj).val() < $(targetObj).attr('min')){
            	//msg있는 경우 출력
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                }
                $(targetObj).val('');
            }
		}else if(type == "length"){
			//문자열 길이 확인
            if(!gfnIsNull(targetObj.value)){
            	//Byte값 저장 변수
            	var charByte = 0;
            	//실제 길이 변수
                var len = 0;
                for (i = 0; i < targetObj.value.length; i++) {
                    var oneChar = targetObj.value.charAt(i);
                    if (escape(oneChar).length > 4) {
                    	charByte += 2;
                    } else {
                    	charByte++;
                    }
                    if (charByte <= objType.max) {
                    	len = i+1;
                    }
                }
                if(charByte > objType.max){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg);
                    }
                  //문자열 길이 오버된 경우 최대 문자 갯수 까지 자르기
                    targetObj.value = targetObj.value.substring(0,len);
                }
            }
             //최소 길이 제한이 있는 경우 blur 조건
            if(!gfnIsNull(objType.min)){
                if(targetObj.value.length < objType.min){
                	//msg있는 경우 출력
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg);
                    }
                    //input box Class에 빨간 테두리 넣기
                    $(targetObj).addClass("inputError");
                }else{
                	//이메일 형식이 정상일 때 inputError Class가 존재한다면 제거
                    if($(targetObj).hasClass("inputError")){
                        $(targetObj).removeClass("inputError");
                    }
                }
            }
		}else if(type == "email"){
			//input 입력 후 input box 포커스를 잃었을 때 발생
			pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
			if(pattern.test($(targetObj).val()) == false){
            	//msg있는 경우 출력
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                }
                //input box Class에 빨간 테두리 넣기
                $(targetObj).addClass("inputError");
            }else{
            	//이메일 형식이 정상일 때 inputError Class가 존재한다면 제거
                if($(targetObj).hasClass("inputError")){
                    $(targetObj).removeClass("inputError");
                }
            }
		}
	}
}

function gfnLayerHighLight(objId){
	//jQuery 객체 선택
    var obj = $(objId);
    
	//선택 객체의 offset
	var objIdOffset = $(obj).offset();
	
    //객체가 존재하지 않는 경우 구문 종료
    if(gfnIsNull($(obj))){ return false; }
    
    //마스크 객체 선언할 영역 선언
    holder = $('<div id="maskBox"/>').css({
            position: 'absolute',
            zIndex: 90240,
            opacity: 0.5,
            top:0,
    		left:0
          });
    //body에 삽입
    $(holder).appendTo('body');
    
    //이후 추가 옵션 설정을 위한 배열 < 변수 객체 선언
    maskBox = {
            top: createMaskBox('top'),
            left: createMaskBox('left'),
            right: createMaskBox('right'),
            bottom: createMaskBox('bottom'),
          };
    //해당 위치 가르키기
    //$(window).scrollTop($(obj).offset().top*0.7);
    //마스크 영역 생성
	function createMaskBox(position) {
		
		//마스크 영역의 css
		var maskStyle;
		
		//라인 영역의 css
		var lineStyle;
		
		
		if(position == 'top'){
			maskStyle = {
					top: px(0),
			        left: px(objIdOffset.left),
			        width: px($(obj).outerWidth()),
			        height: px(objIdOffset.top)
			};
		    lineStyle = {width:'100%',
		    		height:'2px',
		    		bottom:0};
	    
		}else if(position == 'left'){
			maskStyle = {
					top: px(0),
			        left: px(0),
			        width: px(objIdOffset.left),
			        height: px($(document).height())
			};
		    lineStyle = {width:'2px',
		    		height:px($(obj).outerHeight()),
		    		right:0,
		    		top:objIdOffset.top};
	    
		}else if(position == 'right'){
			maskStyle = {
					top: px(0),
			        left: px((objIdOffset.left + $(obj).outerWidth())),
			        width: px(($(document).width() - (objIdOffset.left + $(obj).outerWidth()))),
			        height: px($(document).height())
			};
		    lineStyle = {width:'2px',
		    		height:px($(obj).outerHeight()),
		    		top:objIdOffset.top
		    		};
	    
		}else if(position == 'bottom'){
			maskStyle = {
					top: px((objIdOffset.top + $(obj).outerHeight())),
			        left: px(objIdOffset.left),
			        width: px($(obj).outerWidth()),
			        height: px(($(document).height()-(objIdOffset.top + $(obj).outerHeight())))
			};
		    lineStyle = {width:'100%',
		    		height:'2px'};
		}
		 return $('<div />').css(maskStyle).appendTo(holder).append($('<div class="maskLine" />').css(lineStyle));
	}
	$(window).resize(function(){
		//페이지 내용 로드 대기
		setTimeout(function(){
			maskBoxReSize();
			
			//해당 위치 가르키기
			//$(window).scrollTop(objIdOffset.top*0.7);
		},200);
	});
	
	//선택 객체의 position이 fixed인 경우 스크롤 시 마스크박스 재 정의 필요
	$(document).on('scroll touchmove mousewheel', function(e) {
		maskBoxReSize();
		});
	//선택 영역이 클릭할 수 없는 범위인 경우 마스크 클릭으로 마스크 제거
	if($(obj).outerWidth() <= 10 || $(obj).outerHeight() <= 10){
		$("#maskBox").on("click, mousedown",function(event){
			$(document).off('scroll touchmove mousewheel');
			$(this).remove();
		});
	}
	//하이라이트 처리된 영역 클릭, 마우스 누를 때 마스크 제거
	$(obj).on("click, mousedown",function(event){
			$(document).off('scroll touchmove mousewheel');
			$("#maskBox").remove();
    });
	
	//소수점 버리고 px 단위 추가
    function px(n) {
        return Math.round(n) + 'px';
    }
    //마스크 박스 위치 재 조정
    function maskBoxReSize(){
    	//선택 객체의 offset
		objIdOffset = $(obj).offset();
		
		//생성된 마스크 박스
		boxTop = this.maskBox.top;
		boxLeft = this.maskBox.left;
		boxRight = this.maskBox.right;
		boxBottom = this.maskBox.bottom;
		
		//박스 위치 조절 (css 수정과 함께 자식 객체 위치 값도 수정)
		$(boxTop).css({	//상단
	        left: px(objIdOffset.left),
	        width: px($(obj).outerWidth()),
	        height: px(objIdOffset.top), 
	        }).children('.maskLine').css({bottom:0});
		$(boxLeft).css({	//좌측
	        width: px(objIdOffset.left),
	        height: px($(document).height()), 
	        }).children('.maskLine').css({top:objIdOffset.top});
		
		$(boxRight).css({	//우측
	        left: px((objIdOffset.left + $(obj).outerWidth())),
	        width: px(($(document).width() - (objIdOffset.left + $(obj).outerWidth()))),
	        height: px($(document).height()), 
	        }).children('.maskLine').css({top:objIdOffset.top});
		
		$(boxBottom).css({	//하단
			top: px((objIdOffset.top + $(obj).outerHeight())),
			left: px(objIdOffset.left),
			width: px($(obj).outerWidth()),
			height: px(($(document).height()-(objIdOffset.top + $(obj).outerHeight()))), 
	        }).children('.maskLine').css({top:0});
		
    }
}

function searchEnterKey(e, obj){
	if(e.keyCode == 13) axdom("#" + obj.getItemId("btn_search")).click();
}



function gfnFileCheck( fileExt ){
	// 화이트 리스트가 아니라면 중지 업로드 중지.
	if( $.inArray(fileExt, ["doc","docx","hwp","pdf","ppt","pptx","xls","xlsx","zip","jpg","jpeg","png","gif","css","css2","csv","htm","htm2","html","js","avi","mp3","mpeg","mpg","psd","rar","spl","swf","tar","text","tga","tgz","tif","tiff","txt","wav","wav2","bmp","jar","zip","eml","cell","show"]) == -1) {
		return false;
   }
	return true;
}



function gfnCutStrLen(str, maxByte, type) {
	//null 체크
	if(gfnIsNull(str)){
		return "";
	}
	for (b = i = 0; c = str.charCodeAt(i);) {
		b += c >> 7 ? 2 : 1;
		if (b > maxByte)
			break;
		i++;
	}
	//글자수 체크인경우 Byte 크기 리턴
	if(type == "byteLen"){
		return (b-1);
	}
	if( (b-1) < maxByte ){
		return str.substring(0, i);
	}else{
		return str.substring(0, i) + "...";
	} 
}


function gfnByteLenCutStr(str, maxByte) {
	//null 체크
	if(gfnIsNull(str)){
		return "";
	}
	for (b = i = 0; c = str.charCodeAt(i);) {
		b += c >> 7 ? 2 : 1;
		if (b > maxByte)
			break;
		i++;
	}

	if( b > maxByte ){
		return str.substring(0, i);
	}
}


function gfnStrByteLen(str) {
	var byteLen = 0;
	for(i=0;i<str.length;i++){
		b = str.charCodeAt(i);
		byteLen += b >> 7 ? 2 : 1;
	}
	return byteLen;
}


function gfnReqLink(reqLink){
	//링크 내용이 있는지 확인
	if(gfnIsNull(gfnReplace(reqLink, "http://","").trim()) || gfnIsNull(gfnReplace(reqLink, "https://","").trim())){
		reqLink = "#";
	}
	return reqLink;
}


function gfnDtmAgoStr(dateTime){
	var subTime = new Date() - dateTime;
	
	var rtnStr = "";
	
	//시간
	var seqAgo = (60*1000);	//분
	var minAgo = seqAgo*60; //시
	var hourAgo = minAgo*24; //일
	
	subTime = parseInt(subTime);
	
	var formatDate = new Date(dateTime).format("yyyy-MM-dd HH:mm:ss");
	
	//1분 이내인 경우 방금
	if(subTime < seqAgo){
		rtnStr = "방금전 <small>("+formatDate+")</small>";
	}else if(subTime >= seqAgo && subTime < minAgo){
		rtnStr = parseInt(subTime/seqAgo)+"분 전 <small>("+formatDate+")</small>";
	}else if(subTime >= minAgo && subTime < hourAgo){
		rtnStr = parseInt(subTime/minAgo)+"시간 전 <small>("+formatDate+")</small>";
	}else if(subTime >= hourAgo && subTime < (hourAgo*28)){ //28일 까지
		rtnStr = parseInt(subTime/hourAgo)+"일 전 <small>("+formatDate+")</small>";
	}else{
		rtnStr = formatDate;
	}
	return rtnStr;
}


function gfnByteCheckEvent(eventIdList){
	
	for(var i=0; i<eventIdList.length; i++ ){
		$('#' +eventIdList[i] ).keyup(function (e){
			var totalByte = 0;
			var content = $(this).val();
			var maxlength = $(this).attr("maxlength");
			
			var printContent = "";
			
			for(var j=0; j<content.length;j++){
				var currentByte = content.charCodeAt(j);
				
				
				if(currentByte > 128){
					totalByte +=2;
				}else{
					totalByte++;
				}
				
				if(totalByte <= maxlength){
					printContent+=content.substring(j,j+1);
				}
			}
			$(this).val(printContent);
		});
		
		$('#' +eventIdList[i] ).blur(function (e){
			var totalByte = 0;
			var content = $(this).val();
			var maxlength = $(this).attr("maxlength");
			var printContent = "";
			
			for(var j=0; j<content.length;j++){
				var currentByte = content.charCodeAt(j);
						
				if(currentByte > 128){
					totalByte +=2;
				}else{
					totalByte++;
				}
				
				if(totalByte <= maxlength){
					printContent+=content.substring(j,j+1);
				}
			}
			$(this).val(printContent);
		});
				
		$('#' +eventIdList[i] ).bind('paste',function (e){
			var totalByte = 0;
			var content = $(this).val();
			var maxlength = $(this).attr("maxlength");
			var printContent = "";
			
			for(var j=0; j<content.length;j++){
				var currentByte = content.charCodeAt(j);
				
				
				if(currentByte > 128){
					totalByte +=2;
				}else{
					totalByte++;
				}
				
				if(totalByte <= maxlength){
					printContent+=content.substring(j,j+1);
				}
			}
			$(this).val(printContent);
		});
	}
	
}



var commonPopFunction ;

function gfnCommonPopup(title,param,isMulti,licGrpId,mstCd,pFunc){
	commonPopFunction = pFunc;
	var data = {
			"title" : title , "param"  : param , "isMulti" : isMulti ,
			"licGrpId" : licGrpId , "mstCd" : mstCd  
		};
			
	gfnLayerPopupOpen('/cmm/cmm1000/cmm1300/selectCmm1300View.do',data, "480", "453",'scroll');
}


function gfnCheckRow(selGrid,param){
	var chkList = selGrid.getList('selected');
	var pList = [];
	
	if(gfnIsNull(chkList)){
		jAlert("선택된 데이터가 없습니다. 그리드에서 데이터를 선택해주세요.", "알림창");
		return false;
	}
	
	$(chkList).each(function(idx, data) {
		if(data.__selected__){
			pList.push(data);
		}
	});
	if(gfnIsNull(param )){
		commonPopFunction(pList);
	}else{
		commonPopFunction(pList,param);
	}
	gfnLayerPopupClose();
}


function gfnSvnRevisionPopup(prjId, callView, selBtnChk, pFunc){
	commonPopFunction = pFunc;
	var data = {"prjId": prjId, "callView" : callView, "selBtnChk": selBtnChk  }; 
	 
	gfnLayerPopupOpen("/cmm/cmm1000/cmm1400/selectCmm1400View.do", data, '1300', '850','scroll');	
}


function gfnDataRow(selGrid){
	
	commonPopFunction(selGrid);
	
	gfnLayerPopupClose();
}

function gfnGetDayAgo(date,day,format){
	
	var time;
	var retdate= new Date( date - (  day * 60 * 60 * 24  * 1000 ) );
	
	if("yyyy-mm-dd"==format){
		time=retdate.getFullYear()+"-"+ (retdate.getMonth() + 1).zf(2) +"-"+retdate.getDate().zf(2);
	}
	
	return time;
}


function gfnTermValid(fisrtDom,secondDom,term){
	var sFirstDay = $(fisrtDom).val();
	var sSecondDay = $(secondDom).val();
	var isValid = false;
	
	var dFirstDay= new Date( sFirstDay );
	var dSecondDay= new Date( sSecondDay );
	
	var diffDayMS = dFirstDay - dSecondDay;  
	
	if(Math.abs(diffDayMS)  >  Math.abs((term * 60 * 60 * 24  * 1000))){
		isValid = false;
	}else{
		isValid = true;
	}
		
	return isValid;
}


function gfnCommonDplPopup(param,isMulti,pFunc){
	commonPopFunction = pFunc;
	var data={};
	var ajaxParam = "";
	
	var prjId = "";
	if(param.hasOwnProperty("prjId") && !gfnIsNull(param.prjId)){
		prjId = param.prjId;
	}
	
	var dplNm = "";
	if(param.hasOwnProperty("dplNm") && !gfnIsNull(param.dplNm)){
		dplNm = param.dplNm;
	}

	var dplSts = "";
	if(param.hasOwnProperty("dplSts") && !gfnIsNull(param.dplSts)){
		dplSts = param.dplSts;
	}
	
	data = {
			"dplNm"  : dplNm  , "isMulti" : isMulti   
			 , "dplStsCd" : dplSts  ,"prjId": prjId
		};
	
	// 배포 목록 공통 팝업 호출시 배포명으로 조회함 
	ajaxParam = "&searchSelect=dplNm&searchTxt="+dplNm+"&dplStsCd="+dplSts;
	
	if(!gfnIsNull(prjId)){
		ajaxParam += "&prjId="+prjId
	}
	
	var dplList = gfnSelectCmm1600CommonDplList(ajaxParam);
	if(gfnIsNull(dplList )){
		gfnLayerPopupOpen('/cmm/cmm1000/cmm1600/selectCmm1600View.do',data, "700", "470",'scroll'); 
	}else{
		if(dplList.list.length==1){
			commonPopFunction(dplList.list);
		}else{
			gfnLayerPopupOpen('/cmm/cmm1000/cmm1600/selectCmm1600View.do',data, "700", "470", 'scroll');
		}
	}
}


function gfnSelectCmm1600CommonDplList(ajaxParam){
	var retObj = {};
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1600/selectCmm1600CommonDplListAjax.do","loadingShow":false}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setProperty({"async":false});
	ajaxObj.setFnSuccess(function(data){
		retObj = JSON.parse(data);	
	});
	
	//AJAX 전송
	ajaxObj.send();
	return retObj;
}


function gfnGetMonthAgo(date,day,format){
	
	var time;
	
	var iDate =  new Date( date );
	
	var calMonth = 0;
	var calYear = 0 ;
	

	if(day>0){
		calYear = Math.floor( day  / 12 );
		if( (iDate.getMonth() + 1) < (day % 12)  ){
			calMonth = 12 + iDate.getMonth() + 1 - (day % 12) ;
			calYear++;
		}else{
			calMonth = iDate.getMonth() + 1 - (day % 12) ;
		}
	}else{
		calYear = Math.ceil( day  / 12 );
		if(iDate.getMonth() + 1 - (day % 12) > 12  ){
			calMonth = -12 + iDate.getMonth() + 1 - (day % 12) ;
			calYear--;
		}else{
			calMonth = iDate.getMonth() + 1 - (day % 12) ;
		}
	}
	
	
	if("yyyy-mm-dd"==format){
		var year = ( iDate.getFullYear() - calYear ) ;
		var month = (calMonth ).zf(2);
		var day = "";
		var end_day =0;
		if (month=="01" || month=="03" || month=="05" || month=="07" || month=="08" || month=="10" || month=="12") {
			end_day = 31;
		}else if (month=="04" || month=="06" || month=="09" || month=="11") {
			end_day = 30;
		}else if (month=="02" && year%4 == 0) {
			end_day = 29;
		}else if (month=="02" && year%4 != 0) {
			end_day = 28;
		}
		
		if( Number(iDate.getDate().zf(2)) > end_day ){
			day = end_day;
		}else{
			day = iDate.getDate().zf(2);
		}
		
		time= year   +"-"+ month +"-"+day;
	}else if("yyyy-mm"==format){
		time=( iDate.getFullYear() - calYear ) +  "-"+ (calMonth ).zf(2);
	}

	//var retdate= new Date( date - (  day * 60 * 60 * 24  * 1000 ) );
	
	
	return time;
}


function gfnGuideBoxDraw(type,$mainFrame,guideBoxInfo){
	//기본 색상
	var defaultArrowcolor = '#ff5643';
	
	//가이드 상자 제거
	if(!type || !gfnIsNull($("#global_main_guideBox"))){
		$("#global_main_guideBox").remove();
		return false;
	}
	//브라우저 실제 w,h
	browserWidth = "100%";
	browserHeight = "100%";
	
	
	//guideBox 생성
	var $globalGuideMainBox = $('<div class="global_main_guideBox" id="global_main_guideBox"></div>');
	$globalGuideMainBox.css({position: "absolute",width: browserWidth,height: browserHeight,top: 0,left: 0,"z-index": 10,"background-color":"rgba(0, 0, 0, 0.1)"});
	
	$mainFrame.append($globalGuideMainBox);
	$globalGuideMainBox.parent().css({position:"relative"});
	
		
	//가이드상자 실제 좌표 구하기 = 기초좌표
	var frameOffset = {x:$globalGuideMainBox.offset().left,y:$globalGuideMainBox.offset().top};
	
	//guide box append
	$.each(guideBoxInfo,function(idx, map){
		//화살표 색상
		var arrowColor = map.arrowColor;
		
		//값 없는경우 기본값
		if(gfnIsNull(arrowColor)){
			arrowColor = defaultArrowcolor;
		}
		var $targetDiv = $("[guide="+map.target+"]");
		
		//타겟 대상 없는경우 가이드 상자 안만듬
		if(gfnIsNull($targetDiv) || (!gfnIsNull($targetDiv) && ($targetDiv.css("display") == "none" || gfnIsNull($targetDiv.html())))){
			return true;
		}
		var addStr = '<div class="globalGuideBox" id="'+map.id+'" style="border:1px solid '+arrowColor+'">'
					+'<div class="globalGuideCloseBox" target="'+map.id+'"><i class="fa fa-times"></i></div>'
					+'<div class="globalGuideSubBox globalGuideBox_mainTitle" parent="'+map.id+'">'+map.mainTitle+'</div>';
			
		$.each(map.subBox,function(idx2, map2){
			addStr += 
				'<div class="globalGuideSubBox">'
					+'<div class="globalGuideBox_subTitle">'+map2.title+'</div>'
					+'<div class="globalGuideBox_subContent">'+map2.content+'</div>'
				+'</div>';
		});		
		addStr += '</div>';
		
		$globalGuideMainBox.append($(addStr).css({top:map.top,left:map.left}));
		
		//설명 상자 최소 width 가져오기
		var $subBoxList = $(".globalGuideBox#"+map.id+' .globalGuideBox_subTitle');
		var maxBoxWidth = 0;
		
		//loop
		$.each($subBoxList,function(idx2,map2){
			var objWidth = parseInt($(map2).outerWidth())+20;
			if(objWidth > maxBoxWidth){
				maxBoxWidth = objWidth; 
			}
		});
		
		//css 적용
		$subBoxList.css({width:maxBoxWidth+"px"});
		
		//시작점 객체
		var eleOffset_st = {x:$targetDiv.offset().left,y:$targetDiv.offset().top};
		var eleSize_st = {w:$targetDiv.outerWidth(),h:$targetDiv.outerHeight()};
		
		//도착점 객체
		var eleOffset_ed = {x:$("#"+map.id).offset().left,y:$("#"+map.id).offset().top};
		var eleSize_ed = {w:$("#"+map.id).outerWidth(),h:$("#"+map.id).outerHeight()};
		
		var p0x,p0y,p1x,p1y,p2x,p2y;
		
		//시작점
		p0x = (eleOffset_st.x-frameOffset.x)+(eleSize_st.w)/2;
		p0y = (eleOffset_st.y-frameOffset.y)+(eleSize_st.h)/2;

		//중간지점
		if(!gfnIsNull(map.curve) && !map.curve){	//곡선 사용 안함
			p1x = p0x;
			p1y = p0y;
		}else{
			p1x = ((eleOffset_st.x-frameOffset.x)+(eleSize_st.w)/2);
			p1y = (eleOffset_st.y-frameOffset.y);
		}
		
		//도착점
		p2x = eleOffset_ed.x-frameOffset.x;
		p2y = (eleOffset_ed.y-frameOffset.y)+(eleSize_ed.h/2);
		
		//화살표 도착점 설정(기본 좌측)
		//우측
		if(map.position == "right"){
			p2x += eleSize_ed.w;
		}
		//하단
		else if(map.position == "bottom"){
			p2x += eleSize_ed.w/2;
			p2y += eleSize_ed.h/2;
		}
		//상단
		else if(map.position == "top"){
			p2x += eleSize_ed.w/2;
			p2y -= eleSize_ed.h/2;
		}
		
		//화살표 시작점 설정(기본 중앙)
		if(map.targetPosition == "top"){
			p0y -= eleSize_st.h/2;
			p1y -= eleSize_st.h/2
		}
		else if(map.targetPosition == "right"){
			p0x += eleSize_st.w/2;
			p1x += eleSize_st.w/2;
		}
		else if(map.targetPosition == "bottom"){
			p0y += eleSize_st.h/2;
			p1y += eleSize_st.h/2;
		}
		else if(map.targetPosition == "left"){
			p0x -= eleSize_st.w/2;
			p1x -= eleSize_st.w/2;
		}
		
		//시작점 객체 박스 씌우기
		var canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.top = (eleOffset_st.y-frameOffset.y)+'px';
		canvas.style.left = (eleOffset_st.x-frameOffset.x)+'px';
		canvas.width = eleSize_st.w;
		canvas.height = eleSize_st.h;
		
		var ctx = canvas.getContext('2d');
		ctx.strokeStyle = arrowColor;
		ctx.lineWidth = 3;
		ctx.strokeRect(0, 0, eleSize_st.w, eleSize_st.h); 
		
		//canvas 넣기
		$globalGuideMainBox.append(canvas);
		
		$(canvas).addClass('guideBox_targetLayer');
		
		//화살표 그리기
		$globalGuideMainBox.curvedArrow({
	                p0x: p0x,
	                p0y: p0y,
	                p1x: p1x,
	                p1y: p1y,
	                p2x: p2x,
	                p2y: p2y,
					lineWidth:3,
					strokeStyle: arrowColor
	            });
	});
	
	//닫기 도움말 제공
	$globalGuideMainBox.append('<div class="globalGuideBox" id="globalGuideBoxSearchClose" style="bottom:0;right:0;border:1px solid '+defaultArrowcolor+'">'
					+'<div class="globalGuideSubBox globalGuideBox_mainTitle">가이드 닫기: Ctrl + 마우스 왼쪽클릭</div></div>');
	
	//Ctrl + 클릭 닫기 기능 제공
	$globalGuideMainBox.click(function(e){
		if(e.ctrlKey){
			gfnGuideBoxDraw(false);
		}
	});
	
	//설명 상자 닫기 버튼 동작
	$(".globalGuideCloseBox").click(function(){
		//main Object
		var $targetMainObj = $(this).parent();
		
		//제거
		//arrow canvas
		$targetMainObj.next(".guideBox_targetLayer").remove();
		//targetBox canvas
		$targetMainObj.next(".curved_arrow").remove();
		
		//main remove
		$targetMainObj.remove();
		
		//남아있는 가이드 상자가 1개인경우 가이드 상자 닫기(close버튼 제외)
		if($("#global_main_guideBox").children(".globalGuideBox").length == 1){
			$("#global_main_guideBox").remove();
		}
	});
}



var gfnGuideOpenCnt = [];
var globals_guideChkFn = null;
function gfnGuideStack(type,functionName){
	if(type == "del"){
		gfnGuideOpenCnt.splice((gfnGuideOpenCnt.length-1),1);
	}else{
		gfnGuideOpenCnt.push(functionName);
	}
}


function gfnGuideKeyAction(){
	window.onhelp = function() {
		return false;
	};
	
	//keydown 함수
	$(window).bind('keydown', function(e) {
		var keyCode = e.keyCode || e.which;
		if((keyCode == 112 || e.key == 'F1') && !(event.altKey ||event.ctrlKey || event.shiftKey || event.metaKey)){
			
			e.cancelable = true;
			e.stopPropagation();
			e.preventDefault();
			e.returnValue = false;

	        //F1키 누를시 가이드 상자 표시
			if(typeof gfnGuideOpenCnt[gfnGuideOpenCnt.length-1] == "function"){
				gfnGuideOpenCnt[gfnGuideOpenCnt.length-1]();
			}
		}
	});
}


function gfnGetBrowserType(){
	
	// 브라우저 타입
	var browserType = "";
	
	// 사용자가 사용하는 브라우저 정보
	var agent = navigator.userAgent.toLowerCase();
	
	// 브라우저가 엣지일 경우
	if( agent.indexOf("edge") != -1 ){
		browserType = "edge";
	// 브라우저가 크롬, 사파리, 파이어폭스일 경우
	}else if( agent.indexOf("chrome") != -1 || agent.indexOf("safari") != -1 || agent.indexOf("firefox") != -1 ){
		browserType = "notMsBrowser";
	// 브라우저가 IE일경우	
	}else{
		browserType = "ie";
	}
	
	return browserType;
}


function gfnEscapeHtml(sValue){
	//숫자인경우 반환
	if(typeof sValue == "number"){
		return sValue;
	}
	try{
		return sValue ? sValue.replace( /[&<>'"]/g,
			function (c, offset, str) {
				if (c === "&") {
					var substr = str.substring(offset, offset + 6);
					if (/&(amp|lt|gt|apos|quot);/.test(substr)) {
						return c;
					}
				}
				return "&" + {
					"&": "amp",
					"<": "lt",
					">": "gt",
					"'": "apos",
					'"': "quot"
				}[c] + ";";
			}
		) : "";
	}catch(error){
		return "";
	}
}
