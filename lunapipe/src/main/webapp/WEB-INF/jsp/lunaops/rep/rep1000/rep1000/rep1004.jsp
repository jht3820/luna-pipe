<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style type="text/css">
.layer_popup_box .pop_left, .layer_popup_box .pop_right { height: 54px; }
.button_normal { width: 39px; height: 22px; line-height: 22px; text-align: center; font-weight: bold; font-size: 1em; border-radius: 5px; box-shadow: 1px 1px 1px #ccd4eb; margin: 0 auto; border: 1px solid #b8b8b8; cursor: pointer; }
div.pop_sub .pop_left {width:28%;} /* common.css pop_left width값 오버라이딩 */
div.pop_sub .pop_right {width:72%;} /* common.css pop_left width값 오버라이딩 */
.input_txt {padding-left: 5px;}
.rep1004GridFrame {position: relative;margin-bottom: 2px;}
</style>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<script type="text/javascript">

	var popSearch;
	var rep1004PathGrid;
	
	var paramRevision
	$(document).ready(function() {
		//소스저장소 id , 리비전 id, 커밋 id
    	var paramRevision = $("form#rep1004PopupFrm > #revision").val();
    	var paramCommitId = $("form#rep1004PopupFrm > #commitId").val();
    	
		//리비전 파일목록 세팅
		fnSearchFileDirTree(paramRevision, paramCommitId);
    	
    	//리비전 그리드 목록 세팅
    	fnFileGridView();
		
		$('#btnPopRep1004Cancle').click(function() {
			gfnLayerPopupClose();
		});
	});
	
	//axisj5 그리드
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
                	//소스저장소 id , 리비전 id, 커밋 id
                	var paramRepId = $("form#rep1004PopupFrm > #repId").val();
                	var paramRevision = $("form#rep1004PopupFrm > #revision").val();
                	var paramCommitId = $("form#rep1004PopupFrm > #commitId").val();
                	
                	var data = {"revision" : paramRevision, "commitId" : paramCommitId ,"path": this.item.path, "name": this.item.name, "repId" : paramRepId}; 
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
                	//선택 개체 없는 경우 중지
                	if(typeof selItem == "undefined"){
                		return false;
                	}
                	return true;
                },
                onClick: function (item, param) {
                	var selItem = filePathGrid.list[param.doindex];

                    if(item.type == "revisionFileList"){
            			//리비전 최소 범위
            			var startRevision = (lastRevision-100);
            			if(startRevision < 0){
            				startRevision = 0;
            			}
            			
            			//소스저장소 id , 리비전 id, 커밋 id
                    	var paramRepId = $("form#rep1004PopupFrm > #repId").val();
                    	var paramRevision = $("form#rep1004PopupFrm > #revision").val();
                    	var paramCommitId = $("form#rep1004PopupFrm > #commitId").val();
                    	
                    	//배정된 요구사항 팝업
    					var data = {
                    			 "repId": paramRepId
                    			, "revisionNum": paramRevision
                    			, "commitId": paramCommitId
                    			, "filePath": selItem.path
                    			, "startRevision": startRevision
                    			, "lastRevision": lastRevision
                    			, "selRevision": paramRevision
                    			, "selCommitId": paramCommitId
                    			, "fileName": selItem.name
                    			, "repTypeCd": repTypeCd
                    			};
    	 				gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1005View.do',data,"1100","690",'scroll');	
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
	
	function fnSearchFileDirTree(revisionIndex, commitId){
		var paramRepId = $("form#rep1004PopupFrm > #repId").val();
		var data = {"revision" : revisionIndex, "commitId" : commitId , "repId" : paramRepId};
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002FileDirAjaxList.do'/>","loadingShow": false}
				,data);
		
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
	    
			//오류
			if(data.errorYn == "Y"){
				$("#revisionFileList").html(data.consoleText);
				$("#revisionFileList").show();
			}else{
		    	toast.push(data.message);
		    	
		    	// zTree 설정 
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
							//우측 메뉴 정보
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
			    // zTree 초기화
			    zTree = $.fn.zTree.init($("#rep1004FileTree"), setting, dirList);
			    
		    	//리비전 파일목록 mask hide
		    	$("#revisionFileList").hide();
		    	getRepRevisionFileList(null,revisionFileList);
		    	zTree.expandAll(true);
		    	zTree.refresh();
			}
		});
		
		//AJAX 전송
		ajaxObj.send();
	}
	
	//리비전 파일 목록 불러오기	
	function getRepRevisionFileList(node, dataList, _pageNo){
		var returnList = [];
		var tmpList = [];
		
		//페이지 없는경우 0페이지
		if(gfnIsNull(_pageNo)){
			_pageNo = 0;
		}
		
		//시작점  (현재 페이지번호 * 표시 갯수)
		var firstIndex = (_pageNo * revisionFilePahtListCnt);
		
		//종료점 (시작점 + 표시 갯수)
		var lastIndex = (firstIndex + revisionFilePahtListCnt);
		
		//node값이 null인경우 전체 file 출력
		if(node == null){
			tmpList = dataList;
		}else{	//노드 정해져있는 경우 (좌측 디렉토리 선택)
			var selectKey = node.currentKey;
			$(dataList).each(function(index, item){
				//키 값이 같은 경우만 출력
				if(item.currentKey.indexOf(selectKey)==0){
					tmpList.push(item);	
				}
			});
		}
		
		//파일 목록 전체 갯수
		var totalFileCnt = tmpList.length;
		
		//페이지 수
		var totalPageCount = parseInt(((totalFileCnt - 1) / revisionFilePahtListCnt) + 1);
		
		//페이지 수 만큼 가져오기
		for(var i=firstIndex;i<lastIndex;i++){
			returnList.push(tmpList[i]);
		}
		
		//그리드 데이터 넣기
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
</script>

<div class="popup">
	<form id="rep1004PopupFrm" name="rep1004PopupFrm" method="post">
		<input type="hidden" name="repId" id="repId" value="${param.repId}" />
		<input type="hidden" name="revision" id="revision" value="${param.revision}" />
		<input type="hidden" name="commitId" id="commitId" value="${param.commitId}" />
	</form>
	<div class="pop_title">리비전 변경 파일 목록</div>
	<div class="rep1004Pop_sub" guide="rep1004RepChgLog">
		<div class="sub_title">
			[ <c:out value="${param.revision}"/> ] 선택 리비전 변경 파일 목록
		</div>
		<div class="rep1004FileTreeFrame rep1004FrameBox">
			<ul id="rep1004FileTree" class="ztree"></ul>
		</div>
		<div class="rep1004FileListFrame rep1004FrameBox">
			<div data-ax5grid="filePath-grid" data-ax5grid-config="{}" style="height: 395px;"></div>
		</div>
		<div class="btn_div">
			<div class="button_normal exit_btn" id="btnPopRep1004Cancle" >닫기</div>
		</div>
	</div>
	</form>
</div>
</html>