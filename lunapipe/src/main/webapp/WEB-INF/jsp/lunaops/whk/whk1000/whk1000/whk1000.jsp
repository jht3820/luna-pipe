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
	//상단 리비전 검색
	var whkSearchObj;
	
	//스크립트 초기화
	$(document).ready(function(){
		/* //소스저장소 명
		$("form#whk1000PopupFrm > #repNm").val(repNm);
		//소스저장소 타입
		repTypeCd = $("form#whk1000PopupFrm > #repTypeCd").val();
		
		//가이드 상자 호출
		gfnGuideStack("add",fnWhk1000GuideShow);
		
		*/

		//상단 검색 영역
		fnWhkPopupSearchControl();
		
		//닫기 버튼
		$("#repDetailCloseBtn").click(function(){
			window.close();
		});
	});
	
	
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
                                {optionValue:'author', optionText:'작성자'},
                                {optionValue:'comment', optionText:'작성 내용'},
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
								}
    						},
						},
						{label:"", labelWidth:"", type:"inputText", width:"120", key:"searchTxt", addClass:"secondItem sendBtn searchTxt", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + whkSearchObj.getItemId("btn_search_svn")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox searchCd", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"<i class='fas fa-list-ol'></i>&nbsp;목록 수&nbsp;", labelWidth:"75", type:"selectBox", width:"", key:"pageSize", addClass:"secondItem", valueBoxStyle:"", value:"30",
							options:[
							         	{optionValue:15, optionText:"15"},
		                                {optionValue:30, optionText:"30"},
		                                {optionValue:50, optionText:"50"},
		                                {optionValue:100, optionText:"100"},
		                                {optionValue:300, optionText:"300"},
		                                {optionValue:600, optionText:"600"},
		                                {optionValue:1000, optionText:"1000"},
		                                {optionValue:5000, optionText:"5000"},
		                                {optionValue:10000, optionText:"10000"},
		                                
		                            ],onChange: function(selectedObject, value){
		                            	/* 검색 조건 설정 후 reload */
			 							var pars = whkSearchObj.getParam();
									    var ajaxParam = $('form#whk1000PopupFrm').serialize();

									    if(!gfnIsNull(pars)){
									    	ajaxParam += "&"+pars;
									    }
										
							            fnRepPopupGridListSet(0,ajaxParam);
		    						}
						},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
	 							var pars = whkSearchObj.getParam();
							    var ajaxParam = $('form#whk1000PopupFrm').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnRepPopupGridListSet(0,ajaxParam);
					            
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
			
			//공통코드 selectBox, date hide 처리
			$(".searchCd").hide();
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
		</form>
		<div class="whk1000Frame">
			<div class="sub_title">웹훅 관리</div>
			<div class="whk1000SearchFrame whk1000FrameBox" id="whkSearchTarget" guide="whk1000Btn"></div>
			<div class="whk1000DataFrame whk1000FrameBox">
				<div class="whkMainFrame">
					<div class="whkHeaderFrame">
						<div class="whkHeaderLeftFrame">
							[<span>소스저장소</span>] <span>웹훅명<span>
						</div>
						<div class="whkHeaderRightFrame">
							<span class="AXButton"><i class="fa fa-edit"></i>&nbsp;편집</span>
							<span class="AXButton"><i class="fa fa-times"></i>&nbsp;삭제</span>
						</div>
					</div>
					<div class="whkBodyFrame">
						<div class="whkContentFrame">
							<span>웹훅 URL</span>
							<span>웹훅 추가/변경 일시</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDetailCloseBtn">닫기</div>
		</div>
	</div>
</div>
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />