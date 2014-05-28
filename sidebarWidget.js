;(function ( $, window, document, undefined ) {

    var pluginName = "sidebarWidget",
        defaults = {
            propertyName: "value"
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
        	var $this = this;
        	var id = this.element.attr("id");
        	this.wrapper = this._generateWrapper(this.element);
        	this.pushContainer = this._getPushContainer(this.element);

        	$(document).on("click", "[sidebarWidget='"+id+"']", function(){
        		$this.openSidebar();
        	});

        	//move element to the left a little
        	this.element.css("left", this.pushContainer.offset().left - this.element.width());
        },
        openSidebar:function(){
        	this.wrapper.css({left:0});
        },
        _generateWrapper: function(element){
        	var wrapper = element.children(".sidebarWrapper:first");

            if(wrapper.length == 0){
            	element.wrapInner("<div class='sidebarWrapper'></div>");
            	wrapper = element.children(".sidebarWrapper:first");
            }

            return wrapper;
        },
        _getPushContainer:function(element){
        	return $(element.attr("pushContainer"));
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