$(function(){
	$(window).load(function(){		
		gnb_resize();
	});
	
	$(window).resize(function(){
		gnb_resize(); 
	});
			
	/* 1depth 메뉴 hover */
	$(".gnb_top .one_menu, .gnb_bottom").hover(function(){
		$(".gnb_bottom").css({"margin-top":0, "opacity":"1"});
	}, function(){
		two_depth_hide();
	});

	/* ··· 클릭 */
	$(".gnb .more_box_btn").click(function(){
		$(".gnb .more_box_wrap").toggleClass("show");
		more_box_margin_line();
	});
	
	/* ··· 닫기 */
	$("body").click(function(e) {
		if ($('.gnb .more_box_wrap').css('display') == 'block') {
			if (!$('.gnb .more_box_wrap, .more_box_btn').has(e.target).length) {
        		$('.gnb .more_box_wrap').removeClass("show");
        	}
        }
	});
	
	// 화면사이즈 변경되어도 각 항목 사이즈 자동 변경되지 않도록 고정, header.css에 width, height 추가
	//$(".gnb_bottom .two_menu_wrap").css("min-height", $(".gnb_bottom").height());

	
	/* 폰트 사이즈 조절 */
	$(".font_resize_wrap span").click(function(){
		var idx = $(this).index();
		var fs = parseInt($("body").css("font-size").replace("px", ""));
		
		switch(idx){
		case 0:
			if(fs < 20){
				$("body").css("font-size", fs + 1);
				/*setTimeout(function(){
					two_depth_hide();
				}, 0.3*1000);
*/				more_box_margin_line();
			} else {
				alert("최대 크기입니다.");
			}
			break;
		case 1:
			if(fs > 10)
				$("body").css("font-size", fs - 1);
			else
				alert("최소 크기입니다.");
			break;
		}
		more_box_margin_line();
	});
	
	/* 3depth hover */
	$(".gnb_bottom .three_menu").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});
	
	// header.js 모바일 햄버거 버튼 제거
	/* 모바일 GNB 햄버거 버튼 클릭*/
	/*
	$(".m_gnb_box .nav_btn").click(function(){
		$(".m_gnb_box .m_gnb").toggleClass('show');
		$("header .m_gnb_box .background").addClass('show');
	});
	*/
	/* 하위메뉴가 있는 애들에게 + 표시 추가 */
	$(".m_gnb_box .m_gnb nav ul li .one_wrap").each(function(){
		if($(this).next().attr('class') == 'two'){
			$(this).addClass('parent');		
		}
	});
	$(".m_gnb_box .two .two_wrap").each(function(){
		if($(this).next().attr('class') == 'three'){
			$(this).addClass('parent');		
		}
	});
	
	/* 1depth */
	$(".one_wrap").click(function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$(this).next().removeClass('show');
			$(this).next().find('.two_wrap').removeClass('open');
			$(this).next().find('.three').removeClass('show');
		} else {
			$(".one_wrap").removeClass('open');
			$(".one_wrap").next().removeClass('show');
			$(".one_wrap").next().find('.two_wrap').removeClass('open');
			$(".one_wrap").next().find('.three').removeClass('show');
			$(this).addClass('open');
			$(this).next().addClass('show');
		}
	});
	
	/* 2depth */
	$(".two_wrap").click(function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$(this).next().removeClass('show');
		} else {
			$(".two_wrap").removeClass('open');
			$(this).addClass('open');
			$(".two_wrap").next().removeClass('show');
			$(this).next().addClass('show');
		}
	});
	
	// header.js GNB 닫기 버튼 제거
	/* 모바일 GNB 닫기 버튼*/
	/*
	$(".m_gnb .close_btn").click(function(){
		$(".m_gnb").removeClass('show');
		$("header .m_gnb_box .background").removeClass('show');
	});
	*/

	/*$(".more_wrap").css("height", $(".more_box_wrap").height());*/
});


function gnb_resize(){
	// .gnb, .gnb_top 사이즈 동적 변경부분 주석처리 
	//$(".gnb_top .prj_select_box").width("calc(" + (100 - ($(".gnb .one_menu").length * 10)) +"% - (" + (301 + $(".gnb .font_resize_wrap").outerWidth() + $(".gnb .more_box_btn").outerWidth()) +"px))");
}
function two_depth_hide(){
	$(".gnb_bottom").css({"margin-top":-$(".gnb_bottom").outerHeight(), "opacity":"0"});
}


/* 1depth 메뉴 선택 */
function one_selected(idx){
	/*
	$(".one_depth > li").eq(idx).find(".one_menu").addClass("selected");
	$(".one_depth > li").eq(idx).find(".two_depth").addClass("show");
	*/
}
function more_box_margin_line (){
	if($(".gnb .more_wrap").eq(0).height() > $(".gnb .more_wrap").eq(1).height()){ 
		$(".gnb .more_wrap").eq(0).css("border-right","1px solid #ddd");
	}else{
		$(".gnb .more_wrap").eq(0).css("border-right","0px solid #ddd");
		$(".gnb .more_wrap").eq(1).css("border-left","1px solid #ddd");
	}
}

