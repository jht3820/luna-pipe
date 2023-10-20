<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style type="text/css">
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
	gfnGuideStack("add",fnRep1102GuideShow);
	
	//전송 버튼
	$("#repDataCommitBtn").click(function(){
		
		var rtnValue = [];
		
		//선택한 저장소
		var selTktFileList = tktFileGridObj.getList('selected');
		
		if (gfnIsNull(selTktFileList)) {
			jAlert("커밋 대상 파일을 선택해주세요.", "알림창");
			return false;
		}
		jConfirm("선택된 파일 "+selTktFileList.length+"개를 커밋하시겠습니까?","알림창", function(result){
			if(result){
				//필요 값
				var ticketId = $("form#rep1102Form > #ticketId").val();
				var empId = $("form#rep1102Form > #empId").val();
				
				//저장소 param
				var returnMap = [];
				
				//데이터 세팅
				$.each(selTktFileList, function(idx, map){
					//디렉토리인경우 path 모으기
					
					var tktFileInfo = {
						"repId": map.repId
						, "repRv": map.repRv
						, "repChgId": map.repChgId
						, "repChgFilePath": map.repChgFilePath
						, "repChgFileNm": map.repChgFileNm
						, "ticketId": map.ticketId
						, "repChgTypeCd": map.repChgTypeCd
						, "repChgFileKind": map.repChgFileKind
						, "empId": empId
					};
					
					returnMap.push(tktFileInfo);
				});
				
				//data값 전달 후 해당 파일 커밋
				var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/rep/rep1000/rep1100/insertRep1102SelTktFileCommitAjax.do'/>","loadingShow":true}
					,{
						//컨트롤러 전달 데이터
						returnMap: JSON.stringify(returnMap),
					}
				);
				
				//AJAX 전송 성공 함수
				ajaxObj.setFnSuccess(function(data){
					//결과 값
					var errorYn = data.errorYn;
					
					//오류 메시지
					var errorMsgList = data.errorMsgList;
					
					//오류 메시지 있는 경우 추가 메시지 담기
					var addMsg = "";
					if(!gfnIsNull(errorMsgList) && errorMsgList.length > 0){
						addMsg += "</br>[예외처리 내역]</br>"+errorMsgList.join("</br>");
					}
					
					//결과 처리 성공
					if(errorYn == "N"){
						jAlert(data.message+"</br>성공 개수: "+data.succCnt+addMsg, "알림창");
						
						//목록 재 조회
						axdom("#" + tktFileSearchObj.getItemId("btn_search_rep")).click();
					}else{
						jAlert(data.message+addMsg, "알림창");
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
			{key: "repChgTypeNm", label: "파일 변경 타입", width: 95, align: "center"} ,
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
			onClick: function () {
        		// 클릭 이벤트
   				tktFileGridObj.select(this.doindex, {selected: !this.item.__selected__});
             },
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
                 {type: "trunkDiff", label: "trunk 소스 비교", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
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
				if(item.type == "trunkDiff"){
					var item = selItem;
					
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
		ajaxParam = $('form#rep1102Form').serialize();
	}
   	
   	//페이지 세팅
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof tktFileGridObj.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+tktFileGridObj.page.currentPage;
   	}
    	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1100/selectRep1102TktRvFileChgListAjax.do'/>","loadingShow":true}
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
                                {optionValue:'repRv', optionText:'리비전'},
                                {optionValue:'repChgFileNm', optionText:'변경 파일명'},
                                {optionValue:'repChgFilePath', optionText:'변경 파일 경로'},
                                {optionValue:'repCmtAuthor', optionText:'커밋 대상자'},
                                {optionValue:'repChgTypeCd', optionText:'파일 변경 타입' , optionCommonCode:"REP00004" }                                
                                
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
							    var ajaxParam = $('form#rep1102Form').serialize();

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

//가이드 상자
function fnRep1102GuideShow(){
	var mainObj = $(".main_contents");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["rep1102"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}
</script>


<div class="main_contents" style="height: auto;" >
	<form name="rep1102Form" id="rep1102Form">
		<input type="hidden" name="ticketId" id="ticketId" value="${requestScope.ticketId }"/>
		<input type="hidden" name="empId" id="empId" value="${requestScope.empId }"/>
	</form>
	<div class="tab_contents menu">
		<div class="rep1102MainTopFrame">
			<div class="sub_title">
				티켓 소스저장소별 Trunk 변경 파일 목록
			</div>
			<div id="tktFileSearchTarget" guide="rep1102button" ></div>
			<div data-ax5grid="tktChgDataGridTarget" data-ax5grid-config="{}" style="height: 400px;"></div>
		</div>
		<div class="rep1102MainMiddleFrame">
			<div class="rep1102MiddleLeftFrame">
				<div class="sub_title">
					운영빌드 목록
				</div>
				<div data-ax5grid="buildDataGridTarget" data-ax5grid-config="{}" style="height: 400px;"></div>
			</div>
			<div class="rep1102MiddleRightFrame">
				<div class="sub_title">
					Source-Deploy 비교 결과 변경 파일
				</div>
				<div data-ax5grid="rsyncDataGridTarget" data-ax5grid-config="{}" style="height: 400px;"></div>
			</div>
		</div>
		<div class="rep1102MainBottomFrame">
			<div class="sub_title">
				선택 변경 파일
			</div>
			<div id="tktFileSearchTarget" guide="rep1102button" ></div>
			<div data-ax5grid="selCommitDataGridTarget" data-ax5grid-config="{}" style="height: 400px;"></div>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDataCommitBtn"><i class="fas fa-paperclip"></i>&nbsp;Commit</div>
			<div class="mainPopupBtn" id="repCloseBtn"><i class="fas fa-times-circle"></i>&nbsp;닫기</div>
		</div>
			
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />