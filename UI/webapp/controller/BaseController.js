sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, JSONModel) {
	"use strict";
	return Controller.extend("scp.com.saparate.controller.BaseController", {
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		getApiCall: function (sProperty) {
			var serverName = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/domain");
			return this.getOwnerComponent().getModel("servers").getProperty(sProperty).replace("{server_name}", serverName);
		},
		authModel: function () {
			//return this.getOwnerComponent().getModel();
		},
		randomCalculations: function (fValue1, fValue2) {
			return fValue1 + fValue2;
		},
		loadDatatoViewwithKey_GET: function (sProperty, sView, sKey) {
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel = new JSONModel();
			this.getView().setBusy(true);
			oModel.loadData(this.getApiCall(sProperty), null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
				this.getView().setBusy(false);
			}.bind(this));
		},
		loadDatatoViewwithKey_GET_ctrl: function (sProperty, sView, sKey, oCtrl) {
			oCtrl.setBusy(true);
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel = new JSONModel();
			this.getView().setBusy(true);
			oModel.loadData(this.getApiCall(sProperty), null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
				this.getView().setBusy(false);
				oCtrl.setBusy(false);
			}.bind(this));
		},
		loadDatatoViewwithKey_GET_filter: function (sProperty, sfilter, sView, sKey) {
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty) + sfilter, null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
			}.bind(this));
		},
		loadDatatoViewwithKey_GET_filter_2: function (sProperty, sfilter, sView, sKey, oCtrl) {
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty) + sfilter, null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
				oCtrl.setBusy(false);
			}.bind(this));
		},
		loadDatatoViewwithKey_GET_filter_3: function (sProperty, sfilter, sView, sKey, oCtrl, bCrum_txt_val) {
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty) + sfilter, null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
				oCtrl.setBusy(false);
				bCrum_txt_val.setCurrentLocationText(this.getView().getModel("Cycledetails").getData().items[0].label);
			}.bind(this));
		},
		loadDatatoViewwithKey_POST: function (sProperty, oInput, sView, sKey) {
			var oModel = new JSONModel();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			oModel.loadData(this.getApiCall(sProperty), JSON.stringify(oInput), true,
				"POST", false, false, sHeaders);

			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
			}.bind(this));
		},
		loadDatatoViewwithKey_POST_2: function (sProperty, oInput, sView, sKey, oCtrl) {
			var oModel = new JSONModel();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			oModel.loadData(this.getApiCall(sProperty), JSON.stringify(oInput), true,
				"POST", false, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
				oCtrl.setBusy(false);
			}.bind(this));
		},
		refreshData_ui: function (sProperty, sfilter, sView, oCtrl) {
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty) + sfilter, null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
				this.getView().getModel(sView).refresh(true);
				oCtrl.getModel(sView).refresh(true);
				oGlobalBusyDialog.close();
			}.bind(this));
		},
		handleValidationError: function (oEvent) {
		
		},
		handleValidationSuccess: function (oEvent) {
		
		}
	});

});