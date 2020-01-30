sap.ui.define([
	"scp/com/saparate/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"scp/com/saparate/utils/formatter"
], function (BaseController, Fragment, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("scp.com.saparate.controller.NewPipeLine", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		onInit: function () {
			this._wizard = this.byId("CreatePipeLine");
			this._oNavContainer = this.byId("idNewPipeLineNavContainer");
			this._oWizardContentPage = this.byId("idNewPipeline");
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("NewPipeLine").attachPatternMatched(this._onObjectMatched, this);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		onBeforeRendering: function () {

		},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		// onAfterRendering: function() {

		// },
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		onExit: function () {

		},
		navigatetoProjectPipeline: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Projects");
		},
		selectRepoType: function (oEvent) {
			if (this.byId("ip_JobName").getValue().length > 0) {
				this._wizard.validateStep(this.byId("Authstep"));
			}
			this._wizard.discardProgress(this.byId("Authstep"));
			this._wizard.discardProgress(this.byId("idReposStep"));
			this._wizard.discardProgress(this.byId("branchesStep"));

		},
		_onObjectMatched: function (oEvent) {
			var skey = sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken;
			if (typeof skey === "undefined" || skey === "" || skey === null) {
				this.getRouter().navTo("Authorize");
			} else {
				this.byId("ip_JobName").setValue("");
				this.getView().setModel(this.getOwnerComponent().getModel("repoType"), "RepoType");
				this.getView().setModel(this.getOwnerComponent().getModel("schedule"), "schedule");
				this._oNavContainer.to(this._oWizardContentPage);
				this.loadDatatoViewwithKey_GET("credentials", "credentials",
					sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"));
				this.byId("idCredSelect").setSelectedKey("");
				this._wizard.discardProgress(this.byId("Authstep"));
				this._wizard.discardProgress(this.byId("idReposStep"));
				this._wizard.discardProgress(this.byId("branchesStep"));
				this._wizard.invalidateStep(this.byId("Authstep"));
			}
		},
		selectRepo: function (oEvent) {
			if (this.byId("idReposStep").getValidated())
				this._wizard.discardProgress(this.byId("idReposStep"));
			else
				this._wizard.validateStep(this.byId("idReposStep"));
		},
		loadRepos: function (oEvent) {
			if (this.byId("RepoTypeStep").getValidated())
				this._wizard.discardProgress(this.byId("RepoTypeStep"));
			else
				this._wizard.validateStep(this.byId("RepoTypeStep"));
		},
		selectBranch: function (oEvent) {
			if (this.byId("idbranchesStep").getValidated())
				this._wizard.discardProgress(this.byId("idbranchesStep"));
			else
				this._wizard.validateStep(this.byId("idbranchesStep"));
		},
		selectBuilder: function (oEvent) {
			if (this.byId("idBuildStep").getValidated())
				this._wizard.discardProgress(this.byId("idBuildStep"));
			else
				this._wizard.validateStep(this.byId("idBuildStep"));
		},
		selectScheduler: function (oEvent) {
			var sSchedulerkey = this.getView().byId("idSchedulinglist").getSelectedItem().data("schedulekey");
			if (sSchedulerkey === "schedule") {
				this.getView().byId("idfrmSchedule").setVisible(true);
			} else {
				this.getView().byId("idfrmSchedule").setVisible(false);
			}
			if (sSchedulerkey === "webhook") {
				this.getView().byId("idfrmWebHook").setVisible(true);
			} else {
				this.getView().byId("idfrmWebHook").setVisible(false);
			}

		},
		afterloadRepoType: function (oEvent) {
			this.getView().byId("idRepoTypeList").removeSelections(true);
		},
		afterloadReposStep: function (oEvent) {
			var oModel_repos = new sap.ui.model.json.JSONModel();
			var credentials = {
				"credentialId": this.getView().byId("idCredSelect").getSelectedKey(),
				"repoType": this.getView().byId("idRepoTypeList").getSelectedItem().data("repokey")
			};

			var oCtrl = this.byId("idReposList");
			oCtrl.setBusy(true);

			this.loadDatatoViewwithKey_POST_2("repos", credentials, "Repos",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"), oCtrl);

			//this.getView().setModel(oModel_repos, "Repos");
		},
		NewPipeLineReviewHandler: function (oEvent) {
			if (this.getView().byId("idSchedulinglist").getSelectedItem().data("schedulekey") === "schedule" && this.getView().byId(
					"idScheduler").getValue() === "") {
				sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("ScheduleTime"));
			} else {
				if (this.oNewPipeLinereviewPageFragment) {
					this._oNavContainer.to(this.oNewPipeLinereviewPageFragment);
				} else {
					this.oNewPipeLinereviewPageFragment = sap.ui.xmlfragment(this.getView().getId(),
						"scp.com.saparate.view.fragments.NewPipeLineReviewPage", this);
					this.getView().addDependent(this.oNewPipeLinereviewPageFragment);
					this._oNavContainer.addPage(this.oNewPipeLinereviewPageFragment);
					this._oNavContainer.to(this.oNewPipeLinereviewPageFragment);
				}
				this.getView().byId("idNewPipeLineCredentials").setText(this.getView().byId("idCredSelect").getSelectedItem().getText());
				this.getView().byId("idNewPipeLineRepoType").setText(this.getView().byId("idRepoTypeList").getSelectedItem().data("repokey"));
				this.getView().byId("idNewPipeLineRepository").setText(this.getView().byId("idReposList").getSelectedItem().data("repohttps"));
				this.getView().byId("idNewPipeLineBranch").setText(this.getView().byId("idBranchList").getSelectedItem().data("branchkey"));
				this.getView().byId("idNewPipeLineBuildType").setText(this.getView().byId("idBuildSelect").getSelectedItem().getText());
				var sSchedulerkey = this.getView().byId("idSchedulinglist").getSelectedItem().data("schedulekey");
				var time = this.getView().byId("idScheduler").getValue().toString();

				if (sSchedulerkey === "schedule") {
					this.getView().byId("idNewPipeLineSchedulingType").setText(this.getView().byId("idSchedulinglist").getSelectedItem().data(
						"schedulekey") + "  " + "Scheduled at " + time);

				}
				if (sSchedulerkey === "webhook") {
					var txtHook = this.getView().byId("txtwebhookURL").getText();
					this.getView().byId("idNewPipeLineSchedulingType").setText(this.getView().byId("idSchedulinglist").getSelectedItem().data(
						"schedulekey") + "---web hook with URL  " + txtHook);
				}
				if (sSchedulerkey === "Normal") {
					this.getView().byId("idNewPipeLineSchedulingType").setText(this.getView().byId("idSchedulinglist").getSelectedItem().data(
						"schedulekey"));
				}

			}
		},
		afterLoadBranchesStep: function (oEvent) {
			var oCtrl = this.byId("idBranchList");
			oCtrl.setBusy(true);
			var oinput = {
				"credentialId": this.getView().byId("idCredSelect").getSelectedKey(),
				"url": this.getView().byId("idReposList").getSelectedItem().data("repohttps")
			};
			this.loadDatatoViewwithKey_POST_2("branches", oinput, "branch",
				sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key"), oCtrl);

		},
		handleCreateNewPipeLineSubmit: function (oEvent) {
			this._handleMessageBoxOpen("Are you sure you want to create a new Build Pipeline?", "confirm");

		},
		handleCreateNewPipeLineCancel: function () {
			this._handleMessageBoxOpenforcancel("Are you sure you want to cancel the creation of your new Build Pipeline?", "warning");
		},

		additionalInfoValidation: function () {
			var jobName = this.byId("ip_JobName").getValue();
			var Credential = this.byId("idCredSelect").getSelectedKey();
			var regex = /^[A-Za-z0-9]+$/;
			if (!jobName.match(regex)) {
				this.byId("ip_JobName").setValue("");
			}
			if (jobName.length > 5 && Credential.length > 0) {
				this._wizard.validateStep(this.byId("Authstep"));
			} else {
				this._wizard.invalidateStep(this.byId("Authstep"));
				this._wizard.discardProgress(this.byId("Authstep"));
				this._wizard.discardProgress(this.byId("idReposStep"));
				this._wizard.discardProgress(this.byId("branchesStep"));
			}
		},
		_handleMessageBoxOpenforcancel: function (sMessage, sMessageBoxType) {
			var that = this;
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						that._oRouter.navTo("jobs", {
							from: "tonewpipeline"
						});
					}
				}
			});
		},
		_handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {

						this.getView().setBusy(true);

						var oNewPipeLineInput = {
							"jobName": this.byId("ip_JobName").getValue(),
							"jobType": "build",
							"piperPipeline": {
								"stages": [{
										"name": "prepare",
										"statementList": [{
											"type": "scm",
											"branchName": "*/" + this.getView().byId("idBranchList").getSelectedItem().data("branchkey"),
											"credsID": this.getView().byId("idCredSelect").getSelectedItem().data("credkey"),
											"scmURL": this.getView().byId("idReposList").getSelectedItem().data("repohttps")
										}]
									}, {
										"name": "prepareConfigYaml",
										"statementList": [{
											"type": "gst",
											"statment": "writeFile file:\".pipeline/config.yaml\", text: \"${params.configyaml}\""
										}]
									}, {
										"name": "prepareBuild",
										"statementList": [{
											"type": "gst",
											"statment": "setupCommonPipelineEnvironment script:this"
										}]
									}, {
										"name": "Build",
										"statementList": [{
											"type": "gst",
											"statment": "mtaBuild script: this"
										}]
									}

								]
							},
							"clodfoundryId": "1",

						};
						var sSchedulerkey = this.getView().byId("idSchedulinglist").getSelectedItem().data("schedulekey");

						if (sSchedulerkey === "schedule") {
							oNewPipeLineInput.scheduling = {
								"schedulingType": "scheduling",
								"hour": parseInt(this.getView().byId("idScheduler").getValue().toString().split(":")[0]),
								"minute": parseInt(this.getView().byId("idScheduler").getValue().toString().split(":")[1])
							};
						}
						if (sSchedulerkey === "webhook") {
							oNewPipeLineInput.scheduling = {
								"schedulingType": "webhook",
								"hour": "",
								"minute": ""
							};
						}
						if (sSchedulerkey === "Normal") {
							this.getView().byId("idNewPipeLineSchedulingType").setText(this.getView().byId("idSchedulinglist").getSelectedItem().data(
								"schedulekey"));
						}

						var sHeaders = {
							"Content-Type": "application/json",
							"Authorization": sap.ui.getCore().getModel('oKeyModel').getProperty("/saparate/key").authorizationToken
						};
						var oModel_CreatePipeLine = new sap.ui.model.json.JSONModel();
						oModel_CreatePipeLine.loadData(this.getApiCall("addjob"), JSON.stringify(
								oNewPipeLineInput), true,
							"POST", false, false, sHeaders);
						oModel_CreatePipeLine.attachRequestCompleted(function () {
							this.getView().setBusy(false);
							MessageBox.show((oModel_CreatePipeLine.getData().response), {
								title: "Result",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oActions) {
									if (oActions === "OK") {
										var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
										oRouter.navTo("jobs", {
											from: "tonewpipeline"
										});
									}
								}.bind(this)
							});
						}.bind(this));
					}
				}.bind(this)
			});
		},
		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValue("");
		},
		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
		}
	});

});