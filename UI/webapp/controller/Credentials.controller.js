sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.Credentials", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Credentials
		 */
		onInit: function () {

			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Credentials").attachPatternMatched(this._onObjectMatched, this);
			this._operation = "";
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "scp.com.saparate.view.fragments.Credentials", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onFinished: function (oEvent) {
			var oList = oEvent.getSource();
			var oItems = oList.getItems();
			for (var i = 0; i < oItems.length; i++) {
				var oItem = oItems[i];
				var oDeleteControl = oItem.getDeleteControl();
				oDeleteControl.setIcon("sap-icon://delete");
				oDeleteControl.setTooltip("Delete");
			}
		},
		handleDelete: function (oEvent) {

			var crId = oEvent.getParameter("listItem").getBindingContext("Credentials").getProperty("id");
			this._handleMessageBoxOpen(this.getView().getModel("i18n").getResourceBundle().getText("deleteCredential"), crId,
				"alert");
	
		},

		_handleMessageBoxOpen: function (sMessage, sCredID, sMessageBoxType) {
			MessageBox.warning(sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this.byId("idCredentialsList").setBusy(true);
						var oModel_deleteJob = new sap.ui.model.json.JSONModel();
						var sHeaders = {
							"Content-Type": "application/json",
							"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
						};
						oModel_deleteJob.loadData(this.getApiCall("deletecredential") + "?id=" + sCredID,
							null,
							true,
							"GET", null, false, sHeaders);

						oModel_deleteJob.attachRequestCompleted(function () {
							var msg = oModel_deleteJob.getData().response
							MessageToast.show(msg);

							this.loadDatatoViewwithKey_GET("credentials", "Credentials",
								sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

							this.getView().getModel("Credentials").refresh(true);

							//	this.getView().setBusy();
							this.byId("idCredentialsList").setBusy(false);
						}.bind(this));
					}
					//if (oAction === MessageBox.Action.NO) {

					//	}

				}.bind(this)
			});
		},

		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValue("");
		},

		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
		},
		onregisterCredential: function () {
			var oModel_empty = new JSONModel({
				"name": "",
				"userName": "",
				"password": "",
				"scope": "GLOBAL"
			});
			this._getDialog().setModel(oModel_empty, "Data");
			this._operation = "add";
			this._getDialog().open();

		},
		editCredentialOpen: function (oEvent) {
			this._operation = "edit";
			var oCtx = oEvent.getSource().getBindingContext("Credentials").getObject();
			var oModel = new JSONModel(oCtx);
			this._getDialog().setModel(oModel, "Data");
			this._getDialog().open();
		},
		onSaveEditCredential: function (oEvent) {

			if (this.byId("idCrdName").getValue() === "" || this.byId("idCrdUserName").getValue() === "" || this.byId("idCrdPW").getValue() ===
				"") {
				sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("CredentialMandatory"));
			} else {

				var oModle_saveCred = new JSONModel();
				var oDialogModel_data = oEvent.getSource().getParent().getModel("Data").getData();
				// if (this._operation === "add") {
				// 	oDialogModel_data["credentialKey"] = oEvent.getSource().getParent().getContent()[0].getContent()[11].getSelectedKey();
				// }
				var sHeaders = {
					"Content-Type": "application/json",
					"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
				};
				oModle_saveCred.loadData(this.getApiCall("addorupdate"), JSON.stringify(oDialogModel_data),
					true,
					"POST", false, false, sHeaders);
				oModle_saveCred.attachRequestCompleted(function () {
					this._getDialog().close();
					MessageBox.show((oModle_saveCred.getData().name + "  Credential Created"), {
						title: "Result",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oActions) {
							if (oActions === "OK") {
								this.loadDatatoViewwithKey_GET("credentials", "Credentials",
									sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
							}
						}.bind(this)
					});
				}.bind(this));

			}

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.Credentials
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.Credentials
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.Credentials
		 */
		//	onExit: function() {
		//
		//	}

		_onObjectMatched: function (oEvent) {
			this.loadDatatoViewwithKey_GET("credentials", "Credentials",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
		},
		onCancel: function (oEvent) {
			oEvent.getSource().getParent().close();
		},
	});

});