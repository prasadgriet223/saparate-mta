	sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"scp/com/saparate/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";
	return UIComponent.extend("scp.com.saparate.Component", {
		metadata: {
			manifest: "json"
		},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// var customData = {};
			// call the base component's init function
			sap.ui.core.BusyIndicator.show();
			UIComponent.prototype.init.apply(this, arguments);
			// enable routing
			// set the device model

			this.setModel(models.createDeviceModel(), "device");

			var oKeyModel_data = {
				"saparate": {
					"key": "",
					"email":"",
					"domain":""
				}
			};

			var oReleasePipeLine = {
				"workflowId": "",
				"label": "",
				"createdBy": "",
				"releasePipelineBuildInput": {
					"buildPipelineJobName": "",
					"buildPipelineBuildID": ""
				},
				"tasks": []
			};

			var oModelSaveReleasePipeline = new sap.ui.model.json.JSONModel(oReleasePipeLine);
			sap.ui.getCore().setModel(oModelSaveReleasePipeline, "oModelSaveReleasePipeline");

			var oKeyModel = new sap.ui.model.json.JSONModel(oKeyModel_data);
			sap.ui.getCore().setModel(oKeyModel, "oKeyModel");

			this.getSkey();
			var domainName = window.location.origin.split("//")[1].split("-")[0];
			if ( domainName === "p2001579154trial" || domainName === "webidetesting4718256") {
				sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/domain", "na2.saparate.com");
			} else if ( domainName === "p2001885952trial") {
				sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/domain", "na1.saparate.com");
			}
		},
		getSkey: function () {
			var oModel = new JSONModel();
			oModel.loadData("/getuserinfo");
			var that = this;
			oModel.attachRequestCompleted(function () {
				var data = oModel.getData();
				sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/email", data.id);
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
					var serverName = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/domain");
					var apiTokenUrl = "https://{server_name}/saparate/authorization/apitoken";
					apiTokenUrl = apiTokenUrl.replace("{server_name}", serverName);
					oModel_3.loadData(apiTokenUrl, JSON.stringify(data), true, "POST", false,
						false, {
							"Content-Type": "application/json"
						});
					oModel_3.attachRequestCompleted(function () {
						sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/key", oModel_3.getData());
						that.getRouter().initialize();
						var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
						sap.ui.core.BusyIndicator.hide();
						if (typeof skey === "undefined" || skey === "" || skey === null) {
							that.getRouter().navTo("Authorize");
						} else {
							that.getRouter().navTo("Dashboard");
						}
					});
				});
			});	
		//	test code
			// sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/key", {
			// 	"authorizationToken": "35393d6c-8d4a-453d-b8a3-e157bab006f3"
			// });
			// this.getRouter().initialize();
			// var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			// sap.ui.core.BusyIndicator.hide();
			// if (typeof skey === "undefined" || skey === "" || skey === null) {
			// 	this.getRouter().navTo("Authorize");
			// } else {
			// 	this.getRouter().navTo("Dashboard");
			// }
		//	test code
		}
	});
});