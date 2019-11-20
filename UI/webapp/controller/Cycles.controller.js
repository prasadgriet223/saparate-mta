sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"scp/com/saparate/controller/BaseController"
], function (Controller,BaseController) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.Cycles", {

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
				sap.ui.core.BusyIndicator.show();
				var cycleId = oEvent.getParameter("arguments").cycleId;

				var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
				if (typeof skey === "undefined" || skey === "" || skey === null) {
					this.getRouter().navTo("Authorize");
				} else {

					this.loadDatatoViewwithKey_GET_filter("getCyclesforRelease", "/" + cycleId,
						"Cycledetails",
						sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

				}
				sap.ui.core.BusyIndicator.hide();
			}
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
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.Cycles
		 */
		//	onExit: function() {
		//
		//	}

	});

});