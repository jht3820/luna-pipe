$(function(){
	var windowOuterWidth = null;
	
	$(window).load(function(){
		windowOuterWidth = window.outerWidth - 12;
	});	

	/* 가로 스크롤 이동 시 좌측메뉴 배경 조절 */
	$(window).scroll(function(e){
		var scrollLeft = $(window).scrollLeft();
		if(scrollLeft > 0){
			$("#asideBgDiv").css({"left": "-"+scrollLeft+"px"});
		}
	});
	
	/* 창 크기 조절 */
	$(window).resize(function(){
		//dlHeight();
		//mMainContentsHeight();
		
		windowOuterWidth = window.outerWidth - 12;
		
		if(windowOuterWidth < 1500){
			$("aside").removeClass("hide");
			$(".aside_toggle_btn").removeClass("pop");
		} else {
			$(".main_contents").removeClass("fill");
		}
	});
	
	
	/* aside 넣고 빼기 */
	$(".aside_toggle_btn").click(function() {		
		$("aside").toggleClass("hide");
		$(this).toggleClass("pop");
		$(".main_contents").toggleClass("fill");
	});
	
	// dl dt 를 클릭하면
	$("aside dl dt").click(function(){
		$(this).toggleClass("selected");		
		if($(this).hasClass("selected")){
			$(this).next("dd").slideDown(300);
			
		} else {
			$(this).next("dd").slideUp(300);
		}
		/*setTimeout(function(){
			if($('aside').height()>$('.main_contents').height()){
				$('footer').css('bottom',1000-($('aside').position().top+$('aside').height()+1));
			}
		},300);*/


		
	// 롤오버효과를 내기위해 mouseover 와 mouseout 이벤트를 설정합니다.
	}).mouseover(function(){
		// dt 에 마우스가 올라가면 over 클래스를 추가하고
		$(this).addClass("over");

	// dt 에 마우스가 나가면 over 클래스를 삭제합니다.
	}).mouseout(function(){
		$(this).removeClass("over");
	});
		
	/* 모바일 aside 버튼 */
	/* aside.js 모바일 aside 버튼 제거
	$("aside .m_btn").click(function(){
		// 펴질 때
		$("body").css('overflow-y','hidden');
		
		$("aside").addClass('unfold');
	});
	*/	
	$("aside .aside_close_btn").click(function(){
		/* 접힐 때 */
		$("body").css('overflow-y','auto');

		$("aside").removeClass('unfold');
	});
	
	/* 전체 열기/닫기 */
	$("aside dl dt.option span").click(function(){
		
		var type = $(this).attr('data');
		switch(type){
		case 'open' :
			$("aside dl dt.menu").addClass("selected");
			$("aside dl dd").each(function(){
				$(this).slideDown(150);
			});
			break;
		case 'close' :
			$("aside dl dt.menu").removeClass("selected");
			$("aside dl dd").slideUp(150);
			break;
		}
		/*setTimeout(function(){
			var maxheight=0;
			if($('aside').height()>$('.main_contents').height()){
				maxheight=$('aside').height();
			}else{
				maxheight=$('.main_contents').height();
			}
				$('footer').css('top',maxheight+60);
		}, 200);*/
		
	});
	
	/*function dlHeight(){
		if(windowOuterWidth < 875){
			$("aside dl").height('100%');
		} else {
			if(($(window).height() - ($("header").height() + $("footer").height())) > $(".main_contents").outerHeight()){
				$("aside dl").height($(window).height() - ($("header").height() + $("footer").height() + $("aside .title_wrap").height()));
			} else {
				$("aside dl").height($(".main_contents").outerHeight());
			}
		}
		
	}/*
	
	function mMainContentsHeight(){
		if(windowOuterWidth < 1500){
			$(".main_contents").innerHeight($(window).height() - ($("header").height() + $("footer").outerHeight(true)))
		} else {
			$(".main_contents").innerHeight("auto");
		}
	}
	*/
});


/* aside 높이 조절 */
$(window).load(function(){
	$('section').css('min-height',$('body').height());//$(document).height()-$('header').height()-40
	$('aside').css('min-height',$('section').height());
});
$(window).resize(function(){
		$('section').css('min-height',$('body').height()-100);
		$('aside').css('min-height',$('section').height());
});
