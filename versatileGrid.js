/**
 * Versatile Grid
 *
 * @author	Jose Pinilla <pinillajose@gmail.com>
 * @created July, 2013
 * @version	1.0
 */
(function($) {
 
	var methods = {
		init: function(options) {
 
			// Repeat over each element in selector
			return this.each(function() {
				var cObj = $(this);
 
				// Attempt to grab saved settings, if they don't exist we'll get "undefined".
				var settings = cObj.data('versatileGrid');
 
				// If we could't grab settings, create them from defaults and passed options
				if(typeof(settings) == 'undefined') {
 
					var defaults = {
						title: "Table Name",
						theme: "gray",
						colswidth: [],
						limits: ["10","20","30"],
						defaultLimit: 10,
						url: "",
						onloadData: false,
						checkbox:false,
						toolbar:false,
						errorMsg: 'Sorry, there was a problem getting the data.',
						notFoundMsg: 'Sorry, The server script was not found.',
					}
					
					var privateVgConf = {
						thPos:0,
						wider:0,
						timesLoaded:0,
						thArr:[]
					}
 
					settings = $.extend({}, defaults, options, privateVgConf);
 
					// Save our newly created settings
					cObj.data('versatileGrid', settings);
				} else {
					// We got settings, merge our passed options in with them
					settings = $.extend({}, settings, options);
				}
 
				// run code here
				
				
				//Static Data Grid
				if(settings.url == ""){

						var cObj = $(this);
						
						var headerAlone = settings.toolbar == false ? 'vg-h-alone' : '';
						var vgTitle = cObj.attr("data-title") ? cObj.attr("data-title") : settings.title;
						var vgTheme = cObj.attr("data-theme") ? cObj.attr("data-theme") : settings.theme;
						var vgClWth = cObj.attr("data-colswidth") ? cObj.attr("data-colswidth").split(',') : settings.colswidth;

						//Wrap with vgrid div
						cObj.wrap('<div class="vgrid vg-'+vgTheme+'" />');
						$('<div class="vg-header '+headerAlone+'">'+vgTitle+'</div>').insertBefore(cObj);
						
						//Add th Class
						cObj.find("thead tr:first-child").addClass("vg-d-titles");
						
						//Wrap td data
						cObj.find("td").wrapInner('<div class="vg-data" />');
						
						//Get th labels
						cObj.append($('<span class="tmpSpan"/>'));
						cObj.find("tr th").each(function(){
							settings.thArr[settings.thPos] = $(this).html();
							var thWidth = cObj.find(".tmpSpan").empty().html(settings.thArr[settings.thPos].replace(" ", "_")).width();
							settings.wider = settings.wider < thWidth ? thWidth : settings.wider;
							
							if(typeof vgClWth != 'undefined'){
								if(typeof vgClWth[settings.thPos] != 'undefined'){
									$(this).width(vgClWth[settings.thPos]);
								}
							}
							settings.thPos++;
						});
						cObj.find(".tmpSpan").remove();
						
						//Create td mobile labels
						var tdPos = 0;
						cObj.find("tr td").each(function(){
							$(this).prepend('<div class="vg-m-title" style="width:'+settings.wider+'px">'+settings.thArr[tdPos]+'</div>');
							tdPos = tdPos == (settings.thArr.length-1) ? 0 : tdPos+1;
						});
						
						cObj.data('versatileGrid', settings);
					
				//Load Dynamic Data	
				}else{
				
					var cObj = $(this);
					
					if(typeof cObj.attr("data-vg-tdl") != "undefined"){
						cObj.attr("data-vg-tdl", 0);
					}
					
					var headerAlone = settings.toolbar == false ? 'vg-h-alone' : '';
					var vgTitle = cObj.attr("data-title") ? cObj.attr("data-title") : settings.title;
					var vgTheme = cObj.attr("data-theme") ? cObj.attr("data-theme") : settings.theme;
					
					
					//Wrap with vgrid div
					cObj.wrap('<div class="vgrid vg-'+vgTheme+'" />');
					$('<div class="vg-header '+headerAlone+'">'+vgTitle+'</div>').insertBefore(cObj);
					
					if(settings.toolbar != false){
						var toolbar = $('<div class="vg-toolbar" />');	
						
						$.each(settings.toolbar, function(index, tool) {
							if(typeof tool.type != 'undefined'){
								
								if(tool.type == 'button'){
									var a = $('<a class="btn btn-small"/>').html('<i class="'+tool.icon+'"></i> <span class="hidden-phone">'+tool.name+"</span>");
									if(typeof tool.click != 'undefined'){
										a.on("click", {tableObj: cObj}, tool.click);
									}
									toolbar.append(a);
								}
								
							}
						})
						
						toolbar.insertBefore(cObj);
					}
					
					//Add th Class
					cObj.find("thead tr:first-child").addClass("vg-d-titles");
					
					//Get data
					loadData(cObj, 1, settings.defaultLimit, settings);
				}				
 
			});
		},
		getSelectedRows: function(){
			var cObj = $(this);
			var count = 0, ids = new Array();
			cObj.find("tbody input[type='checkbox']:checked:visible").each(function(){
				ids[count] = $(this).val();
				count++;
			});
			return ids;			
		},
		refreshGrid: function(options) {
			var cObj = $(this);
			var page = 1;
			var settings = cObj.data('versatileGrid');
			loadData(cObj, page, settings.limits[0], settings);
		},
		destroy: function(options) {
			return $(this).each(function() {
				var $this = $(this);
				$this.removeData('versatileGrid');
			});
		}
	};
	
	//
	//Private vGrid Functions
	//
	
	function loadData(cObj, cpage, climit, settings){
	
		$.ajax({
			url: settings.url,
			type: "POST",
			data: {page : cpage, rows:climit},
			dataType: "json",
			beforeSend: function ( xhr ) {
				if(cObj.parent().find(".vg-footer").length > 0){
					cObj.find("tbody tr").css("opacity", "0.4");
					cObj.parent().find(".vg-status-bar").html('<i class="icon-spinner icon-spin"></i>');
				}
			},				
			statusCode: {
				404: function() {
					if(cObj.find("tbody .alert-error").length <= 0){
						var rowLength = cObj.find("thead tr th").length;				
						cObj.find("tbody").prepend("<tr><td colspan='"+rowLength+"'><div class='alert alert-error' style='margin-bottom:2px;'>"+settings.notFoundMsg+"</div></td></tr>");
					}
				}
			}				
		})
		.done(function() { })
		.fail(function() { 
			if(cObj.find("tbody .alert-error").length <= 0){
				var rowLength = cObj.find("thead tr th").length;				
				cObj.find("tbody").prepend("<tr><td colspan='"+rowLength+"'><div class='alert alert-error' style='margin-bottom:2px;'>"+settings.errorMsg+"</div></td></tr>");
			}
			cObj.parent().find(".vg-status-bar").html('<span class="vg-text">No Data</span>');
		})
		.always(function(rsp) { 
		
			if(rsp.records > 0){
			
				var vgClWth = cObj.attr("data-colswidth") ? cObj.attr("data-colswidth").split(',') : settings.colswidth;
				var rowActionFlag = 0;
				
				var row = "";
				$.each(rsp.rows, function(index, value) {
					row += "<tr data-rid='"+value["id"]+"' >";
					$.each(value["data"], function(i, v) {
						row += "<td>"+v+"</td>";
					});
					row += "</tr>";
					
					if(typeof rsp.rows[index]["rowActions"] != "undefined"){
						rowActionFlag++;
					}
				});

				var tdMobileClass = rowActionFlag > 0 ? "td-mob-fc" : "vg-tdmobile-footer";
				cObj.find("tbody").html(row);
				
				//Wrap td data
				cObj.find("td").wrapInner('<div class="vg-data" />');
				
				if(settings.timesLoaded == 0){
					//Get th labels
					if(settings.thPos == 0){
						cObj.append($('<span class="tmpSpan"/>'));
						cObj.find("tr th:not('.vg-d-chk')").each(function(){
						
							settings.thArr[settings.thPos] = $(this).html();							
							var thWidth = cObj.find(".tmpSpan").empty().html(settings.thArr[settings.thPos].replace(" ", "_")).width();
							settings.wider = settings.wider < thWidth ? thWidth : settings.wider;
							
							if(typeof settings.colswidth[settings.thPos] != 'undefined'){
								$(this).width(settings.colswidth[settings.thPos]);
							}
							settings.thPos++;
						});
						cObj.find(".tmpSpan").remove();
					}
					
					//Add main checkbox to thead
					if(settings.checkbox == true && cObj.find('th.vg-d-chk').length <= 0){
						var ths = $('<th class="vg-d-chk" style="width:30px;" />')
						var chk = $('<input type="checkbox">').on('click', {tableObj: cObj}, selectAllChk);
						ths.append(chk);
						cObj.find("thead tr").prepend(ths);
						cObj.find("thead tr").append('<th class="'+tdMobileClass+'"></th>');
					}else if(rowActionFlag > 0){
						cObj.find("thead tr").append('<th class="'+tdMobileClass+'"></th>');
					}
				}
				
				//Create td mobile labels
				var tdPos = 0;
				cObj.find("tr td:not('.vg-d-chk')").each(function(){
					$(this).prepend('<div class="vg-m-title" style="width:'+settings.wider+'px">'+settings.thArr[tdPos]+'</div>');
					tdPos = tdPos == (settings.thArr.length-1) ? 0 : tdPos+1;
				});
				
				//Add checkboxes to tbody
				if(settings.checkbox == true){
					var tds = $('<td class="vg-d-chk"/>')
					var chk = $('<input type="checkbox" />').on('change', selectThisRow);
					tds.append(chk);					
					cObj.find("tbody tr").prepend(tds);
					
					var tdMob = $('<td class="'+tdMobileClass+'"/>');
					var chkWrap = $('<div class="vg-m-chk" />');
					var chk2 = $('<input type="checkbox" />').on('change', selectThisRow);
					chkWrap.append(chk2);					
					tdMob.append(chkWrap);

					cObj.find("tbody tr").append(tdMob);						
					cObj.find("tbody tr td:nth-child(2)").addClass("vg-rcorner");
				}
				
				
				cObj.find("tbody tr").each(function(trI, rv){
					var cTr = $(this);
					var rId = cTr.attr("data-rid");
					if(typeof rsp.rows[trI]["rowActions"] != "undefined"){
					
						if(cTr.find('.'+tdMobileClass).length > 0){
							var tdMob = cTr.find('.'+tdMobileClass);
							var tmFlag = 1;
						}else{
							var tdMob = $('<td class="'+tdMobileClass+'"/>');
							var tmFlag = 0;
						}
						
						var iconsCover = $('<div class="vg-icons" />');
						$.each(rsp.rows[trI]["rowActions"], function(i, v) {
							var cIcon = $('<a />').on("click", {rowId: rId}, window[v["function"]]);
							cIcon.html('<i class="'+v["icon"]+'"></i>');
							iconsCover.append(cIcon);
						});
						tdMob.append(iconsCover);
						if(tmFlag == 0){
							cTr.append(tdMob);
						}
						
					}
				});

				//Create Footer first time
				if(cObj.parent().find(".vg-footer").length <= 0){
					
					//Section warp in footer
					var fbox1 = $('<div class="vg-fbox" />');
				
					//Create text input for current page
					var currpage = $('<input class="currpage" type="text" />').val(rsp.page).on("keyup", {currpage:true, tableObj: cObj, stt:settings}, goPage)
					
					//Create refresh button
					var refresh = $('<a class="vg-refresh vg-active"/>').html('<i class="icon-refresh"></i>').on("click", {page: (rsp.page), tableObj: cObj, stt:settings}, goPage);

					//Create forward button
					if(rsp.page < rsp.total){
						var frdStep = $('<a class="vg-frdStep vg-active"/>').html('<i class="icon-caret-right"></i>').on("click", {page: (rsp.page+1), tableObj: cObj, stt:settings}, goPage);
					}else{
						var frdStep = $('<a class="vg-frdStep vg-disabled"/>').html('<i class="icon-caret-right"></i>');
					}				
					
					//Create back button
					if(rsp.page > 1){
						var backStep = $('<a class="vg-backStep vg-active"/>').html('<i class="icon-caret-left"></i>').on("click", {page: (rsp.page-1), tableObj: cObj, stt:settings}, goPage);
					}else{
						var backStep = $('<a class="vg-backStep vg-disabled"/>').html('<i class="icon-caret-left"></i>');
					}							

					//Add stuffs to wrap fbox1
					fbox1.append(backStep);
					fbox1.append('<span class="vg-text">Page</span>');						
					fbox1.append(currpage);
					fbox1.append('<span class="vg-text vg-total">of '+rsp.total+'</span>');						
					fbox1.append(frdStep);						
					fbox1.append(refresh);
					
					//Create footer div
					vgFooter = $('<div class="vg-footer"/>');
					
					var tmpOs = (settings.defaultLimit*rsp.page) - settings.defaultLimit ;
					var offset = tmpOs + 1;
					var rowLimit = tmpOs + rsp.rows.length;
					
					//Append to footer
					vgFooter.append(fbox1);
					vgFooter.append('<div class="vg-sep"><span></span></div>');
					vgFooter.append('<div class="vg-status-bar"><span  class="vg-text">'+offset+"-"+rowLimit+' of '+rsp.records+'</span><span class="vg-text records">records</span></div>');
					
					//Create Limits Dropdown
					var fbox2 = $('<div class="pull-right limits">');
					var selectLimit = $('<select id="vg-limits-opts"/>');
					
					$.each(settings.limits, function(i, v) {
						var s = v == settings.defaultLimit ? 'selected="selected"' : '';
						selectLimit.append("<option "+s+">"+v+"</td>");
					});
					
					selectLimit.on("change", {limitChange:true, tableObj: cObj, stt:settings}, goPage);
					fbox2.append(selectLimit);
					
					vgFooter.append(fbox2);						
					
					//Append footer to vgrid
					vgFooter.insertAfter(cObj);
					
				//Footer container already exits -> Update values
				}else{ 
					
					cObj.parent().find(".currpage").val(rsp.page).unbind('click').on("keyup", {currpage:true, tableObj: cObj, stt:settings}, goPage);
					cObj.parent().find(".vg-refresh").unbind('click').unbind('click').on("click", {page: (rsp.page), tableObj: cObj, stt:settings}, goPage);
					cObj.parent().find(".vg-total").html(rsp.total);
					
					//Update forward button
					if(rsp.page < rsp.total){
						var frdStep = cObj.parent().find(".vg-frdStep").removeClass("vg-disabled").addClass("vg-active").unbind('click').on("click", {page: (rsp.page+1), tableObj: cObj, stt:settings}, goPage);
					}else{
						var frdStep = cObj.parent().find(".vg-frdStep").removeClass("vg-active").addClass("vg-disabled").unbind('click');
					}		
					
					//Update back button
					if(rsp.page > 1){
						cObj.parent().find('.vg-backStep').removeClass("vg-disabled").addClass("vg-active").unbind('click').on("click", {page: (rsp.page-1), tableObj: cObj, stt:settings}, goPage);
					}else{
						cObj.parent().find('.vg-backStep').removeClass("vg-active").addClass("vg-disabled").unbind('click');
					}
					
					var tmpOs = (settings.defaultLimit*rsp.page) - settings.defaultLimit ;
					var offset = tmpOs + 1;
					var rowLimit = tmpOs + rsp.rows.length;					
					
					cObj.parent().find(".vg-status-bar").html('<span  class="vg-text">'+offset+"-"+rowLimit+' of '+rsp.records+'</span><span class="vg-text records">records</span>');
				}
			}
			
			//Scroll to grid header if mobile
			if(settings.timesLoaded > 0){
				if($(window).width() <= 748){
					$('html, body').animate({
						scrollTop: cObj.parent().offset().top
					}, 500);
				}
			}			
			
			cObj.find("tbody tr").css("opacity", "1");
			settings.timesLoaded++;
			cObj.data('versatileGrid', settings);
		});
	}	
	
	function goPage(e){
		e.preventDefault(); // Prevent link from following its href
		e.stopPropagation();
		
		var page = e.data.page;
		var settings = e.data.stt;
		var currLimit = settings.defaultLimit;
		
		if(typeof e.data.currpage != 'undefined'){
			if(e.keyCode == 13){
				page = e.data.tableObj.parent().find(".currpage").val(); 
			}else{
				return false;
			}				
		}
		
		if(typeof e.data.limitChange != 'undefined'){
			currLimit = e.data.tableObj.parent().find("#vg-limits-opts").val();
			page = e.data.tableObj.parent().find(".currpage").val();
			settings.defaultLimit = currLimit;
		}
		
		loadData(e.data.tableObj, page, currLimit, settings);
	}
	
	function selectThisRow(e){
		e.preventDefault();
		e.stopPropagation();

		var closestTr = $(this).closest('tr');
		var trId = closestTr.attr("data-rid");
		
		if($(this).is(':checked')){
			$(this).val(trId);
			closestTr
				.addClass("vg-row-selected")
				.find("input[type='checkbox']:not(:checked)").val(trId).prop("checked", true);
		}else{
			closestTr
				.removeClass("vg-row-selected")
				.find("input[type='checkbox']:checked").val(trId).prop("checked", false);
		}
	}
	
	function selectAllChk(e){

		var mainCheckBox = $(this);
		
		e.data.tableObj.find("input[type='checkbox']").each(function(){
			
			var closestTr = $(this).closest('tr');
			var trId = closestTr.attr("data-rid");
			
			if(mainCheckBox.is(':checked')){
				$(this).val(trId);
				closestTr
					.addClass("vg-row-selected")
					.find("input[type='checkbox']:not(:checked)").val(trId).prop("checked", true);
			}else{
				closestTr
					.removeClass("vg-row-selected")
					.find("input[type='checkbox']:checked").val(trId).prop("checked", false);
			}
		});
	}	
 
	$.fn.versatileGrid = function() {
		var method = arguments[0];
		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if( typeof(method) == 'object' || !method ) {
			method = methods.init;
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.versatileGrid' );
			return this;
		}
		return method.apply(this, arguments);
	}
})(jQuery);