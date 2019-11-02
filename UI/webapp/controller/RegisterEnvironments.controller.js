sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/model/json/JSONModel", "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.RegisterEnvironments", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.RegisterEnvironments
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("RegisterEnvironments").attachPatternMatched(this._onObjectMatched, this);
			this._operation = "";
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.RegisterEnvironments
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.RegisterEnvironments
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.RegisterEnvironments
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			this.loadDatatoViewwithKey_GET("getcfc", "Environments",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
			this.loadDatatoViewwithKey_GET("credentials", "credentials",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
		},
		onregisterEnviroment: function (oEvent) {
			var oModel_empty = new JSONModel({
				"name": "",
				"url": "",
				"space": "",
				"org": "",
				"apiendpoint": ""
			});
			this._getDialog().setModel(oModel_empty, "Data");
			this._operation = "add";
			this._getDialog().open();
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("scp.com.saparate.view.fragments.Enviromnent", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onCancel: function (oEvent) {
			oEvent.getSource().getParent().close();
		},
		editEnvironmentFragment: function (oEvent) {
			this._operation = "edit";
			var oCtx = oEvent.getSource().getBindingContext("Environments").getObject();
			var oModel = new JSONModel(oCtx);
			this._getDialog().setModel(oModel, "Data");
			this._getDialog().open();
		},
		onSaveEditEnvironment: function (oEvent) {
			var oModle_saveEnv = new JSONModel();
			var oDialogModel_data = oEvent.getSource().getParent().getModel("Data").getData();
			if (this._operation === "add") {
				oDialogModel_data["credentialKey"] = oEvent.getSource().getParent().getContent()[0].getContent()[11].getSelectedKey();
			}
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			oModle_saveEnv.loadData(this.getOwnerComponent().getModel("servers").getProperty("addcfc"), JSON.stringify(oDialogModel_data), true,
				"POST", false, false, sHeaders);
			oModle_saveEnv.attachRequestCompleted(function () {
				this._getDialog().close();
				MessageBox.show( (oModle_saveEnv.getData().name ), {
					title: "Result",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oActions) {
						if (oActions === "OK") {
							this.loadDatatoViewwithKey_GET("getcfc", "Environments",
								sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
						}
					}.bind(this)
				});
			}.bind(this));
		}
	});

});