sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"scp/com/saparate/utils/formatter",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, MessageBox) {
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
				this._cycleId = ReleasejobId;
				this.loadDatatoViewwithKey_GET_filter("getReleaseStages", "/" + ReleasejobId,
					"Stages",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
			}
		},
		initiateAction: function (oEvent) {
				var oInput = {
					"humanResponse": {
						"msg": oEvent.getSource().getBindingContext("Stages").getProperty("waitUntil")
					}
				};
				var sHeaders = {
					"Content-Type": "application/json",
					"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
				};
				this.getView().setBusy(true);
				var taskId = oEvent.getSource().getBindingContext("Stages").getProperty("id");
				var oModel = new JSONModel();
				oModel.loadData("//na1.saparate.com/rateworkflow/tasks/" + taskId + "?action=COMPLETE", JSON.stringify(oInput), true,
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
								this.loadDatatoViewwithKey_GET_filter("getReleaseStages", "/" + this._cycleId ,
									"Stages",
									sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
								this.getView().getModel("Stages").refresh();
							}
						}.bind(this)
					});
				}.bind(this));

				this.getView().setBusy(false);
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