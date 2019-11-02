sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"scp/com/saparate/utils/formatter"
], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("scp.com.saparate.controller.App", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.App
		 */
		onInit: function () {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("App").attachPatternMatched(this._onObjectMatched, this);
			
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.App
		 */
		onBeforeRendering: function () {

		},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.App
		 */
		onAfterRendering: function () {

		},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.App
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			
		},
		onPressExpand: function () {
			var toolPage = this.byId("toolPage");
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		gotoDashboard: function () {
			this.getRouter().navTo("Dashboard");
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("Dashboard");
		},
		gotoUserStory: function () {
			this.getRouter().navTo("UserStoryBoard");
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("UserStoryBoard");
		},
		gotoProjects: function () {
			this.getRouter().navTo("UserStoryBoard");
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("UserStoryBoard");
		},
		gotoPipelines: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("jobs", {
				from: "tonewpipeline"
			});
		},
		gotoEnviroments: function () {
			this.getRouter().navTo("RegisterEnvironments");
		},
		gotoCredentials: function () {
			this.getRouter().navTo("Credentials");
		}
	});
});
//	var oModel_jobdetails_cpp = new sap.ui.model.json.JSONModel();
// oModel_jobdetails_cpp.setData(

// 	[{
// 		"id": 36,
// 		"name": "test123",
// 		"number": 1,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-20T16:42:21.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 35,
// 		"name": "demopipeline",
// 		"number": 1,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-20T08:18:50.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 34,
// 		"name": "testtt",
// 		"number": 18,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-20T06:31:45.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 31,
// 		"name": "testdd",
// 		"number": 1,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:35:41.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 32,
// 		"name": "testtt",
// 		"number": 17,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:34:00.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 33,
// 		"name": "testtt",
// 		"number": 16,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:32:21.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 30,
// 		"name": "testtt",
// 		"number": 15,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:30:36.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 28,
// 		"name": "testtt",
// 		"number": 14,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:23:31.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 29,
// 		"name": "testtt",
// 		"number": 13,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:21:06.000+0000",
// 		"triggeredBy": null
// 	}, {
// 		"id": 26,
// 		"name": "testtt",
// 		"number": 12,
// 		"buildResult": "FAILURE",
// 		"duartion": 0,
// 		"estimatedDuration": 0,
// 		"timeStamp": "2019-10-19T17:18:21.000+0000",
// 		"triggeredBy": null
// 	}]
// );
//	this.getView().setModel(oModel_jobdetails_cpp, "Jobdetails");

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