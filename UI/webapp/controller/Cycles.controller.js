sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"scp/com/saparate/controller/BaseController",
	"scp/com/saparate/utils/formatter"
], function (Controller, BaseController, formatter) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.Cycles", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Cycles
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Cycles").attachPatternMatched(this._onObjectMatched, this);
			this._cycleId = "";
		},
		_onObjectMatched: function (oEvent) {
			this._cycleId = oEvent.getParameter("arguments").cycleId;
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.byId("idPipeLineCycleResults").setBusy(true);
				this.loadDatatoViewwithKey_GET_filter_3("getCyclesforRelease", "/" + this._cycleId,
					"Cycledetails",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"), this.byId("idPipeLineCycleResults"), this.byId(
						"idBreadcrum_builds"));
			}
		},
		handleSelectionChange_releaseCycle: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("WorkflowCycleStages", {
				RjobId: oEvent.getSource().getBindingContext("Cycledetails").getObject().id,
				CycleId: oEvent.getSource().getBindingContext("Cycledetails").getObject().pipelineId.split(":")[0],
				Rlname: oEvent.getSource().getBindingContext("Cycledetails").getObject().label
			});
		},
		navigateTo: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var route = oEvent.getSource().getText();
			if (route === "Dashboard") {
				oRouter.navTo("Dashboard");
			}
			if (route === "Release pipelines") {
				oRouter.navTo("RLpipelines");
			}
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.Cycles
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.Cycles
		 */
		onAfterRendering: function () {
			//	this.byId("idBreadcrum_builds").setCurrentLocationText(this.getView().getModel("Cycledetails").getData().items[0].label);
		},
		refreshData_Cycles: function () {
				this.refreshData_ui("getCyclesforRelease",  "/" + this._cycleId, "Cycledetails", this.byId("idPipeLineCycleResults"));
			}
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf scp.com.saparate.view.Cycles
			 */
			//	onExit: function() {
			//
			//	}

	});

});