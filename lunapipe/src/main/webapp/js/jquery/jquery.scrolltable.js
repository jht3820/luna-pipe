/**
* jQuery Scroll Table
*
* @fileoverview 
* @link https://github.com/th3uiguy/jquery-scrolltable
* @author Spencer Neese
* @version 0.5.2
* @requires jQuery UI 1.7+ and jQuery 1.3.2+
* @license jQuery Scroll Table Plug-in
*
* Copyright 2012, Spencer Neese
* Dual licensed under the MIT or GPL Version 2 licenses.
* <https://raw.github.com/th3uiguy/jquery-scrolltable/master/GPL-LICENSE.txt>
* <https://raw.github.com/th3uiguy/jquery-scrolltable/master/MIT-LICENSE.txt>
*/

(function($) {
$.widget( "ui.scrolltable", {

	options: {
		height: 'auto',
		maxHeight: 300,
		stripe: false,
		setWidths: true,
		oddClass: "st-tr-odd",
		evenClass: "st-tr-even",
		firstClass: "st-tr-first",
		lastClass: "st-tr-last"
	},

	_create: function(){
		var self = this;
		var $self = $(this.element);
		var opts = this.options;
		
		this._convertTable($self);

		if(opts.stripe === true) this._stripe($self);

		var padding = $self.outerWidth() - $self.find('.st-body-table').outerWidth();
		/*$self.find('.st-head').css('padding-right', padding + 'px');*/
	},

	destroy: function(){
		var self = this;
		var $self = $(this.element);

		$self.removeClass('st-container')
			.find('>thead').replaceWith($self.find('.st-head-table>thead')).end()
			.find('>tbody').replaceWith($self.find('.st-body-table>tbody')).end()
			.find('.st-head').closest('tr').remove().end()
			.find('.st-body').closest('tr').remove();

		$self.find('>thead th, >thead td')
			.each(function(){
				$(this).prop('colspan', $(this).data('colspan'));
			})
			.add($self.find('>tbody>tr').eq(0).find('td')).width(function(){
				return $(this).data('prevWidth') || 'auto';
			});

		var opts = this.options;
		$self.find('tr')
			.removeClass(opts.oddClass)
			.removeClass(opts.evenClass)
			.removeClass(opts.firstClass)
			.removeClass(opts.lastClass);

		$.Widget.prototype.destroy.call(self);
	},

	_convertTable: function($container){
		var opts = this.options;

		if(opts.setWidths) this._setWidths($container);
		var $head = $('<table class="st-head-table" cellpadding="0" cellspacing="0" border="0" />').append($container.find('>thead')).css('width', '100%');
		var $body = $('<table class="st-body-table" cellpadding="0" cellspacing="0" border="0" />').append($container.find('>tbody')).css('width', '100%');

		$container
			.addClass('st-container')
			.html('<thead><tr><td class="st-head"></td></tr></thead><tbody><tr><td class="st-body"><div class="st-body-scroll"></div></td></tr></tbody>')
			.find('.st-head').css('padding', '0 20px 0 0').append($head).end()
			.find('.st-body').css('padding', '0')
			.find('.st-body-scroll').css('overflow-y', 'auto').append($body)
			.find('tr')
				.first().addClass(opts.firstClass).end()
				.last().addClass(opts.lastClass);
		if(isFinite(opts.height)){
			$container.find('.st-body-scroll').css('height', opts.height + "px");
		}
		else if(isFinite(opts.maxHeight)){
			$container.find('.st-body-scroll').css('max-height', opts.maxHeight + "px");
		}

		$container.find('.st-head thead th, .st-head thead td').each(function(){
			$(this).data('colspan', $(this).prop('colspan')).removeProp('colspan');
		});
	},

	_stripe: function($container){
		var opts = this.options;
		$container.find('.st-body-scroll>table>tbody>tr')
			.filter(':odd').addClass(opts.oddClass).end()
			.filter(':even').addClass(opts.evenClass);
	},

	_setWidths: function($container){
		var total = 100;
		var totalWidth = 0;
		var $headCols = $container.find('thead th, thead td');
		var $bodyCols = $container.find('tbody tr').eq(0).find('td');
		var colCount = $headCols.size();
		var $col, width, stop = colCount - 1;
		for(var i = 0; i < stop; i++){
			$col = $headCols.eq(i);
			width = $col.prop('width') || $col[0].style.width;
			$col.data('prevWidth', width);
			if(typeof width === "string" && width.length === 0){
				width = Math.floor($col.width()/$container.width()*100) + "%";
			}
			$col.css('width', width);
			$bodyCols.eq(i).css('width', width);
			totalWidth += parseFloat(width);
			total -= parseFloat(width);
		}
		$col = $headCols.eq(stop);
		width = $col.prop('width') || $col[0].style.width;
		$col.data('prevWidth', width);
		if(typeof width === "string" && width.length === 0){
			width = total + "%";
		}
		$headCols.eq(stop).css('width', width);
		$bodyCols.eq(stop).css('width', width);
	}

});
})(jQuery);
