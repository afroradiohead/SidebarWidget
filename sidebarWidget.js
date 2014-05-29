;(function ( $, window, document, undefined ) {

    var pluginName = "sidebarWidget",
        defaults = {
            wrapperClass: "sidebar-wrapper",
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
            this.parentContainer = this.element.parent().addClass("sidebar-widget-parent");
            this.width = this.element.width();

            this._checkIfSidebarWillFit();

        	this._addBackLinks();
        	this._createEvents();
        },
        toggleSidebar: function() {
        	if(this.element.hasClass("open"))
        		this.closeSidebar();
        	else
        		this.openSidebar();
        },
        openSidebar: function() {
        	this.element.addClass("open");

            if(!this.sidebarWillFit)
                this.parentContainer.css({marginLeft: this.width});               
            
            this._bindCloseSidebarClickEvent();
        },
        closeSidebar: function() {
        	this.element.removeClass("open");

            this.parentContainer.css({marginLeft: ""});

            
            this._unBindCloseSidebarClickEvent();
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
        _checkIfSidebarWillFit: function(){
            var parentContainerOffsetLeft = this.parentContainer.offset().left;  

            if(parentContainerOffsetLeft >= this.width)
                this.sidebarWillFit = true;
            else
                this.sidebarWillFit = false;    
        },
        _generateWrapper: function() {
        	var wrapper = this.element.children("."+this.options.wrapperClass+":first");

            if(wrapper.length == 0) {
            	this.element.wrapInner("<div class='"+this.options.wrapperClass+"'></div>");
            	wrapper = this.element.children("."+this.options.wrapperClass+":first");
            }

            return wrapper;
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
                resizeTimeoutId = setTimeout(function(){
                    $this._checkIfSidebarWillFit();
                }, 20); 		
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

            $this.element.on('click', function(e){
                e.stopPropagation();
            });
        },
        _closeSidebarClickHandler : function(e){
            if(this.element.hasClass("open"))
                this.closeSidebar();
        },
        _bindCloseSidebarClickEvent : function(){ 
            $(document).on("click", $.proxy(this._closeSidebarClickHandler, this));
        },
        _unBindCloseSidebarClickEvent : function(){
            $(document).off("click", $.proxy(this._closeSidebarClickHandler, this));
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