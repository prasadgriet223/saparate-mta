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
				this._cycleStageId = "";
			},
			_onObjectMatched: function (oEvent) {
				var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
				if (typeof skey === "undefined" || skey === "" || skey === null) {
					this.getRouter().navTo("Authorize");
				} else {
					var ReleasejobId = oEvent.getParameter("arguments").RjobId;
					this._cycleStageId = oEvent.getParameter("arguments").RjobId;
					this.byId("idbc_RCycle").setText(oEvent.getParameter("arguments").Rlname);
					this.byId("idRlPipelineId_inv").setText(oEvent.getParameter("arguments").CycleId);
					this.byId("idBreadcrum_buildStages").setCurrentLocationText(ReleasejobId);
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
				this.byId("idWorkFlowStageResults").setBusy(true);
				var jobId = oEvent.getSource().getBindingContext("Stages").getObject().output.jenkinsJobName;
				var buildId = oEvent.getSource().getBindingContext("Stages").getObject().output.jenkinsBuildNumber;
				var sHeaders = {
					"Content-Type": "application/json",
					"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
				};
				var oModel_releasestageslog = new sap.ui.model.json.JSONModel();
				oModel_releasestageslog.loadData(this.getApiCall("log") + "?jobName=" + jobId +
					"&buildNumber=" + buildId, null, true, "GET", null, false, sHeaders);
				oModel_releasestageslog.attachRequestCompleted(function () {
					this._getDialog().open();
					var p = this.byId("idlog_RLcontent");
					p.removeAllContent();
					var sResponse = oModel_releasestageslog.getData()["response"];
					var r = JSON.stringify(sResponse).replace(/\\r\\n/g, "<br />");
					var oText2 = new sap.ui.core.HTML();
					oText2.setContent("<div>" + r + " </div>");
					oText2.placeAt(this.byId("idlog_RLcontent"));
					this.byId("idlog_RLcontent").setBusy(false);
					this.byId("idWorkFlowStageResults").setBusy(false);

				}.bind(this));

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
				if (oContext.getProperty("type") === "approvalTask" || oContext.getProperty("type") === "manualTask") {
					oUIControl = this.byId("humantask").clone(sId);
				}
				if (oContext.getProperty("type") === "deployTask") {
					oUIControl = this.byId("deploytask").clone(sId);
				}
				return oUIControl;
			},
			initiateAction: function (oEvent) {
				this.byId("idWorkFlowStageResults").setBusy(true);
				var oInput = {
					"humanResponse": {
						"msg": oEvent.getSource().getBindingContext("Stages").getProperty("waitUntil")
					},
					"actedBy": oEvent.getSource().getBindingContext("Stages").getProperty("assignedTo")
				};

				var action = "";
				var msg = "";

				if (oEvent.getSource().getText() === "Approve") {
					action = "COMPLETE";
					msg = "Approved !";
				}

				if (oEvent.getSource().getText() === "Complete") {
					action = "COMPLETE";
					msg = "Approved !";
				}

				if (oEvent.getSource().getText() === "Reject") {
					action = "REJECT";
					msg = "Rejected !";
				}
				var sHeaders = {
					"Content-Type": "application/json",
					"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
				};

				var taskId = oEvent.getSource().getBindingContext("Stages").getProperty("id");
				var oModel = new JSONModel();
				oModel.loadData("//"+sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/domain")+"/rateworkflow/tasks/" + taskId + "?action=" + action, JSON.stringify(oInput), true,
					"PUT", false, false, sHeaders);
				oModel.attachRequestCompleted(function () {
					MessageBox.show(("Release PipeLine Stage  " + oModel.getData().label + " " + msg), {
						title: "Message",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oActions) {
							if (oActions === "OK") {
								this.loadDatatoViewwithKey_GET_filter("getReleaseStages", "/" + oModel.getData().id,
									"Stages",
									sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
								this.getView().getModel("Stages").refresh();
								this.byId("idWorkFlowStageResults").setBusy(false);
							}
						}.bind(this)
					});
				}.bind(this));

			},
			navigateTo: function (oEvent) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var route = oEvent.getSource().getText();
				if (route === "Dashboard") {
					oRouter.navTo("Dashboard");
				} else if (route === "Release pipelines") {
					oRouter.navTo("RLpipelines");
				} else {
					oRouter.navTo("Cycles", {
						cycleId: this.byId("idRlPipelineId_inv").getText()
					});
				}
			},
			refreshData: function (oEvent) {
					this.refreshData_ui("getReleaseStages", "/" + this._cycleStageId, "Stages", this.byId("idWorkFlowStageResults"));
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