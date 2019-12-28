sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"scp/com/saparate/utils/formatter",
	"sap/m/MessageBox",
	'sap/m/GroupHeaderListItem'
], function (BaseController, JSONModel, formatter, MessageBox, GroupHeaderListItem) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.WorkflowCycleStages", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.WorkflowCycleStages
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("WorkflowCycleStages").attachPatternMatched(this._onObjectMatched, this);
			this._cycleId = "";
		},
		_onObjectMatched: function (oEvent) {
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				var ReleasejobId = oEvent.getParameter("arguments").RjobId;
			//	this._cycleId = ReleasejobId;
				this.loadDatatoViewwithKey_GET_filter("getReleaseStages", "/" + ReleasejobId,
					"Stages",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
			}
		},
		getGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.key,
				upperCase: true,
				highlight: "Information",
			});
		},
		showStageLogs: function (oEvent) {
			this._getDialog().open();
			var jobId = oEvent.getSource().getBindingContext("Stages").getObject().jenkinsJobName;
			var buildId = oEvent.getSource().getBindingContext("Stages").getObject().jenkinsBuildNumber;
			sap.ui.core.BusyIndicator.show();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel_releasestageslog = new sap.ui.model.json.JSONModel();
			oModel_releasestageslog.loadData(this.getOwnerComponent().getModel("servers").getProperty("log") + "?jobName=" + jobId +
				"&buildNumber=" + buildId, null, true, "GET", null, false, sHeaders);
			oModel_releasestageslog.attachRequestCompleted(function () {
				var p = this.byId("idlog_RLcontent");
				p.removeAllContent();
				var sResponse = oModel_releasestageslog.getData()["response"];
				var r = JSON.stringify(sResponse).replace(/\\r\\n/g, "<br />");
				var oText2 = new sap.ui.core.HTML();
				oText2.setContent("<div>" + r + " </div>");
				oText2.placeAt(this.byId("idlog_RLcontent"));
				this.getView().setBusy(false);
			}.bind(this));
			sap.ui.core.BusyIndicator.hide();

		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(),
					"scp.com.saparate.view.fragments.workflowstages.Releaspipelinedeploytasklogs", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;

		},
		onCloselog: function () {
			
			var p = this.byId("idlog_RLcontent");
			p.removeAllContent();
			
			this._getDialog().close();

		},
		StageFactory: function (sId, oContext) {
			var oUIControl;
			if (oContext.getProperty("type") === "approvalTask"  ||  oContext.getProperty("type") === "manualTask" ) {
				oUIControl = this.byId("humantask").clone(sId);
			}
			if (oContext.getProperty("type") === "deployTask") {
				oUIControl = this.byId("deploytask").clone(sId);
			}
			return oUIControl;
		},
		initiateAction: function (oEvent) {
			var oInput = {
				"humanResponse": {
					"msg": oEvent.getSource().getBindingContext("Stages").getProperty("waitUntil")
				},
				"actedBy":oEvent.getSource().getBindingContext("Stages").getProperty("assignedTo")
			};

			var action = "";

			if (oEvent.getSource().getText() === "Approve")
				action = "COMPLETE";
			if (oEvent.getSource().getText() === "Reject")
				action = "REJECT";

			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			this.getView().setBusy(true);
			var taskId = oEvent.getSource().getBindingContext("Stages").getProperty("id");
			var oModel = new JSONModel();
			oModel.loadData("//na1.saparate.com/rateworkflow/tasks/" + taskId + "?action=" + action, JSON.stringify(oInput), true,
				"PUT", false, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				MessageBox.show(("Release PipeLine Stage  " + oModel.getData().label + " Approved!  "), {
					title: "Message",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oActions) {
						//	oEvent.getSource().setEnabled(false) ;
						if (oActions === "OK") {
							// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							// oRouter.navTo("WorkflowCycleStages", {
							// 	RjobId: this._cycleId 
							// });
							this.loadDatatoViewwithKey_GET_filter("getReleaseStages", "/" + this._cycleId,
								"Stages",
								sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
							this.getView().getModel("Stages").refresh();
						}
					}.bind(this)
				});
			}.bind(this));
			this.getView().setBusy(false);
		},
		navigateTo: function (oEvent) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var route = oEvent.getSource().getText();
				if (route === "Dashboard") {
					oRouter.navTo("Dashboard");
				} else if (route === "Release PipeLines") {
					oRouter.navTo("RLpipelines");
				} else {
					//	var cycleId = oEvent.getSource().getText();
					oRouter.navTo("Cycles", {
						cycleId: this._cycleId
					});
				}
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf scp.com.saparate.view.WorkflowCycleStages
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.WorkflowCycleStages
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.WorkflowCycleStages
		 */
		//	onExit: function() {
		//
		//	}

	});

});

// var oModel = new JSONModel();
// var array = this.getView().getModel("Stages").getData();
// oModel.setData(array);
// var arrStages = [];
// for (var i = 0, l = oModel.getData().execution.length; i < l; i++) {
// 	if (oModel.getData().execution[i].type === "deployTask") {
// 		arrStages.push(oModel.getData().execution[i]);
// 	}
// }
// this.getView().setModel(oModel);
// var arroModel = this.getView().getModel().getData().execution;
// arrStages.forEach(function (oItem, iIndex, arr) {
// 	var arrInnerStages = [];
// 	arroModel.forEach(function (oValue, iIndex2) {
// 		if (oValue.stageName === oItem.stageName) {
// 			arrInnerStages.push(oValue);
// 		}
// 	});
// 	oItem.InnerStages = arrInnerStages;
// });
// var oModel_Stages = new JSONModel();
// oModel_Stages.setData(arrStages);
// this.getView().setModel(oModel_Stages, "oModel_Stages");

/*	var oModel = new JSONModel({
				"outputs": {},
				"execution": [

					{
						"taskCompleteInput": {
							"humanResponse": {
								"msg": "preConditionMsg"
							}
						},
						"categoryFor": "dev1",
						"assignType": "USER",
						"waitUntil": "preConditionMsg",
						"label": "PreCondition for dev1",
						"type": "humanTask",
						"priority": 0,
						"assignedTo": "tres",
						"output": {
							"msg": "preConditionMsg"
						},
						"executionTime": 9474,
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev1",
						"createTime": "2019-11-26T17:07:44.142+0000",
						"name": "preconditionfordev1",
						"progress": 100,
						"startTime": "2019-11-26T17:07:44.316+0000",
						"taskNumber": 1,
						"id": "8f66bfe7fb644732b18cdabba447b5bd",
						"endTime": "2019-11-26T17:07:53.790+0000",
						"assignID": "",
						"taskCategory": "PRE_CONDITION",
						"status": "COMPLETED"
					},

					{
						"buildJobName": "Build pipeline1",
						"taskCompleteInput": {
							"humanResponse": {}
						},
						"buildJobNumber": "1",
						"cfCredentialsID": "1",
						"label": "dev1",
						"type": "deployTask",
						"priority": 0,
						"error": {
							"stackTrace": ["java.lang.NullPointerException",
								"\tat com.creactiviti.piper.core.taskhandler.interrupts.DeployTask.hanldeEvent(DeployTask.java:31)",
								"\tat com.creactiviti.piper.core.Worker.lambda$handleWaitingTask$1(Worker.java:143)",
								"\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)",
								"\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)",
								"\tat java.base/java.lang.Thread.run(Thread.java:834)"
							]
						},
						"jenkinsJobName": "test4_dev1_11_11",
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev1",
						"waitForMessage": "",
						"jenkinsAuthToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3",
						"createTime": "2019-11-26T17:07:53.847+0000",
						"name": "dev1",
						"startTime": "2019-11-26T17:07:59.797+0000",
						"taskNumber": 2,
						"id": "bf1322c57dfc4fcbaf3bf9d59ac4e006",
						"endTime": "2019-11-26T17:08:49.196+0000",
						"status": "FAILED"
					},

					{
						"taskCompleteInput": {
							"humanResponse": {
								"msg": "preConditionMsg"
							}
						},
						"categoryFor": "dev1",
						"assignType": "USER",
						"waitUntil": "preConditionMsg",
						"label": "PreCondition for dev1",
						"type": "humanTask",
						"priority": 0,
						"assignedTo": "tres",
						"output": {
							"msg": "preConditionMsg"
						},
						"executionTime": 9474,
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev1",
						"createTime": "2019-11-26T17:07:44.142+0000",
						"name": "preconditionfordev1",
						"progress": 100,
						"startTime": "2019-11-26T17:07:44.316+0000",
						"taskNumber": 1,
						"id": "8f66bfe7fb644732b18cdabba447b5bd",
						"endTime": "2019-11-26T17:07:53.790+0000",
						"assignID": "",
						"taskCategory": "PRE_CONDITION",
						"status": "COMPLETED"

					},

					{
						"taskCompleteInput": {
							"humanResponse": {
								"msg": "preConditionMsg"
							}
						},
						"categoryFor": "dev2",
						"assignType": "USER",
						"waitUntil": "preConditionMsg",
						"label": "PreCondition for dev2",
						"type": "humanTask",
						"priority": 0,
						"assignedTo": "tres",
						"output": {
							"msg": "preConditionMsg"
						},
						"executionTime": 9474,
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev2",
						"createTime": "2019-11-26T17:07:44.142+0000",
						"name": "preconditionfordev1",
						"progress": 100,
						"startTime": "2019-11-26T17:07:44.316+0000",
						"taskNumber": 1,
						"id": "8f66bfe7fb644732b18cdabba447b5bd",
						"endTime": "2019-11-26T17:07:53.790+0000",
						"assignID": "",
						"taskCategory": "PRE_CONDITION",
						"status": "COMPLETED"
					},

					{
						"buildJobName": "Build pipeline1",
						"taskCompleteInput": {
							"humanResponse": {}
						},
						"buildJobNumber": "1",
						"cfCredentialsID": "1",
						"label": "dev2",
						"type": "deployTask",
						"priority": 0,
						"error": {
							"stackTrace": ["java.lang.NullPointerException",
								"\tat com.creactiviti.piper.core.taskhandler.interrupts.DeployTask.hanldeEvent(DeployTask.java:31)",
								"\tat com.creactiviti.piper.core.Worker.lambda$handleWaitingTask$1(Worker.java:143)",
								"\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)",
								"\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)",
								"\tat java.base/java.lang.Thread.run(Thread.java:834)"
							]
						},
						"jenkinsJobName": "test4_dev1_11_11",
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev2",
						"waitForMessage": "",
						"jenkinsAuthToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3",
						"createTime": "2019-11-26T17:07:53.847+0000",
						"name": "dev1",
						"startTime": "2019-11-26T17:07:59.797+0000",
						"taskNumber": 2,
						"id": "bf1322c57dfc4fcbaf3bf9d59ac4e006",
						"endTime": "2019-11-26T17:08:49.196+0000",
						"status": "FAILED"
					},

					{
						"buildJobName": "Build pipeline1",
						"taskCompleteInput": {
							"humanResponse": {}
						},
						"buildJobNumber": "1",
						"cfCredentialsID": "1",
						"label": "dev3",
						"type": "deployTask",
						"priority": 0,
						"error": {
							"stackTrace": ["java.lang.NullPointerException",
								"\tat com.creactiviti.piper.core.taskhandler.interrupts.DeployTask.hanldeEvent(DeployTask.java:31)",
								"\tat com.creactiviti.piper.core.Worker.lambda$handleWaitingTask$1(Worker.java:143)",
								"\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)",
								"\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)",
								"\tat java.base/java.lang.Thread.run(Thread.java:834)"
							]
						},
						"jenkinsJobName": "test4_dev1_11_11",
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev3",
						"waitForMessage": "",
						"jenkinsAuthToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3",
						"createTime": "2019-11-26T17:07:53.847+0000",
						"name": "dev1",
						"startTime": "2019-11-26T17:07:59.797+0000",
						"taskNumber": 2,
						"id": "bf1322c57dfc4fcbaf3bf9d59ac4e006",
						"endTime": "2019-11-26T17:08:49.196+0000",
						"status": "FAILED"
					}, {
						"buildJobName": "Build pipeline1",
						"taskCompleteInput": {
							"humanResponse": {}
						},
						"buildJobNumber": "1",
						"cfCredentialsID": "1",
						"label": "dev4",
						"type": "deployTask",
						"priority": 0,
						"error": {
							"stackTrace": ["java.lang.NullPointerException",
								"\tat com.creactiviti.piper.core.taskhandler.interrupts.DeployTask.hanldeEvent(DeployTask.java:31)",
								"\tat com.creactiviti.piper.core.Worker.lambda$handleWaitingTask$1(Worker.java:143)",
								"\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)",
								"\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)",
								"\tat java.base/java.lang.Thread.run(Thread.java:834)"
							]
						},
						"jenkinsJobName": "test4_dev1_11_11",
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev4",
						"waitForMessage": "",
						"jenkinsAuthToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3",
						"createTime": "2019-11-26T17:07:53.847+0000",
						"name": "dev1",
						"startTime": "2019-11-26T17:07:59.797+0000",
						"taskNumber": 2,
						"id": "bf1322c57dfc4fcbaf3bf9d59ac4e006",
						"endTime": "2019-11-26T17:08:49.196+0000",
						"status": "FAILED"
					},

					{
						"taskCompleteInput": {
							"humanResponse": {
								"msg": "preConditionMsg"
							}
						},
						"categoryFor": "dev5",
						"assignType": "USER",
						"waitUntil": "preConditionMsg",
						"label": "PreCondition for dev5",
						"type": "humanTask",
						"priority": 0,
						"assignedTo": "tres",
						"output": {
							"msg": "preConditionMsg"
						},
						"executionTime": 9474,
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev5",
						"createTime": "2019-11-26T17:07:44.142+0000",
						"name": "preconditionfordev1",
						"progress": 100,
						"startTime": "2019-11-26T17:07:44.316+0000",
						"taskNumber": 1,
						"id": "8f66bfe7fb644732b18cdabba447b5bd",
						"endTime": "2019-11-26T17:07:53.790+0000",
						"assignID": "",
						"taskCategory": "PRE_CONDITION",
						"status": "COMPLETED"
					},

					{
						"buildJobName": "Build pipeline1",
						"taskCompleteInput": {
							"humanResponse": {}
						},
						"buildJobNumber": "1",
						"cfCredentialsID": "1",
						"label": "dev5",
						"type": "deployTask",
						"priority": 0,
						"error": {
							"stackTrace": ["java.lang.NullPointerException",
								"\tat com.creactiviti.piper.core.taskhandler.interrupts.DeployTask.hanldeEvent(DeployTask.java:31)",
								"\tat com.creactiviti.piper.core.Worker.lambda$handleWaitingTask$1(Worker.java:143)",
								"\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)",
								"\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)",
								"\tat java.base/java.lang.Thread.run(Thread.java:834)"
							]
						},
						"jenkinsJobName": "test4_dev1_11_11",
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev5",
						"waitForMessage": "",
						"jenkinsAuthToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3",
						"createTime": "2019-11-26T17:07:53.847+0000",
						"name": "dev5",
						"startTime": "2019-11-26T17:07:59.797+0000",
						"taskNumber": 2,
						"id": "bf1322c57dfc4fcbaf3bf9d59ac4e006",
						"endTime": "2019-11-26T17:08:49.196+0000",
						"status": "FAILED"
					},

					{

						"taskCompleteInput": {
							"humanResponse": {
								"msg": "preConditionMsg"
							}
						},
						"categoryFor": "dev5",
						"assignType": "USER",
						"waitUntil": "postConditionMsg",
						"label": "PostCondition for dev5",
						"type": "humanTask",
						"priority": 0,
						"assignedTo": "tres",
						"output": {
							"msg": "preConditionMsg"
						},
						"executionTime": 9474,
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev5",
						"createTime": "2019-11-26T17:07:44.142+0000",
						"name": "postconditionfordev5",
						"progress": 100,
						"startTime": "2019-11-26T17:07:44.316+0000",
						"taskNumber": 1,
						"id": "8f66bfe7fb644732b18cdabba447b5bd",
						"endTime": "2019-11-26T17:07:53.790+0000",
						"assignID": "",
						"taskCategory": "POST_CONDITION",
						"status": "COMPLETED"

					},

					{
						"buildJobName": "Build pipeline1",
						"taskCompleteInput": {
							"humanResponse": {}
						},
						"buildJobNumber": "1",
						"cfCredentialsID": "1",
						"label": "dev6",
						"type": "deployTask",
						"priority": 0,
						"error": {
							"stackTrace": ["java.lang.NullPointerException",
								"\tat com.creactiviti.piper.core.taskhandler.interrupts.DeployTask.hanldeEvent(DeployTask.java:31)",
								"\tat com.creactiviti.piper.core.Worker.lambda$handleWaitingTask$1(Worker.java:143)",
								"\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)",
								"\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)",
								"\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)",
								"\tat java.base/java.lang.Thread.run(Thread.java:834)"
							]
						},
						"jenkinsJobName": "test4_dev1_11_11",
						"jobId": "523ac0672816422ea1ba07afdc9df66d",
						"stageName": "dev6",
						"waitForMessage": "",
						"jenkinsAuthToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3",
						"createTime": "2019-11-26T17:07:53.847+0000",
						"name": "dev6",
						"startTime": "2019-11-26T17:07:59.797+0000",
						"taskNumber": 2,
						"id": "bf1322c57dfc4fcbaf3bf9d59ac4e006",
						"endTime": "2019-11-26T17:08:49.196+0000",
						"status": "FAILED"
					},

				],
				"inputs": {
					"buildJobName": "Build pipeline1",
					"name1": "deployTest",
					"buildNumber": "1",
					"authToken": "8f20e753-84aa-4a1b-87fc-030b60d551d3"
				},
				"currentTask": 1,
				"label": "test4",
				"instantiatedBy": "ravi12",
				"priority": 0,
				"pipelineId": "11:11",
				"tags": [],
				"createTime": "2019-11-26T17:07:44.000+0000",
				"webhooks": [],
				"startTime": "2019-11-26T17:07:44.000+0000",
				"id": "523ac0672816422ea1ba07afdc9df66d",
				"endTime": "2019-11-26T17:08:49.000+0000",
				"status": "FAILED"
			}

		);*/