var rowCount=0;
var fileAppendList = [];

function createStatusbar(fileVo, obj) {
	
	$('#dndCancel').show();
	
	var fileSize = gfnByteCalculation(fileVo.size);
	
    $('<div>',{class:'file_frame_box'})
    	.append($('<div>',{class:'file_main_box'})
    			.append($('<div>',{class:'file_contents'})
    					.append(gfnFileExtImages(fileVo.name.substr(fileVo.name.lastIndexOf('.')+1)))
    					.append(gfnCheckStrLength(fileVo.name, 30))
    					.append("(" + fileSize+ ")"))
    			.append($('<div>',{class:"file_btn file_delete", "data-file-data" : fileVo.name+":"+fileVo.size,  "data-overlap-popup" : obj.data("overlap-popup") ,click: delElementNoServerData, text:'삭제'}))
    	)
    	
    	.appendTo(obj)

    this.setFileNameSize = function(name,size)
    {
      
		$(".pop_file").scrollTop($(".pop_file")[0].scrollHeight);
    }

    this.setAbort = function(jqxhr)
    {
        var sb = this.statusbar;
        this.abort.click(function()
        {
            jqxhr.abort();
            sb.hide();
        });
    }
}


function handleFileUpload(files, obj, overlapPopChk)
{
	var ext ;
	for (var i = 0; i < files.length; i++) {
	   
	   ext =files[i].name.split(".").pop().toLowerCase();
	   
	   
	
	   
	   
	   if(!gfnIsNull(overlapPopChk)){
		   
		   
		   fileChkMain.push(files[i].name+":"+files[i].size);
		   fileAppendListMain.push(files[i]);
	   }else{
		   fileChk.push(files[i].name+":"+files[i].size);
		   
		   
		   fileAppendList.push(files[i]);
	   }
	   
	   var status = new createStatusbar(files[i], obj); 
	   status.setFileNameSize(files[i].name,files[i].size);
	   
   }
}

$(document).ready(function()
{
	var objTemp = obj;
	if(objTemp == null){
		var obj = $("#dragandrophandler");
	}
	fnDragAndDropEventSet(obj);
});



function fnDragAndDropEventSet(objList, overlapPopChk){
	
	$.each(objList, function(idx, map){

		var dragAndDropObj = map;
		
		
		if(!gfnIsNull(map.obj)){
			
			dragAndDropObj = map.obj;
		}
		
		
		$(dragAndDropObj).off('dragenter dragover dragleave drop');
		
		var dragging = 0;
		$(dragAndDropObj).on('dragenter', function (e)  
		{
			dragging++;
		    e.stopPropagation();
		    e.preventDefault();
		    $(this).css('border', '1px solid #4b73eb');
		});
		$(dragAndDropObj).on('dragover', function (e)   
		{
		     e.stopPropagation();
		     e.preventDefault();
		});
		$(dragAndDropObj).on('dragleave ', function (e)   
		{
			dragging--;
		    if (dragging === 0) {
		    	$(this).css('border', '1px solid #fff');
		    }
		});
		$(dragAndDropObj).on('drop', function (e) 
		{
			$(this).css('border', '1px dotted #4b73eb');
		    e.preventDefault();
		    var files = e.originalEvent.dataTransfer.files;
		    
		    
		    if(gfnIsNull(map.auth)){
		    	
		    	handleFileUpload(files,$(this), overlapPopChk);
		    }
		    
		    else if( !gfnIsNull(map.auth) && map.auth == "opt" ){
		    	
		    	var atchFileId = $(this).attr("fileid");
		    	
		    	var returnFunction = map.rtnFunc;
		    	returnFunction(files, atchFileId);
		    }
		});
	});
}


function dndCancel(YN){
	
	if(YN!="Y"){
		$(".pop_file .file_frame_box .file_contents").each(function(i,v){
			gfnFileDelete(this);
		});
	}
	$(".pop_file").find('.file_frame_box').remove();
	
	fd = new FormData();
	
	fileChk.clear();
	fileAppendList.clear();
	
	$('#dndCancel').hide();
}


function delElementNoServerData(e){
	e.stopPropagation();
	$(this).closest('.file_frame_box').remove();
	
	
	if($(this).data("overlap-popup") == "Y"){
		var delIdx = fileChkMain.getObj($(this).data('fileData')).index;
		fileAppendListMain.splice(delIdx,1);
		fileChkMain.splice(delIdx,1);
		if(fileChkMain.length <= 0) {
			$('#dndCancel').hide();
		}
	
	}else{
		var delIdx = fileChk.getObj($(this).data('fileData')).index;
		fileAppendList.splice(delIdx,1);
		fileChk.splice(delIdx,1);
		if(fileChk.length <= 0) {
			$('#dndCancel').hide();
		}
	}
	
	
}




function fnFileUploadStrData(overlabPopChk){
	
	var fileUploadList = "";
	
	var uploadFiliList = fileAppendList;
	var fileChkList = fileChk;
	
	
	if(!gfnIsNull(overlabPopChk) && overlabPopChk == "Y"){
		uploadFiliList = fileAppendListMain;
		fileChkList = fileChkMain;
	}
	
	if(!gfnIsNull(uploadFiliList)){
		fileUploadList += "</br></br>[업로드 파일 목록]<div id='popup_fileList'>";
		
		var sumFileSize = 0;
		
		
		$.each(uploadFiliList,function(idx, map){
			
			var ext = map.name.split(".").pop().toLowerCase();
			var fileName = gfnCutStrLen(map.name,45);
			
			if(map.size > FILE_INFO_MAX_SIZE){
				var fileInfoMaxSizeStr = gfnByteCalculation(FILE_INFO_MAX_SIZE);
				fileUploadList += '<i class="fa fa-file"></i>&nbsp;<s>'+fileName+'</s> ('+fileInfoMaxSizeStr+' 용량 초과)</br>';
			}else if(sumFileSize > FILE_SUM_MAX_SIZE){
				var fileSumMaxSizeStr = gfnByteCalculation(FILE_SUM_MAX_SIZE);
				fileUploadList += '<i class="fa fa-file"></i>&nbsp;<s>'+fileName+'</s> ('+fileSumMaxSizeStr+' 전체 용량 초과)</br>';
			}else if(!gfnFileCheck(ext)){
				fileUploadList += '<i class="fa fa-file"></i>&nbsp;<s>'+fileName+'</s> ([ ' +ext + ' ] 확장자 불가)</br>';
			}else if(fileChkList.getObj(map.name+":"+map.size).index != idx){
				fileUploadList += '<i class="fa fa-file"></i>&nbsp;<s>'+fileName+'</s> (중복 파일)</br>';
			}else if(map.size <= 0){
				fileUploadList += '<i class="fa fa-file"></i>&nbsp;<s>'+fileName+'</s> (0 Byte인 파일)</br>';
			}else{
				fileUploadList += '<i class="far fa-file"></i>&nbsp;'+gfnCutStrLen(map.name,90)+'</br>';
				sumFileSize += map.size;
				fileUploadChk = true;
				
			}
		});
		fileUploadList += "</div>";
	}
	
	return fileUploadList;
}


function fnFileUploadAppendData(paramName, overlabPopChk){

	var uploadFiliList = fileAppendList;
	var fileChkList = fileChk;
	var sendFormData;
	
	
	if(!gfnIsNull(overlabPopChk) && overlabPopChk == "Y"){
		uploadFiliList = fileAppendListMain;
		fileChkList = fileChkMain;
		
		sendFormData = mainFd;
	
	}else{
		sendFormData = fd;
	}
	
	
	if(!gfnIsNull(uploadFiliList)){
		
		var sumFileSize = 0;
		
		
		$.each(uploadFiliList,function(idx, map){
			
			var ext = map.name.split(".").pop().toLowerCase();
			
			if(map.size > FILE_INFO_MAX_SIZE){
				return true;
			}else if(sumFileSize > FILE_SUM_MAX_SIZE){
				return true;
			}else if(!gfnFileCheck(ext)){
				return true;
			}else if(fileChkList.getObj(map.name+":"+map.size).index != idx){
				return true;
			}else if(map.size <= 0){
				return true;
			}else{
				sendFormData.append(paramName,map);
			}
		});
	}
}



