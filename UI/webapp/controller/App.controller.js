sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"scp/com/saparate/utils/formatter"
], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("scp.com.saparate.controller.App", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.App
		 */
		onInit: function () {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("App").attachPatternMatched(this._onObjectMatched, this);

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.App
		 */
		onBeforeRendering: function () {

		},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.App
		 */
		onAfterRendering: function () {

		},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.App
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			this.getView().setModel(sap.ui.getCore().getModel("oKeyModel"), "oKeyModel");
			this.byId("idBtnusertxt").setText(sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/user"));
				//	var skeyff = ;
		//	console.log(skeyff);
			//	sap.ui.getCore().setModel(oModelSaveReleasePipeline, "oModelSaveReleasePipeline");

			//	this.getView().setModel(oModel, sView);
		},
		onPressExpand: function () {
			var toolPage = this.byId("toolPage");
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		gotoDashboard: function () {
			this.getRouter().navTo("Dashboard");
		},
		gotoUserStory: function () {
			this.getRouter().navTo("UserStoryBoard");
		},
		gotoProjects: function () {
			this.getRouter().navTo("UserStoryBoard");
		},
		gotoReleasePipeline: function () {
			this.getRouter().navTo("RLpipelines");
		},
		gotoPipelines: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("jobs", {
				from: "tonewpipeline"
			});
		},
		gotoEnviroments: function () {
			this.getRouter().navTo("RegisterEnvironments");
		},
		gotoCredentials: function () {
			this.getRouter().navTo("Credentials");
		},
		gotoInbox: function () {
			this.getRouter().navTo("Inbox");
		}
	});
});