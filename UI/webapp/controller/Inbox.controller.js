sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, Controller, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.Inbox", {

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
			this.loadDatatoViewwithKey_GET_filter("getInbox", "?userid="+sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/email"), "Inbox",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
			
		},
		
		onAcceptButtonPress: function(oEvent) {
			var taskId = oEvent.getSource().getBindingContext("Inbox").getProperty("taskInstanceId");
			/*var oModel = new JSONModel(oCtx);*/
			/*oModel.getData();*/
			
			var oInput = {
				"humanResponse": {
					"msg": "accept message"
				}
			};
			var action = "COMPLETE";
			/*if (oEvent.getSource().getText() === "Reject")
				action = "REJECT";*/
				
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			this.getView().setBusy(true);
			var oModel = new JSONModel();
			oModel.loadData("//na1.saparate.com/rateworkflow/tasks/" + taskId + "?action=" + action, JSON.stringify(oInput), true,
				"PUT", false, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				MessageBox.show(("Stage  " + oModel.getData().label + " Approved!  "), {
					title: "Message",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oActions) {
						//	oEvent.getSource().setEnabled(false) ;
						if (oActions === "OK") {
							
							//need to call task inbox api again
							var tasks = {"number":1,"totalItems":1,"size":1,"totalPages":1,"items":[{"humanTaskId":10001,"taskInstanceId":"af582e386a034a7da76740ad9ffb70fd","assigneeId":"2334345","assigneeType":"USER","assigneeName":"user1@releaseowl.com","businessLogicID":null,"assignDate":"2019-12-20"}]};
							var oModel2= new JSONModel(tasks.items);
							this.getView().setModel(oModel2, "Inbox");
							this.getView().getModel("Inbox").refresh();
						}
					}.bind(this)
				});
			}.bind(this));
			this.getView().setBusy(false);
			
		},
		showMessageBox: function() {
			
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