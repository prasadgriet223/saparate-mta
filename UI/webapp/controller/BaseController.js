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
				"Authorization": sKey
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty), null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
			}.bind(this));
		},
		
		loadDatatoViewwithKey_GET_filter: function (sProperty,sfilter, sView, sKey) {
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sKey
			};
			var oModel = new JSONModel();
			oModel.loadData(this.getApiCall(sProperty)+sfilter, null, true, "GET", null, false, sHeaders);
			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
			}.bind(this));
		},
		
		loadDatatoViewwithKey_POST: function (sProperty, oInput, sView, sKey) {
			var oModel = new JSONModel();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sKey
			};
			oModel.loadData(this.getApiCall(sProperty), JSON.stringify(oInput), true,
				"POST", false, false, sHeaders);

			oModel.attachRequestCompleted(function () {
				this.getView().setModel(oModel, sView);
			}.bind(this));
		},

		getSkey: function () {
			var oModel = new JSONModel();
			oModel.loadData("/getuserinfo");
			var that = this;
			oModel.attachRequestCompleted(function () {
				var data = oModel.getData();
				var sHeaders = {
					"Authorization": "Bearer " + data.token.accessToken
				};
				var oModel_2 = new JSONModel();
				oModel_2.loadData(data.token.oauthOptions.url + "/userinfo", null, true,
					"GET",
					null, false, sHeaders);
				oModel_2.attachRequestCompleted(function () {
					data["userUUID"] = oModel_2.getData().user_id;
					var oModel_3 = new JSONModel();
					oModel_3.loadData(that.getApiCall("apitoken"), JSON.stringify(data), true, "POST", false, false, {
						"Content-Type": "application/json"
					});
					oModel_3.attachRequestCompleted(function () {
						//console.log(oModel_3.getData());
					});
				});
			});

			// then(function (data) {
			// 	console.log(data);
			// 	data = JSON.parse(data);
			// 	var sHeaders = {
			// 		"Authorization": "Bearer" + data.token.accessToken
			// 	};
			// 	return this.getOwnerComponent().getModel("loadsKey_Async").loadData(data.token.oauthOptions.url + "/userinfo", null, true,
			// 			"GET",
			// 			null, false, sHeaders)
			// 		.then(function (response) {
			// 			data["userUUID"] = response.user_id;
			// 			var oModel = new JSONModel();
			// 			return oModel(this.getApiCall("apitoken"), JSON.stringify(data), true, "POST", false, false, {
			// 				"Content-Type": "application/json"
			// 			}).then(function (sKey) {
			// 				return sKey;
			// 			});
			// 		}).bind(this);
			// });
			sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/key", "7a2265bb-2ef7-414e-bce7-a7e9b7669732");
			return "7a2265bb-2ef7-414e-bce7-a7e9b7669732";
		}
	});

});