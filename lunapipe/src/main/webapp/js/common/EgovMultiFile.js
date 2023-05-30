/**
 * Convert a single file-input element into a 'multiple' input list

 * Usage:
 *
 *   1. Create a file input element (no name)
 *      eg. <input type="file" id="first_file_element">
 *
 *   2. Create a DIV for the output to be written to
 *      eg. <div id="files_list"></div>
 *
 *   3. Instantiate a MultiSelector object, passing in the DIV and an (optional) maximum number of files
 *      eg. var multi_selector = new MultiSelector( document.getElementById( 'files_list' ), 3 );
 *
 *   4. Add the first element
 *      eg. multi_selector.addElement( document.getElementById( 'first_file_element' ) );
 */

//중복 파일 업로드 방지 전역변수
var fileChk = new Array();


function MultiSelector( list_target, max ){

	// Where to write the list
	this.list_target = list_target;
	// How many elements?
	this.count = 0;
	// How many elements?
	this.id = 0;
	// Is there a maximum?

	if( max ){
		this.max = max;
	} else {
		this.max = -1;
	};
	
	
	/**
	 * element : Add a new file input element
	 * dropElement : drag & drop Area element
	 */
	this.addElement = function( element ,dropElement ){
		
		// Make sure it's a file input element
		//if( element.tagName == 'INPUT' && element.type == 'file' ){

			// Element name -- what number am I?
			//element.name = 'file_' + this.id++;
			
			// Add reference to this object
			element.multi_selector = this;
			
			// What to do when a file is selected
			element.onchange = function(e){
				
				if($(this).data('user') === undefined){
					
					var dragDropTarget = $(dropElement);
					// drag&drop 타겟이 없을 경우
					if(gfnIsNull(dragDropTarget)){
						// dragandrophandler 를 타겟으로 지정
						dragDropTarget = $("#dragandrophandler");
					}
					
					// 호출된 팝업위에 첨부파일 업로드 가능한 팝업이 호출될 경우 overlap-popup의 값을 가져온다.
					var overlapPopChk = $(element).data("overlap-popup");
					if(gfnIsNull(overlapPopChk)){
						overlapPopChk = "";
					}
					
					// handleFileUpload(파일목록, 파일 목록이 표시될 타겟 div, 팝업위에 첨부파일 업로드 가능한 팝업이 호출되는지 여부)
					// 파일목록에서 파일 정보를 추출하여 타겟 div에 파일정보를 표시한다.
					handleFileUpload($(element)[0].files, dragDropTarget, overlapPopChk);
					//handleFileUpload(document.getElementById('egovFileUpload').files, $("#dragandrophandler"))
				} else {
					fd.append('file', this.files[0]);
					$("#egovFileStatus").html(this.files[0].name + "( " + gfnByteCalculation(this.files[0].size) + " )" );
				}
			}
			// If we've reached maximum number, disable input element
			if( this.max != -1 && this.count >= this.max ){
				element.disabled = true;
			};

			// File element counter
			this.count++;
			// Most recent element
			this.current_element = element;
			
			//insertFileCnt 존재 확인
			if($('#insertFileCnt').length > 0){
				$('#insertFileCnt').val(this.count);
			}
			
			
		//} else {
			// This can only be applied to file input elements!
		//	alert( 'Error: not a file input element' );
		//};

	};

	/**
	 * Add a new row to the list of files
	 */
	this.addListRow = function( element ){
		// Row div
		var new_row = document.createElement( 'div' );
		new_row.className="statusbar odd";
		
		// Delete button
		var new_row_button = document.createElement( 'div' );
		new_row_button.innerHTML = '취소';
		new_row_button.className = 'abort addFileList';
		
		// References
		new_row.element = element;

		// Delete function
		new_row_button.onclick= function(){
			fileChk.pop(this.parentNode.element.files[0].name+":"+this.parentNode.element.files[0].size);
			
			// Remove element from form
			this.parentNode.element.parentNode.removeChild( this.parentNode.element );

			// Remove this row from the list
			this.parentNode.parentNode.removeChild( this.parentNode );

			// Decrement counter
			this.parentNode.element.multi_selector.count--;

			// Re-enable input element (if it's disabled)
			this.parentNode.element.multi_selector.current_element.disabled = false;

			//    which nixes your already queued uploads
			return false;
		};

		// 파일 크기 구하기
		//var temp_count = (document.getElementsByName('uploadFileList').length-(this.count-1));
		//var fileSize = document.getElementsByName('uploadFileList')[temp_count].files[0].size;
		var fileSize = document.getElementsByName('uploadFileList')[1].files[0].size
		// 파일 크기 출력값 구하기
		var sizeStr="";
		
		//파일 크기 0Byte인 경우 오류
		if(fileSize <= 0){
			var fileObj = document.getElementsByName('uploadFileList')[1];
			fileChk.pop(fileObj.files[0].name+":"+fileObj.files[0].size);
			toast.push("크기가 0 Byte인 파일은 업로드가 불가능 합니다.<br>"+fileObj.files[0].name);
			fileObj.remove();
			return false;
		}
		
        var sizeKB = fileSize/1024;
        if(parseInt(sizeKB) > 1024)
        {
            var sizeMB = sizeKB/1024;
            sizeStr = sizeMB.toFixed(2)+" MB";
        }
        else
        {
            sizeStr = sizeKB.toFixed(2)+" KB";
        }

        //파일 이름 값 구하기
        var eleVal = element.value;
        
        //브라우저 보안, fake path 없애기
        eleVal = eleVal.replace('C:\\fakepath\\','');
        
        // Set row value
		new_row.innerHTML = eleVal+"&nbsp;("+sizeStr+")";
		
		// Add button
		new_row.appendChild( new_row_button );
		
		// Add it to the list
		this.list_target.appendChild( new_row );
		
		//스크롤 최하단으로 내리기
		$("#egovFileStatus").scrollTop($("#egovFileStatus")[0].scrollHeight);
	};
}
