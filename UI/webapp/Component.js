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
					"email":""
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
		},
		getSkey: function () {
			// var oModel = new JSONModel();
			// oModel.loadData("/getuserinfo");
			// var that = this;
			// oModel.attachRequestCompleted(function () {
			// 	var data = oModel.getData();
			// 	sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/email", data.id);
			// 	var sHeaders = {
			// 		"Authorization": "Bearer " + data.token.accessToken
			// 	};
			// 	var oModel_2 = new JSONModel();
			// 	oModel_2.loadData(data.token.oauthOptions.url + "/userinfo", null, true,
			// 		"GET",
			// 		null, false, sHeaders);
			// 	oModel_2.attachRequestCompleted(function () {
			// 		data["userUUID"] = oModel_2.getData().user_id;
					
			// 		var oModel_3 = new JSONModel();
			// 		oModel_3.loadData("https://na1.saparate.com/saparate/authorization/apitoken", JSON.stringify(data), true, "POST", false,
			// 			false, {
			// 				"Content-Type": "application/json"
			// 			});
			// 		oModel_3.attachRequestCompleted(function () {
			// 			sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/key", oModel_3.getData());
			// 			that.getRouter().initialize();
			// 			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			// 			sap.ui.core.BusyIndicator.hide();
			// 			if (typeof skey === "undefined" || skey === "" || skey === null) {
			// 				that.getRouter().navTo("Authorize");
			// 			} else {
			// 				that.getRouter().navTo("Dashboard");
			// 			}
			// 		});
			// 	});
			// });	
		//	test code
			sap.ui.getCore().getModel('oKeyModel').setProperty("/saparate/key", {
				"authorizationToken": "d084450d-26b3-440a-ad2c-d22b86f8e99b"
			});
			this.getRouter().initialize();
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			sap.ui.core.BusyIndicator.hide();
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.getRouter().navTo("Dashboard");
			}
		//	test code
		}
	});
});