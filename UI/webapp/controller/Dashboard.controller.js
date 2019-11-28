sap.ui.define(["scp/com/saparate/controller/BaseController", "scp/com/saparate/utils/formatter", "sap/ui/model/json/JSONModel"], function (
	BaseController, formatter, JSONModel) {
	"use strict";
	return BaseController.extend("scp.com.saparate.controller.Dashboard", {
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

			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.loadDatatoViewwithKey_GET("latestBuildResults", "Jobdetails", skey);
				this.byId("idBuildstblHdr").setText("Recent Build Cycles");
				this.loadDatatoViewwithKey_GET("recentcycles", "Cycledetails", skey);

				// var oModel = new JSONModel({
				// 	"size": 5,
				// 	"items": [{
				// 		"outputs": {},
				// 		"inputs": {
				// 			"buildJobName": "Build pipeline1",
				// 			"name1": "deployTest",
				// 			"buildNumber": "1",
				// 			"authToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3"
				// 		},
				// 		"currentTask": 1,
				// 		"label": "test4",
				// 		"instantiatedBy": "ravi12",
				// 		"priority": 0,
				// 		"pipelineId": "11:11",
				// 		"tags": [],
				// 		"createTime": "2019-11-26T17:07:44.000+0000",
				// 		"webhooks": [],
				// 		"startTime": "2019-11-26T17:07:44.000+0000",
				// 		"id": "523ac0672816422ea1ba07afdc9df66d",
				// 		"endTime": "2019-11-26T17:08:49.000+0000",
				// 		"status": "FAILED"
				// 	}, {
				// 		"outputs": {},
				// 		"inputs": {
				// 			"buildJobName": "Build pipeline1",
				// 			"name1": "deployTest",
				// 			"buildNumber": "1",
				// 			"authToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3"
				// 		},
				// 		"currentTask": 1,
				// 		"label": "DevRelease",
				// 		"instantiatedBy": "ravi12",
				// 		"priority": 0,
				// 		"pipelineId": "10:10",
				// 		"tags": [],
				// 		"createTime": "2019-11-21T17:52:01.000+0000",
				// 		"webhooks": [],
				// 		"startTime": "2019-11-21T17:52:01.000+0000",
				// 		"id": "7c4d481e8dc7448eb7556102c389ca67",
				// 		"endTime": "2019-11-26T17:09:03.000+0000",
				// 		"status": "FAILED"
				// 	}, {
				// 		"outputs": {},
				// 		"inputs": {
				// 			"buildJobName": "Build pipeline1",
				// 			"name1": "deployTest",
				// 			"buildNumber": "1",
				// 			"authToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3"
				// 		},
				// 		"currentTask": 1,
				// 		"label": "QA_Build2",
				// 		"instantiatedBy": "ravi12",
				// 		"priority": 0,
				// 		"pipelineId": "9:9",
				// 		"tags": [],
				// 		"createTime": "2019-11-21T17:37:46.000+0000",
				// 		"webhooks": [],
				// 		"startTime": "2019-11-21T17:37:46.000+0000",
				// 		"id": "b33a0363bbc2434890817da1ca66ba41",
				// 		"endTime": "2019-11-21T17:38:48.000+0000",
				// 		"status": "WAITING"
				// 	}, {
				// 		"outputs": {},
				// 		"inputs": {
				// 			"buildJobName": "Build pipeline1",
				// 			"name1": "deployTest",
				// 			"buildNumber": "1",
				// 			"authToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3"
				// 		},
				// 		"currentTask": -1,
				// 		"label": "QA_Build2",
				// 		"instantiatedBy": "ravi12",
				// 		"priority": 0,
				// 		"pipelineId": "9:9",
				// 		"tags": [],
				// 		"createTime": "2019-11-21T17:33:42.000+0000",
				// 		"webhooks": [],
				// 		"startTime": "2019-11-21T17:33:42.000+0000",
				// 		"id": "14fbd7a675b546fab3df1facadf0b0ba",
				// 		"endTime": "2019-11-21T17:37:21.000+0000",
				// 		"status": "COMPLETED"
				// 	}, {
				// 		"outputs": {},
				// 		"inputs": {
				// 			"buildJobName": "QA_Build",
				// 			"name1": "deployTest",
				// 			"buildNumber": "",
				// 			"authToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3"
				// 		},
				// 		"currentTask": -1,
				// 		"label": "QA_Release",
				// 		"instantiatedBy": "ravi12",
				// 		"priority": 0,
				// 		"pipelineId": "8:8",
				// 		"tags": [],
				// 		"createTime": "2019-11-21T17:33:01.000+0000",
				// 		"webhooks": [],
				// 		"startTime": "2019-11-21T17:33:01.000+0000",
				// 		"id": "78a37c529aad4cb1a6d5e554c878db01",
				// 		"endTime": "2019-11-21T17:33:12.000+0000",
				// 		"status": "COMPLETED"
				// 	}]
				// });

			//	this.getView().setModel(oModel);
				this.byId("idReleasePipelinesHdr").setText("Recent Release Cycles");
				this.byId("idBreadcrum_dashboard").setCurrentLocationText("Dashboard");
			}
		},
		handleSelectionChange: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("buildStages", {
				jobId: oEvent.getSource().getBindingContext("Jobdetails").getObject().name,
				buildid: oEvent.getSource().getBindingContext("Jobdetails").getObject().number
			});
		},
		handleSelectionChange_releaseCycle: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("WorkflowCycleStages", {
				RjobId: oEvent.getSource().getBindingContext("Cycledetails").getObject().id,
				CycleId: "from"
			});

		},
		refreshData: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			this.loadDatatoViewwithKey_GET("latestBuildResults", "Jobdetails", skey);
			this.getView().getModel("Jobdetails").refresh();
			sap.ui.core.BusyIndicator.hide();
		},

		refreshData_Cycles: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			this.loadDatatoViewwithKey_GET("recentcycles", "Cycledetails", skey);
			this.getView().getModel("Cycledetails").refresh();
			sap.ui.core.BusyIndicator.hide();
		}

	});
});

