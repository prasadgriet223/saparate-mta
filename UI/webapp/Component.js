sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"scp/com/saparate/model/models"
], function (UIComponent, Device, models) {
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
			UIComponent.prototype.init.apply(this, arguments);
			// enable routing
			this.getRouter().initialize();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var oKeyModel_data = {
				"saparate": {
					"key": ""
				}
			};
			var oKeyModel = new sap.ui.model.json.JSONModel(oKeyModel_data);
			sap.ui.getCore().setModel(oKeyModel, "oKeyModel");

		}
	});
});