;(function ( $, window, document, undefined ) {

    var pluginName = "sidebarWidget",
        defaults = {
            wrapperClass: "sidebarWrapper",
            childToggleClass: "child-toggle"
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
        },
        closeSidebar: function() {
        	this.element.removeClass("open");
        },
        openListItem:function(li){
        	li.addClass('open');
        	li.parent("ul").addClass("child-open");
        },
        closeListItem:function(li){
        	li.removeClass('open');
        	li.parent("ul").removeClass("child-open");
        },
        _setPosition: function() {
        	this.element.css("left", this.pushContainer.offset().left - this.element.width());
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

        	$(window).on("resize", function() {
        		$this.resetPosition();
        	});

        	this.element.on("click", "."+this.options.childToggleClass, function() { //when child-toggle is clicked
        		$this.openListItem($(this).parents("li:first")); //open parent li
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
	$(".sidebarWidget").sidebarWidget();
});