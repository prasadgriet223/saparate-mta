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
			sap.ui.core.BusyIndicator.show();
			var jobId = oEvent.getParameter("arguments").jobId;
			this._jobid = jobId;

			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.byId("idPipeLineBuildResults").setBusy(true);
				this.loadDatatoViewwithKey_GET_filter_2("jobresults", "?jobName=" + jobId, "Jobdetails",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"),this.byId("idPipeLineBuildResults"));
				this.byId("idBreadcrum_builds").setCurrentLocationText(jobId);

			}
			sap.ui.core.BusyIndicator.hide();
		},
		handleSelectionChange: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("buildStages", {
				jobId: oEvent.getSource().getBindingContext("Jobdetails").getObject().name,
				buildid: oEvent.getSource().getBindingContext("Jobdetails").getObject().number

			});
		},
		navigateTo: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var route = oEvent.getSource().getText();
			if (route === "Dashboard") {
				oRouter.navTo("Dashboard");
			}
			if (route === "Build pipelines") {
				oRouter.navTo("jobs");
			}
		},
		refreshData: function (oEvent) {
			// this.loadDatatoViewwithKey_GET_filter("jobresults", "?jobName=" + this._jobid, "Jobdetails",
			// 	sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

			// this.getView().getModel("Jobdetails").refresh();
			
				this.refreshData_ui("jobresults", "?jobName=" + this._jobid, "Jobdetails",this.byId("idPipeLineBuildResults"));
			
		}
	});

});