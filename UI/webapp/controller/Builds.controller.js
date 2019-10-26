sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"scp/com/saparate/utils/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("scp.com.saparate.controller.Builds", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Builds
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Builds").attachPatternMatched(this._onObjectMatched, this);
			this._jobid = "";
			// this._from = "";
			// this._to = "";
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.Builds
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.Builds
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.Builds
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			var jobId = oEvent.getParameter("arguments").jobId;
			this._jobid = jobId;
			var oModel_jobdetails = new sap.ui.model.json.JSONModel();
			oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("jobresults") + "?jobName=" + jobId);
			//this.byId("idBuildstblHdr").setText("Build Results--" + jobId);
			this.byId("idBreadcrum_builds").setCurrentLocationText(jobId);
			this.getView().setModel(oModel_jobdetails, "Jobdetails");
			// this._to = "stagesFromPipeline";

			// if (jobId === "Recent Builds" && from === "dashboard") {
			// 	var Breadcrumb = this.getOwnerComponent().getModel("BreadCrumb");
			// 	Breadcrumb.setData([{
			// 		"name": "PipeLine",
			// 		"link": "./teddstddd"
			// 	}, {
			// 		"name": "PipeLine",
			// 		"link": "./testddd"
			// 	}]);
			// 	//this.byId("idbreadcrumbs").setCurrentLocationText("Project");
			// 	this.byId("idtxtDashboard").setText("Recent Builds");
			// 	oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("latestBuildResults"));
			// 	this._to = "stagesFromDashboard";
			// 	this.getView().byId("idPipelineBuilds").setTitle("Recent Builds");
			// } else {
			//this.byId("idtxtDashboard").setText(+"Builds");
			//}
		},
		handleSelectionChange: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("buildStages", {
				jobId: oEvent.getParameter("listItem").getCells()[0].getText(),
				buildid: oEvent.getParameter("listItem").getCells()[1].getText()
			});
		},
		navigateTo: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var route = oEvent.getSource().getText();
			if (route === "Dashboard") {
				oRouter.navTo("Dashboard");
			}
			if (route === "Build PipeLines") {
				oRouter.navTo("jobs");
			}
		},
		refreshData: function (oEvent) {
			this.getView().getModel("Jobdetails").loadData(this.getOwnerComponent().getModel("servers").getProperty("jobresults") + "?jobName=" +
				this._jobid);
			this.getView().getModel("Jobdetails").refresh();
		}
	});

});

// 	var oModel_jobdetails_cpp = new sap.ui.model.json.JSONModel();

// 				oModel_jobdetails_cpp.setData(

// [{
// 	"id": 36,
// 	"name": "testdd",
// 	"number": 2,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-20T16:42:21.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 35,
// 	"name": "RamsDemo",
// 	"number": 1,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-20T08:18:50.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 34,
// 	"name": "testtt",
// 	"number": 18,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-20T06:31:45.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 31,
// 	"name": "testdd",
// 	"number": 1,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:35:41.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 32,
// 	"name": "testtt",
// 	"number": 17,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:34:00.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 33,
// 	"name": "testtt",
// 	"number": 16,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:32:21.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 30,
// 	"name": "testtt",
// 	"number": 15,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:30:36.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 28,
// 	"name": "testtt",
// 	"number": 14,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:23:31.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 29,
// 	"name": "testtt",
// 	"number": 13,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:21:06.000+0000",
// 	"triggeredBy": null
// }, {
// 	"id": 26,
// 	"name": "testtt",
// 	"number": 12,
// 	"buildResult": "FAILURE",
// 	"duartion": 0,
// 	"estimatedDuration": 0,
// 	"timeStamp": "2019-10-19T17:18:21.000+0000",
// 	"triggeredBy": null
// }]
// 				);