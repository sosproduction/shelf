/* Jquery Shelf */
/* (c) Copyright 2012 - South of Sleep Productions - Stacey Nicole Yates */
 
var slideMenu = function(options){

	// Default values
	var defaults = {
		div: "#menu-container",
		controls: "#menu-controls",
		loader: false,
		x: 150,
		y: 150,
		start: 0,
		speed: 300,
		delay: 60,
		easing: '',
		easeIn: '',
		preloadAll: false
	};
	
	var o = options || {};
	
	for (var opt in defaults) o[opt] = (opt in o) ? o[opt] : defaults[opt];

	// In case someone types in an easing name wrong
	if (! jQuery.easing.hasOwnProperty(o.easing) && o.easing != '') o.easing = "easeOutBounce";
	if (! jQuery.easing.hasOwnProperty(o.easeIn) && o.easeIn != '') o.easeIn = "easeOutBack";
	
	// In case easing plugin is missing
	if (! jQuery.easing.hasOwnProperty("easeOutBounce")) o.easing = o.easeIn = '';
	
	var v = {
		middle: jQuery(document).width() / 2,
		active: o.start,
		c_w: jQuery(o.div).width(),
		c_o: jQuery(o.div).offset(),
		count: 0,
		x: 0,
		s_l: jQuery(o.div + " ul:eq(" + o.start + ") li").length,
		animating: false,
		loading: {},
		loop_started: false
	};
	

	this.switchTo = function(to){
		do_animate(to, v.active);
	}
	
	function do_animate(to, from){
		if (from < to) out_left(from, to);
		if (from > to) out_right(from, to);
		v.active = to;
		highlight_active();
	}
	
	function in_left(id, go){
		if (go == false) return;
		v.count = jQuery(o.div + " ul:eq(" + id + ") li").length;
		if (v.count > 0){
			if (jQuery(o.div + " ul:eq(" + id + ") li:eq(0)").offset().left > v.middle){
				// Move to left side first if isn't there
				jQuery(o.div + " ul:eq(" + id + ") li").css("left", "-" + (v.c_w + o.x) + "px");
			}
			jQuery(o.div + " ul:eq(" + id + ") li").each(function(index){
				v.x = (v.c_w / 2) + ((v.count / 2) * o.x) - (o.x * index);
				jQuery(o.div + " ul:eq(" + id + ") li:eq(" + (v.count - index - 1) + ")").delay((index + 2) * o.delay).animate({left: "+=" + v.x}, o.speed, o.easing, function(){
					if (index + 1 == v.count) v.animating = false;
				});
			});
		}
	}
  
	function in_right(id, go){
		if (go == false) return;
		v.count = jQuery(o.div + " ul:eq(" + id + ") li").length;
		if (v.count > 0){
			if (jQuery(o.div + " ul:eq(" + id + ") li:eq(0)").offset().left < v.middle){
				// Move to right side first if isn't there
				jQuery(o.div + " ul:eq(" + id + ") li").css("left", "0");
			}
			jQuery(o.div + " ul:eq(" + id + ") li").each(function(index){
				v.x = (v.c_w / 2) + ((v.count / 2) * o.x) - (o.x * index);
				jQuery(this).delay((index + 1) * o.delay).animate({left: "-=" + v.x}, o.speed, o.easing, function(){
					if (index + 1 == v.count) v.animating = false;
				});
			});
		}
	}
	
	function out_left(id, to){
		v.animating = true;
		v.count = jQuery(o.div + " ul:eq(" + id + ") li").length;
		if (v.count > 0){
			jQuery(o.div + " ul:eq(" + id + ") li").each(function(index){
				v.x = jQuery(this).offset().left - v.c_o.left + o.x;
				var last = (index + 1 == v.count) ? true : false;
				jQuery(this).delay((index + 1) * o.delay).animate({left: "-=" + v.x}, o.speed, function(){in_right(to, last);});
			});
		}
		else{
			in_right(to, true);
		}
	}
  
	function out_right(id, to){
		v.animating = true;
		v.count = jQuery(o.div + " ul:eq(" + id + ") li").length;
		if (v.count > 0){
			jQuery(o.div + " ul:eq(" + id + ") li").each(function(index){
				v.x = v.c_w - jQuery(this).offset().left + v.c_o.left;
				var last = (index + 1 == v.count) ? true : false;
				jQuery(this).delay((v.count - index) * o.delay).animate({left: "+=" + v.x}, o.speed, function(){in_left(to, last);});
			});
		}
		else{
			in_left(to, true);
		}
	}
	
	// Move first list to top center and add load handlers to first set of images
	jQuery(o.div + " ul:eq(" + o.start + ") li").animate({left: "-=" + ((v.c_w / 2) + (o.x / 2)) + "px", top: -o.y}, 0);
	
	// Image load check
	var img_load = o.preloadAll == false ? o.div + " ul:eq(" + o.start + ") img" : o.div + " img";
	jQuery(img_load).each(function(index){
		v.loading[index] = true;
		v.loop_started = true;
		jQuery(this).load(function(){
			delete v.loading[index];
		});
		if (this.complete) jQuery(this).trigger("load");
		// http://stackoverflow.com/questions/2392410/jquery-loading-images-with-complete-callback/2392448#2392448
	});
	
	// If first set of images is loaded, animate it in
	function try_animate_in(index){
		var count = 0;
		for (e in v.loading){count++;}
		if( v.loop_started == true && count == 0){
			clearInterval(try_start);
			// Hide loader
			if (o.loader != false && o.loader != '') jQuery(o.loader).hide();
			// Animate in
			jQuery(o.div + " ul:eq(" + o.start + ") li").each(function(index){
				v.x = (o.x / 2) + ((v.s_l / 2) * o.x) - (o.x * (index + 1));

				jQuery(this).delay(o.delay).animate({left: "-=" + v.x, top: 0}, o.speed, o.easeIn);
			});
		}
	}
	
	
	// Highlight active menu button
	function highlight_active(){
		jQuery(o.controls + " a.active").removeClass("active");
		jQuery(o.controls + " a:eq(" + v.active + ")").addClass("active");
	}
	
	// Handle menu clicks
	jQuery(o.controls + " a").click(function(e){
		e.preventDefault();
		if (v.animating == false){
			do_animate(jQuery(this).data("target"), v.active);
		}
	});
	
	// Update values in case of resize
	window.onresize = function() {
		v.middle = jQuery(document).width() / 2,
		v.c_o = jQuery(o.div).offset();
	}
	
	// Keep checking until first set of images is laoded
	var try_start = setInterval(try_animate_in, 50);
}