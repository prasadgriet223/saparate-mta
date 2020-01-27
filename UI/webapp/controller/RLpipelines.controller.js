sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"scp/com/saparate/utils/formatter",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.RLpipelines", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.RLpipelines
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("RLpipelines").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.loadDatatoViewwithKey_GET("releaseworkflows", "workflows",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
				//this.byId("idtblAllPipelines").setBusy(false);
				this.byId("idBreadcrum_RLpipelines").setCurrentLocationText(this.getView().getModel("i18n").getResourceBundle().getText(
					"releasePipelines"));
			}
		},
		navigatetoCreateReleasePipeline: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("NewReleasePipeLine");
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "scp.com.saparate.view.fragments.triggerReleasePipeline", this);
				this._oDialog.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onCancel: function () {
			this._getDialog().close();
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
		initiateTriggerReleasePipeline: function (oEvent) {
			this._getDialog().open();
			var sBuildPipeLine = oEvent.getSource().getParent().getBindingContext("workflows").getObject().buildInput.buildPipelineJobName;
			this.getView().byId("idBuildnameTrigger_ReleasePipeline").setText(sBuildPipeLine);
			this.getView().byId("ip_cycle_name").setValue("");
			this.getView().byId("idReleasePipelineJobName").setText(oEvent.getSource().getParent().getBindingContext("workflows").getObject().name);
			this.getView().byId("idBuildnumberTrigger_ReleasePipeline").setBusy(true);
			this.loadDatatoViewwithKey_GET_filter_2("jobresults", "?jobName=" + sBuildPipeLine,
				"Jobdetails",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"), this.getView().byId("idBuildnumberTrigger_ReleasePipeline"));
		},
		navigatetoCycles: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Cycles", {
				cycleId: oEvent.getSource().getBindingContext("workflows").getProperty("id")
			});
		},

		onTriggerReleasePipeline: function (oEvent) {
			var oInput = new JSONModel({
				"pipelineId": "10000",
				"instantiatedBy": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/email"),
				"cycleName": this.getView().byId("ip_cycle_name").getValue(),
				"inputs": {
					"name1": "deployTest",
					"buildJobName": this.getView().byId("idBuildnameTrigger_ReleasePipeline").getText(),
					"buildNumber": this.getView().byId("idBuildnumberTrigger_ReleasePipeline").getSelectedKey()
				}
			});
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var selectedReleaseId = this.getView().byId("idReleasePipelineJobName").getText();
			var oModel_TriggerReleasePipeLine = new sap.ui.model.json.JSONModel();
			oModel_TriggerReleasePipeLine.loadData(this.getApiCall("runReleaseline") + "/" +
				selectedReleaseId, JSON.stringify(oInput.getData()), true,
				"POST", false, false, sHeaders);
			oModel_TriggerReleasePipeLine.attachRequestCompleted(function () {
				MessageBox.show(("Successfully created Release PipeLine Cycle Id# " + oModel_TriggerReleasePipeLine.getData().id), {
					title: "Message",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oActions) {
						if (oActions === "OK") {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("WorkflowCycleStages", {
								RjobId: oModel_TriggerReleasePipeLine.getData().id,
								CycleId: oModel_TriggerReleasePipeLine.getData().pipelineId.split(":")[0],
								Rlname: oModel_TriggerReleasePipeLine.getData().label
							});
						}
					}.bind(this)
				});
			}.bind(this));
			this._getDialog().close();
		}
	});

});