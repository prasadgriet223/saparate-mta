sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/model/json/JSONModel", "sap/m/MessageBox",
	"scp/com/saparate/utils/formatter", "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageBox, formatter, MessageToast) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.RegisterEnvironments", {
		formatter: formatter,

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
		onEnvFinished: function (oEvent) {
			var oList = oEvent.getSource();
			var oItems = oList.getItems();
			for (var i = 0; i < oItems.length; i++) {
				var oItem = oItems[i];
				var oDeleteControl = oItem.getDeleteControl();
				oDeleteControl.setIcon("sap-icon://delete");
				oDeleteControl.setTooltip("Delete");
			}
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

		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValue("");
		},

		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
		},

		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "scp.com.saparate.view.fragments.Enviromnent", this);
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

			if (this.byId("id_CFApiEndpoint").getValue() === "" || this.byId("ip_CFspace").getValue() === "" || this.byId("ip_EnvName").getValue() ===
				"" || this.byId("ip_CFUrl").getValue() === "" || this.byId("ip_CForg").getValue() === "" || this.byId("idCredSelect_Env").getSelectedKey() ===
				"") {
				sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("CredentialMandatory"));
			} else {

				var oModle_saveEnv = new JSONModel();
				var oDialogModel_data = oEvent.getSource().getParent().getModel("Data").getData();
				if (this._operation === "add") {
					oDialogModel_data["credentialKey"] = oEvent.getSource().getParent().getContent()[0].getContent()[11].getSelectedKey();
				}
				var sHeaders = {
					"Content-Type": "application/json",
					"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
				};
				oModle_saveEnv.loadData(this.getApiCall("addcfc"), JSON.stringify(oDialogModel_data), true,
					"POST", false, false, sHeaders);
				oModle_saveEnv.attachRequestCompleted(function () {
					this._getDialog().close();
					MessageBox.show((oModle_saveEnv.getData().name + "   has been Added/Updated." ), {
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

		},
		handleDelete: function (oEvent) {

			var envId = oEvent.getParameter("listItem").getBindingContext("Environments").getProperty("id");
			this._handleMessageBoxOpen(this.getView().getModel("i18n").getResourceBundle().getText("deleteEnvironment"), envId,
				"alert");

		},
		_handleMessageBoxOpen: function (sMessage, sEnvID, sMessageBoxType) {
			MessageBox.warning(sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this.byId("idEnviroments").setBusy(true);
						var oModel_deleteJob = new sap.ui.model.json.JSONModel();
						var sHeaders = {
							"Content-Type": "application/json",
							"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
						};
						oModel_deleteJob.loadData(this.getApiCall("deleteEnviroment") + "?id=" + sEnvID,
							null,
							true,
							"GET", null, false, sHeaders);

						oModel_deleteJob.attachRequestCompleted(function () {
							var msg = oModel_deleteJob.getData().response
							MessageToast.show(msg);

							this.loadDatatoViewwithKey_GET("getcfc", "Environments",
								sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
							this.getView().getModel("Environments").refresh(true);

							//	this.getView().setBusy();
							this.byId("idEnviroments").setBusy(false);
						}.bind(this));
					}
					//if (oAction === MessageBox.Action.NO) {

					//	}

				}.bind(this)
			});
		}

	});

});