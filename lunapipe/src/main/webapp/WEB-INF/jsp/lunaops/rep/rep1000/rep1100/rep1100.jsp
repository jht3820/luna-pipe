<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style type="text/css">
	.accptFont{color:#4b73eb !important;text-shadow: none !important;}
	.rejectFont{color:#eb4b6a !important;text-shadow: none !important;}
	.defaultFont{color:#000 !important;}
	.tab_contents.menu{width:1500px;}
</style>
<script>
var tktFileGridObj;
var tktFileSearchObj;

//선택된 소스저장소 데이터 목록
var selRepData = [];

$(function(){
	//그리드 검색 호출
	fnTktFileGridSetting();
	fnSearchBoxControl();
	
	//가이드 상자 호출
	gfnGuideStack("add",fnRep1100GuideShow);
	
	//전송 버튼
	$("#repDataSendBtn").click(function(){
		
		var rtnValue = [];
		
		//선택한 저장소
		var selRepList = tktFileGridObj.getList('selected');
		
		if (gfnIsNull(selRepList)) {
			jAlert("선택한 저장소가 없습니다.", "알림창");
			return false;
		}
		jConfirm("선택된 저장소 "+selRepList.length+"개를 연결하시겠습니까?","알림창", function(result){
			if(result){
				//필요 값
				var apiId = $("form#rep1100Form > #apiId").val();
				var srcId = $("form#rep1100Form > #ciId").val();
				var svcId = $("form#rep1100Form > #svcId").val();
				var fId = $("form#rep1100Form > #fId").val();
				var eGeneUrl = $("form#rep1100Form > #eGeneUrl").val();
				var callbakApiId = $("form#rep1100Form > #callbakApiId").val();
				
				//저장소 param
				var urows = [];
				
				//선택 저장소 값 loop
				$.each(selRepList, function(idx, map){
					var repInfo = {
						"key": map.repId+"_"+srcId
						, "svn_name": map.repNm
						, "svn_src_id": srcId
						, "svn_mod": ""
						, "svn_url": map.svnRepUrl
						, "svn_descr": map.repTxt
						, "svn_used": (map.useCd == "01")?1:2
						, "svn_rep_id": map.repId
					};
					
					urows.push(repInfo);
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
			}
		});
	});
	
	//닫기 버튼
	$("#repCloseBtn").click(function(){
		window.close();
	});
});

//axisj5 그리드
function fnTktFileGridSetting(){
	tktFileGridObj = new ax5.ui.grid();
 
	tktFileGridObj.setConfig({
		target: $('[data-ax5grid="tktFileGridTarget"]'),
		frozenColumnIndex: 3,
		sortable:false,
		showRowSelector: true,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "repNm", label: "저장소 명", width: 260, align: "center"},
			{key: "repRv", label: "리비전", width: 80, align: "center"} ,
			{key: "repChgFileNm", label: "변경 파일명", width: 240, align: "left"} ,
			{key: "repCmtDate", label: "커밋 일시", width: 135, align: "center"
				,formatter: function(){
					return new Date(this.item.repCmtDate).format('yyyy-MM-dd HH:mm:ss');
				}	
			} ,
			{key: "repCmtAuthor", label: "커밋 대상자", width: 100, align: "center"} ,
			{key: "repChgType", label: "파일 변경 타입", width: 95, align: "center"
				,formatter: function(){
					var repChgType = this.item.repChgType;
					var repChgTypeNm = "-";
					
					//수정 타입 분기
					if(repChgType == "A"){
						repChgTypeNm = "추가";
					}
					else if(repChgType == "M"){
						repChgTypeNm = "수정";
					}
					else if(repChgType == "D"){
						repChgTypeNm = "삭제";
					}
					
					return repChgTypeNm;
				}	
			} ,
			{key: "repChgFilePath", label: "변경 파일 경로", width: 1000, align: "left"} 
			/* 
			,{key: "repUrl", label: "저장소 URL", width: 250, align: "left", 
				formatter:function(){
					var repUrl = "";
					//github
					if(this.item.repTypeCd == "01"){
						repUrl = this.item.gitRepUrl;
					}
					//svn
					else if(this.item.repTypeCd == "02"){
						repUrl = this.item.svnRepUrl;
					}
					//gitlab
					else if(this.item.repTypeCd == "03"){
						repUrl = this.item.gitRepUrl;
					}
					return repUrl;
				}
			}
			 */
        ],
        body: {
    		align: "center",
			columnHeight: 30,
			onDBLClick:function(){
				var item = this.item;
				
            	//파일 내용 비교
         		var data = {
           			"repId": item.repId
           			, "repTypeCd": item.repTypeCd
           			, "revision": item.repRv
           			, "diffRevision": item.revision
           			, "path": item.repChgFilePath
           			, "fileName": item.repChgFileNm
            	};
         		gfnLayerPopupOpen('/rep/rep1000/rep1100/selectRep1101View.do',data,"1200","780",'scroll');
        	},
	        onDataChanged: function(){
				//해당 데이터 체크 시 선택 배열에 넣기
				if(this.item.__selected__){
					//이미 세팅된 데이터 없는 경우만 추가
					if(selRepData.indexOf(this.item.repId) == -1){
						selRepData.push(this.item.repId);
					}
				}else{
					var repIdx = selRepData.indexOf(this.item.repId);
	         			
					//제외
					if(repIdx != -1){
						selRepData.splice(repIdx, 1);
					}
				}
			}
		},
		contextMenu: {
             iconWidth: 20,
             acceleratorWidth: 100,
             itemClickAndClose: false,
             icons: {
                 'arrow': '<i class="fa fa-caret-right"></i>'
             },
             items: [
                 {type: "repConnCheck", label: "접속 확인", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                 {type: "repUpdate", label: "수정", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                 {type: "repDelete", label: "삭제", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
             ],
             popupFilter: function (item, param) {
             	var selItem = tktFileGridObj.list[param.doindex];
             	//선택 개체 없는 경우 중지
             	if(typeof selItem == "undefined"){
             		return false;
             	}
             	return true;
             },
             onClick: function (item, param) {
             	var selItem = tktFileGridObj.list[param.doindex];

             	//접속 확인
				if(item.type == "repConnCheck"){
					//접속확인 index 목록
					var idxList = [];
					
					//선택 저장소 추가
					idxList.push(selItem.__original_index);
					
					fnSelectRep1100ConfirmConnect(idxList);
					
			}
             	//수정
             	else if(item.type == "repUpdate"){
             		var empId = $("form#rep1100Form > #empId").val();
             		
             		var data = {"popupGb": "update", "repId": selItem.repId, "empId": empId};
					gfnLayerPopupOpen('/rep/rep1100/rep1100/selectRep1001RepositoryDetailView.do',data,"1060","640",'scroll');
             	}
             	//삭제
             	else if(item.type == "repDelete"){
             		jConfirm("저장소를 삭제 하시겠습니까?</br>배정된 구성항목이 있는 경우 연결 정보가 함께 삭제됩니다.","알림", function(result){
						if(result){
							var repIdListStr = "&repId="+selItem.repId;
							
							fnDeleteRep1100Info(repIdListStr);
						}
					});
             	}
             	
				//닫기
				tktFileGridObj.contextMenu.close();
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
				fnInGridListSet(this.page.selectPage,tktFileSearchObj.getParam());
             }
         } 
		});
	//그리드 데이터 불러오기
	fnInGridListSet();
}

//그리드 데이터 넣는 함수
function fnInGridListSet(_pageNo,ajaxParam){
	/* 그리드 데이터 가져오기 */
   	//파라미터 세팅
   	if(gfnIsNull(ajaxParam)){
		ajaxParam = $('form#rep1100Form').serialize();
	}
   	
   	//페이지 세팅
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof tktFileGridObj.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+tktFileGridObj.page.currentPage;
   	}
    	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1100/selectRep1100TktRvFileChgListAjax.do'/>","loadingShow":true}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var list = data.list;
		var page = data.page;
		
	   	tktFileGridObj.setData({
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
/**
 * Repository 삭제
 */
function fnDeleteRep1100Info(repIds){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1100/rep1100/deleteRep1100InfoAjax.do'/>"}
			,repIds);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		jAlert(data.message, "알림창");
		
		//삭제된 데이터 1건 이상인경우
		if(data.errorYn == "N"){
			axdom("#" + tktFileSearchObj.getItemId("btn_search_rep")).click();
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
} 
//검색 상자
function fnSearchBoxControl(){
	var pageID = "AXSearch";
	tktFileSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			tktFileSearchObj.setConfig({
				targetID:"tktFileSearchTarget",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"50", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[

                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'repNm', optionText:'저장소 명'},
                                {optionValue:'repTxt', optionText:'저장소 설명'},
                                {optionValue:'useCd', optionText:'사용 여부' , optionCommonCode:"CMM00001" }                                
                                
                            ],onChange: function(selectedObject, value){
                            	//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + tktFileSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + tktFileSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + tktFileSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								//공통코드 처리 후 select box 세팅이 필요한 경우 사용
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(tktFileSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
									axdom("#" + tktFileSearchObj.getItemId("searchTxt")).show();
									axdom("#" + tktFileSearchObj.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"225", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + tktFileSearchObj.getItemId("btn_search_rep")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(tktFileGridObj.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								tktFileGridObj.exportExcel("저장소 목록.xls");
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_rep",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
	 							var pars = tktFileSearchObj.getParam();
							    var ajaxParam = $('form#rep1100Form').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnInGridListSet(0,ajaxParam);
					            
					            //폼 데이터 변경
								$('#searchSelect').val(axdom("#" + tktFileSearchObj.getItemId("searchSelect")).val());
								$('#searchCd').val(axdom("#" + tktFileSearchObj.getItemId("searchCd")).val());
								$('#searchTxt').val(axdom("#" + tktFileSearchObj.getItemId("searchTxt")).val());
						}}
					]}
				]
			});
		}
		/*,
		search1: function(){
			var pars = tktFileSearchObj.getParam();
			fnAxGridView(pars);
		}
		*/
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
		axdom("#" + tktFileSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		//공통코드 selectBox hide 처리
		axdom("#" + tktFileSearchObj.getItemId("searchCd")).hide();
	});
}

/**
 * 선택 소스저장소 연결 체크
 */
function fnSelectRep1100ConfirmConnect(indexList){
	if(gfnIsNull(indexList) || indexList.length == 0){
		return false;
	}
	
	//첫번째 index 빼기
	var targetIdx = indexList[0];
	
	//index 제거
	indexList.splice(0, 1);
	
	//소스저장소 정보
	var repGridListData = tktFileGridObj.getList()[targetIdx];
	
	//ajax동작전 progress 주입
	tktFileGridObj.setValue(targetIdx, "result", "progress");
	tktFileGridObj.setValue(targetIdx, "resultMsg", "확인중");
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1100/rep1100/selectRep1100ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repGridListData.repId , "gitRepUrlCheckCd": "Y"});
	
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		if(data.MSG_CD =="REP_OK"){
			tktFileGridObj.setValue(targetIdx, "result", "success");
			tktFileGridObj.setValue(targetIdx, "resultMsg", "접속성공");
			
		}else if(data.MSG_CD =="SVN_EXCEPTION"){
			tktFileGridObj.setValue(targetIdx, "result", "exception");
			tktFileGridObj.setValue(targetIdx, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){
			tktFileGridObj.setValue(targetIdx, "result", "authException");
			tktFileGridObj.setValue(targetIdx, "resultMsg", "사용자 권한없음");
		}else{
			tktFileGridObj.setValue(targetIdx, "result", "fail");
			tktFileGridObj.setValue(targetIdx, "resultMsg", "기타 오류");
		}
		if(data.saveYN == "N"){
			jAlert(data.message,"경고");
		}
		
		fnSelectRep1100ConfirmConnect(indexList);
	});
	
	//AJAX 전송
	ajaxObj.send();
} 


//저장소 전체 접속 확인
function fnSelectRep1100AllConfirmConnect(repId, index){
	// 재귀 멈춤 조건
	//index -1인경우 return
	if(index == -1){
		return false;
	}
	
	tktFileGridObj.setValue(index, "result", "progress");
	
	//소스저장소 정보
	var repGridListData = tktFileGridObj.getList()[index];
	
	//AJAX 설정
	var repConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1100/rep1100/selectRep1100ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repId });
	//AJAX 전송 성공 함수
	repConnAjaxObj.setFnSuccess(function(data){
		
		
		//return 값 확인
		if(data.MSG_CD =="REP_OK"){	//접속 성공
			tktFileGridObj.setValue(index, "result", "success");
			tktFileGridObj.setValue(index, "resultMsg", "접속성공");
		}else if(data.MSG_CD =="SVN_EXCEPTION"){ //URL 및 입력 값 오류
			tktFileGridObj.setValue(index, "result", "exception");
			tktFileGridObj.setValue(index, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){ //권한 오류
			tktFileGridObj.setValue(index, "result", "authException");
			tktFileGridObj.setValue(index, "resultMsg", "사용자 권한없음");
		}else{ //그 외 오류
			tktFileGridObj.setValue(index, "result", "fail");
			tktFileGridObj.setValue(index, "resultMsg", "기타 오류");
		} 	
		
		//index가 현재 grid갯수보다 크면 return
		if((++index) >= tktFileGridObj.getList().length){
			return false;
		}
		
		//job 정보
		var repGridListData = tktFileGridObj.getList()[index];
		var repId = repGridListData.repId;
		
		//실패해도 다음 job 체크
		fnSelectRep1100AllConfirmConnect(repId, index);
		
	});
	
	//AJAX 전송 오류 함수
	repConnAjaxObj.setFnError(function(xhr, status, err){
		
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	repConnAjaxObj.send();
}
//가이드 상자
function fnRep1100GuideShow(){
	var mainObj = $(".main_contents");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["rep1100"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}
</script>


<div class="main_contents" style="height: auto;" >
	<form name="rep1100Form" id="rep1100Form">
		<input type="hidden" name="repId" id="repId" value="${requestScope.repId }"/>
		<input type="hidden" name="ciId" id="ciId" value="${requestScope.ciId }"/>
		<input type="hidden" name="apiId" id="apiId" value="${requestScope.apiId }"/>
		<input type="hidden" name="svcId" id="svcId" value="${requestScope.svcId }"/>
		<input type="hidden" name="fId" id="fId" value="${requestScope.fId }"/>
		<input type="hidden" name="ticketId" id="ticketId" value="CH2211-00009"/>
		<input type="hidden" name="empId" id="empId" value="${requestScope.empId }"/>
		<input type="hidden" name="eGeneUrl" id="eGeneUrl" value="${requestScope.eGeneUrl }"/>
		<input type="hidden" name="callbakApiId" id="callbakApiId" value="${requestScope.callbakApiId }"/>
	</form>
	<div class="tab_contents menu">
		<div class="sub_title">
			소스저장소 관리
		</div>
		<div id="tktFileSearchTarget" guide="rep1100button" ></div>
		<div data-ax5grid="tktFileGridTarget" data-ax5grid-config="{}" style="height: 600px;"></div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDataSendBtn"><i class="fas fa-paperclip"></i>&nbsp;Commit</div>
			<div class="mainPopupBtn" id="repCloseBtn"><i class="fas fa-times-circle"></i>&nbsp;닫기</div>
		</div>
			
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />