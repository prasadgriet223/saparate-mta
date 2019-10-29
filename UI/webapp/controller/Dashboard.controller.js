sap.ui.define(["scp/com/saparate/controller/BaseController", "scp/com/saparate/utils/formatter"], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("scp.com.saparate.controller.Dashboard", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.Dashboard
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("Dashboard").attachPatternMatched(this._onObjectMatched, this);
		},
		/**
		 *@memberOf scp.com.saparate.controller.Dashboard
		 */
		hideside: function (oEvent) {

		},
		_onObjectMatched: function (oEvent) {
			var oModel_jobdetails = new sap.ui.model.json.JSONModel();
			//	oModel_jobdetails.loadData(this.getOwnerComponent().getModel("servers").getProperty("latestBuildResults"));
			this.getView().setModel(oModel_jobdetails, "Jobdetails");
			this.byId("idBuildstblHdr").setText("Recent Builds");
			this.byId("idBreadcrum_dashboard").setCurrentLocationText("Dashboard");
		},
		handleSelectionChange: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("buildStages", {
				jobId: oEvent.getParameter("listItem").getCells()[0].getText(),
				buildid: oEvent.getParameter("listItem").getCells()[1].getText()
			});

		},
		refreshData: function (oEvent) {
			//	this.getView().getModel("Jobdetails").loadData(this.getOwnerComponent().getModel("servers").getProperty("latestBuildResults"));
			this.getView().getModel("Jobdetails").refresh();
		}
	});
});