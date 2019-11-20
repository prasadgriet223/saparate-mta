sap.ui.define([
	"scp/com/saparate/controller/BaseController", 'sap/suite/ui/commons/ProcessFlowLaneHeader', 'sap/m/Dialog', "sap/m/Button",
	'sap/m/ButtonType', 'sap/m/Input', 'sap/ui/layout/form/SimpleForm', 'sap/m/Label', "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, ProcessFlowLaneHeader, Dialog, Button, ButtonType, Input, SimpleForm, Label, Fragment, JSONModel, MessageBox) {
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
			this._oAddStageModel = new JSONModel();

		},
		openBuildPipeLineSearch: function (oEvent) {
			var oSplitContainer = this.byId("idReleasePipelineContainer");
			oSplitContainer.setShowSecondaryContent(!oSplitContainer.getShowSecondaryContent());
		},
		_onObjectMatched: function (oEvent) {

			this.loadDatatoViewwithKey_GET("jobs", "Jobs",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

			this.loadDatatoViewwithKey_GET("getcfc", "Environments",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

			this.loadDatatoViewwithKey_GET("credentials", "credentials",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));

			this.byId("idTabNewReleasePipeline").removeAllItems();
			this.byId("idTabNewReleasePipeline").removeAllContent();

			sap.ui.getCore().getModel("oModelSaveReleasePipeline").getData().releasePipelineBuildInput.buildPipelineJobName = "";
			sap.ui.getCore().getModel("oModelSaveReleasePipeline").getData().releasePipelineBuildInput.buildPipelineBuildID = "";
			sap.ui.getCore().getModel("oModelSaveReleasePipeline").getData().tasks = [];

		},
		onAddStageName: function (oEvent) {
			this._getDialog().open();
		},
		onRemoveStageName: function (oEvent) {

		},
		onLoadBuildNumbers: function (oEvent) {
			this.byId("idRbSelectBuild").setSelected(false);
		},
		onGetBuild: function (oEvent) {
			this.loadDatatoViewwithKey_GET_filter("jobresults", "?jobName=" + this.byId("idBuildSelect_ReleasePipeline").getSelectedItem().getText(),
				"Jobdetails",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
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
			this.byId("idTabNewReleasePipeline").addItem(new sap.m.IconTabFilter("", {
				text: Stage,
				key: Stage,
				icon: "sap-icon://it-host",
				iconColor: "Positive"
			}));
			this.byId("idTabNewReleasePipeline").addItem(
				new sap.m.IconTabSeparator({
					icon: "sap-icon://media-forward"
				})).addStyleClass("sapUiLargeMargin");
			var oView = this.getView();
			if (!this.byId("idPanelStagesConditions")) {
				Fragment.load({
					id: oView.getId(),
					name: "scp.com.saparate.view.fragments.StageConditions",
					controller: this
				}).then(function (oStageConditions) {
					oView.addDependent(oStageConditions);
					this.byId("idTabNewReleasePipeline").addContent(this.byId("idPanelStagesConditions"));
				}.bind(this));
			} else {
				this.byId("idTabNewReleasePipeline").addContent(this.byId("idPanelStagesConditions"));
			}

			this.byId("idPreConditionfilter").setEnabled(this.byId("idReqPrecondition").getSelected());
			this.byId("idDeployfilter").setEnabled(this.byId("idReqDeploy").getSelected());
			this.byId("idPostConditionfilter").setEnabled(this.byId("idReqPostCondition").getSelected());

			var oIcontab = this.byId("idTabNewReleasePipeline");
			oIcontab.setSelectedKey(Stage);
			this.onSaveJsontoCoreModel();
			this._getDialog().close();
		},
		handleIconTabBarSelect: function (oEvent) {
			var oSelectedKey = oEvent.getSource().getSelectedKey();
			this.byId("idPreConditionStageForm").setModel(this.getView().getModel(oSelectedKey));
			this.byId("idPreConditionStageForm").bindElement(oSelectedKey + ">/0");
			this.byId("idDeployStageForm").setModel(this.getView().getModel(oSelectedKey));
			this.byId("idDeployStageForm").bindElement({
				path: oSelectedKey + ">/1"
			});
			this.byId("idPostConditionStageForm").setModel(this.getView().getModel(oSelectedKey));
			this.byId("idPostConditionStageForm").bindElement({
				path: oSelectedKey + ">/2"
			});
		},
		onSaveJsontoCoreModel: function (oEvent) {
			var oSelectedKey = this.byId("idTabNewReleasePipeline").getSelectedKey();
			var oModel_Stage = new JSONModel([{
				"name": "preconditionfor"+oSelectedKey,
				"label": "PreCondition for " + oSelectedKey,
				"type": "humanTask",
				"taskCategory": "PRE_CONDITION",
				"categoryFor": oSelectedKey,
				"assignID": "",
				"assignedTo": "",
				"assignType": "USER",
				"waitUntil": "preConditionMsg",
				"stageName": oSelectedKey,
				"Message": ""
			}, {
				"name": oSelectedKey,
				"label": oSelectedKey,
				"jenkinsJobStatus": null,
				"cfCredentialsID": oSelectedKey,
				"waitForMessage": "",
				"type": "deployTask",
				"stageName": oSelectedKey
			}, {
				"name": "postconditionfor"+oSelectedKey,
				"label": "postcondition for " + oSelectedKey,
				"type": "humanTask",
				"taskCategory": "POST_CONDITION",
				"categoryFor": oSelectedKey,
				"assignID": "",
				"assignedTo": "",
				"assignType": "USER",
				"waitUntil": "postConditionMsg",
				"stageName": oSelectedKey,
				"Message": ""
			}]);
			this.getView().setModel(oModel_Stage, oSelectedKey);
			this.byId("idPreConditionStageForm").setModel(this.getView().getModel(oSelectedKey));
			this.byId("idPreConditionStageForm").bindElement(oSelectedKey + ">/0");
			this.byId("idDeployStageForm").setModel(this.getView().getModel(oSelectedKey));
			this.byId("idDeployStageForm").bindElement({
				path: oSelectedKey + ">/1"
			});
			this.byId("idPostConditionStageForm").setModel(this.getView().getModel(oSelectedKey));
			this.byId("idPostConditionStageForm").bindElement({
				path: oSelectedKey + ">/2"
			});

		},
		onSaveNewReleasePipeLineDialog: function (oEvent) {
			MessageBox.show("Are you sure you want to create a New ReleasePipeLine? ", {
				title: "Save NewRelease PipeLine",
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function (oActions) {
					if (oActions === "OK") {
						this.onSaveNewReleasePipeLine();
					}
				}.bind(this)
			});
		},
		onSaveNewReleasePipeLine: function () {

			this.getView().byId("idTabNewReleasePipeline").getItems().forEach(function (obj) {
				if (obj instanceof sap.m.IconTabFilter) {
					var arr = this.getView().getModel(obj.getKey()).getData();
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].assignID === "" && arr[i].assignedTo === "") {
							arr.splice(i, 1);
							i--;
						}
					}
					arr.forEach(function (arrObj) {
						sap.ui.getCore().getModel("oModelSaveReleasePipeline").getProperty("/tasks").push(arrObj);
					});

					sap.ui.getCore().getModel("oModelSaveReleasePipeline").getProperty("/releasePipelineBuildInput").buildPipelineJobName = this.byId(
						"idBuildSelect_ReleasePipeline").getSelectedItem().getText();
					sap.ui.getCore().getModel("oModelSaveReleasePipeline").getProperty("/").label = this.byId("idWorkFlowName").getValue();
				}
			}.bind(this));
			


			var ip_workflow = this.byId("idWorkFlowName").getValue();

			var sHeaders = {
				"Content-Type": "application/json",
				"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
			};

			var oModel_CreateReleasePipeLine = new sap.ui.model.json.JSONModel();
			oModel_CreateReleasePipeLine.loadData(this.getOwnerComponent().getModel("servers").getProperty("saveReleaseline") + "/" +
				ip_workflow, JSON.stringify(
					sap.ui.getCore().getModel('oModelSaveReleasePipeline').getData()), true,
				"POST", false, false, sHeaders);
				
							oModel_CreateReleasePipeLine.attachRequestCompleted(function () {
								
							MessageBox.show(("Release PipeLine "+oModel_CreateReleasePipeLine.getData().name +" Created"), {
								title: "Message",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oActions) {
									if (oActions === "OK") {
										var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
										oRouter.navTo("RLpipelines");
									}
								}.bind(this)
							});
						}.bind(this));
				
				
				
				

		//	console.log(sap.ui.getCore().getModel("oModelSaveReleasePipeline").getData());
		}

		//this._oAddStageModel.getData().getProperty("/")[Stage].push({"name":Stage});
		//console.log(this._oAddStageModel);

		// var jsonStr = '{Stage:[{"teamId":"1","status":"pending"}]}';

		// var oAddStage = JSON.parse(jsonStr);

		// var obj = JSON.parse(jsonStr);
		// obj['theTeam'].push({
		// 	"teamId": "4",
		// 	"status": "pending"
		// });
		// jsonStr = JSON.stringify(obj);

		// icon="sap-icon://begin"
		// 	iconColor="Positive"
		// 	design="Horizontal"
		// 	count="{/ProductCollectionStats/Counts/Weight/Ok} of {/ProductCollectionStats/Counts/Total}"
		// 	text="Confirm Ok"
		// 	key="Ok" />

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
		// sap.ui.getCore().getModel("oModelSaveReleasePipeline").getProperty("/tasks").push({
		// 		"name": "precondition for " + oSelectedKey,
		// 		"label": "Pre Condition for " + oSelectedKey,
		// 		"type": "humanTask",
		// 		"taskCategory": "PRE_CONDITION",
		// 		"Stage": oSelectedKey,
		// 		"categoryFor": oSelectedKey,
		// 		"assignID": this.byId("idPreConditionSelectUser").getValue(),
		// 		"assignedTo": this.byId("idPreConditionSelectUser").getValue(),
		// 		"assignType": "USER",
		// 		"waitUntil": "preConditionMsg"
		// 	}, {
		// 		"name": oSelectedKey,
		// 		"label": oSelectedKey,
		// 		"jenkinsJobStatus": null,
		// 		"cfCredentialsID": "334343e342sdfsdfsf2343",
		// 		"waitForMessage": "deployResponse",
		// 		"type": "deployTask"
		// 	}, {
		// 		"name": "postcondition for " + oSelectedKey,
		// 		"label": "postcondition for " + oSelectedKey,
		// 		"type": "humanTask",
		// 		"taskCategory": "POST_CONDITION",
		// 		"Stage": oSelectedKey,
		// 		"categoryFor": oSelectedKey,
		// 		"assignID": this.byId("idPostConditionSelectUser").getValue(),
		// 		"assignedTo": this.byId("idPostConditionSelectUser").getValue(),
		// 		"assignType": "USER",
		// 		"waitUntil": "postConditionMsg"
		// 	}

		// );
	});

});
//	var oModel = new sap.ui.model.json.JSONModel();
// oModel.setSizeLimit(10);
// oModel.setData({
// 	"lanes": []
// });
// this.oProcessFlow = this.getView().byId("idReleasePipelineProcessFlow");
// this.oProcessFlow.setModel(oModel, "js");

// var oLaneHeader2 = new ProcessFlowLaneHeader({
// 	iconSrc: "sap-icon://it-host",
// 	text: "Quality",
// 	position: 1,
// 	press: this.pressHeader
// });

// this.byId("idReleasePipelineProcessFlow").addLane(oLaneHeader2);

// var iPosition = this.byId("idReleasePipelineProcessFlow").getLanes().length;

// if (iPosition !== 0)
// 	iPosition = iPosition + 1;

// this.oProcessFlow.getModel("js").getProperty("/lanes").push({
// 	"id": iPosition,
// 	"icon": "sap-icon://it-host",
// 	"label": Stage,
// 	text: Stage,
// 	"position": iPosition
// });

// this.oProcessFlow.getModel("js").refresh(true);
// this.oProcessFlow.updateModel();