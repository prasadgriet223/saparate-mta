sap.ui.define(["sap/ui/core/mvc/Controller", "scp/com/saparate/utils/formatter"], function (Controller, formatter) {
	"use strict";
	return Controller.extend("scp.com.saparate.controller.Dashboard", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Dashboard
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Dashboard").attachPatternMatched(this._onObjectMatched, this);
		},
		/**
		 *@memberOf scp.com.saparate.controller.Dashboard
		 */
		hideside: function (oEvent) {

		},
		_onObjectMatched: function (oEvent) {
			var oModel_jobdetails = new sap.ui.model.json.JSONModel();
			oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("latestBuildResults"));
			this.getView().setModel(oModel_jobdetails, "Jobdetails");
			this.byId("idBuildstblHdr").setText("Recent Builds");
			this.byId("idBreadcrum_dashboard").setCurrentLocationText("Dashboard");
			// this.byId("idBreadcrum_dashboard").addLink(new sap.m.Link( {
			// 	text:"HelloWorld"
			// }));
		},
		handleSelectionChange: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("buildStages", {
				jobId: oEvent.getParameter("listItem").getCells()[0].getText(),
				buildid: oEvent.getParameter("listItem").getCells()[1].getText()
			});

		},
		refreshData: function (oEvent) {
			this.getView().getModel("Jobdetails").loadData(this.getOwnerComponent().getModel("servers").getProperty("latestBuildResults"));
			this.getView().getModel("Jobdetails").refresh();
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