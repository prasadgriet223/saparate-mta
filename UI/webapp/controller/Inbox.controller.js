sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox", "scp/com/saparate/utils/formatter"
], function (BaseController, Controller, JSONModel, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.Inbox", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Inbox
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Inbox").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function (oEvent) {
			// this.loadDatatoViewwithKey_GET_filter("getInbox", "?userid=michaeljames7869@gmail.com", "Inbox",
			// 	sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
			this.loadDatatoViewwithKey_GET_filter("getInbox", "?userid=" + sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/email"),
				"Inbox",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
		},

		onAcceptButtonPress: function (oEvent) {

			var oInput = {
				"humanResponse": {
					"msg": oEvent.getSource().getBindingContext("Inbox").getProperty("humanTask/waitUntil")
				},
				"actedBy": oEvent.getSource().getBindingContext("Inbox").getProperty("humanTask/assignedTo")
			};

			var taskId = oEvent.getSource().getBindingContext("Inbox").getProperty("taskInstanceId");
			var action = "COMPLETE";

			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			this.getView().setBusy(true);
			var oModel = new JSONModel();
			oModel.loadData("//"+sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/domain")+"/rateworkflow/tasks/" + taskId + "?action=" + action, JSON.stringify(oInput), true,
				"PUT", false, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				MessageBox.show(("Stage  " + oModel.getData().label + " Approved!  "), {
					title: "Message",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oActions) {
						//	oEvent.getSource().setEnabled(false) ;
						if (oActions === "OK") {
							this.loadDatatoViewwithKey_GET_filter("getInbox", "?userid=" + sap.ui.getCore().getModel('oKeyModel').getProperty(
									"/saparate/email"), "Inbox",
								sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

							this.getView().getModel("Inbox").refresh();
						}
					}.bind(this)
				});
			}.bind(this));
			this.getView().setBusy(false);

		},
		showMessageBox: function () {

		},
		initiateAction: function (oEvent) {
			//	this.byId("idWorkFlowStageResults").setBusy(true);

			var oInput = {
				"humanResponse": {
					"msg": oEvent.getSource().getBindingContext("Inbox").getProperty("humanTask/waitUntil")
				},
				"actedBy": oEvent.getSource().getBindingContext("Inbox").getProperty("humanTask/assignedTo")
			};

			var taskId = oEvent.getSource().getBindingContext("Inbox").getProperty("taskInstanceId");

			var action = "";
			var msg = "";

			if (oEvent.getSource().getText() === "Approve") {
				action = "COMPLETE";
				msg = "Approved !";
			}

			if (oEvent.getSource().getText() === "Complete") {
				action = "COMPLETE";
				msg = "Completed !";
			}

			if (oEvent.getSource().getText() === "Reject") {
				action = "REJECT";
				msg = "Rejected !";
			}
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};

			var oModel = new JSONModel();
			oModel.loadData("//"+sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/domain")+"/rateworkflow/tasks/" + taskId + "?action=" + action, JSON.stringify(oInput), true,
				"PUT", false, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				MessageBox.show(("Release PipeLine Stage  " + oModel.getData().label + " " + msg), {
					title: "Message",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oActions) {
						if (oActions === "OK") {
							this.loadDatatoViewwithKey_GET_filter("getInbox", "?userid=" + sap.ui.getCore().getModel('oKeyModel').getProperty(
									"/saparate/email"), "Inbox",
								sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
							this.getView().getModel("Inbox").refresh();
						}
					}.bind(this)
				});
			}.bind(this));
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.Inbox
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.Inbox
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.Inbox
		 */
		//	onExit: function() {
		//
		//	}

	});
});