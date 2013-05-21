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
        widget_base_dimensions: [100, 100],
        draggable: {
        	stop: onDragStop
        }
    });
 	
  	gridster = $(".gridster ul").gridster().data('gridster');

 	socket = io.connect();
}

function onDragStop(event, ui){
	serializeDashboard();
}

function serializeDashboard(){

	var gridsterSerialized = gridster.serialize();

	var widgetInfos = new Array();
	var index = 0;
	$( ".dashup-widget" ).each(function( index ) {
		var widgetType = $(this).attr('type');
		var widgetId = $(this).attr('id');
	  	
	  	var widgetInfo = { 'widgetType' : widgetType,
	  					   'widgetId' : widgetId,
	  					   'widgetPosition' : gridsterSerialized[index]
	  					 };
	  	
	  	widgetInfos.push(widgetInfo);

	  	index++;
	});

	//console.log(JSON.stringify(widgetInfos));

	//var widgets = $('.gridster').children().filter('.dashup-widget');

	var serialized = { 'dashboardSerialized' : {
							'dashboardId' : 'default',
							'widgets' : widgetInfos
					  }
					};

	console.log(JSON.stringify(serialized));

	$.ajax({
		type: 'post',
		url : './serializeDashboard',
		dataType: "json",
		data: serialized
	})
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

function createLineChartWidget(){
	var initCfg = {
		title: 'Line Chart Widget',
		template: 'widgets/line.chart.widget.html',
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


