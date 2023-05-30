"use strict";

function osl_option_setting(optList, usrConfig){
	
	this.duplList = [];
	
	
	this.optList = optList;
	
	
	this.optDateDataArr = [];
	
	
	this.mstCdStrArr = '';
	this.selectObjList = [];
	this.arrComboType = [];
	
	
	this.commonPopup_charger = [];
	this.commonPopup_cls = [];
	this.commonPopup_dept = [];
	
	
	this.authGrpList = [];
	
	
	this.optHtmlData = '';
	
	
	this.strCheckObjArr = [];
	this.sCheckObjNmArr = [];
	
	
	this.readonlyFileIdList = [];
	
	
	this.optDatasetList = [];
	
	
	this.essentialCdFileIdList = [];
	
	
	var defaultConfig = {
			
			"classNm":{
				
				"option_half": "option_half",
				
				
				"option_all": "option_all",
				
				
				"option_clear": "option_clear",
				
				
				"option_desc": "option_desc",
				
				
				"option_file": "option_file",
				
				
				"option_fileBtn": "option_fileBtn",
				
				
				"option_readonly": "option_readonly",
				
				
				"option_input_text": "option_input_text",
				
				
				"option_textarea": "option_textarea",
				
				
				"option_checkbox": "option_checkbox",
				
				
				"option_input_date": "option_input_date",
				
				
				"option_select": "option_select",
				
				
				"option_optCharger": "option_optCharger",
				
				
				"option_cls": "option_cls",
				
				
				"option_dept": "option_dept",
				
				
				"option_title": "option_title",
				
				
				"option_title_line": "option_title_line",
				
				
				"option_deploy": "option_deploy"
			},
			
			"optType":{
				"option_select": "02",
				"option_optCharger": "03",
				"option_cls": "04",
				"option_deploy": "05",
				"option_dept": "06"
			},
			
			
			"optTarget": "02",
			
			
			"optInitReadonly": false,
			
			
			"optFileUploadFunction": $.noop,
			
			
			"optLayoutPreview": false,
			
			
			"optEmptyAppend": true,
			
			"prjId": null,
	};
	
	
	this.config = $.extend(true,defaultConfig, usrConfig);

	
	Object.preventExtensions(this);
}


osl_option_setting.prototype.getHtml = function(htmlTargetObj, callbackFn){
	
	var OSLOPTOBJ = this;
	
	
	var removeEventArr = ["dragenter", "dragover", "drop"];
	
	
	var fnIsNull =
		
		(typeof gfnIsNull != "undefined")?
		function(sValue){
			return gfnIsNull(sValue);
		}:
		function(sValue){
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
		};
	
	
	var rtnStrArr = [];
	var rtnStrValue = [];
	
	
	if(!fnIsNull(OSLOPTOBJ.optList) && OSLOPTOBJ.optList.length > 0){
		
		var halfCnt = 0;
		
		
		var rowCnt = 0;
		
		
		var hlafFlowId = "";
		
		
		var authGrpMissChk = false;
		
		
		var optAtchFileChk = false;
		
		
		var arrChkObj = {};
		
		
		var dragAndDropListTmp = [];
		
		
		if(!fnIsNull(OSLOPTOBJ.authGrpList) && authGrpList.length > 0){
			var authGrpIds = [];
			$.each(authGrpList,function(idx, map){
				authGrpIds.push(map.authGrpId);
			});
			
			
			if(authGrpIds.indexOf(loginUsrAuthGrpId) == -1){	
				authGrpMissChk = true;
			}
		}
		
		
		$.each(OSLOPTOBJ.optList,function(idx, map){
			
			if(OSLOPTOBJ.duplList.indexOf(map.itemId) != -1){
				return true;
			}
			OSLOPTOBJ.duplList.push(map.itemId);
			
			
			
			var optionWidthSize = '';
			
			
			var optionTitleClass = '';
			var optionDefaultWidthSize = '';
			
			
			var optContentData = '';
			
			
			var itemNm = map.itemNm;
			
			
			itemNm = gfnEscapeHtml(itemNm);
			
			
			var itemValue = '';
			
			
			var optTarget = OSLOPTOBJ.config.optTarget;
			
			
			var optReadOnlyChk = false;
			var optReadOnly = 'readonly="readonly"';
			var optAddClass = OSLOPTOBJ.config.classNm.option_readonly;
			
			
			if(map.itemRowNum == "01"){ 
				optionDefaultWidthSize = OSLOPTOBJ.config.classNm.option_half;
				
				rowCnt++;
				halfCnt++;
				hlafFlowId = map.flowId;
			}else if(map.itemRowNum == "02"){ 
				optionDefaultWidthSize = OSLOPTOBJ.config.classNm.option_all;
				optionTitleClass = OSLOPTOBJ.config.classNm.option_clear;
				rowCnt++;
				halfCnt+=2;
			}
			
			
			if(map.itemCode == "01"){
				if(map.itemType == "02"){ 
					
					optionTitleClass = optionWidthSize = OSLOPTOBJ.config.classNm.option_desc;
				}
			}
			else if(map.itemCode == "03"){ 
				
				optionTitleClass = optionWidthSize = OSLOPTOBJ.config.classNm.option_file;
			}
			
			
			if(OSLOPTOBJ.config.optInitReadonly){
				optReadOnlyChk = true;
			}else{
				
				if(typeof map.itemModifyCd != "undefined" && map.itemModifyCd != null && map.itemModifyCd == "02"){ 
					optReadOnlyChk = true;
					
					
					if(!gfnIsNull(flowInfo) && !gfnIsNull(map.flowId) && flowInfo.flowId == map.flowId){
						optReadOnlyChk = false;
					}
				}
			}
			
			if(authGrpMissChk){
				optReadOnlyChk = true;
			}
			
			
			if(!fnIsNull(OSLOPTOBJ.config.optLayoutPreview) && OSLOPTOBJ.config.optLayoutPreview){
				optReadOnlyChk = false;
			}
			
			
			if(!fnIsNull(map.itemValue)){
				itemValue = map.itemValue;
				
				
				itemValue = gfnEscapeHtml(itemValue);
			}
			
			
			
			var optDatasetStr = '';
			
			
			if(!fnIsNull(OSLOPTOBJ.optDatasetList) && OSLOPTOBJ.optDatasetList.length > 0){
				$.each(OSLOPTOBJ.optDatasetList, function(subIdx, subStr){
					
					if(map.hasOwnProperty(subStr)){
						
						optDatasetStr += "opt"+subStr.toLowerCase().trim()+"="+map[subStr]+" ";
					}
				});
			}
			
			
			if(map.itemCode == "01"){ 
				if(map.itemType == "01"){ 
					if(!optReadOnlyChk){
						optReadOnly = optAddClass = '';
						
						
						var checkData = {};
						checkData[map.itemId] =  {"type":"length","msg":"항목 "+itemNm+"(은)는 "+map.itemLength+"byte까지 입력이 가능합니다.",max:map.itemLength};
						arrChkObj = $.extend(arrChkObj,checkData);
					}
					
					optContentData = '<input type="text" class="'+OSLOPTOBJ.config.classNm.option_input_text+' '+optAddClass+'" title="'+itemNm+'" id="'+map.itemId+'" name="'+map.itemId+'" maxlength="'+map.itemLength+'" '+optDatasetStr+' opttarget="'+optTarget+'" value="'+itemValue+'" '+optReadOnly+'/>';
				}else if(map.itemType == "02"){ 
					if(!optReadOnlyChk){
						optReadOnly = optAddClass = '';
						
						
						var checkData = {};
						checkData[map.itemId] =  {"type":"length","msg":"항목 "+itemNm+"(은)는 "+map.itemLength+"byte까지 입력이 가능합니다.",max:map.itemLength};
						
						arrChkObj = $.extend(arrChkObj,checkData);
					}
				
					
					itemValue = itemValue.replace(/<br>/gi,"\n").replace(/<\/br>/gi,"\n");
					optContentData = '<textarea class="'+OSLOPTOBJ.config.classNm.option_textarea+' '+optAddClass+'" title="'+itemNm+'" id="'+map.itemId+'" name="'+map.itemId+'" '+optDatasetStr+' opttarget="'+optTarget+'" '+optReadOnly+'>'+itemValue+'</textarea>';
					
					
					optionWidthSize  = optionTitleClass = OSLOPTOBJ.config.classNm.option_desc;
					optionTitleClass += " "+OSLOPTOBJ.config.classNm.option_title_line;
				}else if(map.itemType == "03"){ 
					if(!optReadOnlyChk){
						optReadOnly = optAddClass = '';
					}
					var optChkVal = ""
					
					if(map.itemValue == "01"){
						optChkVal = " checked";
					}
					optContentData = '<div class="option_chk"><input type="checkbox" class="'+OSLOPTOBJ.config.classNm.option_checkbox+' '+optAddClass+'" title="'+itemNm+'" id="'+map.itemId+'" name="'+map.itemId+'" '+optDatasetStr+' opttarget="'+optTarget+'"'+optChkVal+' '+optReadOnly+'/><label for="'+map.itemId+'"></label></div>';
				}else if(map.itemType == "04"){ 
					if(optReadOnlyChk){
						optReadOnly = 'disabled="disabled"';
					}else{
						optAddClass = '';
						
						OSLOPTOBJ.optDateDataArr.push({id:map.itemId,format:'YYYY-MM-DD',options:{drops:"up"}});
					}
					optContentData = '<input type="text" class="'+OSLOPTOBJ.config.classNm.option_input_date+' bgFFF'+optAddClass+'" title="'+itemNm+'" id="'+map.itemId+'" name="'+map.itemId+'" '+optDatasetStr+' readonly="readonly" opttarget="'+optTarget+'" value="'+itemValue+'" '+optReadOnly+'/>';
				}else if(map.itemType == "05"){ 
					if(optReadOnlyChk){
						optReadOnly = 'disabled="disabled"';
					}else{
						optAddClass = '';
						
						OSLOPTOBJ.optDateDataArr.push({id:map.itemId,format:'YYYY-MM-DD HH:mm',options:{timePicker:true,drops:"up"}});
					}
					optContentData = '<input type="text" class="'+OSLOPTOBJ.config.classNm.option_input_date+' bgFFF'+optAddClass+'" title="'+itemNm+'" id="'+map.itemId+'" name="'+map.itemId+'" '+optDatasetStr+' readonly="readonly" opttarget="'+optTarget+'" value="'+itemValue+'" '+optReadOnly+'/>';
				}
			}else if(map.itemCode == "02"){ 
				if(optReadOnlyChk){
					optReadOnly = 'disabled="disabled"';
				}else{
					optAddClass = '';
				}
				optContentData = '<select type="text" class="'+OSLOPTOBJ.config.classNm.option_select+' '+optAddClass+'" title="'+itemNm+'" id="'+map.itemId+'" name="'+map.itemId+'" '+optDatasetStr+' opttype="'+OSLOPTOBJ.config.optType.option_select+'" cmmcode="'+map.itemCommonCode+'" opttarget="'+optTarget+'" OS="'+itemValue+'" '+optReadOnly+'></select>';
				
				
				if(OSLOPTOBJ.mstCdStrArr.length > 0){
					OSLOPTOBJ.mstCdStrArr += "|"
				}
				
				
				OSLOPTOBJ.mstCdStrArr += map.itemCommonCode;
				OSLOPTOBJ.selectObjList.push(map.itemId);
				OSLOPTOBJ.arrComboType.push("OS");
			}else if(map.itemCode == "03"){ 
				
				optAtchFileChk = true;
				
				
				optionWidthSize += ' '+OSLOPTOBJ.config.classNm.option_file;
				optionTitleClass += ' '+OSLOPTOBJ.config.classNm.option_file+' '+OSLOPTOBJ.config.classNm.option_title_line;
				
				var fileUploadBtnStr = '';
				var fileUploadWidth = '';
				var fileUploadDesc = '';
				var optFileReadOnlyCss = "";
				var fileOnclickEvt = 'onclick="fnOptFileUpload(this)"';
				
				
				var fileId = map.itemValue;
				
				var uploadType = "Y";
				
				
				if(!fnIsNull(OSLOPTOBJ.config.optLayoutPreview) && OSLOPTOBJ.config.optLayoutPreview){
					fileOnclickEvt = '';
					fileUploadDesc = '<div class="optFile_dragDrop_info">Drop files here or click to upload.</div>';
					fileUploadWidth = ' widthAll';
					optFileReadOnlyCss = " fileReadOnly";
				}
				
				else if(!optReadOnlyChk){
					
					if(fnIsNull(map.itemValue)){
						if(optTarget != "06" && optTarget != "04"){
							return true;
						}else{
							fileId = "FILE_"+new Date().format('0yyMMddhhmmms')+idx;
							uploadType = "N";
						}
					}
					
					fileUploadBtnStr = '<div class="'+OSLOPTOBJ.config.classNm.option_fileBtn+'" '+fileOnclickEvt+' id="btn_insert_fileSelect" itemid="'+map.itemId+'" fileid="'+fileId+'">'
										+'<input type="file" style="display: none" id="fileUpload_'+fileId+'" name="fileUpload_'+fileId+'" multiple="multiple"/>'
										+'<i class="fa fa-file-upload fa-2x"></i>&nbsp;파일 선택'
									+'</div>';
					
					fileUploadDesc = '<div class="optFile_dragDrop_info">Drop files here or click to upload.</div>';
					
					
					dragAndDropListTmp.push(fileId);
				}else{
					
					fileUploadWidth = ' widthAll';
					
					
					OSLOPTOBJ.readonlyFileIdList.push(fileId);
					
					
					fileOnclickEvt = '';
				}
				
				
				if(map.itemEssentialCd == "01" && !optReadOnlyChk){
					OSLOPTOBJ.essentialCdFileIdList.push(fileId);
				}
				
				
				if(optReadOnlyChk){
					optFileReadOnlyCss = " fileReadOnly";
				}
				
				optContentData = '<div class="optFileDiv '+fileUploadWidth+' opt_drop_file'+optFileReadOnlyCss+'" id="fileDiv_'+fileId+'" fileid="'+fileId+'" data-upload-type="'+uploadType+'" '+fileOnclickEvt+'>'
										+fileUploadDesc+'</div>'
										+fileUploadBtnStr;
			}else if(map.itemCode == "04"){ 
				var popupBtnStr = '';
				if(!optReadOnlyChk){
					optReadOnly = optAddClass = '';
					
					
					OSLOPTOBJ.commonPopup_charger.push(map.itemId);
					popupBtnStr = '<span class="button_normal2 fl '+OSLOPTOBJ.config.classNm.option_optCharger+'" id="btn_user_select_'+map.itemId+'"><li class="fa fa-search"></li></span>';
				}
				optContentData = '<input type="text" name="'+map.itemId+'" id="'+map.itemId+'" title="'+itemNm+'" opttype="'+OSLOPTOBJ.config.optType.option_optCharger+'" '+optDatasetStr+' opttarget="'+optTarget+'" value="'+itemValue+'" style="display:none;"/>'
									+'<input type="text" class="'+OSLOPTOBJ.config.classNm.option_input_text+' '+OSLOPTOBJ.config.classNm.option_optCharger+' '+optAddClass+'" title="'+itemNm+'" name="'+map.itemId+'Nm" id="'+map.itemId+'Nm" modifyset="02" value="'+$.trim(map.itemValueNm)+'"/>'
									+popupBtnStr;
			}else if(map.itemCode == "05"){ 
				var popupBtnStr = '';
				
				if(!optReadOnlyChk){
					optReadOnly = optAddClass = '';
					
					
					OSLOPTOBJ.commonPopup_cls.push(map.itemId);
					popupBtnStr = '<span class="button_normal2 fl '+OSLOPTOBJ.config.classNm.option_cls+'" id="btn_cls_select_'+map.itemId+'"><li class="fa fa-search"></li></span>';
				}
				optContentData = '<input type="text" name="'+map.itemId+'" id="'+map.itemId+'" title="'+itemNm+'" opttype="'+OSLOPTOBJ.config.optType.option_cls+'" '+optDatasetStr+' opttarget="'+optTarget+'" value="'+itemValue+'" style="display:none;"/>'
									+'<input type="text" class="'+OSLOPTOBJ.config.classNm.option_input_text+' '+OSLOPTOBJ.config.classNm.option_cls+' '+optAddClass+'" title="'+itemNm+'" name="'+map.itemId+'Nm" id="'+map.itemId+'Nm" modifyset="02" value="'+$.trim(map.itemValueNm)+'" readonly="readonly"/>'
									+popupBtnStr;
			}else if(map.itemCode == "06"){ 
				var popupBtnStr = '';
				if(!optReadOnlyChk){
					optReadOnly = optAddClass = '';
					
					
					OSLOPTOBJ.commonPopup_dept.push(map.itemId);
					popupBtnStr = '<span class="button_normal2 fl '+OSLOPTOBJ.config.classNm.option_dept+'" id="btn_dept_select_'+map.itemId+'"><li class="fa fa-search"></li></span>';
				}
				optContentData = '<input type="text" name="'+map.itemId+'" id="'+map.itemId+'" title="'+itemNm+'" opttype="'+OSLOPTOBJ.config.optType.option_dept+'" '+optDatasetStr+' opttarget="'+optTarget+'" value="'+itemValue+'" style="display:none;"/>'
									+'<input type="text" class="'+OSLOPTOBJ.config.classNm.option_input_text+' '+OSLOPTOBJ.config.classNm.option_dept+' '+optAddClass+'" title="'+itemNm+'" name="'+map.itemId+'Nm" id="'+map.itemId+'Nm" modifyset="02" value="'+$.trim(map.itemValueNm)+'" readonly="readonly"/>'
									+popupBtnStr;
			}
			
			
			if(map.itemEssentialCd == "01" && (map.itemCode == "04" || map.itemCode == "05" || map.itemCode == "06")){
				OSLOPTOBJ.strCheckObjArr.push(map.itemId+'Nm');
				OSLOPTOBJ.sCheckObjNmArr.push(itemNm);
			}
			
			
			if(map.itemCode != "03" && map.itemEssentialCd == "01"){
				OSLOPTOBJ.strCheckObjArr.push(map.itemId);
				OSLOPTOBJ.sCheckObjNmArr.push(itemNm);
			}
			
			
			var optNm = itemNm;
			
			
			if(map.itemEssentialCd == '01'){
				optNm += ' (*)';
			}
			
			
			optNm = gfnEscapeHtml(optNm);
			
			var optCompleData ='<div class="'+OSLOPTOBJ.config.classNm.option_title+' '+optionTitleClass+'" '+optDatasetStr+' title="'+optNm+'">'
						+optNm
						+'</div>'
						
						+'<div class="'+optionDefaultWidthSize + ' ' +optionWidthSize+'" '+optDatasetStr+'>'
						+optContentData
						+'</div>';

			rtnStrValue += optCompleData;
			rtnStrArr.push($(optCompleData));
		});
		
		
		if(rtnStrArr.length > 0){
			
			$(htmlTargetObj).html(rtnStrValue);
			
			
			if(!fnIsNull(OSLOPTOBJ.config.optEmptyAppend) && OSLOPTOBJ.config.optEmptyAppend){
				
				var halfCnt = 0;
				var rowCnt = 0;
				var targetElem = $(htmlTargetObj).children("div."+OSLOPTOBJ.config.classNm.option_title);
				
				
				$.each(targetElem,function(idx, map){
					
					
					var $nextDiv = $(map).next("div");
					
					var $nextNextDiv  = $nextDiv.next("div").next("div");
	
					
					var optionAll = $nextDiv.hasClass(OSLOPTOBJ.config.classNm.option_all);
					var optionDesc = $(map).hasClass(OSLOPTOBJ.config.classNm.option_desc);
	
					
					var nextOptionAll = $nextNextDiv.hasClass(OSLOPTOBJ.config.classNm.option_all);
					
					var nextDesc = $nextDiv.next("div").hasClass(OSLOPTOBJ.config.classNm.option_desc);
	
					
					if(!optionAll){
						
						halfCnt += 1;
						
						
						if(optionDesc){
							
							if(halfCnt%2 == 1){
								
								if( nextOptionAll || (!nextOptionAll && !nextDesc) ){
									
									$nextDiv.after('<div class="'+OSLOPTOBJ.config.classNm.option_title+' '+OSLOPTOBJ.config.classNm.option_desc+'" optflowid="'+hlafFlowId+'"></div>'
											+'<div class="'+OSLOPTOBJ.config.classNm.option_half+' '+OSLOPTOBJ.config.classNm.option_desc+'" optflowid="'+hlafFlowId+'"></div>');
									
									
									halfCnt += 1;
								}
							}
							
						
						}else{
							
							if(halfCnt%2 == 1){
								
								if( nextOptionAll || (!nextOptionAll && nextDesc) ){
									
									$nextDiv.after('<div class="'+OSLOPTOBJ.config.classNm.option_title+'" optflowid="'+hlafFlowId+'"></div>'
											+'<div class="'+OSLOPTOBJ.config.classNm.option_half+'" optflowid="'+hlafFlowId+'"></div>');
									
									
									halfCnt += 1;
								}
							}
						}
					}
	
					
					if(targetElem.length == (idx+1)){
						
						
						if(halfCnt%2 == 1){	
							
							if(optionDesc){
								
								$nextDiv.after('<div class="'+OSLOPTOBJ.config.classNm.option_title+' '+OSLOPTOBJ.config.classNm.option_desc+'" optflowid="'+hlafFlowId+'"></div>'
										+'<div class="'+OSLOPTOBJ.config.classNm.option_half+' '+OSLOPTOBJ.config.classNm.option_desc+'" optflowid="'+hlafFlowId+'"></div>');
								halfCnt += 1;
							
							
							}else{
								
								$nextDiv.after('<div class="'+OSLOPTOBJ.config.classNm.option_title+'" optflowid="'+hlafFlowId+'"></div>'
										+'<div class="'+OSLOPTOBJ.config.classNm.option_half+'" optflowid="'+hlafFlowId+'"></div>');
								halfCnt += 1;
							}
						}
						return false;
					}
				});
			}
		}
		
		if(optAtchFileChk && dragAndDropListTmp.length > 0){
			
			if(fnIsNull(OSLOPTOBJ.config.optLayoutPreview) || !OSLOPTOBJ.config.optLayoutPreview){
				
				if(fnIsNull(OSLOPTOBJ.config.optInitReadonly) || !OSLOPTOBJ.config.optInitReadonly){
					var dragAndDropList = [];
					
					$.each(dragAndDropListTmp, function(idx, map){
						dragAndDropList.push({auth:"opt", obj:$("#fileDiv_"+map), rtnFunc: OSLOPTOBJ.config.optFileUploadFunction});
					});
					
					fnDragAndDropEventSet(dragAndDropList);	
				}
				
			}
		}
		
		
		var removeArr = removeEventArr.slice();
		
		removeArr.push("click");
		
		$.each(OSLOPTOBJ.readonlyFileIdList,function(idx, fileId){
			
			$.each(removeArr,function(arrIdx, delEvent){
				
				$(".opt_drop_file[fileid="+fileId+"]").off(delEvent);
			});
		});
		
		
		if(!fnIsNull(OSLOPTOBJ.optDateDataArr)){
			$.each(OSLOPTOBJ.optDateDataArr,function(idx, map){
				gfnCalendarSet(map.format,[map.id],map.options);
			});
		}
		
		
		if(!fnIsNull(OSLOPTOBJ.selectObjList)){
			var arrObj = [];
			
			
			$.each(OSLOPTOBJ.selectObjList,function(idx, map){
				arrObj.push($("#"+map+""));
			});
			
			
			var strUseYn = 'Y';
			gfnGetMultiCommonCodeDataForm(OSLOPTOBJ.mstCdStrArr, strUseYn, arrObj, OSLOPTOBJ.arrComboType , false);
		}
		
		if(!fnIsNull(arrChkObj) && Object.keys(arrChkObj).length > 0){
			
			gfnInputValChk(arrChkObj);
		}
		
		
		if(!fnIsNull(OSLOPTOBJ.commonPopup_charger)){
			
			$.each(OSLOPTOBJ.commonPopup_charger,function(idx, map){
				$("#btn_user_select_"+map).click(function() {
					gfnCommonUserPopup( $('#'+map+'Nm').val() ,false,function(objs){
						if(objs.length>0){
							$('#'+map).val(objs[0].usrId);
							$('#'+map+'Nm').val(objs[0].usrNm);
						}
					}, OSLOPTOBJ.config.prjId);
				});
				
				$('#'+map+'Nm').keyup(function(e) {
					if($('#'+map+'Nm').val()==""){
						$('#'+map).val("");
					}
					if(e.keyCode == '13' ){
						$("#btn_user_select_"+map).click();
					}
				});
			});
		}

		if(!fnIsNull(OSLOPTOBJ.commonPopup_cls)){
			
			$.each(OSLOPTOBJ.commonPopup_cls,function(idx, map){
				$("#btn_cls_select_"+map).click(function() {
					gfnCommonClsPopup(function(reqClsId,reqClsNm){
						$('#'+map).val(reqClsId);
						$('#'+map+'Nm').val(reqClsNm);
					}, {prjId: OSLOPTOBJ.config.prjId});
				});
			});
		}
		
		if(!fnIsNull(OSLOPTOBJ.commonPopup_dept)){
			
			$.each(OSLOPTOBJ.commonPopup_dept,function(idx, map){
				var inputDeptName = $('#'+map+'Nm').val();
				
				$("#btn_dept_select_"+map).click(function() {
					gfnCommonDeptPopup(inputDeptName, function(deptId,deptNm){
						$('#'+map).val(deptId);
						$('#'+map+'Nm').val(deptNm);
					});
				});
			});
		}
	}else{
		
		rtnStrValue = "데이터가 없습니다.";
	}
	
	
	if(typeof callbackFn == "function"){
		callbackFn();
	}
	
	
	return rtnStrArr;
}






