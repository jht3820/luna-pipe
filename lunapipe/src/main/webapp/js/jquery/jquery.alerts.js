// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Website: http://abeautifulsite.net/blog/2008/12/jquery-alert-dialogs/
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
(function($) {
	
	$.alerts = {
		
		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time
		
		verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		//overlayOpacity: .01,                // transparency level of overlay
		overlayOpacity: .8,						// 모달 배경 투명도
		//overlayColor: '#FFF',               // base color of overlay
		overlayColor: 'rgba(0, 0, 0, 0.3)',	// 모달 배경 색
		draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;OK&nbsp;',         // text for the OK button
		cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
		dialogClass: null,                  // if specified, this class will be applied to all dialogs
		
		deleteButton: '&nbsp;Delete&nbsp;', // text for the Delete button
		
		// Public methods
		
		alert: function(message, title, callback) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			});
		},
		
		confirm: function(message, title, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},
			
		prompt: function(message, value, title, callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},
		
		promptb: function(message, value, title, callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'promptb', function(result) {
				if( callback ) callback(result);
			});
		},
		
		/* 김정환 추가 ( 휴일관리용 ) */ 
		hprompt: function(message, code, value, title, callback) {
			if( title == null ) title = 'HoliPrompt';
			$.alerts._show(title, message, value, 'holiprompt', function(chobtn, holiCd, holiDesc) {
				if( callback ) callback(chobtn , holiCd, holiDesc);
			}, code);
			
		},
		
		
		// Private methods
		
		_show: function(title, msg, value, type, callback, code) {
			
			$.alerts._hide();
			$.alerts._overlay('show');
			
			if( type == "promptb" ){
				$("BODY").append('<div id="popup_containerB"><h1 id="popup_title"></h1><div id="popup_content"><div id="popup_message"></div></div></div>');
				if( $.alerts.dialogClass ) $("#popup_containerB").addClass($.alerts.dialogClass);				
			}else{
				$("BODY").append('<div id="popup_container"><h1 id="popup_title"></h1><div id="popup_content"><div id="popup_message"></div></div></div>');
				if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);
			}
			
			// IE6 fix
			$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );
			var pos = ($.ui.ie && ( !document.documentMode || document.documentMode <= 6 ) ) ? 'absolute' : 'fixed'; 
			
			$("#popup_container").css({
				position: pos,
				zIndex: 9999999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_containerB").css({
				position: pos,
				zIndex: 9999999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
			
			$("#popup_containerB").css({
				minWidth: $("#popup_containerB").outerWidth(),
				maxWidth: $("#popup_containerB").outerWidth()
			});
			
			$.alerts._reposition( type );
			$.alerts._maintainPosition(true);
			
			switch( type ) {
				case 'alert':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
					//$("#popup_message").after('<div id="popup_panel"><span class="button_normal2" id="popup_ok">' + $.alerts.okButton + '</span></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$("#popup_ok").focus();
					$("#popup_ok").keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 32 ) $("#popup_ok").trigger('click');
					});
				break;
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if( callback ) callback(true);
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
				break;
				case 'prompt':
					$("#popup_message").append('<br /><input type="text"  id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_prompt").css('width', $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
				break;
				
				case 'promptb':
					$("#popup_message").append('<br /><textarea id="popup_promptB" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_promptB").css('width', $("#popup_message").width() );
					
					$("#popup_ok").click( function() {
						var val = $("#popup_promptB").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					/*
					$("#popup_promptB, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					*/
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
				break;
				
				
				/* 휴일등록 관련 추가 */
				case 'holiprompt':
					
					if( !gfnIsNull( value ) ) {
						$("#popup_message").append('<br /><select id="holiGbn" OS="'+code+'" style="position: absolute;"></select><input type="text"  id="popup_prompt2" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /> <input type="button" value="' + $.alerts.deleteButton + '" id="popup_delete" /></div>');
					}else{
						$("#popup_message").append('<br /><select id="holiGbn" OS="'+code+'" style="position: absolute;"></select><input type="text"  id="popup_prompt2" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					}
					
					$("#popup_prompt2").css('width', $("#popup_message").width()/4*3);
					$("#holiGbn").css('width', $("#popup_message").width()/4 );
					
					/* SELECT BOX 세팅 */
					var mstCdStrArr = "CMM00002";
					var strUseYn = 'Y';
					if( code ){
						var arrObj = [$("select[id=holiGbn]")];
						var arrComboType = ["OS"];						
					}else{
						var arrObj = [$("#holiGbn")];
						var arrComboType = ["S"];						
					}

					gfnGetMultiCommonCodeDataForm(mstCdStrArr, strUseYn, arrObj, arrComboType , true);

					/* SELECT BOX 세팅 */
					$("#popup_ok").click( function() {
						var holiCd 	= $("#holiGbn").val();					// 휴일구분
						var holiDesc 	= $("#popup_prompt2").val();
						
						$.alerts._hide();
						
						if( callback ) callback( "ok", holiCd, holiDesc );
					});
					
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( "close" , "","");
					});

					$("#popup_delete").click( function() {
						$.alerts._hide();
						if( callback ) callback( "delete" );
					});

					$("#popup_prompt2, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});

					if( value ) $("#popup_prompt2").val(value);
					
					$("#popup_prompt2").focus().select();
				break;
				/* 휴일등록 관련 추가 */
				
			}
			
			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_containerB").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},
		
		_hide: function() {
			$("#popup_container").remove();
			$("#popup_containerB").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},
		
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 999998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function( type ) {
			
			var top = (($(window).height() / 3.5) - ($("#popup_container").outerHeight() / 3.5)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			
			if( type == "promptb") {
				top = (($(window).height() / 3.5) - ($("#popup_containerB").outerHeight() / 3.5)) + $.alerts.verticalOffset;
				left = (($(window).width() / 2) - ($("#popup_containerB").outerWidth() / 2)) + $.alerts.horizontalOffset;
			} else {
				top = (($(window).height() / 3.5) - ($("#popup_container").outerHeight() / 3.5)) + $.alerts.verticalOffset;
				left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			}
			
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );
			if( $.ui.ie  && ( !document.documentMode || document.documentMode <= 6 ) ) top = top + $(window).scrollTop();
			
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			
			$("#popup_containerB").css({
				top: top + 'px',
				left: left + 'px'
			});
			
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}
		
	}
	
	// Shortuct functions
	jAlert = function(message, title, callback) {
		$.alerts.alert(message, title, callback);
	}
	
	jConfirm = function(message, title, callback) {
		$.alerts.confirm(message, title, callback);
	};
		
	jPrompt = function(message, value, title, callback) {
		$.alerts.prompt(message, value, title, callback);
	};
	
	jHoliPrompt = function(message, code, value, title, callback) {
		$.alerts.hprompt(message, code, value, title, callback);
	};
	
	jPromptB = function(message, code, value, title, callback) {
		$.alerts.promptb(message, code, value, title, callback);
	};
	
	
})(jQuery);