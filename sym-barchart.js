/* 	Course: Customizing PI Vision with Extensibility
	Symbol:  3D Graph
	Created by: Lisaury Salas
*/
(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "barchart",
		visObjectType: symbolVis,
		/* LS: Using Multiple to indicate more than one attribute can be dragged to the graph`*/
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		/* LS: Specifying the icon for the symbol to be shown in the symbols pane`*/
		iconUrl: '/Images/3DGraph.jpg',
		getDefaultConfig: function(){ 
			return { 
				DataShape: 'Table',
				Height: 300,
				Width: 600,
				/* LS: Specifying backgroundColor for the graph here, so it can be customized for the user. 
				File sym-barchart-template.html was modified to use ng-style. 
				The file sym-barchart-config.html was created to add the component for each property to show
				*/
				BackgroundColor: '#cdd0db',
				BorderRadius: 10,
				TextColor: 'rgb(0,255,0)'
			} 
		},
		
		/* LS: Adding this property to show a Configuration Pane when the user does right-click on the symbol 
			The file sym-barchart-config.html was created to add the component for each property to show
		*/
		configOptions: function () { 
			return [{ 
				title: "Format Graph",
				mode: "Format" 
			}];
		}
	}
	
	/* LS:  Next code was taken for armchart to create a 3d graph. Some modifications were made to change some features.
			This code indicate how the graph will be.
	*/
	function getConfig() {
		return {
			"type": "serial",
			"categoryField": "attribute",
			"angle": 30,
			"depth3D": 30,
			"colors": [
				"#00A2E8"
			],
	
			"startDuration": 1,
			"color": "#000000",
			"categoryAxis": {
			"autoGridCount": false,
			/* LS: Changing the label rotation to get a better fit of the labels */
				"labelRotation": 45,
				"gridPosition": "start"
			},
			"trendLines": [],
			"graphs": [
				{
					"balloonText": "[[value]]",
					"id": "AmGraph-1",
					/*"title": "General",*/
					"type": "column",
					"fillAlphas": 1,

					"valueField": "value"
				}
			],
			"guides": [],
			"valueAxes": [
				{
					"id": "ValueAxis-1",
					"title": "Y Axis"
				}
			],
			"allLabels": [],
			"balloon": {},
			"legend": {
				"enabled": false,
				"useGraphSettings": false
			},
			"titles": [
				{
					"id": "Title-1",
					"size": 15,
					"text": "Comparison Barchart"
				}
			],
			"dataProvider": [
				{
					"attribute": "attribute 1",
					"value": 8,
					"color": "#00ff00"
				},
				{
					"attribute": "attribute 2",
					"value": 6,
					"color": "#ff0000"
				}
			]
		}
		
	}
	
	
	symbolVis.prototype.init = function(scope, elem) {
		var labels;
		var container= elem.find('#container')[0];
		/* LS: Creating an unique ID for the graph*/
		container.id="barchart_" + scope.symbol.Name;
		
		var chart = AmCharts.makeChart(container.id,getConfig());
		
		function convertToChart(data) {
		
		  return data.Rows.map(function(item,index){
			var str=labels[index];
			var n=str.indexOf("|");
			  return {

				  value: item.Value,
				  
				 /* LS: Showing only the letters after "|" in the name.  */
				  attribute: labels[index].slice(n+1)
				 
			  }
			});
			
			
		}
		
		/* LS: To avoid "Undefined" name in the label in the graph*/
		function updateLabel(data) {
			labels=data.Rows.map (function(item) {
				return item.Label;
			});
		}
		
	/* LS:  Function dataUpdate	. To get all the data coming. 
	First we check if the data is null
	If there is data we read label for the sporadic update. Some attributes don't come in each data array. */
	
	
		this.onDataUpdate= dataUpdate;
		function dataUpdate(data) {
			
			if(!data) return;
			if (data.Rows[0].Label) updateLabel(data);
			if (!labels || !chart) return;
			
			var dataprovider= convertToChart(data);
			
			chart.dataProvider=dataprovider;
			chart.validateData();
			
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
