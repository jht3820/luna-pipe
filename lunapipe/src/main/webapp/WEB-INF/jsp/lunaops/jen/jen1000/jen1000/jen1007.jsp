<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/jen.css'/>' type='text/css'>
<style type="text/css">
	.accptFont{color:#4b73eb !important;text-shadow: none !important;}
	.rejectFont{color:#eb4b6a !important;text-shadow: none !important;}
	.defaultFont{color:#000 !important;}
	.isCiIdNoneShow{display: none !important;}
	/* .tab_contents.menu {height:100%;display: inline-block;} */
</style>
<script>
//grid object
var jenkinsGrid, jobGrid, selJobGrid;
//search object
var jenkinsSearchObj, jobSearchObj, selJobSearchObj;

//선택 job 중복 체크
var overlapJob = {};

//JOB 빌드 파라미터
var ADD_JOB_PARAM_LIST = {};

//티켓 id
var ciId = '<c:out value="${requestScope.ciId}"/>';

$(function(){
	//jenkins 정보 호출
	fnJenkinsGridSetting();
	fnJenkinsSearchSetting();
	
	//job 정보 호출
	fnJobGridSetting();
	fnJobSearchSetting();
	
	//선택 job 데이터 세팅
	fnSelJobGridSetting();
	fnSelJobSearchSetting();
	
	//jobIdList 데이터 있는 경우 넣기
	var jobIdList = $("form#jen1007Form > #jobIdList").val();
	if(!gfnIsNull(jobIdList)){
		//사전에 등록되있던 데이터 있는 경우 해당 데이터 조회하기
		fnStartJobDataSetting(jobIdList);
	}
	
	//가이드 상자 호출
	gfnGuideStack("add",fnJen1007GuideShow);
	
	//선택 JOB 추가버튼
	$("#selJobAddBtn").click(function(){
		var chkList = jobGrid.getList('selected');
		if (gfnIsNull(chkList)) {
			jAlert("선택한 JOB이 없습니다.", "알림창");
			return false;
		}
		
		//중복 개수
		var overlapCnt = 0;
		
		//실제 추가되는 row
		var addDataRow = [];
		
		//추가 인덱스 숫자
		var addDataIdx = 0;
		
		//job 중복 체크
		$.each(chkList, function(idx, map){
			//jenkins있는지 체크
			if(overlapJob.hasOwnProperty(map.jenId)){
				//job있는지 체크
				if(overlapJob[map.jenId].hasOwnProperty(map.jobId)){
					overlapCnt++;
					return true;
				}
			}else{
				overlapJob[map.jenId] = {};
			}
			map["__selected__"] = false;
			overlapJob[map.jenId][map.jobId] = true;
			map["jobStartOrd"] = (selJobGrid.getList().length+1)+addDataIdx;
			addDataRow.push(map);
			addDataIdx++;
		});
		
		//alert 메시지
		var alertAddMsg = "";
		
		if(overlapCnt == chkList.length){
			jAlert("선택된 JOB은 이미 추가되있습니다.");
			return false;
		}
		else if(overlapCnt > 0){
			alertAddMsg = "</br>중복된 "+overlapCnt+"개의 JOB이 제외되었습니다.";
		}
		
		jAlert("JOB이 추가되었습니다."+alertAddMsg);
		
		//job추가
		selJobGrid.addRow(addDataRow);
		
	});
	
	//선택 JOB 제거 버튼
	$("#selJobDelBtn").click(function(){
		var chkList = selJobGrid.getList('selected');
		if (gfnIsNull(chkList)) {
			jAlert("선택한 JOB이 없습니다.", "알림창");
			return false;
		}
		
		//선택 job 제거
		$.each(chkList, function(idx, map){
			//중복체크 제거
			delete overlapJob[map.jenId][map.jobId];
			
			//빌드 파라미터 제거
			if(ADD_JOB_PARAM_LIST.hasOwnProperty(map.jenId) && ADD_JOB_PARAM_LIST[map.jenId].hasOwnProperty(map.jobId)){
				delete ADD_JOB_PARAM_LIST[map.jenId][map.jobId];
			}
		});
		
		//row 삭제
		selJobGrid.removeRow("selected");
		
		//데이터 인덱스 재 구축
		$.each(selJobGrid.list, function(idx, map){
			map["jobStartOrd"] = (idx+1);
		});
		
		//그리드 다시 그리기
		selJobGrid.repaint();
		
	});
	
	//전송 버튼
	$("#jenDataSendBtn").click(function(){
		//callback function 값
		var rtnValue = [];
		
		//선택한 JOB
		var selJenList = selJobGrid.getList();
		
		if (gfnIsNull(selJenList)) {
			jAlert("선택한  JOB이 없습니다.</br>추가하려는 JOB을 우측 목록에 추가해주세요.", "알림창");
			return false;
		}
		
		jConfirm("선택된 JOB "+selJenList.length+"개를 연결하시겠습니까?","알림창", function(result){
			if(result){
				//선택 JOB에 빌드파라미터 넣기
				if(!gfnIsNull(ADD_JOB_PARAM_LIST)){
					//필요 값
					var apiId = $("form#jen1007Form > #apiId").val();
					var srcId = $("form#jen1007Form > #ciId").val();
					var svcId = $("form#jen1007Form > #svcId").val();
					var fId = $("form#jen1007Form > #fId").val();
					var eGeneUrl = $("form#jen1007Form > #eGeneUrl").val();
					var ticketId = $("form#jen1007Form > #ticketId").val();
					var callbakApiId = $("form#jen1007Form > #callbakApiId").val();
					
					var urows = [];
					
					$.each(selJenList, function(idx, jobInfo){
						//jenId, jobId
						var jenId = jobInfo["jenId"];
						var jobId = jobInfo["jobId"];
						
						//파라미터
						var jobParamData = [];
						
						//해당 job에 빌드 파라미터 있는지 체크
						if(ADD_JOB_PARAM_LIST.hasOwnProperty(jenId) && ADD_JOB_PARAM_LIST[jenId].hasOwnProperty(jobId)){
							//카멜케이스 -> 스네이크케이스
							var newParamList = [];
							$.each(ADD_JOB_PARAM_LIST[jenId][jobId], function(idx, map){
								newParamList.push({
									"ci_id": srcId,
									"jen_id": jenId,
									"job_id": jobId,
									"default_val": map["defaultVal"],
									"job_param_key": map["jobParamKey"],
									"job_param_val": map["jobParamVal"],
									"job_param_type": map["jobParamType"]
								});
							});
							jobParamData = newParamList;
						}
						
						//반환 값 세팅
						var jobInfo = {
							"key": jobInfo.jobId+"_"+ticketId
							, "tkt_jen_id": jobInfo.jenId
							, "tkt_name": jobInfo.jenNm
							, "tkt_src_id": srcId
							, "tkt_descr": jobInfo.jenDesc
							, "tkt_order": jobInfo.jobStartOrd
							, "tkt_used": (jobInfo.useCd == "01")?1:2
							, "tkt_job_type": jobInfo.jobTypeNm
							, "tkt_var": jobParamData
							, "tkt_tgt_id": ticketId
							, "tkt_job_id": jobInfo.jobId
						}; 
						
						urows.push(jobInfo);
					});
					
					//리시브 전달 데이터
					var returnMap = {
						"svc_id": svcId
						, "urows": urows
					};
					
					//컨트롤러 전달 데이터
					var ctrlMap = {
						"f_id": fId
						, "src_id": srcId
						, "api_id": apiId
						, "ticket_id": ticketId
						, "callbak_api_id": callbakApiId
					};
					
					//data값 receiver에 전달
					var ajaxObj = new gfnAjaxRequestAction(
						{"url":"<c:url value='/api/selectSendDataReceiver'/>","loadingShow":true}
						,{
							//리시브 반환 데이터
							data: JSON.stringify(returnMap),
							//컨트롤러 전달 데이터
							ctlData: JSON.stringify(ctrlMap),
							eGeneUrl: eGeneUrl
						}
					);
					
					//AJAX 전송 성공 함수
					ajaxObj.setFnSuccess(function(data){
						//결과 값
						var result = data.result;
						
						//결과 처리 성공
						if(result == "SUCCESS"){
							//컨트롤러 데이터
							var enCtlData = data.enCtlData;
							
							//eController 호출
							var egene_controller = eGeneUrl+'plugins/jsp/lunaController.jsp?data='+encodeURIComponent(enCtlData);
							window.location.href = egene_controller;
							
						}else{
							jAlert(data.msg, "알림창");
							return false;
						}
					});
					
					//AJAX 전송
					ajaxObj.send();
				}else{
					jAlert("선택한  JOB이 없습니다.</br>추가하려는 JOB을 우측 목록에 추가해주세요.", "알림창");
					return false;
				}
				
			}
		});
			
	});
	
	//닫기 버튼
	$("#jenCloseBtn").click(function(){
		window.close();
	});
});

//jenkins grid
function fnJenkinsGridSetting(){
	jenkinsGrid = new ax5.ui.grid();
 
	jenkinsGrid.setConfig({
		target: $('[data-ax5grid="jenkinsGrid"]'),
		/* showRowSelector: true, */
		sortable:false,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "result", label: " ", width: 30, align: "center"
				,formatter:function(){
					var result = this.item.result;
					var faIcon = '';
					
					//icon
					if(result == "fail"){
						faIcon = "times-circle";
					}
					else if(result == "success"){
						faIcon = "check-circle";
					}else if(result == "progress"){
						faIcon = "circle-notch fa-spin";
					}else{
						faIcon = "circle";
					}
					
					return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
				}},
			{key: "jenNm", label: "JENKINS NAME", width: 180, align: "center"},
			{key: "jenUrl", label: "JENKINS URL", width: 280, align: "left"},
			{key: "jenUsrId", label: "JENKINS USER ID", width: 130, align: "center"},
			{key: "useNm", label: "사용유무", width: 85, align: "center"}
		],
		body: {
			align: "center",
			columnHeight: 30,
			onClick:function(){
				//이전 선택 row 해제
   				this.self.select(this.self.selectedDataIndexs[0]);
				
				//현재 선택 row 전체 선택
				this.self.select(this.doindex);
             	
				//jenkins명
				$("#selJenkinsNm").text(this.item.jenNm);
             	
				//Job 그리드 데이터 불러오기
				fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+this.item.jenId,false);
			},
			onDBLClick:function(){
				var data = {
						"jenNm": this.item.jenNm
						,"jenId": this.item.jenId
						, "jenUrl": this.item.jenUrl
						, "jenUsrId":this.item.jenUsrId
						, "jenUsrTok": this.item.jenUsrTok
				};
				gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1003JenkinsDetailView.do',data,"1065","595",'scroll');
			}
		},
		contextMenu: {
			iconWidth: 20,
			acceleratorWidth: 100,
     		itemClickAndClose: false,
     		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
     		items: [
				{type: "usrDetailPopup", label: "JENKINS 저장소 등록자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"}
     		],
     		popupFilter: function (item, param) {
     			//선택 개체 없는 경우 중지
     			if(typeof param.item == "undefined"){
       				return false;
      			}
     				return true;
     			},
     		onClick: function (item, param) {
     			var selItem = param.item;
     			// jenkins 저장소 등록자의 사용자 상세정보 팝업을 오픈한다.
     			if(item.type == "usrDetailPopup"){
               		if(gfnIsNull(selItem.regUsrId)){
             			jAlert('JENKINS 저장소 등록자가 없습니다.','알림창');
     					return false;
             		}else{
             			var data = {"usrId": param.item.regUsrId}; 
     					gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
             		}
             	}
     			//메뉴 닫기
     			param.gridSelf.contextMenu.close();
     		}
     	},
		page: {
			navigationItemCount: 9,
			height: 30,
  			display: true,
			firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
			prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
			nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
			lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
			onChange: function () {
				fnInJenkinsGridDataSet(this.page.selectPage,jenkinsSearchObj.getParam());
			}
		} 
	});
	//그리드 데이터 불러오기
	fnInJenkinsGridDataSet();
}

//그리드 데이터 넣는 함수
function fnInJenkinsGridDataSet(_pageNo,ajaxParam){
   	/* 그리드 데이터 가져오기 */
   	//파라미터 세팅
   	if(gfnIsNull(ajaxParam)){
 			ajaxParam = $('form#searchFrm').serialize();
	}
   	
   	//페이지 세팅
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof jenkinsGrid.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+jenkinsGrid.page.currentPage;
   	}
   	
   	//ci id 추가
   	ajaxParam += "&ciId="+ciId;
   	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JenkinsListAjax.do'/>","loadingShow":true}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var list = data.list;
		var page = data.page;
		
	   	jenkinsGrid.setData({
			list:list,
			page: {
				currentPage: _pageNo || 0,
				pageSize: page.pageSize,
				totalElements: page.totalElements,
				totalPages: page.totalPages
			}
		});
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//job grid
function fnJobGridSetting(){
	jobGrid = new ax5.ui.grid();
 
	jobGrid.setConfig({
		target: $('[data-ax5grid="jobGrid"]'),
		showRowSelector: true,
		sortable:false,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "result", label: " ", width: 30, align: "center"
				,formatter:function(){
					var result = this.item.result;
					var faIcon = '';
					
					//icon
					if(result == "fail"){
						faIcon = "times-circle";
					}
					else if(result == "success"){
						faIcon = "check-circle";
					}else if(result == "progress"){
						faIcon = "circle-notch fa-spin";
					}else{
						faIcon = "circle";
					}
					
					return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
				}},
			{key: "jobTypeNm", label: "JOB TYPE", width: 95, align: "center"},
			{key: "jobId", label: "JOB ID", width: 210, align: "center"},
			{key: "lastBldNum", label: "최근 빌드 번호", width: 100, align: "center"},
			{key: "lastBldResult", label: "최근 빌드 결과", width: 100, align: "center"},
			{key: "lastBldDurationTm", label: "최근 빌드 소요시간", width: 140, align: "center"
				,formatter: function(){
					//값이 없는 경우 '-'
					var rtnValue = "-";
					var lastBldDurationTm = this.item.lastBldDurationTm;
					
					//시간 값 계산
					if(!gfnIsNull(lastBldDurationTm)){
						rtnValue = gfnHourCalc((lastBldDurationTm/1000));
					}
					
					return rtnValue;
				}	
			},
			/* {key: "jobRestoreId", label: "원복 JOB ID", width: 170, align: "center"}, */
			/* {key: "useNm", label: "사용유무", width: 80, align: "center"} */
        ],
        body: {
			align: "center",
            columnHeight: 30,
            onClick: function () {
        		// 클릭 이벤트
   				this.self.select(this.doindex, {selected: !this.item.__selected__});	
            },
            onDBLClick:function(){
				var data = {"jenId": this.item.jenId, "jobId": this.item.jobId};
				gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1004JobDetailView.do',data,"1200", "870",'scroll');
            }
        },
        page: {
			navigationItemCount: 9,
            height: 30,
            display: true,
            firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
            prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
            nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
            lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
            onChange: function () {
            	var item = jenkinsGrid.getList('selected')[0];
				if(gfnIsNull(item)){
					toast.push('상단 목록에서 JENKINS를 선택해주세요.');
					return;
				}
	
				/* 검색 조건 설정 후 reload */
          		fnInJobGridListSet(this.page.selectPage,jobSearchObj.getParam()+"&jenId="+item.jenId,true);
            }
        } 
    });
}

//그리드 데이터 넣는 함수
function fnInJobGridListSet(_pageNo,ajaxParam,loadingShow){
   	/* 그리드 데이터 가져오기 */
   	//파라미터 세팅
   	if(gfnIsNull(ajaxParam)){
		ajaxParam = $('form#searchFrm').serialize();
	}
   	
   	//페이지 세팅
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof jenkinsGrid.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+jobGrid.page.currentPage;
   	}
   	
	//ciId 추가
   	ajaxParam += "&ciId="+ciId;
  
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobListAjax.do'/>","loadingShow":loadingShow}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var list = data.list;
		var page = data.page;
		
	   	jobGrid.setData({
			list:list,
			page: {
	            currentPage: _pageNo || 0,
	            pageSize: page.pageSize,
	            totalElements: page.totalElements,
	            totalPages: page.totalPages
			}
		});
	   	
	   	//ci_id가 있고 jobParamList가 있는 경우 세팅
	   	if(data.hasOwnProperty("jobParamList") && data.jobParamList != null && data.jobParamList.length > 0){
	   		$.each(data.jobParamList, function(idx, map){
	   			//jenId있는지 체크
	   			if(!ADD_JOB_PARAM_LIST.hasOwnProperty(map["jen_id"])){
	   				ADD_JOB_PARAM_LIST[map["jen_id"]] = {};
	   			}
	   			
	   			//jobId있는지 체크
	   			if(!ADD_JOB_PARAM_LIST[map["jen_id"]].hasOwnProperty(map["job_id"])){
	   				ADD_JOB_PARAM_LIST[map["jen_id"]][map["job_id"]] = [];
	   			}
	   			ADD_JOB_PARAM_LIST[map["jen_id"]][map["job_id"]].push({
	   				"jobParamKey": map["job_param_key"],
	   				"jobParamVal": map["job_param_val"]
	   			});
	   		});
	   	}
	});
	
	//AJAX 전송
	ajaxObj.send();
}


/**
 * jenkins 삭제
 */
function fnDeleteJen1000JenkinsInfo(jenId){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/deleteJen1000JenkinsInfoAjax.do'/>"}
			,{ "jenId" : jenId });
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		jAlert(data.message, "알림창");
		fnInJenkinsGridDataSet();
		//JOB 목록 초기화하기
		var gridList = jobGrid.getList();
		if(!gfnIsNull(gridList) && gridList.length > 0){
			$.each(gridList,function(){
				jobGrid.removeRow(0);
			});
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
} 

/**
 * job 삭제
 */
function fnDeleteJen1000JobList(jenId, jobIdList){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/deleteJen1000JobInfoAjax.do'/>"}
			,jobIdList);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		jAlert(data.message, "알림창");
		fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+jenId);
	});
	
	//AJAX 전송
	ajaxObj.send();
} 

//jenkins 검색 상자
function fnJenkinsSearchSetting(){
	jenkinsSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			jenkinsSearchObj.setConfig({
				targetID:"AXSearchTarget-jenkins",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"30", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[
                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'jenNm', optionText:'Jenkins 명'},
                                {optionValue:'jenDesc', optionText:'Jenkins 설명'},
                                {optionValue:'useCd', optionText:'사용 여부' , optionCommonCode:"CMM00001" }                                
                                
                            ],onChange: function(selectedObject, value){
                            	//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								//공통코드 처리 후 select box 세팅이 필요한 경우 사용
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(jenkinsSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).show();
									axdom("#" + jenkinsSearchObj.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"128", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + jenkinsSearchObj.getItemId("btn_search_jenkins")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"", labelWidth:"", type:"button", width:"80",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<span>전체 접속확인</span>",
       							onclick:function(){
       								//그리드 목록 갯수
       								var gridLen = jenkinsGrid.getList().length;
       								
       								//1개 이상인경우 체크
       								if(gridLen > 0){
       									//전체 Job conn 확인
       									fnSelectJen1000AllConfirmConnect(0);
       								}
                    	}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>선택 접속확인</span>",
   							onclick:function(){
   								var item = jenkinsGrid.getList('selected')[0];
   								if(gfnIsNull(item)){
   									toast.push('확인 할 목록을 선택하세요.');
   									return;
   								}
   								fnSelectJen1000ConfirmConnect(item,  jenkinsGrid.getList('selected')[0].__index );
                		}}
					]},
					{display:true, addClass:"", style:"", list:[
                    						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(jenkinsGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								jenkinsGrid.exportExcel("JENKINS_LIST.xls");
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_jenkins",style:"float:right;",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
					            fnInJenkinsGridDataSet(0,jenkinsSearchObj.getParam());
								
								//JOB grid 초기화
								axdom("#" + jobSearchObj.getItemId("searchSelect")).val(0).change();
					            jobGrid.setData([]);
					            
					            //jenkins nm 초기화
					            $("#selJenkinsNm").text("-");
						}}
                    	]
                  		},
				]
			});
		}
		/*,
		search1: function(){
			var pars = jenkinsSearchObj.getParam();
			fnAxGridView(pars);
		}
		*/
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
		axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		//공통코드 selectBox hide 처리
		axdom("#" + jenkinsSearchObj.getItemId("searchCd")).hide();
	});
}

//job 검색 상자
function fnJobSearchSetting(){
	jobSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			jobSearchObj.setConfig({
				targetID:"AXSearchTarget-job",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"30", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[
                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'jobId', optionText:'JOB ID'},
                                {optionValue:'jobDesc', optionText:'JOB 설명'},
                                {optionValue:'jobTypeCd', optionText:'JOB 타입' , optionCommonCode:"DPL00002" },                         
                                {optionValue:'useCd', optionText:'사용 여부' , optionCommonCode:"CMM00001" }                                
                                
                            ],onChange: function(selectedObject, value){
                            	//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + jobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + jobSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + jobSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								//공통코드 처리 후 select box 세팅이 필요한 경우 사용
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(jobSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
									axdom("#" + jobSearchObj.getItemId("searchTxt")).show();
									axdom("#" + jobSearchObj.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"148", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + jobSearchObj.getItemId("btn_search_jenkins")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"", labelWidth:"", type:"button", width:"80",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<span>전체 접속확인</span>",
       							onclick:function(){
       								//그리드 목록 갯수
       								var gridLen = jobGrid.getList().length;
       								
       								//1개 이상인경우 체크
       								if(gridLen > 0){
       									//접속확인 index 목록
       									var idxList = [];
										
       									//선택 저장소 loop
       									$.each(jobGrid.getList(), function(idx, map){
       										idxList.push(map.__original_index);
       									});
       									
       									//전체 Job conn 확인
       									fnSelectJen1000JobConfirmConnect(idxList);
       								}else{
       									toast.push("JOB이 존재하지 않습니다.");
       								}
                    	}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>선택 접속확인</span>",
   							onclick:function(){
   								var chkList = jobGrid.getList('selected');
								if (gfnIsNull(chkList)) {
									jAlert("선택한 JOB이 없습니다.", "알림창");
									return false;
								}
								
								//접속확인 index 목록
								var idxList = [];
								
								//선택 job loop
								$.each(chkList, function(idx, map){
									idxList.push(map.__original_index);
								});
								
   								fnSelectJen1000JobConfirmConnect(idxList);
                		}},
					]},
					{display:true, addClass:"", style:"", list:[
                    						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(jobGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								jobGrid.exportExcel("JENKINS-JOB_LIST.xls");
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_jenkins",style:"float:right;",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								var item = jenkinsGrid.getList('selected')[0];
								if(gfnIsNull(item)){
									toast.push('상단 목록에서 JENKINS를 선택해주세요.');
									return;
								}
								
								/* 검색 조건 설정 후 reload */
					            fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+item.jenId);
						}}
                    	]
                  		},
				]
			});
		}
		/*,
		search1: function(){
			var pars = jobSearchObj.getParam();
			fnAxGridView(pars);
		}
		*/
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
		axdom("#" + jobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		//공통코드 selectBox hide 처리
		axdom("#" + jobSearchObj.getItemId("searchCd")).hide();
	});
}


//선택 job grid
function fnSelJobGridSetting(){
	selJobGrid = new ax5.ui.grid();

	selJobGrid.setConfig({
		target: $('[data-ax5grid="selJobGrid"]'),
		showRowSelector: true,
		showLineNumber: false,
		sortable:false,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "jobStartOrd", label: "순서", width: 80, align: "center"
				,formatter: function(){
					return (this.item.__index)+1;
				}	
			},
			{key: "jobTypeNm", label: "JOB TYPE", width: 95, align: "center"},
			{key: "jobId", label: "JOB ID", width: 195, align: "center"},
			{key: "jenNm", label: "JENKINS NAME", width: 180, align: "center"},
			{key: "jenUrl", label: "JENKINS URL", width: 180, align: "center"},
			/* {key: "jobRestoreId", label: "원복 JOB ID", width: 170, align: "center"}, */
		],
		body: {
			align: "center",
			columnHeight: 30,
			onClick: function () {
				
        		// 클릭 이벤트
   				selJobGrid.select(this.doindex, {selected: !this.item.__selected__});	
            },
            onDBLClick:function(){
  				/* var data = {"jenId": this.item.jenId, "jobId": this.item.jobId};
  				gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1004JobDetailView.do',data,"1200", "870",'scroll'); */
            }
		}
	});
}


//선택 job 검색 영역(버튼)
function fnSelJobSearchSetting(){
	selJobSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			selJobSearchObj.setConfig({
				targetID:"AXSearchTarget-selJob",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"", labelWidth:"", type:"button", width:"125", key:"btn_update_job_param",style:"float:right;",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-indent' aria-hidden='true'></i>&nbsp;<span>빌드 파라미터 입력</span>",
							onclick:function(){
								var selJobList = selJobGrid.getList('selected');
								if (gfnIsNull(selJobList)) {
									jAlert("선택된 JOB이 없습니다.", "알림창");
									return false;
								}
								if(selJobList.length > 1){
									jAlert("1개의 JOB만 선택해주세요.", "알림창");
									return false;
								}
								
								var data = {
										"jenId" : selJobList[0].jenId,
										"jenUrl" : selJobList[0].jenUrl,
										"jobUrl" : selJobList[0].jobUrl,
										"jobId" : selJobList[0].jobId,
										"jenUsrId" : selJobList[0].jenUsrId,
										"jenUsrTok" : selJobList[0].jenUsrTok,
										"jobTok" : selJobList[0].jobTok
								};
								
								// 빌드 파라미터 팝업 호출
								gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1005View.do',data,"840","300",'scroll');
								
						}},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-arrow-down' aria-hidden='true'></i>&nbsp;<span>아래로</span>",
							onclick:function(){
								
								//선택 데이터 index 세팅
								var selDataIdx = [];
								$.each(selJobGrid.getList("selected"), function(idx, map){
									selDataIdx.push(map["__index"]);
								});
								
								//그리드 데이터  역순 loop
								for(var idx=selJobGrid.list.length;idx>=0;idx--){
									//현재 index가 선택 데이터에 있는지 체크
									if(selDataIdx.indexOf(idx) != -1){
										//맨 아래 데이터인 경우 skip
										if(idx == selJobGrid.list.length || gfnIsNull(selJobGrid.list[idx+1])){
											continue;
										}else{
											//이전 데이터 순서 -1
											selJobGrid.list[idx+1]["jobStartOrd"] -= 1;
											
											//현재 자신 순서 +1
											selJobGrid.list[idx]["jobStartOrd"] += 1;
											
											//순서 재 생성
											selJobGrid.setColumnSort({"jobStartOrd":{seq:0, orderBy:"asc"}});
										}
									}
									
								}
								
								//순서 재 생성
								selJobGrid.setColumnSort({"jobStartOrd":{seq:0, orderBy:"asc"}});
						}},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-arrow-up' aria-hidden='true'></i>&nbsp;<span>위로</span>",
							onclick:function(){
								//선택 데이터 index 세팅
								var selDataIdx = [];
								$.each(selJobGrid.getList("selected"), function(idx, map){
									selDataIdx.push(map["__index"]);
								});
								
								//그리드 데이터  loop
								$.each(selJobGrid.list, function(idx, map){
									//현재 index가 선택 데이터에 있는지 체크
									if(selDataIdx.indexOf(idx) != -1){
										//index가 0인 경우 skip
										if(selJobGrid.list[idx]["jobStartOrd"] == 1){
											return true;
										}else{
											//이전 데이터 순서 +1
											selJobGrid.list[idx-1]["jobStartOrd"] += 1;
											
											//현재 자신 순서 -1
											selJobGrid.list[idx]["jobStartOrd"] -= 1;
											
											//순서 재 생성
											selJobGrid.setColumnSort({"jobStartOrd":{seq:0, orderBy:"asc"}});
										}
									}
								});
						}}
                  	]
                		},
				]
			});
		}
		/*,
		search1: function(){
			var pars = selJobSearchObj.getParam();
			fnAxGridView(pars);
		}
		*/
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
		axdom("#" + selJobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		//공통코드 selectBox hide 처리
		axdom("#" + selJobSearchObj.getItemId("searchCd")).hide();
	});
}

//jenkins 접속 확인
function fnSelectJen1000ConfirmConnect(jenInfo, index){
	jenkinsGrid.setValue(index, "result", "progress");
	
	//AJAX 설정
	var jenkinsConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "jenUrl" : jenInfo.jenUrl, "jenUsrId": jenInfo.jenUsrId, "jenUsrTok": jenInfo.jenUsrTok });
	//AJAX 전송 성공 함수
	jenkinsConnAjaxObj.setFnSuccess(function(data){
		if(data.MSG_CD=="JENKINS_OK"){
			jenkinsGrid.setValue(index, "result", "success");
			toast.push("접속 상태 정상");
		}else{
			jenkinsGrid.setValue(index, "result", "fail");
			toast.push(data.MSG_CD);
		}
	});
	
	//AJAX 전송 오류 함수
	jenkinsConnAjaxObj.setFnError(function(xhr, status, err){
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	jenkinsConnAjaxObj.send();
} 

//jenkins 전체 접속 확인
function fnSelectJen1000AllConfirmConnect(index){
	//index -1인경우 return
	if(index == -1){
		return false;
	}
	//index가 현재 grid갯수보다 크면 return
	if(index >= jenkinsGrid.getList().length){
		return false;
	}
	
	jenkinsGrid.setValue(index, "result", "progress");
	
	//jenkins 정보
	var gridJenkinsInfo = jenkinsGrid.getList()[index];
	
	//AJAX 설정
	var jenkinsConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "jenUrl" : gridJenkinsInfo.jenUrl, "jenUsrId": gridJenkinsInfo.jenUsrId, "jenUsrTok": gridJenkinsInfo.jenUsrTok });
	//AJAX 전송 성공 함수
	jenkinsConnAjaxObj.setFnSuccess(function(data){
		if(data.MSG_CD=="JENKINS_OK"){
			jenkinsGrid.setValue(index, "result", "success");
			toast.push(gridJenkinsInfo.jenNm+": 접속 상태 정상");
		}else{
			jenkinsGrid.setValue(index, "result", "fail");
			toast.push(gridJenkinsInfo.jenNm+": "+data.MSG_CD);
			//return false;
		}
		//실패해도 다음 job 체크
		fnSelectJen1000AllConfirmConnect(++index);
	});
	
	//AJAX 전송 오류 함수
	jenkinsConnAjaxObj.setFnError(function(xhr, status, err){
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	jenkinsConnAjaxObj.send();
}

//job 전체 접속 확인
function fnSelectJen1000JobConfirmConnect(indexList){
	// 재귀 멈춤 조건
	if(gfnIsNull(indexList) || indexList.length == 0){
		return false;
	}
	//첫번째 index 빼기
	var targetIdx = indexList[0];
	
	//index 제거
	indexList.splice(0, 1);
	
	jobGrid.setValue(targetIdx, "result", "progress");
	
	//job 정보
	var gridJobInfo = jobGrid.getList()[targetIdx];
	
	//AJAX 설정
	var jenkinsConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobConfirmConnect.do'/>","loadingShow":false}
			,{ "jenId" : gridJobInfo.jenId, "jobId" : gridJobInfo.jobId });
	//AJAX 전송 성공 함수
	jenkinsConnAjaxObj.setFnSuccess(function(data){
		if(data.MSG_CD=="JENKINS_OK"){
			jobGrid.setValue(targetIdx, "result", "success");
			toast.push(gridJobInfo.jobId+": 접속 상태 정상");
		}else{
			jobGrid.setValue(targetIdx, "result", "fail");
			toast.push(gridJobInfo.jobId+": "+data.MSG_CD);
		}
		//실패해도 다음 job 체크
		fnSelectJen1000JobConfirmConnect(indexList);
	});
	
	//AJAX 전송 오류 함수
	jenkinsConnAjaxObj.setFnError(function(xhr, status, err){
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	jenkinsConnAjaxObj.send();
}


//가이드 상자
function fnJen1007GuideShow(){
	var mainObj = $(".main_contents");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["jen1007"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

//선택 JOB 빌드 이력 가져오기
function fnSelectJen1000JobBldLog(jobList){
	jConfirm("최근 빌드이력 100건을 동기화합니다.</br>빌드 이력 동기화시 오랜 시간이 소요 될 수 있습니다.</br>진행하시겠습니까?","알림", function(result){
		if(result){
			var paramData = "jenId=";
			
			//파라미터 세팅
			$.each(jobList, function(idx, map){
				//jenkins id
				if(idx == 0){
					paramData += map.jenId+"&jenUsrId="+map.jenUsrId+"&jenUsrTok="+map.jenUsrTok+"&jenUrl="+map.jenUrl;
				}
				paramData += "&jobId="+map.jobId;
			});
			
			//AJAX 설정
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobBldLogCheckOut.do'/>","loadingShow":true}
					,paramData);
			//AJAX 전송 성공 함수
			ajaxObj.setFnSuccess(function(data){
				if(data.MSG_CD=="JENKINS_OK"){
					//동기화된 빌드 이력 없음
					if(data.insertBldLogCnt <= 0){
						jAlert("동기화 대상 빌드 이력이 없습니다.","알림창");
					}else{
						jAlert("총 "+data.insertBldLogCnt+"건의 빌드이력을 동기화했습니다.","알림창");
					}
				}else{
					jAlert("빌드 이력 동기화 중 오류가 발생했습니다.","알림창");
				}
			});
			
			//AJAX 전송
			ajaxObj.send();
		}
	});
}

//사전에 등록되있던 데이터 있는 경우 해당 데이터 조회하기
function fnStartJobDataSetting(paramJobIdList){
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000SelJobList.do'/>"}
			,{"jenJobList": paramJobIdList});
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var jenJobList = data.jenJobList;
		
		//선 추가된 데이터 있는 경우 세팅
		if(!gfnIsNull(jenJobList)){
			addDataIdx = 0;
			
			$.each(jenJobList, function(idx, map){
				//jenkins있는지 체크
				if(!overlapJob.hasOwnProperty(map.jenId)){
					overlapJob[map.jenId] = {};
				}
				
				overlapJob[map.jenId][map.jobId] = true;
				map["jobStartOrd"] = (selJobGrid.getList().length+1)+addDataIdx;
				addDataIdx++;
				//job추가
				selJobGrid.addRow(map);
			});
		}
		
	});
	
	//AJAX 전송
	ajaxObj.send();
}
</script>


<div class="main_contents" style="height: auto;">
	<form name="jen1007Form" id="jen1007Form">
		<input type="hidden" name="ciId" id="ciId" value="${requestScope.ciId }"/>
		<input type="hidden" name="apiId" id="apiId" value="${requestScope.apiId }"/>
		<input type="hidden" name="svcId" id="svcId" value="${requestScope.svcId }"/>
		<input type="hidden" name="fId" id="fId" value="${requestScope.fId }"/>
		<input type="hidden" name="ticketId" id="ticketId" value="${requestScope.ticketId }"/>
		<input type="hidden" name="eGeneUrl" id="eGeneUrl" value="${requestScope.eGeneUrl }"/>
		<input type="hidden" name="callbakApiId" id="callbakApiId" value="${requestScope.callbakApiId }"/>
		<input type="hidden" name="jobIdList" id="jobIdList" value="<c:out value="${requestScope.jobIdList}"/>"/>
	</form>
	<div class = "tab_contents menu" >
		<div class="main_frame left">
			<div class="frame_contents">
				<div class="sub_title">
					JENKINS 관리
				</div>
				<div id="AXSearchTarget-jenkins" guide="jen1007JenkinsBtn"></div>
				<div class="dpl_wrap white">
					<input type="hidden" name="strInSql" id="strInSql" />
					<div data-ax5grid="jenkinsGrid" data-ax5grid-config="{}" style="height: 200px;" guide="jen1007JenkinsList"></div>	
				</div>
			</div>
			<div class="frame_contents">
				<div class="sub_title">
					JOB 관리 <small>[선택 JENKINS: <span id="selJenkinsNm">-</span>]</small>
				</div>
				<div id="AXSearchTarget-job" guide="jen1007JobBtn"></div>
				<div class="dpl_wrap white">
					<div data-ax5grid="jobGrid" data-ax5grid-config="{}" style="height: 300px;" guide="jen1007JobList"></div>	
				</div>
			</div>
		</div>
		<div class="main_frame middle">
			<button type="button" class="AXButton jobAddDelBtn" id="selJobAddBtn"><i class="fa fa-arrow-alt-circle-right"></i>&nbsp;추가</button>
			<button type="button" class="AXButton jobAddDelBtn" id="selJobDelBtn"><i class="fa fa-arrow-alt-circle-left"></i>&nbsp;제거</button>
		</div>
		<div class="main_frame right">
			<div class="frame_contents selectJobFrame">
				<div class="sub_title">
					선택 JENKINS&JOB 목록
				</div>
				<div id="AXSearchTarget-selJob" guide="jen1007SelJobBtn"></div>
				<div class="dpl_wrap white">
					<div data-ax5grid="selJobGrid" data-ax5grid-config="{}" style="height: 700px;" guide="jen1007SelJobList"></div>	
				</div>
			</div>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="jenDataSendBtn"><i class="fas fa-paperclip"></i>&nbsp;JENKINS&JOB 연결</div>
			<div class="mainPopupBtn" id="jenCloseBtn"><i class="fas fa-times-circle"></i>&nbsp;닫기</div>
		</div>
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />