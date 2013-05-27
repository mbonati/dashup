var gridster;
var socket;

var currentDashboardId;

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

 	registerBaseWidgets();
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

	var serialized = { 'dashboardSerialized' : {
							'dashboardId' : 'default',
							'widgets' : widgetInfos
					  }
					};

	console.log(JSON.stringify(serialized));

	$.ajax({
		type: 'post',
		url : './saveDashboard',
		dataType: "json",
		data: serialized
	})
}

function loadDashboardData(dashboardId){
	console.log("loadDashboardData called for: "+dashboardId);
	$.ajax({
		type: 'post',
		url : './loadDashboard',
		dataType: "json",
		data: { 'dashboardId' : dashboardId },
		success: function(data, textStatus, xhr){
			console.log("loadDashboard success: " + textStatus + " -> " +data);
			loadDashboard(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			console.log("load dashboard error: " + errorThrown);
        }
	})
}

function loadDashboard(dashboardData){
	console.log("loadDashboard>> called for " + JSON.stringify(dashboardData));

	currentDashboardId = dashboardData.dashboardId;

	//check validity of message
	if (!dashboardData.dashboard){
		return;
	}
	if (!dashboardData.dashboard.widgets){
		return;
	}

	for (i=0;i<dashboardData.dashboard.widgets.length;i++){
		loadWidget(dashboardData.dashboard.widgets[i]);
	}

}

function loadWidget(widgetData){
	console.log("loadWidget called for " + JSON.stringify(widgetData));
	var widgetInfo = getWidgetInfo(widgetData.widgetType);
	if (!widgetInfo){
		console.log("unable to find widgetInfo for type " + widgetData.widgetType);
		return;
	} else {
		var initCfg = {
			title: widgetInfo.defaults.title,
			template: widgetInfo.template,
			size: widgetInfo.defaults.size,
			position: [widgetData.widgetPosition.col,widgetData.widgetPosition.row]
		};
		console.log("loadWiget for " + JSON.stringify(initCfg));
		createWidget(initCfg);
	}

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


/******** Widget Registry **///
var widgetRegistry = {};
function registerWidget(widgetInfo){
	widgetRegistry[widgetInfo.type] = widgetInfo;	
}
function getWidgetInfo(widgetType){
	return widgetRegistry[widgetType];
}
/******** END Widget Registry **///




function registerBaseWidgets(){
	registerClockWidget();	
	registerGaugeWidget();
	registerTextWidget();
}


function registerClockWidget(){
	var wInfo = {
		type : "dashup.base.clock",
		template: 'widgets/clock.widget.html',
		defaults: {
			title: "Clock",
			size: [2,2]
		}
	};
	registerWidget(wInfo);
}

function registerGaugeWidget(){
	var wInfo = {
		type : "dashup.base.gauge",
		template: 'widgets/gauge.widget.html',
		defaults: {
			title: "Gauge",
			size: [2,2]
		}
	};
	registerWidget(wInfo);
}

function registerTextWidget(){
	var wInfo = {
		type : "dashup.base.text",
		template: 'widgets/text.widget.html',
		defaults: {
			title: "Text",
			size: [4,1]
		}
	};
	registerWidget(wInfo);
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
			 					initConfig.size[1],
			 					initConfig.position[0],
			 					initConfig.position[1]);
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


