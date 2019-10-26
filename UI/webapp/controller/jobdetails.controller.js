sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"scp/com/saparate/utils/formatter"
], function (Controller, formatter) {
	"use strict";
	return Controller.extend("scp.com.saparate.controller.jobdetails", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.jobdetails
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("jobdetails").attachPatternMatched(this._onObjectMatched, this);
			this._jobid = "";
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.jobdetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.jobdetails
		 */
		//	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.jobdetails
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			//https://na2.saparate.com/saparate/jenkins/getJobResults?jobName=paramTest	
			var jobId = oEvent.getParameter("arguments").jobId;
			var from = oEvent.getParameter("arguments").from;
			this._jobid = jobId;
			var oModel_jobdetails = new sap.ui.model.json.JSONModel();
			// if (jobId === "Recent Builds" && from === "recentpipeline") {
			// 	oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("latestBuildResults"));

			// } else {
				oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("jobresults") + "?jobName=" + jobId);
				this.byId("idPageBuildResults").setTitle("Build Results--" + jobId);

		//	}

			this.getView().setModel(oModel_jobdetails, "Jobdetails");

		},
		initiateTriggerJob: function (oEvent) {
			var oModel_triggerJob = new sap.ui.model.json.JSONModel();
			oModel_triggerJob.attachRequestSent(function () {
				this.getView().setBusy(true);
			}.bind(this));
			var jobids = {
				"jobName": this._jobid
			};
			oModel_triggerJob.loadData(this.getOwnerComponent().getModel("servers").getProperty("triggerjob"), JSON.stringify(jobids), true,
				"POST", false, false, {
					"Content-Type": "application/json"
				});
			oModel_triggerJob.attachRequestCompleted(function () {
				this.getView().setBusy(false);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("jobdetails", {
					jobId: this._jobid
				});
			}.bind(this));
		},
		navigatetobuildpipelines: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.navTo("jobs");

			oRouter.navTo("jobs", {
				from: "tonewpipeline"
			});
		},
		/**
		 *@memberOf scp.com.saparate.controller.jobdetails
		 */
		navigatetoBuildStages: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var buildId = oEvent.getSource().getBindingContext("Jobdetails").getProperty("number");
			oRouter.navTo("buildStages", {
				jobId: this._jobid,
				buildid: buildId
			});
			//	oRouter.navTo("buildStages");
		}
	});
});