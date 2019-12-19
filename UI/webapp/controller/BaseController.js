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
			return this.getOwnerComponent().getModel("servers").getProperty(sProperty);
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
		}
	});

});