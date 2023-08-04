<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>
<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style>
	.groupClear {height: 0;}
	.layer_popup_box .popup{overflow:hidden !important;}
</style>
<script>
	
	var svnSearchObj;
	
	
	var repPopupGrid;
	
	var repTypeCd = "";
	
	
	var zTree, revisionFileList;
	
	
	var lastRevision;
	
	
	var revisionFilePahtListCnt = 30;
	
	
	var selRevision;
	
	var selCommitId;
	
	
	var globals_repInfo;

	
	$(document).ready(function(){
		
		gfnGuideStack("add",fnRep1002GuideShow);
		
		
		svnConnCheck();
		
		
		$("#repDetailCloseBtn").click(function(){
			window.close();
		});
	});

	
	
	function svnConnCheck(){
		var repId = $("#repId").val();
		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do'/>","loadingShow": false, "async": false}
				,{ "repId" : repId, "gitRepUrlCheckCd": "Y" });
		
		
		ajaxObj.setFnSuccess(function(data){
			
			if(data.MSG_CD =="REP_OK"){
				
				lastRevision = data.lastRevisionNum;
				
				
				var globals_repInfo = data.repInfo;
				
				
				repTypeCd = globals_repInfo.repTypeCd;
				
				
				
				fnRepPopupGridView();
				
				
				fnRepPopupSearchControl();
				
				
				$("#repNm").text(globals_repInfo.repNm);
			}else{
				
				gfnLayerPopupClose();
				jAlert("소스저장소 연결에 실패했습니다.", "알림창");
			} 	
		});
		
		
		ajaxObj.send();
	}
	
	
	function fnRepPopupGridView(){
		
		var columns = [];
		
		if(repTypeCd == "01"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 900, align: "left"}
	         ];
		}
		
		else if(repTypeCd == "02"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "pathCnt", label: "Changes", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 900, align: "left"}
	         ];
		}
		
		else if(repTypeCd == "03"){
			columns = [
				{key: "commitId", label: "Commit ID", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 900, align: "left"}
	         ];
		}
		
		repPopupGrid = new ax5.ui.grid();
	 
		repPopupGrid.setConfig({
			target: $('[data-ax5grid="rep-grid"]'),
			sortable:false,
			header: {align:"center",columnHeight: 30},
			frozenColumnIndex: 4,
			columns: columns,
	         body: {
				align: "center",
				columnHeight: 30,
	            onClick:function(){
	            	
					$("#svnCommitLogDetail").val(this.item.comment);
	            	
	            	
					fnSearchFileDirTree(this.item.revision, this.item.commitId);
	            	
	            	
	            	fnFileGridView();
	            	
	            	
	            	selRevision = this.item.revision;
	            	selCommitId = this.item.commitId;
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
					
					var pars = svnSearchObj.getParam();
					var ajaxParam = $('form#rep1002PopupFrm').serialize();

					if(!gfnIsNull(pars)){
						ajaxParam += "&"+pars;
					}
					fnRepPopupGridListSet(this.page.selectPage, ajaxParam);
				}
	        } 
		});
	}
	
	
	function fnRepPopupGridListSet(_pageNo,ajaxParam){
		
		$("#revisionFileList").html("리비전을 선택해주세요.");
		$("#revisionFileList").show();
		$("#rep1002FileTree").html('');
		
		
		$("#repGridList").show();
		fnFileGridView();
		
		
	   	
	   	if(gfnIsNull(ajaxParam)){
	 			ajaxParam = $('form#rep1002PopupFrm').serialize();
	 		}
	   	
	   	
	   	if(!gfnIsNull(_pageNo)){
	   		ajaxParam += "&pageNo="+_pageNo;
	   	}else if(typeof repPopupGrid.page.currentPage != "undefined"){
	   		ajaxParam += "&pageNo="+repPopupGrid.page.currentPage;
	   	}
	
	   	
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002RepositoryPageListAjaxView.do'/>","loadingShow": false}
				,ajaxParam);
		
		ajaxObj.setFnSuccess(function(data){
			

			
			axdom("#" + svnSearchObj.getItemId("startRevisionVal")).val(data.startRevision);
			axdom("#" + svnSearchObj.getItemId("endRevisionVal")).val(data.lastRevision);
			
			var list = data.list;
			var page = data.page;
			
		   	repPopupGrid.setData({
             	list:list,
             	page: {
					currentPage: _pageNo || 0,
					pageSize: page.pageSize,
					totalElements: page.totalElements,
					totalPages: page.totalPages
	    		}
		    });
		   	
		  	
			$("#repGridList").hide();
		  
		   	
		   	$("#svnCommitLogDetail").val("");
		});
		
		
		ajaxObj.send();
	}
	
	
	function fnRepPopupSearchControl(){
		var pageID = "repSearchTarget";
		svnSearchObj = new AXSearch();
		
		
		var defaultStDt = new Date(new Date().setMonth(new Date().getMonth()-1)).format('yyyy-MM-dd');
		var defaultEdDt = new Date().format('yyyy-MM-dd');
		
		var searchItem1 = {}; 
		var searchItem2 = {}; 
		if(repTypeCd != '03'){
			searchItem1 = {label:"리비전 범위", labelWidth:"", type:"inputText", width:"60", key:"startRevisionVal", addClass:"secondItem sendBtn", value:"",};
			searchItem2 = {label:"~", labelWidth:"20", type:"inputText", width:"60", key:"endRevisionVal", addClass:"secondItem sendBtn labelBorderNone", valueBoxStyle:"", value:"",};
			
		}
		
		var fnObjSearch = {
			pageStart: function(){
				
				svnSearchObj.setConfig({
					targetID:"repSearchTarget",
					theme : "AXSearch",
					rows:[
						{display:true, addClass:"", style:"", list:[
							{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"50", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
								options:[

	                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
	                                {optionValue:'author', optionText:'작성자'},
	                                {optionValue:'comment', optionText:'작성 내용'},
	                                {optionValue:'logDate', optionText:'작성 일자',optionType:"date"},
	                                
	                            ],onChange: function(selectedObject, value){
	                            	
	    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
										axdom("#" + svnSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
										axdom("#" + svnSearchObj.getItemId("searchTxt")).val('');	
									}else{
										axdom("#" + svnSearchObj.getItemId("searchTxt")).removeAttr("readonly");
									}
									
									
									if(!gfnIsNull(selectedObject.optionCommonCode)){
										gfnCommonSetting(svnSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
									}
									
									else if(!gfnIsNull(selectedObject.optionType) && selectedObject.optionType == "date"){
										axdom("#" + svnSearchObj.getItemId("searchTxt")).val('date');	
										axdom("#" + svnSearchObj.getItemId("searchStDate")).val(defaultStDt);	
										axdom("#" + svnSearchObj.getItemId("searchEdDate")).val(defaultEdDt);	
										$(".searchTxt").hide();
										$(".searchCd").hide();
										$(".searchStDate").show();
										$(".searchEdDate").show();
									}else{
										
										axdom("#" + svnSearchObj.getItemId("searchTxt")).val('');	
										$(".searchTxt").show();
										$(".searchCd").hide();
										$(".searchStDate").hide();
										$(".searchEdDate").hide();
									}
	    						},
							},
							{label:"", labelWidth:"", type:"inputText", width:"120", key:"searchTxt", addClass:"secondItem sendBtn searchTxt", valueBoxStyle:"padding-left:0px;", value:"",
								onkeyup:function(e){
									if(e.keyCode == '13' ){
										axdom("#" + svnSearchObj.getItemId("btn_search_svn")).click();
									}
								} 
							},
							{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox searchCd", valueBoxStyle:"padding-left:0px;", value:"01",
								options:[]
							},
							{label:"", labelWidth:"0", type:"inputText", width:"120", key:"searchStDate", addClass:"secondItem sendBtn searchStDate", value: defaultStDt,},
							{label:"~", labelWidth:"20", type:"inputText", width:"120", key:"searchEdDate", addClass:"secondItem sendBtn labelBorderNone searchEdDate", valueBoxStyle:"", value: defaultEdDt,},
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
			                            	
				 							var pars = svnSearchObj.getParam();
										    var ajaxParam = $('form#rep1002PopupFrm').serialize();

										    if(!gfnIsNull(pars)){
										    	ajaxParam += "&"+pars;
										    }
											
								            fnRepPopupGridListSet(0,ajaxParam);
			    						}
							},
							searchItem1,
							searchItem2,
							{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
								onclick:function(){
									$(repPopupGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
							}},
							
							{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
								onclick:function(){
									repPopupGrid.exportExcel("<c:out value='${sessionScope.selMenuNm }'/>.xls");
							}},
							{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
								onclick:function(){
									
		 							var pars = svnSearchObj.getParam();
								    var ajaxParam = $('form#rep1002PopupFrm').serialize();

								    if(!gfnIsNull(pars)){
								    	ajaxParam += "&"+pars;
								    }
									
						            fnRepPopupGridListSet(0,ajaxParam);
						            
						            
						            
									$('#searchSelect').val(axdom("#" + svnSearchObj.getItemId("searchSelect")).val());
									$('#searchTxt').val(axdom("#" + svnSearchObj.getItemId("searchTxt")).val());
							}}
						]}
					]
				});
			}
		};
		
		jQuery(document.body).ready(function(){
			
			fnObjSearch.pageStart();
			
			axdom("#" + svnSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
			
			
			$(".searchCd").hide();
			$(".searchStDate").hide();
			$(".searchEdDate").hide();
			
			
			gfnCalRangeSet(svnSearchObj.getItemId("searchStDate"), svnSearchObj.getItemId("searchEdDate"));

			
			axdom("#" + svnSearchObj.getItemId("startRevisionVal")).val((lastRevision-100));
			axdom("#" + svnSearchObj.getItemId("endRevisionVal")).val(lastRevision);

			
			fnRepPopupGridListSet();
		});
	}
	

	function fnSearchFileDirTree(revisionIndex, commitId){
		var data = {"revision" : revisionIndex, "commitId" : commitId , "repId" : $('#repId').val()};
		
		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002FileDirAjaxList.do'/>","loadingShow": false}
				,data);
		
		
		ajaxObj.setFnSuccess(function(data){
			
	    
			
			if(data.errorYn == "Y"){
				$("#revisionFileList").html(data.consoleText);
				$("#revisionFileList").show();
			}else{
		    	toast.push(data.message);
		    	
		    	
			    var setting = {
			        data: {
			        	key: {
							name: "name"
						},
			            simpleData: {
			                enable: true,
			                idKey: "currentKey",
							pIdKey: "parentKey",
							rootPId: "Root"
			            }
			        },
					callback: {
						onClick: function(event, treeId, treeNode){
							
							getRepRevisionFileList(treeNode, revisionFileList);
						}
					},
					view : {
						fontCss: function(treeId, treeNode){
							return {};
						},
						showIcon : function(treeId, treeNode) {
							if(typeof zTree != "undefined" && treeNode.level != 3 && !treeNode.isParent){
								treeNode.isParent = true;
								zTree.refresh();	
							}
							return true;
						}
					}
			    };
		    	
			    revisionFileList = data.revisionFileList;
			    var dirList = data.revisionDirList;
			    
			    zTree = $.fn.zTree.init($("#rep1002FileTree"), setting, dirList);
			    
			    if(dirList.length >0){
			    	
			    	$("#revisionFileList").hide();
			    	getRepRevisionFileList(null,revisionFileList);
			    	zTree.expandAll(true);
			    	zTree.refresh();
			    }else{
			    	
			    	$("#revisionFileList").show();
			    }
			}
		});
		
		
		ajaxObj.send();
	}
	
	
	function fnFileGridView(){
		filePathGrid = new ax5.ui.grid();
 
		filePathGrid.setConfig({
            target: $('[data-ax5grid="filePath-grid"]'),
            sortable:false,
            header: {align:"center",columnHeight: 30},
            frozenColumnIndex: 2,
            columns: [
				{key: "type", label: "type", width: 100, align: "left"},
				{key: "name", label: "name", width: 300, align: "left"},
				{key: "path", label: "path", width: 600, align: "left"}
				
            ],
            body: {
                align: "center",
                columnHeight: 30,
                onDBLClick:function(){
                	var data = {"revision" : selRevision, "commitId" : selCommitId ,"path": this.item.path, "name": this.item.name, "repId" : $("#repId").val()}; 
					gfnLayerPopupOpen("/rep/rep1000/rep1000/selectRep1003View.do", data, "1200", "780",'auto');
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
                    {type: "revisionFileList", label: "대상 파일 리비전 목록", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                ],
                popupFilter: function (item, param) {
                	var selItem = filePathGrid.list[param.doindex];
                	
                	if(typeof selItem == "undefined"){
                		return false;
                	}
                	return true;
                },
                onClick: function (item, param) {
                	var selItem = filePathGrid.list[param.doindex];

                    if(item.type == "revisionFileList"){
            			
            			var startRevision = (lastRevision-100);
            			if(startRevision < 0){
            				startRevision = 0;
            			}
            			
                    	
    					var data = {
                    			 "repId": $('#repId').val()
                    			, "revisionNum": selRevision
                    			, "commitId": selCommitId
                    			, "filePath": selItem.path
                    			, "startRevision": startRevision
                    			, "lastRevision": lastRevision
                    			, "selRevision": selRevision
                    			, "selCommitId": selCommitId
                    			, "fileName": selItem.name
                    			, "repTypeCd": repTypeCd
                    			};
    	 				gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1005View.do',data,"1100","680",'scroll');	
                    }
                    filePathGrid.contextMenu.close();
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
                	getRepRevisionFileList(zTree.getSelectedNodes()[0], revisionFileList, this.page.selectPage);
                }
            }
           
        });
	}
	
	
	function getRepRevisionFileList(node, dataList, _pageNo){
		var returnList = [];
		var tmpList = [];
		
		
		if(gfnIsNull(_pageNo)){
			_pageNo = 0;
		}
		
		
		var firstIndex = (_pageNo * revisionFilePahtListCnt);
		
		
		var lastIndex = (firstIndex + revisionFilePahtListCnt);
		
		
		if(node == null){
			tmpList = dataList;
		}else{	
			var selectKey = node.currentKey;
			$(dataList).each(function(index, item){
				
				if(item.currentKey.indexOf(selectKey)==0){
					tmpList.push(item);	
				}
			});
		}
		
		
		var totalFileCnt = tmpList.length;
		
		
		var totalPageCount = parseInt(((totalFileCnt - 1) / revisionFilePahtListCnt) + 1);
		
		
		for(var i=firstIndex;i<lastIndex;i++){
			returnList.push(tmpList[i]);
		}
		
		
		filePathGrid.setData({
         	list:returnList,
         	page: {
				currentPage: _pageNo || 0,
				pageSize: revisionFilePahtListCnt,
				totalElements: totalFileCnt,
				totalPages: totalPageCount
    		}
	    });
		
		return returnList;
	}
	
	function fnRep1002GuideShow(){
		var mainObj = $(".main_contents");
		
		
		if(mainObj.length == 0){
			return false;
		}
		
		var guideBoxInfo = globals_guideContents["rep1002"];
		gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
	}
</script>

<div class="main_contents" style="height: auto;" >
	<div class="tab_contents menu" style="width:1300px;">
		<form id="rep1002PopupFrm" name="rep1002PopupFrm" method="post">
			<input type="hidden" name="repId" id="repId" value="${param.repId}" />
		</form>
		<div class="sub_title">
			소스저장소 상세정보 [ 선택 저장소: <span id="repNm"></span> ]
		</div>
		<div class="rep1002SearchFrame rep1002FrameBox" id="repSearchTarget" guide="rep1002RepBtn"></div>
		<div class="rep1002RevisionFrame rep1002FrameBox">
			<div class="svn_mask_repList" id="repGridList">
				데이터를 조회중입니다.</br></br>
				<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">
			</div>
			<div data-ax5grid="rep-grid" data-ax5grid-config="{}" style="height: 250px;" guide="rep1002RepList"></div>	
		</div>
		<div class="rep1002CommitLogFrame rep1002FrameBox">
			<textarea id="svnCommitLogDetail" class="svnCommitLogDetail" readonly="readonly" guide="rep1002RepCommitLog"></textarea>
		</div>
		<div class="rep1002FileMainFrame" guide="rep1002RepChgLog">
			<div class="svn_mask_content" id="revisionFileList">리비전을 선택해주세요.</div>
			<div class="rep1002FileTreeFrame rep1002FrameBox">
				<ul id="rep1002FileTree" class="ztree"></ul>
			</div>
			<div class="rep1002FileListFrame rep1002FrameBox">
				<div data-ax5grid="filePath-grid" data-ax5grid-config="{}" style="height: 300px;"></div>
			</div>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDetailCloseBtn">닫기</div>
		</div>
	</div>
</div>
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />