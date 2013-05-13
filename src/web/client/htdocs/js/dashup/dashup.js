var gridster;
var socket;

/**
 * Initialize the Dashup app
 */
function initDashup(){
    $(".gridster ul").gridster({
        widget_margins: [5, 5],
        min_cols : 5,
        extra_cols: 0,
        widget_base_dimensions: [100, 100]
    });
 	
  	gridster = $(".gridster ul").gridster().data('gridster');

 	socket = io.connect();
}

function lockDashboard(){
	gridster.disable();
}
function unlockDashboard(){
	gridster.enable();
}


/**
 * Generate an unique id useful for creating dynamic functions
 */
function uniquieId(){
	var date = new Date();
	var components = [
	    date.getYear(),
	    date.getMonth(),
	    date.getDate(),
	    date.getHours(),
	    date.getMinutes(),
	    date.getSeconds(),
	    date.getMilliseconds()
	];

	return components.join("");
}

/**
 * Clock Widget 
 */
function createClockWidget(){

	var initCfg = {
		title: 'Simple Chart Widget',
		template: 'widgets/clock.widget.html',
		size: [2,2],
		position: [1,1]
	};
	createWidget(initCfg);

}

function createTextWidget(){
	var initCfg = {
		title: 'Simple Text Widget',
		template: 'widgets/text.widget.html',
		size: [4,1],
		position: [1,1]
	};
	createWidget(initCfg);
}

function createGaugeWidget(){
	var initCfg = {
		title: 'Simple Gauge Widget',
		template: 'widgets/gauge.widget.html',
		size: [2,2],
		position: [1,1]
	};
	createWidget(initCfg);
}

function createCounterWidget(){
	var initCfg = {
		title: 'Logins',
		template: 'widgets/counter.widget.html',
		size: [1,1],
		position: [1,1]
	};
	createWidget(initCfg);
}

function createTimeSeriesWidget(){
	var initCfg = {
		title: 'Simple Time Series Widget',
		template: 'widgets/timeseries.widget.html',
		size: [4,2],
		position: [1,1]
	};
	createWidget(initCfg);
}

function createWidget(initConfig){

	$.get(initConfig.template, function(template) {
			var compiled = _.template(template);
			var widgetConfig = { wuid: uuid.v4(),
				   				 id: uniquieId(),
				   				 title: initConfig.title
							   };
			gridster.add_widget('<li class="new">'+compiled(widgetConfig)+'</li>',
			 					initConfig.size[0], 
			 					initConfig.size[1]);
		});

}

/*
function createWidget(templateName, width, height){

	$.get(templateName, function(template) {
		var compiled = _.template(template);
		var widgetConfig = { wuid: uuid.v4(),
			   				 id: uniquieId()
						   };
		createWidgetFor(compiled(widgetConfig),width, height);
	});

}

function createWidgetFor(widgetRaw, width, height){
	gridster.add_widget('<li class="new">'+widgetRaw+'</li>', width, height);
}
*/


