
function gfnCommonSetting(searchObj,cmmCode,showSearchKey,hideSearchKey){
	
	
	var commonCodeArr = [
		{mstCd: cmmCode, useYn: "Y",targetObj: "#" + searchObj.getItemId(showSearchKey), comboType:"OS"} 
	];
	
	
	axdom("#" + searchObj.getItemId(showSearchKey)).html('');
	
	
	gfnGetMultiCommonCodeDataForm(commonCodeArr , false);
	
	axdom("#" + searchObj.getItemId(showSearchKey)).show();
	axdom("#" + searchObj.getItemId(hideSearchKey)).hide();
}


function gfnGetMultiCommonCodeDataForm(commonCodeArr , isAsyncMode){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1000/selectCmm1000MultiCommonCodeList.do"
				,"async":isAsyncMode,"loadingShow":false}
			,{commonCodeArr: JSON.stringify(commonCodeArr)});
	
	ajaxObj.setFnSuccess(function(data){
    	if(data.ERROR_CODE == '-1'){
    		toast.push(data.ERROR_MSG);
			return;
		}
    	
    	
    	var commonCodeList = data.commonCodeList;
    	
    	
    	$.each(commonCodeArr ,function(idx, map){
    		
    		var subList = commonCodeList[map.targetObj];
    		
    		
    		var comboType = map.comboType;
    		
    		
    		var $targetObject = $(map.targetObj);
    		
    		
    		$targetObject.empty();
    		
    		
    		if($targetObject == null || gfnIsNull(subList)){
    			return true;
    		}
    		
    		if(comboType == 'A'){
				
    			$targetObject.append("<option value='A'>전체</option>");
			}
    		else if(comboType == 'N'){
    			
    			$targetObject.append("<option value=''>전체</option>");
			}
    		else if(comboType == 'S'){
    			
    			$targetObject.append("<option value=''>선택</option>");
			}
    		else if(comboType == 'E'){
    			
    			$targetObject.append("<option value=''></option>");
			}
			
    		
    		$.each(subList, function(idx2, subMap){
    			
    			
    			if(!gfnIsNull(commonCodeArr[0].subCdRef1)){
    				
    				if(!gfnIsNull(commonCodeArr[0].subCdRef2)){
    					
    					if(!gfnIsNull(commonCodeArr[0].subCdRef3)){
    						
    						if(commonCodeArr[0].subCdRef1 == subMap.subCdRef1 && commonCodeArr[0].subCdRef2 == subMap.subCdRef2 && commonCodeArr[0].subCdRef3 == subMap.subCdRef3){
	    						$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
	    					}
    					
    					}else{
    						if(commonCodeArr[0].subCdRef1 == subMap.subCdRef1 && commonCodeArr[0].subCdRef2 == subMap.subCdRef2){
	    						$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
	    					}
    					}
    				
    				}else{
    					if(commonCodeArr[0].subCdRef1 == subMap.subCdRef1){
    						$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
    					}
    				}
    			
    			} else {
    				$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"' data-sub-cd-ref3='"+subMap.subCdRef3+"'>" + subMap.subCdNm + "</option>");
    			}
    		});
    		
    		
			var selVal = $targetObject.data("osl-value");
			
			if(!gfnIsNull(selVal)){
				var $seledObj = $targetObject.children('option[value='+selVal+']');
				
				if($seledObj.length > 0){
					$seledObj.attr('selected','selected');
				}
			}
    	});
	});
	
	
	return ajaxObj.send();
}


function gfnAjaxRequestAction(property,data){
	
	this.url = "";
	this.data = "";
	
	
	this.dataType ="json";
	
	
	this.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
	
	
	this.async = "false";
	
	
	this.cache = "true";
	
	
	this.processData = "true";
	
	this.mimeType = "";
	
	
	this.pgBarObj = null;
	
	
	this.loadingShow = true;
	
	
	
	this.fnSuccess = $.noop;
	this.fnbeforeSend = $.noop;
	this.fnComplete = $.noop;
	this.fnError = $.noop;

	
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

	
	if(!gfnIsNull(property)){
		eval(this.setProperty(property));
	}
	if(!gfnIsNull(data)){
		eval(this.setData(data));
	}

	
	this.send = function send(){
		
		var obj = this;
		
		
		var loadingShow = this.loadingShow;
		
		
		var startAjaxTime = new Date().getTime();
		
		
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
	        	
	        	if(gfnIsNull(obj.pgBarObj)){
	        		return gfnLoadProgressStr();
	        	}else{
	        		return gfnLoadProgressBar(obj.pgBarObj);
	        	}
	        },
	        beforeSend: function(){
	        	
	        	if(gfnIsNull(obj.pgBarObj) && loadingShow){
		        	
		    		gfnShowLoadingBar(true);
	        	}
	    		obj.fnbeforeSend();
	        },
	        success: function(data, status, xhr) {
	        	
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
        		
        		obj.fnError(xhr, status, err);
	        	return;
	        },
	        complete: function(){
	        	
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
		
		if($.trim(value).length < 1 ){
			jAlert(nm + ' 은(는) 필수 입력 사항입니다.\n\n\r ' + nm + ' 항목을 입력하세요.','알림창',function(){
				eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".focus()");
				
				
				eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.add('inputError')");
			});
			
			return true;
		}
		else if(inputType == 'sel'){
			if(text == '선 택'){
				jAlert(nm + ' 은(는) 필수 선택 사항입니다.\n\n\r ' + nm + ' 항목을 입력하세요.','알림창',function(){
					eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".focus()");
					
					
					eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.add('inputError')");
				});
				return true;
			}
		}
		
		
		var classChk = eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.contains('inputError')");
		if(classChk){
			
			eval("document.getElementById('" + formId + "')." + checkObjArr[i] + ".classList.remove('inputError')");
		}
	}
	
	
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
	
	
	$.each(jsonObj, function(key, val){
		try{
			
			val = gfnReplace(val, null, '');
			
			child = $("#" + parentObjId + " #" + key);
			strType = $("#" + parentObjId + " #" + key).attr("type");	
        	
			
	        if (typeof strType == "undefined" && child.length > 0) {
	            strType = child[0].type;
	        }
			
	        if(typeof strType == "undefined" && child.length > 0){
	        	
	        	$("#" + parentObjId + " #" + key).text(val);
	        	$("#" + parentObjId + " #" + key).val(val);
	        }
	        else{
	        	
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
	




	width = Number(width);
	height = Number(height);
	
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
		
		if($(window).height() <= $('#'+layerBoxDivId).height()){
			$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : overflowY});
			
			
			$('#'+layerBoxDivId).width($('#'+layerBoxDivId).width()+15);
		}
		
		
		$(window).resize(function(){
			
			$('#'+layerBoxDivId+' .ajax_box').scrollTop(0);
			
			if($(window).height() <= $('.layer_popup_box').height()){
				$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : overflowY});
				
			}else{
				$('#'+layerBoxDivId+' .ajax_box').css({"overflow-y" : "hidden"});
				
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
	
	
	var format = 'YYYY-MM-DD';
	var subFormat = 'yyyy-MM-dd'
	
	
	var minDate = new Date(new Date().getFullYear()-10, 0, 1).format(subFormat);
	var maxDate = new Date(new Date().getFullYear()+10, 12, 0).format(subFormat);
	
	
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
	
	
	if(!gfnIsNull(fromData)){
		$("#" + fromId ).data('daterangepicker').setStartDate(fromStartDate);
	}
	if(!gfnIsNull(toData)){
		$("#" + toId ).data('daterangepicker').setStartDate(toStartDate);
	}
	
	inFnGrpDateSet();
	
	
	function inFnGrpDateSet(){
		
		if(!gfnIsNull(grpFromDt)){
			$("#" + toId ).data('daterangepicker').setMinDate(grpFromDt);
			$("#" + fromId ).data('daterangepicker').setMinDate(grpFromDt);
		}	
		
		if(!gfnIsNull(grpEndDt)){
			$("#" + toId ).data('daterangepicker').setMaxDate(grpEndDt);
			$("#" + fromId ).data('daterangepicker').setMaxDate(grpEndDt);
		}
	}
	
}


function gfnCalRangeDel(fromId, toId){
	$( "#" + fromId ).data('daterangepicker').remove();
	$( "#" + fromId ).next().remove();
	$( "#" + toId).data('daterangepicker').remove();
	$( "#" + toId ).next().remove();
	
}


function gfnCalSet(formatType){
	
	
	var minYear = new Date().getFullYear()-10;
	var maxYear = new Date().getFullYear()+10;
	
	
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
	
}


function gfnCalendarSet(formatType,elementIds,options){
	
	
	var subFormat = 'yyyy-MM-dd'
	
	
	var minDate = new Date(new Date().getFullYear()-10, 0, 1).format(subFormat);
	var maxDate = new Date(new Date().getFullYear()+10, 12, 0).format(subFormat);
	
	
	var dateObjects = {};	
	for(var i=0;i<elementIds.length;i++){
		
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
		
	}	
	
	
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
    
    xhr.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        var percentComplete = evt.loaded / evt.total;
        
        $('.top_str').html(parseInt(percentComplete*100)+'%');
      }
    }, false);
    return xhr;
}


function gfnLoadProgressBar(pgBarObj){
	var xhr = new window.XMLHttpRequest();
	
	
	if(!gfnIsNull(pgBarObj)){
	    
	    xhr.upload.addEventListener("progress", function(evt){
	      if (evt.lengthComputable) {
	        var percentComplete = evt.loaded / evt.total;
	        
	        if(Object.isArray(pgBarObj)){
	        	var pgBarObj_bottomBar = $(pgBarObj[0]).children('.file_progressBar').children('div');
	        	
	        	pgBarObj_bottomBar.stop().animate({width:(percentComplete*100)+'%'},1);
	        }
	        else{ 
	        	$.each(pgBarObj,function(idx, map){
	        		var pgBarObj_bottomBar = $(map).children('.file_progressBar').children('div');
		        	
		        	pgBarObj_bottomBar.stop().animate({width:(percentComplete*100)+'%'},1);
	        	});
	        }
	      }
	    }, false);
	}
    return xhr;
}



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
	
	
	temp = temp.replace(/</g,"&lt;").replace(/>/g,"&gt;");
	
	return temp;
}


function gfnEnterAction2(fnc){
	
	for(var i=1;i<arguments.length;i++){
		
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
		
		
		fd.append(element.id,element.value);
	});
}


function gfnFormDataAutoJsonValue(formName,fd){
	
	var fdInput = $('#'+formName+' input');
	var fdSelect = $('#'+formName+' select');
	var fdText = $('#'+formName+' textarea');
	
	
	var fdEle;
	
	fdEle = $.merge(fdInput,fdSelect);
	fdEle = $.merge(fdEle,fdText);
	
	$.each(fdEle, function(index, element){
		
		if(gfnIsNull(element.id)){
			return true;
		}
		
		var optFlowId = element.getAttribute("optflowid");
		
		
		var chgDetailOptTarget = element.getAttribute("opttarget");
		
		
		if(gfnIsNull(chgDetailOptTarget)){
			chgDetailOptTarget = "01";
		}
		
		
		var chgDetailOptType = element.getAttribute("opttype");
		
		
		if(gfnIsNull(chgDetailOptType)){
			chgDetailOptType = "01";
		}
		
		
		var chgDetailCommonCd = element.getAttribute("cmmcode");
		
		
		if(gfnIsNull(chgDetailCommonCd)){
			chgDetailCommonCd = "";
		}
		
		
		var modifySetCd = element.getAttribute("modifyset");
		
		
		if(gfnIsNull(modifySetCd)){
			modifySetCd = "01";
		}
		
		
		var hiddenSet = element.getAttribute("hiddenset");
		
		
		if(gfnIsNull(hiddenSet)){
			hiddenSet = "02";
		}
		
		
		
		var eleTitle = element.title;
		
		
		if(gfnIsNull(eleTitle)){
			eleTitle = element.id;
		}
		
		
		
		
		var eleValue = element.value;
		
		
		if(element.type == "checkbox"){
			eleValue = (element.checked)?"01":"02";
		}
		
		
		var rtnVal = JSON.stringify({optNm:eleTitle,optVal:eleValue,chgDetailOptTarget:chgDetailOptTarget, chgDetailOptType:chgDetailOptType, chgDetailCommonCd:chgDetailCommonCd, modifySetCd:modifySetCd, optFlowId: optFlowId});
		
		
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
	
	
	if(!gfnIsNull($('#'+objName))){
		fnObj = $('#'+objName);
	}else if(!gfnIsNull($('.'+objName))){
		
		fnObj = $('.'+objName);
	}
	
	if(fnObj == null){
		alert(objDesc+" 입력 폼에 값이 입력되지 않았습니다.");
		return true;
	}else if(fnObj.val().length > size){
		alert(objDesc+" 입력 폼에 값이 지정된 길이를 초과했습니다.("+size+")");
		return false;
	}
	
}


function gfnInputValChk(arrObj){
    
    var chkObj;
    
    var pattern;
    
    var rpPattern;
    rtn = true;

    $.each(arrObj,function(objNm,objType){
        
        if(!gfnIsNull($('#'+objNm))){
            chkObj = $('#'+objNm);
        }else if(!gfnIsNull($('input[name='+objNm+']'))){
            
            chkObj = $('input[name='+objNm+']');
        }else{
        	
            return false;
        }
        
        
        if(objType.type == "number"){
         
            rpPattern = /[^0-9]/g;
            
            $(chkObj).keyup(function(e){
                var onKeyVar = parseInt(e.key);
                
                
                if(rpPattern.test(onKeyVar) && (!e.ctrlKey && !e.key == "v")){
                    
                    $(this).val($(this).val().replace(rpPattern, ''));
			        $(this).focus();
			        return true;
                }
                else if(!gfnIsNull($(this).attr('min')) && parseInt($(this).val()) < parseInt($(this).attr('min'))){
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    
                    $(this).val($(this).val().substring(0,$(this).val().length-1));
                    return true;
                }
                else if(!gfnIsNull($(this).attr('max')) && parseInt($(this).val()) > parseInt($(this).attr('max'))){
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    
                    
                    $(this).val($(this).val().substring(0,$(this).val().length-1));
                    return true;
                }
                
                else if(gfnIsNull($(this).attr('max')) && parseInt($(this).val()) > 99999999){
                	jAlert("숫자 입력은 최대 99999999 까지 입력 가능합니다.","알림");
                	
                	
                    $(this).val("99999999");
                    return true;
                }
                else{
                	
                    if($(this).hasClass("inputError")){
                        $(this).removeClass("inputError");
                    }
                }
                
            });
	     
        }else if(objType.type == "english"){
	        	
	            $(chkObj).keyup(function(e){

					
                    if (!(event.keyCode >=37 && event.keyCode<=40)) {
                    	var inputVal = $(this).val();
                        
                        
                        
                        if(!gfnIsNull(objType.engOption) && objType.engOption == "includeNumber"){
                        	
                            $(this).val(inputVal.replace(/[^a-z0-9]/gi,'')); 
                        }else{
                        	
                           $(this).val(inputVal.replace(/[^a-z]/gi,'')); 
                        }
                    }else{
	                	
	                    if($(this).hasClass("inputError")){
	                        $(this).removeClass("inputError");
	                    }
	                }
	            });   
        }else if(objType.type == "length"){
        	
         
            $(chkObj).keyup(function(e){
            	
                if(!gfnIsNull($(this).val())){
                	
                	var charByte = 0;
                	
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
                    	
                        if(!gfnIsNull(objType.msg)){
                        	jAlert(objType.msg,"알림");
                        	
                        	
                        	
                        }
                      
                        $(this).val($(this).val().substring(0,len));
                    }else{
                    	
                        if($(this).hasClass("inputError")){
                            $(this).removeClass("inputError");
                        }
                    }
                }
            });
            
            
            if(!gfnIsNull(objType.min)){
            	$(chkObj).blur(function(e){
                    if($(this).val().length < objType.min){
                    	
                        if(!gfnIsNull(objType.msg)){
                        	jAlert(objType.msg,"알림");
                        }
                        
                        $(this).addClass("inputError");
                    }else{
                    	
                        if($(this).hasClass("inputError")){
                            $(this).removeClass("inputError");
                        }
                    }
                });
            }
          
        }else if(objType.type == "email"){
            
            pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            $(chkObj).blur(function(e){
                if(pattern.test($(this).val()) == false){
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    
                    $(this).addClass("inputError");
                }else{
                	
                    if($(this).hasClass("inputError")){
                        $(this).removeClass("inputError");
                    }
                }
            });
            
        }else if(objType.type == "etc"){
        	
        	var eventHandler;
        	if(!gfnIsNull(objType.event)){
        		eventHandler = objType.event;
        	}
        	
        	if(!gfnIsNull(objType.pattern)){
        		
        		var pattern = objType.pattern;
        	}
        	
        	if(!gfnIsNull(objType.rpPattern)){
        		
        		var rpPattern = objType.rpPattern;
        	}
        	$(chkObj).on(eventHandler,function(e){
        		if(pattern.test($(this).val()) == false){
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg,"알림");
                    }
                    
                    
                    if(!gfnIsNull(rpPattern)){
	                    $(this).val($(this).val().replace(rpPattern, ''));
				        $(this).focus();
                    }else{
                    	
                        $(this).addClass("inputError");
    			        return false;
                    }
                }else{
                	if(gfnIsNull(rpPattern)){
	                	
	                    if($(this).hasClass("inputError")){
	                        $(this).removeClass("inputError");
	                    }
                	}
                }
        	});
        }else if(objType.type == "regExp"){
        	if( objType.required  ||    										
         			( objType.required == false && !gfnIsNull($("#"+objNm).val()) ) ) { 
	        	
	        	if(!gfnIsNull(objType.pattern)) {
	        		var pattern = objType.pattern;
	        	}
	        	if(new RegExp(pattern).test($("#"+objNm).val()) == false){
	        		
	            	
	                if(!gfnIsNull(objType.msg)){
	                	if(objType.msgType != "toast"){
	                		jAlert(objType.msg,"알림");
	                	}
	                	toast.push({body:objType.msg, type:'Warning'});
	                	rtn = false;
	                	$(chkObj).addClass("inputError");
	                }
	            }else{
	            	
	            	
	                if($(chkObj).hasClass("inputError")){
	                   $(chkObj).removeClass("inputError");
	                }
	            }
	        
        	}else if(objType.required == false && gfnIsNull($("#"+objNm).val())){
        		
                if($(chkObj).hasClass("inputError")){
                   $(chkObj).removeClass("inputError");
                }
        	}
        }
      
    });
    return rtn;
}



function gfnSaveInputValChk(arrObj){
    
    var chkObj;
    
    var pattern;
    
    var rpPattern;
    var rtn = true;
  
    $.each(arrObj,function(objNm,objType){  
        
        if(!gfnIsNull($('#'+objNm))){
            chkObj = $('#'+objNm);
        }else if(!gfnIsNull($('input[name='+objNm+']'))){
            
            chkObj = $('input[name='+objNm+']'); 
        }else{
        	
            return false;
        }
      
        
        if(objType.type == "number"){
        	pattern = /[^0-9]/g; 

                   if(pattern.test($(chkObj).val())){	
                	   
                	   $(chkObj).addClass("inputError");
                	   $(chkObj).focus();
                	   rtn = false;
                	   return false;
                   }
                  else if(!gfnIsNull(objType.min) && parseInt($(chkObj).val()) < parseInt(objType.min)){
                   	
                       if(!gfnIsNull(objType.msg)){
                       		jAlert(objType.msg,"알림");
                       }
                       $(chkObj).addClass("inputError");
                	   $(chkObj).focus();
                       rtn = false;
                       return false;
                   }
                   else if(!gfnIsNull(objType.max) && parseInt($(chkObj).val()) > parseInt(objType.max)){
                   		
                	   if(!gfnIsNull(objType.msg)){
                		   jAlert(objType.msg,"알림");
                       }
                	   
                       $(chkObj).addClass("inputError");
                	   $(chkObj).focus();
                       rtn = false;
                       
                   }
                   else{
                   	
                       if($(chkObj).hasClass("inputError")){
                    	   $(chkObj).removeClass("inputError");
                       }
                       rtn = true;
                   }
                   

   	     
       }else if(objType.type == "english"){

    	   pattern = /[^a-zA-Z]/gi;
    	   
			
           if ( pattern.test($(chkObj).val()) ) {
        	   $(chkObj).addClass("inputError");
        	   $(chkObj).focus();
        	   rtn = false;
               return false;
           }else{
           	
               if($(chkObj).hasClass("inputError")){
            	   $(chkObj).removeClass("inputError");
               }
               rtn = true;
           }

       }else if(objType.type == "length"){
           
              	
                  if(!gfnIsNull($(chkObj).val())){
                  	
                  	var charByte = 0;
                  	
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

                      
                      if(charByte > objType.max){
                      	
                          if(!gfnIsNull(objType.msg)){   
                          	jAlert(objType.msg,"알림");
                          }
                        
                         
	                   	  $(chkObj).focus();
	                      rtn = false;
	                      return false;
                      }else{
                      	
                          if($(chkObj).hasClass("inputError")){
                        	  $(chkObj).removeClass("inputError");
                          }
                          rtn = true;
                      }
                  }

              
              
              if(!gfnIsNull(objType.min)){

                      if($(chkObj).val().length < objType.min){
                      	
                          if(!gfnIsNull(objType.msg)){
                          	jAlert(objType.msg,"알림");
                          }
                          
                          $(chkObj).addClass("inputError");
	                   	  $(chkObj).focus();
                          rtn = false;
                          return false;
                      }else{
                      	
                          if(chkObj.hasClass("inputError")){
                        	  chkObj.removeClass("inputError");
                          }
                      }

              }
            
          }else if(objType.type == "email"){
              
              pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
                  if(pattern.test($(chkObj).val()) == false){
                  	
                      if(!gfnIsNull(objType.msg)){
                      	jAlert(objType.msg,"알림");
                      }
                      
                      $(chkObj).addClass("inputError");
                   	  $(chkObj).focus();
                   	  rtn = false;
                   	  return false;
                  }else{
                  	
                      if($(chkObj).hasClass("inputError")){
                    	  $(chkObj).removeClass("inputError");
                      }
                  }
              
          }else if(objType.type == "etc"){
          	
          	var eventHandler;
          	if(!gfnIsNull(objType.event)){
          		eventHandler = objType.event;
          	}
          	
          	if(!gfnIsNull(objType.pattern)){
          		
          		var pattern = objType.pattern;
          	}
          	
          	if(!gfnIsNull(objType.rpPattern)){
          		
          		var rpPattern = objType.rpPattern;
          	}
          	$($(chkObj)).on(eventHandler,function(e){
          		if(pattern.test($(chkObj).val()) == false){
                  	
                      if(!gfnIsNull(objType.msg)){
                      	jAlert(objType.msg,"알림");
                      }
                      
                      
                      if(!gfnIsNull(rpPattern)){
                    	  $(chkObj).val($(chkObj).val().replace(rpPattern, ''));
                    	  $(chkObj).focus();
                      }else{
                      	
                          $(chkObj).addClass("inputError");
                       	  $(chkObj).focus();
                       	  rtn = false;
      			        return false;
                      }
                  }else{
                  	if(gfnIsNull(rpPattern)){
  	                	
  	                    if($(chkObj).hasClass("inputError")){
  	                    	$(chkObj).removeClass("inputError");
  	                    }
                  	}
                  }
          	});
          	
          }else if(objType.type == "regExp"){
        	if( objType.required  ||    										
         			( objType.required == false && !gfnIsNull($("#"+objNm).val()) ) ) { 
	        	
	        	if(!gfnIsNull(objType.pattern)) {
	        		var pattern = objType.pattern;
	        	}
	        	if(new RegExp(pattern).test($("#"+objNm).val()) == false){
	        		
	            	
	                if(!gfnIsNull(objType.msg)){
	                	if(objType.msgType != "toast"){
	                		jAlert(objType.msg,"알림");
	                	}
	                	
	                	
	                	rtn = false;
	                	$(chkObj).addClass("inputError");
	                	$(chkObj).focus();
	                	return false;
	                }
	            }else{
	            	
	            	
	                if($(chkObj).hasClass("inputError")){
	                   $(chkObj).removeClass("inputError");
	                }
	            }
        	
        	}else if(objType.required == false && gfnIsNull($("#"+objNm).val())){
        		
                if($(chkObj).hasClass("inputError")){
                   $(chkObj).removeClass("inputError");
                }
        	}
        }
    });
    return rtn;
}





function gfnInputValChk2(arrObj){
    
    var chkObj;
    
    var pattern;
    
    var rpPattern;
    $.each(arrObj,function(objNm,objType){
        
        if(!gfnIsNull($('#'+objNm))){
            chkObj = $('#'+objNm);
        }else if(!gfnIsNull($('input[name='+objNm+']'))){
            
            chkObj = $('input[name='+objNm+']');
        }else{
        	
            return false;
        }
        if(objType.type == "etc"){
        	
        	var eventHandler;
        	if(!gfnIsNull(objType.event)){
        		eventHandler = objType.event;
        	}
        	
        	if(!gfnIsNull(objType.pattern)){
        		
        		var pattern = objType.pattern;
        	}
        	
        	if(!gfnIsNull(objType.rpPattern)){
        		
        		var rpPattern = objType.rpPattern;
        	}
        	$(chkObj).on(eventHandler,function(e){
        		if(pattern.test($(this).val()) == false){
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg);
                    }
                    
                    
                    if(!gfnIsNull(rpPattern)){
	                    $(this).val($(this).val().replace(rpPattern, ''));
				        $(this).focus();
                    }else{
                    	
                        $(this).addClass("inputError");
    			        return false;
                    }
                }else{
                	if(gfnIsNull(rpPattern)){
	                	
	                    if($(this).hasClass("inputError")){
	                        $(this).removeClass("inputError");
	                    }
                	}
                }
        	});
        }else if(objType.type == "regExp"){
        	if( objType.required == true  ||    										
         			( objType.required == false && !gfnIsNull($("#"+objNm).val()) ) ) { 
        	
        	if(!gfnIsNull(objType.pattern)) {
        		var pattern = objType.pattern;
        	}
        	if(pattern.test($("#"+objNm).val()) == false){
            	
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                	return false;
                }
            }
        	
        	}else if(objType.required == false && gfnIsNull($("#"+objNm).val())){
        		
                if($(chkObj).hasClass("inputError")){
                   $(chkObj).removeClass("inputError");
                }
                return false;
        	}
        }else{
        	
        	$(chkObj).on("keyup blur",function(e){
        		
        		if(!gfnIsNull(objType.type)){
        			
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
    
	function fnInCheck(e,objType,type){
		
		var targetObj = e.target
		if(type == "number"){
			var rpPattern = /[^0-9]/g;
			var onKeyVar = parseInt(e.key);
			if($.isNumeric(parseInt(onKeyVar)) == false){
            	
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                }
                
                $(targetObj).val($(targetObj).val().replace(rpPattern, ''));
            }
            if(!gfnIsNull($(targetObj).attr('min')) && $(targetObj).val() < $(targetObj).attr('min')){
            	
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                }
                $(targetObj).val('');
            }
		}else if(type == "length"){
			
            if(!gfnIsNull(targetObj.value)){
            	
            	var charByte = 0;
            	
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
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg);
                    }
                  
                    targetObj.value = targetObj.value.substring(0,len);
                }
            }
             
            if(!gfnIsNull(objType.min)){
                if(targetObj.value.length < objType.min){
                	
                    if(!gfnIsNull(objType.msg)){
                    	jAlert(objType.msg);
                    }
                    
                    $(targetObj).addClass("inputError");
                }else{
                	
                    if($(targetObj).hasClass("inputError")){
                        $(targetObj).removeClass("inputError");
                    }
                }
            }
		}else if(type == "email"){
			
			pattern = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
			if(pattern.test($(targetObj).val()) == false){
            	
                if(!gfnIsNull(objType.msg)){
                	jAlert(objType.msg);
                }
                
                $(targetObj).addClass("inputError");
            }else{
            	
                if($(targetObj).hasClass("inputError")){
                    $(targetObj).removeClass("inputError");
                }
            }
		}
	}
}

function gfnLayerHighLight(objId){
	
    var obj = $(objId);
    
	
	var objIdOffset = $(obj).offset();
	
    
    if(gfnIsNull($(obj))){ return false; }
    
    
    holder = $('<div id="maskBox"/>').css({
            position: 'absolute',
            zIndex: 90240,
            opacity: 0.5,
            top:0,
    		left:0
          });
    
    $(holder).appendTo('body');
    
    
    maskBox = {
            top: createMaskBox('top'),
            left: createMaskBox('left'),
            right: createMaskBox('right'),
            bottom: createMaskBox('bottom'),
          };
    
    
    
	function createMaskBox(position) {
		
		
		var maskStyle;
		
		
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
		
		setTimeout(function(){
			maskBoxReSize();
			
			
			
		},200);
	});
	
	
	$(document).on('scroll touchmove mousewheel', function(e) {
		maskBoxReSize();
		});
	
	if($(obj).outerWidth() <= 10 || $(obj).outerHeight() <= 10){
		$("#maskBox").on("click, mousedown",function(event){
			$(document).off('scroll touchmove mousewheel');
			$(this).remove();
		});
	}
	
	$(obj).on("click, mousedown",function(event){
			$(document).off('scroll touchmove mousewheel');
			$("#maskBox").remove();
    });
	
	
    function px(n) {
        return Math.round(n) + 'px';
    }
    
    function maskBoxReSize(){
    	
		objIdOffset = $(obj).offset();
		
		
		boxTop = this.maskBox.top;
		boxLeft = this.maskBox.left;
		boxRight = this.maskBox.right;
		boxBottom = this.maskBox.bottom;
		
		
		$(boxTop).css({	
	        left: px(objIdOffset.left),
	        width: px($(obj).outerWidth()),
	        height: px(objIdOffset.top), 
	        }).children('.maskLine').css({bottom:0});
		$(boxLeft).css({	
	        width: px(objIdOffset.left),
	        height: px($(document).height()), 
	        }).children('.maskLine').css({top:objIdOffset.top});
		
		$(boxRight).css({	
	        left: px((objIdOffset.left + $(obj).outerWidth())),
	        width: px(($(document).width() - (objIdOffset.left + $(obj).outerWidth()))),
	        height: px($(document).height()), 
	        }).children('.maskLine').css({top:objIdOffset.top});
		
		$(boxBottom).css({	
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
	
	if( $.inArray(fileExt, ["doc","docx","hwp","pdf","ppt","pptx","xls","xlsx","zip","jpg","jpeg","png","gif","css","css2","csv","htm","htm2","html","js","avi","mp3","mpeg","mpg","psd","rar","spl","swf","tar","text","tga","tgz","tif","tiff","txt","wav","wav2","bmp","jar","zip","eml","cell","show"]) == -1) {
		return false;
   }
	return true;
}



function gfnCutStrLen(str, maxByte, type) {
	
	if(gfnIsNull(str)){
		return "";
	}
	for (b = i = 0; c = str.charCodeAt(i);) {
		b += c >> 7 ? 2 : 1;
		if (b > maxByte)
			break;
		i++;
	}
	
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
	
	if(gfnIsNull(gfnReplace(reqLink, "http://","").trim()) || gfnIsNull(gfnReplace(reqLink, "https://","").trim())){
		reqLink = "#";
	}
	return reqLink;
}


function gfnDtmAgoStr(dateTime){
	var subTime = new Date() - dateTime;
	
	var rtnStr = "";
	
	
	var seqAgo = (60*1000);	
	var minAgo = seqAgo*60; 
	var hourAgo = minAgo*24; 
	
	subTime = parseInt(subTime);
	
	var formatDate = new Date(dateTime).format("yyyy-MM-dd HH:mm:ss");
	
	
	if(subTime < seqAgo){
		rtnStr = "방금전 <small>("+formatDate+")</small>";
	}else if(subTime >= seqAgo && subTime < minAgo){
		rtnStr = parseInt(subTime/seqAgo)+"분 전 <small>("+formatDate+")</small>";
	}else if(subTime >= minAgo && subTime < hourAgo){
		rtnStr = parseInt(subTime/minAgo)+"시간 전 <small>("+formatDate+")</small>";
	}else if(subTime >= hourAgo && subTime < (hourAgo*28)){ 
		rtnStr = parseInt(subTime/hourAgo)+"일 전 <small>("+formatDate+")</small>";
	}else{
		rtnStr = formatDate;
	}
	return rtnStr;
}


function gfnHourCalc(totalSecond){
	if(gfnIsNull(totalSecond)){
		return "0초";
	}
	
	var bldDurationStr = '';
	
	
	var bldDurationHh = parseInt(totalSecond/3600);

	
	var bldDurationMm = parseInt(totalSecond/60);
	
	
	if(bldDurationHh > 0){
		
		
		bldDurationMm = parseInt((totalSecond-(bldDurationHh*3600))/60);
		bldDurationStr = bldDurationHh+'시간 '+bldDurationMm+'분 ';
	}
	
	else if(bldDurationMm > 0){
		bldDurationStr = bldDurationMm+'분 ';
	}
	
	
	var bldDurationSs = parseInt(totalSecond%60);
	bldDurationStr += bldDurationSs+'초';
	
	return bldDurationStr;
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
	
	ajaxObj.setProperty({"async":false});
	ajaxObj.setFnSuccess(function(data){
		retObj = JSON.parse(data);	
	});
	
	
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

	
	
	
	return time;
}


function gfnGuideBoxDraw(type,$mainFrame,guideBoxInfo){
	
	var defaultArrowcolor = '#ff5643';
	
	
	if(!type || !gfnIsNull($("#global_main_guideBox"))){
		$("#global_main_guideBox").remove();
		return false;
	}
	
	browserWidth = "100%";
	browserHeight = "100%";
	
	
	
	var $globalGuideMainBox = $('<div class="global_main_guideBox" id="global_main_guideBox"></div>');
	$globalGuideMainBox.css({position: "absolute",width: browserWidth,height: browserHeight,top: 0,left: 0,"z-index": 10,"background-color":"rgba(0, 0, 0, 0.1)"});
	
	$mainFrame.append($globalGuideMainBox);
	$globalGuideMainBox.parent().css({position:"relative"});
	
		
	
	var frameOffset = {x:$globalGuideMainBox.offset().left,y:$globalGuideMainBox.offset().top};
	
	
	$.each(guideBoxInfo,function(idx, map){
		
		var arrowColor = map.arrowColor;
		
		
		if(gfnIsNull(arrowColor)){
			arrowColor = defaultArrowcolor;
		}
		var $targetDiv = $("[guide="+map.target+"]");
		
		
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
		
		
		var $subBoxList = $(".globalGuideBox#"+map.id+' .globalGuideBox_subTitle');
		var maxBoxWidth = 0;
		
		
		$.each($subBoxList,function(idx2,map2){
			var objWidth = parseInt($(map2).outerWidth())+20;
			if(objWidth > maxBoxWidth){
				maxBoxWidth = objWidth; 
			}
		});
		
		
		$subBoxList.css({width:maxBoxWidth+"px"});
		
		
		var eleOffset_st = {x:$targetDiv.offset().left,y:$targetDiv.offset().top};
		var eleSize_st = {w:$targetDiv.outerWidth(),h:$targetDiv.outerHeight()};
		
		
		var eleOffset_ed = {x:$("#"+map.id).offset().left,y:$("#"+map.id).offset().top};
		var eleSize_ed = {w:$("#"+map.id).outerWidth(),h:$("#"+map.id).outerHeight()};
		
		var p0x,p0y,p1x,p1y,p2x,p2y;
		
		
		p0x = (eleOffset_st.x-frameOffset.x)+(eleSize_st.w)/2;
		p0y = (eleOffset_st.y-frameOffset.y)+(eleSize_st.h)/2;

		
		if(!gfnIsNull(map.curve) && !map.curve){	
			p1x = p0x;
			p1y = p0y;
		}else{
			p1x = ((eleOffset_st.x-frameOffset.x)+(eleSize_st.w)/2);
			p1y = (eleOffset_st.y-frameOffset.y);
		}
		
		
		p2x = eleOffset_ed.x-frameOffset.x;
		p2y = (eleOffset_ed.y-frameOffset.y)+(eleSize_ed.h/2);
		
		
		
		if(map.position == "right"){
			p2x += eleSize_ed.w;
		}
		
		else if(map.position == "bottom"){
			p2x += eleSize_ed.w/2;
			p2y += eleSize_ed.h/2;
		}
		
		else if(map.position == "top"){
			p2x += eleSize_ed.w/2;
			p2y -= eleSize_ed.h/2;
		}
		
		
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
		
		
		$globalGuideMainBox.append(canvas);
		
		$(canvas).addClass('guideBox_targetLayer');
		
		
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
	
	
	$globalGuideMainBox.append('<div class="globalGuideBox" id="globalGuideBoxSearchClose" style="bottom:0;right:0;border:1px solid '+defaultArrowcolor+'">'
					+'<div class="globalGuideSubBox globalGuideBox_mainTitle">가이드 닫기: Ctrl + 마우스 왼쪽클릭</div></div>');
	
	
	$globalGuideMainBox.click(function(e){
		if(e.ctrlKey){
			gfnGuideBoxDraw(false);
		}
	});
	
	
	$(".globalGuideCloseBox").click(function(){
		
		var $targetMainObj = $(this).parent();
		
		
		
		$targetMainObj.next(".guideBox_targetLayer").remove();
		
		$targetMainObj.next(".curved_arrow").remove();
		
		
		$targetMainObj.remove();
		
		
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
	
	
	$(window).bind('keydown', function(e) {
		var keyCode = e.keyCode || e.which;
		if((keyCode == 112 || e.key == 'F1') && !(event.altKey ||event.ctrlKey || event.shiftKey || event.metaKey)){
			
			e.cancelable = true;
			e.stopPropagation();
			e.preventDefault();
			e.returnValue = false;

	        
			if(typeof gfnGuideOpenCnt[gfnGuideOpenCnt.length-1] == "function"){
				gfnGuideOpenCnt[gfnGuideOpenCnt.length-1]();
			}
		}
	});
}


function gfnGetBrowserType(){
	
	
	var browserType = "";
	
	
	var agent = navigator.userAgent.toLowerCase();
	
	
	if( agent.indexOf("edge") != -1 ){
		browserType = "edge";
	
	}else if( agent.indexOf("chrome") != -1 || agent.indexOf("safari") != -1 || agent.indexOf("firefox") != -1 ){
		browserType = "notMsBrowser";
	
	}else{
		browserType = "ie";
	}
	
	return browserType;
}


function gfnEscapeHtml(sValue){
	
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
