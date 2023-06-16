/**
 * function명 	: gfnCommonSetting [검색 상자 세팅 용]
 * function설명	: 검색 상자에서 사용유무, 승인상태, 중요도 등 선택상자에 공통코드를 적용 할 경우 사용한다.
 * 				  공통코드 테이블을 참조하여 콤보데이터를 가지고 온다.
 * 				  사용 예제 > gfnCommonSetting(mySearch,selectedObject.optionCommonCode,"searchCd","searchTxt");
 * @param searchObj			:	검색 정보를 가지고 있는 객체
 * @param cmmCode			:	공통코드
 * @param showSearchKey		:	SelectBox Key value
 * @param hideSearchKey		:	TextBox Key value
 * showSearchKey와 hideSearchKey가 서로 toggle된다.
 */
function gfnCommonSetting(searchObj,cmmCode,showSearchKey,hideSearchKey){
	/* 	
	*	공통코드 가져올때 한번 트랜잭션으로 여러 코드 가져와서 셀렉트박스에 세팅하는 함수(사용 권장)
	* 	1. 공통 대분류 코드를 순서대로 배열 담기(문자열)
	*	2. 사용구분 저장(Y: 사용중인 코드만, N: 비사용중인 코드만, 그 외: 전체)
	*	3. 공통코드 적용할 select 객체 직접 배열로 저장
	* 	4. 공통코드 가져와 적용할 콤보타입 객체 배열 ( S:선택, A:전체(코드값 A 세팅한 조회조건용), N:전체, E:공백추가,OS:선택 값 selected, 그 외:없음 )
	*	5. 동기 비동기모드 선택 (true:비동기 통신, false:동기 통신)
	*	마스터 코드 = REQ00001:요구사항 타입, REQ00002:중요도 
	*/

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

/**
 * function명 	: gfnGetMultiCommonCodeDataForm [조회 조건 select Box 용]
 * function설명	: 트랜잭션을 여러번 날리는게 아닌 단일 트랜잭션으로 콤보 코드를 가지고 오는 용도로 사용, 콤보용 공통 코드 및 공통코드명 가져올때 사용
 * 				  공통코드 테이블을 참조하여 콤보데이터를 가지고 온다.
 * 				  사용 예제 > gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
 * 				  Ex> 1. json data 세팅
 *	 						mstCd: 공통코드 마스터 코드
 *	 						useYn: 사용구분 저장(Y: 사용중인 코드만, N: 비사용중인 코드만, 그 외: 전체)
 *	 						comboType: 공통코드 가져와 적용할 콤보타입 객체 배열 ( S:선택, A:전체(코드값 A 세팅한 조회조건용), N:전체, E:공백추가, OS:select 객체에 OS="" 값 설정할경우 값 적용,그 외:없음 )
 *	 						targetObj: 공통코드 적용할 select 객체 ID(*)
 * 					  2. 대분류 코드를 세팅할 selectBox 객체를 배열로 대분류 코드 순서와 일치하게 세팅하여 보낸다.
 * 					  3. 사용여부가 사용인지, 미사용인지 아니면 전체를 다 가지고 올지를 판단. (N: 사용하지 않는 것만, Y: 사용하는 것만, 그외: 전체)
 *            		  4. 콤보타입을 전체, 선택, 일반 바로 선택 가능한 상태에 대한 조건을 순서대로 배열로 보낸다. ["S", "A", "E", "JSON",""] S: 선택, A: 전체, E:공백추가 OS:선택 값 selected , JSON:반환 데이터를 json으로 리턴 , 그 외: 없음  
 *            			OS: 해당 select attr에 OS="01" 등과 같이 입력 -> option elements 생성 후 해당 value의 option을 selected한다.
 *            			JSON: 반환 데이터를 기타 사용 할 수 있도록 JSON OBJECT로 제공 
 *                    5. input box data-osl-value="" 지정 후 값 넣는 경우 해당 option selected
 * @param commonCodeArr		:	공통코드 조회 필요 데이터
 * var commonCodeArr = [
		{mstCd: "ADM00003",useYn: "Y",targetObj: "#in_usrPositionCd"},
		{mstCd: "ADM00004",useYn: "Y",targetObj: "#in_usrDutyCd"},
		{mstCd: "CMM00001",useYn: "Y",targetObj: "#in_asideShowCd"},
		{mstCd: "CMM00001",useYn: "Y",targetObj: "#in_useCd"}
	]
	gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
 */
function gfnGetMultiCommonCodeDataForm(commonCodeArr , isAsyncMode){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"/cmm/cmm1000/cmm1000/selectCmm1000MultiCommonCodeList.do"
				,"async":isAsyncMode,"loadingShow":false}
			,{commonCodeArr: JSON.stringify(commonCodeArr)});
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		
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

/**
 * AJAX 통신 공통 처리
 * - ajax통신 옵션은 property에서 배열로 처리
 * - 로딩 바 기본(통신 완료 퍼센트)
 * - AJAX통신 중 Background처리가 있는 경우 무조건 async = true(동기) 처리  예) 메일 전송 AJAX
 * property 옵션
 * - url
 * - data
 * - dataType
 * - contentType
 * - async
 * - cache
 * - processData
 * data는 setData로 따로 설정 가능
 * 예제)
 * 1. 객체 선언과 동시에 옵션 세팅
 * var ajaxObj = new gfnAjaxRequestAction({
		"url":"<c:url value='/req/req2000/req2000/insertReq2000ReqCommentInfoAjax.do'/>"
		,"contentType":"application/x-www-form-urlencoded; charset=UTF-8"
		,"datatype":"json"
		,"async":false
		,"cache":true
		,"processData":true
		});
 * 
 * 2. 객체 선언과 이후 옵션 세팅
 * //setProperty를 여러번 나누어서 설정해도 상관 없음
 * var ajaxObj = new gfnAjaxRequestAction({
		"url":"<c:url value='/req/req2000/req2000/insertReq2000ReqCommentInfoAjax.do'/>"
		});
	ajaxObj.setProperty({
		"contentType":"application/x-www-form-urlencoded; charset=UTF-8"
		,"datatype":"json"
		,"async":false
		,"cache":true
		,"processData":true
	});
 * 
 * 3. data 설정
 * ajaxObj.setData({"prjId" : prjId, "reqId" : reqId, "reqCmnt" : reqCmnt});
 * var ajaxObj = new gfnAjaxRequestAction({
		"url":"<c:url value='/req/req2000/req2000/insertReq2000ReqCommentInfoAjax.do'/>"
		,"contentType":"application/x-www-form-urlencoded; charset=UTF-8"
		,"datatype":"json"
		,"async":false
		,"cache":true
		,"processData":true}
		,{"prjId" : prjId, "reqId" : reqId, "reqCmnt" : reqCmnt});
 * 3-1. 객체 선언과 동시에 data 설정
 * 
 * 4. AJAX 성공처리 함수 설정
 * //AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
    	//코멘트 등록 실패의 경우 리턴
    	if(data.saveYN == 'N'){
    		toast.push(data.message);
    		return;
    	}
    	//코멘트 리스트 세팅
    	gfnSetData2CommentsArea(data.reqCommentList, "reqCmntListDiv", "BRD");
    	//코멘트 입력창 클리어
    	$("#reqCmnt").val("");
    	toast.push(data.message);
	});
 * 
 * 5. AJAX 에러처리 함수 설정
 * ajaxObj.fnError(function(xhr, status, err){
 	
 	});
 * 
 * 6. AJAX 통신 준비, 통신 완료처리 4번과 동일
 * 
 * 7. AJAX 통신 시작
 * ajaxObj.send();
 * 
 * 		- 그 외 커스텀 추가 시 내용 삽입 - 
 * 2016-09-13			최초 작성			진주영
 * 2016-09-19			수정				진주영
 */
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
	        	
	        	try{
	        		obj.fnSuccess(data, status, xhr, responeAjaxTime);
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


/**
 * function명 	: gfnRequireCheck
 * function설명	: 폼id, 해당 폼에 속한 필수입력 객체 id, 사용자에게 보여줄 이름을 입력받아
 * 				  해당 폼의 공백여부 및 선택여부를 체크하여 true, false로 반환
 * 				  사용 예제 > gfnRequireCheck(formId, checkInputIdArr, checkInputNmArr);
 *            		  1. form ID 를 찾아 해당 form에 속한 객체의 필수 입력 사항을 체크.
 *            		  2. 입력한 객체에 입력값이 없을 경우 true 리턴
 * @param   	: formId			- Form ID
 * @param   	: checkInputIdArr	- 해당 Form에 속한 객체의 ID
 * @param   	: checkInputNmArr	- 해당 객체들의 디스플레이용 이름
 * 
 * 
 *- 수정 - 
 * 2018-08-06			error Class 추가					진주영
 */
function gfnRequireCheck(formId, checkObjArr, checkObjNmArr){
	var inputCnt = checkObjArr.length;
	if(inputCnt < 1){
		return false;
	}
	
	/* 
	 * 	필수 입력조건을 받아서 true, false 리턴함.
	 * 	input box가 select인 항목은 S 일경우만 트루 리턴.
	 */ 
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


/**
 * function명 	: gfnSetFormAllObjTabIndex
 * function설명	: form안의 전체 자식 객체에 tabindex 순서대로 처리
 * @param formObj 초기화할 Form ID 문자열
 * @param 
 */
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



/**
 * function 명 	: gfnSetData2ParentObj (요구사항 목록 관련 화면에서 사용)
 * function 설명	: json데이터로 온 객체(Json 형식 단건 list 아님)를 키와 동일한 부모 OBJ ID 안의 ID값을 찾아
 * 				  자동으로 데이터를 세팅하는 메서드.
 * 				  부모 obj 안에 포함되어 있는 폼엘레먼트들도 type을 체크하여 라디오 버튼을 제외하고는 밸류를 세팅한다.
 * @param json 	: json info(단건)
 * @param parentObj : parent Obj ID
 */
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
		                /*for (idx = 0, max = child.length; idx < max; idx++) {
		                    if (child[idx].value == val) {
		                        child[idx].checked=true;
		                        break;
		                    }
		                }
		                break;*/
		            case "checkbox":
		                child.checked = (val == 1);
		                break;
		            case "textarea":
		            	/*$(child).val(val.replace(/<br>/gi,'\n'));*/
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

/**
 * function 명 	: gfnShowLoadingBar
 * function 설명	: Ajax로 트랜잭션시 사용할 loading 바를 show/hide 한다.
 * @param isShow: 로딩바호출 : true, 로딩바숨김 : false
 * @param callbackFn: 로딩바 호출 후 실행 함수
 */
function gfnShowLoadingBar(isShow, callbackFn){
	if(isShow){
		$(".top_fixed").show(100, callbackFn);
	}
	else{
		$(".top_fixed").hide(100, callbackFn);
		$('.top_str').html('');
	}
}

/**
 * 	function 명 	: gfnLayerPopup
 *  function 설명	: 레이어 팝업을 호출한다.
 *  url			: 호출 URL
 *  data		: 1. json 형식 ex> {"key1" : "value1", "key2" : "value2"}
 *  			  2. form serialize 형식 ex> $("#formObj").serialize(); => id=jht&pw=jht
 *  width		: 레이어팝업의 가로사이즈 px	- default 540px
 *  height		: 레이어팝업의 세로사이즈 px	- default 444px
 *  overflowY	: overflow-y속성 기본값 hidden
 *  loadingShow : 로딩바 표현 = true, 미 표현 = false (기본값 true)
 */
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
		cssObj = {	/* 로우 추가시 height 수정 */
				"width" : width + "px",
				"height" : height + "px"				
			};
	}else{
		cssObj = {	/* 로우 추가시 height 수정 */
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




/**
 * 	function 명 	: gfnLayerPopupClose
 *  function 설명	: 레이어 팝업을 닫는다.
 */
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

/**
 * 	function 명 		: gfnCalRangeSet
 * 	function 설명		: 달력의 시작일과 종료일의 유효성 및 달력 아이콘 등, 달력 컴포넌트를 세팅하는 함수
 * 	@param fromId 	: 시작일 input의 ID 
 * 	@param toId	  	: 종료일 input의 ID
 * 	@param timeUseCd : timePicker 사용-true/미사용-false (default-false)
 */
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

/**
 * 	function 명 		: gfnCalRangeDel
 * 	function 설명		: 해당 오브젝트에 선언된 datepicker 제거
 * 	@param fromId 	: 시작일 input의 ID 
 * 	@param toId	  	: 종료일 input의 ID
 */
function gfnCalRangeDel(fromId, toId){
	$( "#" + fromId ).data('daterangepicker').remove();
	$( "#" + fromId ).next().remove();
	$( "#" + toId).data('daterangepicker').remove();
	$( "#" + toId ).next().remove();
	
}

/**
 * 	function 명 			: gfnCalSet
 * 	function 설명			: Input box에 달력속성 부여
 * 	@param formatType 	: 출력 일자 타입 (ex. yy-mm-dd) 
 * 	@param ~(동적)  		: 
 */
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

/**
 * 
 * @param formatType 	: 출력 일자 타입 (ex. yy-mm-dd) 
 * @param elementIds    : datepicker 가 적용될 elementId
 * @param options		: 추가 적용 옵션 예 minDate , maxDate 등.. datepicker의 모든 옵션 Object Type으로 적용가능
 */
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


/**
 * 널 체크
 * @param sValue
 * @returns {Boolean}
 */
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

/**
 * 문자열의 일부분을 다른 문자열로 치환
 * @param sOrg		가운데 부문을 얻어올 원본 문자열
 * @param sRepFrom	치환대상 문자열
 * @param sRepTo	치환될 문자열
 * @returns
 */
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
/**
 * 문자형식으로 변경
 * @param sText
 * @returns
 */
function gfnStr(sText){
	if(sText == undefined) return "";
	if(sText == null) return "";
	if(sText instanceof String) return sText;

	return ""+sText;
}
/**
 * function명 	: String 객체에 특정 문자 배열로 대체. 
 * function설명	: 문자열 객체에 {0},{1} 과 같은 형태로 {n}개를 선언한 다음
 * 				  n개수 만큼의 문자열을 배열에 입력된 값으로 대체 시킨다.
 * @param args	: {0} 과 같은 값을 대체 할 배열
 * ex) "지금 시간은 {0}시 {1}분 {2}초 입니다".format({'11','22','33'}); 
 * 		=> 지금 시간은 11시 22분 33초 입니다. 
 * 
 */
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

/**
 * 로딩화면 완료 퍼센트 구하기
 * AJAX속성에서 async:true (기본값)
 * AJAX속성에서 xhr: function(){return gfnLoadProgressStr();} 처리
 * AJAX처리 시작 0%에서 완료 시 100%
 * 로딩화면 종료에서 $('.top_str').html('') 처리
 */
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

/**
 * 업로드 게이지 바
 * AJAX속성에서 async:true (기본값)
 * AJAX속성에서 xhr: function(){return gfnLoadProgressBar(pgBarObj);} 처리
 * AJAX처리 시작 width0 ~ 100%
 * @param pgBarObj	: 게이지바 오브젝트 
 */
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

/**
 * Date Format Function
 * @param f
 * @returns
 */
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

/**
 * 	gfnCheckStrLength
 * 	설정한 글자수 이상은 '···' 처리 하여 리턴하는 스크립트
 * 	길이를 넣지 않거나 0으로 넣은경우는 문자열 그대로 리턴한다.
 */
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

/**
 * 지정된 Element(Input box)에서 엔터키 입력 시 해당 함수 실행
 * @param	fnc 실행 함수
 * 			매개변수가 있는 경우 전달된 매개변수 타입은 문자열(String)이여야 한다.
 * @param	objName Input box 아이디 값 (동적으로 매개변수 할당)
 */
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

/**
 * 해당 폼에서 자동으로 폼값을 가져와 FormData()에 세팅
 * @param formName	값을 가져올 폼 이름
 * @param fd		값을 넣을 FormData()
 */
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

/**
 * 해당 폼에서 자동으로 폼값을 가져와 FormData()에 세팅
 * @attr
 * - input box -	title -> 항목 명
 *					value -> 항목 값
 *					id	  -> 항목 필드명
 *					type  -> 항목 타입
 *					modifyset	-> 01- 이력 저장 항목[기본값], 02- 이력 저장 안함
 *					opttarget	-> 01 - 기본 컬럼, 02 - 추가 항목, 03 - 배포계획, 04 - 기본 항목
 *					opttype		-> 01 - 기본값 , 02- 공통코드(cmmcode 속성 값 필요), 03- 사용자, 04- 배포계획
 *					cmmcode		-> 공통코드
 *					optFlowId		-> 작업흐름 Id
 *					(opttype="02" cmmcode="REQ00001")
 *					hiddenset	-> 01 - type이 hidden이어도 jsonData 세팅, 02 - hidden이면 String 형으로[기본값]
 * @param formName	값을 가져올 폼 이름
 * @param fd		값을 넣을 FormData()

 */
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
		
		/* jsonData 세팅 */
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

/**
 * 객체 값이 숫자인지 확인하고 숫자가 아니라면 알파벳, 한글 지움
 * @param	숫자 유무 판별 객체 ID값
 * @returns 숫자인경우 true
 * 			숫자가 아닌경우 false
 * @desc	해당 함수 사용 후 같은 분기에 ajax로직이 있는 경우 에러가 발생한다. (숫자 체크 후 return되기 전 ajax이미 비동기 실행중)
 * 			if(gfnIsNumeric("objName")) 으로 ajax를 감싼다.
 */
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


/**
 * Input Box (ID or Class)의 값 길이를 체크한다.
 * @param objName	Input Box 아이디값 혹은 클래스이름
 * @param objDesc	해당 Input box의 이름
 * @param size		최대 글자 수
 */
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

/**
 * 유효성 값 체크
 * @param arrObj 유효성 체크 하려는 객체와 타입 설정
 * var arrChkObj = {[Object],[SubType]}
 * var arrChkObj = {"email":{"type":"email","msg":"이메일 형식이 아닙니다."}};
 * 
 * [Type]
 * number	: 숫자인지 확인
 * length	: 문자열 최대 길이 체크
 * email	: 이메일 형식 체크
 * english	: 영문인지 확인
 * etc		: 정규 표현식 지정 값 체크
 * 
 * [SubType]
 * type		: [Type]
 * max		: [Type]이 length인 경우 문자열 최대 길이 지정 (한글은 2Byte로 계산)
 * min		: [Type]이 length인 경우 문자열 최소 길이 지정
 * msg		: 값이 형식에 맞지 않는 경우 출력하려는 메시지 내용
 * engOption : 입력값이 영문,숫자인지 체크하기 위한 옵션, 옵션값으로 includeNumber를 사용 
 *             (예){"id":{"type":"english","engOption":"includeNumber"}};
 *             engOption을 사용하지 않으면 입력값이 영문인지만 체크
 * require=true	: 필수 입력 값 체크 (default = false)
 * +[Type]가 etc인 경우 [SubType]
 * pattern		: 매치하려는 정규 표현식
 * rpPattern	: 만약 값 치환이 필요한 경우 지정
 * 				  지정이 안된 경우 inputBox를 빨간 테두리로 변경하는 Class 삽입 동작
 * eventHandler	: 이벤트 발생 지정(key~, click, blur 등)
 * 
 * 		- 그 외 내용 추가 시 내용 삽입 - 
 * 2016-10-10			최초 작성(number,length,email)			진주영
 * 2018-08-06			숫자 parseInt 오류 수정					진주영
 */
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


/**
 * 데이터 저장 전 유효성 값 체크
 * @param arrObj 유효성 체크 하려는 객체와 타입 설정
 * var arrChkObj = {[Object],[SubType]}
 * var arrChkObj = {"email":{"type":"email","msg":"이메일 형식이 아닙니다."}};
 * 
 * [Type]
 * number	: 숫자인지 확인
 * length	: 문자열 최대 길이 체크
 * email	: 이메일 형식 체크
 * etc		: 정규 표현식 지정 값 체크
 * 
 * [SubType]
 * type		: [Type]
 * max		: [Type]이 length인 경우 문자열 최대 길이 지정 (한글은 2Byte로 계산)
 * min		: [Type]이 length인 경우 문자열 최소 길이 지정
 * msg		: 값이 형식에 맞지 않는 경우 출력하려는 메시지 내용
 * require=true	: 필수 입력 값 체크 (default = false)
 * +[Type]가 etc인 경우 [SubType]
 * pattern		: 매치하려는 정규 표현식
 * rpPattern	: 만약 값 치환이 필요한 경우 지정
 * 				  지정이 안된 경우 inputBox를 빨간 테두리로 변경하는 Class 삽입 동작
 * eventHandler	: 이벤트 발생 지정(key~, click, blur 등)
 */
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


/*****************************************************************************************/


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
/**
 * 특정 레이아웃 하이라이트 처리
 * (선택 영역 외에 영역을 마스크 처리 한다)
 * - 마스크 생성 후 선택 객체를 클릭하면 마스크가 제거된다.
 * - 마스크 생성 후 선택 영역이 10x10 이하 일경우 마스크 영역을 클릭하면 마스크가 제거된다.
 * - 마스크 생성 후 컨트롤 + 마우스 좌 클릭으로 마스크를 제거 할 수 있다.
 * @param objId 하이라이트 처리 하려는 객체
 * 예제:
 * gfnLayerHighLight('.button_complete.btn_exit')
 * gfnLayerHighLight('#REQ2016100700008')
 * gfnLayerHighLight('.reqChangeDiv.recentCmnt[reqid=REQ2016090300001]')
 * gfnLayerHighLight('#sprFlowChrtDiv')
 * 
 * 		- 그 외 내용 추가 시 내용 삽입 - 
 * 2016-11-03			최초 작성			진주영
 */
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
		
		/* 상단 마스크 영역
		 * (x,y) : (선택 객체 좌측 위치, 0) 
		 * (w x h) :  (선택 객체 실제 가로 길이 x 선택 객체 Top 위치)
		 */
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
	    /* 좌측 마스크 영역
		 * (x,y) : (0,0) 
		 * (w x h) :  (선택 객체 좌측 위치 x 페이지 세로 길이)
		 */
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
	    /* 우측 마스크 영역
		 * (x,y) : ((선택 객체 좌측 위치 + 선택 객체의 실제 가로 길이), 0) 
		 * (w x h) :  (선택 객체 좌측 위치 x 페이지 세로 길이)
		 */
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
	    /* 하단 마스크 영역
		 * (x,y) : (선택 객체 좌측 위치, (선택 객체 상단 위치 + 선택 객체의 실제 세로 길이)) 
		 * (w x h) :  (선택 객체의 실제 가로 길이 x (페이지 세로 길이 - (선택 객체 상단 위치 + 선택 객체의 실제 세로 길이)))
		 */
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


/**
 * 첨부파일 확장자 체크 ( 화이트 리스트 )
 * @param fileExt
 * @returns {Boolean}
 */
function gfnFileCheck( fileExt ){
	// 화이트 리스트가 아니라면 중지 업로드 중지.
	if( $.inArray(fileExt, ["doc","docx","hwp","pdf","ppt","pptx","xls","xlsx","zip","jpg","jpeg","png","gif","css","css2","csv","htm","htm2","html","js","avi","mp3","mpeg","mpg","psd","rar","spl","swf","tar","text","tga","tgz","tif","tiff","txt","wav","wav2","bmp","jar","zip","eml","cell","show"]) == -1) {
		return false;
   }
	return true;
}


/**
 * Byte수 구하여 문자열 자른 후 리턴
 *  
 * @param str
 * @param maxByte
 * @returns
 */
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

/**
 * 입력한 문자열이 maxByte를 초과할 경우 문자열을 잘라 리턴한다.
 *  
 * @param str 		입력받은 문자열
 * @param maxByte	최대 byte값
 * @returns
 */
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

/**
 * Byte수 구하여 리턴
 *  
 * @param str
 * @param maxByte
 * @returns
 */
function gfnStrByteLen(str) {
	var byteLen = 0;
	for(i=0;i<str.length;i++){
		b = str.charCodeAt(i);
		byteLen += b >> 7 ? 2 : 1;
	}
	return byteLen;
}

/**
 * 링크값을 받아서 빈값인경우 '#'을 리턴
 * @param str
 * @returns str
 */
function gfnReqLink(reqLink){
	//링크 내용이 있는지 확인
	if(gfnIsNull(gfnReplace(reqLink, "http://","").trim()) || gfnIsNull(gfnReplace(reqLink, "https://","").trim())){
		reqLink = "#";
	}
	return reqLink;
}

/**
 * Date timestamp값으로 몇분전, 몇시간전, 몇일전 표기
 */
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

/**
 * 
 * 엘리먼트의 byte입력 제한을 지정한다.
 * 엘리먼트의 maxlength 길이를 기준으로 byte수를 제한한다.
 * 예) 500 byte 제한
 *  <input type="text" title="서비스 명" class="input_txt" name="apiNm" id="apiNm" style="width:80%;" maxlength="500"  />
 * 
 * @param eventIdList
 */
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


/**
 * 콜백함수
 */
var commonPopFunction ;
/**
 * 공통 코드를 조회할수 있는 팝업을 생성한다. 
 * 
 * 사용예)
 * gfnCommonPopup("공휴일", $('#holiday').val() ,false,"${sessionScope.loginVO.licGrpId}","CMM00002",function(objs){
			//objs 는 배열 오브젝트 구조로 ADM4100테이블의 컬럼명과 매칭된다.
   });
 * 
 * 
 * @param title 팝업의 타이틀명
 * @param param 텍스트박스에 기본셋팅될 정보
 * @param isMulti 멀티 선택가능여부 false 단일선택 , true 멀티선택가능
 * @param licGrpId 라이센스 그룹명
 * @param mstCd 공통코드 그룹명
 * @param pFunc 선택버튼을 눌렀을때 선택된정보를 가져오는 콜백함수
 */
function gfnCommonPopup(title,param,isMulti,licGrpId,mstCd,pFunc){
	commonPopFunction = pFunc;
	var data = {
			"title" : title , "param"  : param , "isMulti" : isMulti ,
			"licGrpId" : licGrpId , "mstCd" : mstCd  
		};
			
	gfnLayerPopupOpen('/cmm/cmm1000/cmm1300/selectCmm1300View.do',data, "480", "453",'scroll');
}

/**
 * 공통 함수의 선택버튼을 눌렀을때 사용되는 함수
 * @param selGrid
 */
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

/**
 * SVN Revision 선택 팝업
 * 
 * @param prjId 프로젝트 ID
 * @param callView 어느 화면에서 호출했는지 구분하기 위한값 (시스템 관리자 메뉴의 SVN배정관리에서 호출시 admin, 그외에서 호출시 ""을 넘긴다.)
 * @param selBtnChk 선택버튼 사용 유무
 * @param pFunc 선택시 CallBack 함수
 */
function gfnSvnRevisionPopup(prjId, callView, selBtnChk, pFunc){
	commonPopFunction = pFunc;
	var data = {"prjId": prjId, "callView" : callView, "selBtnChk": selBtnChk  }; 
	 
	gfnLayerPopupOpen("/cmm/cmm1000/cmm1400/selectCmm1400View.do", data, '1300', '850','scroll');	
}

/**
 * Object를 처리하고 팝업을 닫는다 
 * @param selGrid
 */
function gfnDataRow(selGrid){
	
	commonPopFunction(selGrid);
	
	gfnLayerPopupClose();
}
/**
 * 기준일 이전의 날짜를 조회처리 
 * 
 * @param date
 * @param day 예  7 7일이전 -7 7일 이후
 * @param format
 * @returns {String}
 */
function gfnGetDayAgo(date,day,format){
	
	var time;
	var retdate= new Date( date - (  day * 60 * 60 * 24  * 1000 ) );
	/**
	 * 사용되는 포멧을 추가하여 처리
	 */
	if("yyyy-mm-dd"==format){
		time=retdate.getFullYear()+"-"+ (retdate.getMonth() + 1).zf(2) +"-"+retdate.getDate().zf(2);
	}
	
	return time;
}

/**
 * 
 * 날짜 기간을 검증한다.
 * 
 * @param fisrtDom
 * @param secondDom
 * @param term
 * @returns {Boolean}
 */
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

/**
 * 
 * 배포 정보를 조회할수 있는 팝업을 생성한다. 
 * 
 * 예)
 * var data = { "dplNm" :  $('#dplNm').val() , "dplSts" : "01" }; 
 * dplSts 배포상태 01 : 대기, 02 : 승인, 03 : 종료 <- 코드는 미정
 * gfnCommonDplPopup(data ,false,function(objs){
				if(objs.length>0){
					$('#dplId').val(objs[0].dplId);
					$('#dplNm').val(objs[0].dplNm);
				}
			});
 * 
 * 
 * 
 * @param param 텍스트박스에 기본셋팅될 정보 사용자 명 
 * @param isMulti 멀티 선택가능여부 false 단일선택 , true 멀티선택가능
 * @param pFunc
 */
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

/**
 * 배포 조회
 * @param ajaxParam
 * @returns {___anonymous99814_99815} 조회 결과 
 */
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

/**
 * 기준일 이전의 날짜를 조회처리 
 * 
 * @param date
 * @param day 예  7 7달이전 -7 7달 이후
 * @param format
 * @returns {String}
 */
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
	
	/**
	 * 사용되는 포멧을 추가하여 처리
	 */
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

/**
 * 가이드 상자
 * @param
 * 	type:			true - 가이드 상자 열기, false - 가이드 상자 닫기 (boolean)
 * 	$mainFrame:		가이드 상자가 열리는 부모 객체 (object)
 * 	guideBoxInfo:	가이드 상자 정보 (array)
 * 	@subparam
 * 		id:					가이드 상자 id
 * 		target:				가이드 대상 (div에 guide=target로 대상 설정 필수)
 * 		mainTitle: 			가이드 상자 제목
 * 		top:				가이드 상자 y축 위치
 * 		left:				가이드 상자 x축 위치
 * 		position:			가이드 상자 화살표 도착 위치
 * 		targetPosition:		가이드 대상 화살표 시작 위치
 * 		curve:				화살표 곡선 유무(기본값 true) , true- 곡선 화살표, false- 직선 화살표
 * 		subBox:				가이드 상자 상세정보 내용
 * 			title:			가이드 상자 상세정보 제목
 * 			content:		가이드 상자 상세정보 내용
 * 				
 * 예제)
 * [{id:"flwGuide_leftMenu",target:"leftMenu",mainTitle:"[프로세스 기능]",top:2,left:300,position:"left",targetPosition:"right"
						,subBox:[
						         {title:"조회",content:"프로세스 목록 조회"}
						         ,{title:"추가",content:"프로세스 추가"}
						         ,{title:"수정",content:"선택 프로세스 수정"}
						         ,{title:"삭제",content:"선택 프로세스 삭제"}
						         ,{title:"복사",content:"권한있는 프로젝트의 확정된 프로세스를 복사"}
						         ,{title:"확정",content:"선택 프로세스 확정</br>(확정 완료시 작업흐름의 명칭과 색상 값만 수정이 가능합니다.)"}
						         ,{title:"확정 취소",content:"선택 프로세스 확정 취소</br>(배정된 요구사항이 없을경우 확정 취소가 가능합니다.)"}
						         ]}
					];
 **/
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
	/*
	if (window.screen) { //document.body.clientWidth
		browserWidth = $(document).outerWidth()+"px";
		browserHeight = $(document).outerHeight()+"px";
	}*/
	
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


/**
 * gfnGuideStack
 * F1키로 실행되는 함수 관리
 * @param	functionName : 가이드 상자 실행 함수(function) 
 * 		type
	 * 		add: function(functionName): 실행 함수 추가(페이지 ready시 선언)
	 * 		del: function() : 마지막 함수 제거(popup창 close시 사용)
 * 팝업창 가이드 상자의 경우
 * globals_guideChkFn 전역 변수에 가이드 상자 내용 함수 선언하면 사용 가능
 * ex) globals_guideChkFn = fnReq4105GuideShow;
 **/
var gfnGuideOpenCnt = [];
var globals_guideChkFn = null;
function gfnGuideStack(type,functionName){
	if(type == "del"){
		gfnGuideOpenCnt.splice((gfnGuideOpenCnt.length-1),1);
	}else{
		gfnGuideOpenCnt.push(functionName);
	}
}

/**
 * gfnGuideKeyAction
 * 브라우저 기본 F1(Help)를 중지하고 해당 솔루션 가이드 상자 open key로 활용
 **/
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

/**
 * function명 	: gfnGetBrowserType
 * function설명	: 사용자의 브라우저 타입을 체크하여 브라우저 종류를 문자열로 리턴한다.
 *                브라우저의 체크는 edge, ie, ms계열을 제외한 브라우저(chrome, safari, firefox)로 구분한다.
 */
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

/**
 *  function 명 	: gfnEscapeHtml
 *  function 설명	: &<>'" 문자 치환
 * @param sValue
 * @returns {Replace String}
 */
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
