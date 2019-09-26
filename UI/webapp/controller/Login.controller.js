sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("scp.com.saparate.controller.Login", {
		onInit: function () {

		},
		/**
		 *@memberOf scp.com.saparate.controller.Login
		 */
		toLogin: function (oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("App");

		}
	});
});