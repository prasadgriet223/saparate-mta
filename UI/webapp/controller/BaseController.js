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
		loadDatatoViewwithKey_GET: function (sProperty, sModelName, sKey) {
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sKey
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty), null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				return this.getView().setModel(oModel, sModelName);
			}).bind(this);
		},
		getSkey: function () {
			this.getOwnerCompent.getModel("loadsKey_Async").loadData("/getuserinfo").
			then(function (data) {
					data = JSON.parse(data);
					var sHeaders = {
						"Authorization": "Bearer" + data.token.accessToken
					};
					return this.getOwnerCompent.getModel("loadsKey_Async").loadData(data.token.oauthOptions.url + "/getuserinfo", null, true, "GET",
							null, false, sHeaders)
						.then(function (response) {
							data["userUUID"] = response.user_id;
							var oModel = new JSONModel();
							return oModel(this.getApiCall("apitoken"), JSON.stringify(data), true, "POST", false, false, {
								"Content-Type": "application/json"
							}).then(function (sKey) {
								return sKey;
							});
						}).bind(this);
				});
		}
	});

});