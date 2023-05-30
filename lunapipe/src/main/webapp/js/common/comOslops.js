/**
 * GLOBALS_GRID_DTM_SEARCH
 * - 그리드 페이지에서 기간 검색 기본 값 (단위: 월)
 */
var GLOBALS_GRID_DTM_SEARCH = {
		"req1000"	:1				
		,"req2000"	:2				
		,"req4100"	:3				
		,"req4500"	:4				
		,"req4600"	:5				
		,"stm2002"	:6				
		,"stm2005"	:7				
		,"default"	:6				
}





function gfnCommonSetting(searchObj,cmmCode,showSearchKey,hideSearchKey){
	

	var mstCdStrArr = cmmCode;
	var strUseYn = 'Y';
	var arrObj = [axdom("#" + searchObj.getItemId(showSearchKey))];
	var arrComboType = ["OS"];
	
	
	axdom("#" + searchObj.getItemId(showSearchKey)).html('');
	
	
	gfnGetMultiCommonCodeDataForm(mstCdStrArr, strUseYn, arrObj, arrComboType , false);
	
	axdom("#" + searchObj.getItemId(showSearchKey)).show();
	axdom("#" + searchObj.getItemId(hideSearchKey)).hide();
}

function gfnGetMultiCommonCodeDataForm(mstCdStr, useYn, arrObj, arrComboType , isAsyncMode){
	
	
	var mstCdArr = mstCdStr.split("|"); 
	var mstCds = "";
	for(var i = 0 ; i < mstCdArr.length ; i++){
		mstCds += "'" + mstCdArr[i] + "'," ;	
	}
	mstCds = mstCds.substring(0,mstCds.length-1);
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm9000/cmm9100/selectCmm9100MultiCommonCodeList.do"
				,"async":isAsyncMode, loadingShow: false}
			,{ "mstCds":mstCds, "useYn":useYn, "mstCdStr":mstCdStr });
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);

    	if(data.ERROR_CODE == '-1'){
    		jAlert(data.ERROR_MSG,'알림창');
			return;
		}

    	
		var len = mstCdArr.length;
		
		for(var i = 0 ; i < len ; i++){
			
			var codeArr;
			var textArr;
			var strCodeData = eval("data.mstCd" + mstCdArr[i] + "code");
			var strTextData = eval("data.mstCd" + mstCdArr[i] + "text");
			
			
			if(arrComboType[i] == 'A'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');

				
				arrObj[i].append("<option value='A'>전 체</option>");
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + gfnEscapeHtml(textArr[j]) + "</option>");
				}
			}
			else if(arrComboType[i] == 'N'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');
				
				
				arrObj[i].append("<option value=''>전 체</option>");
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + gfnEscapeHtml(textArr[j]) + "</option>");
				}
			}
			else if(arrComboType[i] == 'S'){
				
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');

				
				arrObj[i].append("<option value=''>선 택</option>");
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + gfnEscapeHtml(textArr[j]) + "</option>");
				}
			}
			else if(arrComboType[i] == 'E'){
				
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');
				
				
				arrObj[i].append("<option value=''></option>");
				
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + gfnEscapeHtml(textArr[j]) + "</option>");
				}
				
			}
			else if(arrComboType[i] == 'JSON'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');

				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].innerHTML = gfnEscapeHtml(textArr[j]);
				}
			}
			else{
				
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + gfnEscapeHtml(textArr[j]) + "</option>");
				}
			}
			
			
			if(arrComboType[i] == 'OS'){
					$.each(arrObj[i],function(idx,map){
						if(!gfnIsNull($(map).attr('OS'))){
							var seledObj = $(map).children('option[value='+$(map).attr('OS')+']');
							if(!gfnIsNull(seledObj)){
								$(seledObj).attr('selected','selected');
							}
						}
					});
			}
		}
		
    	
		
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
			
		jAlert(xhr.statusText);;
	});
	
	ajaxObj.send();
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
	        	
	        	try{
	        		obj.fnSuccess(data, status, xhr, responeAjaxTime);
	        	}catch(e){
	        		console.log("success error: ");
	        		console.log(e);
	        		return;
	        	}
	        },
	        error: function(xhr, status, err){
	        	
	        	if(xhr.status == '999'){
	        		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
	        		document.location.href="/cmm/cmm4000/cmm4000/selectCmm4000View.do"
	        		return;
	        	}else{
	        		
	        		obj.fnError(xhr, status, err);
	        	}
	        	
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


function gfnGetUsrDataForm(useCd, arrObj, arrComboType , isAsyncMode){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm9000/cmm9200/selectCmm9200PrjUsrList.do"
				,"async":isAsyncMode}
			,{ "useCd":useCd });
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
    	
    	if(data.ERROR_CODE == '-1'){
    		jAlert(data.ERROR_MSG, '알림창');
			return;
		}
    	
    	
		var len = arrObj.length;
		
		for(var i = 0 ; i < len ; i++){
			var codeArr;
			var textArr;
			var strCodeData = data.usrIdcode;
			var strTextData = data.usrNmtext;
			
			if(arrComboType[i] == 'A'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');

				
				arrObj[i].append("<option value='A'>전 체</option>");
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + textArr[j] + "</option>");
				}
			}
			else if(arrComboType[i] == 'N'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');
				
				
				arrObj[i].append("<option value=''>전 체</option>");
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + textArr[j] + "</option>");
				}
			}
			else if(arrComboType[i] == 'S'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');

				
				arrObj[i].append("<option value=''>선 택</option>");
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + textArr[j] + "</option>");
				}
			}
			else if(arrComboType[i] == 'E'){
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');

				
				arrObj[i].append("<option value=''></option>");
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + textArr[j] + "</option>");
				}
			}
			else{
				
				codeArr = strCodeData.split('|');
				textArr = strTextData.split('|');
				
				for(var j = 0 ; j < codeArr.length; j++){
					arrObj[i].append("<option value='" + codeArr[j] + "'>" + textArr[j] + "</option>");
				}
			}
		}
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
			
		jAlert(xhr.statusText);
	});
	
	ajaxObj.send();
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


function gfnFormAllObjReset(form){
	var list = document.getElementById(form).elements;
	var listCnt = document.getElementById(form).elements.length;
	var inputType;
	
	for(var i = 0 ; i < listCnt ; i++ ){
		inputType = list[i].type.substring(0,3);
		
		switch (inputType){
			case "sel" :
				
				list[i].selectedIndex = 0;
				break;
			case "che" :
				
				$(list[i]).prop("checked", false);
				break;
			case "rad" :
				
				break;
			default :
				$(list[i]).val("");
				break;
		}
		
	}
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


function gfnSetDetailObj(jsonObj, objId, pk, pkKey){
	if(jsonObj == undefined){
		
		var keyArr = new Array();
		
		
		for(var key in jsonObj){
			toast.push(key);
			keyArr.push(key);
		}
		
		for(var i = 0; i < keyArr.length; i++){
			var key = keyArr[i];
			var val = gfnReplace(eval("jsonObj." + key), null, '');
			
			$("#" + objId + " #" + key).text(val);
			$("#" + objId + " #" + key).val(val);
		}
	}
	else{
		
		$.each(jsonObj, function(idx, map){
			if(pk == eval("map." + pkKey)){
				
				var keyArr = new Array();
	
				
				for(var key in map){
					keyArr.push(key);
				}
				
				for(var i = 0; i < keyArr.length; i++){
					var key = keyArr[i];
					var val = gfnReplace(eval("map." + key), null, '');
					
					$("#" + objId + " #" + key).text(val);
					$("#" + objId + " #" + key).val(val);
				}
			}
		});
	}
}


function gfnSetData2Form(jsonObj, frmId){

	var frmChilds = document.getElementById(frmId).elements;
	var child = null;
	var strType = null;
	var strValue = "";
	var frmChild = null;
	
	$.each(jsonObj, function(key, val){
		
		try{
			
			child = $("#" + frmId + " #" + key);
			strType = $("#" + frmId + " #" + key).attr("type");
	    
	        
	        if (typeof strType == "undefined" && child.length > 0) {
	            strType = child[0].type;
	        }
	    
	        
	        switch(strType) {
	            case undefined:
	            case "button":
	            case "reset":
	            case "submit":
	                break;
	            case "select-one":
	            	
	            	if(gfnIsNull(val)){
	            		$(child).children("option:eq(0)").attr("selected","selected");
	            	}else{
	            		$(child).val(val);
	            	}
	                break;
	            case "radio":
	                for (idx = 0, max = child.length; idx < max; idx++) {
	                    if (child[idx].value == val) {
	                        child[idx].checked=true;
	                        break;
	                    }
	                }
	                break;
	            case "checkbox":
	                child.checked = (val == 1);
	                break;
	            case "textarea":
		            	
	            		$(child).val(val.replace(/(<\/br>|<br>|<br\/>|<br \/>)/gi, '\r\n'));
		            	break;
	            default :
	                $(child).val(val);
	                break;
	        }
	        
	        
		}catch(e){
			
			return;
		}
	});
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


function gfnSetData2CommentsArea(mapList, parentId, mode){
	
	if(gfnIsNull(mapList)){
		return false;
	}
	
	
	if(mode == 'BRD'){
		$("#" + parentId).children().remove();
		
		var cmntAllCnt = 0;
		$.each(mapList, function(idx, map){
			cmntAllCnt = map.cmntAllCnt;
		});
		if(!gfnIsNull($('#cmntAllCnt'))){
			$('#cmntAllCnt').html('('+cmntAllCnt+'개)');
		}
		
		
		$.each(mapList, function(idx, map){
			
			
			var agoTime = gfnDtmAgoStr(new Date(map.regDtm).getTime());
			
			var reqCmnt = map.reqCmnt
			
			reqCmnt = reqCmnt.replace(/<script/g,"&lt;script");
			var subRCD = $("<div class='subRCD'>"+reqCmnt+"</div>"); 
			
			
			var cmntNonHtml = map.reqCmnt.replace(/(<([^>]+)>)/ig,"");
			
			$("#" + parentId).append(
				"<div onclick='fnRecentCmnt(this);' class='reqChangeDiv recentCmnt' reqId='"+map.reqId+"' title='"+cmntNonHtml+"'>"
					+subRCD[0].outerHTML
					+"<div class='subRCD'>"
						+map.regUsrNm+" - "
						+ agoTime
					+"</div>"
				+"</div>"
			);
		});
	}
	
	else{
		$("#" + parentId).children().remove();
		
		$.each(mapList, function(idx, map){
			$("#" + parentId).append(
										"<div class='comment_list'>"
									+		" <span class='comment_user'>" + map.regUsrNm + "</span>"
									+		" <span class='comment_date'>" + map.regDtm + "</span>"
									+		" <pre class='comment_contents'>" + map.reqCmnt + "</pre>"
									+	"</div>"
			);
		});
	}
}


function gfnSetData2ChgHistsArea(mapList, parentId, mode){

	if(mode == 'BRD'){
		$("#" + parentId).children().remove();
		
		var chgHistAllCnt = 0;
		$.each(mapList, function(idx, map){
			chgHistAllCnt = map.chgHistAllCnt;
		});
		
		$("#" + parentId).append("<div class='b_title' id='chgHistAllCnt'>요구사항 이력(" + chgHistAllCnt + "개)</div>");
		
		$.each(mapList, function(idx, map){
			var msg = "";
			if(map.chgGbCd == '01'){
				msg = map.preSprintNm + " => " + map.chgSprintNm;
			}
			else if(map.chgGbCd == '02'){
				msg = map.preFlowNm + " => " + map.chgFlowNm;
			}
			else{
				msg = map.preEtcNm + " => " + map.chgEtcNm;
			}
			
			$("#" + parentId).append(
										"<div class='b_sub'>"
									+		"<span class='b_user'>" + map.reqChgUsrNm + "</span>"
									+		"<img src='/images/contents/bar.png' alt='' class='bar_img' />"
									+		"<span class='b_one'>" + map.chgGbNm + "</span>"
									+		"<img src='/images/contents/bar.png' alt='' class='bar_img' />"
									+		"<span class='b_two'>" + msg + "</span>"
									+		"<img src='/images/contents/bar.png' alt='' class='bar_img' />"
									+		"<span class='b_date'>" + map.reqChgDtm + "</span>"
									+	"</div>"
			);
		});
	}
	else{
		$("#" + parentId).children().remove();
		
		$.each(mapList, function(idx, map){
			$("#" + parentId).append(
										"<div class='comment_list'>"
									+		" <span class='comment_user'>" + map.regUsrNm + "</span>"
									+		" <span class='comment_date'>" + map.regDtm + "</span>"
									+		" <pre class='comment_contents'>" + map.reqCmnt + "</pre>"
									+	"</div>"
			);
		});
	}
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


function gfnPos(sOrg, sFind, nStart)
{
	if( gfnIsNull(sOrg) || gfnIsNull(sFind) )	return -1;
	if( gfnIsNull(nStart) )	nStart = 0;

	return sOrg.indexOf(sFind, nStart);
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


function gfnFileListDiv(fileVo,divId){
	
	var size = gfnByteCalculation(fileVo.fileMg);
    var fnStr = "gfnFileDownload(this,false,'"+fileVo.fileExtsn+"', event)";
    
    
	var divTemp = $(
			"<div class='fileDivBoth'>"
			+"<div onclick="+fnStr+" class='fileInfo' atchId='"
			+fileVo.atchFileId
			+"' fileSn='"
			+fileVo.fileSn
			+"'>"
			+fileVo.orignlFileNm
			+" ("+size+")"
			+"</div><div onclick='gfnFileDelete(this, event);' class='fileDel'  atchId='"
			+fileVo.atchFileId
			+"' fileSn='"
			+fileVo.fileSn
			+"'>X</div>"
			+"</div>");
	$(divTemp).appendTo(divId);
}


function gfnFileListReadDiv(fileVo,divId,type,delChk){
	
	var fileExtsnImg = gfnFileExtImages(fileVo.fileExtsn);
	
	var size = gfnByteCalculation(fileVo.fileMg);

	
	var delChkClass = " delNone";
	var delEventStr = "";
	var delStr = "";
	
	
	if(gfnIsNull(delChk)){
		delChk = true;
	}

	
	if(typeof btnAuthDeleteYn != "undefined" && btnAuthDeleteYn == "Y" && type != "req4104" && delChk){
		delChkClass = "";
		var scriptStr = "gfnFileDelete($(this).siblings(\".file_contents\"), event)";
		delEventStr = " onclick='"+scriptStr+"'";
		delStr = '<div id="btn_delete_file" class="file_btn file_delete'+delChkClass+'"'+delStr+delEventStr+' atchId="'+fileVo.atchFileId+'">삭제</div>';
	}
	
	
	var scriptStr = "gfnFileDownload($(this),true)";
	downStr = " onclick='"+scriptStr+"'";

	
	var defaultStrLength = 30;
	
	
	if($(document).width() <= 1500){
		defaultStrLength = 20;
	}
	
	var creatDt_str = "";
	var creatDt = "";
	
	
	var fileCreatDt = fileVo.creatDt;
	if(!gfnIsNull(fileCreatDt)){
		fileCreatDt = fileCreatDt.replace(/-/g,"/");
		fileCreatDt = fileCreatDt.substring(0,fileCreatDt.indexOf("."));
	}
	
	
	if(typeof fileCreatDt == "undefined"){
		creatDt = new Date().format('yyyy-MM-dd HH:mm:ss');
	}else{
		creatDt = new Date(fileCreatDt).format('yyyy-MM-dd HH:mm:ss');
	}
	
	if(!gfnIsNull(type)){
		if(type == "doc"){
			defaultStrLength = 50;
			creatDt_str = "<span style='font-size:0.9em;'> - ("+creatDt+")</span>";
		}else if(type == "req" || type == "req4104"){
			defaultStrLength = 30;
		}else if(type == "more"){
			defaultStrLength = 16;
		}else if(type == "bad"){
			defaultStrLength = 30;
		}else if(type == "dpl"){
			defaultStrLength = 35;
		}else if(type == "req_popup"){
			defaultStrLength = 50;
		}else if(type == "newReq"){ 
			defaultStrLength = 50;
			delStr = "";
		}
	}
	
	
	
	var deleteType = "normal";
	
	if(type == "req" || type == "req_popup"){
		deleteType = "request";
	}
	
	
	var fileTitle = fileVo.orignlFileNm+" - ("+creatDt+")";

	
	var divTemp = $('<div class="file_frame_box">'
						+'<div class="file_main_box">'
							+'<div class="file_contents" prjId="'+fileVo.prjId+'" reqId="'+fileVo.reqId+'" deleteType="'+deleteType+'"'
							+' orgFileNm="'+fileVo.orignlFileNm+'"'
							+' atchId="'+fileVo.atchFileId+'" fileSn="'+fileVo.fileSn+'"'+downStr+' title="'+fileTitle+'">'+
							fileExtsnImg
							+gfnCutStrLen(fileVo.orignlFileNm, defaultStrLength)
							+'('+size+')'
							+creatDt_str
							+'</div>'
							+delStr
						+'</div>'
						+'<div class="file_progressBar"><div></div></div></div>');
	$(divTemp).appendTo(divId);
	
	
	return $(divTemp);
}






function gfnFileExtImages(fileExtsn){
	var extArrayGif = ["aif","aifc","aiff","app","arj","asf","asx","au","avi","bat","bmp","cdf","cgi","com","compressed","css","css2","csv","default","device","dif","dll","dv","eml","etc","exe","exe2","fla","gif","gz","htm","htm2","html","ico_plus","iff","image","img","ini","jfif","jpeg","jpg","js","lhz","lzh","mac","midi","mov","movie","mp2","mp3","mpe","mpeg","mpg","nws","pcx","ps","psd","qif","qt","qti","qtif","ra","ram","rar","rle","rm","rtf","rtf2","rv","sound","spl","swf","sys.gif","tar","text","tga","tgz","tif","tiff","txt","unknow","unknown","wav","wav2","wma","wmf","wmv","z"];
	var extArrayPng = ["psd","7z","xls","xlsx","gz","msi","ttf","gif","tgz","mid","fla","bin","bat","mpeg","swf","flv","bmp","html","pdf","jar","ai","png","doc","docx","tmp","htm","zip","jpg","eml","dat","iso","wav","tif","php","rar","jpeg","ppt","pptx"];
	var fileExtsnImg = "";
	if(extArrayPng.indexOf(fileExtsn) != -1){
		fileExtsnImg = '<img src="/images/ext/'+fileExtsn+'.png" style="height:20px;max-width:25px;margin-right:5px;"/>';
	}else if(extArrayGif.indexOf(fileExtsn) != -1){
		fileExtsnImg = '<img src="/images/ext/'+fileExtsn+'.gif" style="height:20px;max-width:25px;margin-right:5px;"/>';
	}else{
		fileExtsnImg = '<img src="/images/ext/etc.png" style="height:20px;max-width:25px;margin-right:5px;"/>';
	}
	return fileExtsnImg;
}


function gfnByteCalculation(bytes) {
    var bytes = parseInt(bytes);
    if(bytes < 0){
		return 0+" bytes";
	}
    var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes)/Math.log(1024));
   
    if(e == "-Infinity") return "0 "+s[0]; 
    else 
    return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
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
 

jQuery.download = function(url, data, method){
    if( url && data ){
        toast.push("다운로드 준비중입니다.<br>페이지를 이동하지 말아주십시오.");
        
        data = typeof data == 'string' ? data : jQuery.param(data);
        
        var tagNameInputBox = $("iframe#tmpFrame").contents().find("input");
        $("iframe#tmpFrame").contents().find("input").remove();
        
        
        
        var inputs = '';
        jQuery.each(data.split('&'), function(){
            var pair = this.split('=');
            inputs = document.createElement("INPUT");
            inputs.type = "hidden";
            inputs.name = pair[0];
            inputs.value = pair[1];
            $("iframe#tmpFrame").contents().find("form").append(inputs);
            
        });
        
        $("iframe#tmpFrame").contents().find("form")[0].action = url;
        $("iframe#tmpFrame").contents().find("form")[0].method = (method||'post');
        $("iframe#tmpFrame").contents().find("form")[0].submit();
        
        
        
       
    }else{
        console.log("non data");
    }
};



function gfnFileDownload(divElement,pdfDown,fileExtsn, event){
	try{
		event = event || window.event;
		event.stopPropagation();
	}catch(e){
		
		window.event.cancelBubble = true;
	}
	
	var downAtchFileId = $(divElement).attr('atchId');
	var downFileSn = $(divElement).attr('fileSn');
	if(gfnIsNull(downAtchFileId) || gfnIsNull(downFileSn)){
		alert("다운로드 실패");
	}else{
		
		if((!gfnIsNull(fileExtsn) && fileExtsn.trim() == "pdf") || (gfnIsNull(pdfDown))){
			var pdfFrame = window.open("/com/fms/pdfViewerPage.do?downAtchFileId="+downAtchFileId+"&downFileSn="+downFileSn, "_blank","location=no, menubar=no, width=1000,height=1000");
		}else{
			$.download('/com/fms/FileDown.do','downAtchFileId='+downAtchFileId+'&downFileSn='+downFileSn,'post');
		}
	}
}


function gfnFileDelete(divElement, event){
	try{
		event = event || window.event;
		event.stopPropagation();
	}catch(e){
		
		window.event.cancelBubble = true;
	}
	
	
	if(btnAuthDeleteYn != 'Y'){
		jAlert('삭제 권한이 없습니다.', '알림창');
		return false;
	}

	jConfirm("파일을 삭제하시겠습니까?", "알림창", function( result ) {
		
		if( result ){
			
			var atchFileId = $(divElement).attr('atchId');
			var fileSn = $(divElement).attr('fileSn');
			var prjId = $(divElement).attr('prjId');
			var reqId = $(divElement).attr('reqId');
			var deleteType = $(divElement).attr('deleteType');
			
			
			if(typeof deleteType == "undefined" || deleteType == null){
				deleteType = "normal";
			}
			
			
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"/com/fms/FileDelete.do"}
					,{ "atchFileId": atchFileId, "fileSn" : fileSn , "prjId": prjId, "reqId": reqId, "deleteType":deleteType});
			
			ajaxObj.setFnSuccess(function(data){
				data = JSON.parse(data);
		    	if(data.Success == 'Y'){
		    		$(divElement).parent().parent().remove();
		    		toast.push(data.message);
		    	}else{
		    		
		    		if(!gfnIsNull(data.nonFile) && data.nonFile == "Y"){
		    			$(divElement).parent().parent().remove();
		    		}
		    		toast.push(data.message);
		    	}
		  	  if(typeof fnSelHisInfoList == "function"){
		  		fnSelHisInfoList();
		  	  }
			});
			
			
			ajaxObj.setFnError(function(xhr, status, err){
					
				jAlert(xhr.statusText);
			});
			
			ajaxObj.send();
			
			
			function thisItemCancel(thisItem){
				if($(thisItem) != null){
					$(thisItem).sortable('cancel');
				}
			}

		}
	});    
}


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


function gfnEnterAction(fnFullNm){
	
	if(event.keyCode == '13'){
		eval(fnFullNm);
	}
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



function gfnFileDragDropUpload(obj,returnFunction){
	
	
	if(typeof btnAuthInsertYn == "undefined" || btnAuthInsertYn != 'Y'){
		return false;
	}
    if(obj != null){
    	obj.on('dragenter', function (e){
    	    e.stopPropagation();
    	    e.preventDefault();
    	    $(obj).addClass('dragOn');
    	});
    	obj.on('dragover', function (e){
    	     e.stopPropagation();
    	     e.preventDefault();
    	});
    	obj.on('dragleave', function(e){
    		$(obj).removeClass('dragOn');
    	});
    	
    	obj.on('drop', function (e){
    		
    		e.preventDefault();
    		$(obj).removeClass('dragOn');
    		
			if($(obj).is('.disabled')){
				jAlert('미 사용중인 기능입니다.');
				return false;
			}
    	    var files = e.originalEvent.dataTransfer.files;
	   
    	    
    	    if(files.length > 5){
    	    	toast.push("한번에 5개만 전송하실 수 있습니다.");
    	    }else{
    	    	 
	    	     $.each(files,function(idx,map){
	    	    	 if(!gfnIsNull(map)){
	    	    		 
	    	    		 
	    	    		 ext =map.name.split(".").pop().toLowerCase();
	    	    		 
	    	    		 if(!gfnFileCheck(ext)){
	    	    			 toast.push("확장자가 [ " +ext + " ] 인 파일은 첨부가 불가능 합니다.");
	    	    			 return false;
	    	    		 };
	    	    		   
	    	    		 
	    	    		 if(map.size < 1){
	    	    			 toast.push(map.name+"<br>파일의 크기가 0Byte인 경우 업로드가 불가능합니다.");
	    	    		 }else{
	    	    			 eval(returnFunction(map));
	    	    		 }
	    	    	 }
	    	    	 
	    	     });
    	     }
    	});
    	$(document).on('dragenter', function (e){
    	    e.stopPropagation();
    	    e.preventDefault();
    	});
    	$(document).on('dragover', function (e){
    	  e.stopPropagation();
    	  e.preventDefault();
    	  $(obj).removeClass('dragOn');
    	});
    	
    	$(document).on('drop', function (e){
    	    e.stopPropagation();
    	    e.preventDefault();
    	});
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


function gfnPrjGrpSetting(){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm4000/cmm4000/selectCmm4000prjGrpSet.do"});
	
	ajaxObj.setFnSuccess(function(data) {
		data = JSON.parse(data);
    	
    	
    	if(data.errorYN == 'Y'){
    		
    		location.href= "/cmm/cmm4000/cmm4000/selectCmm4000View.do";
    	}else{
    		
    		
    		$('.prj_select_box > #header_grp_select > option').remove();
    		
    		
    		$.each(data.prjGrpList,function(){
    			$('.prj_select_box > #header_grp_select').append('<option value="'+this.prjGrpId+'">'+this.prjGrpNm+'</option>');
    		});
    		
    		$(".prj_select_box > #header_grp_select > option[value="+data.selPrjGrpId+"]").attr("selected", "true");
    		
    		
    		$('.prj_select_box > #header_select > option').remove();
    		
    		$.each(data.prjList,function(){
    			$('.prj_select_box > #header_select').append('<option value="'+this.prjId+'">'+this.prjNm+'</option>');
    		});
    		
    		$(".prj_select_box > #header_select > option[value="+data.selPrjId+"]").attr("selected", "true");
    	}
	});

	
	ajaxObj.send();
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
	
	if(gfnIsNull(gfnReplace(reqLink, "http:
		reqLink = "#";
	}
	return reqLink;
}


function gfnAlarmOpen(usrId, usrNm, reqId, reqNm, reqPrjId, reqPrjGrpId){
	
	var data = {
		"sendChk": true,
		"usrIdChk": usrId,
		"usrNmChk": usrNm,
		"arm_reqId":reqId,
		"arm_reqNm":reqNm,
		"reqPrjId":reqPrjId,
		"reqPrjGrpId":reqPrjGrpId
	};
	gfnLayerPopupOpen('/arm/arm1000/arm1000/selectArm1000View.do',data,"1250","700",'scroll');
}

function gfnAlarmOpen2(thisObj){
	var usrId = $(thisObj).data("usr-id");
	var usrNm = $(thisObj).data("usr-nm");
	var reqId = $(thisObj).data("req-id");
	var reqNm = $(thisObj).data("req-nm");
	var prjId = $(thisObj).data("prj-id");
	var prjGrpId = $(thisObj).data("prj-grp-id");
	
	var data = {
		"sendChk": true,
		"usrIdChk": usrId,
		"usrNmChk": usrNm,
		"arm_reqId":reqId,
		"arm_reqNm":reqNm,
		"reqPrjId":prjId,
		"reqPrjGrpId":prjGrpId
	};
	gfnLayerPopupOpen('/arm/arm1000/arm1000/selectArm1000View.do',data,"1250","700",'scroll');
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


function gfnGetServerTime(format){
	var time="";
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/selectSelectServerTimeAjax.do","loadingShow":false}
			,{"format" : format });
	
	ajaxObj.async = false;

	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		time=data.serverTime;		
				
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		var nowdate = new Date();
		if("yyyy-mm-dd"==format){
			time=nowdate.getFullYear()+"-"+ (nowdate.getMonth() + 1).zf(2) +"-"+nowdate.getDate().zf(2);
		}else if("yyyy-mm"==format){
			time=nowdate.getFullYear()+"-"+ (nowdate.getMonth() + 1).zf(2);
		}
		
		
 	});
	
	ajaxObj.send();

	return time;
}

function gfnGetApikey(){
	var key="";
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/selectApiKeyAjax.do"}
			,{  });
	
	ajaxObj.async = false;

	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		key=data.apiKey;		
				
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
				
 	});
	
	ajaxObj.send();

	return key;
}


function gfnGetUrlList(){
	var list=[];
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/selectUrlListAjax.do"}
			,{  });
	
	ajaxObj.async = false;

	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		list=data.urlList;		
				
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
				
 	});
	
	ajaxObj.send();

	return list;
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

function gfnCommonUserPopup(param,isMulti,pFunc, paramPrjId){
	commonPopFunction = pFunc;
	var data={};
	var ajaxParam = "";
	var authParams = "";
	
	if(!gfnIsNull(paramPrjId)){
		paramPrjId = paramPrjId;
	}
	
	if(param instanceof Object){
		
		ajaxParam = "&searchPopTxt="+param.usrNm;
		if(!gfnIsNull(param.authGrpIds)){
			for(var i=0; i< param.authGrpIds.length; i++ ){
				if(i==0){
					authParams += param.authGrpIds[i];
				}else{
					authParams += "|"+param.authGrpIds[i];
				}
				ajaxParam += "&authGrpId="+param.authGrpIds[i];
			}
		}
		
		data = {
				"usrNm"  : encodeURI(param.usrNm) , "authParams" : authParams ,   
				"isMulti" : isMulti ,	"prjId": paramPrjId
		};
		
		if(!gfnIsNull(param.acceptUseCd)){
			data["acceptUseCd"] = param.acceptUseCd;
			ajaxParam += "&acceptUseCd="+param.acceptUseCd;
		}
	}else{
		data = {
				"usrNm"  : encodeURI(param)  , "isMulti" : isMulti   ,	"prjId": paramPrjId
			};
		ajaxParam = "&searchPopTxt="+param;
	}
	gfnLayerPopupOpen('/cmm/cmm1000/cmm1000/selectCmm1000View.do',data, "680", "450",'scroll');

}


function gfnSelectCmm1000CommonUserList(ajaxParam){
	var retObj = {};
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1000/selectCmm1000CommonUserListAjax.do","loadingShow":false}
			,ajaxParam);
	
	ajaxObj.setProperty({"async":false});
	ajaxObj.setFnSuccess(function(data){
		retObj = JSON.parse(data);	
	});
	
	ajaxObj.setFnError(function(xhr, status, err){
		
       	if(status == "999"){
       		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
    		return;
       	}
	});
	
	
	ajaxObj.send();
	return retObj;
}


function gfnInitDynamicComboBox(elementId, tableName, idColumn,nameColumn,conditionColumnNames){
	
	var param = {  "tableName" : tableName , "idColumn" : idColumn , "nameColumn" : nameColumn       };
	var conditionColSize = 0;
	if(!gfnIsNull(conditionColumnNames)){
		$.each( conditionColumnNames, function(columnName, columnValue){
			param["condCol"+conditionColSize] = columnName;
			param["condVal"+conditionColSize] = columnValue;
			conditionColSize++;	
		});
	}
	
	param["conditionColSize"] = conditionColSize;
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/selectDynamicComboBoxAjax.do"}
			,param);
	
	ajaxObj.async = false;
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
    	var html = '';
    	html += '<option value="">선 택</option>';
    	$.each( data.comboList, function(idx, map){
    		html += '<option value="'+ map.comboId +'" >'+ map.comboName +'</option>';
    	});
    	$('#'+elementId).html(html);
	});
	
	ajaxObj.send();
	
}


function gfnGetUpperDeptNames(selectDeptId){
	
	
	var deptNames = "";
	
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/adm/adm7000/adm7000/selectAdm7000UpperDeptListAjax.do"}
			,{ "deptId" : selectDeptId});
	
	ajaxObj.setProperty({"async":false});
	
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		
		
		var deptList = data.upperDeptList.reverse();
		
		
		if( !gfnIsNull(deptList) ){
			for (var i = 0; i < deptList.length; i++){
				deptNames += deptList[i].deptName
				if(i != deptList.length-1 ){
					deptNames += " > ";
				}
			}
		}
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		jAlert(data.message,"알림창");
		return;
	});
	
	
	ajaxObj.send();

	return deptNames;
}


function gfnSvnRevisionPopup(prjId, callView, selBtnChk, pFunc){
	commonPopFunction = pFunc;
	var data = {"prjId": prjId, "callView" : callView, "selBtnChk": selBtnChk  }; 
	 
	gfnLayerPopupOpen("/cmm/cmm1000/cmm1400/selectCmm1400View.do", data, '1300', '850','scroll');	
}



function gfnCommonProjectPopup(param,pFunc){
	commonPopFunction = pFunc;
	var data = {
			"prjNm"  : param   
		};
	gfnLayerPopupOpen("/cmm/cmm1000/cmm1100/selectCmm1100View.do", data, '810', '488','scroll');
}


function gfnCommonClsPopup(pFunc, param){
	commonPopFunction = pFunc;
	

	var prjId = "";
	if(!gfnIsNull(param) && param.hasOwnProperty("prjId") && !gfnIsNull(param.prjId)){
		prjId = param.prjId;
	}
	var data = {"prjId": prjId};
	gfnLayerPopupOpen('/cmm/cmm1000/cmm1500/selectCmm1500View.do',data, "480", "540",'scroll');
}

function gfnSelectClsTree(reqClsId,reqClsNm){
	commonPopFunction(reqClsId,reqClsNm);
	gfnLayerPopupClose();
}



function gfnCommonDeptPopup(searchDeptNm, pFunc){
	commonPopFunction = pFunc;
	var data = { "searchDeptNm"  : $.trim(searchDeptNm) };
	
	var retList = gfnSelectAdm7000DeptList($.trim(searchDeptNm));
	
	
	if(gfnIsNull(retList.deptList)){
		gfnLayerPopupOpen('/cmm/cmm1000/cmm1200/selectCmm1200View.do', data, "850", "671", 'auto');
	}else{
		
		if(retList.deptList.length==1){
			
			var deptInfo = retList.deptList[0];
			
			
			if(deptInfo.lvl != 0){

				
				var deptId = deptInfo.deptId;
				
				var deptNamesStr = gfnGetUpperDeptNames(deptInfo.deptId); 
				commonPopFunction(deptId, deptNamesStr);
			}
			else{
				
				gfnLayerPopupOpen('/cmm/cmm1000/cmm1200/selectCmm1200View.do', data, "850", "671", 'auto');
			}
			
		}else{
			gfnLayerPopupOpen('/cmm/cmm1000/cmm1200/selectCmm1200View.do', data, "850", "671", 'auto');
		}
	}
}


function gfnSelectDeptTree(deptId,deptNm){
	commonPopFunction(deptId,deptNm);
	gfnLayerPopupClose();
}


function gfnSelectAdm7000DeptList(searchDeptNm){
	
	var retObj = {};
	var sendData = { "viewType" : "cmm1200", "searchDeptNm" : searchDeptNm };
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/adm/adm7000/adm7000/selectAdm7000NormalDeptListAjax.do","loadingShow":false}
			,sendData);
	
	ajaxObj.setProperty({"async":false});
	
	
	ajaxObj.setFnSuccess(function(data){
		retObj = JSON.parse(data);
	});

	
	ajaxObj.setFnError(function(xhr, status, err){
		
       	if(status == "999"){
       		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
    		return;
       	}
	});
	
	
	ajaxObj.send();
	
	return retObj;
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

function gfnGetHtmlToPdf(obj,pdfName){
	var doc = new jsPDF();
	
	var layerIndex = $("#pdfEditor").length;
	if(layerIndex==0){
		$("body").prepend('<div id="pdfEditor" ><div>');
	}
				
	var specialElementHandlers = {
			'#pdfEditor': function (element, renderer) {
				 return true;
			}
	}
	gfnShowLoadingBar(true);
	html2canvas($(obj), {
		  onrendered: function(canvas) {
		 
		    
		    var imgData = canvas.toDataURL('image/png');
		     
		    var imgWidth = 210; 
		    var pageHeight = imgWidth * 1.414;  
		    var imgHeight = canvas.height * imgWidth / canvas.width;
		    var heightLeft = imgHeight;
		     
		        var doc = new jsPDF('p', 'mm');
		        var position = 0;
		         
		        
		        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
		        heightLeft -= pageHeight;
		         
		        
		        while (heightLeft >= 20) {
		          position = heightLeft - imgHeight;
		          doc.addPage();
		          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
		          heightLeft -= pageHeight;
		        }
		        gfnShowLoadingBar(false);
		        
		        doc.save(pdfName);
		  }
	});

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




function gfnCommonAuthPopup(prjId, param, isMulti,pFunc){
	commonPopFunction = pFunc;
	var data={};
	var ajaxParam = "";
	
	data = {
			"prjId" : prjId , "authGrpNm"  : param  , "isMulti" : isMulti   
		};
	
	ajaxParam = "&searchPopTxt="+param;
	
	if(!gfnIsNull(prjId)){
		ajaxParam = "&prjId="+prjId;
	}
	
	var authList = gfnSelectCmm1700CommonAuthList(ajaxParam);
	if(gfnIsNull(authList )){
		gfnLayerPopupOpen('/cmm/cmm1000/cmm1700/selectCmm1700View.do',data, "480", "450",'scroll');
	}else{
		if(authList.list.length==1){
			commonPopFunction(authList.list);
		}else{
			gfnLayerPopupOpen('/cmm/cmm1000/cmm1700/selectCmm1700View.do',data, "480", "450",'scroll');
		}
	}
}


function gfnSelectCmm1700CommonAuthList(ajaxParam){
	var retObj = {};
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1700/selectCmm1700CommonAuthListAjax.do","loadingShow":false}
			,ajaxParam);
	
	ajaxObj.setProperty({"async":false});
	ajaxObj.setFnSuccess(function(data){
		retObj = JSON.parse(data);	
	});
	
	ajaxObj.setFnError(function(xhr, status, err){
		
       	if(status == "999"){
       		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
    		return;
       	}
	});
	
	
	ajaxObj.send();
	return retObj;
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
	
	ajaxObj.setFnError(function(xhr, status, err){
		
       	if(status == "999"){
       		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
    		return;
       	}
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



function gfnCommonProcessPopup(param,isMulti,pFunc){
	commonPopFunction = pFunc;
	var data={};
	var ajaxParam = "";
	
	var processNm = "";
	if(!gfnIsNull(param.processNm)){
		processNm = param.processNm;
	}


	data = {
			"processNm"  : processNm  , "isMulti" : isMulti   
			   
		};
	
	ajaxParam = "&searchPopTxt="+processNm;
	
	var dplList = gfnSelectCmm1800ProcessList(ajaxParam);
	if(gfnIsNull(dplList )){
		gfnLayerPopupOpen('/cmm/cmm1000/cmm1800/selectCmm1800View.do',data, "480", "423",'scroll');
	}else{
		if(dplList.list.length==1){
			commonPopFunction(dplList.list);
		}else{
			gfnLayerPopupOpen('/cmm/cmm1000/cmm1800/selectCmm1800View.do',data, "480", "423",'scroll');
		}
	}
}


function gfnSelectCmm1800ProcessList(ajaxParam){
	var retObj = {};
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1800/selectCmm1800ProcessListAjax.do","loadingShow":false}
			,ajaxParam);
	
	ajaxObj.setProperty({"async":false});
	ajaxObj.setFnSuccess(function(data){
		retObj = JSON.parse(data);	
	});
	
	ajaxObj.setFnError(function(xhr, status, err){
		
       	if(status == "999"){
       		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
    		return;
       	}
	});
	
	
	ajaxObj.send();
	return retObj;
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



function gfnLicGrpAllProjectSetting(searchObj, showSearchKey, hideSearchKey){
	
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/prj/prj1000/prj1000/selectPrj1000ProjectGroupListAjax.do"
			,"loadingShow":false,"async":false});
	
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);

		
		if(data.errorYn == "Y"){
			toast.push(data.message);
			return false;
		}
		
		
		var prjList = data.prjList;
		
		
		var prjStr = "";
		
		
		var prjCnt = prjList.length - 1;
		
		
		$(prjList).each(function(idx, map) {

			
			if(map.prjGrpCd == "01" && map.leaf == 0){
				
				
				if(idx != 0){
					prjStr += "</optgroup>";
				}
				
				prjStr += "<optgroup label=[그룹]"+map.prjNm+" value="+map.prjId+">";
			}
			
			
			if(map.prjGrpCd == "02"){
				
				
				prjStr += "<option value="+map.prjId+">"+map.prjNm+"</option>";
				
				
				if(idx == prjCnt){
					prjStr += "</optgroup>";
				}
			}
		});
		
		
		axdom("#"+searchObj.getItemId(showSearchKey)).html(prjStr);
		
		
		axdom("#" + searchObj.getItemId(showSearchKey)).show();
		axdom("#" + searchObj.getItemId(hideSearchKey)).hide();
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		
       	if(status == "999"){
       		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
    		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
    		return;
       	}
	});
	
	
	ajaxObj.send();
}


function gfnAlarmCheckPopOpen(gridItem, armOpt){
	
	
	if(armOpt == "req"){
		
		
		var reqId = gridItem.reqId;
		var reqNm = gridItem.reqNm;
		
		
		var armUsrId = gridItem.reqChargerId;
		
		var armUsrNm = gridItem.reqChargerNm;
		
		
		if(gfnIsNull(gridItem.reqChargerId)){
			
			armUsrId = gridItem.reqUsrId;
			armUsrNm = gridItem.reqUsrNm;
		}
		
		
		gfnAlarmOpen(armUsrId, armUsrNm, reqId, reqNm);
	
	
	}else if(armOpt == "signChk"){
		
		var signUsrId = gridItem.signUsrId;
		var signUsrNm = gridItem.signUsrNm;
		
		
		if(gfnIsNull(signUsrId)){
			signUsrId = gridItem.regUsrId;
			signUsrNm = gridItem.regUsrNm;
		}
		
		
		var reqId = gridItem.reqId;
		var reqNm = gridItem.reqNm;
		
		
		if(!gfnIsNull(reqId) && !gfnIsNull(reqNm)){
			
			gfnAlarmOpen(signUsrId, signUsrNm, reqId, reqNm);
		}else{
			
			gfnAlarmOpen(signUsrId, signUsrNm);
		}
		
	
	}else if(armOpt == "signReq"){
		
		var signUsrId = gridItem.signUsrId;
		var signUsrNm = gridItem.signUsrNm;
		
		
		var reqId = gridItem.reqId;
		var reqNm = gridItem.reqNm;
		
		
		if(!gfnIsNull(reqId) && !gfnIsNull(reqNm)){
			
			gfnAlarmOpen(signUsrId, signUsrNm, reqId, reqNm);
		}else{
			
			gfnAlarmOpen(signUsrId, signUsrNm);
		}
	
		
	}else if(armOpt == "usr"){
		
		var usrId = gridItem.usrId;
		var usrNm = gridItem.usrNm;
		
		
		gfnAlarmOpen(usrId, usrNm);
	
	
	}else if(armOpt == "reqGrp"){
		
		var usrId = gridItem.reqGrpUsrId;
		var usrNm = gridItem.reqGrpUsrNm;
		
		
		gfnAlarmOpen(usrId, usrNm);
	}
	
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

function gfnReqGrpPopup(reqGrpNm, pFunc){
	commonPopFunction = pFunc;
	
	var data = {"reqGrpNm": reqGrpNm};
	gfnLayerPopupOpen("/req/req3000/req3000/selectReq3004View.do", data, '1350', '860','scroll');	
}


function gfnTestScenPopup(scenNm, pFunc){
	commonPopFunction = pFunc;
	
	var data = {"scenNm": scenNm};
	gfnLayerPopupOpen("/tes/tes1000/tes1000/selectTes1006View.do", data, '1350', '891','scroll');	
}


function gfnFlowNotLinkReqPopup(prjId, processId, flowId, reqId, pFunc){
	
	commonPopFunction = pFunc;
	var data = {"prjId": prjId, "processId" : processId , "flowId" : flowId, "reqId" : reqId }; 
	 
	gfnLayerPopupOpen("/req/req4000/req4100/selectReq4112View.do", data, '1200', '780','scroll');	
}


function gfnFlowNotLinkDocPopup(prjId, processId, flowId, reqId, pFunc){
	
	commonPopFunction = pFunc;
	var data = {"prjId": prjId, "processId" : processId , "flowId" : flowId, "reqId" : reqId }; 
	 
	gfnLayerPopupOpen("/req/req4000/req4100/selectReq4117View.do", data, '1200', '780','scroll');	
}


function gfnAsideRefresh(option){

	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm9000/cmm9000/selectCmm9000LeftMenuPartData.do","loadingShow":false},
			{"asideMenu":option});
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		
		
		if(data.errorYn != "Y"){
			
			var rtnMap = data.rtnMap;
			
			
			if(option == "sign"){
				
				var signWaitList = rtnMap.signWaitList;
	        	
	        	var allSignWaitCnt = parseInt(signWaitList.allSignWaitCnt);
	        	
	        	var reqSignWaitCnt = parseInt(signWaitList.reqSignWaitCnt);
	        	
	        	var dplSignWaitCnt = parseInt(signWaitList.dplSignWaitCnt);
	        	
	        	
	        	if(allSignWaitCnt > 0){
	        		
	        		$("#dtUsrSignWait").addClass("newAlarm");
	        	}else{
	        		$("#dtUsrSignWait").removeClass("newAlarm");
	        	}
				
	        	
	        	allSignWaitCnt 	= (allSignWaitCnt > 999) ? "999+" : allSignWaitCnt;
				
	        	
				$("#spanUsrSignWait").html(allSignWaitCnt);
				
				$("#sign_reqCnt").html(reqSignWaitCnt);
				
				$("#sign_dplCnt").html(dplSignWaitCnt);
				
				$("#sign_delegateCnt").append(reqSignDelegateCnt);
				
			
			}else if(option == "request"){
				
				var myReqCnt = rtnMap.requestAndChargeList;
				
	        	var requestCnt = parseInt(myReqCnt.requestCnt);
				
	        	var chargeCnt = parseInt(myReqCnt.chargeCnt);
				
				
	        	requestCnt 	= (requestCnt > 999) ? "999+" : requestCnt; 
	        	chargeCnt 	= (chargeCnt > 999) ? "999+" : chargeCnt; 
				
	        	
	        	$("#spanRegUsrReq").html(requestCnt);
				
	        	$("#spanChargerReq").html(chargeCnt);
				
	        	
	        	var allReqList = rtnMap.allReqList;
				
				var allReqCnt = parseInt(allReqList.allCnt);
				
				var acceptCnt = parseInt(allReqList.acceptCnt);
				
				var doCnt = parseInt(allReqList.doCnt);
				
				var doneCnt = parseInt(allReqList.doneCnt);
				
				var rejectCnt = parseInt(allReqList.rejectCnt);
				
				var signRejectCnt = parseInt(allReqList.signRejectCnt);
				
				var middleDoneCnt = parseInt(allReqList.middleDoneCnt);
				
				
				allReqCnt = (allReqCnt > 999) ? "999+" : allReqCnt; 
				acceptCnt = (acceptCnt > 999) ? "999+" : acceptCnt;
				
				
				var allReqTooltip = "전체 요구사항 건수 입니다. 클릭 시 처리 유형별 건수를 확인할 수 있습니다. (총 "+ allReqList.allCnt +"건)";
				$("#dtAllReq").attr("title", allReqTooltip);
				$("#spanAllReq").html(allReqCnt);
				
				
				var acceptReqTooltip = "접수 대기 상세 요구사항 건수입니다. (총 "+ allReqList.acceptCnt +"건)";
				$("#dtAcceptReq").attr("title", acceptReqTooltip);
				$("#spanAcceptReq").html(acceptCnt);
				
				
				$("#req_acceptCnt").html(allReqList.acceptCnt);
				$("#req_doCnt").html(doCnt);
				$("#req_doneCnt").html(doneCnt);
				$("#req_rejectCnt").html(rejectCnt);
				$("#req_signRejectCnt").html(signRejectCnt);
				$("#req_middleDoneCnt").html(middleDoneCnt);
			}
		}
		else{
			toast.push('좌측 정보 조회 실패');
		}
	});
	
	
	ajaxObj.send();
	
}
