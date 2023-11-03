<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>
<link rel='stylesheet' href='<c:url value='/css/lunaops/whk.css'/>' type='text/css'>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style>
	.layer_popup_box .popup{overflow:hidden !important;}
</style>
<script>
	//grid object
	var webhookGrid;
	//상단 리비전 검색
	var whkSearchObj;
	
	var webhookTypeCd;
	//스크립트 초기화
	$(document).ready(function(){
		webhookTypeCd = $("form#whk1000PopupFrm #webhookTypeCd").val();
		
		/* //소스저장소 명
		$("form#whk1000PopupFrm > #repNm").val(repNm);
		//소스저장소 타입
		repTypeCd = $("form#whk1000PopupFrm > #repTypeCd").val();
		
		//가이드 상자 호출
		gfnGuideStack("add",fnWhk1000GuideShow);
		
		*/

		//웹훅 그리드 세팅
		fnWebhookGridSetting();
		
		//상단 검색 영역
		fnWhkPopupSearchControl();
		
		//닫기 버튼
		$("#repDetailCloseBtn").click(function(){
			window.close();
		});
	});

	/**
	 * 웹훅 삭제
	 */
	function fnDeleteWhk1000WebhookList(whkIdList){
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/whk/whk1000/whk1000/deleteWhk1000WebhookListAjax.do'/>"}
				,whkIdList);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			jAlert(data.message, "알림창");
			fnInWebhookGridDataSet(0, $('form#whk1000PopupFrm').serialize()+"&"+whkSearchObj.getParam());
		});
		
		//AJAX 전송
		ajaxObj.send();
	} 
	
	//webhook grid
	function fnWebhookGridSetting(){
		webhookGrid = new ax5.ui.grid();
	 
		webhookGrid.setConfig({
			target: $('[data-ax5grid="webhookGrid"]'),
			showRowSelector: true,
			sortable:false,
			header: {align:"center",columnHeight: 30},
			columns: [
				{key: "webhookTypeNm", label: "웹훅 타입", width: 120, align: "center"},
				{key: "webhookNm", label: "웹훅명", width: 180, align: "center"},
				{key: "webhookTargetUrl", label: "웹훅 URL", width: 331, align: "center"},
				{key: "contentTypeNm", label: "콘텐츠 타입", width: 180, align: "center"},
				{key: "webhookChgTypeNm", label: "웹훅 전송 조건", width: 180, align: "center"},
				{key: "regDtm", label: "등록 일시", width: 140, align: "center"
					,formatter:function(){
						return new Date(this.item.regDtm).format("yyyy-MM-dd HH:mm:ss");
					}
				},
				{key: "modifyDtm", label: "수정 일시", width: 140, align: "center"
					,formatter:function(){
						return new Date(this.item.modifyDtm).format("yyyy-MM-dd HH:mm:ss");
					}
				},
				{key: "useNm", label: "사용유무", width: 85, align: "center"}
			],
			body: {
				align: "center",
				columnHeight: 30,
				onClick:function() {
					// 클릭 이벤트
	   				this.self.select(this.doindex, {selected: !this.item.__selected__});	
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
					fnInWebhookGridDataSet(this.page.selectPage, $('form#whk1000PopupFrm').serialize()+"&"+whkSearchObj.getParam());
				}
			} 
		});
		//그리드 데이터 불러오기
		fnInWebhookGridDataSet();
	}

	//그리드 데이터 넣는 함수
	function fnInWebhookGridDataSet(_pageNo,ajaxParam){
	   	/* 그리드 데이터 가져오기 */
	   	//파라미터 세팅
	   	if(gfnIsNull(ajaxParam)){
	 		ajaxParam = $('form#whk1000PopupFrm').serialize();
		}
	   	
	   	//페이지 세팅
	   	if(!gfnIsNull(_pageNo)){
	   		ajaxParam += "&pageNo="+_pageNo;
	   	}else if(typeof webhookGrid.page.currentPage != "undefined"){
	   		ajaxParam += "&pageNo="+webhookGrid.page.currentPage;
	   	}
	   	
	   	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/whk/whk1000/whk1000/selectWhk1000WebhookListAjax.do'/>","loadingShow":true}
				,ajaxParam);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			var list = data.list;
			var page = data.page;
			
		   	webhookGrid.setData({
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
	
	//검색 상자
	function fnWhkPopupSearchControl(){
		var pageID = "whkSearchTarget";
		whkSearchObj = new AXSearch();
		
		var fnObjSearch = {
			pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			whkSearchObj.setConfig({
				targetID:"whkSearchTarget",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"50", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[
                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'webhookNm', optionText:'웹훅명'},
                                {optionValue:'webhookTargetUrl', optionText:'웹훅 대상 URL'},
                                {optionValue:'webhookTypeCd', optionText:'웹훅 타입' , optionCommonCode:"WHK00001" },
                                {optionValue:'contentTypeCd', optionText:'전송 콘텐츠 타입' , optionCommonCode:"WHK00002" }
                                
                            ],onChange: function(selectedObject, value){
                            	//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + whkSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + whkSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + whkSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								//공통코드 처리 후 select box 세팅이 필요한 경우 사용
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(whkSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
									axdom("#" + whkSearchObj.getItemId("searchTxt")).show();
									axdom("#" + whkSearchObj.getItemId("searchCd")).hide();
								}
    						},
						},
						{label:"", labelWidth:"", type:"inputText", width:"200", key:"searchTxt", addClass:"secondItem sendBtn searchTxt", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + whkSearchObj.getItemId("btn_search_svn")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"200", key:"searchCd", addClass:"selectBox searchCd", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label : "",labelWidth : "",type : "button",width : "55",key : "btn_delete_jenkins",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-trash-alt' aria-hidden='true'></i>&nbsp;<span>삭제</span>",
							onclick : function() {
								var chkList = webhookGrid.getList('selected');
								
								if (gfnIsNull(chkList)) {
									jAlert("선택한 데이터가 없습니다.", "알림창");
									return false;
								}
								
								jConfirm("웹훅 "+chkList.length+"개를 삭제하시겠습니까?", "알림창", function( result ) {
									if( result ){
										//파라미터 세팅
										var whkIdListStr = "";
										
										
										$.each(chkList, function(idx, map){
											whkIdListStr += "&webhookId="+map.webhookId;
										});
										
										fnDeleteWhk1000WebhookList(whkIdListStr);
									}
								});
							}
						},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-edit' aria-hidden='true'></i>&nbsp;<span>수정</span>",
							onclick:function(){
								var item = webhookGrid.getList('selected')[0];
								if(gfnIsNull(item)){
									toast.push('수정 할 데이터를 선택하세요.');
									return;
								}
								//등록,수정자 ID
								var empId = $("form#whk1000PopupFrm > #empId").val();
								
								var data = {
									"popupGb": "update"
									, "paramWebhookTypeCd": webhookTypeCd
									, "webhookId": item.webhookId
									, "empId": empId
								};
        	                	
								gfnLayerPopupOpen('/whk/whk1000/whk1000/selectWhk1001View.do',data,"650","630",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_insert_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-save' aria-hidden='true'></i>&nbsp;<span>등록</span>",
							onclick:function(){
								//등록,수정자 ID
								var empId = $("form#whk1000PopupFrm > #empId").val();
								
								var data = {
									"popupGb": "insert"
									, "paramWebhookTypeCd": webhookTypeCd
									, "empId": empId
								};
								gfnLayerPopupOpen('/whk/whk1000/whk1000/selectWhk1001View.do',data,"650","630",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
	 							var pars = whkSearchObj.getParam();
							    var ajaxParam = $('form#whk1000PopupFrm').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnInWebhookGridDataSet(0,ajaxParam);
					            
					            //폼 데이터 변경
								$('#searchSelect').val(axdom("#" + whkSearchObj.getItemId("searchSelect")).val());
								$('#searchTxt').val(axdom("#" + whkSearchObj.getItemId("searchTxt")).val());
						}}
					]}
				]
			});
			}
		};
		
		jQuery(document.body).ready(function(){
			
			fnObjSearch.pageStart();
			//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
			axdom("#" + whkSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
			
			//공통코드 selectBox hide 처리
			axdom("#" + whkSearchObj.getItemId("searchCd")).hide();
		});
	}
	
	function fnWhk1000GuideShow(){
		var mainObj = $(".main_contents");
		
		//mainObj가 없는경우 false return
		if(mainObj.length == 0){
			return false;
		}
		//guide box setting
		var guideBoxInfo = globals_guideContents["whk1000"];
		gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
	}
</script>

<div class="main_contents" style="height: auto;" >
	<div class="tab_contents menu" style="width:1000px;">
		<form id="whk1000PopupFrm" name="whk1000PopupFrm" method="post">
			<input type="hidden" name="webhookTypeCd" id="webhookTypeCd" value="${requestScope.webhookTypeCd }"/>
			<input type="hidden" name="empId" id="empId" value="${requestScope.empId }"/>
		</form>
		<div class="whk1000Frame">
			<div class="sub_title">웹훅 관리</div>
			<div class="whk1000SearchFrame whk1000FrameBox" id="whkSearchTarget" guide="whk1000Btn"></div>
			<div data-ax5grid="webhookGrid" data-ax5grid-config="{}" style="height: 520px;" guide="whk1000WebhookList"></div>	
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDetailCloseBtn">닫기</div>
		</div>
	</div>
</div>
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />