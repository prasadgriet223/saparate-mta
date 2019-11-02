sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"scp/com/saparate/utils/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.Builds", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Builds
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Builds").attachPatternMatched(this._onObjectMatched, this);
			this._jobid = "";
			// this._from = "";
			// this._to = "";
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.Builds
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.Builds
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.Builds
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			var jobId = oEvent.getParameter("arguments").jobId;
			this._jobid = jobId;
			this.loadDatatoViewwithKey_GET_filter("jobresults","?jobName=" + jobId,"Jobdetails", 
			sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
			// var oModel_jobdetails = new sap.ui.model.json.JSONModel();
			// oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("jobresults") + "?jobName=" + jobId);
			// this.getView().setModel(oModel_jobdetails, "Jobdetails");
			this.byId("idBreadcrum_builds").setCurrentLocationText(jobId);
		},
		handleSelectionChange: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("buildStages", {
				jobId: oEvent.getParameter("listItem").getCells()[0].getText(),
				buildid: oEvent.getParameter("listItem").getCells()[1].getText()
			});
		},
		navigateTo: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var route = oEvent.getSource().getText();
			if (route === "Dashboard") {
				oRouter.navTo("Dashboard");
			}
			if (route === "Build PipeLines") {
				oRouter.navTo("jobs");
			}
		},
		refreshData: function (oEvent) {
			this.getView().getModel("Jobdetails").loadData(this.getOwnerComponent().getModel("servers").getProperty("jobresults") + "?jobName=" +
				this._jobid);
			this.getView().getModel("Jobdetails").refresh();
		}
	});

});