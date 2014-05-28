;(function ( $, window, document, undefined ) {

    var pluginName = "sidebarWidget",
        defaults = {
            wrapperClass: "sidebarWrapper",
            childToggleClass: "child-toggle",
            backClass:"back"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = $(element);
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function() {
        	this.wrapper = this._generateWrapper();
        	this.pushContainer = this._getPushContainer();

        	this._setPosition();
        	this._addBackLinks();
        	this._createEvents();
        },
        resetPosition: function() {
        	this._setPosition();
        },
        toggleSidebar: function() {
        	if(this.element.hasClass("open"))
        		this.closeSidebar();
        	else
        		this.openSidebar();
        },
        openSidebar: function() {
        	this.element.addClass("open");
            this._setPosition();
        },
        closeSidebar: function() {
        	this.element.removeClass("open");
            this._setPosition();
        },
        openListItem:function(li){
        	li.addClass('open');
        	li.parent("ul").addClass("child-open");
        },
        closeListItem:function(li){
        	li.removeClass('open');
        	li.parent("ul").removeClass("child-open");
        },
        _addBackLinks: function() {
        	var $this = this;

        	this.element.find("ul ul").each(function(){
        		$(this).prepend("<li class='"+$this.options.backClass+"'> <a href='#'>Back</a></li>");
        	});
        },
        _setPosition: function() {
        	var sidebarLeftPosition = this.pushContainer.offset().left - this.element.width();
        	var renderedSidebarLeftPosition = sidebarLeftPosition;

        	if(renderedSidebarLeftPosition < 0)
        		renderedSidebarLeftPosition = 0;

        	this._setPushContainerPosition(sidebarLeftPosition);
        	this.element.css("left", renderedSidebarLeftPosition);
        },
        _setPushContainerPosition: function(sidebarLeftPosition) {
        	var pushContainerPosition = 0;

        	if(this.element.hasClass("open") && sidebarLeftPosition < 0)
	        	pushContainerPosition = 0 - sidebarLeftPosition;

	       	this.pushContainer.css("padding-left", pushContainerPosition);
        },
        _generateWrapper: function() {
        	var wrapper = this.element.children("."+this.options.wrapperClass+":first");

            if(wrapper.length == 0) {
            	this.element.wrapInner("<div class='"+this.options.wrapperClass+"'></div>");
            	wrapper = this.element.children("."+this.options.wrapperClass+":first");
            }

            return wrapper;
        },
        _getPushContainer: function() {
        	return $(this.element.attr("pushContainer"));
        },
        _createEvents : function() {
        	var $this = this;
        	var id = this.element.attr("id");

        	$(document).on("click", "[sidebarWidget='"+id+"']", function() {
        		$this.toggleSidebar();
        	});

        	var resizeTimeoutId;
        	$(window).on("resize", function() {
        		clearTimeout(resizeTimeoutId);
        		$this.resetPosition();
        	});

			//when child-toggle is clicked
        	this.element.on("click", "."+this.options.childToggleClass, function() { 
        		$this.openListItem($(this).parents("li:first")); //open parent list
        	});

        	//when back link is clicked
        	this.element.on("click", "."+this.options.backClass+" a", function(e) { 
        		e.preventDefault();

        		$this.closeListItem($(this).parents("li.open:first")); //close parent list

        		return false;
        	});
        }
    };


    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );

jQuery(document).ready(function($){
	$(".sidebar-widget").sidebarWidget();
});