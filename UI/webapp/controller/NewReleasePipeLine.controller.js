sap.ui.define([
	"scp/com/saparate/controller/BaseController", 'sap/suite/ui/commons/ProcessFlowLaneHeader', 'sap/m/Dialog', "sap/m/Button",
	'sap/m/ButtonType', 'sap/m/Input', 'sap/ui/layout/form/SimpleForm', 'sap/m/Label'
], function (BaseController, ProcessFlowLaneHeader, Dialog, Button, ButtonType, Input, SimpleForm, Label) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.NewReleasePipeLine", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.NewReleasePipeLine
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("NewReleasePipeLine").attachPatternMatched(this._onObjectMatched, this);
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(10);
			oModel.setData({
				"lanes": []
			});
			this.oProcessFlow = this.getView().byId("idReleasePipelineProcessFlow");
			this.oProcessFlow.setModel(oModel, "js");

		},
		openBuildPipeLineSearch: function (oEvent) {
			var oSplitContainer = this.byId("idReleasePipelineContainer");
			oSplitContainer.setShowSecondaryContent(!oSplitContainer.getShowSecondaryContent());
		},
		_onObjectMatched: function (oEvent) {
			this.loadDatatoViewwithKey_GET("jobs", "AddBuilds",
				sap.ui.getCore().getModel("oKeyModel").getProperty("/saparate/key"));
		},
		onAddStageName: function (oEvent) {
			this._getDialog().open();
		},
		pressHeader: function (oEvent) {
			//	console.log("Hi");
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "scp.com.saparate.view.fragments.AddStage", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onCancel: function () {
			this._getDialog().close();
		},
		onAddStage: function () {
			var Stage = this.getView().byId("ip_Stage").getValue();

			var iPosition = this.byId("idReleasePipelineProcessFlow").getLanes().length;

			if (iPosition !== 0)
				iPosition = iPosition + 1;

			this.oProcessFlow.getModel("js").getProperty("/lanes").push({
				"id": iPosition,
				"icon": "sap-icon://it-host",
				"label": "In Order",
				text: Stage,
				"position": iPosition
			});

			this.oProcessFlow.getModel("js").refresh(true);
			this.oProcessFlow.updateModel();

			this._getDialog().close();

			// var oLaneHeader2 = new ProcessFlowLaneHeader({
			// 	iconSrc: "sap-icon://it-host",
			// 	text: "Quality",
			// 	position: 1,
			// 	press: this.pressHeader
			// });

			// this.byId("idReleasePipelineProcessFlow").addLane(oLaneHeader2);

		},
		onAddReleasePipenlineStage: function (oEvent) {

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.NewReleasePipeLine
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.NewReleasePipeLine
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.NewReleasePipeLine
		 */
		//	onExit: function() {
		//
		//	}

	});

});