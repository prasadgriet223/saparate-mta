sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/m/MessageToast", "sap/m/MessageBox",
	"scp/com/saparate/utils/formatter"
], function (BaseController, MessageToast, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.jobs", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.jobs
		 */
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("jobs").attachPatternMatched(this._onObjectMatched, this);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.jobs
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.jobs
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.jobs
		 */
		//	onExit: function() {
		//
		//	}
		_onObjectMatched: function (oEvent) {
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.loadDatatoViewwithKey_GET("jobs", "Jobs",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
				this.byId("idtblAllPipelines").setBusy(false);
				this.byId("idBreadcrum_buildpiplines").setCurrentLocationText("Build PipeLines");
			}
		},
		handleshowBuilddetails: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var selectedJobId = oEvent.getSource().getBindingContext("Jobs").getProperty("projectname");
			oRouter.navTo("jobdetails", {
				jobId: selectedJobId
			});

		},
		navigatetoCreatePipeline: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("NewPipeLine");
		},
		navigatetoDashboard: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Dashboard");
		},
		initiateTriggerJob: function (oEvent) {
			//	this.getView().setBusy(true);
			var selectedJobId = oEvent.getSource().getBindingContext("Jobs").getProperty("projectname");
			//	oEvent.getSource().getParent().getParent().getItems()[1].setBusy(true);
			oEvent.getSource().setBusy(true);

			var oButtonctrl = oEvent.getSource();
			var jobids = {
				"jobName": selectedJobId
			};

			var oModel_triggerJob = new sap.ui.model.json.JSONModel();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			oModel_triggerJob.loadData(this.getOwnerComponent().getModel("servers").getProperty("triggerjob"), JSON.stringify(jobids),
				true,
				"POST", false, false, sHeaders);
			oModel_triggerJob.attachRequestCompleted(function () {
				//	oButtonctrl.setText(selectedJobId + "  " + "Triggered");
				var oModel_Jobbuild = new sap.ui.model.json.JSONModel();
				oModel_Jobbuild.loadData(this.getApiCall("jobresults") + "?jobName=" + selectedJobId, null, true, "GET", null, false, sHeaders);
				oModel_Jobbuild.attachRequestCompleted(function () {
					var buildNumber = oModel_Jobbuild.getData()[0].number;
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oButtonctrl.setBusy(false);
					oRouter.navTo("buildStages", {
						jobId: selectedJobId,
						buildid: buildNumber
					});
				}.bind(this));
			}.bind(this));

			//	this._handleMessageBoxOpen("Are you sure you want to trigger Pipeline " + selectedJobId, selectedJobId, "confirm");
		},
		// _handleMessageBoxOpen: function (sMessage, sjobId, sMessageBoxType) {

		// 	MessageBox[sMessageBoxType](sMessage, {
		// 		actions: [MessageBox.Action.YES, MessageBox.Action.NO],
		// 		onClose: function (oAction) {
		// 			if (oAction === MessageBox.Action.YES) {

		// 			}
		// 			//if (oAction === MessageBox.Action.NO) {
		// 			this.getView().setBusy(false);
		// 			//	}

		// 		}.bind(this)
		// 	});
		// },
		_navigatetoBuilds: function (result, ijobId) {
			MessageBox.information(result, {
				actions: ["OK", MessageBox.Action.CLOSE],
				onClose: function (sAction) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Builds", {
						jobId: ijobId,
						from: "selectedjob"
					});
				}.bind(this)
			});
		},
		gotoBuilds: function (oEvent) {
			var selectedJobId = oEvent.getSource().getBindingContext("Jobs").getProperty("projectname");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Builds", {
				jobId: selectedJobId
			});

		},

		_handleMessageBoxOpen: function (sMessage, sjobId, sMessageBoxType) {
			var jobids = {
				"jobName": sjobId
			};
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {

						var oModel_triggerJob = new sap.ui.model.json.JSONModel();
						var sHeaders = {
							"Content-Type": "application/json",
							"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
						};
						oModel_triggerJob.loadData(this.getOwnerComponent().getModel("servers").getProperty("triggerjob"), JSON.stringify(jobids),
							true,
							"POST", false, false, sHeaders);

						oModel_triggerJob.attachRequestCompleted(function () {
							this._navigatetoBuilds(oModel_triggerJob.getData()["response"], sjobId);
						}.bind(this));
					}
					//if (oAction === MessageBox.Action.NO) {
					this.getView().setBusy(false);
					//	}

				}.bind(this)
			});
		},

		gotoDeleteJob: function (oEvent) {

			var selectedJobId = oEvent.getSource().getBindingContext("Jobs").getProperty("projectname");

			var oModel_deleteJob = new sap.ui.model.json.JSONModel();
			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};
			oModel_deleteJob.loadData(this.getOwnerComponent().getModel("servers").getProperty("DeleteJob") + "?jobName=" + selectedJobId, null,
				true,
				"GET", null, false, sHeaders);

			oModel_deleteJob.attachRequestCompleted(function () {
				this.byId("idtblAllPipelines").getBinding("items").refresh();
				var msg = 'Job Deleted Successfully';
				MessageToast.show(msg);
			}.bind(this));

			//	var oModel_deleteJob = new sap.ui.model.json.JSONModel();
			//	oModel_deleteJob.loadData(this.getOwnerComponent().getModel("servers").getProperty("DeleteJob") + "?jobName=" + selectedJobId);

			//	this.getView().getModel().refresh();

		},
		navigatetoBuilds: function (oEvent) {
			this.gotoBuilds(oEvent);
		}
	});
});
// function(Controller, MessageBox) {
//       "use strict";

//       return Controller.extend("myController", {
//         onPress: function() {
//           var sMessageText = "Message Text";
//           var icon, stitle, actions, id, sFinalText, bCompact;
//           MessageBox.show(sMessageText, {
//             icon: icon ? icon : MessageBox.Icon.NONE,
//             title: stitle ? stitle : "",
//             actions: actions ? actions : MessageBox.Action.CLOSE,
//             id: id ? id : "DefaultMessageBoxId",
//             details: sFinalText ? sFinalText : "Error",
//             styleClass: bCompact ? "sapUiSizeCompact" : "",
//             onClose: function(oAction) {
//               if (oAction === "CLOSE") {
//                 this.okFunction();
//               }
//             }.bind(this),
//           });
//         },

//         okFunction() {
//           alert("okFunction was executed")
//         }
//       });
//     }